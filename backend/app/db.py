"""Database engine and sessions. Created on first use, so the app starts even without a database."""

from collections.abc import Iterator

from fastapi import HTTPException
from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import get_settings


class Base(DeclarativeBase):
    pass


_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def make_engine(url: str) -> Engine:
    if url.startswith("sqlite"):
        # Tests use one in-memory SQLite database shared across threads.
        engine = create_engine(url, connect_args={"check_same_thread": False}, poolclass=StaticPool)

        @event.listens_for(engine, "connect")
        def _fk_on(dbapi_conn, _record):  # SQLite ignores ON DELETE CASCADE unless this is on
            dbapi_conn.execute("PRAGMA foreign_keys=ON")

        return engine
    # Supabase's session pooler; pre_ping survives the database pausing when idle.
    return create_engine(url, pool_pre_ping=True, pool_size=5, max_overflow=5)


def configure(url: str) -> None:
    global _engine, _session_factory
    _engine = make_engine(url)
    _session_factory = sessionmaker(bind=_engine, expire_on_commit=False)


def get_engine() -> Engine | None:
    if _engine is None:
        url = get_settings().sqlalchemy_url
        if not url:
            return None
        configure(url)
    return _engine


def session_factory() -> sessionmaker[Session] | None:
    get_engine()
    return _session_factory


def get_db() -> Iterator[Session]:
    factory = session_factory()
    if factory is None:
        raise HTTPException(status_code=503, detail="database_not_configured")
    with factory() as session:
        yield session
