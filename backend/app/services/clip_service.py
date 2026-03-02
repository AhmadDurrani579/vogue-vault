import torch
import torch.nn.functional as F

from ..core.ai_engine import FashionCLIPEngine

class CLIPService:
    def __init__(self, engine: FashionCLIPEngine): # Engine is passed in, not imported
        self.engine = engine
        self.labels = [
            "leather jacket", "denim jacket", "blazer", "hoodie", "puffer jacket",
            "trench coat", "white sneakers", "chelsea boots", "loafers"
        ]

    async def analyze(self, image):
        # Generate the 512-dim embedding
        embedding = self.engine.generate_embedding(image)
        
        img_tensor = self.engine.preprocess(image).unsqueeze(0).to(self.engine.device)
        with torch.no_grad():
            image_features = self.engine.model.encode_image(img_tensor, normalize=True)
            text_features = self.engine.get_text_features(self.labels)

        similarity = (image_features @ text_features.T).squeeze(0)
        scores = F.softmax(similarity * 10, dim=0)

        detected = [
            {"garment": self.labels[i], "confidence": round(scores[i].item(), 3)}
            for i in range(len(self.labels)) if scores[i].item() > 0.05
        ]
        detected.sort(key=lambda x: x["confidence"], reverse=True)
        
        return detected, embedding