# server/ml_engine/data_handler.py
import pandas as pd
import numpy as np
import json
import os
import requests  # to call Gemini API

# You can store your Gemini API key in .env or environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")

def ask_gemini_for_sample_size(row_count: int, column_count: int) -> int:
    """
    Uses Gemini API to determine how many samples to take from the dataset
    based on its size and complexity.
    """
    prompt = f"""
    You are an AI data strategist. 
    A dataset has {row_count} rows and {column_count} columns.
    Suggest an optimal number of rows to sample for a quick model performance preview
    (not full training). 
    Rules:
    - If rows < 1000: return {row_count} (use all)
    - If rows between 1000–10,000: return a small representative sample (maybe 200–500)
    - If rows > 10,000: return a manageable subset (around 1% of rows)
    Respond with only a number (integer, no text).
    """

    headers = {"Authorization": f"Bearer {GEMINI_API_KEY}"}
    data = {"contents": [{"role": "user", "parts": [{"text": prompt}]}]}
    response = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        headers=headers,
        json=data
    )
    
    if response.status_code != 200:
        print("Gemini API Error:", response.text)
        return 100  # fallback default
    
    try:
        gemini_text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        suggested_rows = int("".join([c for c in gemini_text if c.isdigit()]))
        return max(25, suggested_rows)
    except Exception as e:
        print("Gemini parsing error:", e)
        return 100


def load_random_dataset(file_path: str):
    """
    Load dataset and dynamically decide sampling based on its size.
    Uses Gemini API to calculate ideal sample size if > 1000 rows.
    """
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    elif file_path.endswith(".xlsx"):
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format. Upload CSV or XLSX only.")

    total_rows, total_cols = df.shape
    print(f"Dataset size: {total_rows} rows x {total_cols} columns")

    # If dataset is small (<1000), use all
    if total_rows <= 1000:
        print("Using full dataset (less than 1000 rows)")
        return df.fillna(0)
    
    # Ask Gemini to decide sampling size
    sample_size = ask_gemini_for_sample_size(total_rows, total_cols)
    sample_size = min(sample_size, total_rows)  # cap at total length

    print(f"Sampling {sample_size} rows (suggested by Gemini)")
    df = df.sample(n=sample_size, random_state=np.random.randint(total_rows))
    df = df.fillna(0)

    return df
