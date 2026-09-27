"""FastAPI app. Stage 0: a health check only."""

from fastapi import FastAPI

app = FastAPI(title="Focus backend")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
