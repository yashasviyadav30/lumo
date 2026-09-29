# Session report: autonomous build, 2026-09-29

Scope was Stages 1, 2, 3 and 4A of [plan.md](plan.md), plus curated-source research in place of booking curators. Details, measurements and every decision are in [progress.md](progress.md); the rule-by-rule check is in [compliance-checklist.md](compliance-checklist.md).

## What was built

**Stage 1: the app shell.** An installable web app (PWA) with its own working name and logo ("FocusLearn"), four tabs, dark mode and 48 px tap targets. The watch page uses YouTube's official player in its privacy-enhanced mode, with standard controls and no autoplay. The iPhone "Error 153" fix is built in.

**Stage 2: accounts and data rules.**
- Email and password sign-up. The date of birth is used once for the 18+ check and never stored; under-18s see a polite "not yet" page and nothing about them is kept, not even in the log.
- A first-run notice (what we store and why, with YouTube's Terms and Google's Privacy Policy linked) and a draft privacy page.
- "Delete my data" in Settings deletes everything at once.
- YouTube data is deleted after 30 days; the request log is kept 1 year in India and never holds searches, goals or video IDs.

**Stage 3: search.**
- Search always uses `safeSearch=strict`. Age-restricted, non-embeddable and blocked-in-India videos are dropped; videos YouTube itself types as entertainment are hidden (curated and followed teachers are exempt); user mutes and the Shorts setting apply.
- Under the results: **"N hidden by FocusLearn · Why · Show"**. Why lists the reasons; Show reveals them in place.
- A 24-hour shared cache and a quota guard: when the day's 100 searches run out, saved results or a clear note appear, and nothing breaks.
- One-tap **Mute channel** and **Follow teacher** on every result.

**Stage 4A: the smart agent core.**
- Type any goal. The app shows one line of what it understood ("CMA · CMA Intermediate · Paper 8: Cost Accounting") with Change, and topic chips that each run a ready search.
- "CS" alone asks one tap: Company Secretary or Computer Science. "CS ESG paper" asks nothing.
- Hindi, Hinglish and Devanagari goals work ("सीएमए इंटर कॉस्टिंग", "cma inter ka costing chapter samjhna hai").
- Goals outside our four fields work too ("UPSC polity laxmikanth", "guitar chords").

**Curated sources (draft).** Topic maps from the official syllabi and 81 recommended teachers and playlists across CS, CMA, NEET and AI, researched from public web sources (never scored with YouTube data). Each is marked "draft, needs a quick human check": `docs/curation/*.md`.

## What works, with evidence

| Check | Result |
|---|---|
| Backend tests | 52 pass |
| Frontend tests | 27 pass |
| End-to-end in real Edge, phone-sized | Sign-up → goal → search → hidden line → player → delete account: all pass, no page errors (`npm run e2e`) |
| Account flow against the real Supabase database | Works; under-18 attempt leaves no trace; logs hold route names only |
| Search speed (20 real searches) | Cold ≈ 1.3 s (p50), cached ≈ 60 ms. Target 1–2 s: met |
| Goal understanding (66-goal test set) | 98% fully right with the hybrid parser; 96% with rules alone |
| Search quality (20 test goals, first page by eye) | 20 of 20 on topic |
| Secrets | None in any commit; `.env` never committed |

## How it compares with competitors

- **YouTube search** hides nothing and never says what it leaves out. We hide entertainment, Shorts and unplayable videos, and **always** say what we hid and why, with one tap to show it.
- **Unhook** and **DF Tube** hide parts of youtube.com silently and can't tell a lecture from a song. We filter by YouTube's own type and tell the user.
- **StudyTube** advertises an ad-free player, which breaks YouTube's rules. Ours leaves the player, ads and links exactly as YouTube made them.
- **SyncStudy** turns playlists into courses but needs the user to pick them. We start from any goal typed in plain Hindi, English or Hinglish and build the searches ourselves.

## Blocked on you

