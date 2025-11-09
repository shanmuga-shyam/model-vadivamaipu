from fastapi import APIRouter
from datetime import datetime

router = APIRouter()
EVAL_HISTORY = []  # temporary in-memory storage

@router.get("/latest")
def get_latest_result():
    return EVAL_HISTORY[-1] if EVAL_HISTORY else {"message": "No analyses yet"}

@router.get("/history")
def get_history():
    return {"total_runs": len(EVAL_HISTORY), "history": EVAL_HISTORY}

@router.post("/save")
def save_result(result: dict):
    result["timestamp"] = datetime.now().isoformat()
    EVAL_HISTORY.append(result)
    return {"status": "success", "message": "Result saved to history"}
