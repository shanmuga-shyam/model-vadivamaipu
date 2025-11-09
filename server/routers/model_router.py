# server/routers/model_router.py
from fastapi import APIRouter, UploadFile, Form
import os, shutil
from ml_engine.model_runner import run_models_parallel

router = APIRouter()
UPLOAD_DIR = "server/uploads"

@router.post("/evaluate")
async def evaluate_models(file: UploadFile, target_col: str = Form(...)):
    """
    Upload dataset → Dynamically sample rows (via Gemini) → Evaluate models in parallel.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded dataset
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run model evaluation (Gemini decides sample size internally)
    result = run_models_parallel(file_path, target_col)

    return {
        "status": "success",
        "message": "Model evaluation complete ✅",
        "data": result
    }
