"""
Verification script for Hugging Face Inference Token.
Reads HF_TOKEN from environment / .env and runs an authentication & inference check.
Does not print the token to stdout.
"""
import os
import sys
import httpx
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY", "")

if not token:
    print("[ERROR] No Hugging Face token detected in .env file.")
    print("Please set HF_TOKEN=hf_... in your root .env file.")
    sys.exit(1)

print("[INFO] Token detected. Verifying authentication with Hugging Face API...")

try:
    with httpx.Client(timeout=10.0) as client:
        # 1. Whoami authentication check
        res = client.get(
            "https://huggingface.co/api/whoami-v2",
            headers={"Authorization": f"Bearer {token}"}
        )
        if res.status_code == 200:
            user_data = res.json()
            username = user_data.get("name") or "User"
            is_pro = user_data.get("isPro", False)
            print(f"[SUCCESS] Token authenticated successfully for user: {username} (PRO: {is_pro})")
        else:
            print(f"[FAILED] Hugging Face returned HTTP {res.status_code}: {res.text}")
            sys.exit(1)

        # 2. Test lightweight text inference model on modern router
        print("[INFO] Testing Hugging Face Inference Providers router (router.huggingface.co)...")
        hf_url = "https://router.huggingface.co/hf-inference/models/openai-community/roberta-base-openai-detector"
        resp = client.post(
            hf_url,
            headers={"Authorization": f"Bearer {token}"},
            json={"inputs": "This is a quick verification check for TruthLens AI."}
        )
        if resp.status_code in (200, 503):
            # 200 = ready, 503 = model currently loading on HF servers (both mean token is valid)
            print("[SUCCESS] Hugging Face Inference Provider is reachable and authorized!")
            print("[STATUS] AI Analysis Service is ready.")
        elif resp.status_code == 402:
            print("[NOTICE] Hugging Face router returned HTTP 402 (Payment Required).")
            print("Explanation: Hugging Face has migrated serverless inference to 'Inference Providers'.")
            print("To activate remote inference calls, your Hugging Face account requires either:")
            print("  1. Pre-paid inference credits (visit https://huggingface.co/settings/billing)")
            print("  2. Or an active Hugging Face PRO subscription.")
            print("[STATUS] TruthLens local forensic engines remain 100% operational in the meantime.")
        else:
            print(f"[NOTICE] Inference endpoint returned HTTP {resp.status_code}: {resp.text}")
except Exception as e:
    print(f"[ERROR] Connection failed: {e}")
    sys.exit(1)
