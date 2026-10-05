"""Topics for any goal outside the curated fields (feedback 2026-10-06: every career path gets its own feed).

The LLM sees only the user's own goal text (R4) and suggests YouTube searches; it never sees or judges a video
(R3). Results are cached per goal text in this process, so people with the same goal share one call.
"""

import json
from functools import lru_cache

from app.llm import LLMError

SYSTEM = """You turn a learner's goal into YouTube searches. Return JSON: {"topics": [{"name": "...", "query": "..."}]}
with 6 to 8 items:
- 5 or 6 core subtopics of the goal, in the order a learner meets them;
- 1 item for interviews with people who reached this goal or work in it (toppers, practitioners);
- 1 item for podcasts about this path.
name: 1 to 4 words, shown on a button. query: a YouTube search of at most 8 words, in the language of the goal.
If the goal is not something a person can learn, study or prepare for, return {"topics": []}."""

MAX_TOPICS = 8


def clean(raw: str) -> tuple[dict, ...]:
    data = json.loads(raw)
    items = data.get("topics", []) if isinstance(data, dict) else []
    out, seen = [], set()
    for item in items:
        if not isinstance(item, dict):
            continue
        name, query = str(item.get("name", "")).strip()[:40], str(item.get("query", "")).strip()[:100]
        if name and query and query.casefold() not in seen:
            seen.add(query.casefold())
            out.append({"id": f"s{len(out) + 1}", "name": name, "query": query})
    return tuple(out[:MAX_TOPICS])


@lru_cache(maxsize=512)
def _suggest(text: str, llm) -> tuple[dict, ...]:
    return clean(llm(SYSTEM, f"Goal: {text}"))


def suggest_topics(text: str, llm) -> list[dict]:
    """Never fails: without topics the feed still searches the goal itself."""
    try:
        return [dict(t) for t in _suggest(" ".join(text.split()).casefold(), llm)]
    except (LLMError, ValueError, KeyError, TypeError):
        return []
