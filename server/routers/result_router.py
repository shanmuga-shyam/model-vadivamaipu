from fastapi import APIRouter, Header
from datetime import datetime
from typing import Optional
from core.security import decode_token

router = APIRouter()
# temporary in-memory storage; in production use persistent DB
EVAL_HISTORY = []


@router.get("/latest")
def get_latest_result(authorization: Optional[str] = Header(None)):
    # If a user token is provided, return that user's latest result
    user_email = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        user_email = decode_token(token)

    if user_email:
        user_items = [r for r in EVAL_HISTORY if r.get("user") == user_email]
        return user_items[-1] if user_items else {"message": "No analyses yet"}

    return EVAL_HISTORY[-1] if EVAL_HISTORY else {"message": "No analyses yet"}


@router.get("/history")
def get_history(authorization: Optional[str] = Header(None)):
    user_email = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        user_email = decode_token(token)

    if user_email:
        user_items = [r for r in EVAL_HISTORY if r.get("user") == user_email]
        return {"total_runs": len(user_items), "history": user_items}

    # fallback: return all history
    return {"total_runs": len(EVAL_HISTORY), "history": EVAL_HISTORY}


@router.post("/save")
def save_result(result: dict, authorization: Optional[str] = Header(None)):
    # Attach timestamp and (if available) the user email from token
    result["timestamp"] = datetime.now().isoformat()
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        user_email = decode_token(token)
        if user_email:
            result["user"] = user_email

    EVAL_HISTORY.append(result)
    return {"status": "success", "message": "Result saved to history"}
