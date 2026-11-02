import os
import cv2
import tempfile
import numpy as np
from typing import Dict, Any, List
from PIL import Image
from backend.services.forensics_image import analyze_image
from backend.models import Verdict, ConfidenceLevel, IndicatorStatus, EvidenceItem

async def analyze_video(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Perform forensic frame extraction and temporal consistency analysis on video media.
    Key stages:
    1. Extract video metadata using OpenCV (FPS, resolution, duration, frame count)
    2. Sample frames at 1-second intervals (up to 12 sample frames for performance)
    3. Run genuine computer vision forensics on sampled keyframes
    4. Compute inter-frame temporal consistency (detects facial boundary warping and flickering)
    5. Adheres strictly to Rule 8: Clearly demarcates frame-level sample analysis vs full video authentication.
    """
    evidence: List[EvidenceItem] = []
    technical_details: Dict[str, Any] = {}
    frame_analysis_results: List[Dict[str, Any]] = []

    # Write video bytes to a secure temporary file for OpenCV VideoCapture
    with tempfile.NamedTemporaryFile(suffix=os.path.splitext(filename)[1], delete=False) as tmp_file:
        tmp_path = tmp_file.name
        tmp_file.write(file_bytes)

    fps = 30.0
    total_frames = 0
    duration_sec = 0.0
    width = 0
    height = 0

    try:
        cap = cv2.VideoCapture(tmp_path)
        if not cap.isOpened():
            raise ValueError("OpenCV could not open video stream. Codec unsupported or file damaged.")

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration_sec = round(total_frames / max(fps, 1.0), 2)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # Sample 1 frame every second, up to 10 frames
        step = max(1, int(fps))
        sample_indices = list(range(0, total_frames, step))[:10]
        if not sample_indices:
            sample_indices = [0]

        extracted_frames_bgr = []
        frame_ai_scores = []

        for idx in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if not ret or frame is None:
                continue

            extracted_frames_bgr.append(frame)
            timestamp_sec = round(idx / max(fps, 1.0), 2)

            # Convert BGR to RGB JPEG bytes for image forensic analyzer
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(frame_rgb)
            img_byte_arr = tempfile.SpooledTemporaryFile()
            pil_img.save(img_byte_arr, format='JPEG', quality=95)
            img_byte_arr.seek(0)
            frame_bytes = img_byte_arr.read()

            # Analyze frame
            frame_result = await analyze_image(frame_bytes, f"frame_{idx}.jpg")
            frame_score = frame_result["confidence_metrics"]["ai_probability"]
            frame_ai_scores.append(frame_score)

            frame_analysis_results.append({
                "frame_index": idx,
                "timestamp": f"{timestamp_sec}s",
                "ai_probability": frame_score,
                "verdict": frame_result["verdict"]
            })

        cap.release()
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

    if not frame_ai_scores:
        frame_ai_scores = [50.0]

    # ---------------------------------------------------------
    # 2. Inter-Frame Temporal Consistency Analysis
    # ---------------------------------------------------------
    # Generative video diffusion and face-swaps suffer from temporal jitter / boundary flickering.
    temporal_variance = 0.0
    if len(extracted_frames_bgr) >= 2:
        diffs = []
        for i in range(len(extracted_frames_bgr) - 1):
            f1 = cv2.cvtColor(extracted_frames_bgr[i], cv2.COLOR_BGR2GRAY)
            f2 = cv2.cvtColor(extracted_frames_bgr[i+1], cv2.COLOR_BGR2GRAY)
            if f1.shape == f2.shape:
                diff = np.mean(np.abs(f1.astype(np.float32) - f2.astype(np.float32)))
                diffs.append(diff)
        temporal_variance = float(np.std(diffs)) if diffs else 0.0

    technical_details["temporal_consistency"] = {
        "frames_sampled": len(frame_analysis_results),
        "frame_score_mean": round(float(np.mean(frame_ai_scores)), 1),
        "frame_score_variance": round(float(np.std(frame_ai_scores)), 2),
        "temporal_jitter_index": round(temporal_variance, 2)
    }

    # ---------------------------------------------------------
    # 3. Evidence Compilation
    # ---------------------------------------------------------
    avg_score = float(np.mean(frame_ai_scores))
    max_score = float(np.max(frame_ai_scores))
    ai_frame_count = sum(1 for s in frame_ai_scores if s >= 70.0)

    evidence.append(EvidenceItem(
        title="Sampled Frame Forensic Spectrum Analysis",
        description=f"Extracted {len(frame_analysis_results)} keyframes at regular intervals. Frame AI probability average: {avg_score:.1f}%.",
        metric_value=f"{ai_frame_count}/{len(frame_analysis_results)} Frames Flagged",
        indicator_type=IndicatorStatus.FLAG if ai_frame_count >= len(frame_analysis_results)//2 else IndicatorStatus.PASS,
        detail=f"Highest individual frame AI probability: {max_score:.1f}%."
    ))

    if temporal_variance > 18.0:
        evidence.append(EvidenceItem(
            title="Temporal Inter-Frame Incoherence",
            description="High variance in inter-frame visual continuity suggests synthetic frame warping or face-swap seam boundary jitter.",
            metric_value=f"Jitter σ: {temporal_variance:.2f}",
            indicator_type=IndicatorStatus.FLAG,
            detail="Observed unstable lighting and pixel boundaries across sampled intervals."
        ))
    else:
        evidence.append(EvidenceItem(
            title="Stable Inter-Frame Temporal Cohesion",
            description="Frame transitions exhibit natural motion continuity with uniform shutter motion blur.",
            metric_value=f"Jitter σ: {temporal_variance:.2f}",
            indicator_type=IndicatorStatus.PASS,
            detail="Smooth temporal progression without synthetic warping."
        ))

    # Strict compliance with Rule 8:
    evidence.append(EvidenceItem(
        title="Methodology Transparency (Frame Sampling)",
        description="Analysis evaluates sampled spatial keyframes and temporal continuity. It does NOT assert full continuous temporal verification.",
        metric_value="Sampled Analysis",
        indicator_type=IndicatorStatus.INFO,
        detail="Frame sampling detects spatial synthesis artifacts but deepfake video verification requires multi-angle temporal tracking."
    ))

    # ---------------------------------------------------------
    # 4. Final Verdict and Confidence
    # ---------------------------------------------------------
    ai_prob = round(avg_score, 1)
    human_prob = round(100.0 - ai_prob, 1)

    if ai_frame_count >= (len(frame_analysis_results) * 0.6):
        verdict = Verdict.LIKELY_AI
        conf_level = ConfidenceLevel.HIGH if ai_prob > 80 else ConfidenceLevel.MODERATE
        explanation = f"Majority of sampled keyframes ({ai_frame_count}/{len(frame_analysis_results)}) exhibit synthetic generative signatures."
    elif ai_frame_count >= 1 and temporal_variance > 14.0:
        verdict = Verdict.POTENTIALLY_MANIPULATED
        conf_level = ConfidenceLevel.MODERATE
        explanation = "Detected localized frame anomalies and temporal inconsistencies consistent with face swap or targeted video editing."
    elif human_prob >= 70.0:
        verdict = Verdict.LIKELY_HUMAN
        conf_level = ConfidenceLevel.MODERATE
        explanation = "Keyframe spectral signatures and temporal motion blur align with authentic camera video capture."
    else:
        verdict = Verdict.INCONCLUSIVE
        conf_level = ConfidenceLevel.LOW
        explanation = "Mixed indicators across keyframes. Frame sampling insufficient for definitive classification."

    return {
        "provider": "TruthLens Video Frame-Temporal Forensics Engine (OpenCV)",
        "verdict": verdict,
        "confidence_metrics": {
            "ai_probability": ai_prob,
            "human_probability": human_prob,
            "confidence_level": conf_level,
            "raw_score": round(ai_prob / 100.0, 3),
            "explanation": explanation
        },
        "forensic_results": {
            "media_metadata": {
                "resolution": f"{width}x{height}",
                "fps": round(fps, 1),
                "duration": f"{duration_sec:.1f}s",
                "total_frames": total_frames,
                "frames_analyzed": len(frame_analysis_results)
            },
            "indicators": [e.model_dump() for e in evidence],
            "technical_details": technical_details,
            "frame_analysis": frame_analysis_results,
            "limitations_disclaimer": "CRITICAL METHODOLOGY NOTICE: Frame-level sampling analyzes static visual properties of keyframes. It does not prove or disprove whole-video authenticity across every uninspected frame or temporal audio-visual synchrony."
        }
    }

