from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
import os, shutil
from datetime import datetime
from core.database import get_db
from models.data_models import Dataset
from models.user_model import User
from routers.auth_router import get_current_user
import io
import pandas as pd

router = APIRouter()
UPLOAD_DIR = "server/uploads"

@router.post("/datasets/upload")
async def upload_dataset(
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Uploads a dataset file, stores it in /uploads, 
    and creates a record in PostgreSQL (datasets table).
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    dataset = Dataset(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        uploaded_at=datetime.utcnow()
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return {
        "status": "success",
        "dataset_id": dataset.id,
        "message": f"Dataset '{file.filename}' uploaded successfully ✅"
    }


@router.post("/datasets/preview_columns")
async def preview_dataset_columns(file: UploadFile):
    """Return columns, dtypes, and a small preview for an uploaded CSV file.

    Useful for frontend column selection before running evaluations.
    """
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")

    return {
        "columns": list(df.columns),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "preview": df.head(5).to_dict(orient="records")
    }
