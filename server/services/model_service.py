from sqlalchemy.orm import Session
from models.result_model import Result
from schemas.result_schema import ResultCreate

def create_result(db: Session, result: ResultCreate):
    db_result = Result(**result.dict())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_result(db: Session, result_id: int):
    return db.query(Result).filter(Result.id == result_id).first()

def get_results(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Result).offset(skip).limit(limit).all()

def get_results_by_dataset(db: Session, dataset_id: int):
    return db.query(Result).filter(Result.dataset_id == dataset_id).all()