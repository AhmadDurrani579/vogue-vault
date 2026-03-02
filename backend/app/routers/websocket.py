import io
import base64
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from PIL import Image
from app.services.clip_service import CLIPService

router = APIRouter()

def get_clip_service(websocket: WebSocket) -> CLIPService:
    return CLIPService(websocket.app.state.clip_engine)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Manual dependency injection for websockets
    service = CLIPService(websocket.app.state.clip_engine)
    
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "analyze":
                await websocket.send_json({"step": 1, "status": "active", "label": "Analyzing..."})

                image = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")
                detected, embedding = await service.analyze(image)

                await websocket.send_json({
                    "step": 1, "status": "done",
                    "garments": detected,
                    "embedding": embedding
                })
    except WebSocketDisconnect:
        pass