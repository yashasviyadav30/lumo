# Plan

The build plan for the focused YouTube learning app, from an empty repo to a public launch in India. It follows the decisions in [research-summary.md](research-summary.md). The reasons and sources behind each rule are in [feasibility.md](feasibility.md) and [research.md](research.md).

Written 2026-09-27, revised the same day (two tests, timeline, stop rule, curator mapping for the feed, NPTEL terms check). Update it as steps finish or change.

## Stop rule

**After every stage, stop and wait for your confirmation before starting the next one.** At the end of a stage: tick its steps, run the compliance checklist (step 0.8), write a short note of what was done and what changed, then wait.

## How we work (set 2026-09-27)

- Claude does as much as possible; you only do what truly needs you (logins, approvals, choices).
- Use each service's command-line tool with browser login where one exists (gcloud, Supabase CLI, wrangler), installing what's needed.
- When you must act on a website, Claude opens the exact page and says in one or two lines what to click.
- Claude generates passwords and secrets and writes them straight into `backend/.env` without showing them. You're never asked to copy or paste secrets.
- The cost rule below applies to **every** service, not only Google Cloud.

## Google Cloud rule (applies to every service)

Set 2026-09-27. In Google Cloud **and every other service**, **never turn on billing, create anything that costs money, delete any project, or change permissions without asking first and stating the expected cost.** Free actions (creating a project, enabling the YouTube API, creating an API key) are fine without asking.

## Portability rule

Set 2026-09-27. Until launch the app runs on Render (backend), Cloudflare Pages (frontend) and Supabase (database), all free. Moving to Cloud Run and Cloud SQL at launch (step 13.0) must be easy, so:
- The backend runs in **Docker**, the same image everywhere.
- **All settings come from environment variables** (keys, database URL, allowed origins). Nothing host-specific in the code.
- **Use Supabase only as plain Postgres**, through a standard connection string. No Supabase Auth, Storage, Edge Functions or client libraries.
- **No Render- or Cloudflare-only features** (no Cloudflare Workers code, no Render-only config the app depends on). The frontend is a plain static build.

## How to use this plan

- The plan has three parts: **Part A** builds the smallest app that real users can try and ends with **Test 1**. **Part B** adds the rest of the product and ends with **Test 2**. **Part C** takes it to public launch.
- Inside a stage, do the steps in order unless a step says it can run in parallel. Step numbers stay the same wherever a step moved, so references still work.
- Each step is small. **Size:** S = about a day, M = 2–4 days, L = 1–2 weeks of part-time work.
- A step is finished only when its **Done when** line is true. Tick it off here.
- The four **parallel tracks** (NPTEL, partner teachers, lawyer, funding) run alongside the stages from the start.
- If a step turns out wrong, change the plan here first, then the code.

## The goal

A free PWA for adults (18+) in India that turns any learning goal into a focused YouTube feed and search, with study tools, a deep layer of NPTEL and partner lectures you can search inside, and honest filtering.
- **Test 1:** your sister and about 5 friends try the core (goal → feed and search, with filtering, mutes and safety) for a week.
- **Test 2:** the same group tries the full product (study tools, NPTEL deep layer, accessibility) for a week.
- Then a public launch in India.

**Where the value comes from** (recorded 2026-09-29; see "How the product works" in research-summary.md). YouTube is the primary layer: it decides what a video is. The app is the secondary layer on top, and its value is the **smart agent, which judges the user, not the video**: their goal, level, growth, and which distractions they're likely to follow. It writes excellent search queries, remembers progress, suggests the next step, and decides what to bring forward and what to keep away, so the user needs almost no effort. Learning from a user's habits is behaviour learning (18+, separate consent, can be switched off, Stage 11).

## Rules every step must follow

These come from YouTube's Developer Policies and compliance guide, DPDP and your own decisions. Check each new feature against this list before calling it done.

