"""Sign-up (18+ only), sign-in, sign-out, "my data" and "delete my data" (plan 2.1, 2.2, 2.5, 2.7)."""

import time
from collections import defaultdict, deque
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import current_session, current_user
from app.db import get_db
from app.filters import CATEGORY_GROUPS, DEFAULT_HIDDEN_GROUPS
from app.models import AuthSession, Consent, Feedback, User, UserSettings
from app.security import hash_password, hash_token, new_token, pseudonym, verify_password

router = APIRouter(prefix="/api", tags=["accounts"])

NOTICE_VERSION = "v1"
SESSION_LIFETIME = timedelta(days=60)
INDIA = ZoneInfo("Asia/Kolkata")


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
    date_of_birth: date  # used once for the 18+ check, never stored
    accepted_notice: bool  # the first-run notice (plan 2.7)


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(max_length=200)


class SettingsOut(BaseModel):
    shorts_enabled: bool
    shorts_daily_limit_min: int | None
    search_language: str
    hidden_groups: list[str]


class MeOut(BaseModel):
    email: str
    created_at: datetime
    settings: SettingsOut


class TokenOut(BaseModel):
    token: str
    me: MeOut


def age_on(dob: date, today: date) -> int:
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def today_in_india() -> date:
    return datetime.now(INDIA).date()


# Small in-memory limit on sign-in attempts per IP + email. Enough for a prototype on one instance.
_attempts: dict[str, deque[float]] = defaultdict(deque)
MAX_ATTEMPTS, WINDOW_S = 5, 60


def _too_many(key: str) -> bool:
    now = time.monotonic()
    q = _attempts[key]
    while q and now - q[0] > WINDOW_S:
        q.popleft()
    if len(q) >= MAX_ATTEMPTS:
        return True
    q.append(now)
    return False


def _me(user: User) -> MeOut:
    s = user.settings or UserSettings(shorts_enabled=False, shorts_daily_limit_min=None, search_language="en")
    return MeOut(
        email=user.email,
        created_at=user.created_at,
        settings=SettingsOut(
            shorts_enabled=s.shorts_enabled,
            shorts_daily_limit_min=s.shorts_daily_limit_min,
            search_language=s.search_language,
            hidden_groups=sorted(DEFAULT_HIDDEN_GROUPS if s.hidden_groups is None else s.hidden_groups),
        ),
    )


def _start_session(db: Session, user: User) -> str:
    token = new_token()
    db.add(
        AuthSession(
            user_id=user.id,
            token_hash=hash_token(token),
            expires_at=datetime.now(timezone.utc) + SESSION_LIFETIME,
        )
    )
    return token


@router.post("/auth/signup", response_model=TokenOut, status_code=201)
def signup(body: SignupIn, request: Request, db: Session = Depends(get_db)) -> TokenOut:
    request.state.action = "signup"
    today = today_in_india()
    if body.date_of_birth > today or body.date_of_birth.year < 1900:
        raise HTTPException(status_code=422, detail="invalid_date_of_birth")
    if age_on(body.date_of_birth, today) < 18:
        # R10: refuse, and store nothing about this person (no row, no email in the log).
        request.state.action = "signup_refused_under_18"
        raise HTTPException(status_code=403, detail="under_18")
    if not body.accepted_notice:
        raise HTTPException(status_code=422, detail="notice_not_accepted")

    now = datetime.now(timezone.utc)
    user = User(email=body.email.lower(), password_hash=hash_password(body.password), adult_confirmed_at=now)
    user.settings = UserSettings(shorts_enabled=False, shorts_daily_limit_min=None, search_language="en")
    user.consents.append(Consent(kind="notice", version=NOTICE_VERSION, granted_at=now))
    db.add(user)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="email_taken") from None
    token = _start_session(db, user)
    db.commit()
    request.state.actor = pseudonym(user.id)
    return TokenOut(token=token, me=_me(user))


@router.post("/auth/login", response_model=TokenOut)
def login(body: LoginIn, request: Request, db: Session = Depends(get_db)) -> TokenOut:
    request.state.action = "login"
    ip = request.headers.get("x-forwarded-for") or (request.client.host if request.client else "")
    if _too_many(f"{ip}|{body.email.lower()}"):
        raise HTTPException(status_code=429, detail="too_many_attempts")
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    if user is None or not verify_password(user.password_hash, body.password):
        raise HTTPException(status_code=401, detail="wrong_email_or_password")
    token = _start_session(db, user)
    db.commit()
    request.state.actor = pseudonym(user.id)
    return TokenOut(token=token, me=_me(user))


@router.post("/auth/logout", status_code=204)
def logout(request: Request, session: AuthSession = Depends(current_session), db: Session = Depends(get_db)) -> None:
    request.state.action = "logout"
    db.execute(delete(AuthSession).where(AuthSession.id == session.id))
    db.commit()


class SettingsIn(BaseModel):
    shorts_enabled: bool | None = None
    hidden_groups: list[str] | None = Field(default=None, max_length=len(CATEGORY_GROUPS))


@router.post("/me/settings", response_model=MeOut)
def update_settings(body: SettingsIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> MeOut:
    if user.settings is None:
        user.settings = UserSettings(shorts_enabled=False, shorts_daily_limit_min=None, search_language="en")
    if body.shorts_enabled is not None:
        user.settings.shorts_enabled = body.shorts_enabled
    if body.hidden_groups is not None:
        if not set(body.hidden_groups) <= CATEGORY_GROUPS.keys():
            raise HTTPException(status_code=422, detail="unknown_group")
        user.settings.hidden_groups = sorted(set(body.hidden_groups))
    db.commit()
    return _me(user)


FEEDBACK_PAGES = r"^(|/|/search|/shorts|/library|/personal|/settings|/watch/:id|/groups|/groups/:id)$"


class FeedbackIn(BaseModel):
    text: str = Field(min_length=3, max_length=2000)
    page: str = Field(default="", pattern=FEEDBACK_PAGES)  # a known route template only, never an ID (R11)


@router.post("/feedback", status_code=201)
def feedback(body: FeedbackIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "feedback"
    db.add(Feedback(user_id=user.id, text=body.text.strip(), page=body.page))
    db.commit()
    return {"ok": True}


@router.get("/me", response_model=MeOut)
def me(user: User = Depends(current_user)) -> MeOut:
    return _me(user)


@router.delete("/me")
def delete_me(request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    """Deletes the account and all its data at once (R2 allows up to 7 days; we don't wait)."""
    request.state.action = "account_deleted"
    db.delete(user)
    db.commit()
    return {
        "deleted": True,
        "note": "Your account and everything we stored for it are deleted. This doesn't delete anything on YouTube.",
    }
