from datetime import datetime
from typing import Optional, Any, Dict, List
from enum import Enum
from pydantic import BaseModel, Field

class MediaType(str, Enum):
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"
    TEXT = "text"

class ScanStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Verdict(str, Enum):
    LIKELY_AI = "likely_ai"
    LIKELY_HUMAN = "likely_human"
    POTENTIALLY_MANIPULATED = "potentially_manipulated"
    INCONCLUSIVE = "inconclusive"

class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"

class IndicatorStatus(str, Enum):
    FLAG = "flag"       # Indicator suggests AI generation or manipulation
    PASS = "pass"       # Indicator suggests organic / camera / human features
    NEUTRAL = "neutral" # Inconclusive or baseline
    INFO = "info"       # Informational metadata

class EvidenceItem(BaseModel):
    title: str
    description: str
    metric_value: Optional[str] = None
    indicator_type: IndicatorStatus = IndicatorStatus.NEUTRAL
    detail: Optional[str] = None

class ConfidenceMetrics(BaseModel):
    ai_probability: float = Field(..., ge=0.0, le=100.0, description="Genuine calculated AI probability percentage")
    human_probability: float = Field(..., ge=0.0, le=100.0, description="Genuine calculated human probability percentage")
    confidence_level: ConfidenceLevel = ConfidenceLevel.MODERATE
    entropy: Optional[float] = None
    raw_score: Optional[float] = None
    explanation: str

class ForensicResults(BaseModel):
    media_metadata: Dict[str, Any] = {}
    indicators: List[EvidenceItem] = []
    technical_details: Dict[str, Any] = {}
    limitations_disclaimer: str
    frame_analysis: Optional[List[Dict[str, Any]]] = None # For video
    linguistic_breakdown: Optional[Dict[str, Any]] = None # For text

class ScanBase(BaseModel):
    filename: str
    media_type: MediaType
    file_size: int

class ScanCreate(ScanBase):
    pass

class ScanResponse(BaseModel):
    id: str
    filename: str
    media_type: MediaType
    file_size: int
    status: ScanStatus
    provider: str
    provider_job_id: Optional[str] = None
    verdict: Verdict
    confidence_metrics: ConfidenceMetrics
    forensic_results: ForensicResults
    created_at: datetime
    completed_at: Optional[datetime] = None

class TextAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=15, description="Text content to analyze for AI vs human authorship")
    title: Optional[str] = "Pasted Text Passage"

class StatsResponse(BaseModel):
    total_scans: int
    ai_detected_count: int
    human_detected_count: int
    manipulated_count: int
    inconclusive_count: int
    by_media_type: Dict[str, int]
    recent_activity: List[Dict[str, Any]]

class ProviderStatus(BaseModel):
    name: str
    category: str
    status: str # "operational", "active_api", "local_engine", "unavailable"
    description: str
    details: str
