import os
os.environ["HF_HOME"] = "/home/user/app/cache"
os.environ["TRANSFORMERS_CACHE"] = "/home/user/app/cache"

import io
import base64
import torch
import open_clip
import torch.nn.functional as F
from fastapi import FastAPI, Request, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load Marqo FashionCLIP via open_clip
# This is the correct way to load Marqo models
MODEL_ID = "hf-hub:Marqo/marqo-fashionCLIP"
device   = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Loading FashionCLIP on {device}...")
model, _, preprocess = open_clip.create_model_and_transforms(MODEL_ID)
tokenizer = open_clip.get_tokenizer(MODEL_ID)
model.to(device)
model.eval()
print("Model ready!")

LABELS = [
    "leather jacket", "denim jacket", "blazer", "hoodie", "puffer jacket", "trench coat",
    "plain white t-shirt", "graphic t-shirt", "dress shirt", "knit sweater",
    "dark denim jeans", "light denim jeans", "chinos", "joggers", "shorts",
    "white sneakers", "chelsea boots", "ankle boots", "loafers", "dress shoes"
]


def get_embedding(image: Image.Image) -> list:
    img_tensor = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        features = model.encode_image(img_tensor, normalize=True)
    return features.squeeze().tolist()


def detect_garments(image: Image.Image) -> list:
    # Image features
    img_tensor = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(img_tensor, normalize=True)

    # Text features — tokenizer handles 77 token padding correctly
    text_tokens = tokenizer(LABELS).to(device)
    with torch.no_grad():
        text_features = model.encode_text(text_tokens, normalize=True)

    # Cosine similarity
    similarity = (image_features @ text_features.T).squeeze(0)
    scores     = F.softmax(similarity * 100, dim=0)

    detected = [
        {"garment": LABELS[i], "confidence": round(scores[i].item(), 3)}
        for i in range(len(LABELS))
        if scores[i].item() > 0.05
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

    return {
        "status":     "success",
        "detected":   detect_garments(image),
        "embedding":  get_embedding(image),
        "dimensions": 512
    }


# ── Analyze via file upload (Swagger / Postman) ───────────────
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")

    return {
        "status":     "success",
        "detected":   detect_garments(image),
        "embedding":  get_embedding(image),
        "dimensions": 512
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

                image    = Image.open(io.BytesIO(base64.b64decode(data.get("image")))).convert("RGB")
                detected = detect_garments(image)
                embedding = get_embedding(image)

                await websocket.send_json({
                    "step":     1, "status": "done",
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