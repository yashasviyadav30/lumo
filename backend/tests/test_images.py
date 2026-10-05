import base64

from app.models import NoteImage
from app.routers import images

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 40
WEBP = b"RIFF" + b"\x00\x00\x00\x00" + b"WEBP" + b"\x00" * 40


def b64(raw: bytes) -> str:
    return base64.b64encode(raw).decode()


def test_paste_a_screenshot_and_show_it(signed_in):
    r = signed_in.post("/api/notepad/images", json={"mime": "image/webp", "data": b64(WEBP)})
    assert r.status_code == 201 and r.json()["url"].startswith("/api/notepad/images/")
    shown = signed_in.get(r.json()["url"], headers={"Authorization": ""})  # a plain <img> sends no sign-in
    assert shown.status_code == 200 and shown.content == WEBP
    assert shown.headers["content-type"] == "image/webp" and shown.headers["x-content-type-options"] == "nosniff"


def test_only_real_images_are_accepted(signed_in):
    html = b"<html><script>alert(1)</script></html>" + b" " * 20
    assert signed_in.post("/api/notepad/images", json={"mime": "image/png", "data": b64(html)}).status_code == 422
    assert signed_in.post("/api/notepad/images", json={"mime": "image/svg+xml", "data": b64(PNG)}).status_code == 422
    assert signed_in.post("/api/notepad/images", json={"mime": "image/png", "data": "not base64!!" * 3}).status_code == 422
    assert signed_in.post("/api/notepad/images", json={"mime": "image/png", "data": b64(PNG)}).status_code == 201


def test_limits_and_deletion(signed_in, db, monkeypatch):
    monkeypatch.setattr(images, "MAX_PER_USER", 1)
    assert signed_in.post("/api/notepad/images", json={"mime": "image/png", "data": b64(PNG)}).status_code == 201
    assert signed_in.post("/api/notepad/images", json={"mime": "image/png", "data": b64(PNG)}).status_code == 429
    assert signed_in.get("/api/notepad/images/00000000-0000-4000-8000-000000000000").status_code == 404
    signed_in.delete("/api/me")
    db.expire_all()
    assert db.query(NoteImage).count() == 0


def test_needs_sign_in_to_upload(client):
    assert client.post("/api/notepad/images", json={"mime": "image/png", "data": b64(PNG)}).status_code == 401
