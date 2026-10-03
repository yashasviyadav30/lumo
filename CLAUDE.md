# FocusLearn — project guide for Claude

A focused YouTube study app for Indian students (18+). It plays lectures through YouTube's official embedded
player and adds a study layer: clean search and feed, marks and doubts on the exact second, a split-screen
notepad, revision cards that replay the forgotten 90 seconds, and a notebook. Working name "FocusLearn" (the
user hasn't picked the real name yet).

- Live app: https://focuslearn.focuslearn.workers.dev (Cloudflare Worker + static assets)
- Backend: https://focus-app-6fb9.onrender.com (Render free, Singapore, Docker) — phones never call it directly;
  the Worker passes `/api/*` and `/health` through (some Indian mobile networks fail on `*.onrender.com`).
- Database: Supabase Postgres (Mumbai, session pooler). GitHub: `yashasviyadav30/focus-app` (private, `main`).

## Read these first

| File | What it holds |
|---|---|
| `docs/plan.md` | The plan, stages, and **rules R1–R14** (YouTube policy, DPDP, user decisions). Check every feature against them. |
| `docs/progress.md` | What is done, decisions with reasons, measurements, what is blocked on the user. Keep it updated. |
| `docs/ux-review.md` | Opus design review (2026-10-02) with 38 screenshots in `docs/ux-review/`; most of its top 10 is applied. |
| `docs/idea.md`, `docs/ideation/` | Product ideas and build order (v2 study companion came from here). |
| `docs/research.md`, `docs/feasibility.md` | Policy research; where R3 ("no judging videos") comes from. |
| `docs/guide/app-guide.html` | Visual guide: every screen with arrows explaining each button (built from real screenshots). |

Full chat history of the build (first commit 2026-09-27, to 2026-10-03):
`C:\Users\yasha\.claude\projects\C--Users-yasha-Downloads-new-project\53879416-9635-49a6-8f57-7049d50f390a.jsonl`
(large JSONL; search it, don't read it whole).

## Hard rules (short form; full table in plan.md)

- **R3:** a video's type comes only from YouTube's own fields (`categoryId`, `topicDetails`, …). Never judge
  videos by title, description, comments or an LLM. Google's policy guide forbids "infer or estimate the content
  category/type" (re-checked 2026-10-02). The user asked for this twice; the answer stays no.
- **R1:** YouTube data (videos, search cache, comments) kept ≤ 30 days; `app/purge.py` deletes it.
- **R7:** nothing covers the player; thumbnails never altered. **R8:** no streaks/points/rewards for watching.
- **R11:** video IDs and search text travel in POST bodies, never URLs; logs hold route templates only.
- **R12:** `search.list` = 100 calls/day for the whole app; everything is cached and degrades gracefully.
- **R14:** no viewing record for Made-for-Kids videos. **R10:** accounts are 18+.
- **Secrets:** never print, commit or push them. `backend/.env` holds them; never `cat`/`tail` it or any log
  that could contain a YouTube URL (httpx logging is set to WARNING because URLs carry the API key).
- **Cost:** nothing that costs money, no billing, no deleting projects or data without asking.

## Working with the user

- Reply in **English** (user writes Hindi/Hinglish; global CLAUDE.md has IELTS correction rules), plain style.
- **Commit and push every finished change as its own commit** (they want an active GitHub graph). No empty or
  fake commits. Each push restarts Render for ~1 min — run live tests *before* pushing, not right after.
- They judge by what they see on their phone: show screenshots, check both themes, test the live site.
- Things only the user can do go in progress.md under "Blocked on the user"; don't stall on them.

## Stack and layout

- `backend/` — Python 3.13, FastAPI, SQLAlchemy 2 + Alembic, uv. Key files: `app/routers/{accounts,goals,search,study}.py`,
  `app/filters.py` (hide list), `app/feed.py` (Home feed), `app/search.py` (cache + quota), `app/youtube.py`,
  `app/study.py` (review ladder, replay window), `app/purge.py`. Tests in `backend/tests` (fake YouTube in `fake_youtube.py`).
- `frontend/` — React 19, Vite 8, TypeScript, react-router 7, lucide-react, TipTap (notepad, lazy-loaded),
  vite-plugin-pwa. Pages in `src/pages`, theme tokens at the top of `src/index.css`, API client `src/lib/api.ts`
  (waits up to 75 s for a sleeping server on safe requests), Worker in `frontend/worker/index.js`.
- Tabs: Home (Continue card + feed) · Search · Library (Starred, History) · My notes (route `/personal`).
  Study page `/watch/:id`: Mark · Doubt · Notepad · −10s; tabs Marks / Description / Comments; ☆ Star video.

## Commands

```
# backend
cd backend && uv run pytest -q                      # 85 tests
cd backend && uv run uvicorn app.main:app --port 8000 --no-access-log
cd backend && uv run alembic revision --autogenerate -m "..." && uv run alembic upgrade head   # check for drops first
# frontend
cd frontend && npx tsc -b && npm run lint && npx vitest run   # 45 tests
cd frontend && npx vite --port 5173                   # proxies /api to :8000
cd frontend && npm run build && npx wrangler deploy   # deploy app + Worker
# end-to-end + visual guide (throwaway account, always deleted)
cd frontend && node e2e/guide.mjs && node e2e/guide-build.mjs                                   # local
cd frontend && E2E_BASE=https://focuslearn.focuslearn.workers.dev node e2e/guide.mjs            # live
```
Render deploys automatically on push and runs `alembic upgrade head` on start.

## Known gotchas

- Bash heredocs break on some quote patterns in this environment: write content with the Write tool, or a
  Python script file in the scratchpad. In Python strings, `\b` becomes a backspace: use raw strings.
- `npx vite` sometimes outlives Stop-Process by command line; free the port by its listening PID.
- Playwright typing into TipTap needs ~150 ms after moving the cursor before Enter (the editor reads it late).
- Concurrent first-inserts (comments cache, star, notepad) are guarded with `IntegrityError` handling.
- Free Render sleeps after 15 idle minutes (30–60 s wake); the app pings `/health` on open and shows a
  "Waking up the server" banner while it retries.
