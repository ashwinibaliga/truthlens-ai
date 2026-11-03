"""
Verification test for Google Gemini API integration.
Validates authentication and model response without leaking the API key.
"""
import os
import sys
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY", "").strip()

if not key:
    print("[ERROR] GEMINI_API_KEY is not configured in .env.")
    sys.exit(1)

print(f"[INFO] GEMINI_API_KEY detected (Length: {len(key)}). Testing connectivity...")

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent"
headers = {
    "x-goog-api-key": key,
    "Content-Type": "application/json"
}
payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": (
                        "Analyze this text for signs of synthetic AI generation: "
                        "'In conclusion, navigating the multifaceted landscape of modern technology is crucial.' "
                        "Return a JSON object with: "
                        "ai_probability (float 0-100), "
                        "verdict ('likely_ai' | 'likely_human' | 'inconclusive'), "
                        "reasoning (short summary)"
                    )
                }
            ]
        }
    ],
    "generationConfig": {
        "responseMimeType": "application/json"
    }
}

try:
    with httpx.Client(timeout=15.0) as client:
        res = client.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            data = res.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            parsed = json.loads(raw_text)
            print(f"[SUCCESS] Gemini API authenticated and operational!")
            print(f"[MODEL RESPONSE] Verdict: {parsed.get('verdict')} | AI Probability: {parsed.get('ai_probability')}%")
            print(f"[REASONING] {parsed.get('reasoning')}")
        else:
            print(f"[FAILED] Gemini API returned HTTP {res.status_code}: {res.text[:300]}")
            sys.exit(1)
except Exception as e:
    print(f"[ERROR] Connection error: {e}")
    sys.exit(1)
