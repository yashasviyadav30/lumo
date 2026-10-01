from datetime import date

import pytest

from app.feed import interleave, todays_topics
from app.routers.search import get_youtube
from tests.fake_youtube import FakeYouTube, video

TEACHER = "UC" + "t" * 22
VLOGGER = "UC" + "v" * 22


@pytest.fixture()
def yt(signed_in):
    fake = FakeYouTube(
        results={"CMA Inter Cost Accounting": ["lecture0001", "newsclip001", "podcast0001"]},
        videos={
            "lecture0001": video("lecture0001"),
            "newsclip001": video("newsclip001", category_id="25", title="Breaking news"),
            "podcast0001": video("podcast0001", category_id="22", title="Podcast with a CMA topper"),
            "upload00001": video("upload00001", channel_id=TEACHER),
            "upload00002": video("upload00002", channel_id=TEACHER, category_id="24"),
            "vlog0000001": video("vlog0000001", channel_id=VLOGGER, category_id="22"),
        },
    )
    fake.playlists = {"UU" + TEACHER[2:]: ["upload00001", "upload00002"]}
    signed_in.app.dependency_overrides[get_youtube] = lambda: fake
    return fake


def test_interleave_mixes_sources_without_repeats():
    assert interleave([["a", "b", "c"], ["x", "a"], ["y"]]) == ["a", "x", "y", "b", "c"]


def test_topics_rotate_by_day():
    qs = ["t1", "t2", "t3", "t4", "t5"]
    assert todays_topics(qs, date(2026, 10, 1)) != todays_topics(qs, date(2026, 10, 2))
    assert len(todays_topics(qs, date(2026, 10, 1))) == 3
    assert todays_topics([]) == []


def test_feed_mixes_goal_and_followed_channels_with_the_hide_list(yt, signed_in):
    signed_in.post("/api/goals", json={"text": "CMA Inter costing"})
    signed_in.post("/api/follows", json={"channel_id": TEACHER})
    feed = signed_in.get("/api/feed").json()
    shown = [v["video_id"] for v in feed["results"]]
    assert "upload00001" in shown and "lecture0001" in shown
    assert "podcast0001" in shown  # People & Blogs (podcasts) are shown
    hidden = {v["video_id"]: v["reasons"] for v in feed["hidden"]}
    assert "newsclip001" in hidden  # news: hidden, but listed so she can see what was hidden (R6)
    assert "upload00002" in shown  # a followed channel is never hidden by YouTube's type
    queries = [q for q, _ in yt.search_calls]
    assert len(queries) == 4 and len(set(queries)) == 4  # the goal + three of today's topics, each cached for everyone


def test_hiding_a_channel_removes_it_from_the_feed(yt, signed_in):
    signed_in.post("/api/follows", json={"channel_id": VLOGGER})
    yt.playlists["UU" + VLOGGER[2:]] = ["vlog0000001"]
    assert [v["video_id"] for v in signed_in.get("/api/feed").json()["results"]] == ["vlog0000001"]
    signed_in.post("/api/follows/remove", json={"channel_id": VLOGGER})
    signed_in.post("/api/mutes", json={"kind": "channel", "value": VLOGGER})
    assert signed_in.get("/api/feed").json()["results"] == []


def test_uploads_are_cached(yt, signed_in):
    signed_in.post("/api/follows", json={"channel_id": TEACHER})
    signed_in.get("/api/feed")
    signed_in.get("/api/feed")
    assert yt.playlist_calls == ["UU" + TEACHER[2:]]


def test_shorts_setting_can_be_switched(signed_in):
    assert signed_in.post("/api/me/settings", json={"shorts_enabled": True}).json()["settings"]["shorts_enabled"] is True
    assert signed_in.get("/api/me").json()["settings"]["shorts_enabled"] is True
