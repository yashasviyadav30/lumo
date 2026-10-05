# Progress

Autonomous build session started 2026-09-29. Scope: Stages 1, 2, 3 and 4A of [plan.md](plan.md), plus curated-source research (replaces step 0.9). **If a usage limit interrupts the session, continue from "Next" below.**

Rules for this session: R1–R14, the cost rule, no secrets printed or committed. Anything that needs the user is listed under "Blocked on the user" and skipped.

## v3 is built (2026-10-05)

The user did not like the v2 app. After a design interview they confirmed [plan-v3.md](plan-v3.md) and asked
for the whole plan to be built before they judge it. All four steps are built, tested and live.

- **Step 1, study page:** tabs Notes · Mind map · My notes under a pinned player. One shared Gemini job per
  video and language (`app/ai_notes.py`, `POST /api/ai-notes`): queue with backoff, a second model when one is
  busy, videos up to 4 h in 1-hour parts, 7 h/day budget, 15 new jobs per user per day, deleted after 30 days.
  Hindi tested on a real lecture. PDF (print page) and WhatsApp export; offline copy on the phone. Mind map:
  `@xyflow/react` (lazy chunk). "Copy to my notes" appends to the notepad.
- **Step 2, new look:** teal accent, neutral greys (`src/styles/v3.css`, loaded after `index.css`). YouTube-style
  top bar (search, theme switch, Settings), chips, video grid, red watched line under thumbnails (never on them,
  R7). ⋮ menu: Star, Follow, Not interested, Don't show this channel. Hidden by default: gaming, comedy,
  entertainment; every YouTube category group can be switched in Settings. Feed adds watched channels and recent
  searches (kept on the device only). Shorts tab: followed channels only. Settings: text size, notes language,
  feedback (`POST /api/feedback`). First-time guide (3 screens) and a one-time study-page hint. Cards removed.
- **Step 3, Google:** `POST /api/auth/google` (ID token checked with Google's tokeninfo; new accounts still
  confirm 18+ and the notice). `POST /api/follows/import` follows her YouTube subscriptions; the access token is
  used once and never stored. Buttons appear only when `GOOGLE_CLIENT_ID` is set.
- **Step 4, groups:** `app/routers/groups.py`. Invite links (survive sign-in), up to 50 members, a chosen name
  per group (no emails shown), posts (note, doubt at a second, shared video with notes or mind map), one-level
  threads, unread badge on the Groups tab, owner removes members and deletes posts, Report, Leave; deleting an
  account deletes its posts. "Share" on the study page.
- **Notice v2** covers notes, groups, feedback, AI notes and Google sign-in.
- **Tests:** backend 117, frontend 56. Live checks: `e2e/study-v3.mjs`, `e2e/home-v3.mjs`, `e2e/groups-v3.mjs`
  (two people), all passing on the live site with throwaway accounts that are deleted.

**Not built (optional in the plan):** phone push alerts for replies (needs VAPID keys and a push service);
the in-app badge covers it for now.

### Blocked on the user (v3)

1. **`GEMINI_API_KEY` on Render** (Environment). Without it the live app says "AI notes aren't switched on yet"
   (jobs made earlier on a laptop still show).
2. **Google OAuth client** (Google Cloud → APIs & Services → Credentials → OAuth client ID, type Web; authorised
   JavaScript origin `https://focuslearn.focuslearn.workers.dev`; enable YouTube Data API v3 on that project;
   OAuth consent screen with the `youtube.readonly` scope, test users until Google verifies it). Put the client
   ID on Render as `GOOGLE_CLIENT_ID`.
3. YouTube quota increase form; rotate the old YouTube API key; pick the real app name.

## Where things stood (2026-10-03)

