from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from core.database import Base

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    model_type = Column(String)
    metrics = Column(JSON)
    predictions = Column(JSON)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())