| # | Rule | Source |
|---|---|---|
| R1 | YouTube API data (titles, descriptions, thumbnails, fields) is stored **30 days at most**, in "limited amounts", then refreshed or deleted. | Policies III.E.4 |
| R2 | A user's data is deleted **within 7 days** of their request or account deletion. | Policies III.E.4.g |
| R3 | **A video's type comes only from YouTube** (`categoryId`, `topicDetails`, `safeSearch`, age-restricted, embeddable). No judging of YouTube videos by our own model, LLM or word-matching on titles (no "learning/entertainment", no "on-topic", no "safe/unsafe" verdicts). Use only YouTube's own fields, curators' mappings and the user's own rules. | Compliance guide ("you may only use the content type returned by the YouTube API") |
| R4 | The smart agent (LLM) sees only **the user's own text**: goal, search, mute words. Never video titles. The LLM runs on a zero-retention host. | Chosen architecture |
| R5 | `safeSearch=strict` on every search. Age-restricted, non-embeddable and region-blocked videos are dropped **everywhere**, and counted in the hidden line. | research.md 17.7 |
| R6 | Hidden results show **"N hidden by [App] · Why · Show"**, and "Show" reveals them in place. | Policies III.C |
| R7 | The YouTube player is never changed, covered or blocked. Ads play. Its links open the YouTube app. No background play. | Policies III.I; guide |
| R8 | **No rewards for watching** (no coins, points, streaks, leaderboards) and no gating (nothing but "play" to watch). | Policies III.F |
| R9 | Our own data shown next to YouTube data carries a **"not from YouTube"** note. The app has its own name and look, with YouTube attribution per the branding guidelines. | Policies III.E.4.h; branding guidelines |
| R10 | Accounts are **18+**. Minor signals in a goal ("Class 11", "boards 2027") trigger an age re-check. | Decision |
| R11 | Logs never contain video IDs or titles. | Feasibility C12 |
| R12 | Search quota is 100 calls a day for the whole app. Every feature must still work, in reduced form, when it runs out. | Policies; quota page |
| R13 | Safety wording is "we try to hide harmful content", never "safe". | Decision |
| R14 | Made-for-Kids videos: no tracking of viewing for those videos. | Policies III.E.4.j |

The user's own mutes (a word or channel the user chose) are the user's rule, not the app's judgement, so they fit R3.

## Timeline

Rough estimate for **one developer working part-time (about 10–15 hours a week)**. Week 1 is the week you confirm step 0.1. The pauses from the stop rule, exams, festivals and waiting on other people are not counted, so real dates will slip. The calendar dates assume week 1 starts Monday 5 October 2026.

| Part | Stage | Weeks | Estimated weeks |
|---|---|---|---|
| A | 0. Setup | 1 | 1 |
| A | 1. Skeleton | 1–2 | 2–3 |
| A | 2. Accounts and data rules | 2 | 4–5 |
| A | 3. Light layer search | 2–3 | 6–8 |
| A | 4A. Smart agent core | 2–3 | 9–11 |
| A | 5A. Curated mapping and feed | 2 (curator work starts in week 1) | 12–13 |
| A | 6A. Channel mute, Shorts, safety | 1–2 | 14–15 |
| A | **Test 1** (prep, one-week run, verdict) | 2 | **16–17** |
| B | B0. Fixes from Test 1 | 1–2 | 18–19 |
| B | 4B. Smart agent: rest | 2 | 20–21 |
| B | 5B. Feed: rest | 1–2 | 22–23 |
| B | 6B. Topic mute | 1 | 24 |
| B | 7. Study tools | 2–3 | 25–27 |
| B | 8. Deep layer: NPTEL | 3–4 | 28–31 |
| B | 9. Accessibility v1 | 1–2 | 32–33 |
| B | **Test 2** (prep, one-week run, verdict) | 2 | **34–35** |
| C | 11. Fixes from Test 2 and behaviour layer | 3 | 36–38 |
| C | 12. Partner deep layer | depends on partners (runs alongside) | — |
| C | 13. Launch readiness | 3–6, mostly waiting (starts alongside 11) | 36–41 |
| C | 14. Public launch in India | 1 | 42 |

**Estimates:**
- **Test 1 runs around week 17** (fast case week 12, slow case week 19). With a 5 Oct 2026 start: **around late January 2027**.
- **Test 2 runs around week 35** (fast case week 29, slow case week 40). **Around late May to early June 2027.**
- **Public launch around week 42** (range 36–50). **Around mid-July 2027**, depending mostly on the YouTube audit and the company registration.

---

# Part A: to Test 1

## Stage 0. Setup

**0.1 Choose the stack.** (S) ✅ Done 2026-09-27
- Recommended, based on the research: **Python + FastAPI** backend (the existing prototype and all ML tools are Python); a **TypeScript PWA** frontend (React + Vite, or SvelteKit if you prefer); **Postgres**; hosting on **Cloud Run in Mumbai (asia-south1)** or one small VM (updated 2026-09-27: free no-card hosting until step 13.0; Cloud Run decided there); LLM on **Groq or Fireworks** with zero data retention, using a GPT-OSS or Qwen model.
- Done when: the choices are written in a short "Stack" section at the top of the repo README.

**0.2 Set up the repo.** (S) ✅ Done 2026-09-27
- One repo, folders for `backend/`, `frontend/`, `docs/`, `tools/`. Git, a `.gitignore` that keeps `.env` out, a basic README.
- Done when: the repo builds an empty backend and frontend locally.

**0.3 Fix or drop `fetch_videos.py`.** (S) ✅ Done 2026-09-27: dropped; kept in git history (commit 19d4385)
- It keeps YouTube data with no deletion limit and its `--check-shorts` uses an undocumented URL. Either delete it, or move it to `tools/` with the Shorts check removed and an automatic delete of its output after 30 days.
- Done when: nothing in the repo stores YouTube data without a date and a purge.

