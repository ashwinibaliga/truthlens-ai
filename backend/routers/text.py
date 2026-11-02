import io
import os
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from backend.models import (
    MediaType, ScanResponse, ScanStatus, Verdict, TextAnalyzeRequest
)
from backend.database import db_create_scan
from backend.services.forensics_text import analyze_text

router = APIRouter(prefix="/api/text", tags=["Text Detection"])

@router.post("/analyze", response_model=ScanResponse, status_code=status.HTTP_201_CREATED)
async def analyze_text_payload(payload: TextAnalyzeRequest):
    """
    Analyze pasted written text for synthetic AI vs human linguistic traits.
    """
    if len(payload.text.strip()) < 15:
        raise HTTPException(
            status_code=400,
            detail="Text must contain at least 15 characters for statistical linguistic analysis."
        )

    scan_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)
    title = payload.title or "Pasted Text Passage"

    try:
        analysis_data = await analyze_text(payload.text, title=title)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text analysis error: {str(e)}")

    completed_at = datetime.now(timezone.utc)

    scan_record = {
        "id": scan_id,
        "filename": title,
        "media_type": MediaType.TEXT.value,
        "file_size": len(payload.text.encode("utf-8")),
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

@router.post("/upload", response_model=ScanResponse, status_code=status.HTTP_201_CREATED)
async def analyze_text_document(
    file: UploadFile = File(...)
):
    """
    Upload a .txt or .docx file and perform AI vs human text analysis.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded file.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".txt", ".docx", ".md"]:
        raise HTTPException(
            status_code=400,
            detail="Supported document types for text analysis: .txt, .docx, .md"
        )

    content_bytes = await file.read()
    extracted_text = ""

    if ext in [".txt", ".md"]:
        try:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
        except Exception:
            extracted_text = content_bytes.decode("latin-1", errors="ignore")
    elif ext == ".docx":
        try:
            import docx
            doc = docx.Document(io.BytesIO(content_bytes))
            extracted_text = "\n".join([p.text for p in doc.paragraphs if p.text])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not parse DOCX document: {str(e)}")

    if len(extracted_text.strip()) < 15:
        raise HTTPException(status_code=400, detail="Document contains insufficient text (min 15 characters).")

    return await analyze_text_payload(
        TextAnalyzeRequest(text=extracted_text, title=file.filename)
    )

