import os
os.environ["HF_HOME"] = "/home/user/app/cache"
os.environ["TRANSFORMERS_CACHE"] = "/home/user/app/cache"

import io
import base64
import torch
import torch.nn.functional as F
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

LABELS = [
    "leather jacket", "denim jacket", "blazer", "hoodie", "puffer jacket", "trench coat",
    "plain white t-shirt", "graphic t-shirt", "dress shirt", "knit sweater",
    "dark denim jeans", "light denim jeans", "chinos", "joggers", "shorts",
    "white sneakers", "chelsea boots", "ankle boots", "loafers", "dress shoes"
]


def get_embedding(image: Image.Image) -> list:
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = model.get_image_features(inputs["pixel_values"], normalize=True)
    return image_features.squeeze().tolist()


def detect_garments(image: Image.Image) -> list:
    # Get image features
    image_inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = model.get_image_features(image_inputs["pixel_values"], normalize=True)

    # Get text features for each label separately
    text_inputs = processor(text=LABELS, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        text_features = model.get_text_features(
            text_inputs["input_ids"],
            normalize=True
        )

    # Compute cosine similarity manually
    similarity = (image_features @ text_features.T).squeeze(0)
    scores     = F.softmax(similarity, dim=0)

    detected = [
        {"garment": LABELS[i], "confidence": round(scores[i].item(), 3)}
        for i in range(len(LABELS))
        if scores[i].item() > 0.10
    ]
    detected.sort(key=lambda x: x["confidence"], reverse=True)
    return detected[:5]


# ── Health check ──────────────────────────────────────────────
@app.get("/")
def home():
    return {
        "status": "StyleCheck API is Live",
        "model":  MODEL_ID,
        "device": device
    }


# ── Analyze via base64 JSON ───────────────────────────────────
@app.post("/analyze-garment")
async def analyze_garment(request: Request):
    data  = await request.json()
    image = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")

    embedding = get_embedding(image)
    detected  = detect_garments(image)

    return {
        "status":     "success",
        "detected":   detected,
        "embedding":  embedding,
        "dimensions": len(embedding)
    }


# ── Analyze via file upload (Swagger / Postman) ───────────────
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")

    embedding = get_embedding(image)
    detected  = detect_garments(image)

    return {
        "status":     "success",
        "detected":   detected,
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

                image = Image.open(
                    io.BytesIO(base64.b64decode(data.get("image")))
                ).convert("RGB")

                embedding = get_embedding(image)
                detected  = detect_garments(image)

                await websocket.send_json({
                    "step":     1,
                    "status":   "done",
                    "label":    "Looking at what you're wearing",
                    "detail":   f"{len(detected)} items detected",
                    "garments": detected
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