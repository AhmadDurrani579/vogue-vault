import os
import io
import base64
import torch
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModel, AutoProcessor # Changed to Auto classes
from PIL import Image

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Load Marqo FashionCLIP (Fine-tuned for clothes, materials, and styles)
MODEL_ID = "Marqo/marqo-fashionCLIP"

# trust_remote_code=True is required for Marqo's custom GCL architecture
model = AutoModel.from_pretrained(MODEL_ID, trust_remote_code=True)
processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)

@app.get("/")
def home():
    return {"status": "VogueVault API is Live", "model": MODEL_ID}

# --- STEP 1: REST ENDPOINT FOR EMBEDDINGS ---
@app.post("/analyze-garment")
async def analyze_garment(request: Request):
    data = await request.json()
    image_base64 = data.get("image")
    
    # 1. Decode Image
    image_bytes = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # 2. Preprocess for FashionCLIP
    inputs = processor(images=image, return_tensors="pt")
    
    # 3. Generate Embedding (512 dimensions)
    with torch.no_grad():
        # Using the model's specialized feature extractor
        image_features = model.get_image_features(inputs["pixel_values"], normalize=True)
    
    embedding = image_features.tolist()[0]
    
    return {
        "status": "success",
        "embedding": embedding,
        "dimensions": len(embedding) # Will be 512
    }

# --- WEBSOCKET FOR REAL-TIME PROGRESS LOGS ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "analyze":
                await websocket.send_json({"type": "log", "message": "👗 Fashion-specific analysis in progress..."})
    except WebSocketDisconnect:
        pass