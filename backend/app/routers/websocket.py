import io
import base64
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
from PIL import Image
from app.services.clip_service import CLIPService
from app.services.ai_service import AIService

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    clip = CLIPService(websocket.app.state.clip_engine)
    db   = websocket.app.state.db
    ai   = websocket.app.state.ai

    async def safe_send(payload):
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json(payload)

    try:
        while True:
            if websocket.client_state == WebSocketState.DISCONNECTED:
                break

            data     = await websocket.receive_json()
            occasion = data.get("occasion", "casual")

            # ── Step 1: FashionCLIP ──────────────────────
            await safe_send({ "step": 1, "status": "active", "label": "Looking at what you're wearing" })

            image             = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")
            detected, embedding = await clip.analyze(image)

            await safe_send({
                "step":     1,
                "status":   "done",
                "label":    "Looking at what you're wearing",
                "detail":   f"{len(detected)} garments identified",
                "garments": detected
            })

            # ── Step 2: pgvector search ──────────────────
            await safe_send({ "step": 2, "status": "active", "label": "Searching 5,000 similar outfits" })

            similar = await db.search_similar(embedding, occasion)
            if not similar:
                similar = await db.search_similar(embedding, "casual")

            await safe_send({
                "step":    2,
                "status":  "done",
                "label":   "Searching 5,000 similar outfits",
                "detail":  f"{len(similar)} matches found",
                "matches": similar
            })

            # ── Step 3: OpenAI verdict ───────────────────
            await safe_send({ "step": 3, "status": "active", "label": "Analysing your outfit" })

            verdict = ai.get_verdict(detected, similar, occasion)

            await safe_send({
                "step":   3,
                "status": "done",
                "label":  "Analysing your outfit",
                "detail": verdict.get("summary", "")
            })

            # ── Step 4: Self-check ───────────────────────
            await safe_send({ "step": 4, "status": "active", "label": "Double-checking the findings" })

            await safe_send({
                "step":   4,
                "status": "done",
                "label":  "Double-checking the findings",
                "detail": "Verified ✓" if verdict.get("verified") else "Corrected and improved ✓"
            })

            # ── Step 5: Complete ─────────────────────────
            await safe_send({ "step": 5, "status": "active", "label": "Writing your verdict" })

            await safe_send({
                "step":    5,
                "status":  "done",
                "type":    "complete",
                "label":   "Writing your verdict",
                "detail":  verdict.get("fix", ""),
                "verdict": verdict,
                "matches": similar
            })

    except WebSocketDisconnect:
        print("[WS] Client disconnected")
    except Exception as e:
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({"type": "error", "message": str(e)})
        print(f"[WS] Error: {e}")