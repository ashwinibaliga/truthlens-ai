import os
import re
import math
from typing import Dict, Any, List
import httpx
from backend.config import settings
from backend.models import Verdict, ConfidenceLevel, IndicatorStatus, EvidenceItem

# Common rhetorical phrases heavily favored by RLHF / Large Language Models
AI_RHETORICAL_MARKERS = [
    r"\bdelve\b", r"\btapestry\b", r"\btestament to\b", r"\bcrucial\b",
    r"\bmoreover\b", r"\bfurthermore\b", r"\bin conclusion\b", r"\bit is important to note\b",
    r"\bit's worth noting\b", r"\bmultifaceted\b", r"\bvibrant\b", r"\bpivotal\b",
    r"\bseamlessly\b", r"\bnuanced\b", r"\bharnessing the power\b", r"\bnavigating the\b",
    r"\bin today's fast-paced world\b", r"\balign with\b", r"\bfosters\b", r"\bcornerstone\b"
]

async def analyze_text(text: str, title: str = "Submitted Text") -> Dict[str, Any]:
    """
    Perform linguistic, statistical, and neural forensics on written text.
    Combines:
    1. Burstiness analysis (standard deviation of sentence lengths and complexity)
    2. Perplexity proxy (entropy of word distribution and transition regularity)
    3. Type-Token Ratio (TTR) and Lexical Diversity
    4. Rhetorical AI discourse marker pattern matching
    5. Hugging Face RoBERTa Detector (if HUGGINGFACE_API_KEY is configured)
    6. Strict ethical disclaimer: Never claims to prove authorship or human identity.
    """
    cleaned_text = text.strip()
    words = re.findall(r"\b\w+\b", cleaned_text.lower())
    sentences = [s.strip() for s in re.split(r"[.!?]+", cleaned_text) if s.strip()]

    word_count = len(words)
    sentence_count = len(sentences)

    if word_count < 10:
        raise ValueError("Text passage is too short for statistical linguistic analysis (minimum 15 words required).")

    evidence: List[EvidenceItem] = []
    linguistic_breakdown: Dict[str, Any] = {}

    # ---------------------------------------------------------
    # 1. Burstiness Analysis (Sentence Length Variance)
    # ---------------------------------------------------------
    # Humans write with erratic rhythms (short punchy sentences alternating with long complex ones).
    # LLMs tend to generate sentences with remarkably uniform lengths (low burstiness).
    sentence_lengths = [len(re.findall(r"\b\w+\b", s)) for s in sentences if s]
    avg_sentence_len = float(sum(sentence_lengths) / max(len(sentence_lengths), 1))
    
    if len(sentence_lengths) > 1:
        variance = sum((x - avg_sentence_len) ** 2 for x in sentence_lengths) / len(sentence_lengths)
        sentence_std_dev = math.sqrt(variance)
        burstiness_score = float(sentence_std_dev / (avg_sentence_len + 1e-6))
    else:
        sentence_std_dev = 0.0
        burstiness_score = 0.3

    linguistic_breakdown["burstiness"] = {
        "avg_sentence_length": round(avg_sentence_len, 1),
        "sentence_length_std_dev": round(sentence_std_dev, 2),
        "burstiness_index": round(burstiness_score, 3)
    }

    if burstiness_score < 0.28 and sentence_count >= 3:
        evidence.append(EvidenceItem(
            title="Low Syntactic Burstiness (Uniform Sentence Cadence)",
            description="Sentence lengths and clause structures display unnatural rhythmic consistency, typical of transformer token autoregression.",
            metric_value=f"Burstiness Index: {burstiness_score:.2f}",
            indicator_type=IndicatorStatus.FLAG,
            detail=f"Average sentence length is {avg_sentence_len:.1f} words with minimal deviation (σ={sentence_std_dev:.1f})."
        ))
    else:
        evidence.append(EvidenceItem(
            title="Natural Syntactic Burstiness and Asymmetry",
            description="Noticeable organic variation in sentence length and structural cadence observed.",
            metric_value=f"Burstiness Index: {burstiness_score:.2f}",
            indicator_type=IndicatorStatus.PASS,
            detail=f"Healthy organic cadence variation (σ={sentence_std_dev:.1f})."
        ))

    # ---------------------------------------------------------
    # 2. Lexical Diversity (Type-Token Ratio)
    # ---------------------------------------------------------
    unique_words = set(words)
    ttr = len(unique_words) / float(word_count)
    root_ttr = len(unique_words) / math.sqrt(word_count)

    linguistic_breakdown["vocabulary"] = {
        "total_words": word_count,
        "unique_words": len(unique_words),
        "type_token_ratio": round(ttr, 3),
        "root_ttr": round(root_ttr, 2)
    }

    # ---------------------------------------------------------
    # 3. Shannon Entropy (Perplexity Proxy)
    # ---------------------------------------------------------
    freq_map = {}
    for w in words:
        freq_map[w] = freq_map.get(w, 0) + 1

    entropy = 0.0
    for w, count in freq_map.items():
        p = count / float(word_count)
        entropy -= p * math.log2(p)

    linguistic_breakdown["entropy"] = round(entropy, 2)

    if entropy < 4.2 and word_count > 60:
        evidence.append(EvidenceItem(
            title="Low Lexical Shannon Entropy",
            description="Token probability distribution shows predictable, repetitive word selection with low informational perplexity.",
            metric_value=f"Entropy: {entropy:.2f} bits",
            indicator_type=IndicatorStatus.FLAG,
            detail="Statistical clustering around high-frequency token paths."
        ))
    else:
        evidence.append(EvidenceItem(
            title="High Semantic Entropy and Vocabulary Dispersion",
            description="Wide lexical distribution and unpredictable phrasing consistent with human stylistic choice.",
            metric_value=f"Entropy: {entropy:.2f} bits",
            indicator_type=IndicatorStatus.PASS,
            detail="High lexical variety across semantic fields."
        ))

    # ---------------------------------------------------------
    # 4. Rhetorical AI Markers
    # ---------------------------------------------------------
    detected_markers = []
    for pattern in AI_RHETORICAL_MARKERS:
        matches = re.findall(pattern, cleaned_text, re.IGNORECASE)
        if matches:
            detected_markers.extend(matches)

    linguistic_breakdown["ai_markers_found"] = detected_markers

    if len(detected_markers) >= 3:
        evidence.append(EvidenceItem(
            title="Frequent Characteristic AI Discourse Markers",
            description=f"Identified multiple formulaic transitional markers frequently generated by RLHF-tuned language models.",
            metric_value=f"{len(detected_markers)} Matches",
            indicator_type=IndicatorStatus.FLAG,
            detail=f"Detected phrases: {', '.join(set(detected_markers[:4]))}."
        ))
    elif len(detected_markers) == 0:
        evidence.append(EvidenceItem(
            title="Absence of Formulaic AI Transition Clichés",
            description="Text avoids common synthetic boilerplate discourse templates.",
            metric_value="Zero Markers",
            indicator_type=IndicatorStatus.PASS,
            detail="Free of standard conversational AI phrasing."
        ))

    # ---------------------------------------------------------
    # 5. External Neural AI Text Detector (Gemini / Hugging Face)
    # ---------------------------------------------------------
    neural_used = False
    neural_score = None
    neural_explanation = ""
    provider_name = "TruthLens Linguistic Forensics Engine (Local)"

    # Priority 1: Google Gemini Multimodal Analysis
    gemini_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    if gemini_key:
        try:
            gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent"
            headers = {"x-goog-api-key": gemini_key, "Content-Type": "application/json"}
            prompt = (
                f"You are a digital forensic linguist. Analyze this text for AI vs Human generation:\n\n"
                f"\"\"\"{cleaned_text[:2000]}\"\"\"\n\n"
                f"Return JSON with:\n"
                f"- ai_probability: float between 0 and 100\n"
                f"- human_probability: float between 0 and 100\n"
                f"- verdict: one of 'likely_ai', 'likely_human', 'potentially_manipulated', or 'inconclusive'\n"
                f"- key_findings: concise 1-sentence forensic summary of linguistic and stylistic patterns"
            )
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"}
            }
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(gemini_url, headers=headers, json=payload)
                if res.status_code == 200:
                    import json
                    gemini_json = json.loads(res.json()["candidates"][0]["content"]["parts"][0]["text"])
                    neural_score = float(gemini_json.get("ai_probability", 50.0))
                    neural_explanation = str(gemini_json.get("key_findings", ""))
                    neural_used = True
                    provider_name = "Google Gemini + TruthLens Linguistic Forensics"
                    evidence.append(EvidenceItem(
                        title="Google Gemini Neural Linguistic Evaluation",
                        description=neural_explanation or "Neural semantic and structural discourse analysis.",
                        metric_value=f"AI Probability: {neural_score:.1f}%",
                        indicator_type=IndicatorStatus.FLAG if neural_score >= 60 else (IndicatorStatus.PASS if neural_score <= 40 else IndicatorStatus.INCONCLUSIVE),
                        detail="Evaluated via Gemini neural linguistic model."
                    ))
                else:
                    print(f"[Gemini Text API] Status {res.status_code}: {res.text[:120]}")
        except Exception as e:
            print(f"[Gemini Text API] Connection error: {e}")

    # Priority 2: Hugging Face RoBERTa Detector (if Gemini not active)
    if not neural_used:
        hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY") or settings.HUGGINGFACE_API_KEY
        if hf_token:
            try:
                hf_url = "https://router.huggingface.co/hf-inference/models/openai-community/roberta-base-openai-detector"
                headers = {"Authorization": f"Bearer {hf_token}"}
                payload = {"inputs": cleaned_text[:1000]}
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(hf_url, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        if isinstance(data, list) and len(data) > 0:
                            inner = data[0] if isinstance(data[0], list) else data
                            for item in inner:
                                lbl = item.get("label", "").lower()
                                if "fake" in lbl or "ai" in lbl:
                                    neural_score = float(item.get("score", 0.5)) * 100.0
                                    neural_used = True
                                    neural_explanation = "Evaluated via pretrained RoBERTa neural detector corroborated with lexical entropy."
                                    provider_name = "Hugging Face RoBERTa Detector + TruthLens Linguistic Engine"
                                    break
                    elif res.status_code == 402:
                        print("[HF Text API] Notice: HTTP 402 - Account requires pre-paid inference credits on router.huggingface.co. Falling back to local linguistic engine.")
                    else:
                        print(f"[HF Text API] HTTP {res.status_code}: {res.text[:120]}")
            except Exception as e:
                print(f"[HF Text API] Connection error: {e}")

    # ---------------------------------------------------------
    # 6. Confidence and Verdict Calculation
    # ---------------------------------------------------------
    if neural_used and neural_score is not None:
        ai_prob = round(neural_score, 1)
        human_prob = round(100.0 - ai_prob, 1)
        conf_level = ConfidenceLevel.HIGH if (ai_prob > 85 or ai_prob < 15) else ConfidenceLevel.MODERATE
        explanation = neural_explanation or "Evaluated via neural model corroborated with lexical entropy analysis."
    else:
        flags = sum(1 for e in evidence if e.indicator_type == IndicatorStatus.FLAG)
        passes = sum(1 for e in evidence if e.indicator_type == IndicatorStatus.PASS)

        if flags >= 2 and len(detected_markers) >= 2:
            ai_prob = round(min(89.0, 68.0 + (flags * 7.0)), 1)
            human_prob = round(100.0 - ai_prob, 1)
            conf_level = ConfidenceLevel.MODERATE
            explanation = "Low syntactic burstiness combined with characteristic formulaic discourse markers."
        elif passes >= 2 and len(detected_markers) == 0:
            human_prob = round(min(92.0, 72.0 + (passes * 8.0)), 1)
            ai_prob = round(100.0 - human_prob, 1)
            conf_level = ConfidenceLevel.MODERATE
            explanation = "Dynamic syntactic burstiness, varied sentence lengths, and natural semantic entropy."
        else:
            ai_prob = 52.0
            human_prob = 48.0
            conf_level = ConfidenceLevel.LOW
            explanation = "Balanced stylistic indicators. Text possesses mixed traits of algorithmic structure and human vocabulary."

    if ai_prob >= 75.0:
        verdict = Verdict.LIKELY_AI
    elif human_prob >= 70.0:
        verdict = Verdict.LIKELY_HUMAN
    elif flags >= 1 and passes >= 1:
        verdict = Verdict.POTENTIALLY_MANIPULATED
    else:
        verdict = Verdict.INCONCLUSIVE

    return {
        "provider": provider_name,
        "verdict": verdict,
        "confidence_metrics": {
            "ai_probability": ai_prob,
            "human_probability": human_prob,
            "confidence_level": conf_level,
            "entropy": round(entropy, 2),
            "raw_score": round(ai_prob / 100.0, 3),
            "explanation": explanation
        },
        "forensic_results": {
            "media_metadata": {
                "title": title,
                "character_count": len(cleaned_text),
                "word_count": word_count,
                "sentence_count": sentence_count
            },
            "indicators": [e.model_dump() for e in evidence],
            "technical_details": linguistic_breakdown,
            "linguistic_breakdown": linguistic_breakdown,
            "limitations_disclaimer": "CRITICAL AI TEXT LIMITATION: Text detection is strictly probabilistic and cannot prove authorship or identify specific human writers. Academic, formal, or ESL writing styles may exhibit structural similarities to model outputs."
        }
    }

