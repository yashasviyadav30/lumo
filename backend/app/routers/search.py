"""POST /api/search, plus the user's own rules: mutes and followed teachers."""

import re

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import current_user
from app.config import get_settings
from app.db import get_db
from app.fields import curated_channel_ids
from app.filters import UserRules
from app.models import Follow, Mute, User
from app.search import run_search
from app.youtube import YouTubeClient, YouTubeError

router = APIRouter(prefix="/api", tags=["search"])

CHANNEL_ID = re.compile(r"^UC[0-9A-Za-z_-]{22}$")
LANGUAGES = {"en", "hi"}


def get_youtube() -> YouTubeClient:
    key = get_settings().youtube_api_key
    if not key:
        raise HTTPException(status_code=503, detail="youtube_not_configured")
    return YouTubeClient(key)


def rules_for(db: Session, user: User) -> UserRules:
    mutes = list(db.scalars(select(Mute).where(Mute.user_id == user.id)))
    follows = set(db.scalars(select(Follow.channel_id).where(Follow.user_id == user.id)))
    s = user.settings
    return UserRules(
        muted_channels={m.value for m in mutes if m.kind == "channel"},
        muted_phrases=[m.value for m in mutes if m.kind == "phrase"],
        shorts_enabled=bool(s and s.shorts_enabled),
        trusted_channels=set(curated_channel_ids()) | follows,
    )


class SearchIn(BaseModel):
    # In the body, not the URL, so search text never reaches any request log (R11).
    q: str = Field(min_length=1, max_length=200)
    language: str | None = None


@router.post("/search")
def search(
    body: SearchIn,
    request: Request,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
    yt: YouTubeClient = Depends(get_youtube),
) -> dict:
    request.state.action = "search"
    language = body.language if body.language in LANGUAGES else (user.settings.search_language if user.settings else "en")
    try:
        out = run_search(db, yt, body.q, language, rules_for(db, user))
    except YouTubeError:
        raise HTTPException(status_code=502, detail="youtube_unavailable") from None
    return {
        "mode": out.mode,
        "results": out.results,
        "hidden": out.hidden,
        "hidden_count": len(out.hidden),
        "searches_left": out.searches_left,
        "note": out.note,
        "timings_ms": out.timings_ms,
    }


class MuteIn(BaseModel):
    kind: str = Field(pattern="^(channel|phrase)$")
    value: str = Field(min_length=2, max_length=200)


class FollowIn(BaseModel):
    channel_id: str


@router.get("/mutes")
def list_mutes(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[dict]:
    return [{"kind": m.kind, "value": m.value} for m in db.scalars(select(Mute).where(Mute.user_id == user.id))]


@router.post("/mutes", status_code=201)
def add_mute(body: MuteIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    value = body.value.strip()
    if body.kind == "channel" and not CHANNEL_ID.match(value):
        raise HTTPException(status_code=422, detail="invalid_channel_id")
    db.add(Mute(user_id=user.id, kind=body.kind, value=value))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # already muted: fine
    return {"kind": body.kind, "value": value}


@router.post("/mutes/remove", status_code=204)
def remove_mute(body: MuteIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    db.execute(delete(Mute).where(Mute.user_id == user.id, Mute.kind == body.kind, Mute.value == body.value.strip()))
    db.commit()


@router.get("/follows")
def list_follows(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[str]:
    return list(db.scalars(select(Follow.channel_id).where(Follow.user_id == user.id)))


@router.post("/follows", status_code=201)
def add_follow(body: FollowIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    if not CHANNEL_ID.match(body.channel_id):
        raise HTTPException(status_code=422, detail="invalid_channel_id")
    db.add(Follow(user_id=user.id, channel_id=body.channel_id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
    return {"channel_id": body.channel_id}


@router.post("/follows/remove", status_code=204)
def remove_follow(body: FollowIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    db.execute(delete(Follow).where(Follow.user_id == user.id, Follow.channel_id == body.channel_id))
    db.commit()
