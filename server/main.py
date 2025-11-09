from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, dataset_router, model_router, result_router, history_router

app = FastAPI(title="Model Vadivamaipu Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict by domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🚀 Model Vadivamaipu backend is running"}

# include routers
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(dataset_router.router, prefix="/dataset", tags=["Dataset"])
app.include_router(model_router.router, prefix="/model", tags=["Model"])
app.include_router(result_router.router, prefix="/results", tags=["Results"])
app.include_router(history_router.router, prefix="/history", tags=["History"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)