import os
import shutil
from fastapi import APIRouter, UploadFile, File
from database import get_connection

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO images (file_name, file_path) VALUES (%s, %s) RETURNING id",
        (file.filename, file_path)
    )
    image_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Image succesfully uploaded",
        "image_id": image_id,
        "file_name": file.filename
    }