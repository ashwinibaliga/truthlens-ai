import asyncio
import io
import wave
import struct
from backend.main import app
from httpx import AsyncClient, ASGITransport

async def test_audio_scan():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a test audio WAV file
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(16000)
            # 1 second of audio
            wf.writeframes(struct.pack('<' + ('h' * 16000), *([0] * 16000)))
        buf.seek(0)

        files = {"file": ("sample_recording.wav", buf.getvalue(), "audio/wav")}
        data = {"media_type": "audio"}
        res = await client.post("/api/scans", files=files, data=data)
        assert res.status_code == 201, f"Audio scan failed: {res.text}"
        scan = res.json()
        print("[PASS] Audio Scan Succeeded!")
        print("Scan ID:", scan["id"])
        print("Verdict:", scan["verdict"])
        print("Provider:", scan["provider"])
        print("AI Probability:", scan["confidence_metrics"]["ai_probability"])

if __name__ == "__main__":
    asyncio.run(test_audio_scan())

