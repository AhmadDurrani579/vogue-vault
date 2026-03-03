import io
import base64
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState # Import the state tracker
from PIL import Image
from app.services.clip_service import CLIPService
from app.services.db_service import DBService
from app.services.ai_service import AIService

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Initialize services
    clip = CLIPService(websocket.app.state.clip_engine)
    db = websocket.app.state.db
    ai = websocket.app.state.ai

    try:
        while True:
            # Check if still connected before receiving
            if websocket.client_state == WebSocketState.DISCONNECTED:
                break
                
            data = await websocket.receive_json()
            occasion = data.get("occasion")

            # Helper function to send safely
            async def safe_send(payload):
                if websocket.client_state == WebSocketState.CONNECTED:
                    await websocket.send_json(payload)

            # -- Step 1: CLIP --
            await safe_send({"step": 1, "status": "active", "label": "Looking at what you're wearing"})
            
            image_data = base64.b64decode(data.get("image"))
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            detected, embedding = await clip.analyze(image)
            
            await safe_send({
                "step": 1, "status": "done", 
                "label": "Analysis Complete", 
                "garments": detected
            })

            # -- Step 2: Neon DB --
            await safe_send({"step": 2, "status": "active", "label": "Searching similar outfits"})
            
            similar = await db.search_similar(embedding, occasion)
            if not similar and occasion:
                similar = await db.search_similar(embedding, None)

            await safe_send({
                "step": 2, "status": "done", 
                "label": f"Found {len(similar)} matches", 
                "matches": similar
            })

            # -- Step 3: OpenAI --
            await safe_send({"step": 3, "status": "active", "label": "Generating your verdict"})
            
            # Use ai.get_verdict (removed await based on your previous logic)
            verdict = ai.get_verdict(detected, similar, occasion)

            await safe_send({
                "step": 3, "status": "done", 
                "label": "Verdict Ready", 
                "verdict": verdict
            })

            # -- Final Step --
            await safe_send({
                "step": 5, "status": "done", "type": "complete", 
                "label": "Everything finished!", "verdict": verdict
            })

    except WebSocketDisconnect:
        # Graceful exit when client leaves
        print("[WS] Client disconnected normally")
    except Exception as e:
        # Avoid sending errors if the socket is already closed
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({"step": "error", "label": f"Error: {str(e)}"})
        print(f"[WS] Unexpected error: {e}")