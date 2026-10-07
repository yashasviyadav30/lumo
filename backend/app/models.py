"""Tables. Two kinds of data (plan 2.3):

- Our data (users, goals, mutes, follows, settings, logs): kept while the account lives.
- YouTube data (yt_* tables): every row has fetched_at and is purged after 30 days (R1).
  Anything of ours that points at a video stores the video ID only.
"""

import uuid
from datetime import date, datetime, timezone

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _user_fk() -> Mapped[uuid.UUID]:
    return mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True)


# ---------- Our data ----------


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    # We store only that the user confirmed being 18+, not their date of birth (data minimisation).
    adult_confirmed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    sessions: Mapped[list["AuthSession"]] = relationship(cascade="all, delete-orphan", passive_deletes=True)
    consents: Mapped[list["Consent"]] = relationship(cascade="all, delete-orphan", passive_deletes=True)
    goals: Mapped[list["Goal"]] = relationship(cascade="all, delete-orphan", passive_deletes=True)
    mutes: Mapped[list["Mute"]] = relationship(cascade="all, delete-orphan", passive_deletes=True)
    follows: Mapped[list["Follow"]] = relationship(cascade="all, delete-orphan", passive_deletes=True)
    settings: Mapped["UserSettings | None"] = relationship(
        cascade="all, delete-orphan", passive_deletes=True, uselist=False
    )


