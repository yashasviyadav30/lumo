# Research Summary

Where the research stands on 2026-09-27. **Research is complete.** Details and sources are in [research.md](research.md) and [feasibility.md](feasibility.md). This is not a plan.

## Mission

Help people become better learners by giving them content that makes them smarter, not content that keeps them scrolling. Every feature must pass this test.

## Fixed rules (above the "brain")

1. **Safety:** try to hide harmful content: adult, self-harm, dangerous acts, hate, scams (e.g. "paper leak"), medical misinformation. The app never claims a video is safe (see "Safety wording").
2. **Law:** under-18 rules (DPDP). No learning from behaviour for minors.
3. **Mission:** as above.

For every feature, the user sets the rules, the app says what it hides and why, and the user can always override.

## Chosen architecture (decided 2026-09-27)

Chosen after the feasibility round found that YouTube's compliance guide bans apps from inferring "the content category/type of a video or channel", and that the API gives transcripts only to a video's owner or editors ([feasibility.md](feasibility.md), section 0 and "Transcript-based understanding").

| Part | What it does | What it works on |
|---|---|---|
| **Smart agent** | Understands the user's goal and each search, for every user and every search: parses the goal, builds queries, picks sources, asks one "Did you mean" tap only when truly ambiguous. | The user's own text (goal, search, mutes). Not used to judge YouTube videos. |
| **Deep layer** | Transcript-based features: search inside lectures, jump to a topic, syllabus mapping. | Only NPTEL content and licensed partner teachers, under off-API agreements that supply their caption files and topic labels. |
| **Light layer** | Everything else on YouTube: goal-based queries, curated channels, YouTube's own fields (`categoryId`, `topicDetails`, `safeSearch=strict`, age-restricted, embeddable) and user rules (mutes, Shorts). | YouTube API data, used only through YouTube's own fields and the user's rules. |
| **Behaviour learning** | Reorders within allowed content. | Our own user data; **18+ only**, and adults can switch it off. |
| **Title-based judging** of arbitrary YouTube videos | **Not part of the product** (updated 2026-09-29). A video's type always comes from YouTube. | — |

## How the product works (the user's view, recorded 2026-09-29)

