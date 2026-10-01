"""A stand-in for YouTubeClient that never calls the network."""

from app.youtube import QuotaExceeded, VideoFields


def video(video_id: str, **over) -> VideoFields:
    base = dict(
        video_id=video_id,
        channel_id="UC" + "a" * 22,
        channel_title="Teacher",
        title=f"Lecture {video_id}",
        description="",
        published_at=None,
        thumbnail_url="https://i.ytimg.com/vi/x/mqdefault.jpg",
        duration_s=1800,
        category_id="27",
        topic_categories=["https://en.wikipedia.org/wiki/Knowledge"],
        age_restricted=False,
        embeddable=True,
        made_for_kids=False,
        blocked_in_india=False,
        has_captions=True,
        live="none",
        vertical=False,
    )
    base.update(over)
    return VideoFields(**base)


class FakeYouTube:
    def __init__(self, results: dict[str, list[str]] | None = None, videos: dict[str, VideoFields] | None = None):
        self.results = results or {}
        self.video_map = videos or {}
        self.search_calls: list[tuple[str, str]] = []
        self.video_calls: list[list[str]] = []
        self.quota_exceeded = False

    def search(self, query: str, language: str, max_results: int = 25) -> list[str]:
        if self.quota_exceeded:
            raise QuotaExceeded("search")
        self.search_calls.append((query, language))
        return list(self.results.get(query, []))

    def playlist_items(self, playlist_id: str, max_results: int = 10) -> list[str]:
        self.playlist_calls = getattr(self, "playlist_calls", []) + [playlist_id]
        return list(getattr(self, "playlists", {}).get(playlist_id, []))[:max_results]

    def videos(self, ids: list[str]) -> list[VideoFields]:
        self.video_calls.append(list(ids))
        return [self.video_map[i] for i in ids if i in self.video_map]