class AuthSession(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    # SHA-256 of the token; the token itself is never stored.
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    user: Mapped["User"] = relationship(viewonly=True)  # read-only: auth loads the user with the session


class Consent(Base):
    __tablename__ = "consents"

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    kind: Mapped[str] = mapped_column(String(40))  # "notice" now; "behaviour" in Stage 11
    version: Mapped[str] = mapped_column(String(20))
    granted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    withdrawn_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = _user_fk()
    raw_text: Mapped[str] = mapped_column(Text)
    parsed: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Mute(Base):
    """A user's own rule (R3): a channel ID or a phrase they chose."""

    __tablename__ = "mutes"
    __table_args__ = (UniqueConstraint("user_id", "kind", "value"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    kind: Mapped[str] = mapped_column(String(20))  # "channel" | "phrase"
    value: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Follow(Base):
    """A teacher the user chose to follow. Their channel is always in the user's feed."""

    __tablename__ = "follows"
    __table_args__ = (UniqueConstraint("user_id", "channel_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    channel_id: Mapped[str] = mapped_column(String(40))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    shorts_enabled: Mapped[bool] = mapped_column(Boolean, default=False)  # off by default for everyone
    shorts_daily_limit_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    search_language: Mapped[str] = mapped_column(String(8), default="en")
    hidden_groups: Mapped[list | None] = mapped_column(JSON, nullable=True)  # None = the default groups


class NotInterested(Base):
    """A video the user tapped "Not interested" on. Video ID only (R1)."""

    __tablename__ = "not_interested"
    __table_args__ = (UniqueConstraint("user_id", "video_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    video_id: Mapped[str] = mapped_column(String(11))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Feedback(Base):
    """What a user wrote with the in-app feedback button. Deleted with the account."""

    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    text: Mapped[str] = mapped_column(Text)
    page: Mapped[str] = mapped_column(String(40), default="")  # route template, e.g. /watch/:id (never a video ID)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class StudyGroup(Base):
    """A study group (plan v3, step 4). Joined by invite link. The creator moderates; if the creator leaves or
    deletes their account, the longest-standing member takes over."""

    __tablename__ = "study_groups"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(80))
    invite_code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    creator_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class GroupMember(Base):
    """Their membership, with the name the user chose for this group (other members never see their email)."""

    __tablename__ = "group_members"
    __table_args__ = (UniqueConstraint("group_id", "user_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    group_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("study_groups.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    name: Mapped[str] = mapped_column(String(40))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)  # for the unread badge


class GroupPost(Base):
    """A post in a group's feed (parent_id empty) or a reply in its thread. Deleted with its author's account."""

    __tablename__ = "group_posts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    group_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("study_groups.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    parent_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("group_posts.id", ondelete="CASCADE"), nullable=True, index=True)
    kind: Mapped[str] = mapped_column(String(10))  # note | doubt | video | reply
    text: Mapped[str] = mapped_column(Text, default="")
    video_id: Mapped[str | None] = mapped_column(String(11), nullable=True)  # video ID only; titles fetched fresh (R1)
    t_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    attach: Mapped[str | None] = mapped_column(String(10), nullable=True)  # notes | map: open the video on that tab
    answered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)  # doubts only
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class PostReport(Base):
    __tablename__ = "post_reports"
    __table_args__ = (UniqueConstraint("post_id", "user_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    post_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("group_posts.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class NoteImage(Base):
    """A screenshot pasted into their notepad. Compressed on the phone; deleted with the account."""

    __tablename__ = "note_images"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = _user_fk()
    mime: Mapped[str] = mapped_column(String(20))
    data: Mapped[bytes] = mapped_column(LargeBinary)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class AppLog(Base):
    """Request log kept in India for 1 year. Never holds video IDs or titles (R11)."""

    __tablename__ = "app_log"

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    actor: Mapped[str | None] = mapped_column(String(32), nullable=True)  # pseudonym, not the user ID
    method: Mapped[str] = mapped_column(String(8))
    route: Mapped[str] = mapped_column(String(120))  # route template, e.g. /api/me
    status: Mapped[int] = mapped_column(Integer)
    ms: Mapped[int] = mapped_column(Integer)
    ip_prefix: Mapped[str | None] = mapped_column(String(64), nullable=True)
    action: Mapped[str | None] = mapped_column(String(60), nullable=True)


class QuotaUsage(Base):
    """YouTube API calls per Pacific day and bucket (R12)."""

    __tablename__ = "quota_usage"

    day: Mapped[date] = mapped_column(Date, primary_key=True)
    bucket: Mapped[str] = mapped_column(String(20), primary_key=True)  # "search" | "general"
    count: Mapped[int] = mapped_column(Integer, default=0)


class Note(Base):
    """A mark, note or doubt at a second of a lecture. Our data: the video ID and the second, never YouTube's
    title (R1). An empty `text` is a mark the user hasn't filled in yet."""

    __tablename__ = "notes"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = _user_fk()
    video_id: Mapped[str] = mapped_column(String(11), index=True)
    t_seconds: Mapped[int] = mapped_column(Integer)
    kind: Mapped[str] = mapped_column(String(10), default="note")  # "note" | "doubt"
    tag: Mapped[str | None] = mapped_column(String(10), nullable=True)  # def | sec | pyq | trick
    starred: Mapped[bool] = mapped_column(Boolean, default=False)
    text: Mapped[str] = mapped_column(Text, default="")
    solved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)  # doubts
    answer: Mapped[str] = mapped_column(Text, default="")  # doubts: their own answer once solved
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class LectureProgress(Base):
    """Where the user stopped in a lecture, so the user can resume. Not kept for Made-for-Kids videos (R14)."""

    __tablename__ = "lecture_progress"
    __table_args__ = (UniqueConstraint("user_id", "video_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    video_id: Mapped[str] = mapped_column(String(11))
    position_s: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class StarredVideo(Base):
    """A video the user starred, shown in Library. Video ID only; the title is fetched fresh (R1)."""

    __tablename__ = "starred_videos"
    __table_args__ = (UniqueConstraint("user_id", "video_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    video_id: Mapped[str] = mapped_column(String(11))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class Notepad(Base):
    """Their free-form notes beside one lecture (rich text, stored as the editor's JSON). Their own words only."""

    __tablename__ = "notepads"
    __table_args__ = (UniqueConstraint("user_id", "video_id"),)

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = _user_fk()
    video_id: Mapped[str] = mapped_column(String(11))
    content: Mapped[str] = mapped_column(Text, default="")
    text: Mapped[str] = mapped_column(Text, default="")  # plain text copy, for search
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class Card(Base):
    """A recall card made from one of their notes by blanking words the user chose (their text only, R3/R4).
    It remembers the lecture second, so a forgotten card can replay just that part."""

    __tablename__ = "cards"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = _user_fk()
    note_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("notes.id", ondelete="CASCADE"), index=True)
    blanks: Mapped[list] = mapped_column(JSON)  # the words the user hid
    step: Mapped[int] = mapped_column(Integer, default=0)  # place on the review ladder
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    retired: Mapped[bool] = mapped_column(Boolean, default=False)
    reviews: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class CardReview(Base):
    """One review, kept only to show a gentle weekly count ("32 cards this week"). No streaks (R8)."""

    __tablename__ = "card_reviews"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = _user_fk()
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class AiNotes(Base):
    """Gemini-made notes and mind map for one video in one language, shared by everyone (plan v3).
    Made from the video itself, so treated like YouTube data: deleted 30 days after it was made (R1)."""

    __tablename__ = "ai_notes"

    video_id: Mapped[str] = mapped_column(String(11), primary_key=True)
    lang: Mapped[str] = mapped_column(String(8), primary_key=True)  # en | hi | auto
    status: Mapped[str] = mapped_column(String(10), default="queued")  # queued | ready | failed | too_long
    reason: Mapped[str | None] = mapped_column(String(20), nullable=True)  # busy | daily_limit, while queued
    data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    next_try_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


# ---------- YouTube data (purged after 30 days, R1) ----------


class YtVideo(Base):
    __tablename__ = "yt_videos"

    video_id: Mapped[str] = mapped_column(String(11), primary_key=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    channel_id: Mapped[str] = mapped_column(String(40), index=True)
    channel_title: Mapped[str] = mapped_column(String(200), default="")
    title: Mapped[str] = mapped_column(String(300), default="")
    description: Mapped[str] = mapped_column(Text, default="")  # displayed and parsed for chapters only
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    thumbnail_url: Mapped[str] = mapped_column(String(300), default="")
    duration_s: Mapped[int | None] = mapped_column(Integer, nullable=True)
    category_id: Mapped[str | None] = mapped_column(String(8), nullable=True)
    topic_categories: Mapped[list | None] = mapped_column(JSON, nullable=True)
    age_restricted: Mapped[bool] = mapped_column(Boolean, default=False)
    embeddable: Mapped[bool] = mapped_column(Boolean, default=True)
    made_for_kids: Mapped[bool] = mapped_column(Boolean, default=False)
    blocked_in_india: Mapped[bool] = mapped_column(Boolean, default=False)
    has_captions: Mapped[bool] = mapped_column(Boolean, default=False)
    live: Mapped[str] = mapped_column(String(12), default="none")  # none | live | upcoming
    vertical: Mapped[bool | None] = mapped_column(Boolean, nullable=True)  # from YouTube's embed size


class YtSearchCache(Base):
    __tablename__ = "yt_search_cache"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)  # hash of normalised query + language
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    video_ids: Mapped[list] = mapped_column(JSON)
    etag: Mapped[str | None] = mapped_column(String(120), nullable=True)


class YtComments(Base):
    """Top YouTube comments for a video, shown as YouTube gives them. Refreshed after 24 h, deleted after 30 days (R1)."""

    __tablename__ = "yt_comments"

    video_id: Mapped[str] = mapped_column(String(11), primary_key=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    items: Mapped[list] = mapped_column(JSON)
    disabled: Mapped[bool] = mapped_column(Boolean, default=False)
