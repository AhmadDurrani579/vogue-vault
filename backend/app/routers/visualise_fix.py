import io
import base64
import httpx
from fastapi import APIRouter, Request
from app.core.config import settings

router = APIRouter()

HF_API_URL = "https://router.huggingface.co/hf-inference/models/stable-diffusion-v1-5/stable-diffusion-v1-5"

@router.post("/visualise-fix")
async def visualise_fix(request: Request, data: dict):
    image_b64 = data.get("image")
    fix_text  = data.get("fix")
    garment   = data.get("garment")

    if not fix_text:
        return {"status": "error", "message": "Missing fix text"}

    prompt          = f"fashion photo, {fix_text}, high quality, realistic, same person same pose"
    negative_prompt = "blurry, distorted, low quality, deformed"

    # Check token
    if not settings.HF_TOKEN:
        print("[VISUALISE] ERROR — HF_TOKEN not set!")
        return {"status": "error", "message": "HF_TOKEN not configured"}

    headers = {
        "Authorization": f"Bearer {settings.HF_TOKEN}",
        "Content-Type":  "application/json"
    }

    payload = {
        "inputs": f"professional fashion photo of {fix_text}, white background, studio lighting, high quality"
    }

    try:
        print(f"[VISUALISE] Calling HF API — token set: {bool(settings.HF_TOKEN)}")
        print(f"[VISUALISE] Prompt: {prompt[:80]}")

        async with httpx.AsyncClient(timeout=120) as http:
            res = await http.post(HF_API_URL, headers=headers, json=payload)

        print(f"[VISUALISE] Response status: {res.status_code}")
        print(f"[VISUALISE] Response body: {res.text[:300]}")

        if res.status_code == 200:
            image_bytes = res.content
            result_b64  = base64.b64encode(image_bytes).decode("utf-8")
            print("[VISUALISE] Success!")
            return {
                "status":       "success",
                "result_image": f"data:image/png;base64,{result_b64}"
            }
        elif res.status_code == 503:
            return {"status": "loading", "message": "Model warming up, retry in 20s"}
        else:
            return {
                "status":  "error",
                "message": f"HF API {res.status_code}",
                "detail":  res.text[:300]
            }

    except Exception as e:
        print(f"[VISUALISE] Exception: {type(e).__name__}: {e}")
        return {"status": "error", "message": f"{type(e).__name__}: {str(e)}"}