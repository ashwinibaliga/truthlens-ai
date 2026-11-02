import asyncio
from backend.main import app
from httpx import AsyncClient, ASGITransport

async def run_tests():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        data = res.json()
        print("[PASS] Health Check Passed:", data)

        # 2. Text Analysis test
        sample_text = (
            "Furthermore, it is important to note that artificial intelligence has become a crucial "
            "cornerstone in today's fast-paced world. Moreover, navigating the multifaceted landscape "
            "of technological innovation allows organizations to delve deeper into seamless integration, "
            "serving as a vibrant testament to modern digital advancement. In conclusion, fostering this "
            "synergy remains pivotal."
        )
        res = await client.post("/api/text/analyze", json={"text": sample_text, "title": "Test AI Article"})
        assert res.status_code == 201, f"Text analysis failed: {res.text}"
        scan = res.json()
        scan_id = scan["id"]
        print("[PASS] Text Analysis Passed. Verdict:", scan["verdict"], "| AI Prob:", scan["confidence_metrics"]["ai_probability"])

        # 3. List Scans
        res = await client.get("/api/scans")
        assert res.status_code == 200
        scans_list = res.json()
        assert len(scans_list) >= 1
        print("[PASS] List Scans Passed. Count:", len(scans_list))

        # 4. Get Scan by ID
        res = await client.get(f"/api/scans/{scan_id}")
        assert res.status_code == 200
        assert res.json()["id"] == scan_id
        print("[PASS] Get Scan by ID Passed.")

        # 5. Stats
        res = await client.get("/api/stats")
        assert res.status_code == 200
        stats = res.json()
        assert stats["total_scans"] >= 1
        print("[PASS] Stats Endpoint Passed:", stats)

        # 6. Providers
        res = await client.get("/api/providers")
        assert res.status_code == 200
        providers = res.json()
        print("[PASS] Providers Status Passed. Number of providers:", len(providers))

        print("\nALL BACKEND API TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
