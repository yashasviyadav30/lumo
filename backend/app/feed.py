"""Home feed (user decision 2026-10-01: "like YouTube's feed, minus songs, movies, shows, news and vlogs").

YouTube gives apps no personal recommendations, so the feed mixes two sources the user chose herself:
- the newest uploads of channels she follows (playlistItems.list, 1 unit per channel, cached 6 hours);
- searches for her goal and a few of its topics (the shared 24-hour search cache; the topics rotate daily).
Sources are interleaved so no single one fills the screen. The same hide rules as search apply (R3, R6).
"""

import hashlib
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import quota
from app.filters import UserRules, is_short, judge
from app.models import YtSearchCache
from app.search import MAX_AGE, _aware, _details, _ids_for, video_card
from app.youtube import QuotaExceeded, YouTubeClient, YouTubeError

UPLOADS_FRESH = timedelta(hours=6)
MAX_CHANNELS = 12
MAX_TOPICS = 3  # besides the goal itself
SPARE_SEARCHES = 30  # topic searches beyond the first only run while the day's bucket has room
FEED_SIZE = 80
# On every feed (feedback 2026-10-06: "podcasts, interviews and good informative creators should reach everyone").
# Learning-minded searches every user shares, cached a day for the whole app; a few rotate in each day, so they
# cost 2-3 searches a day in all. Tested 2026-10-06: bare "podcast"/"interview", and YouTube's trending charts
# (no Education chart in India; Science & Tech is gadget unboxings), pulled in viral news, drama and foreign shows.
SHARED_QUERIES = [
    "career guidance podcast for students",
    "success story interview india",
    "motivational speech for students",
    "how to study effectively",
    "self improvement podcast",
    "personal finance basics explained",
    "TED talk on learning",
    "science explained simply",
]
SHARED_PER_DAY = 2  # in the "All" feed
PODCASTS_PER_DAY = 3  # behind the "Podcasts & talks" chip
MAX_RECENT = 2  # her last searches add to the feed (they are usually in the shared cache already)


def _cached_list(db: Session, key_text: str, fresh: timedelta, now: datetime, fetch, bucket: str = "general") -> list[str]:
    """A list of video IDs from YouTube, kept in the shared cache for `fresh` (never past 30 days, R1)."""
    key = hashlib.sha256(key_text.encode()).hexdigest()
    cached = db.get(YtSearchCache, key)
    if cached and now - _aware(cached.fetched_at) < fresh:
        return list(cached.video_ids)
    stale = list(cached.video_ids) if cached and now - _aware(cached.fetched_at) < MAX_AGE else []
    if bucket == "search" and quota.search_left(db) <= 0:
        return stale  # R12: the day's searches are used up
    try:
        ids = fetch()
        quota.record(db, bucket)
    except (QuotaExceeded, YouTubeError):
        return stale
    if cached:
        cached.video_ids, cached.fetched_at = ids, now
    else:
        db.add(YtSearchCache(key=key, video_ids=ids, fetched_at=now))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # two requests cached the same list at once; the other saved it
    return ids


def _uploads(db: Session, yt: YouTubeClient, channel_id: str, now: datetime) -> list[str]:
    """A channel's newest videos. The uploads playlist ID is the channel ID with "UU" for "UC"."""
    return _cached_list(db, f"uploads|{channel_id}", UPLOADS_FRESH, now, lambda: yt.playlist_items("UU" + channel_id[2:]))


def shared_sources(db: Session, yt: YouTubeClient, language: str, now: datetime, count: int) -> list[list[str]]:
    """Today's few shared learning searches (podcasts, talks, interviews, explainers), the same for everyone."""
    queries = todays_topics(SHARED_QUERIES, limit=count)
    if language == "hi":
        queries = [f"{q} hindi" for q in queries]
    return [_ids_for(db, yt, q, language, now)[0] for q in queries]


def todays_topics(queries: list[str], today: date | None = None, limit: int = MAX_TOPICS) -> list[str]:
    """A different few topics each day, so the feed changes without spending more searches."""
    if not queries:
        return []
    start = (today or date.today()).toordinal() % len(queries)
    return (queries[start:] + queries[:start])[:limit]


def interleave(sources: list[list[str]], limit: int = FEED_SIZE) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for i in range(max((len(s) for s in sources), default=0)):
        for s in sources:
            if i < len(s) and s[i] not in seen:
                seen.add(s[i])
                out.append(s[i])
    return out[:limit]


def build_feed(db: Session, yt: YouTubeClient, rules: UserRules, follows: list[str], goal_query: str | None,
               topic_queries: list[str], language: str, recent: list[str] | None = None, only: str | None = None) -> dict:
    now = datetime.now(timezone.utc)
    if only == "podcasts":  # the "Podcasts & talks" chip
        return _finish(db, yt, rules, shared_sources(db, yt, language, now, PODCASTS_PER_DAY), now, follows)
    sources = [_uploads(db, yt, ch, now) for ch in follows[:MAX_CHANNELS]]
    others = [q for q in dict.fromkeys(topic_queries) if q != goal_query]
    searched = [q for q in dict.fromkeys(recent or []) if q not in (goal_query, *others)][:MAX_RECENT]
    queries = ([goal_query] if goal_query else []) + searched + todays_topics(others)
    for n, q in enumerate(queries):
        if n > 0 and quota.search_left(db) < SPARE_SEARCHES:
            break
        ids, _mode = _ids_for(db, yt, q, language, now)
        sources.append(ids)
    return _finish(db, yt, rules, sources + shared_sources(db, yt, language, now, SHARED_PER_DAY), now, follows)


def _finish(db: Session, yt: YouTubeClient, rules: UserRules, sources: list[list[str]], now: datetime, follows: list[str]) -> dict:
    order = interleave(sources)
    videos = _details(db, yt, order, now)
    results, hidden = [], []
    for vid in order:
        v = videos.get(vid)
        if v is None:
            continue
        verdict = judge(v, rules)
        if verdict.visible:
            results.append(video_card(v))
        else:
            hidden.append({**video_card(v), "reasons": verdict.reasons, "playable": verdict.playable})
    return {"results": results, "hidden": hidden, "hidden_count": len(hidden), "sources": {"channels": len(follows[:MAX_CHANNELS]), "lists": len(sources)}}


def build_shorts(db: Session, yt: YouTubeClient, rules: UserRules, follows: list[str]) -> dict:
    """Short vertical videos from followed channels only, newest first per channel, mixed."""
    now = datetime.now(timezone.utc)
    order = interleave([_uploads(db, yt, ch, now) for ch in follows[:MAX_CHANNELS]])
    videos = _details(db, yt, order, now)
    allow = UserRules(**{**rules.__dict__, "shorts_enabled": True})
    results = [video_card(v) for vid in order if (v := videos.get(vid)) and is_short(v) and judge(v, allow).visible]
    return {"results": results, "follows": len(follows)}
