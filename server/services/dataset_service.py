from sqlalchemy.orm import Session
import os
from fastapi import UploadFile
from models.dataset_model import Dataset
from schemas.dataset_schema import DatasetCreate

async def create_dataset(db: Session, name: str, description: str, file: UploadFile):
    # Save file
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    
    # Create dataset record
    db_dataset = Dataset(
        name=name,
        description=description,
        file_path=file_location
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def get_dataset(db: Session, dataset_id: int):
    return db.query(Dataset).filter(Dataset.id == dataset_id).first()

def get_datasets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Dataset).offset(skip).limit(limit).all()

def update_dataset(db: Session, dataset_id: int, dataset: DatasetCreate):
    db_dataset = get_dataset(db, dataset_id)
    if not db_dataset:
        return None
    
    for field, value in dataset.dict().items():
        setattr(db_dataset, field, value)
    
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def delete_dataset(db: Session, dataset_id: int):
    db_dataset = get_dataset(db, dataset_id)
    if db_dataset:
        # Delete file
        if os.path.exists(db_dataset.file_path):
            os.remove(db_dataset.file_path)
        # Delete record
        db.delete(db_dataset)
        db.commit()
    return db_dataset