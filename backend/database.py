import json
import sqlite3
import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from backend.config import settings

# Check if Supabase client is available and configured
supabase_client = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY and "supabase.co" in settings.SUPABASE_URL:
    try:
        from supabase import create_client, Client
        supabase_client: Optional[Client] = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        print("[Database] Successfully initialized Supabase PostgreSQL client.")
    except Exception as e:
        print(f"[Database] Could not initialize Supabase client ({e}). Falling back to SQLite.")

# SQLite fallback initialization
DB_PATH = os.path.join(os.path.dirname(__file__), "truthlens.db")

def init_sqlite_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        filename TEXT NOT NULL,
        media_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        status TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_job_id TEXT,
        verdict TEXT NOT NULL,
        confidence_metrics TEXT NOT NULL,
        forensic_results TEXT NOT NULL,
        created_at TEXT NOT NULL,
        completed_at TEXT
    );
    """)
    # Check if user_id column exists in existing DB
    cursor.execute("PRAGMA table_info(scans)")
    columns = [col[1] for col in cursor.fetchall()]
    if "user_id" not in columns:
        cursor.execute("ALTER TABLE scans ADD COLUMN user_id TEXT")
    conn.commit()
    conn.close()

init_sqlite_db()

def _serialize_scan(data: Dict[str, Any]) -> Dict[str, Any]:
    """Helper to convert complex dictionary values for storage."""
    row = dict(data)
    if "id" not in row or not row["id"]:
        row["id"] = str(uuid.uuid4())
    if "created_at" not in row or not row["created_at"]:
        row["created_at"] = datetime.now(timezone.utc).isoformat()
    elif isinstance(row["created_at"], datetime):
        row["created_at"] = row["created_at"].isoformat()
    if isinstance(row.get("completed_at"), datetime):
        row["completed_at"] = row["completed_at"].isoformat()
    return row

def _deserialize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    """Deserialize JSON columns from database."""
    item = dict(row)
    if isinstance(item.get("confidence_metrics"), str):
        try:
            item["confidence_metrics"] = json.loads(item["confidence_metrics"])
        except Exception:
            pass
    if isinstance(item.get("forensic_results"), str):
        try:
            item["forensic_results"] = json.loads(item["forensic_results"])
        except Exception:
            pass
    return item

async def db_create_scan(scan_data: Dict[str, Any]) -> Dict[str, Any]:
    item = _serialize_scan(scan_data)
    
    # Store in Supabase if configured
    if supabase_client:
        try:
            db_payload = {
                "id": item["id"],
                "user_id": item.get("user_id"),
                "filename": item["filename"],
                "media_type": item["media_type"],
                "file_size": item["file_size"],
                "status": item["status"],
                "provider": item["provider"],
                "provider_job_id": item.get("provider_job_id"),
                "verdict": item["verdict"],
                "confidence_metrics": item["confidence_metrics"] if isinstance(item["confidence_metrics"], dict) else json.loads(item["confidence_metrics"]),
                "forensic_results": item["forensic_results"] if isinstance(item["forensic_results"], dict) else json.loads(item["forensic_results"]),
                "created_at": item["created_at"],
                "completed_at": item.get("completed_at")
            }
            res = supabase_client.table("scans").insert(db_payload).execute()
            if res.data and len(res.data) > 0:
                return _deserialize_row(res.data[0])
        except Exception as e:
            print(f"[Supabase Write Error] {e}. Falling back to SQLite local storage.")

    # SQLite fallback
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO scans (
            id, user_id, filename, media_type, file_size, status, provider,
            provider_job_id, verdict, confidence_metrics, forensic_results,
            created_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        item["id"],
        item.get("user_id"),
        item["filename"],
        item["media_type"],
        item["file_size"],
        item["status"],
        item["provider"],
        item.get("provider_job_id"),
        item["verdict"],
        json.dumps(item["confidence_metrics"]) if isinstance(item["confidence_metrics"], (dict, list)) else str(item["confidence_metrics"]),
        json.dumps(item["forensic_results"]) if isinstance(item["forensic_results"], (dict, list)) else str(item["forensic_results"]),
        item["created_at"],
        item.get("completed_at")
    ))
    conn.commit()
    conn.close()
    return _deserialize_row(item)

async def db_get_scan(scan_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    if supabase_client:
        try:
            query = supabase_client.table("scans").select("*").eq("id", scan_id)
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            if res.data and len(res.data) > 0:
                return _deserialize_row(res.data[0])
        except Exception as e:
            print(f"[Supabase Read Error] {e}. Checking SQLite fallback.")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM scans WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (scan_id, user_id))
    else:
        cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return _deserialize_row(dict(row))
    return None

async def db_list_scans(
    user_id: Optional[str] = None,
    media_type: Optional[str] = None,
    verdict: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> List[Dict[str, Any]]:
    if supabase_client:
        try:
            query = supabase_client.table("scans").select("*").order("created_at", desc=True).range(offset, offset + limit - 1)
            if user_id:
                query = query.eq("user_id", user_id)
            if media_type:
                query = query.eq("media_type", media_type)
            if verdict:
                query = query.eq("verdict", verdict)
            if status:
                query = query.eq("status", status)
            res = query.execute()
            if res.data is not None:
                return [_deserialize_row(item) for item in res.data]
        except Exception as e:
            print(f"[Supabase List Error] {e}. Querying SQLite fallback.")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    query = "SELECT * FROM scans WHERE 1=1"
    params = []
    if user_id:
        query += " AND (user_id = ? OR user_id IS NULL)"
        params.append(user_id)
    if media_type:
        query += " AND media_type = ?"
        params.append(media_type)
    if verdict:
        query += " AND verdict = ?"
        params.append(verdict)
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [_deserialize_row(dict(row)) for row in rows]

async def db_delete_scan(scan_id: str, user_id: Optional[str] = None) -> bool:
    deleted = False
    if supabase_client:
        try:
            query = supabase_client.table("scans").delete().eq("id", scan_id)
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            if res.data:
                deleted = True
        except Exception as e:
            print(f"[Supabase Delete Error] {e}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    if user_id:
        cursor.execute("DELETE FROM scans WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (scan_id, user_id))
    else:
        cursor.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    if cursor.rowcount > 0:
        deleted = True
    conn.commit()
    conn.close()
    return deleted

async def db_get_stats(user_id: Optional[str] = None) -> Dict[str, Any]:
    scans = await db_list_scans(user_id=user_id, limit=500)
    total = len(scans)
    ai_count = sum(1 for s in scans if s.get("verdict") == "likely_ai")
    human_count = sum(1 for s in scans if s.get("verdict") == "likely_human")
    manipulated_count = sum(1 for s in scans if s.get("verdict") == "potentially_manipulated")
    inconclusive_count = sum(1 for s in scans if s.get("verdict") == "inconclusive")
    
    by_type = {
        "image": sum(1 for s in scans if s.get("media_type") == "image"),
        "audio": sum(1 for s in scans if s.get("media_type") == "audio"),
        "video": sum(1 for s in scans if s.get("media_type") == "video"),
        "text": sum(1 for s in scans if s.get("media_type") == "text"),
    }
    
    recent_activity = [
        {
            "id": s["id"],
            "filename": s["filename"],
            "media_type": s["media_type"],
            "verdict": s["verdict"],
            "ai_probability": s.get("confidence_metrics", {}).get("ai_probability", 0),
            "created_at": s["created_at"],
            "provider": s.get("provider", "TruthLens")
        }
        for s in scans[:10]
    ]

    return {
        "total_scans": total,
        "ai_detected_count": ai_count,
        "human_detected_count": human_count,
        "manipulated_count": manipulated_count,
        "inconclusive_count": inconclusive_count,
        "by_media_type": by_type,
        "recent_activity": recent_activity
    }
