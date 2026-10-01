from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import func, select

from app.models import AppLog, Card, CardReview, LectureProgress, Note
from app.routers.study import youtube_optional
from app.study import card_front, replay_window, schedule
from tests.conftest import ADULT
from tests.fake_youtube import FakeYouTube, video

LECTURE = "lecture0001"
KIDS = "kidsvideo01"


@pytest.fixture()
def yt(signed_in):
    fake = FakeYouTube(videos={LECTURE: video(LECTURE, title="ESG Lecture 6"), KIDS: video(KIDS, made_for_kids=True)})
    signed_in.app.dependency_overrides[youtube_optional] = lambda: fake
    return fake


def add(client, **kw):
    body = {"video_id": LECTURE, "t_seconds": 2530} | kw
    r = client.post("/api/notes", json=body)
    assert r.status_code == 201, r.text
    return r.json()


# ---------- pure logic ----------


def test_card_front_hides_only_her_chosen_words():
    text = "CSR spend = 2% of average net profit of last 3 years"
    assert card_front(text, ["2%", "3"]) == "CSR spend = _____ of average net profit of last _____ years"
    assert card_front("Net worth of 500 crore", ["NET"]) == "_____ worth of 500 crore"  # any case, first match


def test_replay_window_is_just_the_part_around_the_note():
    assert replay_window(2530) == {"start": 2500, "end": 2590}
    assert replay_window(10) == {"start": 0, "end": 70}


def test_review_ladder_retires_after_three_correct_recalls():
    t = datetime(2026, 10, 1, tzinfo=timezone.utc)
    step, due, retired = schedule(0, "knew", t)
    assert (step, due - t, retired) == (1, timedelta(days=1), False)
    step, due, retired = schedule(step, "knew", t)
    assert (step, due - t, retired) == (2, timedelta(days=3), False)
    assert schedule(step, "knew", t)[2] is True
    assert schedule(2, "forgot", t)[:2] == (0, t + timedelta(minutes=10))
    assert schedule(1, "unsure", t)[:2] == (1, t + timedelta(days=1))


# ---------- study page ----------


def test_mark_now_fill_later(yt, signed_in):
    mark = add(signed_in)  # one tap: just the second, no text
    assert mark["text"] == "" and mark["t_seconds"] == 2530
    r = signed_in.post("/api/notes/update", json={"id": mark["id"], "text": "CSR spend = 2% of avg net profit", "tag": "def", "starred": True})
    assert r.json()["text"].startswith("CSR") and r.json()["tag"] == "def" and r.json()["starred"]
    opened = signed_in.post("/api/study/open", json={"video_id": LECTURE}).json()
    assert opened["video"]["title"] == "ESG Lecture 6"  # fetched fresh, never stored with the note
    assert [n["t_seconds"] for n in opened["notes"]] == [2530]


def test_notes_store_only_the_video_id_and_second(yt, signed_in, db):
    add(signed_in, text="my own words")
    cols = set(Note.__table__.columns.keys())
    assert "title" not in cols and "description" not in cols and "thumbnail_url" not in cols
    assert db.scalar(select(Note)).video_id == LECTURE


def test_doubt_parked_then_solved(yt, signed_in):
    d = add(signed_in, kind="doubt", text="Is a Section 8 company covered?")
    assert signed_in.get("/api/home/summary").json()["doubts_open"] == 1
    signed_in.post("/api/notes/update", json={"id": d["id"], "solved": True, "answer": "Yes, if it crosses the limits"})
    assert signed_in.get("/api/home/summary").json()["doubts_open"] == 0


def test_bad_input_is_refused(yt, signed_in):
    assert signed_in.post("/api/notes", json={"video_id": "not-valid!", "t_seconds": 1}).status_code == 422
    assert signed_in.post("/api/notes", json={"video_id": LECTURE, "t_seconds": 1, "tag": "bogus"}).status_code == 422
    assert signed_in.post("/api/notes", json={"video_id": LECTURE, "t_seconds": 1, "kind": "other"}).status_code == 422


def test_someone_elses_note_is_not_found(yt, signed_in, client):
    note = add(signed_in, text="mine")
    other = client.post("/api/auth/signup", json=ADULT | {"email": "other@example.com"}).json()["token"]
    r = client.post("/api/notes/update", json={"id": note["id"], "text": "hacked"}, headers={"Authorization": f"Bearer {other}"})
    assert r.status_code == 404


def test_resume_where_she_stopped(yt, signed_in):
    assert signed_in.post("/api/progress", json={"video_id": LECTURE, "position_s": 2530}).status_code == 204
    home = signed_in.get("/api/home/summary").json()
    assert home["resume"]["video_id"] == LECTURE and home["resume"]["position_s"] == 2530
    assert signed_in.post("/api/study/open", json={"video_id": LECTURE}).json()["position_s"] == 2530


