import torch
import open_clip
from PIL import Image


class FashionCLIPEngine:

    def __init__(self, model_id: str, device: str = None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[FashionCLIP] Loading {model_id} on {self.device}...")
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(model_id)
        self.tokenizer = open_clip.get_tokenizer(model_id)
        self.model.to(self.device).eval()
        print("[FashionCLIP] Ready!")

    def generate_embedding(self, image: Image.Image) -> list:
        tensor = self.preprocess(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            features = self.model.encode_image(tensor, normalize=True)
        return features.squeeze().tolist()

    def get_text_features(self, labels: list):
        tokens = self.tokenizer(labels).to(self.device)
        with torch.no_grad():
            return self.model.encode_text(tokens, normalize=True)