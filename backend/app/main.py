"""FastAPI app."""

import asyncio
import contextlib
import logging
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db import get_engine
from app.ai_notes import notes_loop
from app.purge import purge_loop
from app.request_log import RequestLogMiddleware
from app.routers import accounts, ai_notes, goals, groups, images, search, study

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
# httpx logs every request URL at INFO, and YouTube URLs carry the API key: never let them reach a log.
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)


@contextlib.asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    tasks = [asyncio.create_task(purge_loop()), asyncio.create_task(notes_loop())] if get_engine() is not None else []
    yield
    for task in tasks:
        task.cancel()


def create_app(run_background_jobs: bool = True) -> FastAPI:
    app = FastAPI(title="Thrywe backend", lifespan=lifespan if run_background_jobs else None)
    app.add_middleware(RequestLogMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().cors_origin_list,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )
    app.include_router(accounts.router)
    app.include_router(search.router)
    app.include_router(goals.router)
    app.include_router(study.router)
    app.include_router(ai_notes.router)
    app.include_router(groups.router)
    app.include_router(images.router)

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
