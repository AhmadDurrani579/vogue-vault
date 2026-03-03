import io
import base64
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from PIL import Image
from app.services.clip_service import CLIPService
from app.services.db_service import DBService
from app.services.ai_service import AIService

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clip = CLIPService(websocket.app.state.clip_engine)
    db = websocket.app.state.db
    ai = websocket.app.state.ai

    try:
        while True:
            data = await websocket.receive_json()
            # If the frontend doesn't send an occasion, we use None to search everything
            occasion = data.get("occasion") 

            # -- Step 1: CLIP --
            await websocket.send_json({"step": 1, "status": "active", "label": "Looking at what you're wearing"})
            image = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")
            detected, embedding = await clip.analyze(image)
            await websocket.send_json({"step": 1, "status": "done", "label": "Analysis Complete", "garments": detected})

            # -- Step 2: Neon DB --
            await websocket.send_json({"step": 2, "status": "active", "label": "Searching similar outfits"})
            
            # Use await for the DB call
            similar = await db.search_similar(embedding, occasion)
            
            # FALLBACK: If 0 matches found for that occasion, search EVERYTHING
            if not similar and occasion:
                similar = await db.search_similar(embedding, None)

            await websocket.send_json({
                "step": 2, "status": "done", 
                "label": f"Found {len(similar)} matches", 
                "matches": similar
            })

            # -- Step 3: OpenAI --
            await websocket.send_json({"step": 3, "status": "active", "label": "Generating your verdict"})
            
            # FIX: Only use 'await' if your get_verdict is 'async def'
            # If it is a regular 'def', remove the 'await' keyword below
            verdict = await ai.get_verdict(detected, similar, occasion)

            await websocket.send_json({
                "step": 3, "status": "done", 
                "label": "Verdict Ready", 
                "verdict": verdict
            })

            # -- Step 4/5: Final --
            await websocket.send_json({
                "step": 5, "status": "done", "type": "complete", 
                "label": "Everything finished!", "verdict": verdict
            })

    except Exception as e:
        await websocket.send_json({"step": "error", "label": f"Error: {str(e)}"})