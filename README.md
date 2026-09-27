# Focused YouTube Learning App (working name)

A YouTube feed built around what you need to learn, without Shorts, recommendations and entertainment pulling you away. Videos play through YouTube's official embedded player.

Start with [docs/plan.md](docs/plan.md) for the build plan and [docs/research-summary.md](docs/research-summary.md) for the decisions behind it. Full findings are in [docs/feasibility.md](docs/feasibility.md) and [docs/research.md](docs/research.md).

## Stack

Confirmed 2026-09-27 (plan step 0.1).

| Part | Choice | Why |
|---|---|---|
| Backend | **Python + FastAPI** | The research tools and any later ML work are in Python |
| Frontend | **TypeScript, React + Vite**, built as a PWA | One web app for Android, iPhone and laptops; installable |
| Database | **Postgres** | One database for user data and the short-lived YouTube cache |
| Hosting | **Google Cloud Run, Mumbai (`asia-south1`)** | Pay per use, free tier covers the early stage, data stays in India |
| LLM | **Groq or Fireworks, zero data retention on**, GPT-OSS or Qwen model | Fast, no data kept, and the same open model can be self-hosted later |

## Layout

| Folder | What's in it |
|---|---|
| `backend/` | FastAPI server |
| `frontend/` | React + Vite PWA |
| `tools/` | Small scripts for development |
| `docs/` | Plan, research and decisions |
| `docs/archive/` | Outdated drafts written before the research. Don't follow them. |

## Current status

Planning done. Building Stage 0 (setup) of [docs/plan.md](docs/plan.md).
