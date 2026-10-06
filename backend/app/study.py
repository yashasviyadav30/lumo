"""Study companion logic: cards from their notes, the review ladder, and replay windows.

Everything here works on their own data: notes the user wrote, words the user chose to hide, seconds the user marked.
Nothing reads YouTube titles or judges videos (R3, R4).
"""

import re
from datetime import datetime, timedelta, timezone

# Review ladder: a new card the user knows comes back after 1 day, then 3 days; the third correct recall
# (three different days) retires it, so every card has an end.
LADDER_DAYS = [1, 3]
FORGOT_AGAIN_MIN = 10  # a forgotten card comes back later in the same session
REPLAY_BEFORE_S = 30
REPLAY_AFTER_S = 60

BLANK = "_____"


def now() -> datetime:
    return datetime.now(timezone.utc)


def word_in(text: str, word: str) -> bool:
    return re.search(rf"(?<!\w){re.escape(word)}(?!\w)", text, flags=re.IGNORECASE) is not None


def card_front(text: str, blanks: list[str]) -> str:
    """Their note with each chosen word hidden (first match, whole word, any case)."""
    front = text
    for word in blanks:
        front = re.sub(rf"(?<!\w){re.escape(word)}(?!\w)", BLANK, front, count=1, flags=re.IGNORECASE)
    return front


def replay_window(t_seconds: int) -> dict[str, int]:
    """Just the part around their note: 30 s before to 60 s after (played with the embed's own start/end)."""
    return {"start": max(0, t_seconds - REPLAY_BEFORE_S), "end": t_seconds + REPLAY_AFTER_S}


def schedule(step: int, grade: str, at: datetime) -> tuple[int, datetime, bool]:
    """(new step, next due time, retired) after a review."""
    if grade == "knew":
        new_step = step + 1
        if new_step > len(LADDER_DAYS):
            return new_step, at, True
        return new_step, at + timedelta(days=LADDER_DAYS[new_step - 1]), False
    if grade == "unsure":
        return step, at + timedelta(days=1), False
    # forgot: back to the start; it comes back later in this session
    return 0, at + timedelta(minutes=FORGOT_AGAIN_MIN), False
