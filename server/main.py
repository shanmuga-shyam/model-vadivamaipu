# server/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import model_router

# create the app
app = FastAPI(
    title="Model-Vadivamaipu",
    description="AI-powered model evaluation backend",
    version="1.0.0"
)

# allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include router
app.include_router(model_router.router, prefix="/model", tags=["Model"])

@app.get("/")
def root():
    return {"message": "👋 Model-Vadivamaipu backend running successfully!"}

# ✅ This part lets you run with: python main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",     # path to the app
        host="127.0.0.1", 
        port=8000, 
        reload=True
    )
