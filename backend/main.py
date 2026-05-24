from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import images
import os

app = FastAPI()

os.makedirs("outputs", exist_ok=True)

app.include_router(images.router)

app.mount("/output", StaticFiles(directory="outputs"), name="output")

@app.get("/health")
def health_check():
    return {"status": "ok"}