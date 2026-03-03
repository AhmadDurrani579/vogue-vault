"""
Indexing Script — StyleCheck
Loads Marqo/deepfashion-multimodal from Hugging Face
Runs each image through FashionCLIP → generates 512 embedding
Uploads image to Cloudinary → gets public URL
Inserts everything into Neon DB

Run from backend folder:
    python scripts/index_outfits.py
"""

import os
import io
import psycopg2
import open_clip
import torch
import cloudinary
import cloudinary.uploader
from datasets import load_dataset
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL")
MODEL_ID     = "hf-hub:Marqo/marqo-fashionCLIP"
LIMIT        = 5000

# ── Cloudinary Setup ──────────────────────────────────────────
cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key    = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

# ── Load FashionCLIP ──────────────────────────────────────────
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Loading FashionCLIP on {device}...")
model, _, preprocess = open_clip.create_model_and_transforms(MODEL_ID)
model.to(device).eval()
print("FashionCLIP ready!")

# ── Connect to Neon ───────────────────────────────────────────
print("Connecting to Neon DB...")
conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True
print("Connected!")


def get_embedding(image: Image.Image) -> list:
    tensor = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        features = model.encode_image(tensor, normalize=True)
    return features.squeeze().tolist()


def upload_to_cloudinary(image: Image.Image, item_id: str) -> str:
    """Upload PIL image to Cloudinary and return public URL"""
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    result = cloudinary.uploader.upload(
        buffer,
        public_id = f"stylecheck/outfits/{item_id}",
        folder    = "stylecheck"
    )
    return result["secure_url"]


def insert_outfit(garments, embedding, occasion, score, tags, image_url):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO indexed_outfits (garments, embedding, occasion, score, tags, image_url)
            VALUES (%s, %s::vector, %s, %s, %s, %s)
        """, (garments, embedding, occasion, score, tags, image_url))


def main():
    print("Loading Marqo/deepfashion-multimodal dataset...")
    dataset = load_dataset("Marqo/deepfashion-multimodal", split="data")
    total   = min(LIMIT, len(dataset))
    print(f"Dataset loaded — indexing {total} outfits...")
    print("-" * 50)

    indexed = 0
    failed  = 0

    for i in range(total):
        try:
            row     = dataset[i]
            image   = row["image"].convert("RGB")
            item_id = str(row.get("item_ID", i))

            # Garments from dataset categories
            garments = [
                row.get("category1", ""),
                row.get("category2", ""),
                row.get("category3", "")
            ]
            garments = [g.lower() for g in garments if g]
            if not garments:
                garments = ["outfit"]

            occasion = "casual"
            score    = 75
            tags     = garments.copy()

            # Generate embedding
            embedding = get_embedding(image)

            # Upload to Cloudinary
            image_url = upload_to_cloudinary(image, item_id)

            # Insert into Neon
            insert_outfit(garments, embedding, occasion, score, tags, image_url)

            indexed += 1
            if indexed % 100 == 0:
                print(f"✅ Indexed {indexed}/{total} outfits...")

        except Exception as e:
            failed += 1
            print(f"❌ Failed row {i}: {e}")
            continue

    print("-" * 50)
    print(f"Done! Indexed: {indexed} | Failed: {failed}")
    conn.close()


if __name__ == "__main__":
    main()