import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Depends, status

from backend.config import settings
from backend.models import (
    MediaType, ScanResponse, ScanStatus, Verdict
)
from backend.database import (
    db_create_scan, db_get_scan, db_list_scans, db_delete_scan
)
from backend.auth import CurrentUser, get_current_user, get_optional_user
from backend.services.forensics_image import analyze_image
from backend.services.forensics_audio import analyze_audio
from backend.services.forensics_video import analyze_video

router = APIRouter(prefix="/api/scans", tags=["Scans"])

# Allowed MIME types and extensions
ALLOWED_EXTENSIONS = {
    MediaType.IMAGE: [".jpg", ".jpeg", ".png", ".webp"],
    MediaType.AUDIO: [".mp3", ".wav", ".m4a", ".ogg", ".flac"],
    MediaType.VIDEO: [".mp4", ".mov", ".webm", ".avi", ".mkv"]
}

@router.post("", response_model=ScanResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_scan(
    file: UploadFile = File(...),
    media_type: MediaType = Form(...),
    current_user: Optional[CurrentUser] = Depends(get_optional_user)
):
    """
    Upload a media file (Image, Audio, or Video) and execute genuine forensic AI detection.
    Associates scan record with authenticated user ID when signed in.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded filename.")

    ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = ALLOWED_EXTENSIONS.get(media_type, [])
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}' for media type '{media_type.value}'. Allowed: {', '.join(allowed_exts)}"
        )

    # Read file content safely
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    file_size = len(content)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    scan_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)

    # Run genuine analysis
    try:
        if media_type == MediaType.IMAGE:
            analysis_data = await analyze_image(content, file.filename)
        elif media_type == MediaType.AUDIO:
            analysis_data = await analyze_audio(content, file.filename)
        elif media_type == MediaType.VIDEO:
            analysis_data = await analyze_video(content, file.filename)
        else:
            raise HTTPException(status_code=400, detail=f"Invalid media type '{media_type}' for file scan.")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis processing error: {str(e)}"
        )

    completed_at = datetime.now(timezone.utc)

    scan_record = {
        "id": scan_id,
        "user_id": current_user.id if current_user else None,
        "filename": file.filename,
        "media_type": media_type.value,
        "file_size": file_size,
        "status": ScanStatus.COMPLETED.value,
        "provider": analysis_data["provider"],
        "provider_job_id": None,
        "verdict": analysis_data["verdict"].value if isinstance(analysis_data["verdict"], Verdict) else analysis_data["verdict"],
        "confidence_metrics": analysis_data["confidence_metrics"],
        "forensic_results": analysis_data["forensic_results"],
        "created_at": created_at.isoformat(),
        "completed_at": completed_at.isoformat()
    }

    saved = await db_create_scan(scan_record)
    return saved

@router.get("", response_model=List[ScanResponse])
async def list_scans(
    media_type: Optional[str] = Query(None, description="Filter by media type: image, audio, video, text"),
    verdict: Optional[str] = Query(None, description="Filter by verdict: likely_ai, likely_human, potentially_manipulated, inconclusive"),
    status: Optional[str] = Query(None, description="Filter by status: completed, processing, failed"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Optional[CurrentUser] = Depends(get_optional_user)
):
    """
    Retrieve historical scans scoped to the authenticated user.
    """
    return await db_list_scans(
        user_id=current_user.id if current_user else None,
        media_type=media_type,
        verdict=verdict,
        status=status,
        limit=limit,
        offset=offset
    )

@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan_details(
    scan_id: str,
    current_user: Optional[CurrentUser] = Depends(get_optional_user)
):
    """
    Retrieve single forensic scan by ID with ownership verification.
    """
    scan = await db_get_scan(scan_id, user_id=current_user.id if current_user else None)
    if not scan:
        raise HTTPException(status_code=404, detail=f"Scan '{scan_id}' not found or access denied.")
    return scan

@router.delete("/{scan_id}", status_code=status.HTTP_200_OK)
async def delete_scan(
    scan_id: str,
    current_user: Optional[CurrentUser] = Depends(get_optional_user)
):
    """
    Delete a scan record with user ownership verification.
    """
    existing = await db_get_scan(scan_id, user_id=current_user.id if current_user else None)
    if not existing:
        raise HTTPException(status_code=404, detail=f"Scan '{scan_id}' not found or access denied.")
    deleted = await db_delete_scan(scan_id, user_id=current_user.id if current_user else None)
    return {"success": deleted, "message": f"Scan '{scan_id}' deleted successfully."}
