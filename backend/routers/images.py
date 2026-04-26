import os
import shutil
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from database import get_connection
from image_processor import process_image

router = APIRouter()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    # save the original img to disk
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # record in database
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
        "message": "Görsel başarıyla yüklendi",
        "image_id": image_id,
        "file_name": file.filename
    }


@router.post("/convert")
def convert_image(
    image_id: int = Form(...),
    pixel_size: int = Form(...),
    max_colors: int = Form(...),
    brightness: int = Form(0),
    sharpness: int = Form(0),
    vibrance: int = Form(0),
):
    # retrieve file path from db
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT file_path FROM images WHERE id = %s", (image_id,))
    row = cur.fetchone()

    if not row:
        return JSONResponse(status_code=404, content={"error": "Görsel bulunamadı"})

    file_path = row[0]

    # image processing
    result_image, hex_palette = process_image(file_path, pixel_size, max_colors)

    # store the result in db
    output_filename = f"output_{image_id}.png"
    output_path = f"{OUTPUT_DIR}/{output_filename}"
    result_bgr = cv2.cvtColor(result_image, cv2.COLOR_RGB2BGR)
    cv2.imwrite(output_path, result_bgr)

    cur.execute(
        """INSERT INTO conversions 
           (image_id, pixel_size, max_colors, brightness, sharpness, vibrance, output_path)
           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (image_id, pixel_size, max_colors, brightness, sharpness, vibrance, output_path)
    )
    conversion_id = cur.fetchone()[0]

    for i, hex_code in enumerate(hex_palette):
        cur.execute(
            "INSERT INTO palette_colors (conversion_id, color_number, hex_code) VALUES (%s, %s, %s)",
            (conversion_id, i + 1, hex_code)
        )

    conn.commit()
    cur.close()
    conn.close()

    return {
        "conversion_id": conversion_id,
        "output_path": output_path,
        "palette": hex_palette
    }