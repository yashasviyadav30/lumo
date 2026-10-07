import pytest

from app.models import GroupMember, GroupPost, StudyGroup
from tests.conftest import ADULT

VID = "aircAruvnKk"


def other(client, email):
    """A second person: signs up on a fresh token and returns their auth header."""
    r = client.post("/api/auth/signup", json={**ADULT, "email": email}, headers={"Authorization": ""})
    return {"Authorization": f"Bearer {r.json()['token']}"}


@pytest.fixture()
def group(signed_in):
    g = signed_in.post("/api/groups", json={"name": "CA Inter batch", "my_name": "Asha"}).json()
    return g


def test_create_invite_join_and_names_not_emails(signed_in, group):
    ravi = other(signed_in, "ravi@example.com")
    preview = signed_in.post("/api/groups/preview", json={"code": group["invite_code"]}, headers=ravi).json()
    assert preview["name"] == "CA Inter batch" and preview["members"] == 1 and not preview["member"]
    joined = signed_in.post("/api/groups/join", json={"code": group["invite_code"], "my_name": "Ravi"}, headers=ravi).json()
    assert [m["name"] for m in joined["members"]] == ["Asha", "Ravi"]
    assert "example.com" not in str(joined)  # nobody's email is shown
    assert not joined["i_own"] and group["i_own"]
    # Joining twice is fine; a wrong code is not.
    assert signed_in.post("/api/groups/join", json={"code": group["invite_code"], "my_name": "R"}, headers=ravi).status_code == 200
    assert signed_in.post("/api/groups/preview", json={"code": "nope-nope-nope"}).status_code == 404


def test_posts_threads_and_unread(signed_in, group):
    ravi = other(signed_in, "ravi@example.com")
    signed_in.post("/api/groups/join", json={"code": group["invite_code"], "my_name": "Ravi"}, headers=ravi)
    gid = group["id"]
    doubt = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "doubt", "text": "At 14:20 I lost it", "video_id": VID, "t_seconds": 860}).json()
    assert doubt["author"] == "Asha" and doubt["t_seconds"] == 860 and doubt["mine"]
    # Ravi sees one unread post, replies in the thread; Asha then sees one unread reply.
    assert signed_in.get("/api/groups", headers=ravi).json()["unread"] == 1
    feed = signed_in.post("/api/groups/open", json={"group_id": gid}, headers=ravi).json()
    assert [p["kind"] for p in feed["posts"]] == ["doubt"] and not feed["posts"][0]["can_delete"]
    assert signed_in.get("/api/groups", headers=ravi).json()["unread"] == 0  # opening marks it seen
    signed_in.post("/api/groups/reply", json={"post_id": doubt["id"], "text": "It's the chain rule"}, headers=ravi)
    assert signed_in.get("/api/groups").json()["unread"] == 1
    t = signed_in.post("/api/groups/thread", json={"post_id": doubt["id"]}).json()
    assert [r["text"] for r in t["replies"]] == ["It's the chain rule"] and t["post"]["replies"] == 1
    # Threads are one level deep, like Slack.
    reply_id = t["replies"][0]["id"]
    assert signed_in.post("/api/groups/reply", json={"post_id": reply_id, "text": "x"}).status_code == 422


def test_post_rules(signed_in, group):
    gid = group["id"]
    assert signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "note", "text": " "}).status_code == 422
    assert signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "video"}).status_code == 422
    shared = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "video", "video_id": VID, "attach": "map"}).json()
    assert shared["attach"] == "map"
    assert signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "video", "video_id": "bad"}).status_code == 422


def test_outsiders_see_nothing(signed_in, group):
    eve = other(signed_in, "eve@example.com")
    assert signed_in.post("/api/groups/open", json={"group_id": group["id"]}, headers=eve).status_code == 404
    assert signed_in.post("/api/groups/post", json={"group_id": group["id"], "kind": "note", "text": "hi"}, headers=eve).status_code == 404
    post = signed_in.post("/api/groups/post", json={"group_id": group["id"], "kind": "note", "text": "hi"}).json()
    assert signed_in.post("/api/groups/thread", json={"post_id": post["id"]}, headers=eve).status_code == 404
    assert signed_in.post("/api/groups/report", json={"post_id": post["id"]}, headers=eve).status_code == 404


