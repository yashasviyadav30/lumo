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
| 1.5 First deploy | ✅ | Frontend https://focuslearn.focuslearn.workers.dev, backend on Render; `E2E_BASE=<url> npm run e2e` passes live |
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
- ~~Render environment variables~~: done by the user 2026-09-29 ("Import from .env"); `/api/me` now answers 401 instead of 503. The Cloudflare address is allowed through the backend's CORS default; setting `CORS_ORIGINS` on Render would override it.
- **Rotate all secrets before Test 1** (plan step 6.7): an old screenshot showed them.
- **Device checks (1.3, 1.4):** iPhone playback from the installed PWA; where player links go on Android and iPhone.


## Decisions and comparisons

- Player host: privacy-enhanced `youtube-nocookie.com` over `youtube.com`: same player and controls, fewer cookies on users.
- PWA: `vite-plugin-pwa` over a hand-written service worker: it keeps the offline file list right on every build.
- Sign-in (planned): email + password (argon2) now; magic link needs an email provider account, Google sign-in needs an OAuth client (both need the user).
- Sessions (planned): opaque bearer tokens stored hashed, over JWT (can be revoked on account deletion) and over cookies (frontend and backend are on different sites; Safari blocks third-party cookies).
- Search cache: our own 24 h shared cache over YouTube ETags. As far as I know (not checked this session), a "not modified" answer still costs a search call, so ETags save no search quota.
- Shorts rule: "≤ 3 min AND vertical (YouTube's embed size)" over "≤ 3 min only". Duration alone hid 17 of 25 results for a maths query, many of them short horizontal lessons; unknown shape → shown.
- Entertainment by YouTube's type: its entertainment categories (incl. non-assignable ones like Movies, Trailers, Shows) + entertainment topics, but topics are ignored when YouTube itself says Education/Science/How-to. Documentary is never hidden. Curated and followed channels are exempt.
- Frontend hosting: this wrangler version sends Pages commands to Workers, so the frontend is deployed as Workers static assets (no Worker code, same static build): portable. Account subdomain `focuslearn` registered.
- App name: working name "FocusLearn" in `frontend/src/config.ts` until the user picks a real one.

- Goal parser: rules (96%, ~3 ms) vs LLM-only vs hybrid (98%, LLM on 1 of 66 goals). LLM-only is refused by Groq's free tier (HTTP 429) because our catalogue prompt is ~5,500 tokens; hybrid falls back to rules when that happens. Picked hybrid.
- Query builder: CS/CMA papers use the stage + full paper name (codes like CMSL/CRVI are rarely in video titles); units use the search term closest to what the user typed; up to 2 user words kept ("one shot", "botany"). All 20 real test searches were on topic by eye.
- Thumbnails: the duration badge moved off the thumbnail, so YouTube's image is shown untouched (guide: thumbnails must not be altered).

## Tools added

- `tools/resolve_channel.py`: handle → channel ID (1 quota unit each), for the curator sheet. Doesn't score channels.
- `tools/measure_search.py`: real search timings, cold and cached (step 3.7).
- `tools/eval_goals.py`: scores goal parsers on the 66-goal test set.
- `frontend/e2e/smoke.mjs` (`npm run e2e`): end-to-end run in real Edge.

## v2.0 study companion (built 2026-10-01, from `docs/idea.md`)

- Done and live: 4 tabs (Home · Search · Library · Personal; Settings inside Personal); study page with Mark · Doubt · ★ · −10s under the player (keys N, D, S), fill-in tray, tap a time to jump back, resume from the last spot; cards from her own notes (tap words to hide), review ladder 1 day → 3 days → retired, Forgot replays only t−30 s to t+60 s; Personal notebook by lecture with search, Doubts/Starred filters and Markdown export; Home opens on resume, cards due or open doubts.
- Tests: backend 69, frontend 36 (9 new), live end-to-end run passed on https://focuslearn.focuslearn.workers.dev (test account deleted by the run).
- Not built yet (later in `idea.md` build order): doubts answered by friends, the paper tracker, amendments, past-paper drill.
- Still needs a real phone check: the capture bar and card sheet on iPhone Safari and Android Chrome (1.3, 1.4).

## Premium redesign (2026-10-01)

- User feedback: "app looks useless, can't find notes or friends, nothing special". Valid: features were hidden and the look was plain.
- Done and live: new design system (Plus Jakarta Sans, violet gradient, icon tab bar, laptop sidebar, dark mode); Welcome shows all six features; Home shows today card, weekly counts (no streaks), every study tool as a tile, how-it-works for new users; study page, revision (swipe to grade), Personal and Library restyled; notebook times open the lecture at that second.
- Backend: `card_reviews` table (migration 09da5fce7406) for "N cards reviewed this week".
- Next: study with friends (shown on Home as "Coming next"), then longer review gaps.
- Restyled again to match a reference screenshot from the user: dark near-black with faint grid, neon lime accent, Sora display headings with two-tone words, numbered 01./02. cards with one lime card, lime pill buttons with arrow, phone mockup in a glowing orbit on Welcome. App icons regenerated in lime.

## Feed and hide list, user decision (2026-10-01)

- User asked for "a feed exactly like YouTube": everything shows (podcasts, interviews) except songs, movies, entertainment shows, news channels, vlogs and personal content. No Hinglish add-on, no Indian teachers pushed up.
- User also asked to judge videos by title, description and comments. Refused: Google's policy guide (re-read 2026-10-01) says "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API." R3 stands.
- Measured (6 searches x 25 videos): podcasts are People & Blogs (Raj Shamani 23/25, Ranveer Allahbadia 22/25), same label as vlogs (Flying Beast 23/25); Dhruv Rathee is Education 22/25; lectures and topper interviews are almost all Education. YouTube's India charts have no Education chart (404); Science & Tech chart is phones.
- Chosen: hide Music, Film & Animation, movie/show genres, Entertainment, Comedy, Gaming, News & Politics, Travel & Events, Videoblogging. Show People & Blogs (podcasts); vlog channels are hidden one tap at a time ("Hide channel", with Undo). Shorts stay hidden by default, switch in Settings.
- Removed: "hindi" added to goal searches (a language the user types herself is kept), curated-channel exemption. Followed channels are still exempt (her rule).
- Home feed: followed channels' uploads (playlistItems, 1 unit, cached 6 h) + goal search + 3 topics rotating daily (24 h shared cache; extra topics only while 30+ searches are left today).

## Redesign from the UX review (2026-10-02)

- User asked for: YouTube comments and description, a split-screen rich-text notepad, star a video (visible fill), Library with Starred and History, notes with/without videos, one Search entry, and an expert reviewer agent.
- Built `.claude/agents/ux-reviewer.md` (Opus) and ran it: report in `docs/ux-review.md` with 38 screenshots. Applied nearly all of its top 10 (one Continue card + feed on Home, one Search entry, ⋮ card menu, upload dates, Watch order and pinned player, Press play first, Library = Starred + History, "My notes" with gear, inline toasts, delete message fix). Theme: kept dark as default (user's choice) but softened per the review; added Light and "same as phone".
- Not done from the review: marks and doubts merged into the notepad (one place for all notes); onboarding screenshot instead of the phone drawing; password-length wording.
- Security: httpx logged YouTube URLs with the API key at INFO, so Render logs held the key. Fixed (WARNING level, with a test). Rotating the YouTube key (step 6.7) is now more urgent.
- Render had stopped deploying for over an hour on 2026-10-01; it caught up by itself on 2026-10-02.
- Live end-to-end (guide script against the live site): 18 screens pass, no page errors; leftover test accounts from failed runs deleted.
