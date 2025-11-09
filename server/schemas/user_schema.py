from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True



class Token(BaseModel):
    access_token: str
    token_type: str
