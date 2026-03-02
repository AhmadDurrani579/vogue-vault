import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "VogueVault"
    VERSION: str = "1.0.0"
    
    # AI Model Settings
    MODEL_ID: str = "hf-hub:Marqo/marqo-fashionCLIP"
    CACHE_DIR: str = "/home/user/.cache"
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/voguevault")
    
    # Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    class Config:
        env_file = ".env"

settings = Settings()