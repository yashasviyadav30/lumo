"""Goals: type any goal, get it understood, pick a topic, get a search (plan 4.4, 4.5, 4.7a, 4.8)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.auth import current_user
from app.config import get_settings
from app.db import get_db
from app.fields import load_fields
from app.goals import Candidate, ParsedGoal, parse_hybrid, parse_rules
from app.llm import groq_json
from app.models import Goal, User
from app.query_builder import build_query

router = APIRouter(prefix="/api/goals", tags=["goals"])


def parser():
    """Hybrid when the LLM is configured; rules alone otherwise. The LLM sees only the user's text (R4)."""
    if get_settings().groq_api_key:
        return lambda text: parse_hybrid(text, groq_json)
    return parse_rules


def _from_dict(d: dict) -> ParsedGoal:
    d = dict(d)
    d["candidates"] = [Candidate(**c) for c in d.get("candidates", [])]
    return ParsedGoal(**d)


def topics_for(goal: ParsedGoal) -> list[dict]:
    """The topics to offer as one-tap chips: the papers of the level, or the units of the chosen paper/subject."""
    if not goal.field:
        return []
    topics = load_fields()[goal.field]["topics"]
    chosen = goal.topic_ids[0] if goal.topic_ids else None
    parent_of = {t["id"]: t.get("parent") for t in topics}
    if chosen:
        anchor = parent_of.get(chosen) or chosen
        units = [t for t in topics if t.get("parent") == anchor]
        if units:
            return [t for t in topics if t["id"] == anchor] + units
    if goal.level:
        return [t for t in topics if t["level"] == goal.level and not t.get("parent")]
    return [t for t in topics if not t.get("parent")]


def view(row: Goal) -> dict:
    goal = _from_dict(row.parsed)
    return {
        "id": str(row.id),
        "text": row.raw_text,
        "field": goal.field,
        "field_label": goal.field_label,
        "level": goal.level,
        "level_label": next((lv["name"] for lv in load_fields()[goal.field]["levels"] if lv["id"] == goal.level), None) if goal.field else None,
        "topic_id": goal.topic_ids[0] if goal.topic_ids else None,
        "language": goal.language,
        "did_you_mean": [{"index": i, "label": c.label} for i, c in enumerate(goal.candidates)] if goal.ambiguous else [],
        "minor_signals": goal.minor_signals,  # the age re-check itself is step 4.6
        "query": None if goal.ambiguous else build_query(goal),
        "topics": [
            {"id": t["id"], "name": t["name"], "query": build_query(goal, t["id"])} for t in topics_for(goal)
        ] if not goal.ambiguous else [],
    }


class GoalIn(BaseModel):
    text: str = Field(min_length=1, max_length=200)


class ChoiceIn(BaseModel):
    index: int = Field(ge=0, le=5)


def _save(db: Session, user: User, text: str, goal: ParsedGoal) -> Goal:
    db.execute(update(Goal).where(Goal.user_id == user.id, Goal.active.is_(True)).values(active=False))
    row = Goal(user_id=user.id, raw_text=text, parsed=goal.to_dict(), active=True)
    db.add(row)
    db.commit()
    return row


@router.post("", status_code=201)
def set_goal(body: GoalIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "goal_set"
    text = body.text.strip()
    return view(_save(db, user, text, parser()(text)))


@router.get("/active")
def active_goal(user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict | None:
    row = db.scalar(select(Goal).where(Goal.user_id == user.id, Goal.active.is_(True)).order_by(Goal.created_at.desc()))
    return view(row) if row else None


@router.post("/{goal_id}/choose")
def choose(goal_id: uuid.UUID, body: ChoiceIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    """The one 'Did you mean' tap (4.5)."""
    row = db.get(Goal, goal_id)
    if row is None or row.user_id != user.id:
        raise HTTPException(status_code=404, detail="goal_not_found")
    goal = _from_dict(row.parsed)
    if not goal.ambiguous or body.index >= len(goal.candidates):
        raise HTTPException(status_code=422, detail="nothing_to_choose")
    pick = goal.candidates[body.index]
    if pick.field:
        chosen = parse_rules(f"{row.raw_text} {load_fields()[pick.field]['display_name']}")
        chosen.text = row.raw_text
    else:
        # e.g. "CS" → "Computer Science": search with the chosen meaning plus the user's other words.
        rest = " ".join(w for w in row.raw_text.split() if w.casefold() != "cs")
        chosen = ParsedGoal(f"{pick.label} {rest}".strip(), None, pick.label, None, [], goal.language, goal.minor_signals, confidence=1.0)
    return view(_save(db, user, row.raw_text, chosen))
