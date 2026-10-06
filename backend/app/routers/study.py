"""Study companion API: notes beside a lecture, resume, notebook, doubts and cards.

Video IDs always travel in request bodies, never in URLs, so they can't reach any request log (R11).
Notes, progress and cards store the video ID and seconds only; titles are fetched fresh (R1).
"""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import delete, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import quota
from app.auth import current_user
from app.config import get_settings
from app.db import get_db
from app.models import Card, CardReview, LectureProgress, Note, Notepad, StarredVideo, User, YtComments, YtVideo
from app.search import _aware, _details, video_card
from app.study import card_front, now, replay_window, schedule, word_in
from app.youtube import CommentsDisabled, QuotaExceeded, YouTubeClient, YouTubeError

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
    row = db.get(YtVideo, body.video_id) if info else None
    pad = db.scalar(select(Notepad).where(Notepad.user_id == user.id, Notepad.video_id == body.video_id))
    starred = db.scalar(select(StarredVideo).where(StarredVideo.user_id == user.id, StarredVideo.video_id == body.video_id))
    return {
        "video": info,
        "description": row.description if row else "",
        "starred": starred is not None,
        "notepad": {"content": pad.content, "updated_at": pad.updated_at.isoformat()} if pad else None,
        "position_s": progress.position_s if progress else 0,
        "notes": [note_view(n, counts.get(n.id, 0)) for n in notes],
    }


COMMENTS_FRESH = timedelta(hours=24)


@router.post("/study/comments")
def comments(body: VideoIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db),
             yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    """YouTube's top comments for the lecture, as YouTube gives them (shared 24-hour cache, 1 unit per refresh)."""
    request.state.action = "comments"
    now_ = now()
    cached = db.get(YtComments, body.video_id)
    if cached and now_ - _aware(cached.fetched_at) < COMMENTS_FRESH:
        return {"comments": cached.items, "disabled": cached.disabled}
    if yt is None:
        return {"comments": cached.items if cached else [], "disabled": False}
    try:
        items, disabled = yt.comments(body.video_id), False
        quota.record(db, "general")
    except CommentsDisabled:
        items, disabled = [], True
    except (QuotaExceeded, YouTubeError):
        return {"comments": cached.items if cached and now_ - _aware(cached.fetched_at) < timedelta(days=30) else [], "disabled": False}
    if cached:
        cached.items, cached.disabled, cached.fetched_at = items, disabled, now_
    else:
        db.add(YtComments(video_id=body.video_id, items=items, disabled=disabled, fetched_at=now_))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # two opens at once: the other request already saved the same comments
    return {"comments": items, "disabled": disabled}


class StarIn(BaseModel):
    video_id: str = Field(pattern=VIDEO_ID)
    starred: bool


