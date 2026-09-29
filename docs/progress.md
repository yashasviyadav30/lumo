# Progress

Autonomous build session started 2026-09-29. Scope: Stages 1, 2, 3 and 4A of [plan.md](plan.md), plus curated-source research (replaces step 0.9). **If a usage limit interrupts the session, continue from "Next" below.**

Rules for this session: R1–R14, the cost rule, no secrets printed or committed. Anything that needs the user is listed under "Blocked on the user" and skipped.

## Status

| Step | Status | Note |
|---|---|---|
| 0.9 Curated sources (research) | ✅ draft | CS 66 topics / 15 sources, CMA 125 / 15, NEET 53 / 21, AI 29 / 30. Each needs a quick human check (`docs/curation/*.md`) |
| 1.1 App shell | ✅ | Own name/logo, tabs, PWA with offline shell |
| 1.2 Watch page | ✅ | Official player, privacy-enhanced mode, no autoplay; checked in real Edge |
| 1.3 iPhone Error 153 | 🟡 | Fix built in; needs a real iPhone |
| 1.4 Player links | 🟡 | Needs Android and iPhone |
| 1.5 First deploy | ⛔ | Frontend needs the Cloudflare login; backend is live on Render |
| 2.1–2.7 Accounts and data rules | ✅ | Sign-up with 18+ check, notice, privacy draft, delete my data, purge, clean logs |
| 3.1–3.7 Light layer search | ✅ | Hidden line, cache, quota guard; cold ≈1.3 s, cached ≈60 ms |
| 4.1, 4.2, 4.4, 4.5, 4.7a, 4.8 (4A) | ✅ | Goal parser 98% (hybrid) on 66 goals; Did-you-mean; topic chips; query builder on topic for 20/20 |
| 5.6 Follow your own teachers | 🟡 backend | Added to the plan; backend and the search button built; feed use comes in 5.2 |

Tests: backend 52 (pytest), frontend 27 (vitest), plus an end-to-end run in real Edge (`npm run e2e`).

## Next

Session finished. See `docs/session-report.md`. Next stage in the plan is 5A (curated mapping and feed).

## Measurements (step 3.7)

20 real searches across CS, CMA, NEET and AI (2026-09-29, laptop in India → Supabase Mumbai):
- Search call (search.list): p50 713 ms, p95 976 ms.
- Video details (videos.list + saving): p50 586 ms, p95 744 ms (was 1,876 ms before removing a database lookup per video).
- **Cold search total ≈ 1.3 s (p50)**; cached search p50 60 ms, p95 113 ms. Target 1–2 s: met.
- Hidden per search: median 2. Mostly vertical Shorts (Shorts are off by default) and videos whose owner blocks embedding.

## Blocked on the user

- **App name** (R9): "FocusLearn" is a placeholder.
- ~~Render environment variables~~: done by the user 2026-09-29 ("Import from .env"); `/api/me` now answers 401 instead of 503. Still to add: `CORS_ORIGINS` with the frontend's address once it's on Cloudflare.
- **Rotate all secrets before Test 1** (plan step 6.7): an old screenshot showed them.
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

- Goal parser: rules (96%, ~3 ms) vs LLM-only vs hybrid (98%, LLM on 1 of 66 goals). LLM-only is refused by Groq's free tier (HTTP 429) because our catalogue prompt is ~5,500 tokens; hybrid falls back to rules when that happens. Picked hybrid.
- Query builder: CS/CMA papers use the stage + full paper name (codes like CMSL/CRVI are rarely in video titles); units use the search term closest to what the user typed; up to 2 user words kept ("one shot", "botany"). All 20 real test searches were on topic by eye.
- Thumbnails: the duration badge moved off the thumbnail, so YouTube's image is shown untouched (guide: thumbnails must not be altered).

## Tools added

- `tools/resolve_channel.py`: handle → channel ID (1 quota unit each), for the curator sheet. Doesn't score channels.
- `tools/measure_search.py`: real search timings, cold and cached (step 3.7).
- `tools/eval_goals.py`: scores goal parsers on the 66-goal test set.
- `frontend/e2e/smoke.mjs` (`npm run e2e`): end-to-end run in real Edge.