**0.4 Google Cloud project and YouTube API key.** (S) ✅ Done 2026-09-27: project `focus-learn-8936` (billing off), YouTube Data API v3 on, key `backend-youtube` limited to that API, check passed
- Create the project, enable YouTube Data API v3, create a key restricted to your backend (never in the frontend).
- Done when: one `search.list` and one `videos.list` call succeed from the backend, and the quota page shows them.

**0.5 LLM account with zero retention.** (S) ✅ Done 2026-09-27: Groq, Global ZDR on (docs/groq-zdr.png); openai/gpt-oss-20b answered in 0.56 s
- Groq (turn on Zero Data Retention in Data Controls) or Fireworks (zero retention by default). Pick one GPT-OSS or Qwen model to start; the full comparison comes after Test 1 (step 4.3).
- Done when: a test call works and a screenshot of the ZDR setting is saved in `docs/`.

**0.6 Hosting and database.** (S) ✅ Done 2026-09-29: Supabase `focus-app` (Mumbai, Data API off, automatic RLS on) connected in 0.24 s through the session pooler; backend live on Render as service `focus-app` at https://focus-app-6fb9.onrender.com (`/health` → 200 over HTTPS; HTTP redirects to HTTPS). Code in the private GitHub repo `yashasviyadav30/focus-app`. Cloudflare Pages is set up with the first frontend deploy in step 1.5.
- Updated 2026-09-27: **no billing and no card for now.** Chosen: **Supabase Free in Mumbai** (Postgres only; pauses after a week idle), **Render Free in Singapore** for the backend (sleeps after 15 min idle, about 1 min to wake; no keep-awake ping), **Cloudflare Pages** for the frontend. Cloud Run moves to step 13.0. Follow the portability rule.
- Done when: a "hello" endpoint is live on a public URL with HTTPS.

**0.7 Confirm the testers.** (S)
- List your sister and the ~5 friends, their field (CS, CMA, NEET, AI) and confirm each is **18 or over** (R10). If anyone is under 18, they can't be in either test.
- Done when: a tester list with fields and "18+ confirmed" exists (keep it outside the repo).

**0.8 Turn the rules into a checklist.** (S) ✅ Done 2026-09-29: `docs/compliance-checklist.md`, Stage 0 checked
- Copy R1–R14 into `docs/compliance-checklist.md` as a checklist used at the end of every stage.
- Done when: the file exists and Stage 0 is ticked against it.

**0.9 Start the curator work (runs in parallel).** (S to start) ✅ Replaced 2026-09-29: draft curator sheets for all four fields researched from public web sources (`docs/curation/*.md`, `backend/app/data/fields/*.json`), each marked "draft, needs a quick human check".
- Find one person who knows each test field and book their time for step 5.1. Curation takes calendar time, so start now.
- Done when: a curator is lined up for each of the four fields.

⏸ **Stop and wait for confirmation.**

## Stage 1. Skeleton

**1.1 App shell.** (M) ✅ 2026-09-29
- Own name, logo, colours (R9). Home, Search, Library, Settings tabs. Installable PWA (manifest, service worker), works offline for the shell only.
- Done when: the app installs on an Android phone and a laptop.

**1.2 Watch page with the embedded player.** (M) ✅ 2026-09-29 (desktop Edge checked end to end; phones still to check)
- YouTube IFrame player, standard controls, autoplay off. Nothing covers or changes the player (R7).
- Done when: a video plays on Android Chrome, desktop Chrome and iPhone Safari.

**1.3 Check the iPhone "Error 153" issue.** (S) 🟡 Fix built in (page-wide referrer meta + origin); needs a real iPhone
- Test playback from the installed PWA on an iPhone. If it fails, note it; the fix is a Referer/origin setup, and native iOS comes later with Capacitor.
- Done when: iPhone playback works, or the problem is written down with a workaround.

**1.4 Check player links.** (S) 🟡 Needs Android and iPhone devices
- Tap the YouTube logo and end-screen videos on each platform and note where they go. They must open YouTube (R7); record it, don't fight it.
- Done when: behaviour per platform is written in `docs/`.

**1.5 First deploy.** (S) ⛔ Waiting on the Cloudflare login (`npx wrangler login`)
- Done when: the skeleton is live on the public URL and installs from there.

⏸ **Stop and wait for confirmation.**

## Stage 2. Accounts and data rules

Required before any real user, so it's all in Part A.

**2.1 Sign-in.** (M) ✅ 2026-09-29 (email + password; Google sign-in later)
- Email or Google sign-in (for identity only; no YouTube account access is needed).
- Done when: a user can sign up, sign in and sign out.

