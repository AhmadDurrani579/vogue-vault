import os
from pydantic import BaseModel

class Settings(BaseModel):
    # API Settings
    PROJECT_NAME: str = "VogueVault"
    VERSION: str = "1.0.0"
    
    # AI Model Settings
    MODEL_ID: str = "hf-hub:Marqo/marqo-fashionCLIP"
    CACHE_DIR: str = "/home/user/.cache"
    
    # Database Settings
    # Pulling directly from environment variables
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/voguevault")
    
    # Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

# Initialize the settings object
settings = Settings()