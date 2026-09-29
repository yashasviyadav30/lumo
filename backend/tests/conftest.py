import os

# Never touch the real database or real APIs in tests.
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["YOUTUBE_API_KEY"] = "test-youtube-key"
os.environ["GROQ_API_KEY"] = "test-groq-key"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app import db as dbmod  # noqa: E402
from app.config import get_settings  # noqa: E402
from app.db import Base  # noqa: E402
from app.main import create_app  # noqa: E402
from app.routers import accounts  # noqa: E402

get_settings.cache_clear()


@pytest.fixture()
def engine():
    dbmod.configure("sqlite+pysqlite:///:memory:")
    engine = dbmod.get_engine()
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)


@pytest.fixture()
def db(engine):
    with dbmod.session_factory()() as session:
        yield session


@pytest.fixture()
def client(engine):
    accounts._attempts.clear()
    with TestClient(create_app(run_background_jobs=False)) as c:
        yield c


ADULT = {"email": "asha@example.com", "password": "correct horse 1", "date_of_birth": "2000-05-01", "accepted_notice": True}


@pytest.fixture()
def signed_in(client):
    r = client.post("/api/auth/signup", json=ADULT)
    assert r.status_code == 201, r.text
    token = r.json()["token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client
