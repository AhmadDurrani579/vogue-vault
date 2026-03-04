import os
import sys
import logging

os.environ["PYTHONUNBUFFERED"] = "1"
os.environ["HF_HOME"] = "/home/user/app/cache"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.ai_engine import FashionCLIPEngine
from app.services.db_service import DBService
from app.routers import analyze, websocket
from app.core.config import settings
from app.services.ai_service import AIService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)] # Force to HF console
)
logger = logging.getLogger("voguevault")

app = FastAPI(title="VogueVault")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting VogueVault services...") # Use logger
    try:
        app.state.clip_engine = FashionCLIPEngine(settings.MODEL_ID)
        app.state.db          = DBService()
        await app.state.db.connect()
        app.state.ai          = AIService()
        logger.info("All services ready and connected!") #
    except Exception as e:
        logger.error(f"Startup ERROR: {str(e)}", exc_info=True) #


@app.get("/")
def health():
    return {"status": "Live"}

@app.get("/test-db")
def test_db():
    results = app.state.db.search_similar([0.1] * 512, "casual")
    return {"results": results}
  
@app.get("/test-search")
async def test_search():
    try:
        dummy = [0.1] * 512
        results = await app.state.db.search_similar(dummy, "casual")
        return {"count": len(results), "results": results[:2]}
    except Exception as e:
        return {"error": str(e)}

@app.get("/debug")
async def debug():
    return {
        "openai_key_set": bool(settings.OPENAI_API_KEY),
        "openai_key_length": len(settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else 0,
        "db_url_set": bool(settings.DATABASE_URL),
    }

@app.get("/test-openai")
async def test_openai():
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say hello in JSON with key 'message'"}],
            response_format={"type": "json_object"},
            max_tokens=50
        )
        return {"status": "success", "response": response.choices[0].message.content}
    except Exception as e:
        return {"status": "error", "error": f"{type(e).__name__}: {str(e)}"}    

app.include_router(analyze.router)
app.include_router(websocket.router)