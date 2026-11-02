from fastapi import APIRouter
from backend.models import StatsResponse
from backend.database import db_get_stats

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

@router.get("", response_model=StatsResponse)
async def get_dashboard_stats():
    """
    Retrieve aggregated dashboard statistics strictly derived from stored database scans.
    """
    stats = await db_get_stats()
    return stats

