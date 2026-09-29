# Compliance checklist

Run at the end of every stage (plan stop rule). The rules are R1–R14 in [plan.md](plan.md); the reasons and sources are in [feasibility.md](feasibility.md).

For each stage, mark every rule: ✅ checked and met · ➖ doesn't apply yet (say why) · ❌ broken (fix before the stage is done).

## The rules

- [ ] **R1** YouTube API data stored 30 days at most, in limited amounts, then refreshed or deleted.
- [ ] **R2** A user's data deleted within 7 days of their request or account deletion.
- [ ] **R3** A video's type comes only from YouTube's own fields. No judging of videos by our model, an LLM or word-matching on titles.
- [ ] **R4** The LLM sees only the user's own text (goal, search, mute words), never video titles, and runs on a zero-retention host.
- [ ] **R5** `safeSearch=strict` on every search; age-restricted, non-embeddable and region-blocked videos dropped everywhere and counted.
- [ ] **R6** Hidden results show "N hidden by [App] · Why · Show", and "Show" reveals them in place.
- [ ] **R7** The YouTube player is never changed, covered or blocked; ads play; its links open the YouTube app; no background play.
- [ ] **R8** No rewards for watching and no gating.
- [ ] **R9** Our data shown next to YouTube data says "not from YouTube"; own name and look, with YouTube attribution.
- [ ] **R10** Accounts are 18+; minor signals in a goal trigger an age re-check.
- [ ] **R11** Logs never contain video IDs or titles.
- [ ] **R12** Every feature still works, in reduced form, when the 100 searches/day run out.
- [ ] **R13** Safety wording is "we try to hide harmful content", never "safe".
- [ ] **R14** No tracking of viewing for Made-for-Kids videos.

Also every stage: **no secret in git** (keys only in `backend/.env`, which is ignored; `.env.example` holds empty keys).

## Stage 0: Setup (checked 2026-09-29)

| Rule | Result | Note |
|---|---|---|
| R1 | ✅ | Nothing stores YouTube data. `tools/check_youtube_api.py` prints only status codes and counts. The old `fetch_videos.py` was dropped (0.3). |
| R2 | ➖ | No user accounts yet (Stage 2). |
| R3 | ✅ | Nothing judges videos. |
| R4 | ✅ | `tools/check_llm.py` sends only a goal-style question. Groq Global ZDR is on (`docs/groq-zdr.png`). |
| R5 | ✅ | The YouTube check uses `safeSearch=strict`. Drop rules come in Stage 3. |
| R6–R9 | ➖ | No user-facing screens yet (Stages 1, 3, 7). |
| R10 | ➖ | No accounts yet. Testers' ages are confirmed in step 0.7. |
| R11 | ✅ for now | The backend only serves `/health`. Watch Render's request logs once URLs carry video IDs (step 2.6). |
| R12 | ➖ | No search feature yet (Stage 3). |
| R13 | ➖ | No safety wording yet (Stage 6A). |
| R14 | ➖ | No playback tracking yet. |
| Secrets | ✅ | Scanned all commits and the GitHub repo (private): no Google, Groq or database secrets; the only env file tracked is `backend/.env.example` with empty keys. The Docker image contains no `.env`. |

Data location note: the database is in Mumbai (Supabase `ap-south-1`); the backend runs in Singapore (Render) until launch (step 13.0).

## Stages 1, 2, 3 and 4A (checked 2026-09-29)

| Rule | Result | How it was checked |
|---|---|---|
| R1 | ✅ | YouTube rows (`yt_videos`, `yt_search_cache`) carry `fetched_at`; purge deletes >30 days (test); reads never show rows >30 days even before a purge (test). Search cache 24 h. |
| R2 | ✅ | "Delete my data" deletes the account and every row at once (`ON DELETE CASCADE`; test + real Supabase run). |
| R3 | ✅ | Filtering uses only YouTube's fields (`categoryId`, `topicDetails`, `ytRating`, `embeddable`, region, duration, embed shape) and the user's own mutes, follows and Shorts setting. No model reads titles. |
| R4 | ✅ | The goal LLM gets only the user's text and our catalogue (test asserts the exact user message). Groq ZDR on. |
| R5 | ✅ | `safeSearch=strict` on every search (test on the real request URL). Age-restricted, non-embeddable, blocked-in-India videos dropped and counted. Feed (Stage 5) must reuse the same rules. |
| R6 | ✅ | "N hidden by FocusLearn · Why · Show" (unit tests + real Edge run). |
| R7 | ✅ | Official IFrame player, controls on, autoplay off, nothing over it, links untouched, no background play. Nothing drawn over YouTube thumbnails; titles shown as given. |
| R8 | ✅ | No points, coins, streaks or gating anywhere. |
| R9 | ✅ | Own name and logo; "not made by YouTube or Google"; hidden reasons marked as ours, not YouTube's. |
| R10 | ✅ | 18+ gate; under-18 refused with nothing stored (not even in the log). Minor signals in goals shown as a note; the re-check is step 4.6. |
| R11 | ✅ | Real `app_log` holds only route templates (`/api/search`, `/api/goals`…); searches, goals and video IDs travel in request bodies; uvicorn access log off. |
| R12 | ✅ | Quota guard: saved results or a clear note when searches run out (tests). |
| R13 | ✅ | "We try to hide harmful content, but no filter is perfect." No screen calls a video safe (grep). |
| R14 | ✅ | No viewing is tracked at all yet. When study tools arrive (Stage 7), skip tracking for `madeForKids` videos. |
| Secrets | ✅ | All commits scanned: no keys or passwords; only `backend/.env.example` (empty) is tracked; Docker image has no `.env`. |
