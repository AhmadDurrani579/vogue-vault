import io
import base64
from fastapi import APIRouter, Depends, Request
from PIL import Image
from ..services.clip_service import CLIPService
from ..schemas.models import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/analyze", tags=["Analysis"])

# Dependency to inject the service
def get_clip_service(request: Request) -> CLIPService:
    return CLIPService(request.app.state.clip_engine)

@router.post("/garment", response_model=AnalysisResponse)
async def analyze_garment(payload: AnalysisRequest, service: CLIPService = Depends(get_clip_service)):
    image = Image.open(io.BytesIO(base64.b64decode(payload.image))).convert("RGB")
    detected, embedding = await service.analyze(image)
    
    return {
        "status": "success",
        "detected": detected,
        "embedding": embedding,
        "dimensions": 512
    }