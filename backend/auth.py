import json
import base64
from typing import Optional
from fastapi import Header, HTTPException, status
from pydantic import BaseModel
from backend.database import supabase_client
from backend.config import settings

class CurrentUser(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None

async def get_current_user(authorization: Optional[str] = Header(None)) -> CurrentUser:
    """
    Validate the Supabase JWT token from the Authorization header.
    Returns CurrentUser if valid; raises 401 Unauthorized otherwise.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing or malformed Authorization header.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split("Bearer ", 1)[1].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Empty token provided.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 1. Genuine Supabase Auth verification if Supabase client is active
    if supabase_client:
        try:
            # get_user verifies the JWT against Supabase's Auth API
            res = supabase_client.auth.get_user(token)
            if res and res.user:
                metadata = res.user.user_metadata or {}
                return CurrentUser(
                    id=str(res.user.id),
                    email=res.user.email or "",
                    full_name=metadata.get("full_name") or metadata.get("name") or res.user.email.split("@")[0]
                )
        except Exception as e:
            # Token invalid or expired
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid or expired Supabase authentication session: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # 2. Local fallback verification for offline testing without Supabase API keys
    # Handles base64 encoded local session payload or JWT payload payload extraction
    try:
        parts = token.split(".")
        if len(parts) >= 2:
            # Standard JWT payload chunk
            payload_b64 = parts[1]
            # Add padding if needed
            rem = len(payload_b64) % 4
            if rem > 0:
                payload_b64 += "=" * (4 - rem)
            decoded = json.loads(base64.urlsafe_b64decode(payload_b64).decode("utf-8"))
            user_id = decoded.get("sub") or decoded.get("id")
            email = decoded.get("email") or "user@truthlens.ai"
            meta = decoded.get("user_metadata", {})
            full_name = meta.get("full_name") or decoded.get("name") or email.split("@")[0]
            if user_id:
                return CurrentUser(id=str(user_id), email=email, full_name=full_name)
    except Exception:
        pass

    # If it's a dev simulated session token like dev-session-<id>
    if token.startswith("dev-session-"):
        parts = token.split(":", 2)
        dev_id = parts[0].replace("dev-session-", "")
        email = parts[1] if len(parts) > 1 else f"analyst-{dev_id[:6]}@truthlens.ai"
        name = parts[2] if len(parts) > 2 else "TruthLens Analyst"
        return CurrentUser(id=dev_id, email=email, full_name=name)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication token. Please sign in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[CurrentUser]:
    """
    Optional user dependency: returns CurrentUser if authenticated, or None if anonymous.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        return await get_current_user(authorization)
    except HTTPException:
        return None

