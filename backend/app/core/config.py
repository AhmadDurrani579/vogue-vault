import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    # App
    PROJECT_NAME: str = "StyleCheck"
    VERSION: str      = "1.0.0"

    # Model
    MODEL_ID:  str = "hf-hub:Marqo/marqo-fashionCLIP"
    CACHE_DIR: str = "/home/user/app/cache"

    # Database
    DATABASE_URL: str = ""

    # OpenAI
    OPENAI_API_KEY: str = ""

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY:    str = ""
    CLOUDINARY_API_SECRET: str = ""

    class Config:
        env_file = ".env"


settings = Settings()