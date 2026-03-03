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

    # Inject all services
    clip = CLIPService(websocket.app.state.clip_engine)
    db   = websocket.app.state.db
    ai   = websocket.app.state.ai

    try:
        while True:
            data     = await websocket.receive_json()
            occasion = data.get("occasion", "casual")

            if data.get("type") != "analyze":
                await websocket.send_json({"type": "error", "message": "Send type: analyze"})
                continue

            # ── Step 1: FashionCLIP ──────────────────────
            await websocket.send_json({
                "step": 1, "status": "active",
                "label": "Looking at what you're wearing"
            })

            image             = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")
            detected, embedding = await clip.analyze(image)

            await websocket.send_json({
                "step":     1, "status": "done",
                "label":    "Looking at what you're wearing",
                "detail":   f"{len(detected)} items detected",
                "garments": detected
            })

            # ── Step 2: pgvector search ──────────────────
            await websocket.send_json({
                "step": 2, "status": "active",
                "label": "Searching 5,000 similar outfits"
            })

            similar = db.search_similar(embedding, occasion)

            await websocket.send_json({
                "step":    2, "status": "done",
                "label":   "Searching 5,000 similar outfits",
                "detail":  f"{len(similar)} matches found",
                "matches": similar
            })

            # ── Step 3: OpenAI verdict ───────────────────
            await websocket.send_json({
                "step": 3, "status": "active",
                "label": "Analysing your outfit"
            })

            verdict = ai.get_verdict(detected, similar, occasion)

            await websocket.send_json({
                "step": 3, "status": "done",
                "label": "Analysing your outfit"
            })

            # ── Step 4: Agentic self-check ───────────────
            await websocket.send_json({
                "step":   4, "status": "done",
                "label":  "Double-checking the findings",
                "detail": "Verified" if verdict.get("verified") else "Corrected"
            })

            # ── Step 5: Final verdict ────────────────────
            await websocket.send_json({
                "step":    5, "status": "done",
                "type":    "complete",
                "label":   "Your diagnosis is ready",
                "verdict": verdict
            })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_json({"type": "error", "message": str(e)})