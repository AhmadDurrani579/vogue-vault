from pydantic import BaseModel
from typing import List, Optional

# 1. The Request: What the frontend sends to the API
class AnalysisRequest(BaseModel):
    image: str  # The Base64 string of the photo

# 2. The Part: A single garment found by the AI
class GarmentDetection(BaseModel):
    garment: str
    confidence: float

# 3. The Response: What the API sends back to the user
class AnalysisResponse(BaseModel):
    status: str
    detected: List[GarmentDetection]
    embedding: List[float]
    dimensions: int = 512