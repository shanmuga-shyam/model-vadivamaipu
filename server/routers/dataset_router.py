from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.dataset_schema import Dataset, DatasetCreate, DatasetUpdate
from services.dataset_service import create_dataset, get_dataset, get_datasets, update_dataset, delete_dataset

router = APIRouter()

@router.post("/", response_model=Dataset)
async def upload_dataset(
    name: str,
    description: str = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return await create_dataset(db, name, description, file)

@router.get("/{dataset_id}", response_model=Dataset)
def read_dataset(dataset_id: int, db: Session = Depends(get_db)):
    db_dataset = get_dataset(db, dataset_id)
    if db_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return db_dataset

@router.get("/", response_model=List[Dataset])
def read_datasets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    datasets = get_datasets(db, skip=skip, limit=limit)
    return datasets