def test_no_viewing_record_for_made_for_kids_videos(yt, signed_in, db):
    signed_in.post("/api/progress", json={"video_id": KIDS, "position_s": 60})
    assert db.scalar(select(func.count()).select_from(LectureProgress)) == 0  # R14


def test_notebook_groups_by_lecture_and_searches_her_text(yt, signed_in):
    add(signed_in, text="Sec 135 CSR applies to net worth 500 crore")
    add(signed_in, t_seconds=100, text="BRSR is for top 1000 listed")
    add(signed_in, kind="doubt", text="What is XBRL?")
    book = signed_in.post("/api/notebook", json={}).json()
    assert book["total"] == 3 and book["lectures"][0]["video"]["title"] == "ESG Lecture 6"
    assert [n["t_seconds"] for n in book["lectures"][0]["notes"]] == [100, 2530, 2530]
    found = signed_in.post("/api/notebook", json={"q": "brsr"}).json()
    assert found["total"] == 1
    assert signed_in.post("/api/notebook", json={"only": "doubts"}).json()["total"] == 1


# ---------- cards ----------


def test_card_from_her_note_and_replay_on_forgot(yt, signed_in):
    note = add(signed_in, text="CSR spend = 2% of average net profit of last 3 years")
    r = signed_in.post("/api/cards", json={"note_id": note["id"], "blanks": ["2%"]})
    assert r.status_code == 201
    due = signed_in.get("/api/cards/due").json()["cards"]
    assert len(due) == 1 and due[0]["front"].startswith("CSR spend = _____")
    graded = signed_in.post("/api/cards/grade", json={"id": due[0]["id"], "grade": "forgot"}).json()
    assert graded["replay"] == {"start": 2500, "end": 2590} and not graded["retired"]
    assert signed_in.get("/api/cards/due").json()["cards"] == []  # comes back in 10 minutes
    home = signed_in.get("/api/home/summary").json()
    assert home["week"] == {"reviews": 1, "notes": 1}
    assert home["totals"] == {"notes": 1, "lectures": 1, "cards": 1}


def test_card_words_must_be_in_her_note(yt, signed_in):
    note = add(signed_in, text="CSR spend = 2%")
    assert signed_in.post("/api/cards", json={"note_id": note["id"], "blanks": ["crore"]}).status_code == 422
    empty = add(signed_in)
    assert signed_in.post("/api/cards", json={"note_id": empty["id"], "blanks": ["x"]}).status_code == 422


def test_knowing_a_card_three_times_retires_it(yt, signed_in, db):
    note = add(signed_in, text="BRSR applies to top 1000 listed companies")
    card_id = signed_in.post("/api/cards", json={"note_id": note["id"], "blanks": ["1000"]}).json()["id"]
    for i in range(3):
        card = db.scalar(select(Card))
        card.due_at = datetime.now(timezone.utc) - timedelta(minutes=1)  # pretend the days have passed
        db.commit()
        r = signed_in.post("/api/cards/grade", json={"id": card_id, "grade": "knew"}).json()
        db.expire_all()
    assert r["retired"] is True


def test_deleting_a_note_deletes_its_cards(yt, signed_in, db):
    note = add(signed_in, text="CSR spend = 2%")
    signed_in.post("/api/cards", json={"note_id": note["id"], "blanks": ["2%"]})
    signed_in.post("/api/notes/delete", json={"id": note["id"]})
    assert db.scalar(select(func.count()).select_from(Card)) == 0


def test_delete_my_data_removes_notes_cards_and_progress(yt, signed_in, db):
    note = add(signed_in, text="CSR spend = 2%")
    signed_in.post("/api/cards", json={"note_id": note["id"], "blanks": ["2%"]})
    signed_in.post("/api/progress", json={"video_id": LECTURE, "position_s": 10})
    signed_in.post("/api/cards/grade", json={"id": str(db.scalar(select(Card)).id), "grade": "knew"})
    signed_in.delete("/api/me")
    for model in (Note, Card, CardReview, LectureProgress):
        assert db.scalar(select(func.count()).select_from(model)) == 0, model.__name__


def test_video_ids_and_note_text_never_reach_the_log(yt, signed_in, db):
    add(signed_in, text="secret study words")
    signed_in.post("/api/study/open", json={"video_id": LECTURE})
    for row in db.scalars(select(AppLog)):
        text = f"{row.route} {row.action}"
        assert LECTURE not in text and "secret" not in text
