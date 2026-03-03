import os
os.environ["HF_HOME"] = "/home/user/app/cache"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.ai_engine import FashionCLIPEngine
from app.services.db_service import DBService
from app.routers import analyze, websocket
from app.core.config import settings
from app.services.ai_service import AIService

app = FastAPI(title="VogueVault")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup_event():
    try:
        app.state.clip_engine = FashionCLIPEngine(settings.MODEL_ID)
        app.state.db          = DBService()
        await app.state.db.connect()
        app.state.ai          = AIService()
        print("[Startup] All services ready!")
    except Exception as e:
        print(f"[Startup ERROR] {e}")
        raise

@app.get("/")
def health():
    return {"status": "Live"}

@app.get("/test-db")
def test_db():
    results = app.state.db.search_similar([0.1] * 512, "casual")
    return {"results": results}
    
@app.on_event("startup")
async def startup_event():
    app.state.clip_engine = FashionCLIPEngine(settings.MODEL_ID)
    app.state.db          = DBService()
    await app.state.db.connect()
    app.state.ai          = AIService()
  
@app.get("/test-search")
async def test_search():
    try:
        dummy = [0.1] * 512
        results = await app.state.db.search_similar(dummy, "casual")
        return {"count": len(results), "results": results[:2]}
    except Exception as e:
        return {"error": str(e)}

app.include_router(analyze.router)
app.include_router(websocket.router)