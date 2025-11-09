from fastapi import APIRouter, HTTPException
import importlib
import os

router = APIRouter()

@router.post("/explain")
async def explain_results(data: dict):
    """
    Takes model evaluation JSON and returns an AI-written summary.
    """
    try:
        genai = importlib.import_module("google.generativeai")
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="google.generativeai is not installed; install the 'google-generative-ai' package."
        )

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""
    You are an AI assistant for an ML evaluation platform.
    Analyze these model results and write a human-readable summary with:
    - The best performing model
    - Comparison of R², MSE, MAE
    - Recommendations for the user
    Data: {data}
    """

    response = model.generate_content(prompt)
    return {"summary": response.text}