**2.2 18+ gate.** (S) ✅ 2026-09-29
- Date of birth at sign-up; under 18 gets a polite "not yet" screen (R10).
- Done when: an under-18 date is refused and nothing about that person is stored.

**2.3 Data model with two kinds of data.** (M) ✅ 2026-09-29
- **Our data** (user, goals, mutes, settings, curator mappings, signals) is kept as long as the account lives. **YouTube data** (titles, descriptions, fields) sits in separate tables with a `fetched_at` date. Anything that points at a video stores **the video ID only**; titles are re-fetched when shown.
- Done when: the schema is written and reviewed against R1 and R11.

**2.4 30-day purge job.** (S) ✅ 2026-09-29
- A daily job deletes YouTube data older than 30 days (R1).
- Done when: a test row dated 31 days ago is gone after the job runs.

**2.5 "Delete my data".** (M) ✅ 2026-09-29 (deletes at once)
- A button in Settings deletes the account and all its data within 7 days (do it at once where possible). The message says this doesn't delete anything on YouTube (R2).
- Done when: a test account is fully gone and the flow is tested.

**2.6 Logging without API data.** (S) ✅ 2026-09-29
- Logs hold a pseudonymous user ID, time, action and IP, never video IDs or titles (R11). Keep logs 1 year, in India.
- Done when: a sample of logs from a test session shows no IDs or titles.

**2.7 Consent and notices placeholder.** (S) ✅ 2026-09-29
- A plain first-run screen saying what the app stores and why, and a draft privacy page. The lawyer's version replaces it in Stage 13.
- Done when: a new user sees and accepts it before the first goal.

⏸ **Stop and wait for confirmation.**

## Stage 3. Light layer search

**3.1 Search call.** (M) ✅ 2026-09-29
- `search.list` with `type=video`, `safeSearch=strict`, `relevanceLanguage` from the user's setting (R5). One call per search.
- Done when: a search returns results on screen.

**3.2 Fetch the fields.** (S) ✅ 2026-09-29 (also `player` for the Shorts shape)
- One `videos.list` call for the result IDs: `snippet.categoryId`, duration, `contentRating.ytRating`, `status.embeddable`, `status.madeForKids`, `regionRestriction`, `topicDetails`, `contentDetails.caption`.
- Done when: the fields are stored with `fetched_at` and used by the next step.

**3.3 Drop rules.** (S) ✅ 2026-09-29
- Drop age-restricted, non-embeddable and region-blocked (for India) videos everywhere (R5). Count them.
- Done when: a known age-restricted video never shows, and it's counted.

**3.3b Hide by YouTube's own type.** (S) (added 2026-09-29) ✅ 2026-09-29
- Hide videos that **YouTube itself** types as entertainment: by `categoryId` (e.g. Music, Gaming, Comedy, Entertainment; confirm the IDs with `videoCategories.list` for India) and by `topicDetails.topicCategories` (e.g. Music, Gaming, Humor, Film, TV shows). The app adds no judgement of its own (R3).
- Uploaders choose their own category, so it's sometimes wrong. Videos from curated channels (5.1) are never hidden by this rule, and "Why" says "YouTube lists this as Music", with "Show" one tap away.
- Done when: a known music video is hidden and counted, and a curated lecture filed under "Entertainment" still shows.

**3.4 The hidden line.** (M) ✅ 2026-09-29
- "N hidden by [App] · Why · Show". "Why" lists the reasons in plain words (e.g. "age-restricted by YouTube", "your mute: this channel"). "Show" reveals them in place (R6), except videos that can't play in an embed, which are listed with the reason.
- Done when: the line appears, and Why and Show both work.

**3.5 Shared search cache.** (M) ✅ 2026-09-29 (24 h cache; ETags skipped, see progress.md)
- Cache results by normalised query + language for hours to a few days, never past 30 days (R1). Refresh with ETags.
- Done when: the same search twice uses one quota call.

**3.6 Quota guard.** (S) ✅ 2026-09-29
- Count search calls per day. Near the limit, serve cache and curated feeds only, with a short note (R12).
- Done when: with the counter forced to 100, the app still works and says so.

**3.7 Measure speed.** (S) ✅ 2026-09-29 (cold ≈1.3 s p50, cached ≈60 ms)
- Log time for each step (search, fields, filtering). Target 1–2 s end to end.
- Done when: p50 and p95 for 20 test searches are written down.

⏸ **Stop and wait for confirmation.**

## Stage 4A. Smart agent core

**4.1 Goal schema.** (S) ✅ 2026-09-29 (`docs/goal-schema.md`)
- Fields: field (e.g. Company Secretary), exam body, level, paper or subject, topic, language preference, minor signals.
- Done when: the schema and 10 example goals mapped by hand are in `docs/`.

