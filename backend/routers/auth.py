from fastapi import APIRouter, Depends
from backend.auth import CurrentUser, get_current_user
from backend.models import UserProfile
from backend.config import settings
from backend.database import supabase_client

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.get("/me", response_model=UserProfile)
async def get_my_profile(current_user: CurrentUser = Depends(get_current_user)):
    """
    Returns the authenticated user's verified profile.
    """
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name
    )

@router.get("/config")
async def get_auth_config():
    """
    Returns information about Supabase authentication status and configuration.
    """
    is_supabase_active = bool(supabase_client and settings.SUPABASE_URL and settings.SUPABASE_KEY)
    return {
        "supabase_configured": is_supabase_active,
        "supabase_url": settings.SUPABASE_URL[:20] + "..." if settings.SUPABASE_URL else None,
        "auth_methods": {
            "email_password": True,
            "google_oauth": is_supabase_active
        },
        "instructions": None if is_supabase_active else "Set SUPABASE_URL and SUPABASE_KEY in .env and frontend/.env to enable live cloud authentication."
    }