1. **Cloudflare login (step 1.5).** Run `npx wrangler login` in the project folder and approve in the browser. Then I can deploy the frontend and phones can use the app.
2. **Render settings.** The live backend needs `DATABASE_URL`, `SECRET_KEY`, `YOUTUBE_API_KEY`, `GROQ_API_KEY` and `CORS_ORIGINS` (the frontend's address). Easiest without you copying secrets: create a Render API key (Render dashboard → Account settings → API keys) and run `python tools/set_env_value.py RENDER_API_KEY`; I'll set the rest from `backend/.env` without showing them.
3. **Phone checks (steps 1.3, 1.4)** once the frontend is live: does a video play in the installed app on an iPhone, and where does tapping the YouTube logo go on Android and iPhone?
4. **Testers (step 0.7).** Your sister and friends, their fields, and "18+ confirmed" for each.
5. **The app's real name.** "FocusLearn" is a placeholder in `frontend/src/config.ts`.
6. **A quick human check of the curator sheets.** Most important first:
   - CMA: three teachers mix CA and CMA videos (Vijay Sarda, Amit Mahajan, Purushottam Aggarwal); their CMA playlist IDs would keep CA videos out of the feed.
   - CS: confirm the ICSI, Unacademy CS and Inspire Academy channel IDs (looked up from old links).
   - NEET: are "Competition Wallah" and "Aakash NEET" the official free channels meant?
   - AI: two NPTEL playlists share a title; pick the full course.

## What I'd improve next

- **LLM prompt size.** The LLM gets our whole ~5,500-token catalogue, and Groq's free tier refuses that often (HTTP 429). The hybrid parser falls back to rules, so users don't see errors, but a smaller prompt (papers only, ~1,500 tokens) would let the LLM help more often.
- **Hindi words.** Devanagari works for a small list of exam words. A transliteration model (IndicXlit, planned in 6.2) would cover the rest.
- **Many Shorts in a search.** When Shorts are off, some searches show fewer results (one NEET search hid 11 of 25, mostly vertical Shorts). Fetching a second page when many are hidden would help, at one extra search call.
- **Watch page.** Show the title and channel, chapters (7.5) and a clear way back to results.
- **Sign-in extras.** Password reset needs an email service; Google sign-in needs an OAuth client. Both need your account.
- **Minor-signal re-check (4.6).** Goals that mention school show a note now; the actual age re-check comes in Stage 4B.

## Exactly what to test

Run it on your laptop (the phone version needs item 1 above):

1. Terminal 1: `cd backend` then `uv run uvicorn app.main:app --port 8000`
2. Terminal 2: `cd frontend` then `npm run dev`, and open http://localhost:5173
3. Or run everything automatically: with both running, `cd frontend` then `npm run e2e` (uses at most one search).

Then try these by hand:

| Try | You should see |
|---|---|
| Sign up with a birth date under 18 | "Not yet, sorry", and nothing saved |
| Sign up as an adult | The goal screen |
| Goal: `CS` | "Did you mean" with two choices |
| Goal: `CS ESG paper` | No question; the ESG paper and its units as chips |
| Goal: `cma inter ka costing chapter samjhna hai` | CMA Intermediate · Paper 8; searches include "hindi" |
| Goal: `neet electrostatics one shot` | A search for "electrostatics neet one shot" |
| Goal: `UPSC polity laxmikanth` | Accepted as-is (outside our four fields) |
| Tap a topic chip | Results; below them "N hidden by FocusLearn · Why · Show" |
| Tap **Why**, then **Show** | Reasons in plain words; hidden videos appear, marked |
| **Mute channel** on a result | "Channel muted", and that channel is gone from the results |
| Open a video | YouTube's own player; nothing starts until you press play |
| Settings → **Delete my data** → confirm | Back to the welcome page; signing in again fails |

Search calls: about 57 of today's 100 were left at the end of the session. They reset at midnight Pacific time (12:30 pm India time).
