"""Groq chat client (zero data retention is on for the account; docs/groq-zdr.png). Sends only what it's given:
callers pass the user's own text and our own data, never YouTube titles (R4)."""

import httpx

from app.config import get_settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


class LLMError(Exception):
    pass


def groq_json(system: str, user: str, timeout: float = 8.0) -> str:
    settings = get_settings()
    if not settings.groq_api_key:
        raise LLMError("groq_not_configured")
    r = httpx.post(
        GROQ_URL,
        headers={"Authorization": f"Bearer {settings.groq_api_key}"},
        json={
            "model": settings.groq_model,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "temperature": 0,
            "response_format": {"type": "json_object"},
            "reasoning_effort": "low",
            "max_completion_tokens": 600,
        },
        timeout=timeout,
    )
    if r.status_code != 200:
        raise LLMError(f"HTTP {r.status_code}")
    return r.json()["choices"][0]["message"]["content"]
