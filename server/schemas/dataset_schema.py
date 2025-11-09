from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None

class DatasetCreate(DatasetBase):
    pass

class DatasetUpdate(DatasetBase):
    name: Optional[str] = None

class Dataset(DatasetBase):
    id: int
    file_path: str
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True