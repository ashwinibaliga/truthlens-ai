from typing import Optional
from fastapi import APIRouter, Depends
from backend.models import StatsResponse
from backend.database import db_get_stats
from backend.auth import CurrentUser, get_optional_user

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

@router.get("", response_model=StatsResponse)
async def get_dashboard_stats(current_user: Optional[CurrentUser] = Depends(get_optional_user)):
    """
    Retrieve aggregated dashboard statistics strictly derived from stored database scans.
    Scoped to the authenticated user when signed in.
    """
    stats = await db_get_stats(user_id=current_user.id if current_user else None)
    return stats
