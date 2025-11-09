import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from typing import Tuple, Dict, Any

def load_dataset(file_path: str) -> pd.DataFrame:
    """Load and perform initial preprocessing on the dataset."""
    df = pd.read_csv(file_path)
    return df

def preprocess_data(df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
    """Preprocess data for model training."""
    # Basic preprocessing steps
    numeric_features = df.select_dtypes(include=[np.number]).columns
    categorical_features = df.select_dtypes(include=['object']).columns
    
    # Handle numeric features
    scaler = StandardScaler()
    X_numeric = scaler.fit_transform(df[numeric_features])
    
    # Handle categorical features
    encoders = {}
    X_categorical = np.zeros((len(df), 0))
    for feature in categorical_features:
        le = LabelEncoder()
        encoded = le.fit_transform(df[feature])
        X_categorical = np.column_stack((X_categorical, encoded))
        encoders[feature] = le
    
    # Combine features
    X = np.column_stack((X_numeric, X_categorical))
    
    preprocessing_info = {
        'scaler': scaler,
        'encoders': encoders,
        'numeric_features': numeric_features.tolist(),
        'categorical_features': categorical_features.tolist()
    }
    
    return X, preprocessing_info