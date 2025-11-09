import concurrent.futures
import pandas as pd
import numpy as np
import math
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import (
    r2_score,
    mean_squared_error,
    mean_absolute_error,
)

from ml_engine.data_handler import load_random_dataset


def safe_float(value):
    """Ensure JSON-safe numbers."""
    if value is None or isinstance(value, str):
        return None
    if math.isnan(value) or math.isinf(value):
        return None
    return round(float(value), 5)


def evaluate_model(name, model, X_train, X_test, y_train, y_test):
    """Train and evaluate a single regression model with multiple metrics."""
    result = {"model": name}
    try:
        # Fallback to KFold for very small datasets
        if len(X_train) < 10:
            kf = KFold(n_splits=min(3, len(X_train)), shuffle=True, random_state=42)
            cv_scores = cross_val_score(model, X_train, y_train, cv=kf, scoring="r2")
            result["r2_cv_mean"] = safe_float(np.mean(cv_scores))

        # Train
        model.fit(X_train, y_train)

        # Predict
        preds = model.predict(X_test)
        preds_train = model.predict(X_train)

        # Metrics
        r2_test = r2_score(y_test, preds) if len(y_test) > 1 else None
        r2_train = r2_score(y_train, preds_train)
        mse = mean_squared_error(y_test, preds)
        mae = mean_absolute_error(y_test, preds)
        rmse = math.sqrt(mse)
        mape = np.mean(np.abs((y_test - preds) / y_test)) * 100 if np.all(y_test != 0) else None

        result.update({
            "r2_train": safe_float(r2_train),
            "r2_test": safe_float(r2_test),
            "mse": safe_float(mse),
            "mae": safe_float(mae),
            "rmse": safe_float(rmse),
            "mape": safe_float(mape)
        })

        if r2_test is None:
            result["warning"] = "Dataset too small for reliable R² score"

        return result

    except Exception as e:
        result["error"] = str(e)
        return result


def run_models_parallel(file_path: str, target_col: str):
    """Load dataset sample and evaluate multiple models in parallel threads."""
    df = load_random_dataset(file_path)

    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found. Columns: {list(df.columns)}")

    X = df.drop(columns=[target_col])
    y = df[target_col]

    if not pd.api.types.is_numeric_dtype(y):
        raise ValueError(f"Target column '{target_col}' must be numeric for regression.")

    # Dynamic split for small datasets
    test_size = 0.2
    if len(X) < 10:
        test_size = 0.4 if len(X) > 5 else 0.5

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    models = {
        "Linear Regression": LinearRegression(),
        "Support Vector Machine": SVR(kernel="linear"),
        "Decision Tree": DecisionTreeRegressor(random_state=42),
        "Random Forest": RandomForestRegressor(random_state=42)
    }

    results = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(evaluate_model, name, model, X_train, X_test, y_train, y_test)
            for name, model in models.items()
        ]
        results.extend(f.result() for f in concurrent.futures.as_completed(futures))# idhu tha multi thread ku use pandro
    # Sort by test R² safely
    results = sorted(
        results,
        key=lambda x: (x.get("r2_test") is not None, x.get("r2_test") or 0),
        reverse=True
    )

    return {
        "rows_used": len(df),
        "columns": list(df.columns),
        "results": results
    }
