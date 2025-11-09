from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel

router = APIRouter()

# Mock database
users = {}

class User(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(email: str = Form(...), password: str = Form(...)):
    if email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[email] = {"email": email, "password": password}
    return {"status": "success", "message": "User registered successfully ✅"}

@router.post("/login")
def login(email: str = Form(...), password: str = Form(...)):
    user = users.get(email)
    if not user or user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"status": "success", "message": "Login successful", "user": email}

@router.post("/logout")
def logout():
    return {"status": "success", "message": "User logged out"}
