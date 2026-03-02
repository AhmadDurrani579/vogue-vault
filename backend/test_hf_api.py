import requests
import base64
import os

# 1. Update this to YOUR actual Hugging Face Space URL
# Note: Use the .hf.space domain, not the huggingface.co/spaces domain
HF_API_URL = "https://ahmaddurrani-vogue-vault-api.hf.space/analyze-garment"

# 2. Path to an image on your Mac
IMAGE_PATH = "sample-model.jpg" 

def test_analyze():
    if not os.path.exists(IMAGE_PATH):
        print(f"❌ Error: File '{IMAGE_PATH}' not found. Please add an image to this folder.")
        return

    print(f"🚀 Encoding image and sending request to Hugging Face...")
    
    with open(IMAGE_PATH, "rb") as f:
        img_str = base64.b64encode(f.read()).decode()

    # Payload matching your FastAPI 'analyze_garment' logic
    payload = {"image": img_str}

    try:
        # We use a 60-second timeout because the first 'cold start' call on HF can be slow
        response = requests.post(HF_API_URL, json=payload, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            embedding = data.get("embedding", [])
            print(f"✅ Success! Connected to Marqo-FashionCLIP")
            print(f"📊 Vector Dimensions: {len(embedding)}")
            print(f"💡 First 5 values: {embedding[:5]}")
        else:
            print(f"❌ Server Error ({response.status_code}): {response.text}")
            if response.status_code == 405:
                print("⚠️ Hint: 'Method Not Allowed' usually means the URL is wrong or the API is behind a redirect.")

    except requests.exceptions.ConnectTimeout:
        print("❌ Error: Connection timed out. The Hugging Face Space might still be 'Waking Up'.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_analyze()