import os
os.environ["HF_HOME"] = "/home/user/app/cache"
os.environ["TRANSFORMERS_CACHE"] = "/home/user/app/cache"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.ai_engine import FashionCLIPEngine
from app.routers import analyze, websocket
from app.core.config import settings

app = FastAPI(title="VogueVault")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup_event():
    # Model ID from config
    app.state.clip_engine = FashionCLIPEngine(settings.MODEL_ID)

app.include_router(analyze.router)
app.include_router(websocket.router)

@app.get("/")
def health():
    return {"status": "Live"}