1. **Video type comes from YouTube, not from us.** The compliance guide says apps "may only use the content type returned by the YouTube API". So filtering uses YouTube's own fields (`categoryId`, `topicDetails`, `safeSearch`, age-restricted, embeddable). Our LLM never reads a title or description to decide a video's category. **YouTube is the primary layer; this app is a secondary layer on top.** Uploaders choose their own category, and it's sometimes wrong (a lecture filed under "Entertainment", a vlog under "Education"). That's why curated teachers, user mutes and the "Show" tap also exist.
2. **No transcripts for arbitrary videos.** The API doesn't allow it, and fetching 30–40 transcripts per search would be slow anyway. Titles and descriptions are only displayed to the user and parsed into chapters. YouTube's own search already reads titles, descriptions and transcripts internally, so **the agent's job is to write excellent search queries**. Transcripts exist only in the deep layer (NPTEL, licensed partners).
3. **The player stays exactly as on YouTube**: same comments, live chat, timeline and ads. Player links open the YouTube app.
4. **No rewards for watching.**
5. **No YouTube data kept longer than 30 days.**
6. **The independent value is the smart agent, and it judges the user, not the video**: their goal, level, growth, and which distractions they're likely to follow. The app is designed from how the human brain works. It decides what to show, what to bring forward and what to keep away, so the user needs almost no effort. It should feel as personal and trustworthy as ChatGPT: it understands what the user means, remembers their progress and suggests the next step.
   - Limits from the rules: learning a user's habits and likely distractions is behaviour learning, so it's **18+ only, with a separate consent, and adults can switch it off** (DPDP; YouTube's guide bans tracking viewing history "without their knowledge or consent"). Anything it keeps away still shows up in the "hidden" line, and the user can always override.

## Decisions so far

**Product**
- As simple as normal YouTube, just better. All intelligence stays inside the app; the user never does extra work.
- Any goal can be typed in; there's no fixed exam list. The app parses the goal and builds the feed itself.
- A clarifying tap appears only when the goal is truly ambiguous, as a one-tap "Did you mean", never a form.
- Shorts are the user's choice (off by default for every user; the app has no modes). Mute of a channel or topic is a hard rule.
- Motivational videos are placed at session start or after a study block, never locked or unlocked. The user sets any cap.
- Labels are internal. Disclosure is one line on the first-run screen, plus **"N hidden by [App] · Why · Show"** under search (wording decided 2026-09-27; it meets III.C's rule to say the app, not YouTube, hid them).
- Feedback comes from silent signals (notes, bookmarks, "mark as studied", finished items, "I need this") and one optional "Was today's time useful?". A **rare "Did this help?"** on a video is allowed (decided 2026-09-27); otherwise no per-video questions.
- **No rewards for watching**: no coins, points, leaderboards or watch streaks (YouTube Policies III.F).
- **YouTube comments are collapsed by default**, not removed.
- Related videos appear in a separate, labelled section.
- Music & Movies mode is dropped.

**Age**
- Accounts are 18+ at launch, for any field. Minor signals in the goal text trigger an age re-check.
- Under-18s come later through a parent-first family account, before DPDP enforcement (May 2027).
- The behaviour layer is off for minors, and adults can switch it off.

**YouTube rules**
- No special permission from YouTube. The standard compliance audit is applied for before launch, and the app still works on default quota (100 searches/day).
- No classifier judges YouTube videos. A video's type comes only from YouTube's own fields (updated 2026-09-29; see "How the product works"). Any model we train works on the user's own text (goals, searches), never on video titles.
- The light layer (YouTube's own fields, curated channels, user rules) and the deep layer carry the product.
- LLM: an open-weight model on a zero-retention host (Groq or Fireworks), moving to self-hosted as usage grows.
- `safeSearch=strict`, and age-restricted, non-embeddable and region-blocked videos are removed everywhere.
- Human-curated source lists are seed data for the four test fields. Automated lists sit on top, refreshed within 30 days. ⚠️ Feasibility (conflict C7) found that automated lists built by judging channels from API data hit the guide's "custom scores to channels" line; they should rest on our users' actions instead.

**Safety wording** (decided 2026-09-27)
- The promise is **"we try to hide harmful content"**, never a claim that a video is safe.
- Self-harm searches show a **support panel with helplines**.
- Scam searches such as "paper leak" show a **warning with one tap to continue**.

**Deep and light layers together** (decided 2026-09-27)
- When an NPTEL or partner lecture matches, it's shown **first**, with a small badge like "Search inside this lecture" and the required "not from YouTube" disclosure (Policies III.E.4.h).

**Accessibility in v1** (decided 2026-09-27)
- Captions on by default, a "captions available" filter, screen-reader support and large tap targets.
- Indian Sign Language (ISL) content and an audio-focused mode come later.

**Platform, money, company, region** (decided 2026-09-27)
- **PWA first.**
- **Free at launch.** This also keeps NPTEL's NonCommercial licence workable; a paid app would need NPTEL's permission.
- **Company registration** before public launch, not now.
- **India first.**
- **Family account verification** is decided when the family account is built.

**Validation** (decided 2026-09-27)
- No interviews. Validation is a **prototype test**: the user's sister and about 5 friends use it for a week.
- The NPTEL email, partner-teacher outreach and lawyer questions run **alongside planning**, not before it.

**Testing:** CS (Company Secretary), CMA, NEET (18+ only) and AI users. A small budget is approved for comparing models.

## Open risks

| Risk | Who can resolve it |
|---|---|
| Automated source lists may count as "derived data" (YouTube policy III.E.4.h) | YouTube only; reduced by design (runtime labels dropped 2026-09-29) |
| ~~Sending video titles to an LLM provider isn't clearly allowed or banned~~ | Avoided by design: the LLM never sees video titles (2026-09-29) |
| Uploader-chosen YouTube categories can be wrong, so filtering by them over- or under-blocks | Curated teachers, user mutes and "Show"; measured in the tests |
| Storing video IDs long-term (notes, bookmarks) | YouTube policy; reduced by re-fetching titles |
| Quota audit may be slow or refused | YouTube; app must work without it |
| Users can escape to YouTube via the player logo, and blocking it is not allowed. Player links must open in the YouTube app when it's installed (compliance guide) | Can't be fixed, only reduced |
| Partner-teacher licence (off-API caption files and topic labels) | **Lawyer** (template), runs alongside planning |
| NPTEL use if the app ever charges (licence is NonCommercial) | NPTEL (IIT Madras); email runs alongside planning |
| Minors lying about age at an 18+ gate | **Lawyer** (what counts as due diligence) |
| Design of the parent-first family account and verified consent (Rule 10) | **Lawyer** |
| Consent wording for the adult behaviour layer (a separate purpose?) | **Lawyer** |
| Disability/health data for Accessibility mode (DPDP; also named in YouTube's guide) | **Lawyer** |
| Whether IS 17802 accessibility rules bind a small private app (the draft RPwD Amendment Rules 2026 would make it mandatory for apps; still a draft) | **Lawyer** |
| Privacy policy, 7-day deletion (YouTube) and DPDP notices | **Lawyer** |
| Pirated re-uploads of paid courses appearing in feeds | **Lawyer** + filter |
| ~~Earlier drafts: `fetch_videos.py` stores YouTube data with no deletion limit, and its `--check-shorts` uses a non-API URL~~ | Dropped 2026-09-27 (plan step 0.3); recoverable from git history |

## Accessibility mode

> Update 2026-09-27: covered by the feasibility round ([feasibility.md](feasibility.md), sections 15a–15g). The list below is kept for the record.

Accessibility was researched only in round 1 (section 3) and hadn't been checked against any later decision. The round needed to cover:
- **Consent for health data.** The help someone needs (captions, screen reader, ISL) can reveal a disability. YouTube's compliance guide lists "Health information" among things apps must not "harvest, track, infer, derive or store… without their consent" (section 17.1). DPDP consent rules also apply, and Rule 11 covers adults with a lawful guardian.
- **Fit with the open goal engine** and the 18+ launch.
- Caption quality, ISL content gaps, and screen-reader support in the embedded player.

## Only testing can answer

- **Demand:** will people switch from YouTube to this app? (Answered by the one-week prototype test, not interviews.)
- **Filter quality:** how often YouTube's own categories wrongly hide a lecture or let entertainment through.
- **Which model** handles Hinglish goals and searches best: open models vs one closed benchmark model.
- **Speed:** can results come back in 1–2 seconds?
- **Goal parsing:** does "CMA Inter costing" map to the right paper, and how often is a clarifying tap needed?
- **Cold start:** feed quality in niche fields (CS, CMA) and in AI, which has no syllabus; how many searches each new goal uses.
- **Signals:** are notes, bookmarks and "studied" enough to tell useful from tempting?
- **Captions:** does the API's caption flag mean human-made captions only?
- **iOS:** does the embedded player work in the app shell (known "Error 153" issue), and how often do users escape to YouTube?
- **Age gate:** how many users drop off, and how many lie?

## User interviews

> Update 2026-09-27: no interviews will be done. Validation is a one-week prototype test with the user's sister and about 5 friends. The template below is kept in case it's useful for notes from that test.

The idea came from my sister's own problem: YouTube distracted her while she was studying.

Copy the template once per person. Write their words, not a summary.

### Interview template

- **Person:** (name or initials, date)
- **Field:** (e.g. CS, CMA, NEET, AI)
- **Age group:** under 18 / 18–20 / 21–25 / 26+
- **Biggest problem, in their words:**
- **What they tried, and why they stopped:**
- **Surprises:**

### Interviews

*(none yet)*
