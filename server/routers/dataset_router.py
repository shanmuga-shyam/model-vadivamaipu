from fastapi import APIRouter, UploadFile
import os, shutil

router = APIRouter()
UPLOAD_DIR = "server/uploads"

@router.post("/upload")
async def upload_dataset(file: UploadFile):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "success",
        "message": f"File '{file.filename}' uploaded successfully ✅",
        "path": file_path
    }
