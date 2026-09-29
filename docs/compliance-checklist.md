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
