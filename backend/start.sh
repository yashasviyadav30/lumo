#!/bin/sh
# Container start: apply database migrations when a database is configured, then serve.
set -e
if [ -n "$DATABASE_URL" ]; then
  /app/.venv/bin/alembic upgrade head
else
  echo "DATABASE_URL not set: starting without a database (only /health works)."
fi
# --no-access-log: uvicorn's log would print raw paths; our own log keeps route templates only (R11).
exec /app/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" --no-access-log --proxy-headers --forwarded-allow-ips="*"
