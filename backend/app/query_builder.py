"""Goal + topic → one YouTube search query (plan 4.8). Works on the user's text and our topic data only (R4).

YouTube's own search reads titles, descriptions and transcripts; our job is to ask it a precise question.
Rules, chosen after comparing outputs on the goal test set (docs/progress.md):
- A CS/CMA paper: exam stage + the paper's full name ("CS Executive Capital Market and Securities Laws"),
  because the short codes (CMSL, CRVI) are rarely what videos are titled.
- A unit (NEET, AI): the topic's search term that shares most words with what the user typed.
- Up to two useful words the user added ("one shot", "botany") are kept.
- No language is added: the query is in the user's own words plus our topic names, and YouTube orders the
  results (user decision 2026-10-01). Goals outside our fields use the user's own words.
"""

import re

from app.fields import load_fields
from app.goals import HINGLISH_MARKERS, IDENTITY_TOKENS, STAGE_FIELDS, STOP, ParsedGoal, normalise

FIELD_PREFIX = {"cs-company-secretary": "CS", "cma": "CMA", "neet": "NEET", "ai": ""}
LEVEL_PREFIX = {
    "cseet": "CSEET", "exec": "CS Executive", "prof": "CS Professional",
    "cma-foundation": "CMA Foundation", "cma-intermediate": "CMA Inter", "cma-final": "CMA Final",
}
FILLER = HINGLISH_MARKERS | {"learn", "sikhna", "seekhna", "chahta", "chahti", "hu", "hoon", "mujhe", "please", "want", "i", "to",
                             "company", "secretary", "cost", "management", "accountant", "medical", "entrance", "preparation",
                             "class", "boards", "board", "dropper", "repeater", "kaise", "kare"}
# A field goal with no level or topic yet.
FIELD_ONLY = {"cs-company-secretary": "CS company secretary course", "cma": "CMA course", "neet": "NEET preparation"}


def _topic(fid: str, topic_id: str) -> dict | None:
    return next((t for t in load_fields()[fid]["topics"] if t["id"] == topic_id), None)


def _words(text: str) -> list[str]:
    return normalise(text).split()


def _informative(text: str) -> list[str]:
    return [w for w in _words(text) if w not in FILLER and w not in STOP and w not in IDENTITY_TOKENS and not w.isdigit()] + (
        ["one shot"] if "one shot" in normalise(text) else []
    )


def _clean_name(name: str) -> str:
    name = re.sub(r"^Paper \w+:\s*", "", name)
    return re.sub(r"\s*\([^)]*\)", "", name).strip()


def _add_leftovers(query: str, goal: ParsedGoal, level_words: set[str]) -> str:
    have = set(_words(query))
    extra = []
    for w in _informative(goal.text):
        parts = w.split()
        if any(p in have or p in level_words for p in parts):
            continue
        if any(len(p) >= 4 and any(h.startswith(p[:4]) for h in have) for p in parts):
            continue
        extra.append(w)
    return " ".join([query, *extra[:2]]).strip()


def build_query(goal: ParsedGoal, topic_id: str | None = None) -> str:
    """topic_id: a topic the user tapped; defaults to the goal's own topic."""
    query = _build(goal, topic_id)
    # A language the user typed is their own word, so it stays ("cs executive capital market hindi me").
    for lang in ("hindi", "english"):
        if lang in _words(goal.text) and lang not in query.casefold().split() and goal.field is not None:
            query = f"{query} {lang}"
    return query


def _build(goal: ParsedGoal, topic_id: str | None) -> str:
    fid = goal.field
    if fid is None:
        query = " ".join(w for w in _words(goal.text) if w not in FILLER) or goal.text.strip()
        return query

    level_words = {w for w in _words(" ".join(LEVEL_PREFIX.values()))} | {"executive", "exe", "exec", "professional", "prof", "inter", "intermediate", "final", "foundation"}
    tid = topic_id or (goal.topic_ids[0] if goal.topic_ids else None)
    topic = _topic(fid, tid) if tid else None

    if topic:
        if fid in STAGE_FIELDS and not topic.get("parent"):
            query = f"{LEVEL_PREFIX.get(topic['level'], FIELD_PREFIX[fid])} {_clean_name(topic['name'])}"
        else:
            terms = topic.get("search_terms", {})
            options = terms.get("en") or [_clean_name(topic["name"])]
            user = set(_words(goal.text))
            query = max(options, key=lambda t: (len(user & set(_words(t))), -options.index(t)))
            prefix = LEVEL_PREFIX.get(topic["level"]) or FIELD_PREFIX.get(fid, "")
            if prefix and prefix.casefold().split()[0] not in query.casefold():
                query = f"{prefix} {query}"
        return _add_leftovers(query, goal, level_words)

    if fid == "ai":
        return " ".join(w for w in _words(goal.text) if w not in FILLER) or "machine learning"
    prefix = LEVEL_PREFIX.get(goal.level or "") or FIELD_ONLY.get(fid) or goal.field_label
    return _add_leftovers(prefix, goal, level_words)
