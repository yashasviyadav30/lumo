"""YouTube Data API client: search and video details (plan 3.1, 3.2).

Only YouTube's own fields are read (R3). Every stored row carries fetched_at (R1).
"""

import re
from dataclasses import dataclass
from datetime import datetime, timezone

import httpx

API = "https://www.googleapis.com/youtube/v3"
INDIA = "IN"
DETAIL_PARTS = "snippet,contentDetails,status,topicDetails,player"

_DURATION = re.compile(r"P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?")


class QuotaExceeded(Exception):
    pass


class YouTubeError(Exception):
    pass


class CommentsDisabled(YouTubeError):
    pass


def parse_duration(iso: str | None) -> int | None:
    m = _DURATION.fullmatch(iso or "")
    if not m or not iso or iso == "P":
        return None
    d, h, mi, s = (int(x) if x else 0 for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s


def blocked_in(region_restriction: dict | None, country: str = INDIA) -> bool:
    if not region_restriction:
        return False
    if "allowed" in region_restriction:
        return country not in region_restriction["allowed"]
    return country in region_restriction.get("blocked", [])


def _parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


@dataclass
class VideoFields:
    video_id: str
    channel_id: str
    channel_title: str
    title: str
    description: str
    published_at: datetime | None
    thumbnail_url: str
    duration_s: int | None
    category_id: str | None
    topic_categories: list[str]
    age_restricted: bool
    embeddable: bool
    made_for_kids: bool
    blocked_in_india: bool
    has_captions: bool
    live: str
    vertical: bool | None


def parse_video(item: dict) -> VideoFields:
    sn = item.get("snippet", {})
    cd = item.get("contentDetails", {})
    st = item.get("status", {})
    thumbs = sn.get("thumbnails", {})
    thumb = (thumbs.get("medium") or thumbs.get("high") or thumbs.get("default") or {}).get("url", "")
    return VideoFields(
        video_id=item["id"],
        channel_id=sn.get("channelId", ""),
        channel_title=sn.get("channelTitle", "")[:200],
        title=sn.get("title", "")[:300],
        description=sn.get("description", ""),
        published_at=_parse_time(sn.get("publishedAt")),
        thumbnail_url=thumb[:300],
        duration_s=parse_duration(cd.get("duration")),
        category_id=sn.get("categoryId"),
        topic_categories=list(item.get("topicDetails", {}).get("topicCategories", [])),
        age_restricted=cd.get("contentRating", {}).get("ytRating") == "ytAgeRestricted",
        embeddable=bool(st.get("embeddable", True)),
        made_for_kids=bool(st.get("madeForKids", False)),
        blocked_in_india=blocked_in(cd.get("regionRestriction")),
        has_captions=cd.get("caption") == "true",
        live=sn.get("liveBroadcastContent", "none"),
        vertical=_is_vertical(item.get("player", {})),
    )


def _is_vertical(player: dict) -> bool | None:
    """YouTube's own embed size: Shorts are taller than wide. None when YouTube doesn't say."""
    try:
        w, h = int(player["embedWidth"]), int(player["embedHeight"])
    except (KeyError, TypeError, ValueError):
        return None
    return h > w


class YouTubeClient:
    def __init__(self, api_key: str, client: httpx.Client | None = None):
        self.api_key = api_key
        self.http = client or httpx.Client(timeout=10)

    def _get(self, resource: str, params: dict) -> dict:
        r = self.http.get(f"{API}/{resource}", params={**params, "key": self.api_key})
        if r.status_code == 403 and "quota" in r.text.lower():
            raise QuotaExceeded(resource)
        if r.status_code != 200:
            raise YouTubeError(f"{resource}: HTTP {r.status_code}")
        return r.json()

    def search(self, query: str, language: str, max_results: int = 25) -> list[str]:
        """One search.list call (the 100-a-day bucket). safeSearch=strict always (R5)."""
        params = {
            "part": "id",
            "q": query,
            "type": "video",
            "safeSearch": "strict",
            "relevanceLanguage": language,
            "regionCode": INDIA,
            "maxResults": max_results,
        }
        data = self._get("search", params)
        return [i["id"]["videoId"] for i in data.get("items", []) if i.get("id", {}).get("videoId")]

    def playlist_items(self, playlist_id: str, max_results: int = 10) -> list[str]:
        """A playlist's first videos (a channel's uploads playlist lists newest first). 1 unit."""
        data = self._get("playlistItems", {"part": "contentDetails", "playlistId": playlist_id, "maxResults": max_results})
        return [i["contentDetails"]["videoId"] for i in data.get("items", []) if i.get("contentDetails", {}).get("videoId")]

    def comments(self, video_id: str, max_results: int = 50) -> list[dict]:
        """Top-level comments, most relevant first, as plain text. 1 unit."""
        r = self.http.get(f"{API}/commentThreads", params={
            "part": "snippet", "videoId": video_id, "order": "relevance", "maxResults": max_results,
            "textFormat": "plainText", "key": self.api_key})
        if r.status_code == 403 and "commentsDisabled" in r.text:
            raise CommentsDisabled(video_id)
        if r.status_code == 403 and "quota" in r.text.lower():
            raise QuotaExceeded("commentThreads")
        if r.status_code != 200:
            raise YouTubeError(f"commentThreads: HTTP {r.status_code}")
        out = []
        for item in r.json().get("items", []):
            top = item.get("snippet", {}).get("topLevelComment", {}).get("snippet", {})
            out.append({
                "author": top.get("authorDisplayName", "")[:120],
                "author_url": top.get("authorChannelUrl", "")[:300],
                "text": top.get("textDisplay", "")[:5000],
                "likes": int(top.get("likeCount", 0) or 0),
                "published_at": top.get("publishedAt"),
                "replies": int(item.get("snippet", {}).get("totalReplyCount", 0) or 0),
            })
        return out

    def videos(self, ids: list[str]) -> list[VideoFields]:
        """videos.list, 1 unit per 50 IDs."""
        out: list[VideoFields] = []
        for start in range(0, len(ids), 50):
            chunk = ids[start : start + 50]
            data = self._get(
                "videos",
                # maxHeight makes YouTube return the embed width and height (used for the Shorts shape).
                {"part": DETAIL_PARTS, "id": ",".join(chunk), "maxResults": 50, "maxHeight": 720},
            )
            out.extend(parse_video(item) for item in data.get("items", []))
        return out


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
