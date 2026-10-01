"""Study companion API: notes beside a lecture, resume, notebook, doubts and cards.

Video IDs always travel in request bodies, never in URLs, so they can't reach any request log (R11).
Notes, progress and cards store the video ID and seconds only; titles are fetched fresh (R1).
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.auth import current_user
from app.config import get_settings
from app.db import get_db
from app.models import Card, LectureProgress, Note, User
from app.search import _details, video_card
from app.study import card_front, now, replay_window, schedule, word_in
from app.youtube import YouTubeClient, YouTubeError

router = APIRouter(prefix="/api", tags=["study"])

VIDEO_ID = r"^[A-Za-z0-9_-]{11}$"
TAGS = {"def", "sec", "pyq", "trick"}


def youtube_optional() -> YouTubeClient | None:
    key = get_settings().youtube_api_key
    return YouTubeClient(key) if key else None


def lecture_info(db: Session, yt: YouTubeClient | None, ids: list[str]) -> dict[str, dict]:
    """Fresh YouTube details for display (cached up to 24 h, never kept past 30 days). Empty if YouTube is unavailable."""
    ids = list(dict.fromkeys(ids))
    if not ids or yt is None:
        return {}
    try:
        return {k: video_card(v) | {"made_for_kids": v.made_for_kids} for k, v in _details(db, yt, ids, datetime.now(timezone.utc)).items()}
    except YouTubeError:
        return {}


def note_view(n: Note, card_count: int = 0) -> dict:
    return {
        "id": str(n.id),
        "video_id": n.video_id,
        "t_seconds": n.t_seconds,
        "kind": n.kind,
        "tag": n.tag,
        "starred": n.starred,
        "text": n.text,
        "solved": n.solved_at is not None,
        "answer": n.answer,
        "cards": card_count,
        "created_at": n.created_at.isoformat(),
    }


def _own_note(db: Session, user: User, note_id: uuid.UUID) -> Note:
    note = db.get(Note, note_id)
    if note is None or note.user_id != user.id:
        raise HTTPException(status_code=404, detail="note_not_found")
    return note


def _card_counts(db: Session, note_ids: list[uuid.UUID]) -> dict[uuid.UUID, int]:
    if not note_ids:
        return {}
    rows = db.execute(
        select(Card.note_id, func.count()).where(Card.note_id.in_(note_ids), Card.retired.is_(False)).group_by(Card.note_id)
    )
    return dict(rows.all())


# ---------- the study page ----------


class VideoIn(BaseModel):
    video_id: str = Field(pattern=VIDEO_ID)


@router.post("/study/open")
def open_lecture(body: VideoIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db),
                 yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    request.state.action = "study_open"
    notes = list(db.scalars(select(Note).where(Note.user_id == user.id, Note.video_id == body.video_id).order_by(Note.t_seconds)))
    counts = _card_counts(db, [n.id for n in notes])
    progress = db.scalar(select(LectureProgress).where(LectureProgress.user_id == user.id, LectureProgress.video_id == body.video_id))
    info = lecture_info(db, yt, [body.video_id]).get(body.video_id)
    return {
        "video": info,
        "position_s": progress.position_s if progress else 0,
        "notes": [note_view(n, counts.get(n.id, 0)) for n in notes],
    }


class NoteIn(BaseModel):
    video_id: str = Field(pattern=VIDEO_ID)
    t_seconds: int = Field(ge=0, le=60 * 60 * 24)
    kind: str = Field(default="note", pattern="^(note|doubt)$")
    tag: str | None = None
    starred: bool = False
    text: str = Field(default="", max_length=2000)


@router.post("/notes", status_code=201)
def add_note(body: NoteIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "note_add"
    if body.tag is not None and body.tag not in TAGS:
        raise HTTPException(status_code=422, detail="invalid_tag")
    note = Note(user_id=user.id, video_id=body.video_id, t_seconds=body.t_seconds, kind=body.kind, tag=body.tag,
                starred=body.starred, text=body.text.strip())
    db.add(note)
    db.commit()
    return note_view(note)


class NoteUpdate(BaseModel):
    id: uuid.UUID
    text: str | None = Field(default=None, max_length=2000)
    tag: str | None = None
    clear_tag: bool = False
    starred: bool | None = None
    solved: bool | None = None
    answer: str | None = Field(default=None, max_length=2000)


@router.post("/notes/update")
def update_note(body: NoteUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    note = _own_note(db, user, body.id)
    if body.text is not None:
        note.text = body.text.strip()
    if body.clear_tag:
        note.tag = None
    elif body.tag is not None:
        if body.tag not in TAGS:
            raise HTTPException(status_code=422, detail="invalid_tag")
        note.tag = body.tag
    if body.starred is not None:
        note.starred = body.starred
    if body.answer is not None:
        note.answer = body.answer.strip()
    if body.solved is not None:
        note.solved_at = now() if body.solved else None
    note.updated_at = now()
    db.commit()
    return note_view(note, _card_counts(db, [note.id]).get(note.id, 0))


class IdIn(BaseModel):
    id: uuid.UUID


@router.post("/notes/delete", status_code=204)
def delete_note(body: IdIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    db.delete(_own_note(db, user, body.id))
    db.commit()


class ProgressIn(BaseModel):
    video_id: str = Field(pattern=VIDEO_ID)
    position_s: int = Field(ge=0, le=60 * 60 * 24)


@router.post("/progress", status_code=204)
def save_progress(body: ProgressIn, user: User = Depends(current_user), db: Session = Depends(get_db),
                  yt: YouTubeClient | None = Depends(youtube_optional)) -> None:
    info = lecture_info(db, yt, [body.video_id]).get(body.video_id)
    if info is None or info.get("made_for_kids"):
        return  # R14: no viewing record for Made-for-Kids videos (or when we can't tell)
    row = db.scalar(select(LectureProgress).where(LectureProgress.user_id == user.id, LectureProgress.video_id == body.video_id))
    if row is None:
        db.add(LectureProgress(user_id=user.id, video_id=body.video_id, position_s=body.position_s, updated_at=now()))
    else:
        row.position_s, row.updated_at = body.position_s, now()
    db.commit()


# ---------- Home, notebook, doubts ----------


def _due_count(db: Session, user: User) -> int:
    return db.scalar(select(func.count()).select_from(Card).where(Card.user_id == user.id, Card.retired.is_(False), Card.due_at <= now())) or 0


@router.get("/home/summary")
def home_summary(user: User = Depends(current_user), db: Session = Depends(get_db),
                 yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    """What Home shows first: where she stopped, cards due, open doubts."""
    last = db.scalar(select(LectureProgress).where(LectureProgress.user_id == user.id).order_by(LectureProgress.updated_at.desc()))
    resume = None
    if last:
        info = lecture_info(db, yt, [last.video_id]).get(last.video_id)
        resume = {"video_id": last.video_id, "position_s": last.position_s, "video": info}
    doubts_open = db.scalar(select(func.count()).select_from(Note).where(Note.user_id == user.id, Note.kind == "doubt", Note.solved_at.is_(None))) or 0
    empty_marks = db.scalar(select(func.count()).select_from(Note).where(Note.user_id == user.id, Note.kind == "note", Note.text == "")) or 0
    return {"resume": resume, "cards_due": _due_count(db, user), "doubts_open": doubts_open, "marks_to_fill": empty_marks}


class NotebookIn(BaseModel):
    q: str = Field(default="", max_length=200)  # in the body, so her search never reaches a log (R11)
    only: str | None = Field(default=None, pattern="^(doubts|starred)$")


@router.post("/notebook")
def notebook(body: NotebookIn, user: User = Depends(current_user), db: Session = Depends(get_db),
             yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    """All her notes, grouped by lecture, newest lecture first. Search runs over her own text only."""
    query = select(Note).where(Note.user_id == user.id)
    if body.q.strip():
        like = f"%{body.q.strip()}%"
        query = query.where(or_(Note.text.ilike(like), Note.answer.ilike(like)))
    if body.only == "doubts":
        query = query.where(Note.kind == "doubt")
    elif body.only == "starred":
        query = query.where(Note.starred.is_(True))
    notes = list(db.scalars(query.order_by(Note.created_at.desc())))
    counts = _card_counts(db, [n.id for n in notes])
    order: list[str] = []
    groups: dict[str, list[Note]] = {}
    for n in notes:
        if n.video_id not in groups:
            order.append(n.video_id)
            groups[n.video_id] = []
        groups[n.video_id].append(n)
    info = lecture_info(db, yt, order)
    return {
        "lectures": [
            {"video_id": vid, "video": info.get(vid), "notes": [note_view(n, counts.get(n.id, 0)) for n in sorted(groups[vid], key=lambda x: x.t_seconds)]}
            for vid in order
        ],
        "total": len(notes),
    }


# ---------- cards ----------


class CardIn(BaseModel):
    note_id: uuid.UUID
    blanks: list[str] = Field(min_length=1, max_length=5)


def card_view(card: Card, note: Note) -> dict:
    return {
        "id": str(card.id),
        "note_id": str(note.id),
        "front": card_front(note.text, card.blanks),
        "answer": note.text,
        "blanks": card.blanks,
        "video_id": note.video_id,
        "t_seconds": note.t_seconds,
        "replay": replay_window(note.t_seconds),
        "step": card.step,
        "due_at": card.due_at.isoformat(),
    }


@router.post("/cards", status_code=201)
def make_card(body: CardIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "card_add"
    note = _own_note(db, user, body.note_id)
    blanks = [b.strip() for b in body.blanks if b.strip()]
    if not note.text or not blanks or not all(word_in(note.text, b) for b in blanks):
        raise HTTPException(status_code=422, detail="blank_not_in_note")
    card = Card(user_id=user.id, note_id=note.id, blanks=blanks, due_at=now())
    db.add(card)
    db.commit()
    return card_view(card, note)


@router.get("/cards/due")
def cards_due(user: User = Depends(current_user), db: Session = Depends(get_db),
              yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    rows = db.execute(
        select(Card, Note).join(Note, Note.id == Card.note_id)
        .where(Card.user_id == user.id, Card.retired.is_(False), Card.due_at <= now())
        .order_by(Card.due_at).limit(20)
    ).all()
    info = lecture_info(db, yt, [n.video_id for _, n in rows])
    return {"cards": [card_view(c, n) | {"video": info.get(n.video_id)} for c, n in rows]}


class GradeIn(BaseModel):
    id: uuid.UUID
    grade: str = Field(pattern="^(forgot|unsure|knew)$")


@router.post("/cards/grade")
def grade_card(body: GradeIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "card_review"
    card = db.get(Card, body.id)
    if card is None or card.user_id != user.id:
        raise HTTPException(status_code=404, detail="card_not_found")
    note = db.get(Note, card.note_id)
    card.step, card.due_at, card.retired = schedule(card.step, body.grade, now())
    card.reviews += 1
    db.commit()
    return {"retired": card.retired, "due_at": card.due_at.isoformat(), "replay": replay_window(note.t_seconds) if body.grade == "forgot" else None}


@router.post("/cards/delete", status_code=204)
def delete_card(body: IdIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    card = db.get(Card, body.id)
    if card is None or card.user_id != user.id:
        raise HTTPException(status_code=404, detail="card_not_found")
    db.delete(card)
    db.commit()
