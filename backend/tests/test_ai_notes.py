import json
from datetime import datetime, timedelta, timezone

import pytest

from app import ai_notes, quota
from app.ai_notes import GeminiBusy, clean, run_due, to_seconds
from app.models import AiNotes, YtVideo
from app.purge import purge
from app.routers import ai_notes as notes_router

NOW = datetime(2026, 10, 5, 12, 0, tzinfo=timezone.utc)
VID = "aircAruvnKk"

ANSWER = json.dumps({
    "summary": "What a neural network is.",
    "points": [
        {"title": "Digits", "time": "00:04", "short": "Reading digits.", "detail": "Brains do it easily."},
        {"title": "Past the end", "time": "28:35", "short": "Bad time.", "detail": "Gemini guessed."},
    ],
    "mindmap": [
        {"id": "root", "parent": "", "label": "Neural networks", "detail": "", "time": "0:00"},
        {"id": "layers", "parent": "root", "label": "Layers", "detail": "Input to output.", "time": "3:40"},
        {"id": "lost", "parent": "nowhere", "label": "Orphan", "detail": "", "time": "1:02:03"},
    ],
})


def aware(dt):
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def add_video(db, video_id=VID, duration_s=1153, **kw):
    db.add(YtVideo(video_id=video_id, channel_id="UC1", duration_s=duration_s, **kw))
    db.commit()


def test_to_seconds():
    assert to_seconds("12:40") == 760
    assert to_seconds("1:02:03") == 3723
    assert to_seconds("00:04") == 4
    assert to_seconds("abc") is None and to_seconds("12") is None and to_seconds("1:2:3:4") is None


def test_clean_drops_times_past_the_end_and_fixes_orphans():
    out = clean(ANSWER, duration_s=1153)
    assert [p["seconds"] for p in out["points"]] == [4, None]
    nodes = {n["id"]: n for n in out["mindmap"]}
    assert nodes["root"]["parent"] is None
    assert nodes["layers"]["parent"] == "root" and nodes["layers"]["seconds"] == 220
    assert nodes["lost"]["parent"] == "root" and nodes["lost"]["seconds"] is None


def test_clean_rejects_bad_json():
    with pytest.raises(ai_notes.GeminiFailed):
        clean('{"summary": "x"}', None)


def test_job_becomes_ready_and_records_video_seconds(db):
    add_video(db)
    ai_notes.request_notes(db, VID, "en")
    calls = []
    assert run_due(db, datetime.now(timezone.utc), call=lambda v, lang: calls.append((v, lang)) or ANSWER) == "ready"
    assert calls == [(VID, "en")]
    job = db.get(AiNotes, (VID, "en"))
    assert job.data["summary"] == "What a neural network is."
    assert quota.used(db, ai_notes.BUDGET_BUCKET) == 1153
    assert run_due(db, datetime.now(timezone.utc)) is None  # nothing left to do


def test_busy_backs_off_then_gives_up(db):
    add_video(db)
    ai_notes.request_notes(db, VID, "en")

    def busy(v, lang):
        raise GeminiBusy("HTTP 503")

    t = datetime.now(timezone.utc)
    assert run_due(db, t, call=busy) == "queued"
    job = db.get(AiNotes, (VID, "en"))
    assert job.reason == "busy" and job.attempts == 1
    assert run_due(db, t, call=busy) is None  # not due yet
    for _ in range(ai_notes.MAX_ATTEMPTS - 1):
        t += timedelta(hours=4)
        status = run_due(db, t, call=busy)
    assert status == "failed"


def test_daily_limit_waits_for_tomorrow_without_calling(db):
    add_video(db, duration_s=3000)
    quota.record(db, ai_notes.BUDGET_BUCKET, 7 * 3600 - 100)
    ai_notes.request_notes(db, VID, "hi")
    now = datetime.now(timezone.utc)
    assert run_due(db, now, call=lambda v, lang: pytest.fail("must not call Gemini")) == "queued"
    job = db.get(AiNotes, (VID, "hi"))
    assert job.reason == "daily_limit" and job.attempts == 0
    assert aware(job.next_try_at) > now


def test_too_long_video_is_refused(db):
    add_video(db, duration_s=4 * 3600)
    ai_notes.request_notes(db, VID, "en")
    assert run_due(db, datetime.now(timezone.utc), call=lambda v, lang: pytest.fail("must not call Gemini")) == "too_long"


def test_endpoint_shares_one_job_between_users(signed_in, db):
    notes_router._new_jobs.clear()
    assert signed_in.post("/api/ai-notes", json={"video_id": VID}).status_code == 404  # never shown by the app
    add_video(db)
    r = signed_in.post("/api/ai-notes", json={"video_id": VID, "lang": "en"})
    assert r.json() == {"status": "queued", "reason": None}
    run_due(db, datetime.now(timezone.utc), call=lambda v, lang: ANSWER)
    r = signed_in.post("/api/ai-notes", json={"video_id": VID, "lang": "en"})
    assert r.json()["status"] == "ready" and r.json()["notes"]["points"][0]["seconds"] == 4
    assert db.query(AiNotes).count() == 1


def test_endpoint_checks_input_and_limits_new_jobs(signed_in, db):
    notes_router._new_jobs.clear()
    assert signed_in.post("/api/ai-notes", json={"video_id": VID, "lang": "fr"}).status_code == 422
    assert signed_in.post("/api/ai-notes", json={"video_id": "bad"}).status_code == 422
    ids = [f"vid{i:08d}" for i in range(notes_router.NEW_JOBS_PER_USER_DAY + 1)]
    for v in ids:
        add_video(db, video_id=v)
    codes = [signed_in.post("/api/ai-notes", json={"video_id": v}).status_code for v in ids]
    assert codes[:-1] == [200] * notes_router.NEW_JOBS_PER_USER_DAY and codes[-1] == 429


def test_endpoint_needs_sign_in(client):
    assert client.post("/api/ai-notes", json={"video_id": VID}).status_code == 401


def test_purge_deletes_ai_notes_after_30_days(db):
    db.add_all([AiNotes(video_id="old________", lang="en", updated_at=NOW - timedelta(days=31)),
                AiNotes(video_id="new________", lang="en", updated_at=NOW - timedelta(days=1))])
    db.commit()
    assert purge(db, now=NOW)["ai_notes"] == 1
