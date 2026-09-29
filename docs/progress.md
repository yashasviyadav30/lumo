# Progress

Autonomous build session started 2026-09-29. Scope: Stages 1, 2, 3 and 4A of [plan.md](plan.md), plus curated-source research (replaces step 0.9). **If a usage limit interrupts the session, continue from "Next" below.**

Rules for this session: R1–R14, the cost rule, no secrets printed or committed. Anything that needs the user is listed under "Blocked on the user" and skipped.

## Status

| Step | Status | Note |
|---|---|---|
| 0.9 Curated sources (research) | 🔄 running | 4 parallel research agents (CS, CMA, NEET, AI) → `backend/app/data/fields/*.json`, `docs/curation/*.md` |
| 1.1 App shell | ✅ | Tabs, own name/logo, PWA with offline shell (commit 8074ad5) |
| 1.2 Watch page | ✅ | Official IFrame player, privacy-enhanced mode, no autoplay; 10 frontend tests pass |
| 1.3 iPhone Error 153 | 🟡 fix built, needs a device | Referrer meta + origin set; test on a real iPhone |
| 1.4 Player links | 🟡 needs devices | Tap logo/end screen on Android + iPhone and note where they go |
| 1.5 First deploy | ⛔ blocked | Needs Cloudflare login |
| 2.1–2.7 Accounts and data rules | ✅ | Backend + screens (sign-up with 18+ check, not-yet page, notice, privacy draft, delete my data); checked end-to-end against Supabase |
| 3.1–3.7 Light layer search | 🔄 backend ✅, search screen next | 35 backend tests; measured: cold ≈1.3 s, cached ≈60 ms (see below) |
| 4.1–4.8 (4A) Smart agent core | ⏳ | |

## Next

1. Stage 2 frontend: sign-up/in, first-run notice, 18+ refusal screen, Settings → Delete my data, draft privacy page.
2. (Done) Stage 2 backend, as designed:
   - `app/config.py` (pydantic-settings), `app/db.py` (SQLAlchemy; SQLite in tests), Alembic migrations run against Supabase.
   - Our data: users (no DOB stored, only `adult_confirmed_at`), sessions (opaque tokens, stored hashed), consents, goals, mutes, follows (user's own teachers), settings, app_log, quota_usage. YouTube data: yt_videos, yt_search_cache, each with `fetched_at`.
   - Purge >30 days at startup + every 6 h; app_log kept 1 year.
   - Logging: uvicorn access log off; middleware logs route template, status, time, HMAC user pseudonym, truncated IP. Video IDs only in POST bodies.
   - Delete-my-data endpoint deletes at once.
3. Stages 3 and 4A as in plan.md.

## Measurements (step 3.7)

20 real searches across CS, CMA, NEET and AI (2026-09-29, laptop in India → Supabase Mumbai):
- Search call (search.list): p50 713 ms, p95 976 ms.
- Video details (videos.list + saving): p50 586 ms, p95 744 ms (was 1,876 ms before removing a database lookup per video).
- **Cold search total ≈ 1.3 s (p50)**; cached search p50 60 ms, p95 113 ms. Target 1–2 s: met.
- Hidden per search: median 2. Mostly vertical Shorts (Shorts are off by default) and videos whose owner blocks embedding.

## Blocked on the user

- **App name** (R9): "FocusLearn" is a placeholder.
- **Render environment variables:** the deployed backend will need DATABASE_URL, SECRET_KEY, YOUTUBE_API_KEY and GROQ_API_KEY set in the Render dashboard (or a Render API key for Claude to do it).
- **Device checks (1.3, 1.4):** iPhone playback from the installed PWA; where player links go on Android and iPhone.

- **Cloudflare login (step 1.5):** `wrangler whoami` says not authenticated. Needs `npx wrangler login` in a browser.

## Decisions and comparisons

- Player host: privacy-enhanced `youtube-nocookie.com` over `youtube.com`: same player and controls, fewer cookies on users.
- PWA: `vite-plugin-pwa` over a hand-written service worker: it keeps the offline file list right on every build.
- Sign-in (planned): email + password (argon2) now; magic link needs an email provider account, Google sign-in needs an OAuth client (both need the user).
- Sessions (planned): opaque bearer tokens stored hashed, over JWT (can be revoked on account deletion) and over cookies (frontend and backend are on different sites; Safari blocks third-party cookies).
- Search cache: our own 24 h shared cache over YouTube ETags. As far as I know (not checked this session), a "not modified" answer still costs a search call, so ETags save no search quota.
- Shorts rule: "≤ 3 min AND vertical (YouTube's embed size)" over "≤ 3 min only". Duration alone hid 17 of 25 results for a maths query, many of them short horizontal lessons; unknown shape → shown.
- Entertainment by YouTube's type: its entertainment categories (incl. non-assignable ones like Movies, Trailers, Shows) + entertainment topics, but topics are ignored when YouTube itself says Education/Science/How-to. Documentary is never hidden. Curated and followed channels are exempt.
- App name: working name "FocusLearn" in `frontend/src/config.ts` until the user picks a real one.

## Tools added

- `tools/resolve_channel.py`: handle → channel ID (1 quota unit each), for the curator sheet. Doesn't score channels.
