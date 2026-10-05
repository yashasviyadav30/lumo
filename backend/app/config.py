"""Settings from environment variables (portability rule). Locally they come from backend/.env."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore")

    database_url: str = ""
    secret_key: str = ""
    youtube_api_key: str = ""
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-20b"
    # Comma-separated list of frontend origins allowed to call the API. Setting CORS_ORIGINS on the host
    # overrides this default (the Cloudflare address is here so the live app works before that's set).
    cors_origins: str = "https://focuslearn.focuslearn.workers.dev,http://localhost:5173,http://localhost:4173"
    # Search quota for the whole app per Pacific day (R12). Keep a margin below YouTube's 100.
    search_quota_per_day: int = 95
    gemini_api_key: str = ""
    # OAuth client ID (Web) from Google Cloud. Empty = the "Continue with Google" buttons stay hidden.
    google_client_id: str = "623328643438-nemnu1bufrccm8a1ggkuontijnusaech.apps.googleusercontent.com"  # public, not a secret
    # Tried in order; the next one is used when one is overloaded (free models often answer 503).
    gemini_models: str = "gemini-3.5-flash-lite,gemini-3.8-flash"
    # Free tier allows 8 hours of YouTube video per day (Gemini video docs, 2026-09-23). Keep a margin.
    gemini_video_s_per_day: int = 7 * 3600

    @property
    def sqlalchemy_url(self) -> str:
        """Supabase gives postgresql://…; SQLAlchemy needs the psycopg 3 driver named."""
        url = self.database_url
        for prefix in ("postgresql://", "postgres://"):
            if url.startswith(prefix):
                return "postgresql+psycopg://" + url[len(prefix):]
        return url

    @property
    def gemini_model_list(self) -> list[str]:
        return [m.strip() for m in self.gemini_models.split(",") if m.strip()]

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
