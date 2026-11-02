import asyncio
import io
from PIL import Image
from backend.main import app
from httpx import AsyncClient, ASGITransport

async def test_image_scan():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a test synthetic-looking image
        img = Image.new("RGB", (200, 200), color=(104, 27, 40))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        buf.seek(0)

        files = {"file": ("test_canvas.jpg", buf.getvalue(), "image/jpeg")}
        data = {"media_type": "image"}
        res = await client.post("/api/scans", files=files, data=data)
        assert res.status_code == 201, f"Image scan failed: {res.text}"
        scan = res.json()
        print("[PASS] Image Scan Succeeded!")
        print("Scan ID:", scan["id"])
        print("Verdict:", scan["verdict"])
        print("Provider:", scan["provider"])
        print("Indicators Count:", len(scan["forensic_results"]["indicators"]))
        print("AI Probability:", scan["confidence_metrics"]["ai_probability"])

if __name__ == "__main__":
    asyncio.run(test_image_scan())
