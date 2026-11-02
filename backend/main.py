from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import scans, text, stats, providers

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="TruthLens AI: Advanced forensic media verification and AI deepfake detection API.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development & production allows web clients to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(scans.router)
app.include_router(text.router)
app.include_router(stats.router)
app.include_router(providers.router)

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint returning system status and version.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV,
        "tagline": "See Beyond What Looks Real."
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "TruthLens AI Forensic Verification Engine API",
        "health": "/health",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

