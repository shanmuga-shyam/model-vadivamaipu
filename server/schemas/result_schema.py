from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class ResultBase(BaseModel):
    dataset_id: int
    model_type: str

class ResultCreate(ResultBase):
    metrics: Dict[str, Any]
    predictions: Dict[str, Any]

class Result(ResultBase):
    id: int
    user_id: int
    metrics: Dict[str, Any]
    predictions: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True