import io
import base64
import httpx
from fastapi import APIRouter, Request
from app.core.config import settings

router = APIRouter()

HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-inpainting"

@router.post("/visualise-fix")
async def visualise_fix(request: Request, data: dict):
    image_b64  = data.get("image")       # base64 image from frontend
    fix_text   = data.get("fix")         # e.g. "Swap white sneakers for chelsea boots"
    garment    = data.get("garment")     # e.g. "white sneakers"

    if not image_b64 or not fix_text:
        return {"error": "Missing image or fix text"}

    # Build prompt from fix
    prompt          = f"fashion photo, {fix_text}, high quality, realistic, same person same pose"
    negative_prompt = "blurry, distorted, low quality, deformed"

    headers = {
        "Authorization": f"Bearer {settings.HF_TOKEN}",
        "Content-Type":  "application/json"
    }

    payload = {
        "inputs":     prompt,
        "parameters": {
            "negative_prompt":    negative_prompt,
            "num_inference_steps": 20,
            "guidance_scale":      7.5,
        }
    }  

    try:
        print(f"[VISUALISE] Calling HF API — prompt: {prompt[:60]}")
        async with httpx.AsyncClient(timeout=120) as http:
            res = await http.post(HF_API_URL, headers=headers, json=payload)

        if res.status_code == 200:
            # HF returns raw image bytes
            image_bytes  = res.content
            result_b64   = base64.b64encode(image_bytes).decode("utf-8")
            print("[VISUALISE] Success!")
            return {
                "status":       "success",
                "result_image": f"data:image/png;base64,{result_b64}"
            }
        elif res.status_code == 503:
            # Model loading — tell frontend to retry
            return {"status": "loading", "message": "Model warming up, retry in 20s"}
        else:
            print(f"[VISUALISE] HF API error: {res.status_code} {res.text}")
            return {"status": "error", "message": "Visualisation failed"}

    except Exception as e:
        print(f"[VISUALISE] Exception: {e}")
        return {"status": "error", "message": str(e)}