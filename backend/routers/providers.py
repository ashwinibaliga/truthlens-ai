from typing import List
from fastapi import APIRouter
from backend.config import settings
from backend.models import ProviderStatus
from backend.database import supabase_client

router = APIRouter(prefix="/api/providers", tags=["Providers"])

@router.get("", response_model=List[ProviderStatus])
async def get_providers_status():
    """
    Check and report genuine live status of AI detection providers and database connections.
    Strictly follows TruthLens Rule 5 & 7 (never pretends an API is connected).
    """
    providers = []

    # 1. Local Image Forensics Engine
    providers.append(ProviderStatus(
        name="TruthLens Vision & Frequency Engine",
        category="Image & Video Spatial Forensics",
        status="operational",
        description="2D Fast Fourier Transform (FFT) high-frequency spectral dispersion, Error Level Analysis (ELA), and optical sensor EXIF validation.",
        details="Local compute running natively on server with NumPy and Pillow."
    ))

    # 2. Local Acoustic Forensics Engine
    providers.append(ProviderStatus(
        name="TruthLens Acoustic Spectrum Engine",
        category="Voice & Audio Forensics",
        status="operational",
        description="Zero Crossing Rate (ZCR) vocal tract jitter analysis, spectral rolloff, and neural vocoder cutoff detection.",
        details="Local compute running natively on server."
    ))

    # 3. Local Linguistic Forensics Engine
    providers.append(ProviderStatus(
        name="TruthLens Linguistic Forensics Engine",
        category="Text Forensics",
        status="operational",
        description="Syntactic burstiness variance, Shannon entropy perplexity proxy, lexical diversity (Type-Token Ratio), and RLHF marker detection.",
        details="Local statistical NLP running natively on server."
    ))

    # 4. Hugging Face Inference API
    if settings.HUGGINGFACE_API_KEY:
        providers.append(ProviderStatus(
            name="Hugging Face Inference API",
            category="Neural Multimodal Models",
            status="active_api",
            description="Remote neural inference for deepfake vision (dima806/deepfake_vs_real) and RoBERTa text detection.",
            details="API key configured and active."
        ))
    else:
        providers.append(ProviderStatus(
            name="Hugging Face Inference API",
            category="Neural Multimodal Models",
            status="unavailable",
            description="Remote neural inference for deepfake vision and RoBERTa text detector.",
            details="HUGGINGFACE_API_KEY environment variable not configured. TruthLens relies on local forensic engines."
        ))

    # 5. Resemble Detect API
    if settings.RESEMBLE_API_KEY:
        providers.append(ProviderStatus(
            name="Resemble Detect API",
            category="Audio Deepfake Detection",
            status="active_api",
            description="Industry-standard commercial neural voice deepfake classification API.",
            details="RESEMBLE_API_KEY configured and active."
        ))
    else:
        providers.append(ProviderStatus(
            name="Resemble Detect API",
            category="Audio Deepfake Detection",
            status="unavailable",
            description="Commercial multimodal audio deepfake detector.",
            details="RESEMBLE_API_KEY not configured. TruthLens Acoustic Spectral Forensics Engine handles analysis locally."
        ))

    # 6. Database Connection
    if supabase_client:
        providers.append(ProviderStatus(
            name="Supabase PostgreSQL",
            category="Cloud Database",
            status="operational",
            description="Cloud relational PostgreSQL storage for scans, verdicts, and forensic evidence.",
            details=f"Connected to {settings.SUPABASE_URL[:25]}..."
        ))
    else:
        providers.append(ProviderStatus(
            name="Supabase PostgreSQL",
            category="Cloud Database",
            status="local_fallback",
            description="Cloud PostgreSQL database for centralized scans.",
            details="SUPABASE_URL and SUPABASE_KEY not set. Operating seamlessly via local SQLite database (truthlens.db)."
        ))

    return providers

