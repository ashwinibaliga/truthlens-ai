import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "TruthLens AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment
    ENV: str = os.getenv("ENV", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", "https://truthlens-ai.vercel.app")
    ]
    
    # Supabase Database Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Real AI Providers Keys (Optional, system uses genuine local forensics + API if provided)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    HUGGINGFACE_API_KEY: str = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY", "")
    RESEMBLE_API_KEY: str = os.getenv("RESEMBLE_API_KEY", "")
    
    # Upload Settings
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50"))
    TEMP_UPLOAD_DIR: str = os.path.join(os.path.dirname(__file__), "temp_uploads")

settings = Settings()

os.makedirs(settings.TEMP_UPLOAD_DIR, exist_ok=True)

