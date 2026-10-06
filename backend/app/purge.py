"""Retention jobs.

- YouTube data older than 30 days is deleted (R1, plan 2.4), and so are AI notes made from videos.
- Request logs older than 1 year are deleted (plan 2.6).

Runs at startup and every 6 hours while the app is awake. Render's free plan sleeps when idle, so reads
also ignore stale YouTube rows (see youtube.py), which keeps R1 true even if a run is missed.
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.db import session_factory
from app.models import AiNotes, AppLog, AuthSession, YtComments, YtSearchCache, YtVideo

log = logging.getLogger("app.purge")

YOUTUBE_MAX_AGE = timedelta(days=30)
LOG_MAX_AGE = timedelta(days=365)
INTERVAL_SECONDS = 6 * 60 * 60


def purge(db: Session, now: datetime | None = None) -> dict[str, int]:
    now = now or datetime.now(timezone.utc)
    yt_cutoff = now - YOUTUBE_MAX_AGE
    counts = {
        "yt_videos": db.execute(delete(YtVideo).where(YtVideo.fetched_at < yt_cutoff)).rowcount,
        "yt_search_cache": db.execute(delete(YtSearchCache).where(YtSearchCache.fetched_at < yt_cutoff)).rowcount,
        "yt_comments": db.execute(delete(YtComments).where(YtComments.fetched_at < yt_cutoff)).rowcount,
        "ai_notes": db.execute(delete(AiNotes).where(AiNotes.updated_at < yt_cutoff)).rowcount,
        "auth_sessions": db.execute(delete(AuthSession).where(AuthSession.expires_at < now)).rowcount,
        "app_log": db.execute(delete(AppLog).where(AppLog.at < now - LOG_MAX_AGE)).rowcount,
    }
    db.commit()
    return counts


def run_once() -> None:
    factory = session_factory()
    if factory is None:
        return
    try:
        with factory() as db:
            counts = purge(db)
        log.info("purge done: %s", counts)
    except Exception:
        log.exception("purge failed")


async def purge_loop() -> None:
    while True:
        await asyncio.to_thread(run_once)
        await asyncio.sleep(INTERVAL_SECONDS)
