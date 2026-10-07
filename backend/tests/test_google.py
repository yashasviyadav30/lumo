from datetime import date

import pytest

from app import google
from app.config import get_settings
from app.models import Follow, User

CLIENT = "123-test.apps.googleusercontent.com"
TEACHER = "UC" + "t" * 22


@pytest.fixture()
def google_ok(monkeypatch):
    monkeypatch.setattr(get_settings(), "google_client_id", CLIENT)
    monkeypatch.setattr(google, "verify_id_token", lambda cred: {"email": "riya@gmail.com", "sub": "1"})


def test_config_shows_the_client_id_only_when_set(client, monkeypatch):
    monkeypatch.setattr(get_settings(), "google_client_id", "")
    assert client.get("/api/config").json() == {"google_client_id": None}
    monkeypatch.setattr(get_settings(), "google_client_id", CLIENT)
    assert client.get("/api/config").json() == {"google_client_id": CLIENT}


def test_google_needs_an_account_or_an_18_plus_sign_up(client, db, google_ok):
    cred = {"credential": "x" * 40}
    assert client.post("/api/auth/google", json=cred).json()["detail"] == "no_account"
    child = {**cred, "date_of_birth": str(date.today().replace(year=date.today().year - 15)), "accepted_notice": True}
    assert client.post("/api/auth/google", json=child).status_code == 403
    assert db.query(User).count() == 0  # nothing stored about a minor (R10)
    adult = {**cred, "date_of_birth": "1999-02-02", "accepted_notice": True}
    r = client.post("/api/auth/google", json=adult)
    assert r.status_code == 200 and r.json()["me"]["email"] == "riya@gmail.com"
    # Next time, the same Google account just signs in.
    assert client.post("/api/auth/google", json=cred).status_code == 200
    # A Google account has no password, so password sign-in can't work for it.
    assert client.post("/api/auth/login", json={"email": "riya@gmail.com", "password": "!google"}).status_code == 401


def test_google_signs_in_an_existing_password_account_with_the_same_email(client, google_ok):
    from tests.conftest import ADULT

    squatter = client.post("/api/auth/signup", json={**ADULT, "email": "riya@gmail.com"}).json()["token"]
    assert client.post("/api/auth/google", json={"credential": "x" * 40}).status_code == 200
    # Email sign-up never proved the address: whoever set that password loses it and their session (pre-hijack).
    assert client.get("/api/me", headers={"Authorization": f"Bearer {squatter}"}).status_code == 401
    login = client.post("/api/auth/login", json={"email": "riya@gmail.com", "password": ADULT["password"]})
    assert login.status_code == 401


def test_bad_or_unconfigured_google_tokens_are_refused(client, monkeypatch):
    cred = {"credential": "x" * 40}
    monkeypatch.setattr(get_settings(), "google_client_id", "")
    assert client.post("/api/auth/google", json=cred).json()["detail"] == "google_not_configured"
    monkeypatch.setattr(get_settings(), "google_client_id", CLIENT)

    def bad(_):
        raise google.GoogleError("invalid_token")

    monkeypatch.setattr(google, "verify_id_token", bad)
    assert client.post("/api/auth/google", json=cred).status_code == 401


def test_verify_id_token_checks_audience_issuer_and_email(monkeypatch):
    import httpx
    import respx

    monkeypatch.setattr(get_settings(), "google_client_id", CLIENT)
    good = {"aud": CLIENT, "iss": "https://accounts.google.com", "email": "Riya@Gmail.com", "email_verified": "true", "exp": "9999999999", "sub": "1"}
    with respx.mock:
        route = respx.post(google.TOKENINFO)
        route.return_value = httpx.Response(200, json=good)
        assert google.verify_id_token("t")["email"] == "riya@gmail.com"
        for change in ({"aud": "someone-else"}, {"iss": "evil.example"}, {"email_verified": "false"}, {"exp": "1"}):
            route.return_value = httpx.Response(200, json=good | change)
            with pytest.raises(google.GoogleError):
                google.verify_id_token("t")


def test_import_follows_her_youtube_subscriptions(signed_in, db, monkeypatch):
    monkeypatch.setattr(google, "subscription_channels", lambda token: [TEACHER, TEACHER, "not-a-channel"])
    r = signed_in.post("/api/follows/import", json={"access_token": "y" * 40})
    assert r.json() == {"imported": 1, "subscriptions": 1}
    assert [f.channel_id for f in db.query(Follow)] == [TEACHER]
    assert signed_in.post("/api/follows/import", json={"access_token": "y" * 40}).json()["imported"] == 0

    def denied(_):
        raise google.GoogleError("google_denied")

    monkeypatch.setattr(google, "subscription_channels", denied)
    assert signed_in.post("/api/follows/import", json={"access_token": "y" * 40}).status_code == 400


def test_password_sign_in_on_a_google_account_says_to_use_google(client, db, google_ok):
    from tests.conftest import ADULT

    client.post("/api/auth/google", json={"credential": "x" * 40, "date_of_birth": ADULT["date_of_birth"], "accepted_notice": True})
    r = client.post("/api/auth/login", json={"email": "riya@gmail.com", "password": "anything at all"})
    assert r.status_code == 401 and r.json()["detail"] == "use_google"
