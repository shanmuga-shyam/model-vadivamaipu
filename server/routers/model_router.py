from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException
from sqlalchemy.orm import Session
import os, shutil
from datetime import datetime
from core.database import get_db
from ml_engine.model_runner import run_models_parallel
from models.data_models import Dataset, ModelResult
from models.user_model import User
from routers.auth_router import get_current_user
import pandas as pd
from pathlib import Path

router = APIRouter()
UPLOAD_DIR = "server/uploads"

@router.post("/evaluate")
async def evaluate_models(
    file: UploadFile,
    target_col: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload → Evaluate → Store results."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save dataset in DB
    dataset = Dataset(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    # Run model evaluations (validate target column errors)
    try:
        result = run_models_parallel(file_path, target_col)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Save each model's result to DB
    for r in result["results"]:
        db_result = ModelResult(
            user_id=current_user.id,
            dataset_id=dataset.id,
            model_name=r["model"],
            r2_score=r.get("r2_test") or r.get("r2_train") or 0.0,
            mse=r.get("mse") or 0.0,
            created_at=datetime.utcnow()
        )
        db.add(db_result)
    db.commit()

    return {
        "status": "success",
        "message": "Model evaluation complete ✅",
        "dataset_id": dataset.id,
        "data": result
    }


@router.get("/run_test")
def run_models_test():
    """Unauthenticated helper endpoint used for quick server-side testing.
    It will look for a CSV in common upload locations, pick a target column,
    run `run_models_parallel`, and return the evaluation JSON.
    """
    # Locate a sample CSV (mirrors scripts/test_run_models.py)
    cwd = Path.cwd()
    candidates = [cwd / "uploads", cwd / "server" / "uploads", cwd / "data", cwd]
    sample = None
    for base in candidates:
        if base.exists() and base.is_dir():
            for f in base.iterdir():
                if f.suffix.lower() in (".csv", ".tsv"):
                    sample = f
                    break
        if sample:
            break
    if not sample:
        # fallback: search recursively
        for f in cwd.rglob("*.csv"):
            sample = f
            break

    if not sample:
        raise HTTPException(status_code=404, detail="No CSV found in uploads or repository for test")

    try:
        df = pd.read_csv(sample)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read CSV: {e}")

    # choose target column heuristically
    prefer = ["target", "label", "salary", "y", "class"]
    target = None
    for p in prefer:
        if p in df.columns:
            target = p
            break
    if not target:
        target = df.columns[-1]

    try:
        result = run_models_parallel(str(sample), target)
        return {"status": "success", "file": str(sample), "target": target, "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
