from fastapi import APIRouter, Header, Depends, HTTPException
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from core.security import decode_token
from core.database import get_db
from models.data_models import AnalysisHistory, Dataset
from models.user_model import User

router = APIRouter()


@router.get("/latest")
def get_latest_result(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    user_email = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        user_email = decode_token(token)

    if user_email:
        user = db.query(User).filter_by(email=user_email).first()
        if not user:
            return {"message": "No analyses yet"}
        item = (
            db.query(AnalysisHistory)
            .filter_by(user_id=user.id)
            .order_by(AnalysisHistory.created_at.desc())
            .first()
        )
        return item.payload if item else {"message": "No analyses yet"}

    item = db.query(AnalysisHistory).order_by(AnalysisHistory.created_at.desc()).first()
    return item.payload if item else {"message": "No analyses yet"}


@router.get("/history")
def get_history(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    user_email = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        user_email = decode_token(token)

    if user_email:
        user = db.query(User).filter_by(email=user_email).first()
        if not user:
            return {"total_runs": 0, "history": []}
        items = (
            db.query(AnalysisHistory)
            .filter_by(user_id=user.id)
            .order_by(AnalysisHistory.created_at.desc())
            .all()
        )
        return {"total_runs": len(items), "history": [i.payload for i in items]}

    items = db.query(AnalysisHistory).order_by(AnalysisHistory.created_at.desc()).all()
    return {"total_runs": len(items), "history": [i.payload for i in items]}


@router.post("/save")
def save_result(result: dict, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    # Attach timestamp
    result["timestamp"] = datetime.now().isoformat()

    user_email = None
    user = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        user_email = decode_token(token)
        if user_email:
            user = db.query(User).filter_by(email=user_email).first()
            if user:
                result["user"] = user_email

    # If a filename is provided, try to associate with a Dataset
    dataset_obj = None
    filename = result.get("file")
    if filename and user:
        dataset_obj = db.query(Dataset).filter_by(user_id=user.id, filename=filename).first()
        if not dataset_obj:
            dataset_obj = Dataset(user_id=user.id, filename=filename, file_path="")
            db.add(dataset_obj)
            db.flush()

    # Persist the full payload to AnalysisHistory (including any image memory present)
    try:
        history = AnalysisHistory(user_id=(user.id if user else None), dataset_id=(dataset_obj.id if dataset_obj else None), payload=result)
        db.add(history)
        db.commit()
        db.refresh(history)
        return {"status": "success", "message": "Result saved to history"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save history: {e}")
