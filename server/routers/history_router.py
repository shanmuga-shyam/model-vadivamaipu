from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from routers.auth_router import get_current_user
from models.data_models import Dataset, ModelResult

router = APIRouter()

@router.get("/history")
def get_user_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Fetch all datasets & model results for logged-in user."""
    datasets = db.query(Dataset).filter_by(user_id=current_user["id"]).all()
    history = []

    for ds in datasets:
        results = db.query(ModelResult).filter_by(dataset_id=ds.id).all()
        history.append({
            "dataset": {
                "id": ds.id,
                "filename": ds.filename,
                "uploaded_at": ds.uploaded_at
            },
            "results": [
                {
                    "model": r.model_name,
                    "r2_score": r.r2_score,
                    "mse": r.mse,
                    "created_at": r.created_at
                } for r in results
            ]
        })

    return {
        "status": "success",
        "history": history
    }