def test_owner_moderates_members_report_and_leave(signed_in, group, db):
    ravi = other(signed_in, "ravi@example.com")
    joined = signed_in.post("/api/groups/join", json={"code": group["invite_code"], "my_name": "Ravi"}, headers=ravi).json()
    gid = group["id"]
    bad = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "note", "text": "spam"}, headers=ravi).json()
    mine = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "note", "text": "my note"}).json()
    # Members can report; only the author or owner can delete.
    assert signed_in.post("/api/groups/report", json={"post_id": mine["id"]}, headers=ravi).status_code == 204
    assert signed_in.post("/api/groups/report", json={"post_id": mine["id"]}, headers=ravi).status_code == 204  # twice is fine
    assert signed_in.post("/api/groups/post/delete", json={"post_id": mine["id"]}, headers=ravi).status_code == 403
    assert signed_in.post("/api/groups/post/delete", json={"post_id": bad["id"]}).status_code == 204  # owner removes spam
    ravi_id = next(m["id"] for m in joined["members"] if m["name"] == "Ravi")
    asha_id = next(m["id"] for m in joined["members"] if m["name"] == "Asha")
    assert signed_in.post("/api/groups/remove", json={"group_id": gid, "member_id": asha_id}, headers=ravi).status_code == 403
    assert signed_in.post("/api/groups/remove", json={"group_id": gid, "member_id": ravi_id}).status_code == 204
    assert signed_in.post("/api/groups/open", json={"group_id": gid}, headers=ravi).status_code == 404
    # The last member to leave deletes the group.
    assert signed_in.post("/api/groups/leave", json={"group_id": gid}).status_code == 204
    assert db.query(StudyGroup).count() == 0


def test_owner_passes_on_and_posts_go_with_a_deleted_account(signed_in, group, db):
    ravi = other(signed_in, "ravi@example.com")
    signed_in.post("/api/groups/join", json={"code": group["invite_code"], "my_name": "Ravi"}, headers=ravi)
    signed_in.post("/api/groups/post", json={"group_id": group["id"], "kind": "note", "text": "Asha's note"})
    signed_in.delete("/api/me")  # Asha deletes their data
    db.expire_all()
    assert db.query(GroupPost).count() == 0 and db.query(GroupMember).count() == 1
    view = signed_in.post("/api/groups/open", json={"group_id": group["id"]}, headers=ravi).json()
    assert view["i_own"] and [m["name"] for m in view["members"]] == ["Ravi"]


def test_group_ids_never_reach_the_log(signed_in, group, db):
    from app.models import AppLog

    signed_in.post("/api/groups/open", json={"group_id": group["id"]})
    for row in db.query(AppLog):
        assert group["id"] not in (row.route or "") and group["invite_code"] not in (row.route or "")


def test_a_doubt_is_marked_answered_by_its_asker_or_the_owner_only(signed_in, group):
    ravi = other(signed_in, "ravi@example.com")
    signed_in.post("/api/groups/join", json={"code": group["invite_code"], "my_name": "Ravi"}, headers=ravi)
    gid = group["id"]
    mine = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "doubt", "text": "Why sigmoid?"}).json()
    assert mine["can_answer"] and not mine["answered"]
    note = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "note", "text": "Read ch 2"}).json()
    # Ravi neither asked it nor owns the group.
    assert signed_in.post("/api/groups/post/answered", json={"post_id": mine["id"], "answered": True}, headers=ravi).status_code == 403
    assert signed_in.post("/api/groups/post/answered", json={"post_id": note["id"], "answered": True}).status_code == 422
    assert signed_in.post("/api/groups/post/answered", json={"post_id": mine["id"], "answered": True}).status_code == 204
    feed = signed_in.post("/api/groups/open", json={"group_id": gid}).json()
    assert next(p for p in feed["posts"] if p["id"] == mine["id"])["answered"]
    # Ravi's own doubt: the owner may close it too.
    his = signed_in.post("/api/groups/post", json={"group_id": gid, "kind": "doubt", "text": "And ReLU?"}, headers=ravi).json()
    assert signed_in.post("/api/groups/post/answered", json={"post_id": his["id"], "answered": True}).status_code == 204
