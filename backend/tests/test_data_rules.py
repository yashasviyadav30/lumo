from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.models import AppLog, YtSearchCache, YtVideo
from app.purge import purge
from app.request_log import ip_prefix

NOW = datetime(2026, 9, 29, 12, 0, tzinfo=timezone.utc)


def test_purge_deletes_youtube_data_older_than_30_days(db):
    db.add_all([
        YtVideo(video_id="old________", channel_id="UCold", fetched_at=NOW - timedelta(days=31)),
        YtVideo(video_id="fresh______", channel_id="UCnew", fetched_at=NOW - timedelta(days=29)),
        YtSearchCache(key="old", video_ids=[], fetched_at=NOW - timedelta(days=31)),
        YtSearchCache(key="new", video_ids=[], fetched_at=NOW - timedelta(days=1)),
    ])
    db.commit()
    counts = purge(db, now=NOW)
    assert counts["yt_videos"] == 1 and counts["yt_search_cache"] == 1
    assert [v.video_id for v in db.scalars(select(YtVideo))] == ["fresh______"]
    assert [c.key for c in db.scalars(select(YtSearchCache))] == ["new"]


def test_purge_keeps_logs_for_one_year(db):
    db.add_all([
        AppLog(method="GET", route="/api/me", status=200, ms=1, at=NOW - timedelta(days=366)),
        AppLog(method="GET", route="/api/me", status=200, ms=1, at=NOW - timedelta(days=300)),
    ])
    db.commit()
    assert purge(db, now=NOW)["app_log"] == 1


def test_ip_prefix_shortens_addresses():
    assert ip_prefix("203.0.113.77") == "203.0.113.0"
    assert ip_prefix("203.0.113.77, 10.0.0.1") == "203.0.113.0"
    assert ip_prefix("2001:db8:1234:5678::1") == "2001:db8:1234::"
    assert ip_prefix("not-an-ip") is None
    assert ip_prefix(None) is None


def test_logs_hold_route_templates_not_raw_paths(signed_in, db):
    signed_in.get("/api/me?video=dQw4w9WgXcQ")
    rows = list(db.scalars(select(AppLog)))
    assert rows, "requests should be logged"
    for row in rows:
        assert "dQw4w9WgXcQ" not in (row.route or "") + (row.action or "")
        assert "?" not in row.route
    me_row = [r for r in rows if r.route == "/api/me"][-1]
    assert me_row.actor and len(me_row.actor) == 16  # pseudonym, not the user ID


def test_health_is_not_logged(client, db):
    client.get("/health")
    assert db.scalar(select(AppLog)) is None