- **Live:** https://focuslearn.focuslearn.workers.dev — app and API through one Cloudflare address; backend on Render, database on Supabase.
- **Built:** accounts (18+), goal parser and topics, filtered search, Home feed, study page (Mark, Doubt, split-screen notepad, −10s, description, comments with tappable times, star), revision cards with 90-second replay, Library (Starred, History), My notes (by video / all notes, search, export), Settings (theme, Shorts, hidden channels, delete my data), visual guide.
- **Tests:** backend 85 (pytest), frontend 45 (vitest), live end-to-end 18 screens (`e2e/guide.mjs`), all passing.
- **Theme:** "Paper & Ink" — indigo on warm paper, soft navy Night; follows the phone.
- **Not built yet:** study with friends (doubts to friends), marks merged into the notepad, longer review gaps (Anki-style), past-paper drill, paper tracker.
- **Open with the user:** their phone showed "Can't reach the server" (2026-10-02). Fixed twice (wake + retry, then API through the app's own address); the user has not confirmed it works on their phone yet.

## Chat timeline (one conversation; first commit 2026-09-27, research before that → 2026-10-03)

Full transcript: `C:\Users\yasha\.claude\projects\C--Users-yasha-Downloads-new-project\53879416-9635-49a6-8f57-7049d50f390a.jsonl`.

1. **Research** (no code): 9 topics → `docs/research.md`, answer rounds with the user (aspirants first, 18+, LLM with zero retention, transcripts, safety), `research-summary.md`, deep `feasibility.md` on 24 expectations. Found the compliance-guide ban on inferring a video's type (R3).
2. **Plan:** `docs/plan.md` with stages and rules R1–R14; old draft archived to `docs/archive/`.
3. **Stage 0 setup:** Supabase (Mumbai, Data API off, RLS on), GitHub private repo `focus-app`, Render backend, env vars imported by the user.
4. **Autonomous build** of Stages 1, 2, 3, 4A + curated sources (see Status below and `docs/session-report.md`).
5. **Deploy:** frontend to Cloudflare (Workers static assets), CORS; plan step 6.7 added: rotate all secrets.
6. **Ideation rounds 1 and 2** (sister's feedback "doesn't feel different from YouTube"): `docs/idea.md`, `docs/ideation/`, mockups.
7. **v2 study companion** built from idea.md (2026-10-01): marks, doubts, cards, notebook, resume.
8. **Premium redesign**, then **dark neon-lime theme** copied from a reference screenshot (crypto landing page).
9. **Feed and hide list** (user decision): YouTube-like feed; hide songs, movies, shows, news, travel vlogs by YouTube's labels; podcasts shown; no Hindi add-on, no teacher list. Judging by title/comments refused (R3).
10. **Visual guide** `docs/guide/app-guide.html` (user couldn't understand the app on first use).
11. **User's fix list + Opus reviewer agent** (2026-10-02): comments, description, notepad, star, Library, My notes; `.claude/agents/ux-reviewer.md` → `docs/ux-review.md`; most top-10 fixes applied. Found and fixed: API key in Render logs.
12. **"Can't reach the server"** on the user's phone: waking banner + retry, then API through the Worker.
13. **Push every change** to GitHub (saved as a standing rule in CLAUDE.md and memory).
14. **Paper & Ink theme** (2026-10-02/03): lime removed for a research-based study palette; sign-up made retry-safe.
15. **This file and `CLAUDE.md`** written as the reference for future sessions (2026-10-03).

## Blocked on the user (current)

- **Rotate the YouTube API key now** (and the rest of step 6.7): Render logs held it until 2026-10-02, and an old screenshot showed all secrets.
- **Confirm sign-in works on their phone** after closing and reopening the app twice; if not, open `/health` on the phone and report the network (Jio/Airtel/Wi-Fi).
- **App name** (R9). **Device checks** 1.3/1.4 (iPhone, Android). **Testers list** (0.7). Human check of `docs/curation/*.md`.
- Optional: Render → Settings → Build Filters → include `backend/**` (stops restarts on frontend/docs pushes).
- Optional: GitHub profile → Contribution settings → **Private contributions** (so the private repo shows on the graph).

---

*Everything below this line is the original log, kept in order. "Status", "Next" and "Blocked on the user" directly below are as of 2026-09-29.*

## Status (as of 2026-09-29)

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

## "Can't reach the server" on the user's phone (2026-10-02)

- Server was healthy from here (sign-in 4 s). Two causes: Render restarts on every push (three pushes 11:32–11:38) and the free plan's 15-minute sleep (30–60 s wake).
- Fix 1: the app pings `/health` on open; safe requests (reads, sign-in, sign-up, search) retry up to 75 s with a "Waking up the server" banner; writes never retry (no double saves). Only real network errors (`TypeError`) trigger retries.
- User still saw the error. Fix 2: the API now goes through the app's own address — `frontend/worker/index.js` passes `/api/*` and `/health` to Render (`run_worker_first`), so phones never contact `*.onrender.com` (reported to fail on some Indian mobile networks; not confirmed for this user). Same-origin, so no CORS. `VITE_API_BASE` is empty in production.
- Sign-up is retry-safe: if a retried sign-up finds the account already made, it signs in with the same details.
- Lazy-loaded pieces (the notepad editor) reload the page once if their file is gone after a deploy (`src/lib/lazy.ts`).

## Paper & Ink theme (2026-10-02/03)

- User: the green-on-black theme felt like a music app, not a study app; asked for expert-based colours.
- Evidence used: dark text on light reads ~26% faster with fewer errors (Piepenbrock et al., Ergonomics 2013); Material Design dark theme guidance (no pure black, desaturated colours); blue linked with calm/approach motivation (Mehta & Zhu, Science 2009 — replications mixed, so a minor point).
- Result: light "paper" `#f8f8f5` with indigo `#3550d8` as the only accent; Night = soft navy `#10141f` with periwinkle `#93a8ff`; one colour per meaning (green solved, gold star, orange doubt, red delete). Default follows the phone; Settings → Appearance: Same as phone / Light / Night. Lime removed everywhere, new indigo logo and app icons, one font family (Plus Jakarta Sans).

## GitHub activity (2026-10-02)

- Standing rule: commit and push each finished change separately (user wants an active contribution graph). Commits use the account's noreply email, so they count; the repo is private, so the user must turn on "Private contributions" in their GitHub profile.
