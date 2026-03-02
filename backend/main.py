import os
os.environ["HF_HOME"] = "/home/user/app/cache"
os.environ["TRANSFORMERS_CACHE"] = "/home/user/app/cache"

import io
import base64
import torch
from fastapi import FastAPI, Request, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModel, AutoProcessor
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load Marqo FashionCLIP
MODEL_ID  = "Marqo/marqo-fashionCLIP"
model     = AutoModel.from_pretrained(MODEL_ID, trust_remote_code=True)
processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
device    = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Garments FashionCLIP checks against
LABELS = [
    "leather jacket", "denim jacket", "blazer", "hoodie", "puffer jacket", "trench coat",
    "plain white t-shirt", "graphic t-shirt", "dress shirt", "knit sweater",
    "dark denim jeans", "light denim jeans", "chinos", "joggers", "shorts",
    "white sneakers", "chelsea boots", "ankle boots", "loafers", "dress shoes"
]


# ── Health check ─────────────────────────────────────────────
@app.get("/")
def home():
    return {
        "status": "StyleCheck API is Live",
        "model":  MODEL_ID,
        "device": device
    }


# ── Analyze via JSON base64 (your existing working endpoint) ─
@app.post("/analyze-garment")
async def analyze_garment(request: Request):
    data         = await request.json()
    image_base64 = data.get("image")

    # Decode image
    image_bytes = base64.b64decode(image_base64)
    image       = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Generate embedding (your existing working code untouched)
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = model.get_image_features(inputs["pixel_values"], normalize=True)
    embedding = image_features.tolist()[0]

    # Detect garments (NEW)
    text_inputs = processor(
        text=LABELS,
        images=image,
        return_tensors="pt",
        padding=True
    ).to(device)

    with torch.no_grad():
        outputs = model(**text_inputs)

    scores   = outputs.logits_per_image.softmax(dim=1)[0]
    detected = [
        {"garment": LABELS[i], "confidence": round(scores[i].item(), 3)}
        for i in range(len(LABELS))
        if scores[i].item() > 0.10
    ]
    detected.sort(key=lambda x: x["confidence"], reverse=True)

    return {
        "status":     "success",
        "detected":   detected[:5],
        "embedding":  embedding,
        "dimensions": len(embedding)
    }


# ── Analyze via direct file upload (easier Postman testing) ──
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    image    = Image.open(io.BytesIO(contents)).convert("RGB")

    # Generate embedding
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = model.get_image_features(inputs["pixel_values"], normalize=True)
    embedding = image_features.tolist()[0]

    # Detect garments
    text_inputs = processor(
        text=LABELS,
        images=image,
        return_tensors="pt",
        padding=True
    ).to(device)

    with torch.no_grad():
        outputs = model(**text_inputs)

    scores   = outputs.logits_per_image.softmax(dim=1)[0]
    detected = [
        {"garment": LABELS[i], "confidence": round(scores[i].item(), 3)}
        for i in range(len(LABELS))
        if scores[i].item() > 0.10
    ]
    detected.sort(key=lambda x: x["confidence"], reverse=True)

    return {
        "status":     "success",
        "detected":   detected[:5],
        "embedding":  embedding,
        "dimensions": len(embedding)
    }


# ── WebSocket ─────────────────────────────────────────────────
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()

            if data.get("type") == "analyze":

                await websocket.send_json({
                    "step": 1, "status": "active",
                    "label": "Looking at what you're wearing"
                })

                image_bytes = base64.b64decode(data.get("image"))
                image       = Image.open(io.BytesIO(image_bytes)).convert("RGB")

                inputs = processor(images=image, return_tensors="pt").to(device)
                with torch.no_grad():
                    image_features = model.get_image_features(inputs["pixel_values"], normalize=True)
                embedding = image_features.tolist()[0]

                text_inputs = processor(
                    text=LABELS, images=image,
                    return_tensors="pt", padding=True
                ).to(device)
                with torch.no_grad():
                    outputs = model(**text_inputs)
                scores   = outputs.logits_per_image.softmax(dim=1)[0]
                detected = [
                    {"garment": LABELS[i], "confidence": round(scores[i].item(), 3)}
                    for i in range(len(LABELS)) if scores[i].item() > 0.10
                ]
                detected.sort(key=lambda x: x["confidence"], reverse=True)

                await websocket.send_json({
                    "step": 1, "status": "done",
                    "label": "Looking at what you're wearing",
                    "detail": f"{len(detected)} items detected",
                    "garments": detected[:5]
                })

                await websocket.send_json({
                    "step": 2, "status": "active",
                    "label": "Searching similar outfits"
                })

                # pgvector search goes here next
                await websocket.send_json({
                    "step": 2, "status": "done",
                    "label": "Searching similar outfits",
                    "detail": "Ready for pgvector connection"
                })

    except WebSocketDisconnect:
        pass