import os
# Force cache paths before any AI imports
os.environ["HF_HOME"] = "/home/user/app/cache"
os.environ["TRANSFORMERS_CACHE"] = "/home/user/app/cache"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze, websocket
from app.core.ai_engine import FashionCLIPEngine # Import your class-based engine

app = FastAPI(title="VogueVault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# 1. Startup Event: Load the heavy model ONCE here
@app.on_event("startup")
async def startup_event():
    # This stores the model in the app state so routers can "inject" it
    app.state.clip_engine = FashionCLIPEngine("hf-hub:Marqo/marqo-fashionCLIP")
    print("🚀 FashionCLIP Engine Loaded and Ready")

# 2. Include Routers
app.include_router(analyze.router)
app.include_router(websocket.router)

@app.get("/")
async def health_check():
    return {"status": "Live", "engine": "Marqo-FashionCLIP"}