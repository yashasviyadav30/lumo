# One image for every host (portability rule): Render now, Cloud Run at launch.
FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:0.10 /uv /usr/local/bin/uv

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy PYTHONUNBUFFERED=1

# Install dependencies first so code changes don't rebuild this layer.
COPY pyproject.toml uv.lock .python-version ./
RUN uv sync --frozen --no-dev --no-install-project

COPY app ./app
COPY migrations ./migrations
COPY alembic.ini start.sh ./
RUN chmod +x start.sh

# Render and Cloud Run both pass the port in $PORT.
ENV PORT=8000
EXPOSE 8000
CMD ["./start.sh"]
