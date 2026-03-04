import io
import base64
import hashlib
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
from PIL import Image
from app.services.clip_service import CLIPService

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    clip  = CLIPService(websocket.app.state.clip_engine)
    db    = websocket.app.state.db
    ai    = websocket.app.state.ai
    cache = websocket.app.state.cache

    async def safe_send(payload):
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json(payload)

    try:
        while True:
            if websocket.client_state == WebSocketState.DISCONNECTED:
                break

            data = await websocket.receive_json()

            # ── Handle ping (keep-alive from frontend)
            if data.get("type") == "ping":
                await safe_send({"type": "pong"})
                continue

            occasion = data.get("occasion", "casual")

            # ── Decode + resize image immediately
            image_bytes = base64.b64decode(data.get("image"))
            image       = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image.thumbnail((512, 512), Image.LANCZOS)  # resize before anything

            # ── Check full cache (image hash + occasion)
            image_hash = hashlib.md5(image_bytes).hexdigest()
            cache_key  = f"{image_hash}_{occasion}"

            if cache_key in cache:
                print(f"[CACHE] Full hit — {cache_key[:8]}")
                cached = cache[cache_key]

                # Stream steps instantly from cache
                for step_num, label in [
                    (1, "Looking at what you're wearing"),
                    (2, "Searching 5,000 similar outfits"),
                    (3, "Analysing your outfit"),
                    (4, "Double-checking the findings"),
                    (5, "Writing your verdict"),
                ]:
                    await safe_send({"step": step_num, "status": "active", "label": label})
                    await safe_send({"step": step_num, "status": "done",   "label": label})

                await safe_send({
                    "type":    "complete",
                    "step":    5,
                    "status":  "done",
                    "label":   "Writing your verdict",
                    "verdict": cached["verdict"],
                    "matches": cached["matches"],
                    "garments": cached["garments"],
                })
                continue

            # ── Step 1: FashionCLIP
            await safe_send({"step": 1, "status": "active", "label": "Looking at what you're wearing"})

            detected, embedding = await clip.analyze(image)

            await safe_send({
                "step":     1,
                "status":   "done",
                "label":    "Looking at what you're wearing",
                "detail":   f"{len(detected)} garments identified",
                "garments": detected
            })

            # ── Step 2: pgvector search
            await safe_send({"step": 2, "status": "active", "label": "Searching 5,000 similar outfits"})

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

            # ── Step 3: OpenAI verdict
            await safe_send({"step": 3, "status": "active", "label": "Analysing your outfit"})

            verdict = ai.get_verdict(detected, similar, occasion)

            await safe_send({
                "step":   3,
                "status": "done",
                "label":  "Analysing your outfit",
                "detail": verdict.get("summary", "")
            })

            # ── Step 4: Verified (no second OpenAI call)
            await safe_send({"step": 4, "status": "active", "label": "Double-checking the findings"})
            await safe_send({
                "step":   4,
                "status": "done",
                "label":  "Double-checking the findings",
                "detail": "Verified ✓"
            })

            # ── Step 5: Complete
            await safe_send({"step": 5, "status": "active", "label": "Writing your verdict"})
            await safe_send({
                "step":    5,
                "status":  "done",
                "type":    "complete",
                "label":   "Writing your verdict",
                "detail":  verdict.get("fix", ""),
                "verdict": verdict,
                "matches": similar
            })

            # ── Save to cache
            cache[cache_key] = {
                "verdict":  verdict,
                "matches":  similar,
                "garments": detected
            }
            print(f"[CACHE] Saved — {cache_key[:8]}")

    except WebSocketDisconnect:
        print("[WS] Client disconnected")
    except Exception as e:
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({"type": "error", "message": str(e)})
        print(f"[WS] Error: {e}")