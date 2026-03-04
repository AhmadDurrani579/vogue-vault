import torch
import torch.nn.functional as F
from PIL import Image
from app.core.ai_engine import FashionCLIPEngine

class CLIPService:
    def __init__(self, engine: FashionCLIPEngine):
        self.engine = engine
        self.labels = [
            # Tops
            "t-shirt", "shirt", "blouse", "crop top", "tank top",
            # Outerwear
            "leather jacket", "denim jacket", "blazer", "hoodie",
            "puffer jacket", "trench coat", "bomber jacket", "cardigan",
            # Bottoms
            "jeans", "trousers", "shorts", "skirt", "joggers", "chinos",
            # Footwear
            "white sneakers", "chelsea boots", "loafers", "heels",
            "ankle boots", "trainers", "dress shoes",
            # Accessories & Full outfits
            "dress", "suit", "coat", "scarf", "cap", "bag",
        ]

    def _resize_image(self, image: Image.Image) -> Image.Image:
        """Resize to 224x224 — all CLIP needs, saves memory and time"""
        return image.resize((224, 224), Image.LANCZOS)

    async def analyze(self, image: Image.Image):
        # ── Resize first — don't pass full resolution to CLIP
        image = self._resize_image(image)

        # ── Generate embedding from resized image
        embedding = self.engine.generate_embedding(image)

        img_tensor = self.engine.preprocess(image).unsqueeze(0).to(self.engine.device)

        with torch.no_grad():
            image_features = self.engine.model.encode_image(img_tensor, normalize=True)
            text_features  = self.engine.get_text_features(self.labels)

        similarity = (image_features @ text_features.T).squeeze(0)
        scores     = F.softmax(similarity * 10, dim=0)

        detected = [
            {"garment": self.labels[i], "confidence": round(scores[i].item(), 3)}
            for i in range(len(self.labels))
            if scores[i].item() >  0.03
        ]
        detected.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Ensure minimum 3 garments always returned
        if len(detected) < 3:
            # Take top 3 regardless of threshold
            all_scores = [
                {"garment": self.labels[i], "confidence": round(scores[i].item(), 3)}
                for i in range(len(self.labels))
            ]
            all_scores.sort(key=lambda x: x["confidence"], reverse=True)
            detected = all_scores[:3]

        # ── Keep top 6 only — no need to send 30 garments to OpenAI
        detected = detected[:6]

        print(f"[CLIP] Detected {len(detected)} garments from resized 224x224 image")
        return detected, embedding
