"""Google sign-in and YouTube subscriptions (plan v3, step 3).

- Sign-in: the browser gets a signed ID token from Google Identity Services; we check it with Google's
  tokeninfo endpoint (audience = our client ID, issuer = Google, email verified, not expired).
- Subscriptions: the browser asks the user for read-only YouTube access once and hands us the short-lived
  access token. We read their subscriptions (subscriptions.list, mine=true) and never store the token.
"""

import time

import httpx

from app.config import get_settings

TOKENINFO = "https://oauth2.googleapis.com/tokeninfo"
SUBSCRIPTIONS = "https://www.googleapis.com/youtube/v3/subscriptions"
ISSUERS = {"accounts.google.com", "https://accounts.google.com"}
MAX_PAGES = 4  # 200 subscriptions; one quota unit per page


class GoogleError(Exception):
    pass


def verify_id_token(credential: str) -> dict:
    """Returns {"email", "sub"} for a valid Google ID token meant for this app, else raises GoogleError."""
    client_id = get_settings().google_client_id
    if not client_id:
        raise GoogleError("google_not_configured")
    try:
        r = httpx.post(TOKENINFO, data={"id_token": credential}, timeout=10)
    except httpx.TransportError as e:
        raise GoogleError("google_unreachable") from e
    if r.status_code != 200:
        raise GoogleError("invalid_token")
    info = r.json()
    if (
        info.get("aud") != client_id
        or info.get("iss") not in ISSUERS
        or str(info.get("email_verified")).lower() != "true"
        or int(info.get("exp", 0)) < time.time()
        or not info.get("email")
    ):
        raise GoogleError("invalid_token")
    return {"email": info["email"].lower(), "sub": info.get("sub", "")}


def subscription_channels(access_token: str) -> list[str]:
    """Channel IDs the user subscribes to on YouTube (up to 200)."""
    channels: list[str] = []
    page_token = None
    for _ in range(MAX_PAGES):
        params = {"part": "snippet", "mine": "true", "maxResults": 50}
        if page_token:
            params["pageToken"] = page_token
        try:
            r = httpx.get(SUBSCRIPTIONS, params=params, headers={"Authorization": f"Bearer {access_token}"}, timeout=15)
        except httpx.TransportError as e:
            raise GoogleError("google_unreachable") from e
        if r.status_code in (401, 403):
            raise GoogleError("google_denied")
        if r.status_code != 200:
            raise GoogleError("youtube_unavailable")
        body = r.json()
        for item in body.get("items", []):
            ch = item.get("snippet", {}).get("resourceId", {}).get("channelId")
            if ch:
                channels.append(ch)
        page_token = body.get("nextPageToken")
        if not page_token:
            break
    return list(dict.fromkeys(channels))
