import io
import base64
from fastapi import APIRouter, Depends, Request, UploadFile, File
from PIL import Image
from app.services.clip_service import CLIPService
from app.services.db_service import DBService
from app.services.ai_service import AIService
from app.schemas.models import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/analyze", tags=["Analysis"])


# ── Dependencies ──────────────────────────────────────────────
def get_clip_service(request: Request) -> CLIPService:
    return CLIPService(request.app.state.clip_engine)

def get_db_service(request: Request) -> DBService:
    return request.app.state.db

def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai


# ── Existing endpoint — keep untouched ───────────────────────
@router.post("/garment", response_model=AnalysisResponse)
async def analyze_garment(
    payload: AnalysisRequest,
    service: CLIPService = Depends(get_clip_service)
):
    image = Image.open(io.BytesIO(base64.b64decode(payload.image))).convert("RGB")
    detected, embedding = await service.analyze(image)
    return {
        "status":     "success",
        "detected":   detected,
        "embedding":  embedding,
        "dimensions": 512
    }


# ── New endpoint — file upload, easier to test ───────────────
@router.post("/upload")
async def analyze_upload(
    file: UploadFile = File(...),
    occasion: str = "casual",
    clip: CLIPService = Depends(get_clip_service)
):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    detected, embedding = await clip.analyze(image)
    return {
        "status":     "success",
        "detected":   detected,
        "embedding":  embedding,
        "dimensions": 512
    }


# ── Full pipeline — CLIP + pgvector + OpenAI ─────────────────
@router.post("/full")
async def analyze_full(
    file: UploadFile = File(...),
    occasion: str = "casual",
    clip: CLIPService = Depends(get_clip_service),
    db:   DBService   = Depends(get_db_service),
    ai:   AIService   = Depends(get_ai_service)
):
    # Step 1: FashionCLIP
    image             = Image.open(io.BytesIO(await file.read())).convert("RGB")
    detected, embedding = await clip.analyze(image)

    # Step 2: pgvector search
    similar = db.search_similar(embedding, occasion)

    # Step 3: OpenAI verdict + self-check
    verdict = ai.get_verdict(detected, similar, occasion)

    return {
        "status":   "success",
        "garments": detected,
        "similar":  similar[:5],
        "verdict":  verdict
    }