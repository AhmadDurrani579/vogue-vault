import io
import base64
import httpx
from fastapi import APIRouter, Request
from app.core.config import settings

router = APIRouter()

HF_API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"

@router.post("/visualise-fix")
async def visualise_fix(request: Request, data: dict):
    fix_text = data.get("fix")
    garment  = data.get("garment", "")

    if not fix_text:
        return {"status": "error", "message": "Missing fix text"}

    if not settings.HF_TOKEN:
        return {"status": "error", "message": "HF_TOKEN not configured"}

    prompt = f"professional fashion photo, {fix_text}, white background, studio lighting, high quality, photorealistic"

    headers = {
        "Authorization": f"Bearer {settings.HF_TOKEN}",
        "Content-Type":  "application/json",
        "Accept":        "image/png"
    }

    try:
        print(f"[VISUALISE] Prompt: {prompt[:80]}")
        async with httpx.AsyncClient(timeout=120) as http:
            res = await http.post(
                HF_API_URL,
                headers=headers,
                json={"inputs": prompt}
            )

        print(f"[VISUALISE] Status: {res.status_code}")

        if res.status_code == 200:
            result_b64 = base64.b64encode(res.content).decode("utf-8")
            return {
                "status":       "success",
                "result_image": f"data:image/png;base64,{result_b64}"
            }
        elif res.status_code == 503:
            return {"status": "loading", "message": "Model warming up, retry in 20s"}
        else:
            print(f"[VISUALISE] Error: {res.status_code} — {res.text[:200]}")
            return {"status": "error", "message": f"HF API {res.status_code}", "detail": res.text[:200]}

    except Exception as e:
        print(f"[VISUALISE] Exception: {e}")
        return {"status": "error", "message": str(e)}