import asyncio
from backend.main import app
from httpx import AsyncClient, ASGITransport

async def test_auth_isolation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Unauthenticated /api/auth/me should return 401
        res = await client.get("/api/auth/me")
        assert res.status_code == 401, f"Expected 401 for unauthenticated /me, got {res.status_code}"
        print("[PASS] Unauthenticated access blocked (401)")

        # 2. Authenticated user A profile
        token_a = "dev-session-user_aaa:alice@truthlens.ai:Alice Vance"
        headers_a = {"Authorization": f"Bearer {token_a}"}
        res = await client.get("/api/auth/me", headers=headers_a)
        assert res.status_code == 200
        user_a = res.json()
        assert user_a["id"] == "user_aaa"
        assert user_a["email"] == "alice@truthlens.ai"
        assert user_a["full_name"] == "Alice Vance"
        print("[PASS] User A profile verified:", user_a)

        # 3. Authenticated user B profile
        token_b = "dev-session-user_bbb:bob@truthlens.ai:Bob Thorne"
        headers_b = {"Authorization": f"Bearer {token_b}"}
        res = await client.get("/api/auth/me", headers=headers_b)
        assert res.status_code == 200
        user_b = res.json()
        assert user_b["id"] == "user_bbb"
        print("[PASS] User B profile verified:", user_b)

        # 4. User A creates a text scan
        text_a = "In conclusion, it is important to delve deeply into the multifaceted tapestry of artificial intelligence."
        res = await client.post("/api/text/analyze", json={"text": text_a, "title": "Alice AI Draft"}, headers=headers_a)
        assert res.status_code == 201
        scan_a = res.json()
        assert scan_a["user_id"] == "user_aaa"
        print("[PASS] Scan A created with user_id:", scan_a["user_id"])

        # 5. User B creates a text scan
        text_b = "We walked four miles in heavy rain to catch the midnight ferry from Dover. A bitter wind blew across the channel."
        res = await client.post("/api/text/analyze", json={"text": text_b, "title": "Bob Travelogue"}, headers=headers_b)
        assert res.status_code == 201
        scan_b = res.json()
        assert scan_b["user_id"] == "user_bbb"
        print("[PASS] Scan B created with user_id:", scan_b["user_id"])

        # 6. User A lists scans -> only sees User A's scans (or legacy nulls)
        res = await client.get("/api/scans", headers=headers_a)
        assert res.status_code == 200
        scans_a = res.json()
        ids_in_a = [s["id"] for s in scans_a]
        assert scan_a["id"] in ids_in_a, "Alice should see her scan"
        assert scan_b["id"] not in ids_in_a, "Alice MUST NOT see Bob's scan"
        print("[PASS] User isolation verified in scan listing!")

        # 7. User A attempts to delete Bob's scan -> Access Denied (404)
        res = await client.delete(f"/api/scans/{scan_b['id']}", headers=headers_a)
        assert res.status_code == 404, "Alice cannot delete Bob's scan"
        print("[PASS] Cross-user deletion prevented (404 Access Denied)")

        # 8. User B deletes Bob's scan -> Success
        res = await client.delete(f"/api/scans/{scan_b['id']}", headers=headers_b)
        assert res.status_code == 200
        print("[PASS] Owner deletion succeeded!")

        print("\nALL AUTHENTICATION & ISOLATION TESTS PASSED!")

if __name__ == "__main__":
    asyncio.run(test_auth_isolation())