**4.2 Goal test set.** (S) ✅ 2026-09-29 (66 goals)
- 50–100 goals typed the way your testers would type them, in English, Hindi and Hinglish, with the correct answer for each. Include ambiguous ones ("CS", "AI").
- Done when: the set is saved (it's our data, no YouTube text).

**4.4 Goal parser.** (M) ✅ 2026-09-29 (hybrid: 98% on the test set)
- The starting model from 0.5 turns the typed goal into the schema. Only the user's text goes to the LLM (R4).
- Done when: it gets most of the test set right, with the misses written down for 4.3 after Test 1.

**4.5 "Did you mean" tap.** (S) ✅ 2026-09-29
- Only when the parser is truly unsure: one tap, two or three choices, never a form.
- Done when: "CS" asks, "CS ESG paper" doesn't.

**4.7a Minimal topic maps.** (M) ✅ 2026-09-29 (from the official syllabi; in `backend/app/data/fields/`)
- For each test field, just the top level: papers or subjects and their main units, from the official syllabus (ICSI, ICMAI, NTA/NMC) or, for AI, a short outline. Our own words.
- Done when: each field has a short topic list in the database that curators can map to in 5.1.

**4.8 Query builder.** (M) ✅ 2026-09-29 (20 test goals on topic by eye)
- Turn a goal + topic into one good YouTube search (English, Hindi or Hinglish as the user prefers). Works on the user's text only.
- Done when: for 20 test goals the first page of results is on topic by eye.

⏸ **Stop and wait for confirmation.**

## Stage 5A. Curated mapping and feed

**5.1 Curator sheet: channels and playlists mapped to topics.** (M)
- With the curator for each field (0.9): 10–30 channels per field, plus their useful playlists. For each one, the curator records the **channel or playlist ID, the topics from 4.7a it covers**, and their own notes. IDs are copied from youtube.com by hand. The mapping is our data (the curator's judgement), not YouTube data.
- Done when: all four fields have channels and playlists mapped to their topics.

**5.2 Feed from the curators' mapping.** (M)
- The feed picks the playlists and channels the curators mapped to the user's goal topics, and pulls their items with `playlistItems.list` / `playlists.list` (1 unit each). Order comes from the playlist's own order, then upload date. **The app never reads titles to decide what fits** (R3).
- Done when: a new user with a goal sees a feed built only from the mapping, without using search quota.

**5.6 Follow your own teachers.** (S) (added 2026-09-29)
- Everyone prefers different teachers. The user can follow any channel with one tap ("Follow teacher" on a video, or paste a channel link). Followed channels always feed their Home feed and are never hidden by YouTube's category. It's the user's own rule (R3), stored as channel IDs (our data).
- Backend and the search-screen button are built (2026-09-29); the feed uses them in 5.2.
- Done when: a followed teacher's new videos appear in the user's feed.

⏸ **Stop and wait for confirmation.**

## Stage 6A. Channel mute, Shorts and safety

**6.1 Channel mute.** (S)
- One tap on any video or channel. Stored as channel ID. Applied everywhere, every time, and shown in the hidden line.
- Done when: a muted channel never appears in feed, search or related.

**6.3 Shorts setting.** (S)
- Shorts off by default for every user, as a user rule based on YouTube's duration field. The user can turn Shorts on and set a daily limit.
- Done when: the setting works and the hidden line shows its effect.

**6.4 Self-harm support panel.** (S)
- Searches with self-harm terms show a support panel with Indian helplines (confirm current numbers, e.g. Tele-MANAS) instead of results. The check runs on the user's search text only.
- Done when: test searches in English, Hindi and Hinglish show the panel.

**6.5 Scam warning.** (S)
- Searches like "paper leak", "leaked paper", "guaranteed questions" show a warning with one tap to continue.
- Done when: the warning shows, and "continue" runs the search.

**6.6 Safety wording.** (S)
- The first-run screen and About page say "we try to hide harmful content" (R13).
- Done when: no screen uses the word "safe" about videos.

⏸ **Stop and wait for confirmation.**

## Test 1. Core test

What Test 1 answers: does goal → feed and filtered search help more than plain YouTube? Is goal parsing right? How much is hidden, and do testers tap "Show"? Is it fast enough? Does search quota hold for ~6 users?

**T1.1 Decide what "success" means.** (S)
- Write it down before the test. Suggested: most testers say the feed and search are more useful than YouTube for studying; goal parsing is right for most of them without help; few "Show" taps (little over-blocking); searches feel fast; they open it on at least 4 of 7 days.
- Done when: the success list is in `docs/test-1.md`.

**T1.2 Simple dashboard from our data.** (S)
- Counts per day: sessions, searches used, quota left, "Show" taps, mutes, "Did you mean" taps, safety panels shown. No YouTube titles or video IDs.
- Done when: the dashboard shows test data.

**T1.3 Onboard testers.** (S)
- Install the PWA with each tester (all 18+, from 0.7); they type their own goal.
- Done when: all testers are in and have a feed.

**T1.4 Run the week.** (L)
- Daily: check the quota, fix crashes only, don't add features.
- Done when: 7 days are complete.

**T1.5 Debrief.** (S)
- Short talk with each tester: what helped, what annoyed, what they missed, when they went back to YouTube. Write their words.
- Done when: notes are in `docs/test-1.md`.

**T1.6 Verdict.** (S)
- Compare with T1.1. Decide: go on, change direction, or stop. List the top fixes and update Part B.
- Done when: the verdict and fix list are written and this plan is updated.

⏸ **Stop and wait for confirmation.**

---

# Part B: from Test 1 to Test 2

## Stage B0. Fixes from Test 1

**B0.1 Fix the top issues from Test 1.** (M–L)
- Done when: the fix list from T1.6 is done.

⏸ **Stop and wait for confirmation.**

## Stage 4B. Smart agent: rest

**4.3 Compare models.** (M)
- Run the goal test set (4.2, plus real goals typed in Test 1) on 2–3 open models (GPT-OSS, Qwen) and one closed model as a benchmark, using the approved small budget. Score accuracy, Hinglish accuracy and speed.
- Done when: a short results table picks the model, and the parser uses it.

**4.6 Minor-signal re-check.** (S)
- Goals like "Class 11" or "boards 2027" trigger an age re-check (R10). (Test 1 testers are all confirmed 18+ in 0.7, so this can wait until now, but it must exist before any new user.)
- Done when: those test goals show the re-check.

**4.7b Full topic maps.** (L)
- Extend 4.7a to full topic trees for the four fields, checked by the curators. Curators extend their channel and playlist mapping (5.1) to the new topics.
- Done when: each field has a full topic tree, and the mapping covers it.

⏸ **Stop and wait for confirmation.**

## Stage 5B. Feed: rest

**5.3 "What next" from the teacher's series.** (M)
- If the current video is in a mapped playlist, the next items in that playlist come first.
- Done when: a lecture from a playlist shows the next lecture.

**5.4 Related section.** (S)
- A separate, labelled "More on this topic" section, built from the curators' mapping for the same topic, never mixed into search results.
- Done when: it appears under the player, clearly separate.

**5.5 Motivational placement and cap.** (S)
- Motivational videos from channels or playlists the curator mapped as motivational appear at session start or after a study block, never locked. The user sets any cap.
- Done when: placement and the cap work; nothing is ever gated (R8).

⏸ **Stop and wait for confirmation.**

## Stage 6B. Topic mute

**6.2 Topic mute.** (M)
- One tap offers 2–4 phrases from what the user is looking at; the user picks one or types their own. The app adds spellings and Hindi/Roman forms (IndicXlit) and shows them. Matched as plain words. It's the user's rule, not the app's judgement.
- Done when: "Bigg Boss" hides both "bigg boss" and "बिग बॉस" titles.

⏸ **Stop and wait for confirmation.**

## Stage 7. Study tools

**7.1 Notes with timestamps.** (M)
- Notes linked to a video ID and a time; tap a note to jump there.
- Done when: notes save, show and jump.

**7.2 Bookmarks and "mark as studied".** (S)
- Done when: both work, and the Library lists them with fresh titles (re-fetched, R1).

**7.3 Done for today.** (S)
- A screen that ends the session, with one optional "Was today's time useful?".
- Done when: the answer is stored as our data.

**7.4 Rare "Did this help?".** (S)
- At most once in a while, after a video ends, never mid-video.
- Done when: it appears at the set rate, and never blocks anything.

**7.5 Chapters.** (S)
- Parse timestamps from the description into a chapter list; tap to jump.
- Done when: a lecture with chapters shows them.

**7.6 Comments, collapsed.** (S)
- Read-only YouTube comments, collapsed by default, never stored.
- Done when: they open on tap and nothing is saved.

**7.8 Live chat for live streams.** (S) (added 2026-09-29)
- For live or premiere videos, show YouTube's own live chat next to the player, as on YouTube. ❓ First check that YouTube supports embedding live chat for this use and on which platforms; if it doesn't, link to it instead.
- Done when: a live stream shows its chat, or the limit is written down.

**7.7 Check against R8.** (S)
- Done when: nothing in the study tools gives points, coins or streaks for watching.

⏸ **Stop and wait for confirmation.**

## Stage 8. Deep layer: NPTEL

Needs track P1 (NPTEL email) sent. The app is free, so NPTEL's NonCommercial licence works for now.

**8.1 Pick the courses.** (S)
- Choose NPTEL courses that fit your testers (AI first; any CS/CMA-related law or management courses).
- Done when: a list of 5–10 courses with their YouTube playlist links.

**8.2 Check NPTEL's terms, then import transcripts.** (M)
- **First, read NPTEL's website terms of use** and check whether they allow downloading transcripts in bulk, by hand or by script. Record what they say in `docs/`. If they're unclear or say no, wait for NPTEL's answer to the P1 email before importing.
- Then take transcripts from NPTEL's own site (not the YouTube API), with the course and lecture they belong to. Record the licence: CC BY-NC-SA, credit NPTEL.
- Done when: the terms check is written down, and transcripts for the chosen courses are in the database with source and licence.

**8.3 Match lectures to YouTube videos.** (M)
- Link each transcript to its NPTEL YouTube video ID (by hand or from NPTEL's playlist order).
- Done when: every imported lecture has its video ID.

**8.4 Search inside a lecture.** (M)
- Search the transcript text; results jump to the right time in the player.
- Done when: searching a term finds the moment it's said and jumps there.

**8.5 Jump to topic.** (M)
- Split each transcript into topic sections with times.
- Done when: a lecture shows a topic list that jumps correctly.

**8.6 Syllabus mapping.** (M)
- Link lecture sections to the topic maps from 4.7b.
- Done when: choosing a topic lists the NPTEL sections that teach it.

**8.7 Show deep results first.** (S)
- When an NPTEL lecture matches, it's shown first with a small "Search inside this lecture" badge, a "not from YouTube" note on our data, and NPTEL credit (R9).
- Done when: a matching search shows the NPTEL result first, correctly labelled.

⏸ **Stop and wait for confirmation.**

## Stage 9. Accessibility v1

**9.1 Captions on by default.** (S)
- Player setting to show captions where they exist; the user can turn it off.
- Done when: captions show at the start of a captioned video.

**9.2 "Captions available" filter.** (S)
- Uses YouTube's caption field. Note: it may include auto-captions; say "captions available", not "accurate captions".
- Done when: the filter hides videos without captions and shows in the hidden line.

**9.3 Screen reader.** (M)
- Labels on every control, logical focus order, headings. Test with TalkBack and VoiceOver.
- Done when: the main flows (goal, search, watch, note) work with a screen reader.

**9.4 Large tap targets and keyboard.** (S)
- At least 44–48 px targets; everything reachable by keyboard on desktop.
- Done when: a quick WCAG 2.1 AA check of the main screens passes.

⏸ **Stop and wait for confirmation.**

## Test 2. Full product test

What Test 2 answers: do the study tools and the NPTEL deep layer make the app worth using every day? Did the Test 1 fixes work?

**T2.1 Decide what "success" means.** (S)
- Suggested: most testers say the app is more useful than YouTube for studying; "Was today's time useful?" mostly yes; notes or "studied" used by most testers; the deep layer used at least once by testers whose field has NPTEL courses; they use it on at least 5 of 7 days.
- Done when: the success list is in `docs/test-2.md`.

**T2.2 Extend the dashboard.** (S)
- Add: notes, bookmarks, "studied", "useful?" answers, "Did this help?", "I need this", deep-layer searches. Still no YouTube titles or video IDs.
- Done when: the dashboard shows the new counts.

**T2.3 Onboard testers.** (S)
- Same group where possible (all 18+). Update their installs.
- Done when: all testers are on the new version.

**T2.4 Run the week.** (L)
- Daily: check the quota, fix crashes only, don't add features.
- Done when: 7 days are complete.

**T2.5 Debrief.** (S)
- Same questions as T1.5, plus: which study tools they used and why.
- Done when: notes are in `docs/test-2.md`.

**T2.6 Verdict.** (S)
- Compare with T2.1. Decide: launch path, change direction, or stop. List the top fixes.
- Done when: the verdict and fix list are written and this plan is updated.

⏸ **Stop and wait for confirmation.**

---

# Part C: to public launch

## Stage 11. Fixes from Test 2 and behaviour layer

**11.1 Fix the top issues from Test 2.** (M–L)
- Done when: the fix list from T2.6 is done.

**11.2 Separate consent for behaviour learning.** (S)
- A clear switch for adults: "Use my activity to reorder my feed". Off is always available.
- Done when: the switch works and is stored as a separate consent.

**11.3 Reordering within allowed content.** (M)
- Start with simple rules from our own signals (studied, notes, finished, "I need this", "useful?"), then a simple bandit to try new sources now and then. It only reorders what the light and deep layers already allow.
- It also learns which channels or topics pull this user off-goal, keeps them lower, and offers a one-tap mute with the reason shown. Nothing is hidden silently; it all appears in the hidden line and can be undone.
- Done when: turning it on changes the order, turning it off restores the plain order.

⏸ **Stop and wait for confirmation.**

## Stage 12. Partner deep layer

Needs tracks P2 (partners) and P3 (lawyer's licence template). Runs alongside other stages whenever a partner is ready.

**12.1 Sign the first partners.** (L, mostly waiting)
- Done when: at least one teacher in CS, CMA or NEET has signed the licence.

**12.2 Import partner caption files and topic labels.** (M)
- Received directly from the teacher (not through the YouTube API), with their own topic labels.
- Done when: a partner's lectures are searchable inside and mapped to topics.

**12.3 Partner badge and credit.** (S)
- Same presentation as NPTEL, crediting the teacher.
- Done when: partner results show first when they match, correctly labelled.

⏸ **Stop and wait for confirmation.**

## Stage 13. Launch readiness

Can start alongside Stage 11 because most of it is waiting on others.

**13.0 Billing decision and move to Cloud Run.** (M)
- Decide whether to turn on Google Cloud billing (Google Cloud rule: ask first, with the expected cost). If yes, move the backend to **Cloud Run in Mumbai (asia-south1)** with a budget alert, and decide whether the database moves to Cloud SQL.
- Done when: the decision is recorded, and if billing is on, the backend runs on Cloud Run.

**13.1 Privacy policy, terms and DPDP notices.** (M, needs the lawyer)
- Must cover YouTube's required links (YouTube Terms, Google Privacy Policy, Google's security settings page) and 7-day deletion.
- Done when: the lawyer's versions are live in the app.

**13.2 Register the company.** (M, mostly waiting)
- Done when: the company exists and owns the Google Cloud project, domain and store accounts.

**13.3 YouTube compliance audit and quota extension.** (M, then weeks of waiting)
- Describe the app honestly (education app for adults, not analytics). Say plainly that a video's type comes only from YouTube's own fields and that the app never tags videos itself.
- Done when: the audit is submitted; the answer is recorded in `research-summary.md`.

**13.4 Incident plan.** (S)
- Who does what if data leaks: tell users without delay, the Data Protection Board with a 72-hour report, and CERT-In within 6 hours.
- Done when: a one-page plan is in `docs/`.

**13.5 Accessibility statement.** (S)
- What works, what doesn't (e.g. the YouTube player's own limits), and how to report a problem.
- Done when: the page is live.

**13.6 Final compliance pass.** (S)
- Walk through `docs/compliance-checklist.md` screen by screen.
- Done when: every rule is ticked or has a written reason.

⏸ **Stop and wait for confirmation.**

## Stage 14. Public launch in India

**14.1 Launch the PWA.** (S)
- Done when: the public URL is announced and installs work.

**14.2 Optional Play Store listing.** (M)
- A Trusted Web Activity wrapper of the PWA.
- Done when: the listing is live, or the decision to skip it is written down.

**14.3 Watch quota, cost and errors.** (S, then ongoing)
- Daily check for the first two weeks.
- Done when: two weeks pass with no quota outage, or the audit's extra quota is in place.

⏸ **Stop and wait for confirmation.**

---

## Parallel tracks (start now, run alongside the stages)

**P1. NPTEL.** Email NPTEL (IIT Madras). Say what the app is and that it's free. Ask:
1. May we download and use lecture transcripts from the NPTEL website in the app (search inside lectures, jump to topic, syllabus mapping), and do the website's terms allow downloading them in bulk?
2. Could a paid version later use them, and on what terms?
Needed before Stage 8; required before any paid tier.

**P2. Partner teachers.** Find 5–10 teachers per test field (CS, CMA, NEET repeaters, AI) who might share caption files and topic labels. Aim for at least one or two willing per field by Stage 12.

**P3. Lawyer.** One list of questions, asked once:
1. Partner licence template (caption files, topic labels, credit, ending the deal).
2. Privacy policy, terms, DPDP notices.
3. What "due diligence" an 18+ gate needs.
4. Consent wording for the behaviour layer (separate purpose?).
5. Log retention (DPDP Rule 8(3), CERT-In) vs YouTube's 7-day deletion.
6. The LLM host as a data processor for users' goals.
7. Whether the draft RPwD Rules 2026 would bind the app.
8. Pirated re-uploads of paid courses appearing in feeds.

**P4. Funding and credits.** Apply for cloud credits early; grants usually need the company (13.2).

---

## Later (after launch, not planned in detail yet)

| Item | Trigger |
|---|---|
| Native iPhone app with Capacitor | If the PWA's iPhone experience holds users back |
| Parent-first family account for under-18s | Before accepting any under-18 users; DPDP children's duties start 13 May 2027. Decide verification then |
| Indian Sign Language content, audio-focused mode | After v1 accessibility is proven |
| Paid tier for own study tools | Needs NPTEL's permission first (P1) |
| International | After India works; each country's rules for minors are separate work |

## Not in this plan

- Anything that judges YouTube videos with our own model, an LLM or title matching (R3). A video's type comes from YouTube.
- Blocking or covering any part of the YouTube player, its ads or its links (R7).
- Rewards for watching (R8).
- Under-18 accounts before the family account exists (R10).