@router.post("/videos/star")
def star_video(body: StarIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    row = db.scalar(select(StarredVideo).where(StarredVideo.user_id == user.id, StarredVideo.video_id == body.video_id))
    if body.starred and row is None:
        db.add(StarredVideo(user_id=user.id, video_id=body.video_id))
    elif not body.starred and row is not None:
        db.delete(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # a double tap: already starred
    return {"video_id": body.video_id, "starred": body.starred}


@router.get("/library")
def library(user: User = Depends(current_user), db: Session = Depends(get_db),
            yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    """Starred videos and watch history (where the user stopped in each lecture), newest first."""
    stars = list(db.scalars(select(StarredVideo).where(StarredVideo.user_id == user.id).order_by(StarredVideo.created_at.desc()).limit(100)))
    history = list(db.scalars(select(LectureProgress).where(LectureProgress.user_id == user.id).order_by(LectureProgress.updated_at.desc()).limit(100)))
    info = lecture_info(db, yt, [s.video_id for s in stars] + [h.video_id for h in history])
    return {
        "starred": [{"video_id": s.video_id, "video": info.get(s.video_id), "at": s.created_at.isoformat()} for s in stars],
        "history": [{"video_id": h.video_id, "video": info.get(h.video_id), "position_s": h.position_s, "at": h.updated_at.isoformat()} for h in history],
    }


class HistoryIn(BaseModel):
    video_id: str | None = Field(default=None, pattern=VIDEO_ID)  # None = clear all


@router.post("/history/remove", status_code=204)
def remove_history(body: HistoryIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    """Remove one video from History, or all of it. Resume points go with it."""
    q = delete(LectureProgress).where(LectureProgress.user_id == user.id)
    if body.video_id:
        q = q.where(LectureProgress.video_id == body.video_id)
    db.execute(q)
    db.commit()


class NotepadIn(BaseModel):
    video_id: str = Field(pattern=VIDEO_ID)
    content: str = Field(max_length=200_000)  # the editor's JSON
    text: str = Field(default="", max_length=100_000)  # plain text, for search


@router.post("/notepad/save")
def save_notepad(body: NotepadIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "notepad_save"
    pad = db.scalar(select(Notepad).where(Notepad.user_id == user.id, Notepad.video_id == body.video_id))
    if pad is None:
        pad = Notepad(user_id=user.id, video_id=body.video_id)
        db.add(pad)
    pad.content, pad.text, pad.updated_at = body.content, body.text, now()
    try:
        db.commit()
    except IntegrityError:  # two first saves at once: update the row the other one made
        db.rollback()
        pad = db.scalar(select(Notepad).where(Notepad.user_id == user.id, Notepad.video_id == body.video_id))
        pad.content, pad.text, pad.updated_at = body.content, body.text, now()
        db.commit()
    return {"updated_at": pad.updated_at.isoformat()}


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
    """What Home shows first: where the user stopped, cards due, open doubts."""
    last = db.scalar(select(LectureProgress).where(LectureProgress.user_id == user.id).order_by(LectureProgress.updated_at.desc()))
    resume = None
    if last:
        info = lecture_info(db, yt, [last.video_id]).get(last.video_id)
        resume = {"video_id": last.video_id, "position_s": last.position_s, "video": info}
    doubts_open = db.scalar(select(func.count()).select_from(Note).where(Note.user_id == user.id, Note.kind == "doubt", Note.solved_at.is_(None))) or 0
    empty_marks = db.scalar(select(func.count()).select_from(Note).where(Note.user_id == user.id, Note.kind == "note", Note.text == "")) or 0
    week_ago = now() - timedelta(days=7)
    count = lambda q: db.scalar(q) or 0  # noqa: E731
    week = {
        "reviews": count(select(func.count()).select_from(CardReview).where(CardReview.user_id == user.id, CardReview.at >= week_ago)),
        "notes": count(select(func.count()).select_from(Note).where(Note.user_id == user.id, Note.created_at >= week_ago)),
    }
    totals = {
        "notes": count(select(func.count()).select_from(Note).where(Note.user_id == user.id)),
        "lectures": count(select(func.count(func.distinct(Note.video_id))).where(Note.user_id == user.id)),
        "cards": count(select(func.count()).select_from(Card).where(Card.user_id == user.id, Card.retired.is_(False))),
    }
    return {"resume": resume, "cards_due": _due_count(db, user), "doubts_open": doubts_open, "marks_to_fill": empty_marks,
            "week": week, "totals": totals}


class NotebookIn(BaseModel):
    q: str = Field(default="", max_length=200)  # in the body, so their search never reaches a log (R11)
    only: str | None = Field(default=None, pattern="^(doubts|starred)$")


@router.post("/notebook")
def notebook(body: NotebookIn, user: User = Depends(current_user), db: Session = Depends(get_db),
             yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    """All their notes, grouped by lecture, newest lecture first. Search runs over their own text only."""
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
    pads: dict[str, Notepad] = {}
    if body.only is None:  # notepads are plain notes: no doubts or stars inside them
        pad_q = select(Notepad).where(Notepad.user_id == user.id, Notepad.text != "")
        if body.q.strip():
            pad_q = pad_q.where(Notepad.text.ilike(f"%{body.q.strip()}%"))
        pads = {p.video_id: p for p in db.scalars(pad_q.order_by(Notepad.updated_at.desc()))}
    order: list[str] = []
    groups: dict[str, list[Note]] = {}
    for n in notes:
        if n.video_id not in groups:
            order.append(n.video_id)
            groups[n.video_id] = []
        groups[n.video_id].append(n)
    for vid in pads:
        if vid not in groups:
            order.append(vid)
            groups[vid] = []
    info = lecture_info(db, yt, order)
    return {
        "lectures": [
            {"video_id": vid, "video": info.get(vid),
             "notes": [note_view(n, counts.get(n.id, 0)) for n in sorted(groups[vid], key=lambda x: x.t_seconds)],
             "notepad": {"content": pads[vid].content, "updated_at": pads[vid].updated_at.isoformat()} if vid in pads else None}
            for vid in order
        ],
        "total": len(notes) + len(pads),
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
    db.add(CardReview(user_id=user.id))
    db.commit()
    return {"retired": card.retired, "due_at": card.due_at.isoformat(), "replay": replay_window(note.t_seconds) if body.grade == "forgot" else None}


@router.post("/cards/delete", status_code=204)
def delete_card(body: IdIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    card = db.get(Card, body.id)
    if card is None or card.user_id != user.id:
        raise HTTPException(status_code=404, detail="card_not_found")
    db.delete(card)
    db.commit()
