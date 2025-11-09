from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.user_schema import User, UserCreate, UserUpdate
from services.user_service import create_user, get_user, get_users, update_user, delete_user

router = APIRouter()

@router.post("/", response_model=User)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@router.get("/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.put("/{user_id}", response_model=User)
def update_user_info(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    return update_user(db, user_id, user)

@router.delete("/{user_id}")
def delete_user_account(user_id: int, db: Session = Depends(get_db)):
    delete_user(db, user_id)
    return {"message": "User deleted successfully"}