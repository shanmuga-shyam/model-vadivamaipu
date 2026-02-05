"""Quick server-side test runner for model evaluation.

Run from the `server` directory:

    python scripts/test_run_models.py

It will locate a CSV in an `uploads` folder, pick a target column heuristically,
and call `run_models_parallel` to print the evaluation JSON.
"""
import os
import sys
import json
from pathlib import Path

try:
    from ml_engine.model_runner import run_models_parallel
except Exception:
    # If running from repository root, try adjusting sys.path
    repo_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(repo_root / "server"))
    from ml_engine.model_runner import run_models_parallel

import pandas as pd


def find_sample_csv():
    cwd = Path.cwd()
    # Common upload paths
    candidates = [cwd / "uploads", cwd / "server" / "uploads", cwd / "data", cwd]
    for base in candidates:
        if base.exists() and base.is_dir():
            for f in base.iterdir():
                if f.suffix.lower() in (".csv", ".tsv"):
                    return f
    # fallback: search recursively for first csv under cwd
    for f in cwd.rglob("*.csv"):
        return f
    return None


def choose_target_column(df: pd.DataFrame):
    # Prefer common names
    prefer = ["target", "label", "salary", "y", "class"]
    for p in prefer:
        if p in df.columns:
            return p
    # Otherwise pick last column
    return df.columns[-1]


def main():
    sample = find_sample_csv()
    if not sample:
        print(json.dumps({"error": "No CSV found in uploads or repository."}, indent=2))
        sys.exit(1)

    print(f"Using sample file: {sample}")
    df = pd.read_csv(sample)
    target = choose_target_column(df)
    print(f"Using target column: {target}")

    try:
        result = run_models_parallel(str(sample), target)
        print(json.dumps(result, indent=2, default=str))
    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()
