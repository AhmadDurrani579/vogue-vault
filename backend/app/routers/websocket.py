from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.clip_service import CLIPService
import io, base64
from PIL import Image

router = APIRouter()

# Dependency to get your AI service
def get_clip_service(websocket: WebSocket) -> CLIPService:
    return CLIPService(websocket.app.state.clip_engine)

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    service: CLIPService = Depends(get_clip_service)
):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "analyze":
                # 1. Start Log
                await websocket.send_json({"step": 1, "status": "active", "label": "Analyzing..."})

                # 2. Process Image using the Service
                image = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")
                detected, embedding = await service.analyze(image)

                # 3. Send Results
                await websocket.send_json({
                    "step": 1, "status": "done",
                    "garments": detected,
                    "embedding": embedding
                })
    except WebSocketDisconnect:
        print("Client disconnected")