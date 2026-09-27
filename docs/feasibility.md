# Feasibility: Every Expectation, Checked

Research only, not a plan. Done 2026-09-26/27 by six parallel research agents plus a coordinator check. Base: [research.md](research.md) and [research-summary.md](research-summary.md). No decisions were changed; where research shows a decision can't hold as stated, it's flagged, not changed.

Labels: ✅ verified in a primary source · 🟡 secondary source · 🔵 assumption or reasoning · ❓ don't know.

## Summary table

"Possible?" is within YouTube's rules and Indian law. Where the answer depends on how YouTube reads its compliance guide, both are shown.

| # | Expectation | Possible? | Effort (solo) | Risk |
|---|---|---|---|---|
| 1 | No entertainment or distractions | **Partly.** Distractions (Shorts shelf, home feed, autoplay): yes. Entertainment *videos*: only via YouTube's own fields, curated lists and user rules, unless YouTube accepts a classifier | Medium | **High** with our classifier; Low–Medium without |
| 2 | Search any learning topic freely | **Yes**, but capped at 100 searches/day for the whole app until the audit | Low | Medium (quota) |
| 3 | Goal engine for any field, one tap when ambiguous | **Yes** | Medium | Medium (accuracy on niche exams) |
| 4 | Feed learns what helps (enrichment), 18+ only | **Partly.** Allowed; unproven that silent signals alone are enough | Medium | Medium |
| 5 | Better suggestions + separate "related" section | **Partly.** Better for on-goal lectures (series, syllabus order), not in general | Medium | Low–Medium |
| 6 | Shorts optional, limited, user-set daily limit | **Partly.** The limit: yes. Reliable Shorts detection: no official flag; inferring "Short" may itself be content-type inference | Low | Medium |
| 7 | One-tap mute (channel or topic) as a hard rule | **Channel: Yes. Topic: Partly** (keyword rule the user picks) | Low / Medium | Low |
| 8 | Motivational placed well, user-set cap | **Yes** (feed order, never gated). Evidence: "how I studied" videos can help; hype may lower effort | Low–Medium | Low (policy), Medium (product) |
| 9 | As simple as YouTube; labels internal; minimal disclosure | **Partly.** Simple: yes. Looking like YouTube: **No** (branding rules). Disclosure must say *the app* hid results | Medium | Low if own brand |
| 10a | Own classifier trained on non-YouTube text | **Training: Yes. Running it on YouTube videos: No** on the literal reading of the guide; running it on the user's own text (goal, query): Yes | High | **High** |
| 10b | Own recommender on our user data + cold start | **Partly.** Allowed on our users' actions; start with rules + bandits; too few users per goal for a trained model early | Medium → High | Medium |
| 11 | Hindi, English, Hinglish | **Partly.** Devanagari and English: good. Romanised Hinglish: weak in every model | Medium | Medium |
| 12 | Results in 1–2 s | **Yes, very likely** (est. 0.7–1.9 s) if the LLM stays off the critical path | Low–Medium | Low |
| 13 | Safety against all harmful content | **Partly.** No one can block *all*. YouTube's own signals + query checks are clean; a video-level safety classifier conflicts with the guide | Medium | **High** |
| 14 | 18+ at launch; parent-first family account later | **Yes.** How much "due diligence" an 18+ gate needs is untested | Low now; Medium–High later | Medium |
| 15 | Accessibility mode | **Partly overall.** Captions Partly, ISL Partly (supply), screen reader Partly (player can't be fixed), motor Yes, audio-focused Partly (no background play), consent Yes | Low–Medium | Medium (High for ISL supply) |
| 16 | Play inside the app, fewer escapes | **Partly.** Playback: yes on all platforms. Escapes: player links **must** open in the YouTube app, so they can only be reduced | Medium | Medium |
| 17 | Comments and chapters in the app | **Yes**, read-only comments (not stored); chapters parsed from descriptions | Low | Low |
| 18 | Notes, bookmarks, "mark as studied", "Done for today" | **Yes**, with no rewards for watching (III.F) | Medium | Low |
| 19 | Windows, Mac, Android, iPhone | **Yes.** PWA (+ Play Store wrapper) first; Capacitor for iOS; Tauri has an open player bug | Low → Medium | Low (PWA) to High (Tauri) |
| 20 | Behaviour-aware design with override | **Yes**, if nothing rewards watching | Low–Medium | Low (High if it rewards watching) |
| 21 | Later: kids and other ages | **Partly.** Settings-and-context feeds with consent: yes. Learning from a minor's behaviour: **No** in India | Medium (teens) / High (under-13) | Medium / High |
| 22 | Later: international | **Partly.** Adults: manageable. Minors: a separate project per country | Medium / High | Medium / High |
| 23 | Sustainable costs and funding | **Costs: Yes** (~$10–15/month at 100 MAU, $70–200 at 10k, $2.4–4.3k at 1M). **Funding: Partly** (charge only for own features; grants need a company) | Low / Medium | Low / Medium |
| 24 | Full compliance | **Yes except the AI filter**, whose status depends on YouTube's reading | Medium | **High** (AI filter), Medium (rest) |

## Findings that change earlier research

Each was checked by the coordinator in the raw page text, not only by the agents.

1. **The compliance guide bans inferring a video's category.** ✅ Under "Only offer metrics that are available via YouTube's API services" → "Don't use YouTube's API to:": "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API." Same list: "Make any claims on whether a video or channel is safe or suitable to watch or advertise against" and "Merge or combine YouTube API data with any other data." [Guide](https://developers.google.com/youtube/terms/developer-policies-guide). research.md sections 15–19 missed this list. It's more direct than the III.E.4.h "derived data" risk they discussed.
2. **A tagging route exists, but only for analytics apps.** ✅ Policies III.L (from 1 June 2026) and the [derived-metrics page](https://developers.google.com/youtube/terms/derived-metrics-policy) allow "descriptive sub-genres or tags" if they're additive and disclosed as the app's own. The route applies only to developers accepted under "Analytics & Reporting": "Your API Service must reflect an analytics use case on YouTube." 🔵 A study app isn't one; claiming it would misdescribe the app in the audit.
3. **Player links must open in the YouTube app.** ✅ Guide: "Links must open in the YouTube application whenever the application is available on a user's device, or if not installed, via the system web browser." research.md section 6 was wrong to guess the app could route them to the browser.
4. **Limiting a YouTube feature has its own rule.** ✅ Policies III.C "Permitted Feature Limitation": the app must "explain to users why each limitation is in place and make clear that the limitation is not imposed by YouTube", and should offer a way to reach the full feature.
5. **Rewards for watching are banned.** ✅ Policies III.F: no "incentives, rewards, or other compensation to users for… viewing content".
6. **Groq's Llama models are now enterprise-tier.** 🟡 (Groq models page, via summary.) GPT-OSS and Qwen models remain self-serve, so "open-weight model on a zero-retention host" still works with a different model family.
7. **DPDP children's duties start 13 May 2027** ✅ (Gazette date 13 Nov 2025 + 18 months), and the age check itself is exempt from parental consent (Fourth Schedule Part B entry 6).
8. **Draft RPwD (Amendment) Rules 2026** (S.O. 3962(E), 16 July 2026) would make IS 17802 mandatory for apps, with 18 months to comply and a public conformance report. 🟡 Still a draft; no final notice found by 27 Sept 2026.

Corrections to research.md are listed at the end of this file. research.md itself hasn't been edited.


---

# Group: Filtering, classifier ML, language, speed and safety

Expectations 1, 2, 7, 10a (classifier half), 11, 12, 13, plus the III.C question on hiding search results. Research only, checked 2026-09-26/27.

Labels: ✅ read in a primary source · 🟡 secondary · 🔵 my reasoning · ❓ unknown.

---

## 0. Read this first: the guide's "metrics" lines change the base assumption

The coordinator found, and I re-checked against the raw page text, a list in the compliance guide that the earlier rounds (sections 15–19 of research.md) never quoted. It bears on every expectation in this group.

**Source** ✅ [Complying with YouTube's Developer Policies](https://developers.google.com/youtube/terms/developer-policies-guide), raw HTML downloaded and searched. Heading: **"Only offer metrics that are available via YouTube's API services."** "What this means: Don't use YouTube's API to offer independently calculated or derived metrics or data that replace or provide new data that isn't available via YouTube's API services." The "More information" link points to Developer Policies section III.E (Handling YouTube Data and Content). Then "Don't use YouTube's API to:", including, verbatim:

- "Make any claims on whether a video or channel is safe or suitable to watch or advertise against."
- "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API."
- "Merge or combine YouTube API data with any other data."
- "Calculate and assign custom "scores" to channels based on independently calculated averages or ratios -- for example, average view count, comment count, or overall brand suitability."

**What the guide is** ✅ [Developer Policies page, top note](https://developers.google.com/youtube/terms/developer-policies): the guide "provides guidance and examples to help you ensure that your API clients follow specific portions of the YouTube API Services Terms and Policies… offers insight into how YouTube enforces certain aspects of the API TOS, but it does not replace any existing documents." So it isn't the policy text, but it is Google's own account of how it enforces III.E.4.h ("must not… access or use API Data to create new or derived data or metrics").

The same guide also says ✅: "Links must open in the YouTube application whenever the application is available on a user's device, or if not installed, via the system web browser", and "video metadata such as thumbnail and title must be visible to the viewer and unmodified."

### Plainest reading (🔵, but close to the words)

| What we planned | Which line it hits | Literal verdict |
|---|---|---|
| Learning-vs-entertainment classifier run on video titles/descriptions (10a) | "Infer or estimate the content category/type of a video or channel" | **Not allowed.** "Learning" vs "entertainment" is a content type. The list says "Don't use YouTube's API to", which covers use, not only display, so "internal-only" doesn't help. The added clause "you may only use the content type returned by the YouTube API" names the permitted alternative: YouTube's own fields. |
| Our own safety classifier (scam, misinformation, hate) on titles | "Make any claims on whether a video or channel is safe or suitable to watch" | **Very likely not allowed** when the result hides a video as unsafe and the app says it hides harmful content. |
| LLM fallback that labels titles | Same two lines | Same as above. |
| Classifier/embeddings mixing our goal text with titles | "Merge or combine YouTube API data with any other data" | Read literally, yes. But read literally this line would also ban showing a user's own note next to a video, which can't be the intent (see counter-reading). |
| Automated "good channel for CMA" lists (group B) | "custom scores to channels", "infer… category/type of a… channel" | Not allowed under the literal reading. |

### Strongest counter-reading (🔵)

1. The heading and the "What this means" line are about **offering** metrics and data: "Only offer metrics…", "Don't use YouTube's API to offer independently calculated or derived metrics or data." Most examples are analytics and ad-tech: CPM, monetization status, demographics, brand suitability, rivalry rankings. On this reading the list targets products that sell or show derived data about videos and channels, not a private filter the user switched on.
2. The same guide, under "Respect user privacy", bans filtering "without their knowledge or consent" ✅. That implies filtering *with* consent is expected, and any useful filter needs some judgement about each video.
3. "Merge or combine YouTube API data with any other data" cannot be read at full width: every app combines API data with its own UI, user accounts and settings. So the list is not meant word-for-word, and the category line may be narrower than it looks.
4. "Claims on whether a video… is safe… to watch or advertise against" sits next to ad-tech items. It reads like a ban on brand-safety verdicts offered to others.

**Weakness of the counter-reading:** the category line is specific, has no "display" or "offer" qualifier, and tells you what to use instead. Brand-safety classification of YouTube videos is a business YouTube reserves for approved measurement partners (❓ I did not verify their terms), which suggests Google means this line. A reviewer in a compliance audit will read the bullet, not our theory.

**Best-supported reading (🔵):** for a video-level classifier, the literal reading is the safer and, on balance, the better-supported one. The counter-reading is arguable, not strong enough to build the product on. The guide itself says: "If… you're unsure whether your service is allowed, please apply for an API Compliance Audit" ✅. The audit is already planned, so it's the place to describe the classifier plainly and get an answer. Until then, treat the classifier as the removable layer the summary already describes, and make sure the product works without it.

### Designs that stay clear of these lines

| Design | Why it's clear (🔵) | What it loses |
|---|---|---|
| **YouTube's own fields only.** Search with `safeSearch=strict`; optionally `topicId=/m/01k8wb` ("Knowledge") or `videoCategoryId` (e.g. 27 Education). Hide by `topicDetails.topicCategories` (Entertainment, Music, Gaming, Humor, Movies, TV shows), `ytAgeRestricted`, `madeForKids`, `embeddable`, region block, `liveBroadcastContent`, duration. | "You may only use the content type returned by the YouTube API." These are that content type. ✅ search.list lists `topicId` values, including "/m/01k8wb Knowledge" and the Entertainment topic family ([docs](https://developers.google.com/youtube/v3/docs/search/list)). | Accuracy unknown ❓. `categoryId` is uploader-set; many lectures sit in "People & Blogs" or "Entertainment". `topicCategories` is coarse (Wikipedia URLs). No Hinglish judgement at all. |
| **The user's own rules.** Channel mutes, keyword mutes the user types, Shorts off, duration limits. | The user decides; the app only applies an exact rule. Fits "with their knowledge or consent". | User work, which cuts against "the user never does extra work". Keyword rules are weak on Hinglish spelling variants. |
| **Human-curated channel lists.** Curators judge channels by watching on youtube.com, and record channel IDs + their own judgement. | No API data used to infer anything. Human judgement is our data. | Closed world. Scales only with curator time. Weak for "search any topic" (expectation 2). |
| **Classify the goal and the query, not the videos.** Turn the user's goal ("CMA Inter costing") into good YouTube searches and a list of curated sources. | Goal text and queries are our data. YouTube does the ranking. | Entertainment still leaks into results; we can't hide what we can't judge. |
| **App-suggested keyword mutes** (e.g. "paper leak", "leaked paper") shown as a visible, editable starting rule | Closer to the line than user-typed rules, but it's a plain string match the user accepts, not an inference. ❓ | Same spelling-variant weakness; still a grey area if a reviewer sees it as a disguised safety verdict. |

**If the literal reading holds**, expectation 1 drops to **Partly**, 10a (classifying videos) to **No**, and 13 to **Partly**. Each section below gives both verdicts.

### A documented permission route: III.L and the derived-metrics policy (added 2026-09-27)

✅ Developer Policies **III.L** (raw text): "Additional policies on derived metrics and data storage. These policies are only applicable to audited developers with analytics use cases that have explicitly applied for permission to create additional metrics and/or store statistical data through the standard quota extension request from (starting June 01, 2026)."

✅ The linked page, [Additional policies for derived metrics and data storage](https://developers.google.com/youtube/terms/derived-metrics-policy) (raw text):
- Intro: "As a developer, you are generally prohibited from creating metrics that replace or modify the data returned by the YouTube API Services. However… to support advanced analytics and creator tools, YouTube permits the calculation of specific additional metrics…" You accept by selecting "Section 5: Use Cases, API Integration, and Feature Implementation" then **"Analytics & Reporting"** in the form. "**Your API Service must reflect an analytics use case on YouTube.**"
- "3. Content Categorization and Tagging. What this means: You may use analysis to assign descriptive sub-genres or tags to videos and channels. These must be additive and distinct from YouTube's video categories, such as videoCategories.snippet.title." Allowed: "Creating your own tagging system that includes similar terms already found in the API Data, such as "Gaming", so long as it is clearly disclosed to the user that they are your tags." Do not: "Replace or override a published YouTube category".
- "Derived metrics (such as sentiment analysis) based on retrieved data may also be stored for up to 36 calendar months. Other data (such as video titles, creator names, descriptions, and comment text) must still follow the 30-day refresh."
- Its safety section is "Brand Suitability & Safety Scoring", defined around advertising (the "Brand Safety Floor"), not viewer safety.

**What this changes (🔵):**
1. **It confirms the literal reading.** Google itself says tagging videos is "generally prohibited" and allowed only under this amendment. The counter-reading in the section above is now weaker.
2. **It opens a documented route**, through the same quota-extension/audit form the user already plans to file. That's not "special permission" in the sense of a private deal; it's a standard option on the form.
3. **Does a learning app fit?** ❓ Probably not as written. The route is for "analytics use cases" and "advanced analytics and creator tools". A viewer-side learning app isn't an analytics product. Selecting "Analytics & Reporting" when the app isn't one would misdescribe it in a compliance audit, which I would not advise. The honest move is to describe the app as it is, ask in the audit whether its learning/entertainment tags fall under section 3, and accept the answer.
4. **Conflict with "labels internal":** section 3 requires that it's "clearly disclosed to the user that they are your tags". Today's design shows no labels, only "X hidden · Show". If this route is used, the design must show that hidden items were hidden by **our** tags (e.g. "Hidden by [App] tag: entertainment"), at least on tap. That's a small UI change, but it reverses the earlier "labels internal" decision.
5. **Safety tagging is not covered.** The safety section is about ads, so a viewer-safety classifier (scams, misinformation) has no stated route, even for audited developers ❓.
6. A side benefit if granted: tags could be stored up to 36 months instead of 30 days.

---

## 1. No entertainment or distractions in the feed or search

**Possible?** **Partly.** Removing *distractions* (Shorts shelf, home feed, comments, autoplay-into-random) is Yes: the app owns its UI. Removing *entertainment videos* reliably is Partly at best. With our own classifier: probably workable technically, but the guide's "infer… content category/type" line makes it a policy risk (section 0). Without it: only YouTube's own fields, curated lists and user rules, which leak.

**Best way:** layers, cheapest and cleanest first.
1. **Feed from human-curated sources** for the four test fields (channel IDs + curator judgement). Most feed items never need a video-level judgement. 🔵
2. **YouTube's own fields** on everything else: `safeSearch=strict`, drop age-restricted / non-embeddable / region-blocked, and hide videos whose `topicDetails.topicCategories` are only Entertainment/Music/Gaming family. Consider `topicId=/m/01k8wb` (Knowledge) on search, and measure how many good lectures it drops. ✅ fields exist; 🔵 accuracy unknown.
3. **User rules** (mutes, Shorts off). 
4. **Our classifier as the removable layer on top**, turned on only if the audit answer allows it, or kept off at launch if you want zero risk. Defaults: "unsure → show", "X hidden · Show". The audit question to ask is whether our tags fall under "3. Content Categorization and Tagging" of the derived-metrics policy (III.L, section 0). That route is written for "analytics use cases", so expect a "no" or a request to reframe ❓. If granted, hidden items must say they were hidden by *our* tags, which reverses "labels internal".
5. Distraction removal in our own UI: no infinite scroll, no autoplay into unrelated videos. The embedded player's end screen and YouTube logo link can't be removed ✅ (research.md s.4, guide: links must open in the YouTube app). So "no distractions" can never be complete inside the player.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Own classifier on titles (plan in the summary) | Handles Hinglish and intent ("film studies lecture" vs "movie review") | Guide line on inferring content type; accuracy on real titles unmeasured |
| YouTube fields only (`topicCategories`, `categoryId`, `topicId` in search) | Explicitly allowed ("content type returned by the YouTube API"); free (in `videos.list`) | Coarse, uploader-dependent; ❓ how many lectures are tagged Entertainment |
| Curated channels only | Precise, cheap, clean | Closed world; conflicts with expectation 2 |
| User rules only | Cleanest | Puts work on the user; weak on Hinglish variants |
| Goal → query building only | Our data only | No hiding; entertainment leaks into search |

**How competitors handle it:**
- **Unhook** ✅ ([store](https://chromewebstore.google.com/detail/unhook-remove-youtube-dis/khncfooichmfjbepaaaebmommgaepoid)): doesn't judge videos at all. It hides UI parts (home feed, sidebar, Shorts, comments, end screens). It's a browser extension on youtube.com, not an API client, so API policies don't apply to it.
- **YouTube Kids** ✅ ([YouTube](https://www.youtube.com/intl/ALL_in/kids/safer-experience/)): "a mix of automated filters built by our engineering teams, human review and feedback from users"; "no automated system of filters is perfect"; filters "scan multiple aspects of the video including thumbnails, titles and the actual content." Parents can pick "approved content only". YouTube does this as the platform owner.
- **Lightspeed SmartPlay** 🟡 ([site](https://www.lightspeedsystems.com/solutions/engagement-impact/safe-youtube-for-schools/)): "our unrivaled database to categorize videos for schools"; schools add or remove videos and channels. Method not published ❓, and whether it uses the Data API ❓.
- **YouTube Educational Filter** extension 🟡: reads titles on youtube.com and hides "junk". Extension, not API.
- **StudyTube / LearnTube / SyncStudy** 🟡 (research.md s.2): avoid judging videos; they use search, playlists the user chooses, or PW playlists.

🔵 Pattern: the products that judge videos are either YouTube itself or extensions outside the API. API apps mostly avoid judging videos. That fits the literal reading.

**Sources:** ✅ [Compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide) · ✅ [search.list](https://developers.google.com/youtube/v3/docs/search/list) (`safeSearch`, `topicId`, `videoCategoryId`) · ✅ [videos resource](https://developers.google.com/youtube/v3/docs/videos) (`topicDetails.topicCategories`: "A list of Wikipedia URLs that provide a high-level description of the video's content") · ✅ [YouTube Kids safer experience](https://www.youtube.com/intl/ALL_in/kids/safer-experience/) · 🟡 [Lightspeed](https://www.lightspeedsystems.com/solutions/engagement-impact/safe-youtube-for-schools/)

**Risks:**
- Legal/policy: **High** for a video-level classifier under the literal reading; low for fields, curated lists and user rules.
- Technical: `topicCategories` quality on Indian lecture channels is unknown ❓.
- Product: the player's end screen and logo link are always an exit to full YouTube. A user who wants entertainment gets it in one tap.

**Needs testing:** on a fresh sample of titles for the four fields, what share of good lectures carry an Entertainment `topicCategories` or a non-Education `categoryId`; how much `topicId=/m/01k8wb` shrinks and cleans search results; whether the classifier layer adds enough over fields + curated lists to be worth the policy risk.

**Effort for a solo developer:** Medium (fields and curated lists are easy; the classifier layer and its evaluation are the heavy part).

**Risk level:** **High** (policy) with our classifier; **Low–Medium** without it.

---
## 2. Search any learning topic freely, without over-blocking

**Possible?** **Yes**, with one limit outside this group: the 100 `search.list` calls per day for the whole app (research.md 17.2). Letting a CS student search law is a design choice, not a technical problem. Over-blocking is the risk to manage, and it shrinks if we filter less.

**Best way:**
- **Two scopes.** The goal shapes the *feed*. *Search* is open: any learning topic is fine, whatever the user's goal. Search hides only (a) YouTube's own safety removals and (b) whatever the chosen mode hides, never "off-goal". So "Company law" searched by a Computer Science student is never hidden for being off-goal. 🔵
- **Default to show.** Hide only on a clear signal. With YouTube fields only, that means `ytAgeRestricted`, non-embeddable, region-blocked, and topic lists that are *only* Entertainment/Music/Gaming. With the classifier (if allowed), hide only high-confidence entertainment; "unsure" is shown. 🔵
- **"X results hidden · Show"** under results, and "Show" reveals them in place (research.md 17.1). The count also acts as the over-blocking alarm: log "Show" taps and "I need this" (our data) per language.
- **Don't use `topicId=/m/01k8wb` (Knowledge) on search by default** until tested. It's a YouTube-native filter and so policy-clean, but it may drop many Hinglish lectures that YouTube tags otherwise. ❓
- **Headline metric:** wrongly hidden learning videos, per language (research.md s.5).

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Open search + light hiding + "Show" (recommended) | Least over-blocking; clear consent story | Some entertainment gets through |
| Goal-scoped search (hide off-goal results) | Tighter focus | Over-blocks exactly the CS-student-searching-law case; also more "inferring" per section 0 |
| `topicId=Knowledge` / `videoCategoryId=27` on every search | Policy-clean, zero cost | Likely heavy over-blocking of mis-tagged lectures ❓ |
| No hiding in search at all | Zero over-blocking, zero III.C doubt | Fails expectation 1 in search |

**How competitors handle it:** StudyTube (app) and SyncStudy leave search unfiltered and remove only UI distractions 🟡. YouTube's own search offers `safeSearch` and Restricted Mode, nothing for "learning only". Unhook leaves search results alone except Shorts and some shelves ✅ (store listing toggles).

**Sources:** ✅ [search.list](https://developers.google.com/youtube/v3/docs/search/list) · ✅ [Developer Policies III.C](https://developers.google.com/youtube/terms/developer-policies) · research.md 17.1, 17.2

**Risks:** Product: search quota, not filtering, is what limits free search (group F). Policy: see the III.C question below and section 0. Technical: Hinglish queries return mixed-language results; `relevanceLanguage` only nudges ("results in other languages will still be returned if they are highly relevant") ✅.

**Needs testing:** share of results hidden per query and per language; "Show" tap rate; whether users read the hidden count.

**Effort for a solo developer:** Low.

**Risk level:** Low (product) · Medium overall because of quota.

### The III.C question: does "X results hidden · Show" conflict with III.C?

**The text** ✅ (III.C "Implementing YouTube Features", raw page): "API Clients that use search functionality provided by YouTube API Services must not modify or replace the text, images, information, or other content of, the search results returned by those Services. For example, API Clients must not merge or intermix results from sources other than YouTube and present them as YouTube search results."

The **next paragraph in the same section** matters and wasn't quoted in research.md ✅: "An API Client should not limit or reduce the functionality of a YouTube feature unless that limitation is a core aspect… of the API Client itself and that YouTube feature is not required by the RMF ("Permitted Feature Limitation")." And: "API Clients with Permitted Feature Limitations must explain to users why each limitation is in place and make clear that the limitation is not imposed by YouTube… an API Client should provide a mechanism for users to access the full feature (such as linking to YouTube Creator Studio or providing an expandable menu within the API Client)."

The guide adds ✅: "video metadata such as thumbnail and title must be visible to the viewer and unmodified."

**Best-supported reading (🔵):**
1. The "modify or replace" sentence is about *altering what a result says* (text, images, information) and *mixing in non-YouTube results*. Hiding some results whole, and showing the rest unchanged, doesn't alter any result. So hiding is probably not "modifying" under the first sentence.
2. Hiding is better treated as a **feature limitation**. It's allowed when the limitation is core to the app (a learning-only app filtering entertainment is a clean example, like the policy's own "French-learning app" example), **explained**, marked **"not imposed by YouTube"**, and **reversible** via something like "an expandable menu". "X results hidden · Show" matches that almost word for word. Two small wording changes make the match exact: say who hides them ("3 hidden by Aspirant mode", not a vague passive), and let "Show" expand in place.
3. **Reordering** remains unaddressed by the text ❓. Keeping YouTube's order within what's shown is the cautious choice.
4. III.C isn't the real barrier. *Why* a result is hidden is: hiding by YouTube fields or user rules is fine; hiding by our own classifier runs into section 0. If our tags are ever approved under III.L, the "X hidden" line must also say the hiding used **our** tags ("clearly disclosed to the user that they are your tags"), which fits the III.C duty to "make clear that the limitation is not imposed by YouTube" anyway.

Confidence: medium. I found no Google statement or enforcement case that addresses hiding results directly ❓.

---
## 7. One-tap mute for any channel or topic, as a hard rule

**Possible?** **Channel mute: Yes. Topic mute: Partly.** A channel mute is an exact rule on `channelId`, applied every time. A topic mute is only as reliable as the matching behind it. Exact keyword matching is policy-clean but misses spelling variants and Hinglish. Meaning-based matching (embeddings, classifier) catches more but runs into the "infer content category/type" line (section 0).

**What the mute is, in storage terms (🔵):** the mute is the **user's own rule**, so it's user data, not API data. Store:
- Channel mute: the `channelId` plus a display name the **user saw** at mute time. ❓ Whether a stored `channelId` counts as API data kept past 30 days is the same open question as notes and bookmarks (research.md s.16). The safest form: keep the ID (needed to apply the rule), don't keep the channel title; re-fetch the title with `channels.list` (1 unit) when the user opens their mute list.
- Topic mute: the **words the user chose** (typed, or picked from a suggestion), plus our own expansion of those words (spelling variants, Devanagari/romanised forms). All of this is our data; none of it comes from YouTube.
- Mutes are deleted with the account (III.E.4.g: within 7 days ✅).

**How topic mute can work without long caches or runtime labels (🔵):**
1. The user taps "Mute topic" on a video. The app offers 2–4 short phrases taken from the title in front of them ("IPL", "Bigg Boss", "prank"). The user picks one, or types their own. **The user picks, the app doesn't infer.** One extra tap, but it keeps the rule the user's own.
2. The app expands the phrase using our data only: transliteration (IndicXlit, see 11) to get "बिग बॉस" ↔ "bigg boss", common misspellings, and plural forms. The expansion list is shown under the mute so the user can see it.
3. At request time, every title and description is matched against the expanded list (normalised: lower case, no emoji, script-folded). A match is hidden, every time, with no confidence threshold. That's what makes it a **hard rule**.
4. Nothing is cached per video, so the 30-day rule doesn't bite. The mute list itself lives with the account.
5. **Optional semantic layer**, only if section 0 is resolved in our favour: embed the mute phrase once, and hide titles within a similarity threshold. Better recall, but a threshold is not a hard rule, and it's the "inferring" we'd avoid otherwise.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Channel mute on `channelId` | Exact, cheap, reliable | Doesn't catch re-uploads on other channels |
| Keyword topic mute, user-picked phrase + our expansion (recommended) | Hard rule, policy-clean, explainable | Misses paraphrases ("IPL" vs "T20 league match") |
| Embedding topic mute | Catches paraphrases, Hinglish variants | Not a hard rule (threshold); section 0 risk |
| Mute by YouTube `topicCategories` (e.g. mute "Sports") | Policy-clean, one tap | Very coarse; would mute cricket analytics lectures too |
| Classifier-based "mute all entertainment" | What users mean | Same as expectation 1 |

**How competitors handle it:**
- **YouTube itself** ✅ (YouTube Help, "Don't recommend channel"; not re-checked in this round, 🟡): "Don't recommend channel" and "Not interested" are soft signals, not hard rules. research.md s.16 cites Mozilla's finding that these soft controls fail.
- **FilterTube** (India) 🟡 ([site](https://www.filtertube.in/)): keyword and channel blocking, stored locally. Extension, not API.
- **BlockTube / similar extensions** 🟡: keyword and channel regex rules on youtube.com. Same approach as our keyword mute.

**Sources:** ✅ [Developer Policies III.E.4](https://developers.google.com/youtube/terms/developer-policies) · ✅ [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide) · ✅ [IndicXlit, MIT](https://github.com/AI4Bharat/IndicXlit) · research.md s.16

**Risks:** Product: users expect "mute cricket" to catch everything about cricket; keyword rules won't. Show what the rule covers, and let "I still see X" add a word. Policy: long-term `channelId` storage ❓ (low in practice). Technical: normalising emoji-heavy, mixed-script titles needs care.

**Needs testing:** recall of keyword mutes on real titles per language (how many muted-topic videos slip through); how often users add words after a slip.

**Effort for a solo developer:** Low (channel) · Medium (topic with transliteration).

**Risk level:** Low.

---

## 10a. Our own content classifier trained on non-YouTube text (classifier half)

**Possible?** Two answers.
- **Training it on non-YouTube text: Yes.** Enough legally usable text and models exist (tables below).
- **Running it on YouTube titles to decide what's learning: No under the literal reading of the guide** ("Infer or estimate the content category/type of a video or channel", section 0). **Partly** under the counter-reading: technically workable, accuracy on real Hinglish titles unmeasured. The III.L derived-metrics route (section 0) allows video tagging for audited *analytics* apps; whether a learning app qualifies is ❓ and must be asked in the audit.
- A classifier we train can still run cleanly on **our own text**: the user's goal, their search query, their mute phrases. That's where it can earn its keep even if video-level use is refused (e.g. "is this query an entertainment query?", "does this goal text show minor signals?", "is this query asking for leaked papers?").

**Best way (🔵):** build it small, cheap and swappable, and don't make the product depend on it.
1. **Base model:** a small multilingual encoder with a linear head. Start with `paraphrase-multilingual-MiniLM-L12-v2` (Apache 2.0) or `multilingual-e5-small/base` (MIT) as frozen embeddings + logistic regression. Step up to fine-tuning **MuRIL** (Apache 2.0) or **HingRoBERTa** (CC BY 4.0) if embeddings plateau.
2. **Training text:** synthetic titles from an **Apache-2.0 open-weight LLM** (e.g. gpt-oss-20b or a Qwen3 model), prompted with our syllabus topics (learning) and entertainment genres, in Devanagari, English and romanised Hinglish. YouTube-*style* noise (caps, emoji, "ONE SHOT", "Part 3") is written in by the prompt, never copied from YouTube. Mix in CC0 **IndicCorp v2** and **Wikipedia** sentences for vocabulary.
3. **Distillation:** the big LLM labels the synthetic and public text; the small model learns from those labels. Never distil on real YouTube titles: that would be training on API data.
4. **Transliteration augmentation:** run Devanagari samples through IndicXlit to make romanised copies, and the reverse (section 11).
5. **Calibrate** so "unsure" is common and shown, not hidden.

### Training text: what's legally usable

| Source | Licence | Usable for a commercial app? | Label |
|---|---|---|---|
| **Synthetic titles** from an Apache-2.0 open model (gpt-oss-20b, Qwen3 family) | Apache 2.0 on the model | **Yes, cleanest.** No third-party text, no YouTube input. | ✅ HF licence tags ([gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b), [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)); 🔵 on outputs |
| Synthetic from Llama models | Llama Community Licence | Yes, with attribution/naming conditions if you *distribute* a derived model | 🟡 |
| **IndicCorp v2** (AI4Bharat) | CC0: "All the datasets created as part of this work will be released under a CC-0 license" | Yes. Unlabelled news/web text. | ✅ [IndicBERT README](https://github.com/AI4Bharat/IndicBERT) |
| **Wikipedia** (Hindi, English) | CC BY-SA 4.0 | Yes for a model kept on our server. CC: BY and SA conditions "are triggered only when works or adaptations of works are publicly shared." Publishing the model would trigger SA. | ✅ [CC on AI training](https://creativecommons.org/using-cc-licensed-works-for-ai-training-2/) |
| **Sangraha** (AI4Bharat) | CC BY 4.0 | Probably yes; it's crawled web, so underlying copyright ❓ | ✅ HF tag |
| **Aksharantar** (transliteration pairs) | CC BY (manually collected part); mixed | Yes, for script augmentation | ✅ [dataset card](https://huggingface.co/datasets/ai4bharat/Aksharantar) |
| **COMI-LINGUA** (Hinglish, expert-annotated) | CC BY 4.0 | Yes, for code-mixed vocabulary; its tasks aren't ours | 🟡 [arXiv 2503.21670](https://arxiv.org/pdf/2503.21670) |
| IndicNLP News Article Classification (has an entertainment class) | CC BY-NC-SA 4.0 | **No** for a paid app. CC: NC covers "all stages, from copying the data during training to sharing the trained model." | ✅ [README](https://github.com/AI4Bharat/indicnlp_corpus) |
| NPTEL course material | CC BY-NC-SA (adopted 2012) | **No** for a paid app | 🟡 [CC OER case studies](https://wiki.creativecommons.org/wiki/OER_Case_Studies) |
| MIT OCW | CC BY-NC-SA | **No** for a paid app | 🟡 (not re-checked) |
| ICSI / ICMAI / NTA syllabus PDFs | Copyright of the bodies; no open licence found | Short topic names as prompts are probably fine ❓; don't train on full text without advice | ❓ |
| Course catalogue titles scraped from Coursera, Udemy etc. | Site terms usually ban scraping | Avoid | 🔵 |
| Text-and-data-mining exception in Indian copyright law | None explicit; *ANI v OpenAI* pending in the Delhi High Court | So CC terms apply in full in India | 🟡 (not re-checked this round) |

### Domain shift: non-YouTube text → real titles

🔵 The gap is large. Real titles are 5–15 words, full of emoji, caps, exam names, teacher names, "ONE SHOT", "Marathon", "Day 47", and mixed scripts. Wikipedia and news are long, formal and single-script. What helps:
- Synthetic data **in title style**, generated per field and language.
- **Channel-level evidence** (curated lists) covers most feed items, so the classifier sees mainly search results.
- **"Unsure → show"** makes domain-shift errors cost a little noise, not a hidden lecture.
- Evidence it's hard: romanised code-mixed input degrades even top LLMs. Indi-RomCoM (June 2026) reports Claude Opus 4.6 falling from 68.7% to 61.2% at 75% code-mixing, and Sarvam-30B from 64.2% to 56.1% 🟡 ([arXiv 2606.30790](https://arxiv.org/html/2606.30790)). The LLM that labels the distillation data inherits this weakness.

### Model choices

| Model | Licence | Size / speed (CPU) | Notes |
|---|---|---|---|
| paraphrase-multilingual-MiniLM-L12-v2 + head | Apache 2.0 ✅ | **Measured ~8 ms per title, ~220 ms per batch of 50** 🔵 (see 12) | Fastest; romanised Hindi quality ❓ |
| multilingual-e5-small / base + head | MIT ✅ | Not measured. **e5-large measured ~90 ms per title, ~3.1 s per 50** 🔵, too slow on CPU | Strong embeddings; also used for goal–topic matching (group B) |
| BGE-M3 + head | MIT ✅ | ~568M params; e5-large class or slower 🔵 | Built for long text; overkill for titles |
| MuRIL (fine-tuned) | Apache 2.0 ✅ | Base size | Paper shows "the efficacy of MuRIL in handling transliterated data" ✅ ([arXiv 2103.10730](https://arxiv.org/abs/2103.10730)) |
| IndicBERT v2 (fine-tuned) | MIT ✅ | Base size | 23 Indic languages; less romanised data than MuRIL ❓ |
| HingBERT / HingRoBERTa (L3Cube) | CC BY 4.0 ✅ | Base size | Trained on romanised Hinglish; best candidate for Hinglish-heavy titles ❓ |
| Qwen3-Embedding-0.6B + head | Apache 2.0 ✅ | 0.6B; probably too slow on CPU for 50 titles under 1 s 🔵 | Newer multilingual embedder |
| Open LLM zero-shot on Groq/Fireworks | per model | 0.2–0.6 s first token (research.md 17.3) | The teacher and the fallback; off the critical path |

### Evaluating without keeping titles longer than 30 days

🔵 Building on research.md s.16:
1. Keep **video IDs + our human labels** long-term (our data; the ID question ❓ as for bookmarks).
2. For each test run, **re-fetch** titles and descriptions with `videos.list` (1 unit per 50; 1,000 test IDs = 20 units). Delete the fetched text after the run.
3. Expect **attrition**: deleted, private or re-titled videos. Track it and top the set up with fresh samples each month.
4. Keep only **aggregate numbers** long-term (wrongly hidden, wrongly shown, per language and field). These describe *our* classifier, not YouTube videos.
5. Curators label by watching on youtube.com, so no API text needs storing.
6. Under the literal reading of section 0, even this test set "uses" API data to check an inference. If the audit refuses the classifier, the test set goes too.

**How competitors handle it:** none of the API-based study apps publish a classifier ❓. YouTube Educational Filter (extension) reads titles on youtube.com 🟡. Lightspeed keeps a video database 🟡, method not public.

**Sources:** in the tables above · ✅ [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide) · research.md s.5, 16, 17.5

**Risks:**
- Policy: **High** for video-level use (section 0).
- Technical: domain shift; synthetic data may teach the model the LLM's idea of a title, not real ones.
- Product: effort spent on a layer that may have to be switched off.

**Needs testing:** accuracy per language on re-fetched real titles; MiniLM vs e5-base vs MuRIL vs HingRoBERTa; how much style-noise in synthetic data closes the gap; share of results marked "unsure".

**Effort for a solo developer:** **High** (data generation, labelling, evaluation pipeline, calibration).

**Risk level:** **High** (policy) for video-level use; Low for use on our own text.

---

## 11. Hindi, English and Hinglish handled well

**Possible?** **Partly.** Search and playback are YouTube's, so all three work there already. What *we* add (goal parsing, mutes, any classifier, topic matching) can handle Devanagari and English well with existing open models. Romanised Hinglish is the weak spot for every model family, and there is no public benchmark for our exact task (short video titles, learning vs entertainment) ❓.

**Best way (🔵):**
1. **Normalise every text we match on:** Unicode NFC, strip emoji and decorative symbols, lower-case Latin, fold common romanisation variants ("padhe/padhein/padhen").
2. **Transliterate both ways with IndicXlit** (MIT ✅, [GitHub](https://github.com/AI4Bharat/IndicXlit); trained on Aksharantar ✅). Use it for mute expansion (7), for matching goal words against titles, and for synthetic training data (10a). Run it on *our* text (goal, query, mute phrases), not on titles, to stay clear of section 0.
3. **Pick models with romanised training:** MuRIL (paper reports "efficacy… in handling transliterated data" ✅) and L3Cube HingBERT/HingRoBERTa (CC BY 4.0 ✅) for encoders; for the LLM fallback and goal parser, test Qwen3-family models early. Indi-RomCoM reports "every model except the Qwen3 variants records a positive performance gap" (i.e. degrades) on romanised code-mixed input 🟡 ([arXiv 2606.30790](https://arxiv.org/html/2606.30790)).
4. **One search per query, not one per script.** Transliterating a query into three scripts triples the use of the 100-call search bucket. Use `relevanceLanguage=hi` or `en` from the user's setting instead. ✅ The docs warn "results in other languages will still be returned if they are highly relevant".
5. **Measure per language** on our own test set (10a), always split Devanagari / English / romanised Hinglish / mixed-script.

**Benchmarks to borrow tasks and test ideas from:**

| Benchmark | What it covers | Use for us | Label |
|---|---|---|---|
| **GLUECoS** | English–Hindi and English–Spanish code-switching: language ID, POS, NER, sentiment, QA, NLI | Picking an encoder for code-mixed text | ✅ [arXiv 2004.12376](https://arxiv.org/abs/2004.12376) (abstract) |
| **LinCE** | Centralised code-switching benchmark across language pairs (incl. Hindi–English) | Same | ✅ [arXiv 2005.04322](https://arxiv.org/abs/2005.04322) (abstract) |
| **Hindi-BEIR** | 15 datasets, 8 retrieval tasks, Hindi (Devanagari only) | Choosing an embedder for goal–topic matching (group B) | ✅ [arXiv 2408.09437](https://arxiv.org/abs/2408.09437) (abstract) |
| **Indi-RomCoM** (2026) | Romanised code-mixed instructions, 4 Indic languages, 19 LLMs | Choosing the LLM for parsing and fallback | 🟡 [arXiv 2606.30790](https://arxiv.org/html/2606.30790) |
| **COMI-LINGUA** | Expert-annotated Hinglish, several tasks, CC BY 4.0 | Code-mixed vocabulary; LID | 🟡 [arXiv 2503.21670](https://arxiv.org/pdf/2503.21670) |
| Learning-vs-entertainment on Indian YouTube titles | — | — | ❓ None found (research.md 17.5 found none either) |

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Transliterate everything to one script, then one model | Simple | Transliteration errors compound; loses English words inside Hinglish |
| Multilingual model on raw text (recommended, plus normalisation) | No pipeline errors | Romanised Hindi weaker ❓ |
| Separate model per language | Best per-language accuracy | Mixed titles don't fit one bucket; more upkeep |

**How competitors handle it:** none of the study apps state any Hindi/Hinglish handling 🟡 (research.md s.2 "Gaps"). YouTube's Restricted Mode page says quality "may vary" across languages "due to differences in cultural norms and sensitivities" ✅ ([Help](https://support.google.com/youtube/answer/174084?hl=en)).

**Sources:** as in the table · ✅ [search.list `relevanceLanguage`](https://developers.google.com/youtube/v3/docs/search/list)

**Risks:** Technical: romanised Hinglish degrades every model. Product: a filter good on English and weak on Hinglish fails the main users quietly. Legal: none specific.

**Needs testing:** per-language error rates on real, re-fetched titles; IndicXlit quality on exam jargon ("CS Executive", "costing", "Laxmikanth"); which LLM parses Hinglish goals best.

**Effort for a solo developer:** Medium.

**Risk level:** Medium (product).

---

## 12. Results in 1–2 seconds

**Possible?** **Yes, very likely**, if the LLM stays off the critical path. The floor is two sequential YouTube calls (`search.list` for IDs, then `videos.list` for the safety fields), because we can't show a result before we know it isn't age-restricted or blocked.

### What I could measure or find

| Step | Number | Label |
|---|---|---|
| Network round trip to `www.googleapis.com/youtube/v3/search` from this laptop (India), unauthenticated, so the server returned 403 at once | 0.10–0.30 s per call (5 tries: 0.18, 0.11, 0.30, 0.10, 0.17 s) | 🔵 measured 2026-09-26; a **lower bound** only, no search work was done |
| Real `search.list` / `videos.list` server time | No published measurement found | ❓ Google only says `part`/`fields` reduce latency and that ETag-conditional requests make the API respond "more quickly" ✅ ([getting started](https://developers.google.com/youtube/v3/getting-started)) |
| Local embedding, `paraphrase-multilingual-MiniLM-L12-v2`, ONNX (fastembed 0.8.1), 4 threads, AMD Zen 4 laptop | **~8 ms per title; ~220 ms for 50 titles** | 🔵 measured on synthetic titles I wrote (no YouTube data) |
| Local embedding, `multilingual-e5-large`, same setup | ~90 ms per title; **~3.1 s for 50 titles** | 🔵 measured; too slow for the critical path on CPU |
| Hosted LLM first token | Groq < 200 ms; Gemini Flash < 300 ms; Claude Haiku 4.5 ~600 ms | 🟡 research.md 17.3 |
| gpt-oss-safeguard-20b on Groq | "1000 tokens/second", preview only | ✅ [Groq models](https://console.groq.com/docs/models) |

🔵 A cheap cloud vCPU may be 2–4× slower than this laptop; int8 quantisation usually wins most of that back. Test on the real server.

### Estimated budget for an uncached search (🔵)

| Step | Estimate |
|---|---|
| Our server receives query, checks cache | ~50 ms |
| `search.list` (25–50 results) | 0.3–0.8 s ❓ |
| `videos.list` for those IDs (1 call, ≤ 50 IDs) | 0.2–0.5 s ❓ |
| Field filters + mutes (+ small classifier if allowed) | 10–250 ms |
| Response to phone | 0.1–0.3 s (mobile network) |
| **Total** | **~0.7–1.9 s** |

Thumbnails load after, from YouTube's image servers. The player's own start time is group C's question.

### Caching within the 30-day rule

- **Shared cache of search results** keyed by normalised query + language + mode, kept hours to days, never past 30 days (III.E.4.d ✅). Popular exam queries repeat across users, so this also saves search quota. "Limited amounts" ✅ caps its size: keep it small and short-lived.
- **Per-video cache** of `videos.list` fields (duration, `ytAgeRestricted`, `embeddable`, `topicCategories`) ≤ 30 days, refreshed with ETags. That turns most searches into one API call.
- **Labels:** cache only if section 0 allows labels at all. Under III.L tags could be stored up to 36 months, but only for approved analytics use.
- **The LLM never blocks the screen:** "unsure" items are shown, sent to the LLM in the background, and the answer is used next time (research.md 17.5). If section 0 rules out video labels, this step disappears and speed gets easier.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Two API calls, local rules only (recommended) | Within budget; policy-clean | No semantic judgement |
| Plus small local classifier | +10–250 ms | Section 0 |
| LLM in the critical path | Best judgement | +0.2–0.6 s first token plus output; misses 1 s often |
| Stream results (show fields-filtered items as they're checked) | Feels faster | More client code |

**How competitors handle it:** no competitor publishes latency ❓.

**Sources:** ✅ [getting started](https://developers.google.com/youtube/v3/getting-started) · ✅ [Developer Policies III.E.4](https://developers.google.com/youtube/terms/developer-policies) · ✅ [Groq models](https://console.groq.com/docs/models) · research.md 17.3, 17.5

**Risks:** Technical: real API server time unmeasured; Indian mobile networks vary widely. Policy: cache size vs "limited amounts".

**Needs testing:** real p50/p95 of `search.list` and `videos.list` with a key from an Indian server region; model latency on the target server; cache hit rate for the four fields.

**Effort for a solo developer:** Low–Medium.

**Risk level:** Low.

---

## 13. Safety against all harmful content

**Possible?** **Partly.** No one blocks *all* harmful content; YouTube says of its own Kids app that "no automated system of filters is perfect" ✅. We can stack YouTube's own signals, which are clearly allowed, and add query-side and user-visible rules. Our own video-level safety classifier runs straight into the guide's "Make any claims on whether a video or channel is safe or suitable to watch" (section 0). The III.L route covers only *advertiser* brand safety, not viewer safety ✅, so there's no documented permission for it.

### What YouTube's own signals give

| Signal | What it does | Limits | Label |
|---|---|---|---|
| `safeSearch=strict` on `search.list` | "YouTube will try to exclude all restricted content from the search result set." | Best effort; search only, not playlists or channel uploads | ✅ [search.list](https://developers.google.com/youtube/v3/docs/search/list) |
| `contentDetails.contentRating.ytRating = ytAgeRestricted` | Marks age-restricted videos; these "cannot be watched on most third-party websites" and send the viewer to YouTube | Only what YouTube has age-restricted | ✅ [videos](https://developers.google.com/youtube/v3/docs/videos), ✅ [Help](https://support.google.com/youtube/answer/2802167?hl=en) |
| `status.madeForKids` | Child-directed status | Not a safety signal for adults; it triggers III.E.4.j tracking rules | ✅ |
| `status.embeddable`, `regionRestriction` | Playability | Not safety, but removes dead ends | ✅ |
| `topicDetails.topicCategories` | Coarse topics | No "harmful" topic | ✅ |
| **Restricted Mode** | Hides "potentially mature content" using "video title, description, metadata, Community Guidelines reviews, and age restrictions"; excludes drugs/alcohol talk, sexual detail, graphic violence, mature subjects, profanity, incendiary content | Quality "may vary" by language | ✅ [174084](https://support.google.com/youtube/answer/174084?hl=en), [7354993](https://support.google.com/youtube/answer/7354993?hl=en) |
| YouTube's Community Guidelines removals | Removes much of the worst content before we see it | Scams and misinformation still get through; the "paper leak" genre persists | 🔵 |

### Does Restricted Mode apply to embeds or the API?

- **Embeds: yes at network level, not from our code.** Network admins apply it by DNS CNAME (`restrict.youtube.com` / `restrictmoderate.youtube.com`) or the header `YouTube-Restrict: Strict|Moderate` on "www.youtube.com, m.youtube.com, youtubei.googleapis.com, youtube.googleapis.com, www.youtube-nocookie.com" ✅ ([Workspace Help](https://support.google.com/a/answer/6214622?hl=en)). Embeds load from `www.youtube.com/embed` or `www.youtube-nocookie.com`, so on such a network they're covered 🔵.
- **No player parameter turns it on.** The IFrame player parameters page has no restricted/safe option ✅ (searched the raw [player parameters page](https://developers.google.com/youtube/player_parameters)). An app can't switch Restricted Mode on for its own embeds in a documented way.
- **API:** the Data API documents only `safeSearch` on `search.list` ✅. Whether the network header changes API responses is undocumented ❓. Injecting that header from our app's WebView or server would be an undocumented trick; I'd treat it as out of bounds (the guide bans overriding player behaviour) 🔵.
- Per-browser Restricted Mode set by the user on youtube.com doesn't carry into our embeds in any documented way ❓.

### Open safety classifiers and Hindi/Hinglish

All of these were built to check chat prompts and LLM replies, not video titles 🔵. None reports romanised Hinglish results ❓.

| Model | Languages | Licence | Notes | Label |
|---|---|---|---|---|
| **Llama Guard 3 8B** | 8 incl. **Hindi** | Llama 3.1 Community | Hindi F1 0.871, FPR 0.050. 14 categories incl. Hate, Suicide & Self-Harm, Sexual Content, Specialized Advice | ✅ [HF card](https://huggingface.co/meta-llama/Llama-Guard-3-8B) |
| **ShieldGemma** (2B/9B/27B) | **English only** | Gemma | Sexual, dangerous, hate, harassment | ✅ [HF card](https://huggingface.co/google/shieldgemma-2b) |
| **Qwen3Guard** (0.6B/4B/8B; Gen and Stream) | 119 languages and dialects | Apache 2.0 | Safe / controversial / unsafe tiers; 0.6B small enough for cheap hosting | ✅ licence (HF API), 🟡 features ([GitHub](https://github.com/QwenLM/Qwen3Guard)) |
| **Nemotron Safety Guard 8B v3** (NVIDIA) | 9 incl. **Hindi**, zero-shot to 20+ | NVIDIA Open Model License + Llama 3.1 terms | 23 categories incl. **Fraud**, **Misinformation**, Self-Harm, Hate. Built with CultureGuard for cultural fit | ✅ [HF card](https://huggingface.co/nvidia/Llama-3.1-Nemotron-Safety-Guard-8B-v3), ✅ [CultureGuard abstract](https://arxiv.org/abs/2508.01710) |
| **gpt-oss-safeguard** (20B/120B) | Not stated | Apache 2.0 | Reads **our own written policy** at run time, so "exam paper-leak scams" can be defined without training data. On Groq as preview ($0.075/$0.30 per M tokens; "evaluation purposes only") | ✅ [HF card](https://huggingface.co/openai/gpt-oss-safeguard-20b), ✅ [Groq](https://console.groq.com/docs/models) |
| **IndicGuard** (L3Cube, on Gemma-3-4B) | 10 Indic languages + English, native scripts | ❓ not stated clearly | ~+0.056 macro F1 over CultureGuard; no romanised evaluation | 🟡 [arXiv 2606.22841](https://arxiv.org/html/2606.22841v1) |

🟡 An English-only 2026 benchmark of 14 open guard models found Qwen Guard 4B had the best recall (83.97%). gpt-oss-safeguard 20B missed 75% and Llama Guard 67% of unsafe content despite high precision ([arXiv 2605.28830](https://arxiv.org/html/2605.28830v1)). For a filter where missing harm matters more than a false alarm, recall is the number to watch.

### Exam scams ("paper leak") and medical misinformation

🔵 Both are hard to judge from titles, and a video-level verdict is exactly what section 0 warns against. The strongest clean lever is the **query**, which is our data: people find leak videos mostly by searching for them.

| Harm | Clean approach (🔵) | With a classifier (if ever allowed) |
|---|---|---|
| **Paper-leak / "guaranteed questions" scams** | (1) Query check on our side: "neet paper leak 2027", "leaked paper pdf" → don't run the search; show a short notice pointing to the official exam body. (2) A visible, editable default keyword mute list ("paper leak", "leaked paper", "पेपर लीक", "guaranteed questions"), shown to the user in settings. (3) NEET/CS/CMA feeds from curated channels. (4) A "Report on YouTube" link (opens YouTube, as the guide requires). | gpt-oss-safeguard with a written "exam-scam" policy; Nemotron "Fraud" category |
| **Medical misinformation** (NEET, health) | Curated channels for NEET; query check for high-risk health queries ("cure diabetes in 7 days") → notice + no search; keep `safeSearch=strict` | Nemotron "Misinformation"; LLM check against a written policy. Titles rarely reveal misinformation; the claims are inside the video ❓ |
| **Self-harm** | Query check → show an Indian helpline (e.g. Tele-MANAS 14416 🟡, not re-checked) instead of results; YouTube's `safeSearch` and age restriction do the rest | Llama Guard 3 "Suicide & Self-Harm" (Hindi supported) |
| **Adult, dangerous acts, hate** | `safeSearch=strict` + drop `ytAgeRestricted` everywhere + curated feeds | Qwen3Guard / Llama Guard 3 |

Scam and misinformation *laws* (e.g. the Public Examinations (Prevention of Unfair Means) Act 2024) weren't re-checked this round 🟡.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| YouTube signals + query checks + visible keyword rules + curated feeds (recommended) | Policy-clean; query checks are fast and our data | Misses harmful videos with innocent titles |
| Plus open guard model on titles | Catches more | Guide: "claims… safe or suitable to watch"; built for chat, not titles; Hinglish unmeasured |
| Approved-content-only mode (like YouTube Kids) | Safest | Closed world; fails expectation 2 |

**How competitors handle it:**
- **YouTube Kids** ✅: automated filters + human review sampling + user flags; parents can choose "approved content only"; "no automated system of filters is perfect".
- **Lightspeed / GoGuardian** 🟡: a categorised video database plus allow/block lists; GoGuardian also enforces Restricted Mode at network level ([GoGuardian](https://support.goguardian.com/s/article/Best-Practices-Advanced-YouTube-Filtering-Tips-1629765148557)).
- **Unhook** ✅: no safety filtering; hides UI only.
- **StudyTube (app)** 🟡: no published safety approach.

**Sources:** as in the tables · ✅ [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide) · ✅ [derived-metrics policy](https://developers.google.com/youtube/terms/derived-metrics-policy) · ✅ [YouTube Kids](https://www.youtube.com/intl/ALL_in/kids/safer-experience/)

**Risks:**
- Legal/policy: a video-level safety verdict is the plainest conflict with the guide; no documented route for viewer safety.
- Product: the mission promises "no harmful content"; the honest promise is "we use YouTube's strictest settings and our own rules, and you can report what slips through". The one-line disclosure should say that, not "safe".
- Technical: guard models aren't built for titles; romanised Hinglish untested.
- Escape: player links open the YouTube app ✅, where none of our rules apply.

**Needs testing:** how many harmful videos in the four fields survive `safeSearch=strict` + age filter; how often paper-leak videos appear for normal NEET/CS queries (vs only when searched for); whether query checks catch most leak-seeking searches; guard model recall on Hinglish titles, *only* if section 0 is resolved.

**Effort for a solo developer:** Medium (signals and query checks are easy; curation and test sets take time).

**Risk level:** **High** (harm to users plus policy tension); Medium with the clean stack only.

---

---

# Group: Goal engine, recommendations and behaviour design

Research only. Labels: ✅ read in a primary source; 🟡 secondary or unchecked summary; 🔵 my reasoning; ❓ unknown.

---

## 3. Goal engine for any field, with a "Did you mean" tap only when truly ambiguous

**Possible?** Yes. Nothing in YouTube's rules or Indian law touches goal parsing: the goal text, the parsed goal and the topic map are the app's own data, not API data (🔵). The hard part is accuracy on niche Indian exams and Hinglish, not permission.

**Best way:** a pipeline that behaves like a search engine's query understanding, not like a chatbot.

1. **Parse into a fixed schema.** An LLM turns the typed goal into fields: `field`, `body` (ICSI, ICMAI, NTA…), `exam`, `level`, `paper/subject`, `language`, `minor_signals`, plus 1–3 ranked *interpretations* with a confidence each. Use strict JSON-schema output so the result always parses. Groq's docs say strict mode "uses constrained decoding to guarantee that the output will always match your schema exactly" (✅ [Groq structured outputs](https://console.groq.com/docs/structured-outputs); supported on a few open models only, e.g. GPT-OSS 20B/120B and a Qwen model, so this narrows the model choice).
2. **Link to a goal registry, not a hardcoded list.** Keep a growing table of known goal entities (exam body → exam → level → paper) that the app builds itself: the LLM proposes an entity, the app checks it against the registry, and new entities are added once grounded in an official document. This is the standard modern entity-linking pattern: retrieve candidates (BM25 or embeddings), then let an LLM pick, including "none of these" (🟡 [LELA, arXiv 2601.05192](https://arxiv.org/pdf/2601.05192); [OneNet, EMNLP 2024](https://aclanthology.org/2024.emnlp-main.756.pdf); [LLMAEL, arXiv 2407.04020](https://arxiv.org/pdf/2407.04020)). Every new goal typed by a user enriches the registry, so "CMA Inter costing" and "CMA intermediate paper 8" collapse to one entity for everyone after the first time. 🔵 The registry is not an "exam list" in the sense you ruled out: nobody hand-codes it and any goal can enter it.
3. **Ground the topic map in the official syllabus (retrieval, not memory).** Fetch the exam body's syllabus document and extract topics from it. LLMs planning learning paths without grounding invent units (🟡 [PersonaPath](https://arxiv.org/html/2609.18861), already in research.md 18.2). Syllabi exist for your test fields: ICSI Syllabus 2022 (still applied to the June 2026 session, 🟡 [Careers360](https://www.careers360.com/commerce/articles/cs-executive-2026-syllabus)), ICMAI Syllabus 2022 (✅ in research.md), NMC's NEET-UG syllabus, unchanged for 2026 and published on nmc.org.in / nta.ac.in (🟡 [Shiksha](https://www.shiksha.com/news/medicine-health-sciences-neet-2026-syllabus-by-nta-out-nta-ac-in-download-official-nta-neet-syllabus-pdf-here-blogId-218404)). For "AI", which has no exam body, the closest public outline is the ACM/IEEE-CS/AAAI **CS2023** curriculum, which has an AI knowledge area (✅ [csed.acm.org](https://csed.acm.org/)). 🔵 Store a **syllabus version and date** with every topic map; syllabi change (ICSI has been reported to be revising its structure, ❓ unconfirmed on icsi.edu).
4. **Decide whether to ask.** Ask only when two interpretations are close *and* both are plausible for this user. Otherwise pick the top one and show it with a one-tap switch.

**How search engines decide when to ask (evidence):**

| Finding | Why it matters here | Label |
|---|---|---|
| About 7–23% of web queries are ambiguous; a trained classifier identified ambiguous queries correctly 87% of the time (Song et al., WWW 2007). | Most goals won't need a question. Ambiguity is detectable. | 🟡 [dblp](https://dblp.org/rec/conf/www/SongLWYH07.html), [MSR](https://www.microsoft.com/en-us/research/publication/identifying-ambiguous-queries-in-web-search/) (abstract only) |
| Bing clarification panes, large-scale real user logs: panes for **faceted** queries got ~100% more clicks than panes for **ambiguous** queries (relative engagement 1.52 vs 0.70). For ambiguous queries, one intent usually dominates the first position. Natural-language queries engaged 58% above average. | When one meaning dominates, *don't ask*: just pick it. A question is most welcome when the user wants to narrow (which paper? which level?), not when they typed an obvious term. | ✅ [Zamani et al., SIGIR 2020](https://www.microsoft.com/en-us/research/wp-content/uploads/2020/05/SIGIR_2020___Analyzing_Clarification_in_Web_Search.pdf) (read the PDF text) |
| Bing's clarifying questions were built from templates plus candidate answers the user taps (not typed answers). | Matches your "one tap, never a form". | ✅ [Zamani et al., WWW 2020](https://dl.acm.org/doi/10.1145/3366423.3380126) (abstract) |
| LLMs are poor at *judging* ambiguity: ChatGPT reached ~54% accuracy on the CLAMBER benchmark; Llama2-70B tended to over-flag queries as ambiguous. | Don't let the LLM alone decide to ask. Use a score (see below). | 🟡 [CLAMBER, ACL 2024](https://aclanthology.org/2024.acl-long.578.pdf) |
| LLMs "often identify ambiguity when explicitly asked to judge it, yet… overwhelmingly default to direct answers"; retrieved context makes them ask even less. | Same point from the other side: make "is this ambiguous?" an explicit step, separate from parsing. | ✅ [Su & Cardie, arXiv 2605.25284](https://arxiv.org/abs/2605.25284) (abstract) |
| Sampling several LLM parses and checking whether they agree is one proposed ambiguity signal. | A cheap, model-agnostic score. | 🟡 [arXiv 2505.11679](https://arxiv.org/pdf/2505.11679) |

**How Google and YouTube show it:** Google says 1 in 10 queries is misspelled and its "Did you mean" runs a neural speller "in under 3 milliseconds" (✅ [Google blog, Oct 2020](https://blog.google/products/search/search-on/)). Visible behaviour (🔵 observed, not documented): when confident, Google and YouTube **auto-correct** and show "Showing results for X · Search instead for Y"; when less confident they keep your query and add "Did you mean X?". Google's approach relies on logs: many users typing A and then clicking results for B (🟡 [SEO by the Sea on Google patents](https://www.seobythesea.com/2007/02/when-google-thinks-youve-misspelled-a-business-name-spell-corrections-and-query-refinements/)). I found no official YouTube Help page describing its rules ❓.

🔵 **Translated into your app, three tiers:**

| Situation | What the app does |
|---|---|
| One reading dominates (context settles it: "CS ESG paper" → Company Secretary) | Just build the feed. No tap. |
| Top reading likely but not certain | Build the feed for it and show one quiet line: "Showing **CS (Company Secretary)** · Switch to Computer Science". Same as Google's "Showing results for". |
| Two readings close, no context | One-tap choice before the feed: two or three chips. Never a form. |

The thresholds come from your own data over time: pooled choices ("87% of people typing 'CS' picked Company Secretary") play the role Google's logs play. This is your data, not YouTube's.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **LLM parse + registry + ambiguity score (recommended)** | Handles any field; learns; one tap only when needed | Most moving parts; needs a test set of real goals |
| LLM parse only, ask whenever the LLM says "ambiguous" | Simplest | LLMs misjudge ambiguity (CLAMBER); either nags or never asks |
| Fixed exam picker (SyncStudy/PW style) | Accurate, fast | Contradicts "any goal"; you ruled it out |
| Always ask 2–3 onboarding questions | Reliable parse | Breaks "the user never does extra work" |
| Free-text intent box used directly for ranking (Bonsai style) | Very flexible | Bonsai users found it more effort than expected (research.md 12) |

**How competitors handle it:** SyncStudy offers syllabus templates for a few exams (JEE, NEET, UPSC, CBSE) (🟡 research.md 2). PW and Unacademy use fixed batch/exam catalogues (🔵). YouTube has no goal concept; it corrects and expands the query per search. I found no study app that parses a free-text goal into a syllabus map ❓.

**Risks:**
- Policy: matching videos to syllabus topics is close to the guide's "Infer or estimate the content category/type of a video" line. Rank at request time by similarity to the user's goal text; don't store topic labels per video. See "Policy check" below.
- Legal: low. Minor signals in goal text ("Class 11", "NEET 2028") must trigger the age re-check already decided. Keep the syllabus extraction as topic names and structure, not copied text, to stay clear of copyright questions ❓.
- Technical: syllabus PDFs are often scanned or badly structured; extraction errors flow straight into the feed. Hinglish goals ("cma inter ka costing") untested.
- Product: a wrong silent guess is worse than one tap. The "Showing X · Switch" line limits the damage.

**Needs testing:** a set of 100–200 real goals typed by test users (not invented ones): parse accuracy per field; how often each tier fires; whether the agreement-across-samples score predicts real ambiguity; syllabus extraction quality on ICSI/ICMAI/NMC PDFs.

**Effort for a solo developer:** Medium. The LLM call is easy; the registry, syllabus ingestion and the test set take the time.

**Risk level:** Medium (accuracy on niche exams, not policy).

---

## 4. A personal feed that learns what helps (enrichment, not engagement), 18+ only

**Possible?** Partly. Learning from your own users' deliberate actions is allowed and well supported by research. What is *not* yet shown anywhere is that silent signals alone (without per-video ratings) can separate "useful" from "tempting" well enough. That is an open research question, and only your own data can answer it.

**Best way:** treat **costly, deliberate actions** as the enrichment signal and **cheap actions** (tap, watch time) as mostly temptation, then rank by expected enrichment inside the goal gate (research.md 13A, options 1 + 3).

Why this split has support:

| Work | Finding | Label |
|---|---|---|
| **Anwar, Dhillon, Schoenebeck**, RecSys 2025 | Clicks reveal temptation, ratings reveal enrichment; recommend by expected enrichment. Simulations only. | ✅ (research.md 12) |
| **Milli, Pierson, Garg**, "Choosing the Right Weights" (2023) | Most feeds score items as a weighted sum of behaviours. Users are better served by up-weighting behaviours that are **value-faithful** and **less noisy**. Applied to ~70 million URLs on Facebook, the user-optimal weights gave higher user value and less misinformation. | 🟡 [arXiv 2305.17428](https://arxiv.org/pdf/2305.17428) (abstract) |
| **Shirali**, "The Burden of Interactive Alignment with Inconsistent Preferences" (NeurIPS 2025) | Short-sighted users train an engagement algorithm toward what they don't want. **Small costly signals** (e.g. an extra click) shorten how far ahead a user must think for the algorithm to align with their real goals. | 🟡 [arXiv 2510.16368](https://arxiv.org/abs/2510.16368) (abstract) |
| **Agarwal et al.**, "System-2 Recommenders" (FAccT 2024) | Separates return visits driven by lasting utility from impulse-driven returns. Synthetic data only. | 🟡 [arXiv 2406.01611](https://arxiv.org/abs/2406.01611) |
| **Besbes, Kanoria, Kumar**, "The Fault in Our Recommendations" (RecSys 2024) | Optimising engagement alone causes large utility losses; mixing in exploration costs little engagement. | 🟡 [arXiv 2405.03948](https://arxiv.org/abs/2405.03948) |
| **Zou et al.**, "Hesitation and Tolerance" (CHI 2026; surveys of 6,644 and 3,864 users) | "Clicking without purchase or shallow viewing" is often **tolerance**, not interest, and predicts *lower* later activity. | 🟡 [arXiv 2412.09950](https://arxiv.org/abs/2412.09950) |
| **Stray et al.**, "Building Human Values into Recommender Systems" (ACM TORS 2024, 21 authors incl. industry) | Names "non-behavioral algorithmic feedback" and "optimization for long-term outcomes" as open problems. | ✅ [arXiv 2207.10192](https://arxiv.org/abs/2207.10192) |
| **YouTube** (2021) and **Kuaishou** (EASQ, 2026) | Both big platforms rely on **sparse surveys** as the ground truth and train a model to predict them for everyone. Kuaishou reports it in production. | 🟡 [YouTube blog](https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/), [arXiv 2601.20215](https://arxiv.org/abs/2601.20215) |
| **Claypool et al.** (IUI 2001, 80+ users) | Time on page plus scrolling correlated with explicit interest; clicks alone did not. | 🟡 [WPI](http://web.cs.wpi.edu/~claypool/papers/iii/) |

🔵 **Reading across these:** nobody has published a system that learns enrichment with *no* explicit signal at all. The big platforms still use surveys. Your design has one explicit signal (the optional "Was today's time useful?") plus deliberate actions. That is closer to the research than pure behaviour, but thinner than YouTube's per-video surveys.

**Practical signal scheme (🔵):**

| Signal | Likely meaning | Weight idea | Pitfall |
|---|---|---|---|
| Note taken at a timestamp | Strong enrichment | High | Only some users take notes |
| Timestamp bookmark | Enrichment (wants to return) | High | Also used for "watch later" (intent, not value) |
| "Mark as studied" | Enrichment + progress | High | Some users tick everything |
| Finished a playlist item, then opened the next one in the series | Enrichment | Medium–high | Autoplay-like drift if the series is weak |
| "I need this" on a hidden result | Filter was wrong; item is relevant | High for relevance, neutral for quality | — |
| Rewatch / seek back within a lecture | Studying | Medium | Needs player events (IFrame API gives state changes, not detailed seeks ❓) |
| Watched to the end, no other action | Ambiguous (could be temptation) | Low | Research above: watch time is a poor proxy |
| Tapped, left within ~30 s | Mismatch or tolerance | Negative, small | Could be "I already know this" |
| Mute | Hard rule | Excludes | Already decided |
| **"Was today's time useful?"** (session-level, optional) | Ground truth for the whole session | Used to **calibrate** the weights above, not to score single videos | One answer covers many videos; needs care (🔵 treat as a session label shared across its items) |

Then: expected enrichment of an unseen item = pooled signals from same-goal users + content match to the user's topic map + the user's own history. Temptation proxy = items or categories often opened but rarely followed by a costly signal. Show these lower, never hide them (hiding is the user's rule, not the model's).

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **Costly signals + session check (recommended)** | Fits "almost no questions"; research-aligned | Sparse; unproven without per-video ratings |
| Add rare sampled per-video "Did this help?" (YouTube's method) | Best ground truth | You ruled out per-video questions; revisit if signals prove too thin |
| Watch-time/click ranking inside the goal gate | Dense data | Learns temptation (research.md 13A option 5) |
| No behaviour learning; rules + pooled signals only | Simple, same for minors | Less personal |

**How competitors handle it:** YouTube uses surveys + a model predicting them (🟡). StudyTube, LearnTube and SyncStudy show no sign of a learned feed: they are search, playlists and planners (🟡 from store listings and blogs, research.md 2). Unhook removes the feed entirely. I found no study app that ranks by learned enrichment ❓.

**Sources:** in the table above.

**Risks:**
- Legal: behaviour layer needs a **separate DPDP consent purpose** (lawyer item already listed). Off for minors, switchable for adults (decided).
- Policy: never turn signals into a **channel-level** score; the guide bans estimating "viewer satisfaction or dissatisfaction with a particular YouTube channel" (see "Policy check" below).
- Policy: the signals are your users' own actions, so they are your data; but each is keyed to a video ID. A per-video "enrichment score" built from *your* signals is, in my reading, not "derived from API data" (🔵); still record this in the audit notes. Never show it as a number next to YouTube data (III.E.4.h second part).
- Product: sparse signals in niche fields; power users dominate pooled scores; the model may "learn" that motivational videos are useful because users bookmark them.

**Needs testing:** do note/bookmark/studied rates correlate with the session "useful?" answer? What share of users produce any costly signal in week 1? Does ranking by these signals change what people finish?

**Effort for a solo developer:** Medium. Logging and a weighted score are simple; knowing whether it works needs an evaluation setup.

**Risk level:** Medium (product risk: signals may be too thin).

---

## 5. Suggestions better than YouTube's, with a separate "related useful videos" section

**Possible?** Partly. A separate, labelled "what next" section built from cheap API calls and your own data is allowed and workable on default quota. "Better than YouTube" is possible for **on-goal lectures** (series order, syllabus order, what same-goal users found useful), but not for breadth: YouTube's related list draws on billions of sessions and all of YouTube, and you can't match that with 100 searches a day. Say "more useful for study", not "better than YouTube" in general.

**Checks on the mechanics (✅ from the raw API docs, downloaded and searched):**
- `search.list`: "Quota impact: 100 calls per day. A call to this method has a quota cost of 1 unit in the Search Queries quota bucket." ([docs](https://developers.google.com/youtube/v3/docs/search/list))
- `playlistItems.list` has an optional `videoId` parameter: "the request should return only the playlist items that contain the specified video." 1 unit per call. So "is this lecture in playlist P, and at what position?" costs **1 unit per playlist checked**. ([docs](https://developers.google.com/youtube/v3/docs/playlistItems/list))
- `playlists.list` with `channelId` returns a channel's playlists, up to 50 per call, 1 unit. ([docs](https://developers.google.com/youtube/v3/docs/playlists/list))
- `relatedToVideoId` is gone (research.md 17.6, ✅).

**Best way:** a ranked cascade, cheapest and most on-goal first. Each source fills slots until the section has 5–8 items (🔵).

| # | Source | How (🔵 detail) | Quota | Why it ranks here |
|---|---|---|---|---|
| 1 | **Where the user came from** | If they opened the video from a playlist, the next item *is* the next lecture. | 0 extra | The teacher's own order. YouTube also does this inside playlists. |
| 2 | **Teacher's series** | `playlists.list(channelId)` → keep playlists whose titles match the video's topic words → `playlistItems.list(playlistId, videoId)` on those few to find position → fetch the next 3–5 items. | ~2–6 units | Solves "Lecture 7 → Lecture 8" for search arrivals. Cache the channel's playlist map ≤ 30 days and share it across users. |
| 3 | **Description links** | Parse playlist/video links already in `snippet.description`; drop promo links (courses, Telegram, apps) with simple rules. | 0 | Creator's own suggestions. |
| 4 | **Syllabus map: next topic** | From the user's topic map, find the next unstudied topic; pull candidates from curated channels' uploads matched by embedding (research.md 18.2 stage 5). | 1 unit per 50 uploads | Something YouTube can't do: it knows nothing about ICMAI Paper 8's order. |
| 5 | **Same-goal users' signals** | "People with this goal who marked X studied also found Y useful" (co-occurrence of costly signals, your data). | 0 | This is YouTube's own 2010 method (**co-visitation** counts within 24-hour sessions, 🟡 [Davidson et al., RecSys 2010](https://dl.acm.org/doi/10.1145/1864708.1864770)), but counting *studied/noted* instead of *watched*. Needs users first. |
| 6 | **Keyword search** | `search.list` with terms from title/chapters, `safeSearch=strict`, shared cache across users | 100/day bucket | Only when 1–5 come back thin. |

Then apply the fixed rules (safety, age-restricted/non-embeddable/region filters) and the user's mutes, and order by expected enrichment (section 4).

**Policy points (🔵 unless marked):**
- **III.C:** keep "More on this topic" visibly separate from search results. These are YouTube videos, but separation removes any "modified search results" reading.
- **30-day rule:** a playlist map or a channel's upload list is API data. Cache ≤ 30 days, and keep it "limited" (only channels users actually touch).
- **III.E.4.h:** the co-occurrence counts come from *your users' actions*, keyed by video ID. My reading: your data, not data derived from API data. No numbers or scores shown next to YouTube content. ❓ Same open question as research.md 16 ("our data tied to video IDs").
- **III.I.1 independent value:** syllabus- and series-aware "what next" is exactly the kind of value to describe in the audit.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **Cascade above (recommended)** | Cheap; on-goal; works on default quota | More code paths; weak for videos not in any playlist |
| Keyword search only | Simple | Burns the scarce search bucket; generic results |
| LLM writes "next topic" queries, then search | Good queries | Same quota problem; LLM on the path adds latency |
| Curated "next" lists by humans | Highest quality | Doesn't scale beyond the 4 test fields |
| No related section (SyncStudy's choice) | Zero cost; zero distraction | Loses a key reason to stay in the app instead of YouTube |

**How competitors handle it:**

| Product | "Next video" approach | Label |
|---|---|---|
| **SyncStudy** | Follows the imported playlist's order; "Zero recommendations"; pre-loaded syllabus trackers for JEE/NEET/UPSC. No algorithmic next. | ✅ [syncstudy.in](https://www.syncstudy.in/) |
| **StudyTube** (The CodeFuel) | Search, saved videos, own playlists, progress, planner, app blocker. No related/next feature listed. 50K+ downloads, 4.2★ (1.13K reviews), updated 11 Sept 2026. | ✅ [Play Store](https://play.google.com/store/apps/details?id=com.thecodefuel.studytube&hl=en_US) |
| **LearnTube India** | Search or paste a link; "AI-driven daily and weekly study roadmaps". Doesn't say how it picks videos ❓. | ✅ [learntubeindia.in](https://learntubeindia.in/) |
| **YouTube** | Related list from co-visitation (2010) and later deep candidate-generation/ranking models trained on watch behaviour; valued watch time from surveys (2021). | 🟡 Davidson 2010; YouTube blog (research.md 12) |

🔵 So none of the study apps offers a "related useful videos" section at all. They either follow a playlist or remove suggestions. That is a real gap.

**Risks:**
- Legal/policy: low–medium (the video-ID question above, plus the guide's category-inference and "merge or combine" lines; see "Policy check" below). The player's own end-of-video related links can't be blocked and open YouTube.
- Technical: many Indian lecture videos live in several playlists (full course, one-shot, revision); picking the right one needs rules. Channels with 500+ playlists make step 2 costly; cache per channel.
- Product: "related" is a new entry point for temptation. Keep it short (5–8), after the video, and apply motivational placement rules (section 8) inside it.

**Needs testing:** share of test-field videos found in a teacher playlist; quota used per "related" load; whether users open related items and then produce costly signals (useful) or just drift.

**Effort for a solo developer:** Medium. Steps 1–3 are simple; steps 4–5 depend on the goal engine and user data.

**Risk level:** Low–Medium.

---

## 8. Motivational content placed well, with any cap set by the user

**Possible?** Yes, within the rules. Placing motivational videos in your own feed at session start or after a study block is feed order, not gating (III.F.3), as long as they stay playable from search and categories at all times (research.md 16, ✅). Whether it *helps* is another matter: the evidence says motivational content can help or hurt depending on its **type**, and no study I found tested YouTube motivational videos on study behaviour directly.

**What the evidence says:**

| Study | Finding | What it means for placement | Label |
|---|---|---|---|
| **Kappes & Oettingen** (JESP 2011) | Induced **positive fantasies** about an ideal future lowered energy (physiological and behavioural) compared with questioning, negative or neutral fantasies; bigger drop when the need was pressing. "Positive fantasies trigger the relaxation that would normally accompany actual achievement." | "Imagine your name in the topper list" style videos may *feel* motivating and reduce effort. | 🟡 [LSE eprint](http://eprints.lse.ac.uk/46284/) (abstract) |
| **McCulloch et al.**, "Vicarious goal satiation" (JESP 2011) | People who watched someone *complete* a task then did worse on a similar task than people who watched nothing or watched someone fail. | Watching others' success stories can stand in for your own effort. | 🟡 [PMC3630077](https://pmc.ncbi.nlm.nih.gov/articles/PMC3630077/) |
| **Lockwood & Kunda** (JPSP 1997) | Star role models inspire when their success seems **attainable**; they deflate when it seems out of reach. Only self-relevant stars had any effect. | "AIR 1 at 17 with no coaching" can deflate a repeater. Relatable, process-focused stories are safer. | 🟡 [PDF](http://persweb.wabash.edu/facstaff/hortonr/articles%20for%20class/lockwood%20and%20kunda.pdf) |
| **Milyavskaya et al.** (PAID 2012) | Students who felt more **inspired about their own goals** made more progress over a semester; the effect ran both ways. | Inspiration linked to *your own goal* is good. Correlational. | 🟡 [Carleton PDF](https://carleton.ca/goallab/wp-content/uploads/Inspired-to-get-there.pdf) |
| **Duckworth et al.** (2011, 2013) and an **MCII RCT on procrastination** (Acta Psychologica 2026, N = 81, Chinese undergraduates) | Pairing the wish with obstacles and an if-then plan (MCII/WOOP) raised academic effort (60% more practice questions in one trial) and reduced task aversiveness vs a **positive-thinking** control, sustained at one week. | Motivation works best when it ends in a concrete plan. Positive thinking alone was the *control*. | 🟡 [Duckworth 2013](https://journals.sagepub.com/doi/abs/10.1177/1948550613476307); ✅ abstract via Europe PMC: Zhou et al., [doi:10.1016/j.actpsy.2025.106168](https://doi.org/10.1016/j.actpsy.2025.106168) |
| **Tiggemann & Zaccardo** (Body Image 2015, N = 130) | "Fitspiration" images raised exercise *intentions* but also negative mood and body dissatisfaction. | An "inspirational" genre can raise intent without behaviour and carry side effects. Different domain, same pattern. | 🟡 [PubMed 26176993](https://pubmed.ncbi.nlm.nih.gov/26176993/) |
| **"Study with me" videos** (CHI 2021 interviews; surveys) | Learners use them to build ambience and a feeling of company while studying. | A different kind of "motivation": used *during* study, not instead of it. | 🟡 [CHI 2021](https://dl.acm.org/doi/10.1145/3411764.3445222) |
| **Short-video use and procrastination** (several Chinese cross-sectional studies) | Short-form video addiction is linked to academic procrastination. | Supports Shorts off by default; says nothing about long motivational videos. | 🟡 [PMC10756502](https://pmc.ncbi.nlm.nih.gov/articles/PMC10756502/) |

🔵 **Reading across these:** "motivational video" is two genres. **Process content** (how a relatable person studied a topic, dealt with a setback, planned a week) fits the attainable-role-model and MCII evidence. **Hype content** (success montages, "you will be IAS", lifestyle of toppers) fits the positive-fantasy and vicarious-satiation evidence, which predicts *less* effort after watching. I found **no study on Indian aspirant motivational YouTube** ❓; these findings come from Western lab studies and one Chinese RCT.

**Best way (🔵):**
1. **At session start, at most one short item, then straight into the plan.** Show the motivational card *above* "Continue: Lecture 8", not instead of it. The next card after it is always study.
2. **After a study block, as a break option**, not as the start of a new session. The work is already done, so satiation matters less.
3. **Prefer process over hype** inside the motivational category (an internal sub-label from the classifier; no visible labels, per research.md 17).
4. **Cap is the user's number.** It limits how many the *feed* places. Search and the category page are never capped. No counter shown (decided). The one-time "set a limit?" offer for heavy 18+ watchers stays as decided.
5. **Optional MCII nudge** after a motivational video: "What's one thing you'll do in the next 30 minutes?" with one-tap answers from the plan. Skippable. This is where the evidence is strongest.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **Placement + user cap + process preference (recommended)** | Fits evidence and rules | Classifier must separate process from hype (untested) |
| Treat all motivational videos the same, placement only | Simpler | Hype content may reduce effort |
| No motivational content in the feed (search only) | Safest on evidence | You decided users want it; hurts "just better than YouTube" |
| Friction before the Nth video (one sec style) | Strong evidence for self-chosen friction (research.md 14) | A pause before *a video* may count as gating (III.F.3); only a pause on *opening the category* is safer, and only if user-enabled |

**How competitors handle it:** YouTube recommends motivational content like any other and has no placement logic (🔵). Study apps (StudyTube, SyncStudy) don't treat it as a category ❓. PW-style apps don't surface outside creators at all (🔵). YPT/Forest use social or visual motivation instead of videos (section 20).

**Risks:**
- Legal/policy: low, provided nothing is locked or unlocked and search is untouched.
- Product: the evidence *against* hype content may frustrate users who like it. Keep the user in charge: preference, not prohibition.
- Technical: "process vs hype" is a subtle call on short Hinglish titles.

**Needs testing:** do sessions that start with a motivational item end with more or fewer costly signals than sessions that don't (within-user comparison)? Can the classifier tell process from hype? How many users set a cap?

**Effort for a solo developer:** Low–Medium. Placement is simple; the sub-classification is the hard bit.

**Risk level:** Low (policy), Medium (product: effect may be negative for hype content).

---

## Policy check: the compliance guide's "metrics" list (affects 3, 4, 5, 10b)

Raw page text of *Complying with YouTube's Developer Policies* downloaded and searched on 2026-09-26 (page "Last updated 2026-09-14 UTC"). ✅ [guide](https://developers.google.com/youtube/terms/developer-policies-guide). research.md (16, 17.1) quoted only the filtering line from this guide and missed this list.

**The text.** Heading: "Only offer metrics that are available via YouTube's API services." "What this means: Don't use YouTube's API to **offer** independently calculated or derived metrics or data that replace or provide new data that isn't available via YouTube's API services." Then "Don't use YouTube's API to:" with, among others (verbatim):
- "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API."
- "Merge or combine YouTube API data with any other data."
- "Estimate viewer satisfaction or dissatisfaction with a particular YouTube channel."
- "Calculate and assign custom "scores" to channels based on independently calculated averages or ratios -- for example, average view count, comment count, or overall brand suitability."
- "Make any claims on whether a video or channel is safe or suitable to watch or advertise against."
- "Gamify channel performance by ranking or tracking views between different channels, or generally stoking creator rivalries."

It then lists "Acceptable metrics": simple arithmetic on API data only (e.g. "Top viewed videos/channels sorted by views").

The binding Developer Policies say the same more briefly in III.E.4.h, and add a helpful example (✅ [policies](https://developers.google.com/youtube/terms/developer-policies), raw text, also "Last updated 2026-09-14"): you may not show "the number of users of your API Client that liked the video" *instead of* YouTube's like count, "However, you are permitted… to display the number of likes that were made through your API Client as long as that number is displayed alongside the total likes returned in the API Data and… your API Client clearly communicates that the API Client calculates the additional metric independently of YouTube API Data." Also banned: "a score that factors in likes, total views, or any other API Data."

**Literal reading (worst case).** Any classifier label ("learning", "motivational"), any topic assignment ("covers ICMAI P8, standard costing"), any channel-level "useful for CMA" list, and any channel-level enrichment score is inferring content type or scoring channels. "Merge or combine YouTube API data with any other data" would even cover showing a user's note beside a video title.

**Strongest counter-reading (🔵).**
1. The heading and "What this means" are about what an app **offers** (displays) as metrics. The examples target analytics and ad-tech tools: CPM, demographics, monetisation, brand suitability, creator rivalries. None is about ordering a user's own feed.
2. The same guide expects consented filtering ("Restrict, filter… without their knowledge or consent" is the don't), and every filter needs some judgement about each video. Read literally, the metrics list would ban what the privacy list implies is allowed.
3. "Merge or combine… with any other data," read literally, bans notes beside videos, which the policies' own like-count example shows is fine when labelled. So the list can't be meant fully literally.
4. The policies' example accepts app-side counts of your own users' actions on a video, if clearly labelled as yours.

**My view (🔵):** the counter-reading is reasonable, but the literal words are clear, recent and exactly on point for "infer content category". This raises the label risk in research.md from "grey area under III.E.4.h" to "**named example in Google's own guide**". Only YouTube can settle it, and the compliance audit will read this guide. Group A (classifier) is hit hardest.

**Designs that stay further from the words:**

| Feature | Closer to the ban | Further from it |
|---|---|---|
| Goal → feed (section 3) | Store "video V is category *Learning* / topic *Standard Costing*" | Rank at request time by **similarity between the user's own goal text and the video's metadata**, the way any search ranks. Store nothing about the video; keep only the user's goal and topic map (your data). Reduces, doesn't remove, the risk. |
| Content type | Your own category labels | Use `categoryId` / `topicDetails` returned by the API as the only *stored* type (the guide's allowed route), plus request-time relevance to the goal. Weak signals, but literally compliant. |
| Enrichment (section 4) | Per-channel satisfaction or quality score | **Per-user** signals (this user's notes, studied marks) used only for that user's ranking; never a channel score; never shown. |
| Pooled signals (4, 5, 10b) | "Channel X is rated 4.2 by CMA users" | Item-to-item co-occurrence of *your users' actions* ("studied X, then studied Y"), used only to order a list, never displayed, never mixed with views/likes. |
| Source lists | Automated "good channels for CMA" built by classifying API data | Human-curated lists (curators' own judgement), **user-chosen** follows and mutes, YouTube's own `search.list` relevance for discovery. Automated lists are the highest-risk item; at most, show them to curators as suggestions. |
| Recommender features (10b) | View count, likes, comment count as features | Your data only (goal text, user actions) plus raw metadata at request time. |
| Anything displayed | Scores, ranks, badges on videos or channels | No numbers on YouTube content (already decided). |

**III.L route: derived metrics for audited analytics apps (✅ raw text, [derived-metrics policy](https://developers.google.com/youtube/terms/derived-metrics-policy), "Last updated 2026-09-14").** Since 1 June 2026 YouTube lets accepted developers compute metrics that are otherwise banned. Section 3 "Content Categorization and Tagging": "You may use analysis to assign descriptive sub-genres or tags to videos and channels. These must be additive and distinct from YouTube's video categories", and must be "clearly disclosed to the user that they are your tags". Section 4 "Viewer Sentiment Analysis": "You may estimate viewer satisfaction or dissatisfaction (sentiment) using aggregate data, such as like/dislike ratios or comment analysis", with no profiling on protected attributes (age, health and others). Accepted apps may also keep statistics and derived metrics "for up to 36 calendar months"; titles, descriptions and comment text stay on the 30-day rule.

The catch: acceptance is through the quota-extension form, choosing "Analytics & Reporting" as the use case, and "Your API Service must reflect an analytics use case on YouTube."

🔵 What this means for you:
1. It confirms the literal reading. YouTube treats tagging videos and channel-level satisfaction scores as **derived metrics that are banned unless you are accepted under III.L**.
2. A focused learning player is not an analytics product. Claiming the analytics use case to get permission would misstate your app in the audit. I would not rely on this route.
3. It still gives a useful signal: YouTube allows "additive" tags that don't replace its own categories, as long as they are disclosed. If you ever ask YouTube directly, this is the model to point to. Your internal-only labels plus the mode line are close to it in spirit, but not in eligibility.
4. For enrichment (section 4): section 4 of that page is about aggregate sentiment from **API data** (likes, comments). Your per-user signals from your own data are a different thing, and staying per-user and undisplayed remains the safer design.

**Other lines on the same page that touch this group (✅ verbatim):**
- "Incentivize, reward, coerce, or provide compensation to users for watching a video. A user's decision to watch a video needs to be their own choice." Binding policy III.F: "API Clients must not offer or provide incentives, rewards, or other compensation to users for engaging with YouTube Applications (directly or indirectly) by performing actions like viewing content…". See section 20.
- "Links must open in the YouTube application whenever the application is available on a user's device, or if not installed, via the system web browser." And "Disabling or blocking Related Video links from appearing after the video completes" is listed as a violation. 🔵 The player's own end-of-video suggestions will always compete with your "related" section (section 5), and tapping them leaves the app. Offset it by showing your section *before* the video ends.
- The guide says deletion on request "within 30 days"; the binding policies (III.E.4.g) say 7 days. Follow 7.
- Privacy example: don't build "an app that tracks a user's viewing history… without their knowledge or consent." 🔵 With knowledge and consent, it is expected (relevant to 10b).

---

## 10b. Our own recommendation model, trained on our own user data, with a cold-start strategy

**Possible?** Partly. A model trained on **your users' actions** is allowed in my reading, with conditions. A model that uses **YouTube statistics** (views, likes) or **stored video metadata** as training data is not. And with few users per goal, a trained model is unlikely to beat good rules for a long time. Plan for rules + bandits first.

**Is "which video IDs a user watched" API data or our data?**

| Question | Answer | Label |
|---|---|---|
| Definition of API Data | "data, content (including audiovisual content) and information provided to API Clients… through the YouTube API services" | ✅ [API ToS](https://developers.google.com/youtube/terms/api-services-terms-of-service) |
| The event "user U studied video V at 9 pm" | Created by your app and your user, not provided by the API: **your data**. The video ID inside it came from the API; no ID exception in the text. | 🔵; research.md 16 ❓ still open |
| Player events (play/pause/ended) | Come through the **IFrame Player API**, which the policies name as a YouTube API service. A "finished" event is arguably "information provided through the YouTube API services". | 🔵 new point; ❓ |
| Watch history with consent | Guide's don't is tracking viewing history "without their knowledge or consent". | ✅ guide |
| Counting your own users' actions on a video | Allowed if shown as yours, never as a replacement for YouTube's numbers. | ✅ policies III.E.4.h example |
| Training on titles/descriptions/stats | Derived data from API data; also "a score that factors in… API Data". Keep out (already decided for the classifier). | ✅ text |

**30-day rule?** 🔵 The limit applies to API data you store. If the training table is (user, video ID, action, time) and nothing else, only the ID is API-derived: the same "medium" risk research.md gives IDs in notes, at larger scale. Safer variants: (a) keep raw logs ≤ 30 days and keep long-term only **aggregate counts per goal** (co-occurrence tables); or (b) keep IDs but never titles or metadata beside them. ❓ Only YouTube can confirm.

**III.E.4.h and the guide list?** 🔵 Inputs are your data, so outputs aren't directly "derived from API data". The guide list is the bigger issue: the model must not produce **channel scores**, **stored content categories**, or anything displayed as a metric.

**When does a trained model beat rules?** ❓ No universal threshold. The evidence says be patient:
- Dacrema, Cremonesi & Jannach (RecSys 2019 best paper): of 18 neural recommenders, only 7 could be reproduced, and 6 of those were often beaten by simple nearest-neighbour or graph methods. 🟡 [arXiv 1907.06902](https://arxiv.org/abs/1907.06902)
- Besbes et al. and Anwar et al. (section 4): what you optimise matters more than model complexity.
- 🔵 Item-to-item co-occurrence needs several costly signals from several same-goal users per video. With ~50 active CMA Inter users, most videos will have 0–2 signals, and rules (series order, syllabus order, curated channels) will win. A model earns its place only in big, dense goals (NEET, "AI") after roughly thousands of active users (guess, not measured). Test monthly: replay last month's logs, compare model vs rules on held-out costly signals, switch per goal when the model wins.

**Cold-start strategy (🔵, building on research.md 18.3):**

| Layer | Method | Why |
|---|---|---|
| New goal | Syllabus-grounded topic map + curated seed channels | No data needed |
| New user | **Pool by goal**: start from what same-goal users found useful | Your data; per-goal counts are cheap and easy to delete |
| New video | Request-time match to goal text + teacher's series position | No history; no stored labels |
| Exploration | **Thompson sampling** with priors from LLM/curators, shrunk toward goal-level averages | LLM priors help most "in sparse-feedback regimes" (🟡 [Lee et al., arXiv 2608.03382](https://arxiv.org/abs/2608.03382), comment recs, not education); LinUCB/TS evidence in research.md 18.3 |
| Later | Small learned model (item-KNN or two-tower) on costly signals, per large goal | Only after it beats rules in replay |

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **Rules + pooled counts + Thompson sampling first (recommended)** | Works at tiny scale; transparent; easy deletion | Less personal |
| Train a model from day one | "Our own model" story | Too little data; likely worse than rules |
| LLM ranks every feed zero-shot | No training data | Latency, cost, metadata sent out per request; LLM on critical path |
| YouTube stats as features | Dense signal | Banned ("score that factors in… API Data") |

**How competitors handle it:** YouTube trains on watch behaviour plus survey predictions at huge scale (🟡). StudyTube, SyncStudy and LearnTube show no learned recommender (sections 4–5). PW uses its own platform, outside YouTube's rules (🔵).

**Risks:**
- Legal (DPDP): training on adults' behaviour needs a consent purpose covering it; withdrawal and erasure must reach the training data. 🔵 Count tables make erasure simple (subtract the user's counts); trained weights don't (small-scale "unlearning" ❓). YouTube's 7-day deletion (III.E.4.g) applies too. Minors: excluded from training and behaviour ranking.
- Policy: IFrame player events may count as API data ❓; no channel scores; no stored categories.
- Technical: too little data per goal; evaluation is harder than training.

**Needs testing:** costly signals per active user per week; when (if ever) item-KNN beats rules in replay per test field; whether LLM priors speed up the bandit on real goals.

**Effort for a solo developer:** Medium for rules + bandit; High for a trained model and its evaluation.

**Risk level:** Medium.

---

## 20. Behaviour-aware design: commitment devices, if-then plans, forgiving weekly totals, always with user override

**Possible?** Yes, with one policy limit. Commitment devices, if-then plans and weekly totals are all allowed and have evidence behind them. The limit is YouTube's ban on rewarding video watching (III.F, verbatim below): anything that gives points, coins, streaks or prizes **for watching videos** is out. Tracking **study** (plans kept, topics marked studied, focus time including offline study) is, in my reading, fine.

**Does it clash with III.F? (✅ policy text, 🔵 reading)**

Binding policy III.F (raw text, [policies](https://developers.google.com/youtube/terms/developer-policies)): "API Clients must not offer or provide incentives, rewards, or other compensation to users for engaging with YouTube Applications (directly or indirectly) by performing actions like viewing content, liking content, sharing content, subscribing to channels, adding comments." Guide ([guide](https://developers.google.com/youtube/terms/developer-policies-guide)): don't "Incentivize, reward, coerce, or provide compensation to users for watching a video. A user's decision to watch a video needs to be their own choice. Example: Offering the chance to win a prize or offering financial compensation in exchange for a user watching a video through your API service."

| Feature | Reading (🔵) | Risk |
|---|---|---|
| **Coins/points earned by watching** (LearnTube, YourTube Study Mode do this, research.md 2) | Direct reward for viewing. "Directly or indirectly" closes the loophole of rewarding watch *time*. | **High. Don't.** |
| Coins/points redeemable for anything (prizes, unlocks, discounts) | "Compensation"; also gating if they unlock videos | **High. Don't.** |
| **Daily streak of watching videos** | A streak is a reward the app gives for repeat viewing; loss aversion is the "coerce" part. | **Medium–high. Don't.** |
| Streak/total of **study actions** (plan items done, topics marked studied, focus sessions, including offline study) | Rewards studying, not viewing. The user may study from a book. | Low–medium. Keep it about study, not video count or minutes watched. |
| **"Mark as studied"** | A user's own record of progress; no reward is attached. Same as a checkbox in a notebook. | **Low.** Don't attach points or badges to it. |
| Progress bar ("4 of 12 Polity chapters") | Self-tracking against the user's goal | Low |
| Weekly summary of **study time** | Self-tracking. Count focus-timer time, not only video time. | Low |
| Leaderboard of watch time or videos watched (YPT-style ranking) | Social reward for viewing; also shame risk | **High. Don't.** Study-time ranking with friends, opt-in, adults only, is lower but still close. |
| Friction / commitments (lock a category for 90 min, soft) | Not a reward. Must not gate a video the user chose (III.F.3); apply friction to *categories* or *the app*, never to pressing play. | Medium (III.F.3 wording) |

**Evidence on streaks and forgiving goals:**

| Work | Finding | Label |
|---|---|---|
| **Silverman & Barasch**, "On or Off Track: How (Broken) Streaks Affect Consumer Decisions" (J. Consumer Research 2022, seven studies) | Intact logged streaks raise later engagement *relative to broken ones*, "independent of actual past behavior", because people treat keeping the streak as a goal in itself. The drop after a break is **bigger when people blame themselves** and **smaller when they can "repair" the streak**. | ✅ abstract via Crossref, [doi:10.1093/jcr/ucac029](https://doi.org/10.1093/jcr/ucac029) |
| **Sharif & Shu**, "The Benefits of Emergency Reserves" (J. Marketing Research 2017) | People prefer goals with an explicit **emergency reserve** (slack with a cost), see them as more attainable, and **persist more**, partly to avoid using the reserve. | ✅ abstract via Crossref, [doi:10.1509/jmr.15.0231](https://doi.org/10.1509/jmr.15.0231) |
| **Milkman et al.** megastudy (Nature 2021, 61,293 gym members, 54 interventions) | 45% of interventions raised weekly visits 9–27%. The **top one gave micro-rewards for returning after a missed workout**. Only 8% had effects that lasted past the 4 weeks. | ✅ abstract via Europe PMC, [doi:10.1038/s41586-021-04128-4](https://doi.org/10.1038/s41586-021-04128-4) |
| **Duolingo** blog (Jan 2022) | Learners with a 7-day streak are "3.6 times more likely to complete their course" (correlation, not cause). Doubling Streak Freezes raised daily active learners by **+0.38%**; milestone animations **+1.7%** 7-day return. Duolingo names loss aversion as the mechanism and cites "slack" research. | 🟡 company blog, [Duolingo](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) |
| **Lally et al.** (2010) | Median 66 days to automaticity; **missing one day barely mattered**. | ✅ (research.md 14) |
| **Kizilcec et al.** (PNAS 2020, ~250,000 students, 247 Harvard/MIT/Stanford courses, 2.5 years) | Established interventions (incl. **plan-making**) did *not* produce the expected medium-large effects. Self-regulation interventions raised engagement in the first weeks but **not completion**. Value-relevance interventions helped in developing countries in courses with a global gap. Scaling cut average effects by an order of magnitude. | ✅ abstract via Europe PMC, [doi:10.1073/pnas.1921417117](https://doi.org/10.1073/pnas.1921417117) |
| **Patterson** (J. Econ. Behavior & Org. 2018, MOOC RCT) | A **commitment device**: students spent 24% more time on the course, grades +0.29 SD, 40% more likely to complete. The **alert** tool and the **distraction-blocking** tool had no measurable effect. | 🟡 [RePEc abstract](https://ideas.repec.org/a/eee/jeborg/v153y2018icp293-321.html) (I couldn't read how the device worked ❓) |
| **Allcott, Gentzkow & Song**, "Digital Addiction" (AER 2022) | Letting people set limits on their *future* screen time substantially cut use; the authors estimate self-control problems cause 31% of social media use. | ✅ abstract via Crossref, [doi:10.1257/aer.20210867](https://doi.org/10.1257/aer.20210867) |
| **Kaur, Kremer & Mullainathan**, "Self-Control at Work" (JPE 2015, year-long field experiment, Indian data-entry workers) | Workers **voluntarily chose "dominated" contracts** that penalise low output, and raised output. Evidence that Indian adults demand and benefit from commitment. | 🟡 [RePEc abstract](https://ideas.repec.org/a/ucp/jpolec/doi10.1086-683822.html) |
| **Gollwitzer & Sheeran** (2006); **MCII RCT** (Acta Psychologica 2026) | If-then plans d = 0.65 in lab/field meta-analysis; MCII reduced procrastination vs positive thinking. | ✅ research.md 14; section 8 |
| **one sec** (PNAS 2023) | Self-chosen pause cut app openings 57%; the **option to dismiss** had the strongest effect. | ✅ research.md 14 |

🔵 **Reading across these:**
- **Streaks work by making the streak itself the goal.** That's exactly the risk for you: the goal should be learning, and a broken streak hits hardest when people blame themselves (your sister's guilt story). Use a **weekly total with a built-in reserve** ("5 study days this week; 2 spare"), and a **welcome-back** message after a gap instead of a reset (megastudy, Sharif & Shu, Silverman & Barasch's "repair" finding).
- **Commitment beats blocking.** Patterson found distraction blocking did nothing while a commitment device worked; Allcott et al. found self-set future limits worked. So: let the user commit in a calm moment; don't just block.
- **Expect small effects at scale.** Kizilcec's quarter-million-student study is the sober anchor: plan-making alone raised early engagement, not completion. Test each device; don't stack many.
- **Weekly vs daily:** I found **no direct head-to-head study of weekly vs daily study goals** ❓. The case for weekly rests on slack/reserve evidence, Lally's "one missed day doesn't matter" and Duolingo's own move toward forgiveness (freezes), not on a direct trial.

**Best way (🔵):**
1. **Weekly study total with reserve days**, counting study actions and focus time (including offline study the user logs), never videos watched. No reset after a miss: "Welcome back. 3 of 5 days this week."
2. **Commitment set in a calm moment** (e.g. Sunday): next week's plan and category caps. Changeable any time with a short delay; always one-tap dismissible (one sec's strongest finding).
3. **If-then plans offered after a few days of use**, as one-tap templates ("When I open the app after 7 pm → continue my next lecture"). Skippable.
4. **No coins, points, badges, prizes or watch-based leaderboards.** Show progress against the user's own syllabus.
5. Everything is **off by default or one-tap off**, and none of it ever stands between the user and a video they chose (III.F.3).

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **Weekly total + reserve + calm-moment commitments (recommended)** | Evidence-backed; forgiving; clear of III.F if study-based | Weaker short-term pull than streaks |
| Daily streak with freezes/repair (Duolingo) | Proven to raise daily activity | Streak becomes the goal; guilt; if based on viewing, clashes with III.F |
| Coins/virtual rewards (LearnTube, YourTube) | Popular with teens | III.F clash; extrinsic rewards |
| Hard blocking (Forest/Opal style for other apps) | Strong in the moment | Patterson: blocking alone showed no effect; reactance (research.md 14) |
| Social rankings (YPT) | Motivating for some aspirants | Shame; comparison; privacy; adults only |

**How competitors handle it:**

| App | Mechanism | Scale (Play Store India, fetched 2026-09-27) | Label |
|---|---|---|---|
| **Forest** | Grow a virtual tree while you stay off the phone; allowlist blocker; description now pitches "Crack UPSC, JEE & NEET" | 1 crore+ downloads, 4.5★, 8.13 lakh reviews | ✅ [Play](https://play.google.com/store/apps/details?id=cc.forestapp&hl=en_IN) |
| **YPT (Yeolpumta)** | Study stopwatch, study groups, "Realtime ranking… in the same study category", heatmap stats | 50 lakh+ downloads, 4.5★ | ✅ [Play](https://play.google.com/store/apps/details?id=com.pallo.passiontimerscoped&hl=en_IN) |
| **one sec** | Breathing pause before opening chosen apps | 10 lakh+ downloads, 4.6★ | ✅ [Play](https://play.google.com/store/apps/details?id=wtf.riedel.onesec&hl=en_IN) |
| **Opal** | Focus sessions, schedules, app limits, weekly reports; The New Yorker quote credits "mild friction, encouragement, and guilt" | 5 lakh+ downloads, 4.5★ | ✅ [Play](https://play.google.com/store/apps/details?id=com.withopal.opal&hl=en_IN); "six years of life" claim is marketing 🟡 |
| **Duolingo** | Daily streak, freezes, milestones | — | 🟡 blog |
| LearnTube, YourTube Study Mode | Coins for study/watching | small | research.md 2 |

🔵 None of these (except LearnTube/YourTube) embeds YouTube, so III.F doesn't bind them. Copying Forest's or Duolingo's reward loop into a YouTube-embedding app is where the clash arises.

**India- or student-specific evidence:** Kaur et al. (Indian workers choose commitment), Forest's own pitch to UPSC/JEE/NEET aspirants and YPT's popularity with UPSC aspirants (🟡, research.md 2), Kizilcec (larger benefit from value-relevance in developing countries). I found **no study of streaks or study apps among Indian students** ❓. The search tool budget ran out before I could look further, so this gap may be partly mine.

**Risks:**
- Policy: III.F incentives (above); III.F.3 gating if friction sits in front of a chosen video.
- Legal: 18+ at launch; any social feature needs care for minors later (DPDP s.9 bans tracking/behavioural monitoring of children). Weekly totals of a minor's activity are close to "tracking"; keep on-device or aggregate later.
- Product: forgiving designs pull less in the short term; users used to Duolingo may expect streaks.

**Needs testing:** do weekly totals with reserve days keep users as well as a streak would, with less guilt (ask in interviews)? How many users set a commitment? Does "welcome back" bring lapsed users back?

**Effort for a solo developer:** Low–Medium. Counters, plans and templates are simple; the careful part is wording.

**Risk level:** Low if study-based and reward-free; High if anything rewards watching.

---

---

# Group: Player, platforms and in-app features

Checked on 2026-09-26. Policy quotes were read in the raw page text (downloaded with curl and searched), not in summaries. Pages used throughout:

- **Policies** = [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- **Guide** = [Complying with YouTube's Developer Policies](https://developers.google.com/youtube/terms/developer-policies-guide) (page dated 2026-09-14)
- **RMF** = [Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality)
- **Branding** = [YouTube API Services Branding Guidelines](https://developers.google.com/youtube/terms/branding-guidelines)
- **Params** = [Embedded Players and Player Parameters](https://developers.google.com/youtube/player_parameters)
- **IFrame API** = [IFrame Player API reference](https://developers.google.com/youtube/iframe_api_reference)

## Four findings that change earlier research

These affect more than this group, so they come first.

1. **Player links must open in the YouTube app.** ✅ Guide, under "Your API service must reflect a user's standard experience": "Links must open in the YouTube application whenever the application is available on a user's device, or if not installed, via the system web browser." research.md section 6 guessed that sending the logo link to the browser instead was "probably allowed". **It isn't.** The app can't choose where player links open. (Wayback copies from Dec 2023, Jan 2026 and Mar 2026 all contain this line, so it isn't new.)
2. **The Guide bans inferring a video's category.** ✅ Under "Only offer metrics that are available via YouTube's API services" → "Don't use YouTube's API to:" the list includes "**Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API.**" It also lists "Make any claims on whether a video or channel is safe or suitable to watch." The line has been there since at least Dec 2023 (Wayback). research.md 16 treats the classifier risk as the "derived data" question under III.E.4.h. This line is more direct. 🔵 The heading is about *offering* metrics and data, so an internal label that is never shown is the strongest defence. But "X results hidden" reveals the inference in aggregate. **This touches the classifier (outside this group) and Shorts detection (expectation 6).** It raises the "labels ruled out" worst case from unlikely to plausible.
3. **Limiting a YouTube feature has its own rule.** ✅ Policies III.C, "Permitted Feature Limitation": a client "should not limit or reduce the functionality of a YouTube feature unless that limitation is a core aspect… of the API Client". Where it does, it "must explain to users why each limitation is in place and make clear that the limitation is not imposed by YouTube" and "should provide a mechanism for users to access the full feature". This fits Shorts off, hidden results and hidden comments. The disclosure wording must say **the app** hid something, not just that it's hidden.
4. **Rewards for watching are banned.** ✅ Policies III.F: "must not offer or provide incentives, rewards, or other compensation to users for… viewing content". ✅ Guide: don't "Incentivize, reward, coerce, or provide compensation to users for watching a video." This limits "mark as studied", streaks and the "Done for today" screen (expectation 18).

---

## 6. Shorts: optional, limited, user-set daily limit

**Possible?** Partly. A user-set Shorts limit is possible. Reliable Shorts *detection* within the rules is not: there's no API flag, and inferring "this is a Short" may itself fall under the Guide's ban on inferring content type (finding 2).

**Best way:**
- Don't try to label individual videos as Shorts. Use **documented, per-request signals as a proxy, and describe them honestly as "short vertical videos" (under 3 min, taller than wide).**
  - Duration from `contentDetails.duration` ✅ (Shorts can be up to 3 minutes since 15 Oct 2024 ✅ [YouTube Help](https://support.google.com/youtube/answer/15424877?hl=en)).
  - Aspect ratio from `player.embedWidth` / `player.embedHeight`, returned by `videos.list` when you pass `maxWidth` / `maxHeight` ✅ [videos resource](https://developers.google.com/youtube/v3/docs/videos), [videos.list](https://developers.google.com/youtube/v3/docs/videos/list). A 9:16 player at ≤180 s is almost always a Short. 🔵 Both fields come in the same 1-unit `videos.list` call you already make.
  - 🔵 Duration + aspect ratio are YouTube's own data, used as a filter the user switched on. That is closer to the "videoDuration" filter YouTube itself offers in `search.list` ✅ [search.list](https://developers.google.com/youtube/v3/docs/search/list) than to inventing a category. Still ❓ whether YouTube would read it as "inferring content type". Low-to-medium risk.
- **Limit = what the feed shows, never interrupting playback.** Default in Aspirant mode: no short vertical videos in feeds and search. If the user turns them on, they choose a cap (e.g. 0, 5, 10 a day, or "until I stop"). When the cap is reached, stop *listing* more, with the Permitted Feature Limitation notice: "Short videos hidden by [App] (your limit: 5 a day) · Show". Don't pause or stop a video already playing: stopping mid-play and requiring a tap to continue edges toward III.F.3 gating. 🔵
- **"Limited set":** show them in one labelled row ("Quick revision clips") on the home feed or after a study block, not an endless vertical swipe. 🔵 No policy says Shorts must be shown as a swipe feed. The RMF only covers the player, not feed layout. Showing fewer videos is your feed design; the only duty is the limitation notice (finding 3).
- **Playback:** a Short plays in the normal embed (`https://www.youtube.com/embed/VIDEO_ID`). Size the iframe 9:16 (e.g. 360×640, min 200×200 ✅ RMF) and it fills the frame; in a 16:9 frame it's pillarboxed. 🟡 [ecency issue](https://github.com/ecency/vision-web/issues/1271), [document360](https://docs.document360.com/docs/embed-youtube-shorts). The embed uses standard player controls, not the Shorts swipe UI. 🔵 For a study app that's an advantage: no endless swipe.

**Alternatives:**

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Duration ≤ 180 s + vertical aspect ratio (documented fields) | Documented API data, 0 extra quota | Misses square Shorts; catches vertical non-Shorts; may still count as "inferring type" ❓ | **Recommended** |
| Duration ≤ 180 s only | Simplest | Hides many short learning clips (formula revision, one-concept videos). Over-blocking is your worst failure | No |
| `/shorts/ID` URL redirect check | Most accurate today | Not an API method; Policies III.I bans "any technology other than YouTube API Services to access or retrieve API Data" ✅. Scraping | **Non-compliant. Drop** (research.md 4 agreed) |
| `UUSH…` / `UULF…` channel playlists (a channel's Shorts / long-form uploads) via `playlistItems.list` | Real API call, exact Shorts list per channel | The playlist-ID scheme is **undocumented** and "could stop working without notice" 🟡 [yourtube issue](https://github.com/justinclayton/yourtube/issues/132), [simpledecisionmaker](https://simpledecisionmaker.onrender.com/blogs/decoding-youtube-playlist-ids/). 🔵 Uses a documented method with an undocumented input; grey. Only works per channel, not for search results | Possible second signal; don't depend on it |
| `search.list videoDuration=short` (< 4 min) | Official filter | Only in search; excludes, can't count or cap | For "no short videos" in search only |

**How competitors handle it:**
- **YouTube** ✅ [Help: Set a Shorts feed limit](https://support.google.com/youtube/answer/16671528?hl=en): mobile app only; "When your set time limit is reached in the Shorts feed, a message will appear reminding you"; users can "dismiss or ignore" it; a zero option exists. 🟡 The 0-minute option arrived in April 2026 and removes Shorts from the home feed, but Shorts still appear in Subscriptions and via direct links ([Android Central](https://www.androidcentral.com/apps-software/youtube/youtube-now-offers-a-way-to-turn-off-shorts-sort-of), [RouteNote](https://routenote.com/blog/youtube-shorts-daily-zero-minute-limit/)). For supervised teen accounts the limit can't be dismissed 🟡 (Fox News). **This settles research.md's ❓ on the 0-minute claim: now 🟡 confirmed by several outlets, ✅ that "zero" exists per the Help page.**
- **Unhook / DF Tube / FilterTube:** hide the Shorts shelf and tab on youtube.com (extensions, no API). 🟡
- **StudyTube (Play):** "without Shorts" in older descriptions; the Sept 2026 listing doesn't mention Shorts. ❓ how it detects them.

**Sources:** ✅ YouTube Help 15424877 and 16671528; ✅ videos resource (`player.embedHeight/embedWidth`); ✅ search.list `videoDuration`; ✅ Policies III.I; ✅ Guide "Infer or estimate the content category/type"; ✅ Data API revision history (no Shorts flag added through 14 Sept 2026; searched the raw page); 🟡 UUSH/UULF blogs; 🟡 news on the 0-minute limit.

**Risks:**
- Legal/policy: "inferring content type" (finding 2), low–medium. Scraping `/shorts/`: high, so don't.
- Technical: aspect ratio is only returned "if the video's aspect ratio is known" ✅; unknown defaults to 4:3. Some Shorts will slip through.
- Product: over-hiding one-concept learning clips. Keep "Show" one tap away.

**Needs testing:** share of real Shorts caught by duration + aspect ratio on 200 videos from the four fields; how many short *learning* clips get caught; whether a 9:16 embed looks right on small Android phones with controls fully visible (RMF).

**Effort for a solo developer:** Low (two fields from a call you already make, plus a counter).

**Risk level:** Medium (only because of the "infer content type" line).

---

## 9. As simple as YouTube, intelligence inside, minimal disclosure

**Possible?** Partly. Simple, yes. **YouTube-like looks, no.** The Branding Guidelines ban imitating YouTube's look and feel, and the Guide bans apps that are "difficult to distinguish" from YouTube. The mode line + "X results hidden · Show" design meets the Guide's "knowledge or consent" wording, but **needs one change** to meet III.C: it must say the app did the hiding.

**Best way:**
- **"Simple like YouTube" means the same *effort* (search box, a feed, tap to play), not the same *look*.** ✅ Branding: "Do not adopt marks, logos, slogans, or designs that are confusingly similar to the YouTube trademarks or that imitate YouTube's trade dress, including the look and feel of YouTube web design properties… distinctive color combinations, typography, graphic designs, product icons". ✅ Guide: "Don't use YouTube's API to create websites or apps… that make it difficult to distinguish between your website or app and websites or apps created by YouTube… If a user is likely to mistake your site for YouTube's, there's a good chance it violates our TOS." So: your own name, colour (not red + white), icon (no play-button triangle in a rounded rectangle) and typography.
- **Name:** ✅ Branding: never use "YouTube", "YT", "You-Tube" "or any abbreviation, acronym, or variant". 🔵 Avoid "-Tube" names too (StudyTube, LearnTube, YourTube carry this risk). "Works with YouTube" in the description is allowed ✅.
- **Attribution:** ✅ Policies III.F: every page showing YouTube content "must make clear to the viewer that YouTube is the source… by displaying YouTube Brand Features". ✅ Branding: your app is "entirely dependent on curating YouTube content", so use the **"developed with YouTube" logo**, near the content, clickable, linking to YouTube content, and never the most prominent element. The player's own YouTube logo must stay visible.
- **Disclosure wording** (combining the Guide's "knowledge or consent" and III.C's Permitted Feature Limitation):
  - Mode screen: "Aspirant mode: [App] hides entertainment, Shorts and distractions from your results. You can show them any time."
  - Under results: "**7 hidden by [App]** · Show". The words "by [App]" meet "make clear that the limitation is not imposed by YouTube" ✅; "Show" is the "mechanism for users to access the full feature" ✅.
  - 🔵 Keep a "Why?" tap on the hidden line that gives the *rule* ("your mode hides entertainment", "your mute: channel X", "age-restricted: YouTube won't play it here"), never a per-video score. Per-video reasons would expose inferred categories (finding 2).
- **III.I.1 (independent value):** ✅ "must not mimic or replicate YouTube's core user experiences by recreating features or process flows unless they add significant independent value or functionality that improves users' interactions with YouTube. For example, an API Client must not recreate the browse experience… without adding significant independent value". ✅ Guide: "users need to have a reason to continue to engage with… your API service when you take away what you are getting by accessing YouTube's API services." 🔵 A plain search box + feed is exactly "the browse experience". The value has to be visible in the product, not just "inside": goal-built feed with syllabus topics, series-aware "what next", notes and timestamp bookmarks, "studied" progress, study summary. These show up on screen as your own features, which is what an auditor sees in the walkthrough video. "All intelligence inside" is fine for *labels*; the *features* must be visible.

**Alternatives:**

| Approach | Pros | Cons |
|---|---|---|
| **Own brand, YouTube-simple flow, visible study features (recommended)** | Meets Branding + Guide; value is obvious in an audit | Needs real design work, not a YouTube clone kit |
| YouTube-like visual clone (red, grid, same icons) | Familiar | ✅ Banned by Branding ("trade dress") and Guide ("difficult to distinguish"). Also Apple 4.1(a) copycats, 5.2.1 |
| No disclosure beyond mode choice | Simplest | Weak against the Guide's "knowledge" wording; fails III.C's "not imposed by YouTube" |
| Per-video labels ("Entertainment") | Most transparent | Shows inferred categories: finding 2 + III.E.4.h disclosure duty |

**How competitors handle it:**
- **StudyTube** (Play): own UI; name ends in "-Tube". 🟡
- **LearnTube India:** "-Tube" name; advertises "100% ad-free" (research.md 2), which conflicts with ad rules.
- **SyncStudy:** own brand, "distraction-free player" that removes "sidebar recommendations, comments, and autoplay". 🟡 [syncstudy.in](https://www.syncstudy.in/)
- ❓ I found none that shows a "hidden by us" count. Extensions like Unhook hide silently (they modify youtube.com, not the API, so the Guide doesn't bind them).

**Sources:** ✅ Policies III.C, III.F (Branding), III.I.1; ✅ Guide ("difficult to distinguish", "knowledge or consent"); ✅ Branding Guidelines; ✅ [Apple Review Guidelines 4.1, 5.2.1](https://developer.apple.com/app-store/review/guidelines/) (updated 8 June 2026).

**Risks:**
- Policy: looking too much like YouTube (Medium, fully avoidable); "X hidden" revealing inference (see finding 2).
- Product: users may not notice the hidden line. That's acceptable as long as it's always there and one tap away.
- Audit: the walkthrough must show independent value in the first minute.

**Needs testing:** do users understand "hidden by [App] · Show" without reading more? Do they use "Show", and how often? Does anyone confuse the app with YouTube (ask in interviews: "What app is this?")?

**Effort for a solo developer:** Medium (own design system and brand; the disclosure itself is small).

**Risk level:** Low if own brand and "by [App]" wording; High if it copies YouTube's look.

---

## 16. Videos play inside the app, fewer escapes to YouTube

**Possible?** Partly. Playback inside the app: yes, on all four platforms, once the Referer is set right. Fewer escapes: only by design choices *around* the player. The player's links can't be blocked, and **must open in the YouTube app** (finding 1). Related videos at the end can't be blocked.

**Best way:**
- **Player parameters** (✅ Params unless marked):

| Parameter | Use | Note |
|---|---|---|
| `enablejsapi=1` + `origin=https://your.domain` | Needed for seekTo, events, notes | "you should always specify your domain as the origin" ✅ |
| `rel=0` | End-screen suggestions come from the **same channel** | ✅ "you will not be able to disable related videos" since 2018. Same-channel is best for lectures |
| `playsinline=1` | Inline on iOS (needs `allowsInlineMediaPlayback`) | Default is fullscreen on iOS ✅ |
| `autoplay` | Use only for "next in series" when the player is visible | ✅ RMF: no autoplay until >50% visible; one autoplaying player per screen |
| `iv_load_policy=3` | Annotations off by default | Documented ✅ |
| `cc_load_policy`, `cc_lang_pref`, `hl` | Captions/language | Useful for Hindi/English |
| `controls=0` | **Don't.** | Documented, but the Guide lists "Blocking the standard features of a YouTube player (like the settings wheel)" as a don't. 🔵 Keep controls on |
| `modestbranding` | **Gone.** | ✅ "deprecated and has no effect" (Aug 2023) |
| `widget_referrer` | Only if your player is inside a widget embedded elsewhere | Not needed for your app |
| `fs=0` | Hides fullscreen | 🔵 Don't; it removes a standard feature |

- **Identity (Error 153):** ✅ IFrame API: "153 – The request does not include the HTTP Referer header or equivalent API Client identification." ✅ RMF gives the official fixes: in a WebView, load a bundled HTML file with `baseUrl` (Android `loadDataWithBaseURL`, iOS `loadHTMLString:baseURL:`), or add a Referer header. The Referer should be `https://<your app ID>` (e.g. `https://com.example.study`). Web/PWA: the browser sets it; just don't send `Referrer-Policy: no-referrer`/`same-origin` ✅ RMF recommends `strict-origin-when-cross-origin`. 🟡 [Simon Willison TIL](https://til.simonwillison.net/youtube/fixing-153-embed) confirms `same-origin` triggers 153.
- **Don't use a third-party CORS proxy** for the embed (suggested by [corsproxy.io](https://corsproxy.io/blog/fix-youtube-error-150-153-webview/)). 🔵 It sends the wrong identity and risks Policies III.I: "situate the YouTube player in a nested or hierarchical iframe lineage to circumvent YouTube policies or otherwise obfuscate the source of use" ✅. Hosting the player page **on your own domain** is different (true identity), but the RMF prefers the app ID for apps. 🔵 Low risk either way; app ID is the documented path.
- **Escapes you can reduce** (🔵 unless marked):
  - Remove age-restricted, non-embeddable, region-blocked videos everywhere (research.md 17.7). These redirect to YouTube on play.
  - `rel=0` keeps end-screen suggestions in the same channel.
  - Show your own "Next in this series" and "Mark as studied" **below** the player, ready before the video ends, so the user's next tap is yours.
  - Handle `onError` 100/101/150 (removed, private, embedding off ✅) with an in-app message and your next suggestion, instead of leaving a dead player.
  - Don't show comments by default (see 17): fewer links out.
- **Escapes you can't touch:** YouTube logo, title, channel links, "Watch on YouTube", end-screen videos. ✅ Policies III.I: must not "remove, obscure, alter, or disable any links that appear in YouTube players". ✅ Guide: "Links must open in the YouTube application whenever the application is available… or if not installed, via the system web browser." On Android you *can* intercept the navigation technically (`shouldOverrideUrlLoading` / `onCreateWindow`), but the only allowed action is to hand it to the YouTube app. **Don't** add a "You're leaving study mode" confirm step before it opens. 🔵 It adds friction to a player link and likely counts as interfering. A gentle "Welcome back, continue lecture 7?" when the user **returns** to your app is fine.
- **Other RMF rules that shape the screen** ✅: no "overlays, frames, or other visual elements in front of any part of a YouTube embedded player, including player controls"; no mouseovers or touch events on the player that act for the user; player ≥ 200×200 (480×270 recommended). So notes and buttons go **beside or below** the player, never on top. The Guide allows overlays only "for the purposes of obtaining user consent or playback controls… so long as they do not conflict with the YouTube player UI elements".
- **Background play:** ✅ Policies III.I bans playing from "a player that is not displayed in the page, tab, or screen that the user is viewing". 🔵 Android WebView keeps playing audio after the app goes to the background unless you pause it. Call `pauseVideo()` (and `WebView.onPause()`) when the app is hidden. Test on each platform.

**Alternatives:**

| Approach | Escape level | Policy | Notes |
|---|---|---|---|
| **Embed + `rel=0` + own "next" below + filter unplayables (recommended)** | Reduced | ✅ | Best available |
| Intercept logo link → open in browser | Reduced more | ✗ Guide: must open YouTube app if installed | research.md 6 was wrong here |
| Confirm dialog before leaving | Reduced | ❓ likely "interfering" | Don't |
| `controls=0` + custom controls | Hides some links? No: logo/title still appear | ✗ Guide: don't block standard features | Don't |
| Hide end screen with your own overlay | Removes related videos | ✗ RMF overlays, Guide "Disabling or blocking Related Video links" | Don't |

**How competitors handle it:**
- **YouTube's own embeds:** end screen with related videos; "More videos" row when paused 🔵 (seen in practice, not documented).
- **SyncStudy:** claims to remove "sidebar recommendations, comments, and autoplay" 🟡. The sidebar and comments are yours to omit; the player's end screen isn't removable, so I assume they don't remove it ❓.
- **Capacitor/React Native/Flutter apps:** many hit Error 153 since late 2025 🟡 ([Capacitor plugin issue #49](https://github.com/Cap-go/capacitor-youtube-player/issues/49), [react-native-webview #3889](https://github.com/react-native-webview/react-native-webview/issues/3889), [flutter_inappwebview #2740](https://github.com/pichillilorenzo/flutter_inappwebview/issues/2740)).
- **android-youtube-player** users were removed from Play under "Device and Network Abuse" for YouTube ToS reasons (2019, 2021; suspected ad bypass) 🟡 [issue #791](https://github.com/PierfrancescoSoffritti/android-youtube-player/issues/791), [#192](https://github.com/PierfrancescoSoffritti/android-youtube-player/issues/192).

**Sources:** ✅ RMF (Referer, WebView types, size, autoplay, overlays, mouseovers); ✅ Params; ✅ IFrame API (`onError` codes, `seekTo`); ✅ Guide (links, related videos, overlays, background play); ✅ Policies III.I; 🟡 developer issues and blog posts above.

**Risks:**
- Policy: any blocking of player links or end screen (High, avoid by design).
- Technical: Error 153 per platform (Medium, see 19); background audio on Android (Low, test).
- Product: escapes can't be eliminated. The pitch must say "fewer temptations", not "locked" (research.md 6 already said this).

**Needs testing:** escape rate (how often users leave via the player) per platform; whether end-screen suggestions with `rel=0` stay on topic for lecture channels; 153 fixes on real devices; background pause on Android and iOS.

**Effort for a solo developer:** Medium (player wrapper, identity fix per platform, error handling).

**Risk level:** Medium (escapes are a product risk you can't close).

---

## 17. YouTube comments and chapters inside the app

**Possible?** Yes for both, with rules. Comments: allowed read-only, 1 unit per call, with display rules and no long storage. Chapters: no API field, but parsing the description at display time and seeking with `seekTo` is allowed.

**Best way:**
- **Comments: off by default in study modes, one tap to open.** 🔵 Comments are where the distraction is (links, jokes, arguments), but also where students find corrections and doubt answers. A collapsed "YouTube comments" tap below the notes area keeps them available without pulling attention.
  - Fetch with `commentThreads.list?videoId=…&order=relevance&textFormat=plainText&maxResults=20` ✅ [commentThreads.list](https://developers.google.com/youtube/v3/docs/commentThreads/list): **1 unit per call**, 1–100 per page. `searchTerms` can pull comments containing words (e.g. "doubt", "timestamp") ✅.
  - RMF display rules ✅: show "the full text of a comment" or truncate with an easy way to see all of it; show the channel name of the uploader; show the video title.
  - **Don't store comments.** They are API data (30-day cap, III.E.4.d) and contain other people's personal data (names, avatars). 🔵 Fetch on open, keep in memory only.
  - **Don't filter comments with your classifier.** 🔵 III.I bans modifying "data, or content made available as part of… YouTube API Services". Ordering by YouTube's `relevance` is YouTube's choice, not yours. If you ever hide some, it's the same Permitted Feature Limitation duty as search: "N hidden by [App] · Show".
  - Comments disabled: `commentsDisabled` error ✅ ([revision history](https://developers.google.com/youtube/v3/revision_history)); show nothing, not an error.
  - Moderation: `moderationStatus` other than `published` needs authorised owner access ✅. Not relevant; you only read public comments.
  - Writing comments: skip. It needs OAuth, RMF rules for adding comments, and more audit scrutiny. 🔵
  - **Mission check:** 🔵 reading comments is a distraction risk; posting is worse. Read-only, collapsed, is the smallest version that still helps.
- **Chapters:**
  - ✅ No `chapters` field in the [videos resource](https://developers.google.com/youtube/v3/docs/videos) (research.md 17.5 agrees). Parse timestamps (`0:00 Intro`, `12:30 Article 19`) from `snippet.description` at display time.
  - ✅ YouTube's own rule for chapters: first timestamp "starts with 00:00", "at least three timestamps listed in ascending order", minimum chapter length "10 seconds" ([YouTube Help](https://support.google.com/youtube/answer/9884579)). Use the same rule to avoid false chapters.
  - Seek with `player.seekTo(seconds, true)` ✅ IFrame API; "the player will look for the closest keyframe… usually no more than around two seconds" ✅ Params (`start`).
  - 🔵 Presenting the uploader's own description timestamps as tappable links is presentation of API data, not new or derived data. Low risk. Don't store the parsed list longer than 30 days; re-parse on load.
  - 🔵 The embedded player itself may show chapter names on its progress bar ❓ (not documented; check in prototype). If so, your list is a convenience, not a replacement.
  - Auto-generated chapters (YouTube's "key moments") aren't exposed in the API ❓. Only creator-written timestamps work.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **Comments collapsed, read-only, not stored (recommended)** | Available when useful, not in the way | 1 unit per open; some distraction |
| Comments always visible (like YouTube) | Familiar | Main distraction source; more links out |
| No comments at all | Simplest, mission-pure | Loses doubt answers and errata; 🔵 allowed (comments aren't RMF-required), but disclose as a limitation if the mode removes them |
| Only "doubt/timestamp" comments via `searchTerms` | Focused | Your selection ≈ filtering; disclose it; may miss useful comments |
| **Chapters parsed from description (recommended)** | Free (already fetched), strong for lectures | Only when creators add them |
| Chapters from transcripts/AI | Would cover more videos | ✗ Can't read captions of others' videos (research.md 3); AI over API data = derived data |

**How competitors handle it:**
- **SyncStudy:** removes comments 🟡; "Courses auto-organize into chapters via AI structuring" 🟡 (on playlists, unclear how).
- **Unhook:** comments toggle (hide) on youtube.com 🟡.
- **YouTube:** comments under the video; chapters in the progress bar and description.

**Sources:** ✅ commentThreads.list; ✅ RMF "Displaying comments"; ✅ Policies III.E.4, III.I; ✅ videos resource; ✅ IFrame API seekTo; 🟡 YouTube Help on chapters.

**Risks:**
- Legal: comments hold third-party personal data; don't store them (DPDP-safe too). 🔵
- Policy: filtering comments (Medium if done silently).
- Product: comments pull attention (keep collapsed); chapter parsing false positives (low).
- Quota: 1 unit per comment open, from the 10,000 bucket. Fine.

**Needs testing:** how often users open comments, and whether sessions with comments open end in escapes; share of lecture videos in the four fields with usable description timestamps; whether the embed shows chapter names natively.

**Effort for a solo developer:** Low (both are one call or a regex plus UI).

**Risk level:** Low.

---

## 18. Notes, timestamp bookmarks, "mark as studied", "Done for today"

**Possible?** Yes. Notes, bookmarks and "studied" are your user's data. The one real limit is the **ban on rewards for watching**: no coins, points or streaks earned by watching.

**Best way:**
- **What to store long-term:** user ID, video ID, timestamp (seconds), note text, "studied" flag, dates. 🔵 The video ID came from the API, and III.E.4 has no ID exception (research.md 16). Common practice: keep IDs, **re-fetch title, thumbnail and channel name when showing them** (`videos.list`, 1 unit per 50 IDs ✅). This also meets III.E.4.e/f ("most updated API Data").
- **Offline:** notes text is yours, so keep it offline without limit. A cached title/thumbnail on the device is API data: keep ≤ 30 days, refresh when online ✅ III.E.4.d. If a video is later deleted or made private (`videos.list` returns nothing, or player `onError` 100 ✅), keep the note, show "This video is no longer available on YouTube".
- **Export:** Markdown/PDF of the user's notes, each with a link `https://www.youtube.com/watch?v=ID&t=123s`. 🔵 A file the user takes away is their copy, not your store. Include the title only as fetched at export time. Low risk.
- **Deletion:** a "Delete my data" button; delete within **7 days** ✅ III.E.4.g, and say that deleting your data "does not, in any way, affect data stored by YouTube" ✅ (Policies wording). Note: the Guide says "within 30 days" for the same thing; the Policies' 7 days is stricter, so follow it. (Also DPDP.)
- **Notes UI placement:** beside or below the player, never over it ✅ RMF overlays. "Add timestamp" reads `player.getCurrentTime()` ✅ IFrame API; tapping a bookmark calls `seekTo`.
- **"Mark as studied":** a user action about *their own* learning. ✅ Fine as a tool and signal. **Not fine:** coins, points, badges, leaderboards or streaks **earned by watching**. ✅ Policies III.F: "must not offer or provide incentives, rewards, or other compensation to users for engaging with YouTube Applications… by performing actions like viewing content"; ✅ Guide: don't "Incentivize, reward… users for watching a video. A user's decision to watch a video needs to be their own choice." 🔵 "YouTube Applications" is defined to *exclude* API services, so watching in your embed may technically not be covered by III.F, but the Guide line has no such limit. Treat any watch-based reward as banned. A streak for "days you wrote notes" or "days you studied" (by your own measures) is safer, but ❓ grey if in practice it rewards watching. Simplest: no gamification.
- **"Done for today" screen:** your own data only (time in app, notes written, items marked studied, topics covered), plus the optional "Was today's time useful?". ✅ Metrics from your own data are fine; don't mix in YouTube view counts or likes (III.E.4.h, Guide "Combine data from YouTube's API with data from other sources"). It must not lock the app or stop playback (III.F.3 gating). "Keep going" stays one tap. 🔵
- **For minors later:** storing notes is fine with parental consent; using them to rank is behaviour learning (research.md 16).

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| **IDs + your data stored; titles re-fetched (recommended)** | Meets III.E.4.d/e/f; cheap | Needs network to show titles; deleted videos show as "unavailable" |
| Store titles with notes forever | Works offline | ✗ III.E.4.d (30 days) |
| Local-only notes (no server) | Least data risk | No sync across 4 platforms; loses the "signals" used for ranking |
| Gamified (coins, streaks for watching) | Engagement | ✗ III.F / Guide incentive ban; against the mission |

**How competitors handle it:**
- **SyncStudy:** "Timestamped notes linked to exact video seconds", markdown notes, export, "34 completed, 6 to go" progress, daily planner; free plus Pro ₹99/month (research.md 2). 🟡 [syncstudy.in](https://www.syncstudy.in/)
- **LearnTube India:** timestamp notes, quizzes, **coin rewards** (research.md 2 ✅ their blog). 🔵 Coins tied to watching conflict with III.F.
- **YourTube – Study Mode** (extension): coins and leaderboard 🟡. Same concern (it's an extension, so the API policies may not bind it).
- **StudyTube (Play):** "Video bookmarks", "Video progress tracking", study planner, reminders, app blocker (AccessibilityService). No notes listed. ✅ [Play listing](https://play.google.com/store/apps/details?id=com.thecodefuel.studytube&hl=en_US), updated 11 Sept 2026. A Sept 2026 review mentions a "Download" option for videos 🟡. 🔵 If that downloads YouTube videos, it breaks the Guide ("Allow users to download videos for offline play outside of the YT Premium experience") and Apple 5.2.3.
- **YouTube:** Save / Watch later / playlists, resume position. 🔵 No private per-video notes or timestamp bookmarks that I know of ❓. This is a clear independent-value point for III.I.1.

**Sources:** ✅ Policies III.E.4.d–h, III.F; ✅ Guide (incentives, download, 30-day deletion line); ✅ RMF overlays; ✅ IFrame API `getCurrentTime`/`seekTo`/`onError`; ✅ StudyTube Play listing; 🟡 SyncStudy site.

**Risks:**
- Policy: video IDs kept long-term (Low–Medium, unchanged from research.md 16); any gamification (Medium–High).
- Legal: notes are personal data under DPDP; deletion within 7 days.
- Product: users expect offline titles; handle stale caches gracefully.

**Needs testing:** do users write notes at all (the signal plan depends on it); is "mark as studied" tapped without a reward; does "Done for today" feel like a nice ending or like a nag.

**Effort for a solo developer:** Medium (sync, offline, export and deletion across platforms add up).

**Risk level:** Low (if no rewards for watching).

---

## 19. Runs on Windows, Mac, Android and iPhone

**Possible?** Yes. Every option embeds the player in a web view, so every option has to solve the same identity problem (Error 153). The simplest path is **one web app (PWA) everywhere, wrapped for stores where needed**. The riskiest is **Tauri**, with an open, unsolved 153 issue.

**Best way (🔵, based on the sources below):**
1. **Web app / PWA first** for all four platforms. In a real browser (Chrome, Edge, Safari) the Referer is set automatically, so 153 doesn't happen unless you set a bad `Referrer-Policy` ✅ RMF. Windows and Mac users install it from Chrome/Edge; iPhone users "Add to Home Screen".
2. **Android store listing: Trusted Web Activity (TWA)** 🔵. It runs your site in Chrome, not a WebView, so the Referer is your domain. Player links open like in Chrome (YouTube app). Needs testing, but it avoids the WebView problem entirely. Microsoft Store also accepts PWAs (PWABuilder) 🟡.
3. **iPhone store listing (later): Capacitor** with the player in a page loaded via `loadHTMLString:baseURL:` using `https://<bundle ID>`, as the RMF describes ✅, or via a native plugin that does this. 🟡 Capacitor's own `capacitor://localhost` scheme gives no valid Referer, and `patchRefererHeader` doesn't fix plugin WebViews ([issue #49](https://github.com/Cap-go/capacitor-youtube-player/issues/49)). Apple 4.2 ("elevate it beyond a repackaged website") applies, so the iOS build needs app-like features (offline notes, notifications).
4. **Desktop app shell only if a PWA isn't enough.** If you need one, Electron sets the Referer reliably (request header hooks) 🔵; Tauri doesn't yet (below).

**Alternatives (for embedding the IFrame player specifically):**

| Option | Windows | Mac | Android | iPhone | Player / 153 status | Store rules | Solo effort |
|---|---|---|---|---|---|---|---|
| **PWA** | ✅ via Chrome/Edge | ✅ via Chrome/Safari | ✅ | ✅ Safari, `playsinline=1` | **Works**: browser sets Referer ✅ RMF | No store (TWA for Play) | **Low** |
| **PWA + TWA (Play)** | — | — | ✅ | — | Chrome engine, works 🔵 | Play: normal review | Low |
| **Capacitor** | ✗ (no official desktop) | ✗ | ✅ | ✅ | 153 on iOS by default 🟡; fix via `baseURL`/Referer = app ID ✅ RMF | Apple 4.2 thin-wrapper risk | Medium |
| **Tauri 2** (desktop + mobile) | WebView2 | WKWebView | Android WebView | WKWebView | **153 in production, open issue since 5 Nov 2025, no maintainer fix** 🟡 [tauri #14422](https://github.com/tauri-apps/tauri/issues/14422); same reported July 2026 🟡 [gramax #821](https://github.com/Gram-ax/gramax/issues/821). `tauri://localhost` has no valid Referer; the localhost plugin fixes YouTube but breaks IPC | Same store rules | Medium–High |
| **Electron** (desktop only) | ✅ | ✅ | — | — | Can set Referer on requests 🔵 (RMF's .NET/macOS advice is the same idea) | Big app size | Medium |
| **React Native** | (RN Windows/macOS exist, weaker) | same | ✅ | ✅ | WebView; 153 unless you load HTML with `baseUrl` + Referer 🟡 ([react-native-webview #3889](https://github.com/react-native-webview/react-native-webview/issues/3889)) | Normal | High (separate web app) |
| **Flutter** | ✅ | ✅ | ✅ | ✅ | WebView-based players; 153 reports 🟡 ([flutter_inappwebview #2740](https://github.com/pichillilorenzo/flutter_inappwebview/issues/2740)); set `baseUrl`/Referer | Normal | High (Dart, new stack) |
| Native Kotlin + Swift | — | — | ✅ | ✅ | RMF examples are native ✅ | Normal | Too high for one person |

**Store review rules for YouTube-based apps:**
- **Apple** ✅ [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (updated 8 June 2026):
  - 5.2.3: no ability to "save, convert, or download media from third-party sources (e.g. … YouTube…) without explicit authorization… Streaming of audio/video content may also violate Terms of Use, so be sure to check before your app accesses those services. Authorization must be provided upon request."
  - 5.2.2: if your app "displays content from a third-party service, ensure that you are specifically permitted to do so under the service's terms of use."
  - 🔵 Your authorisation is the YouTube API Terms (embedded player is allowed without special approval, ✅ Policies: "The YouTube IFrame Player API service… does not require authorization"). Keep a short compliance note ready for App Review.
  - 4.2 minimum functionality, 4.2.2 no "content aggregators, or a collection of links", 4.1 copycats, 5.2.1 no third-party trademarks. 🔵 4.2.2 is the one to watch: the app must be more than a list of YouTube links (notes, goals and progress make it so).
- **Google Play:** 🟡 Enforcement emails quoted the Device and Network Abuse policy: "your app shouldn't download, monetize, or access YouTube videos in a way that violates the YouTube Terms of Service" ([issue #791](https://github.com/PierfrancescoSoffritti/android-youtube-player/issues/791), 2021). The current policy page no longer contains that YouTube example (I checked; ❓ whether it moved). The Intellectual Property policy bans apps that infringe or help infringe 🟡 [Play IP policy](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en). 🔵 In practice: no downloads, no ad blocking, no background play, own name and icon.

**How StudyTube ships** (✅ [Play listing](https://play.google.com/store/apps/details?id=com.thecodefuel.studytube&hl=en_US), 🟡 AppBrain):
- Android only; listed as "StudyTube – Study Planner & Focus" by The CodeFuel; **50K+ downloads, 4.2★ (1.13K reviews)**, updated 11 Sept 2026, on Play since April 2023; version 1.5.11; APK 55.4 MB; in-app purchases; "NO ads" (AppBrain); Data safety says "No data collected" and "No data shared".
- Uses Android AccessibilityService for its app/website blocker (disclosed in the listing).
- ❓ Framework and player library unknown (AppBrain didn't list libraries). 🔵 The 55 MB size hints at a cross-platform framework (Flutter/React Native), not proof.
- 🔵 Note research.md 2 recorded "~47k downloads, 4.36★ (800 ratings)"; the listing now shows 50K+, 4.2★ / 1.13K reviews (AppBrain: 55K, 4.44 on 950). Numbers have moved; no contradiction.

**Sources:** ✅ RMF (identity, WebView types); ✅ IFrame API error 153; ✅ Apple guidelines; 🟡 GitHub issues (Tauri, Capacitor, RN, Flutter); 🟡 Play enforcement quotes; ✅ StudyTube listing.

**Risks:**
- Technical: 153 per platform (High for Tauri today; Medium for Capacitor/RN/Flutter; Low for PWA/TWA). YouTube may add "additional credentials… for API Clients with a high number of requests" ✅ RMF. Future change risk.
- Store: Apple 4.2/4.2.2 for a thin iOS wrapper (Medium); Play takedown if any YouTube rule is broken (High impact, avoidable).
- Product: iOS PWA install is manual; no App Store discovery at first.

**Needs testing:** PWA player on iPhone Safari (inline play, fullscreen, links to the YouTube app); TWA on Android (player links, background pause); Capacitor iOS with `baseURL = https://<bundle ID>`; Tauri on Windows with a WebView2 header hook, only if Tauri is still wanted.

**Effort for a solo developer:** Low for PWA (+TWA); Medium to add Capacitor for iOS; High for Flutter/RN/native.

**Risk level:** Low (PWA/TWA) to High (Tauri today).

---

## Open questions for the user

1. **Guide ban on inferring content type** (finding 2): do you want to treat this as the trigger for the "labels ruled out" worst case now, or ask in the compliance audit form (the Guide itself says to apply for an audit when unsure)?
2. **Gamification:** OK to drop coins/points/streaks for watching entirely (III.F)?
3. **Comments:** collapsed and read-only by default, or off entirely in Aspirant mode?
4. **First store:** PWA + TWA (Play) first, iOS store later via Capacitor?

---

# Group: Law, age groups and international

Research date: 26–27 Sept 2026. Not legal advice. Items marked **Lawyer** need one.

Primary texts read for this group:
- DPDP Rules 2025, G.S.R. 846(E), official Gazette PDF on MeitY: <https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf> (English text also at <https://www.dpdpa.com/DPDP_Rules_2025_English_only.pdf>).
- DPDP Act 2023, official PDF on MeitY: <https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf>.
- PIB explainer: <https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf>.

---

## 14. 18+ accounts at launch; parent-first family account for under-18s later

**Possible?** Yes. Nothing in the Act or Rules bans an 18+-only service or requires hard age verification of every user. The parent-first flow is exactly Rule 10's Cases 3 and 4. The one grey area is how much "due diligence" an 18+ gate needs; that needs a lawyer.

### What the law says (primary text)

| Point | Label |
|---|---|
| "child" = an individual who has not completed 18 (Act s.2(f)). | ✅ Act |
| s.9(1): verifiable parental consent "before processing any personal data of a child". s.9(2): no processing "likely to cause any detrimental effect on the well-being of a child". s.9(3): no "tracking or behavioural monitoring of children or targeted advertising directed at children". s.9(5): government may notify a "verifiably safe" fiduciary and an age above which it is exempt. None notified that I found. | ✅ Act; "none notified" ❓ |
| Rule 10(1): the fiduciary must "adopt appropriate technical and organisational measures to ensure that verifiable consent of the parent is obtained" and "observe due diligence, for checking that the individual identifying herself as the parent is an adult who is identifiable", by reference to (a) "reliable details of identity and age… available with the Data Fiduciary" or (b) details "voluntarily provided (i) by the individual; or (ii) through a virtual token mapped to such details, which is issued by an authorised entity". | ✅ Rules |
| "Authorised entity" includes an entity entrusted by law/government to issue identity and age details or a token, a person it permits, and details or token "made available and verified by a Digital Locker Service Provider". | ✅ Rule 10(2)(b) |
| Rule 10 checks the **parent**. It says nothing about checking the child's own age. | ✅ (absence in text) |
| **Fourth Schedule Part B entry 6**: s.9(1) and 9(3) do not apply to processing "for confirmation by the Data Fiduciary that the Data Principal is not a child and observance of due diligence under rule 10", "restricted to the extent necessary". So running an age check on everyone is itself lawful without parental consent. | ✅ Rules. research.md does not mention this entry. |
| Part B entry 5: processing to keep harmful information, service or ads "not accessible to the child", to the extent necessary. | ✅ |
| Part A entry 3: an "educational institution" may do tracking and behavioural monitoring for its educational activities or children's safety. Note (c) defines educational institution as "an institution of learning that imparts education, including vocational education". | ✅ Rules. research.md said this was unsettled; the definition exists, but whether a YouTube-feed app is an "institution of learning" is still a **Lawyer** question. 🔵 I'd assume no. |
| **Commencement.** Rule 1: Rules 1, 2, 17–21 from publication; Rule 4 (Consent Managers) "one year after"; Rules 3, 5–16, 22, 23 (incl. Rules 10–12) "eighteen months after the date of publication of this Gazette". The Gazette is dated **Thursday 13 November 2025**, but its e-Gazette ID is CG-DL-E-**14112025**. | ✅ Gazette PDF |
| So: Consent Manager rule from **13 Nov 2026**; children's duties from **13 May 2027**. Many firms say 14 Nov 2026 / 14 May 2027 (e.g. Shardul Amarchand). Plan for **13 May 2027**, the earlier date. | ✅ + 🟡 [AMSS](https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/) |
| MeitY floated shortening 18 months to 12 for Significant Data Fiduciaries (Jan 2026). No amending notification found as of Sept 2026. A small app won't be an SDF anyway. | 🟡 search summaries; ❓ not confirmed in Gazette |
| MeitY DPDP FAQs or age-assurance guidance since Nov 2025: **I found none.** The only MeitY FAQ found (Feb 2026) is on the IT Rules amendment, not DPDP. | ❓ |
| Penalty cap for child obligations: ₹200 crore. | ✅ PIB explainer |

### Rule 10 illustrations: the parent-first flow is already written down

The Rule's own illustration has four cases (✅ text):

| Case | Who starts | Parent already a verified user? | What the app must do |
|---|---|---|---|
| 1 | Child declares she's a child and names parent | Yes | Confirm it holds "reliable identity and age details" of P |
| 2 | Child | No | Check P against government-issued identity/age details or a virtual token; P "may" use DigiLocker |
| **3** | **Parent opens account for child** | **Yes** | Confirm it holds reliable identity and age details of P |
| **4** | **Parent opens account for child** | **No** | As Case 2 |

🔵 Your "parent-first family account" is Case 3/4. Case 3 is the cheap one: if the parent is already an 18+ user whose age you checked properly (not just a typed date), no new check is needed. That argues for checking adult ages with a real signal at launch, or at least at the moment an adult first adds a child.

🔵 Open question for a lawyer: does a self-declared DOB from an adult count as "reliable details of identity and age"? The word "reliable" suggests not. If not, Case 3 collapses into Case 4 and every parent needs a token check.

### What "due diligence" means for an 18+ gate

Nothing in the Act or Rules says. Commentary splits:

| View | Source |
|---|---|
| The Act and Rules "don't require data fiduciaries… to collect or verify minors' ages"; they require verified parental consent and due diligence on the parent. | 🟡 [The Tech Trace](https://thetechtrace.substack.com/p/edition-32-whatsapp-tests-age-self-declaration-in-india) (Aug 2026) |
| Part B entry 6 exempts an age check that no provision actually mandates (Aparna Gaur, Trace Law Partners). | 🟡 quoted in a search summary; original article not read |
| Self-declared age gates are "insufficient" for platforms likely used by minors. | 🟡 [Legal 500](https://www.legal500.com/developments/thought-leadership/data-privacy-risks-for-gaming-fantasy-sports-and-online-platforms-under-indias-dpdp-regime-behavioural-profiling-consent-and-compliance/) |
| Market signal: WhatsApp is testing an optional "When were you born?" prompt for Indian numbers, citing DPDP (reported 3 Aug 2026). | 🟡 The Tech Trace |

🔵 My reading: self-declaration plus active use of the signals you already have (class/exam words in the goal, "boards 2027", school timetable) is a defensible floor for an app that doesn't target minors. The risk rises if the marketing, content or users skew young (e.g. NEET, which your test fields include). "Knew or should have known" is the likely test, but that is my inference, not the text. **Lawyer.**

### Age-signal and token options

| Option | What it gives | India status | Cost | Label |
|---|---|---|---|---|
| **Self-declared DOB + goal-text signals** | Weak signal | Works | ~0 | 🔵 |
| **Google Play Age Signals API (beta)** | Age band (0-12, 13-15, 16-17, 18+, or custom) and source tier: A self-declared, B parent-managed, C assessed (card, email, selfie, ID), D ID+selfie or digital ID | Google lists signals only for **Brazil** (from 17 Mar 2026, Digital ECA) and **Texas** (accounts after 28 May 2026). India not listed. Terms: use only "to provide age-appropriate content and experiences in compliance with laws"; no ads, profiling or analytics. | Free | ✅ [overview](https://developer.android.com/google/play/age-signals/overview), [responses](https://developer.android.com/google/play/age-signals/understand-age-signals-responses) |
| **Apple Declared Age Range API** | Age range plus how it was declared (self, guardian, ID-checked, payment-checked) | "Available worldwide"; age categories required by law are shared only in certain regions; elsewhere only if the person chose to share | Free | ✅ [Apple Q&A](https://developer.apple.com/support/age-assurance), [docs](https://developer.apple.com/documentation/declaredagerange) |
| **DigiLocker via aggregator** (Setu, Cashfree, Surepass, Digio, IDfy, HyperVerge, Hypersign) | Verified DOB and name from Aadhaar/other docs | Live; OAuth consent flow | ~₹3 (MediaNama 2025 estimate); ~₹5 Setu (reported, unpublished); ₹6, or ₹15 with face match, plus ₹7,500/month minimum (Hypersign, own rate card) | ✅ [Cashfree](https://www.cashfree.com/digilocker-api/) returns DOB; prices 🟡 [MediaNama](https://www.medianama.com/2025/03/223-how-much-does-parental-consent-verification-cost-under-indias-dpdp-act/), [Hypersign](https://hypersign.id/resources/blog/best-aadhaar-verification-api-providers) (vendor) |
| **DigiLocker directly** (API Setu requester) | Same | Needs onboarding as a requester org | ❓ | ❓ [API Setu](https://apisetu.gov.in/digilocker) |
| **New Aadhaar app, offline verifiable credential** | Selective sharing, e.g. "age status" without full DOB; offline face check. A minor can be added under a guardian whose relationship was set at enrolment. | Launched Jan 2026; the verifier must register with UIDAI as an OVSE | ❓ fee | ✅ [UIDAI app FAQ](https://uidai.gov.in/en/aadhaar-app-faq) for minors/guardian; selective age sharing 🟡 |
| **DigiLocker "age token"** (yes/no over-18 token) | Privacy-preserving yes/no | **Not live.** Andhra Pradesh is "exploring" it for 13–16 social media limits | — | 🟡 [MediaNama, Apr 2026](https://www.medianama.com/2026/04/223-andhra-pradesh-explores-digilocker-age-tokens-social-media-curbs-children-aged-13-16/) |

🔵 The Aadhaar app's guardian link is interesting for the family account later: it may prove the parent–child *relationship*, which Rule 10 doesn't strictly require but which is the obvious weak spot (any adult can claim to be the parent).

### Consent managers (Rule 4, First Schedule)

- s.6(7): a user "may" give, manage, review or withdraw consent through a Consent Manager. Optional for the fiduciary. ✅ Act
- Rule 4 in force 13 Nov 2026, so **no Consent Manager can be registered yet**. Conditions: Indian company, net worth ≥ ₹2 crore, independent certification, must not be able to read the data, records kept 7 years. ✅ First Schedule
- The First Schedule illustration is about banks sharing statements. Nothing ties Consent Managers to parental consent.
- 🔵 A small app gains nothing by using one at launch. Revisit only if a registered Consent Manager later offers a cheap parental-consent product.

### Google Play and Apple rules if under-18s come later

| Store | Rule | Label |
|---|---|---|
| Play | You declare target age groups. If any target group is children, the Families policy applies: content suitable for children, disclose data collection, no AAID/device IDs from children or unknown-age users, only Families self-certified ad SDKs, no interest-based ads, and a "neutral age screen" for mixed audiences. Imagery aimed at children can override your declaration. | ✅ [Families policy](https://support.google.com/googleplay/android-developer/answer/9893335) |
| Play | Which ages count as "children" for Families: I believe under 13, but I did not confirm the exact line. Teens 13–17 may still fall outside Families while being "children" under DPDP. | ❓ |
| Apple | Age ratings now 4+, 9+, 13+, 16+, 18+. New questionnaire answers were due by 31 Jan 2026. It asks about Parental Controls, **Age Assurance**, Unrestricted Web Access, **User-Generated Content**, Social Media. | ✅ [Apple news](https://developer.apple.com/news/?id=ks775ehf), [definitions](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/) |

🔵 YouTube videos are user-generated content, so the questionnaire's UGC answer probably applies even with your filter. Expect a 13+ or 16+ rating, not 4+.

**Best way:** Launch with a neutral age screen (DOB, no hint of the "right" answer) plus the goal-text minor signals. On Android and iOS, also read Play Age Signals and Declared Age Range where they return data (free; mostly not India yet). Keep the age check to the minimum needed so it stays within Fourth Schedule Part B entry 6. Build the family account as Rule 10 Case 3/4: parent signs up, is age-checked through a DigiLocker aggregator (~₹3–15 per check), then creates the child profile with the behaviour layer hard-off. Ship it before 13 May 2027.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Self-declared 18+ gate + signals (recommended at launch) | Near-zero cost and drop-off | Weakest "due diligence"; risk if users skew young |
| DigiLocker check for **every** adult at sign-up | Strong evidence; makes Case 3 free later | ₹3–15 per user; heavy drop-off; collecting ID data from adults who didn't need it may breach data minimisation |
| DigiLocker check only when a signal fires (goal text, reports) | Targets effort | Needs a lawyer to agree it's enough |
| Parent-first family account (later) | Matches Rule 10 illustrations exactly | Parents without DigiLocker; guardians who aren't parents; proving the relationship |
| Child-first request, parent approves (Case 1/2) | Lets a teen start the flow | More screens; still needs parent's check |
| Register as or use a Consent Manager | — | Not possible before 13 Nov 2026; ₹2 crore net worth; no benefit |

**How competitors handle it** (✅ read on their own pages unless marked):

| Company | Approach |
|---|---|
| Physics Wallah | Consent "deemed" given by parents; "implied" at registration. (research.md, re-used) |
| Unacademy | Only a parent may register for a minor; consent "assumed". (research.md) |
| **Allen** | Minors "not eligible to register"; use "shall be made available… by your legal guardian or parents"; "it is assumed that he/she has obtained the consent". [allen.in/privacy-policy](https://allen.in/privacy-policy) ✅ |
| **Byju's** (tablet policy) | The registering user consents "on behalf of yourself and/or a Child User"; no verification described. [byjus.com/tnc-learnstation-india](https://byjus.com/tnc-learnstation-india/) ✅. Main app policy page didn't load (JS). ❓ |
| **Vedantu** | Policy dated 8 Feb 2024; "the parent/guardian for and on behalf of the user, consents" (for publicising results). No verification described. [vedantu.com/privacy-policy](https://www.vedantu.com/privacy-policy) ✅ |
| WhatsApp | Testing optional DOB prompt in India. 🟡 |

None of the five describes a verified parental-consent step today. All will need to change by May 2027.

**Sources:** listed inline above.

**Risks:**
- Legal: a minor passes the self-declared gate and the app processes their data, which is a s.9(1) breach (cap ₹200 crore). Worse if NEET marketing draws 17-year-olds. **Lawyer:** is self-declaration + signals enough?
- Legal: whether an adult's self-declared age counts as "reliable details" for Case 3. **Lawyer.**
- Legal: relationship check (any adult can claim to be the parent). **Lawyer.**
- Product: DigiLocker friction for parents; drop-off unknown in India.
- Technical: aggregator lock-in and monthly minimums.

**Needs testing:** drop-off at the DOB screen; how often goal-text signals fire; DigiLocker completion rate for parents; whether Play/Apple signals return anything for Indian accounts.

**Effort for a solo developer:** Low at launch (DOB screen + signal rules); Medium–High for the family account (aggregator integration, consent records, withdrawal, audit trail).

**Risk level:** Medium (the gate is legal but its sufficiency is untested; the NEET test field raises it).

---
## 21. Later: kids and other age groups

**Possible?** Partly. A kids or teen mode is lawful in India if it is settings-and-context only, with verified parental consent. A feed that learns from a minor's behaviour is **No** in India (s.9(3)) unless the educational-institution exemption applies, which I doubt for this app. Kids content through the API is possible (Made for Kids videos are in the normal Data API), but there is **no YouTube Kids API**.

### YouTube API rules (✅ [Developer Policies](https://developers.google.com/youtube/terms/developer-policies), raw page read)

| Rule | Text |
|---|---|
| Scope of III.J | An API client that "targets or directs itself to children (as defined under applicable law(s) including the U.S. Children's Online Privacy (COPPA) and E.U. General Data Protection Regulation (GDPR))". |
| Duties | Comply with COPPA, GDPR "and any other applicable laws"; "notify Google of the child directed nature… using the tools provided"; no personalised ads or remarketing. |
| No write actions | Must not "take any YouTube API Services write-based actions" and must not "enable, encourage or require" users to (uploading, commenting, creating/sharing playlists). |
| Every embed (not just kids mode) | "API Clients must look up the Made For Kids status of each YouTube video that it embeds… For each video that is designated Made For Kids, API Clients must turn off tracking" and keep player data collection compliant with COPPA and GDPR. |
| Data | `videos.status.madeForKids` and `selfDeclaredMadeForKids` exist. `search.list` has **no** Made-for-Kids filter, so you must call `videos.list` on results. ✅ [videos](https://developers.google.com/youtube/v3/docs/videos), [search.list](https://developers.google.com/youtube/v3/docs/search/list) |
| YouTube Kids | No public API found. ❓ (absence; community threads agree) |

🔵 Two points not in research.md:
1. III.J defines "children" by "applicable law(s) including" COPPA and GDPR. Under DPDP a child is under 18. So a teen mode for 13–17-year-olds in India may make the app "child-directed" for III.J (no write actions, notify Google). Unclear. **Ask YouTube / lawyer.**
2. The MFK tracking rule already applies at launch to adults' feeds, because MFK videos can appear there. Your own analytics must switch off on those players.

### COPPA (US)

Amended rule published 22 Apr 2025, effective 23 June 2025; compliance by **22 April 2026** (except some safe-harbor parts). Adds separate verifiable parental consent for disclosing children's data to third parties (e.g. ads), a written retention policy, and biometrics and government IDs in "personal information". ✅ [Federal Register](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule) (via search summary of the FR notice), [FTC](https://www.ftc.gov/legal-library/browse/federal-register-notices/16-cfr-part-312-coppa-final-rule-amendments). Only matters if you serve US under-13s.

### What a kids/teen mode could lawfully do in India (🔵 my reading of ✅ texts)

| Feature | Status for under-18s |
|---|---|
| Harm filter (`safeSearch=strict`, age-restricted removed, your classifier) | OK. Fourth Schedule Part B entry 5 exempts it "to the extent necessary". |
| Feed from settings the parent/child chose (class, exam, subjects, mutes, channel lists) | Probably OK. Stated choices, not "monitoring". Needs parental consent for the account. |
| "Up next" from the current video only | Probably OK. No profile. |
| Aggregates from **adult** users applied by context ("people studying X found Y useful") | Probably OK if nothing about the child feeds it. **Lawyer.** |
| Notes, bookmarks, "studied" marks stored for the child | OK with parental consent as a feature. Not OK as ranking input. |
| Ranking from the child's watch history, skips, time of day | **Likely banned** (s.9(3)). |
| Streaks, stats, gamification | Grey area; commentators flag it. 🟡 |
| Ads targeted at children | Banned (s.9(3)); also Play Families and III.J. |
| Educational-institution exemption (Part A entry 3) | Only for "an institution of learning that imparts education". A YouTube-curation app probably isn't one. Partnering with a school or coaching institute that is one is the only route. **Lawyer.** |

**Is there any lawful way to personalise for minors?** Yes: explicit settings, the current context, and the harm filter. That matches your "behaviour layer off" decision. The EU guidelines point the same way ("prioritise explicit signals from children over behavioural signals" ✅ [Commission](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors)).

**Best way:** One app, one engine, with the behaviour layer hard-off for any child profile. Treat a kids mode (under 13) as a separate compliance track: III.J notice to Google, no write actions anywhere in that mode, MFK tracking off, Play Families policy. Start with teens (13–17, the JEE/NEET group) through the family account, and ask YouTube whether a teen-only mode triggers III.J.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Teen profiles inside the main app (settings + context only) | Serves JEE/NEET; one codebase | III.J may apply to the whole client if any part is child-directed ("or any part thereof") |
| Separate kids app / separate API client | Isolates III.J duties | Second listing, second audit, more work |
| Partner with schools/coaching (they are the "educational institution") | May unlock behaviour-based features | B2B sales; unclear if the exemption passes to a vendor |
| No minors ever | Simplest | Loses the students who most need it |

**How competitors handle it:** YouTube itself: YouTube Kids app, supervised teen accounts, no personalised ads to teens, limits on repeated body-image content (🟡 research.md s.11). Indian edtech: assumed parental consent (see 14). I found no YouTube-API study app that declares itself child-directed. ❓

**Sources:** inline above.

**Risks:**
- Legal: "any part thereof" in III.J could pull the whole client under child-directed rules once a kids mode exists.
- Legal: gamification and adult aggregates for minors are untested. **Lawyer.**
- Product: without behaviour learning, teen feeds depend fully on goal parsing and source lists.
- Technical: one extra `videos.list` call per result page for MFK status (1 unit per call, 50 IDs), already needed for other filters.

**Needs testing:** feed quality for teens with the behaviour layer off; share of MFK videos in study results (likely small for 16–17 exam content).

**Effort for a solo developer:** Medium for teen profiles (reuse engine, add flags); High for a true under-13 kids mode (separate policy track).

**Risk level:** Medium for teens; High for under-13.

---

## 22. Later: international launch

**Possible?** Partly. For **adults only**, most regimes below are manageable for a small app: many child-specific duties exempt micro/small firms or apply only to social platforms. Serving **minors** abroad is a separate project per country, and some countries (Brazil, Indonesia) reportedly ban plain self-declaration. The 18+-only design travels well; the family account does not travel as-is.

### Regime scan

| Place | What it requires | Applies to this app? (🔵) | Label |
|---|---|---|---|
| **EU GDPR Art. 8** | Parental consent for information-society services offered directly to a child under 16 (states may lower to 13) when consent is the legal basis | Only if minors are served | ✅ [gdpr-info.eu](https://gdpr-info.eu/art-8-gdpr/); country ages 🟡 |
| **EU DSA Art. 28** | Online platforms "accessible to minors" need "appropriate and proportionate measures" for minors' privacy, safety, security; no profiling-based ads to known minors; no duty to process extra data to assess age | **Art. 19: Section 3 (incl. Art. 28) "shall not apply" to micro or small enterprises** unless designated a VLOP. Also doubtful the app is a "platform" at all (it hosts no user uploads). **Lawyer.** | ✅ text via [mirror, Art. 28](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_28.html), [Art. 19](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_19.html) |
| **DSA Art. 28 guidelines** (14 July 2025) | "Prioritise explicit signals from children over behavioural signals"; age verification for adult content, age estimation for other risky services; apply to all platforms accessible to minors "with the exception of micro and small enterprises" | Not binding on you as a small firm; good design reference | ✅ [Commission page](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors) (read via summarising fetch) |
| **DSA Art. 38** | At least one recommender option "not based on profiling" | **Only VLOPs and VLOSEs** (45 million EU users). Not you. "Adults can switch the behaviour layer off" already matches it. | ✅ [Art. 38](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_38.html) |
| **EU → India data transfer** | As far as I know there is no EU adequacy decision for India, so SCCs are needed for EU users' data on Indian or US servers | Yes if EU adults sign up | 🔵 / ❓ not re-checked |
| **UK Children's Code** | 15 standards for services "likely to be accessed" by under-18s; Standard 12: profiling off by default | If UK teens are likely users | ✅ (research.md s.11) |
| **UK Online Safety Act** | Duties for user-to-user and search services. s.229: "search engine" does not include "a service which enables a person to search just one website or database" | Searching only YouTube is probably **not** a search service; no user-to-user features means probably out of scope. **Lawyer.** | 🟡 statute wording via search snippet (legislation.gov.uk blocked the fetch) |
| **US COPPA** | See 21. Under-13s only | Only if child-directed or with actual knowledge | ✅ |
| **California AADC** | Ninth Circuit (12 Mar 2026) narrowed the injunction: coverage definition and age-estimation provision **not** enjoined; data-use and dark-pattern limits still enjoined as likely vague; case back in district court | Covers businesses above CCPA thresholds; a solo app is likely below them. ❓ thresholds not re-checked | 🟡 [Cooley](https://www.cooley.com/news/insight/2026/2026-03-30-netchoice-v-bonta-ninth-circuit-narrows-injunction-against-californias-ageappropriate-design-code-act) |
| **US app-store laws** (Texas SB 2420, Utah, Louisiana) | App stores verify age and get parental consent; developers receive the store's age signal | Texas in force since 4 June 2026; Supreme Court declined to block it (6 July 2026). This is why Play and Apple return age signals there | 🟡 [SCOTUSblog](https://www.scotusblog.com/2026/07/supreme-court-allows-texas-to-enforce-law-requiring-age-verification-and-parental-consent-on-app/); Play's Texas note ✅ |
| **Brazil LGPD + ECA Digital** (Law 15.211/2025) | In force 17 Mar 2026; covers services "likely to be accessed" by under-18s wherever the provider is based; reported: self-declaration banned (Art. 9), no behavioural profiling for ads to minors; fines up to R$50m or 10% of Brazil revenue | Yes if Brazilian teens are likely users. Play Age Signals returns data in Brazil ✅ | 🟡 [Demarest](https://www.demarest.com.br/en/digital-statute-for-children-and-adolescents-law-no-15211-2025/), [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/03/brazil-regulates-the-children-and-adolescents-online-safety-act) |
| **Indonesia** PDP Law 27/2022 + GR 17/2025 ("PP Tunas") | Child = under 18; services likely used by children must risk-rate themselves; minimum ages by risk (reported 13 low, 16 high); parental consent; age inference expected; penalty grace period ends 27 Mar 2027 | Yes if Indonesian teens are likely users | 🟡 [Alta Advocates](https://altaadvocates.com/pp-tunas-indonesias-new-regulation-on-child-protection-in-digital-space/), [Jakarta Post](https://www.thejakartapost.com/indonesia/2026/03/10/indonesia-sets-three-month-deadline-for-online-child-safety-compliance) |
| **Australia** under-16 social media minimum age | In force from 10 Dec 2025; YouTube covered, YouTube Kids not; an "age-restricted social media platform" needs a significant purpose of online social interaction between users and must let users post material | 🔵 No posting or user-to-user interaction here, so **probably not covered**. Logged-out YouTube viewing (what the embedded player uses) was left open. | ❓ from memory; the eSafety page timed out and I couldn't re-verify |

### YouTube API by country

- `search.list` takes `regionCode`; region-blocked videos are already removed by an existing rule. ✅ [search.list](https://developers.google.com/youtube/v3/docs/search/list)
- Whether the API terms bar use in specific countries (e.g. sanctioned ones): **not checked this round.** ❓ Read the [API Services Terms](https://developers.google.com/youtube/terms/api-services-terms-of-service) before launching outside India.

### DPDP s.16 cross-border transfers (India)

- s.16(1): the government "may, by notification, restrict the transfer… to such country or territory outside India as may be so notified" (a blacklist). s.16(2): stricter sector laws still apply. ✅ Act
- Rule 15 (from 13 May 2027): transfers allowed, subject to any requirements the government sets by order on making data available to a foreign state or its agencies. ✅ Rules
- No blacklist notification found. ❓
- 🔵 Effect: sending data to a US LLM host (Groq/Fireworks) or US cloud is allowed unless the US is blacklisted. A minor's data abroad adds no new legal rule, but raises the stakes of any breach.

### Languages (point only; another group owns this)

🔵 After Hindi, English and Hinglish, the largest exam audiences point to Bengali, Marathi, Telugu, Tamil, Gujarati and Kannada. Each needs its own labelled test set. Mixed-script titles (e.g. Tamil + English) repeat the Hinglish problem, and low-resource languages will lean harder on the LLM fallback, which costs more per request.

**Best way:** Stay 18+ in every country at first. Start where adult-only is simple (UK, EU as a micro enterprise, US without under-13s). Add minors country by country, first where store age signals exist (Brazil, US app-store-law states), because they make age assurance cheap. Keep "explicit signals over behavioural signals" as the global design rule: it is the common thread across DPDP, the EU guidelines, the UK Code and Brazil.

**Alternatives:**

| Option | Pros | Cons |
|---|---|---|
| Adults only, many countries | Low legal load; micro/small exemptions help | Misses school students everywhere |
| India minors first, then abroad | One regime at a time | The Indian family account won't satisfy Brazil or Indonesia (no self-declaration) |
| One global "strictest" minor design (Children's Code + DPDP) | Build once | Still needs local age checks and consent rules |
| Geo-block minor features outside India | Simple | Needs reliable location; VPNs |

**How competitors handle it:** YouTube uses store/device age signals and supervised accounts where laws require (🟡). Apple and Google now provide age assurance in regulated regions (✅ their docs). No study app I checked publishes a country-by-country minors policy. ❓

**Sources:** inline above.

**Risks:**
- Legal: each regime defines "likely to be accessed by children" differently; an exam-prep app will be judged as likely used by teens. **Lawyer per country.**
- Legal: EU/UK transfers to India or the US need contracts (SCCs/IDTA).
- Product: languages and exams are local; the classifier and seed lists don't transfer.

**Needs testing:** demand outside India; classifier accuracy per new language; whether store age signals come back for target countries.

**Effort for a solo developer:** Medium for adults-only expansion (notices, transfer contracts, languages); High for minors abroad.

**Risk level:** Medium (adults only); High (minors abroad).

---

# Group: Accessibility

Expectation 15: Accessibility mode. Users choose the help they need (captions, ISL, screen reader, large buttons, audio-focused), with health-data consent handled correctly.

Checked on 2026-09-26. Round 1 (research.md section 3) was the base. Every YouTube quote below comes from raw page text downloaded with curl and searched, not from a summary.

---

## 15a. Captions (deaf / hard of hearing)

**Possible?** Partly. The app can prefer videos that have captions, turn captions on by default, and set a caption language and size, all through documented API and player features. It cannot read, check, fix or restyle the captions of other people's videos, and it cannot reliably force *auto-generated* captions on.

**What the API really gives you**

| Feature | What the docs say (✅ verbatim) | What it means (🔵 unless marked) |
|---|---|---|
| `videos.list` → `contentDetails.caption` | "Indicates whether captions are available for the video. Valid values for this property are: false true" | The docs **do not say** whether auto-generated (ASR) tracks count. See the evidence row below. |
| Evidence on ASR vs human | UC Irvine's open-source "YouTube Caption Audit" (2018) uses `contentDetails.caption == 'false'` to report "which videos do not have human-created closed captions". 🟡 ([repo](https://github.com/tmcgill/youtube-caption-audit), code read directly) | One university team built a tool on the belief that the flag means human-made captions. That is a signal, not proof. I found no Google statement either way (checked: videos, search.list, captions docs; Stack Overflow; Google's issue tracker is not indexed). I could not run a live test: the project has no API key (`filter-prototype/.env.example` only). ❓ **Still unverified after round 5.** Test before relying on it (see "Needs testing"). |
| `search.list` `videoCaption=closedCaption` | "Only include videos that have captions." Requires `type=video`. | Same ambiguity as the flag. 🔵 It almost certainly uses the same underlying flag. It costs nothing extra, because the filter rides on a search call you already make. But it spends one of your 100 searches a day, so use it in the one search, not as an extra call. |
| `captions.list` | Needs OAuth scope `youtube.force-ssl` or `youtubepartner`; "quota cost of 50 units". Returns `trackKind`: "ASR – A caption track generated using automatic speech recognition", "standard", or "forced". | This is the only official field that separates human from machine captions. A 2025 Stack Overflow post shows it listing both a `standard` and an `asr` track for a video the poster was trying to download, so listing seems to work on other people's videos 🟡 ([SO 79390460](https://stackoverflow.com/q/79390460)). **But:** it needs every user to sign in with Google and grant a scope that also allows editing and deleting their YouTube videos, and it costs 50 units per video (200 videos/day on the default 10,000). 🔵 Not usable at feed scale. |
| `captions.download` | Needs edit rights on the video (research.md section 3, ✅). | You can't read the text, so you can't score accuracy, translate, or show your own caption panel. |
| Player `cc_load_policy=1` | "causes closed captions to be shown by default, even if the user has turned captions off." | Documented, so allowed. **Known gap:** developers report it does nothing when a video has only auto-generated captions 🟡 ([SO 57500010](https://stackoverflow.com/q/57500010), 2019; [SO 53564261](https://stackoverflow.com/q/53564261): "only work for languages added by the video owner"). The only reported workaround is an *undocumented* `setOption('captions','track',…)` call. ❓ Whether this is still true in 2026. |
| Player `cc_lang_pref` | Sets the default caption language (ISO 639-1 or BCP 47, e.g. `hi`). With `cc_load_policy=1` it shows that language at load. | Useful for Hindi vs English captions. |
| Player `hl` | Sets the interface language and "affects the default caption track", though "YouTube might select a different caption track language for a particular user". | Fine as a hint, not a guarantee. |
| IFrame API `setOption('captions','fontSize', n)` | Documented; values -1 to 3. | Lawful way to make captions bigger. The only documented caption styling option. Colour, background and font are set by the viewer in the player's own settings menu (🔵 not controllable by the app). |
| Required Minimum Functionality | "You must not make changes to the YouTube player that are not explicitly described by the API documentation." and "You must not display overlays, frames, or other visual elements in front of any part of a YouTube embedded player". ✅ [RMF](https://developers.google.com/youtube/terms/required-minimum-functionality) | Rules out the undocumented `setOption('captions','track')` workaround and any caption layer on top of the video. |

**Auto-caption quality, Indian speakers**

| Study | Finding | Label |
|---|---|---|
| Rai et al., "A Deep Dive into the Disparity of Word Error Rates Across Thousands of NPTEL MOOC Videos", ICWSM 2024 (~9.8K NPTEL lectures, 8,740 hours, Indian English) | YouTube auto-captions: average word error rate from about 12% (Nanotechnology) to 20% (Computer Science) in engineering; 10% to 19% outside engineering. Worse for some genders, regions, ages and fast speakers. Whisper was a little more accurate overall. | ✅ [arXiv 2307.10587](https://arxiv.org/abs/2307.10587) (PDF text read) |
| LLM caption correction for DHH users (2024) | Raw ASR captions WER 23.07%; GPT-3.5 post-correction 9.75%. Not India-specific. | ✅ abstract [arXiv 2412.00342](https://arxiv.org/abs/2412.00342) |
| Hindi ASR, agriculture field audio (2026) | Best Hindi WER 16.2% across 10 ASR models. Not YouTube, not lectures; a rough proxy only. | ✅ abstract [arXiv 2602.03868](https://arxiv.org/abs/2602.03868) |
| YouTube Help, automatic captions | Hindi and nine other Indian languages supported. Captions may fail when "multiple speakers whose speech overlaps or multiple languages at the same time". | ✅ [YouTube Help 6373554](https://support.google.com/youtube/answer/6373554?hl=en) |
| Round 1: ERIC study | 7.7 phrase errors per minute in auto-captions. | ✅ (research.md s.3) |

🔵 Plain reading: one word in 5 to 10 wrong on Indian technical lectures is not enough for a deaf learner. It is worse for Hinglish, because YouTube itself says mixed-language speech may not caption at all. ❓ I found no study of YouTube's *Hindi* auto-captions specifically.

**Best way:** A "Captions" need that (0) on Android, offers a one-tap guide to turn on Live Caption where the phone has it (fills the gap for uncaptioned videos), (1) adds `videoCaption=closedCaption` to the search the app already makes, (2) ranks videos with `contentDetails.caption=true` higher (the app already fetches `contentDetails` for duration), (3) loads the player with `cc_load_policy=1`, `cc_lang_pref` from the user's language and a larger `fontSize`, and (4) tells the user honestly: "Captions may be machine-made and have errors." Why: all four are documented features, cost no extra quota, and need no Google sign-in. If the test shows the flag means human captions, the label can become "Has creator captions", which is exactly what deaf users want.

**Alternatives**

| Option | Pros | Cons |
|---|---|---|
| Flag + search filter + `cc_load_policy` (recommended) | Free, lawful, no sign-in | Can't tell human from ASR (unverified); ASR-only videos may not auto-show captions |
| `captions.list` per video for `trackKind` | Only true human-vs-ASR signal | Needs Google sign-in with a broad edit/delete scope, 50 units per video; not viable for a feed |
| Seed lists of channels known to upload real captions (e.g. NPTEL, some coaching channels) | Human-checked quality | Manual work; must be refreshed ≤ 30 days like other lists |
| Own captions via Whisper on the audio | Better accuracy | ✗ Not allowed: needs the audio stream (III.I.7 bans separating audio; downloading is banned) |
| Own caption panel beside the player | Could style freely | ✗ Needs caption text you can't lawfully get |
| Point users to the phone's own **Live Caption** (Android) | Works on *any* video, including ones with no captions. Google: supports "English, French, German, Italian, Japanese, Hindi, and Spanish" on Pixel 4+ and "selected Android phones"; "All captions are processed locally, never stored, and never leave your device." ✅ [Android Help 9350862](https://support.google.com/accessibility/android/answer/9350862?hl=en). 🔵 It's an OS feature, not an app overlay, so the RMF overlay rule doesn't bite. | Only on some phones (many budget phones in India may lack it ❓); machine captions, same accuracy limits; Hinglish unknown; iOS equivalent's language support ❓ |

**How competitors handle it:** YouTube's own app has a "Subtitles/CC" search filter ✅ ([Help 3029103](https://support.google.com/youtube/answer/3029103?hl=en)) and the viewer's caption settings. Unhook, StudyTube, LearnTube and SyncStudy advertise nothing on captions (🔵 from round-1 listings; not rechecked). University accessibility guides tell staff to use YouTube's CC filter and then *check quality by hand* ([CU Boulder](https://www.colorado.edu/digital-accessibility/captioning/resources/youtube-captioned-videos-search) 🟡). No app I found filters learning feeds by caption availability.

**Sources:** [videos resource](https://developers.google.com/youtube/v3/docs/videos) ✅; [search.list](https://developers.google.com/youtube/v3/docs/search/list) ✅; [captions](https://developers.google.com/youtube/v3/docs/captions) ✅; [captions.list](https://developers.google.com/youtube/v3/docs/captions/list) ✅; [player parameters](https://developers.google.com/youtube/player_parameters) ✅; [IFrame API](https://developers.google.com/youtube/iframe_api_reference) ✅; [RMF](https://developers.google.com/youtube/terms/required-minimum-functionality) ✅; Stack Overflow threads above 🟡; UCI caption audit 🟡; NPTEL WER study ✅.

**Risks**
- Legal: low. All features are documented. Don't use the undocumented caption-track call.
- Technical: `cc_load_policy` may not work for ASR-only videos; the flag's meaning is unverified; iOS "Error 153" (research-summary) may block the whole player.
- Product: promising "captioned videos" and delivering 20%-WER machine captions breaks trust with deaf users. Say plainly which is which, or don't claim.

**Needs testing**
1. Take 30 videos: 10 with only auto-captions, 10 with creator captions, 10 with none (check by hand on youtube.com). Call `videos.list` and see which get `caption=true`. This answers the round-1 question in about 3 units of quota.
2. Does `videoCaption=closedCaption` return ASR-only videos?
3. Does `cc_load_policy=1` show auto-captions in 2026, on Android WebView and iOS WKWebView?
4. Does `setOption('captions','fontSize',3)` work on mobile WebViews?
5. Does Android Live Caption pick up the YouTube player's audio inside the app's WebView, and how good is it on Hindi and Hinglish lectures? On which common Indian phones is it available?
6. Share of results with `caption=true` for Hindi and Hinglish queries in CS, CMA, NEET, AI. If tiny, the filter empties the feed.

**Effort for a solo developer:** Low (three player parameters and one search parameter; the test is an afternoon).

**Risk level:** Low (legal) / Medium (product trust, if machine captions are oversold).

---

## 15b. Indian Sign Language (ISL)

**Possible?** Partly. The app can find and surface existing ISL videos from known channels. It **cannot** add ISL to ordinary videos: no overlay on the player is allowed, and without the transcript there is nothing to translate. The deeper problem is supply. For the 18+ launch fields (CS, CMA, NEET, AI) I found almost no ISL learning content.

**What exists (checked 2026-09-26)**

| Source | What it has | Level | On YouTube? | Label |
|---|---|---|---|---|
| ISLRTC (DEPwD) | ISL dictionary (everyday, legal, academic terms), 30–40 hour self-learning basic ISL course, "Educational Concept Videos" in Maths, English, History, Science, Geography, Civics | School concepts; ISL learning | Yes, [channel UC3AcGIlqVI4nJWCwHgHFXtg](https://www.youtube.com/channel/UC3AcGIlqVI4nJWCwHgHFXtg) | ✅ [islrtc.nic.in](https://islrtc.nic.in/educational-concept-videos/) |
| NCERT + ISLRTC textbooks in ISL | "ISL E-CONTENT OF NCERT TEXTBOOKS… Classes I-VI" on DIKSHA. Page last updated August 2024; **still classes I–VI**. | Primary | Mostly DIKSHA, not YouTube | ✅ [ISLRTC page](https://islrtc.nic.in/ncert-books-in-isl/) |
| NIOS | "more than 270 Video in Sign Language in 7 subjects… at secondary level and Yoga course" | Class 10 | Yes, [channel UCXBn5q8Zv4Bz-LZXWWD7Jxw](https://www.youtube.com/channel/UCXBn5q8Zv4Bz-LZXWWD7Jxw/playlists) | ✅ [PM e-Vidya CWSN page](https://pmevidya.education.gov.in/cwsn.html) |
| NIOS ISL subject (230) | Secondary course that *teaches* ISL, 17 lessons with video links | Learning ISL | Yes | 🟡 [NIOS](https://www.nios.ac.in/online-course-material/secondary-courses/indian-sign-language-(230).aspx) |
| NCERT / PM eVIDYA DTH ISL Channel 31 | Basic ISL course (latest run 16–20 Feb 2026), archived on "NCERT Official", "NCERT Events" and "PM eVIDYA DTH ISL Youtube Channel 31" | Learning ISL | Yes | ✅ [CIET](https://ciet.ncert.gov.in/activity/isl2026) |
| ISH News (India Signing Hands) | News and general knowledge in ISL with voiceover and subtitles; YouTube Silver award (100K+ subscribers); team of 7 Deaf professionals | Adults, current affairs | Yes, [@ISHNews](https://www.youtube.com/c/ISHNews) | 🟡 [ISH](https://indiasigninghands.com/projects/ishnews/) |
| Deaf Enabled Foundation (DEF) | DEF-Academy: Deaf instructors coach B.Com students; EduSign Academy ("India's first online education platform for the Deaf"); DEF-ISL app and dictionary | Graduate (B.Com), skills | Partly; main platform is its own | 🟡 [def.org.in](https://def.org.in/) (WebFetch summary) |
| RKMVERI Coimbatore ISL portal | Tutorials for Deaf students | Mixed | Partly | 🟡 [indiansignlanguage.org](https://indiansignlanguage.org/tutorial-for-the-deaf/) |
| Signing Savvy | **American** Sign Language dictionary. Not ISL. Not useful here. | — | — | 🔵 |

🔵 **Gap for the launch fields:** I found no ISL content for CS (Company Secretary), CMA, NEET or AI. The nearest is DEF's B.Com coaching, which is off-YouTube. Search for Deaf-focused bank/SSC coaching in ISL returned nothing specific. ❓ There may be small creator channels I missed. A few hours of manual YouTube searching by a Deaf tester would settle it.

**How to find ISL videos (for a seed list)**
- Channel lists: ISLRTC, NIOS, NCERT Official, PM eVIDYA ISL 31, ISH News, DEF. Pull their uploads with `playlistItems.list` (1 unit per 50 videos) rather than spending searches.
- Search terms (🔵 untested): "Indian Sign Language", "ISL", "in ISL", "सांकेतिक भाषा", "sign language" + topic, "deaf" + topic. Titles are the only reliable signal because there's no ISL metadata field.
- 🔵 Ask Deaf users for the channels they actually use. This is the fastest route and doubles as the user-interview step.

**AI sign-language avatars in India**

| Effort | Status | Usable here? |
|---|---|---|
| Bhashini (MeitY) | 22 spoken/written languages. I found **no** ISL feature or announcement. | No ❓ (absence of evidence) |
| Academic work (IIT and others): ISLTranslate dataset (2023), ISL recognition papers up to Sept 2026 | Mostly sign-to-text recognition, not text-to-sign generation for lectures | No ✅ [arXiv 2307.05440](https://arxiv.org/abs/2307.05440), [arXiv 2609.12993](https://arxiv.org/abs/2609.12993) |
| Small products (e.g. Ishaara text-to-ISL 3D avatar) | Vendor claims only | Not verified 🟡 [ishaara.app](https://www.ishaara.app/) |
| World Federation of the Deaf + WASLI joint statement (2018) | Caution against avatars "as a replacement for human signers"; word-for-word sign translation "is not possible" | Deaf bodies oppose avatar-first access 🟡 [WFD](https://wfdeaf.org/news/resources/wfd-wasli-statement-use-signing-avatars/) |

🔵 Even a perfect avatar couldn't be used on YouTube videos in this app. It would need the transcript (not available, 15a), and it can't sit on top of the player (RMF: no "overlays, frames, or other visual elements in front of any part of a YouTube embedded player"). A signing panel *beside* the player, fed by the app's own text, is not banned by that rule, but there's no lawful text to feed it.

**Policy check: "infer content type".** The compliance guide, under derived metrics, says don't use the API to "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API." ✅ ([guide](https://developers.google.com/youtube/terms/developer-policies-guide), raw text). 🔵 My reading:
- **Captions:** safe. `contentDetails.caption` and `videoCaption` are values YouTube returns; the app infers nothing.
- **ISL by channel list:** probably safe. The list comes from outside the API (ISLRTC, NIOS and CIET name their own channels on their own sites; Deaf users name channels). The app isn't estimating a type from API data; it's following a source list the user chose.
- **ISL by title matching** ("in ISL", "sign language"): this is inferring a video's type from API data. It sits close to the banned line. Keep it as a user-visible search the user runs ("Search 'ISL' + your topic"), not a hidden label the app assigns.
- The same line bears on the whole learning/entertainment classifier, outside this group. See the final report.

**Best way:** Treat ISL as a **source filter**, not a feature that transforms videos. "ISL" in Accessibility mode = feed built from a curated list of ISL channels, plus an open, user-run "ISL + topic" search (not a hidden label), clearly labelled "ISL videos are few for your goal" when the list is thin. Why: it's lawful, cheap, and honest about the gap.

**Alternatives**

| Option | Pros | Cons |
|---|---|---|
| Curated ISL channel list + title search (recommended) | Lawful, cheap, uses Deaf-made content | Little content above class 10; nothing for CS/CMA/NEET/AI |
| AI avatar translating videos | Would fill the gap in theory | ✗ Needs transcript (not available), overlay banned, Deaf bodies oppose it, not ready |
| Partner with ISH/DEF/ISLRTC to *produce* ISL explainers on their own channels | Real content growth; grant-fundable | Slow; outside a solo dev's control |
| Captions only for Deaf users | Works today | Many Deaf learners read written Hindi/English less easily than ISL (research.md s.3, 🔵) |

**How competitors handle it:** No study-feed app I found (Unhook, StudyTube, LearnTube, SyncStudy) has ISL. YouTube has no sign-language filter. DEF's EduSign and ISLRTC's own portals are the nearest "competitors", and they're content producers, not feed builders.

**Sources:** listed in the tables. ✅ ISLRTC, CIET and PM e-Vidya pages read directly (raw HTML). 🟡 DEF, ISH, NIOS course page, WFD via search/WebFetch summary.

**Risks**
- Legal: low for channel lists; medium for any hidden "this is ISL" label built from titles (guide: "Infer or estimate the content category/type").
- Technical: low. Title matching will mislabel some videos (e.g. videos *about* ISL vs videos *in* ISL).
- Product: high. An "ISL" option that shows an empty feed for NEET or CMA disappoints the users it's meant for. Showing the option only when the list has content for the goal is kinder.

**Needs testing**
1. For each test field, count ISL videos found via channel lists + title search. My guess is close to zero; confirm it.
2. Ask 3–5 Deaf adults: would they use captions, ISL or both for exam study? Which channels do they already use?

**Effort for a solo developer:** Low to build (a channel list and a title filter); Medium to keep the list current.

**Risk level:** Low (legal) / High (content supply).

---

## 15c. Screen readers (blind / low vision)

**Possible?** Partly. The app's own screens can be made fully accessible (WCAG 2.2 AA). The YouTube player inside it cannot be fixed by the app, and audio-described videos can't be found through the API.

**The embedded player**

| Issue | Evidence | Label |
|---|---|---|
| Keyboard focus can get trapped in the player or skip controls; progress bar confusing by Tab (WCAG 2.1.1) | Accessible.org audit page, May 2026 | 🟡 [accessible.org](https://accessible.org/youtube-video-player-accessibility/) |
| Faint or missing focus ring on dark controls (WCAG 2.4.7) | same | 🟡 |
| Controls announce inconsistently; "The captions toggle does not always communicate whether captions are on or off" (WCAG 4.1.2) | same | 🟡 |
| "Your site cannot patch the player from the outside" | same; matches RMF "You must not make changes to the YouTube player that are not explicitly described by the API documentation" | ✅ RMF / 🟡 audit |
| Frame title: screen readers read an untitled iframe as something generic. The `title` attribute is on *your* page's iframe element, so you can set it (e.g. "Video: Cost accounting, lecture 3"). | WCAG 4.1.2 practice | 🔵; ❓ whether the IFrame API sets its own title (check in prototype) |
| TalkBack in an Android WebView, VoiceOver in WKWebView | No test report found | ❓ |

**Lawful workaround: accessible controls outside the player.** The IFrame API documents `playVideo`, `pauseVideo`, `seekTo`, `setPlaybackRate` and `setVolume` ✅ ([IFrame API](https://developers.google.com/youtube/iframe_api_reference)). Able Player does this: its own "keyboard-accessible, properly labeled" buttons driving the YouTube player 🟡 ([Able Player](https://ableplayer.github.io/ableplayer/)). 🔵 Keep YouTube's own controls visible (hiding them with `controls=0` also hides the captions toggle and settings menu, and edges toward "reduce standard YouTube features"). Put large labelled buttons *below* the player: Play/Pause, Back 10 s, Forward 10 s, Speed, Caption size. Nothing sits on top of the player, so the RMF overlay rule is met.

**Audio description:** YouTube lets creators add a "Descriptive audio" track, but "Audio description is currently available to creators with access to Advanced features" ✅ ([YouTube Help 16166822](https://support.google.com/youtube/answer/16166822?hl=en)). The `videos` resource has **no** field for audio tracks (✅ searched the raw docs). The only trace is `captions.audioTrackType = descriptive`, which needs OAuth and 50 units per video (15a). The IFrame API has no documented audio-track control. So 🔵 the app can't find audio-described videos and can't switch to that track. The viewer may be able to pick it in the player's settings menu (❓ test). Supply for Indian exam content is probably tiny (🔵, no data found).

**What the app *can* do for blind learners (🔵, based on the studies in research.md s.3):** prefer lecture-style videos where speech carries the content (see 15e); read out duration up front; turn timestamps in the video description into a chapter list that calls `seekTo` (this reads data the API returns and estimates nothing); label every note, bookmark and button.

**Standards**

| Standard | Status | Binds this app? | Label |
|---|---|---|---|
| WCAG 2.2 AA | W3C Recommendation. 2.1.2 No Keyboard Trap (A); 2.5.8 Target Size 24×24 (AA) | Sensible target either way | ✅ [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| IS 17802 (Part 1) 2021, (Part 2) 2022 | Notified under RPwD Rule 15 by G.S.R. 359(E), 10 May 2023; "harmonised with" WCAG, Section 508 and EN 301 549 | See next row | 🟡 [SCC Online](https://www.scconline.com/blog/post/2023/05/12/ministry-of-social-justice-and-empowerment-notified-rights-of-persons-with-disabilities-amendment-rules-2023-legal-news/), [IS 17802 summary](https://samarthyam.com/wp-content/uploads/2026/02/IS-17802.pdf) |
| **Draft RPwD (Amendment) Rules, 2026**, S.O. 3962(E), 16 July 2026, gazetted 20 July 2026 (the Rajive Raturi follow-up for ICT) | Makes IS 17802 clauses non-negotiable for "every establishment, whether in India or abroad, that… develops… or makes available" websites and **mobile applications** to people in India. Under ₹500 crore turnover: 18 months; everything within 2 years. Must publish an Accessibility Conformance Report (HTML/PDF plus JSON/XML). Fines and possible loss of registration. Platforms hosting user content "must provide capability to embed… captions, transcripts, alternative text, audio description". **Still a draft.** The 30-day comment window ended about 19 Aug 2026; I found no final notice by 27 Sept 2026. An earlier June 2025 draft ICT rule (six-month deadline) was never finalised. | 🔵 Likely yes once final. The Act defines "private establishment" as "a company, firm, cooperative or other society, associations, trust, agency, institution, organisation…" (s.2(v)), so a company running the app is covered. A solo individual might fall outside that definition, but s.46 is wider: "The service providers whether Government or private shall provide services in accordance with the rules on accessibility" ✅ (Act text, [National Trust copy](https://thenationaltrust.gov.in/upload/uploadfiles/files/RPWD%20ACT%202016.pdf)). Penalty under s.89: up to ₹10,000 first time, ₹50,000 to ₹5 lakh after ✅. **Lawyer** for the exact reach. | 🟡 [IndiaLaw](https://www.indialaw.in/blog/regulatory/rpwd-amendment-rules-2026/), [ThePrint, 27 Jul 2026](https://theprint.in/tech/global-tech-firms-to-come-under-indias-mandatory-disability-access-rules-face-fines-licence-risk/2997906/), [Mondaq](https://www.mondaq.com/india/compliance/1824050/the-new-accessibility-conformance-regime-key-takeaways-from-the-draft-rpwd-amendment-rules-2026), [AZB](https://www.azbpartners.com/bank/bridging-the-digital-divide-indias-evolving-accessibility-framework/). ❓ Gazette text not read. |
| Supreme Court, 30 April 2025 (Pragya Prasun) | "the right to digital access constitutes an intrinsic facet of the fundamental right to life" | Direction of travel, not a rule for apps | 🟡 via AZB |
| GIGW 3.0 | "Guidelines for Indian Government Websites and apps" | No, government only. Useful as a checklist. | ✅ title, [guidelines.india.gov.in](https://guidelines.india.gov.in/) |

🔵 If the 2026 rules become final as drafted, the app's *own* screens must meet IS 17802, and the player's known faults are third-party content the app can't fix. The ACR should say so plainly. This resolves one row of the research-summary risk table ("Whether IS 17802 binds a small private app"): the draft says yes for establishments of any size, with 18 months to comply.

**Best way:** Build the app shell to WCAG 2.2 AA from day one (cheaper than retrofitting, and likely to become law), set a meaningful iframe title, and add a labelled control bar below the player using documented IFrame API calls.

**Alternatives**

| Option | Pros | Cons |
|---|---|---|
| Keep YouTube controls + accessible bar below (recommended) | Lawful; works with TalkBack/VoiceOver; covers the worst player faults | Two sets of controls; uses screen space |
| `controls=0` with only custom controls | Cleanest for screen readers | Loses captions toggle and settings menu; policy risk |
| Send blind users to the YouTube app | YouTube's app supports TalkBack/VoiceOver ✅ ([Help 6087602](https://support.google.com/youtube/answer/6087602?hl=en&co=GENIE.Platform%3DAndroid)) | Loses the point of the app |

**How competitors handle it:** Able Player (open source) is the known pattern 🟡. Unhook, StudyTube, LearnTube and SyncStudy make no screen-reader claims (🔵 from round-1 listings, not rechecked).

**Sources:** in the tables above.

**Risks**
- Legal: medium. The draft 2026 rules would make accessibility mandatory with a public ACR; the player's faults are outside your control.
- Technical: WebView + iframe accessibility is untested; focus can get stuck inside the iframe.
- Product: low-vision users need large text across the whole app, not only captions.

**Needs testing**
1. TalkBack (Android WebView) and VoiceOver (iOS WKWebView): can a user find, start, pause and leave the player?
2. Does the IFrame API set the iframe `title`, and is the one you set read out?
3. Does the embed's settings menu offer "Descriptive audio" on a video that has it?
4. Sessions with 2–3 blind users.

**Effort for a solo developer:** Medium (an accessible shell is normal good practice; the control bar and screen-reader testing take real time).

**Risk level:** Medium.

---

## 15d. Motor impairments

**Possible?** Yes, for the app's own screens. The player's own buttons are small and can't be changed; the 15c control bar covers them.

| Item | Detail | Label |
|---|---|---|
| WCAG 2.5.8 Target Size (Minimum), AA, new in 2.2 | "at least 24 by 24 CSS pixels", with spacing, equivalent-control and inline exceptions | ✅ [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| WCAG 2.5.5 Target Size (Enhanced), AAA | "at least 44 by 44 CSS pixels", except when "The target is available through an equivalent link or control on the same page that is at least 44 by 44 CSS pixels" | ✅ same |
| WCAG 2.5.7 Dragging Movements (AA), 2.5.4 Motion Actuation (A), 2.1.1 Keyboard (A) | No drag-only, shake-only or pointer-only actions | ✅ same |
| Android Material 48 dp / Apple HIG 44 pt touch targets | Platform design guidance | 🟡 (well known; not re-read this round) |
| Android Switch Access and Voice Access; iOS Switch Control and Voice Control | Built into the OS. They work through the accessibility tree, so they work when every control has a visible text label and a role. | 🔵 (standard OS features); ❓ behaviour inside the YouTube iframe |

🔵 The "equivalent control" exception matters: the player's small buttons don't break 2.5.5/2.5.8 *for the app* if the same actions exist as large buttons in the app's control bar.

**Best way:** A "Large buttons" need that switches the app to 44–48 px targets, shows the 15c control bar by default, keeps flows short (goal → feed → play), and never relies on swipes alone. For voice, rely on OS Voice Access / Voice Control with visible text labels (Voice Access works by saying the label), not a custom voice engine.

**Alternatives**

| Option | Pros | Cons |
|---|---|---|
| Large-target mode + OS voice/switch support (recommended) | Cheap; uses tools users already have | Player internals stay small |
| Custom in-app voice commands | Hands-free "pause", "next" | Fails for speech-impaired users; mic permission; more personal data |
| Large UI for everyone | One design | Less content per screen |

**How competitors handle it:** None of the study-app competitors mention motor access (🔵). YouTube's app relies on the OS features (🔵).

**Sources:** WCAG 2.2 (✅); platform guidance (🟡).

**Risks:** Legal low (same IS 17802 draft as 15c). Technical: switch scanning into and out of the iframe ❓. Product low.

**Needs testing:** Android Switch Access and Voice Access, iOS Switch Control: can a user play, pause, seek and leave the player without touching it?

**Effort for a solo developer:** Low (design tokens, labels, plus the 15c control bar).

**Risk level:** Low.

---

## 15e. Audio-focused content

**Possible?** Partly. "Audio-focused" can lawfully mean *choosing videos where the speech carries the lesson*, with the player on screen. It **cannot** mean listening with the screen off, in the background, or as an audio-only stream.

**The exact rules** (✅ verbatim, raw text of [Developer Policies III.I](https://developers.google.com/youtube/terms/developer-policies) and the [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide))

| Rule | Text | Effect |
|---|---|---|
| III.I.7 | must not "separate, isolate, or modify the audio or video components of any YouTube audiovisual content… For example, you must not apply alternate audio tracks to videos" | No audio-only stream; no app-made narration track |
| III.I.8 | must not "promote separately the audio or video components" | 🔵 Don't market an "audio mode" or "listen mode" as if it were a podcast player |
| III.I.9 | must not "create, include, or promote features that play content… from a background player, meaning a player that is not displayed in the page, tab, or screen that the user is viewing" | No play when the app is minimised, the screen is locked, or another app is on top |
| Guide | Don't "Allow for background play of the YouTube video player. Example: Using YouTube's API to allow videos to play even when your API service window is closed or minimized." | Same |
| RMF | Player at least 200×200 px; no overlays in front of it ✅ [RMF](https://developers.google.com/youtube/terms/required-minimum-functionality) | 🔵 No "shrink the player to a dot" or cover it with a black screen |

🔵 **Screen off:** a locked screen means the player is not "displayed in the… screen that the user is viewing", so screen-off play is out. Keeping the screen *on* during playback (Android keep-screen-on flag, iOS idle timer off) is allowed and useful for blind users. Dimming the whole phone with the OS brightness control is the user's own choice; the app shouldn't build a "black overlay" over the player. Picture-in-picture: ❓ not documented for the IFrame player, so treat it as not allowed.

**What the app can do**
- Prefer lecture/talk-style videos: long duration, known lecture channels (seed lists), the Education category ID YouTube returns. 🔵 A hidden "this video is audio-led" label from titles or thumbnails would be the app *inferring content type*, which the guide says not to do ("Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API"). Keep it to channel lists and API-returned fields, and let the user see why a video is there.
- Keep the screen awake while playing; big Play/Pause and Back 10 s buttons (15c).
- Name it by need, not format: "Easy to follow by listening", not "Audio mode".

**Alternatives**

| Option | Pros | Cons |
|---|---|---|
| Lecture-first feed, screen on (recommended) | Lawful; helps blind and low-vision users and people studying while cooking or commuting with the phone unlocked | Battery use; phone must stay unlocked |
| Background / screen-off play | What users will ask for | ✗ III.I.9; risk of losing API access |
| Send users to YouTube Premium for background play | Lawful | Paid; leaves the app |
| Link out to the same creator's podcast on Spotify etc., when the creator publishes one | Lawful; real audio format | Only some creators; mixing non-YouTube results into YouTube search results is barred by III.C, so it must be a separate section |

**How competitors handle it:** 🔵 Third-party apps that offered background play of YouTube have been a common enforcement target (round 1, research.md s.4, "Apps that got shut down"). YouTube itself sells background play as a Premium feature.

**Sources:** as in the table.

**Risks:** Legal high if anything plays off-screen; low otherwise. Product: users may feel "audio-focused" over-promises. Technical: iOS may pause the WebView when the screen dims (❓).

**Needs testing:** Does keep-screen-on hold in a WebView on Android and iOS? What share of seed-list videos in the four fields are lecture-style (speech carries the content)?

**Effort for a solo developer:** Low.

**Risk level:** Low if screen-on only; High if any background play creeps in.

---

## 15f. Health-data consent

**Possible?** Yes. The cleanest design stores the need on the phone only, asks about *help wanted*, not *diagnosis*, and never uses it for anything but the settings it names.

**The law and the policy**

| Source | What it says | Label |
|---|---|---|
| DPDP Act 2023 | **No "sensitive" or "special category" class.** The word "sensitive" does not appear; "health" appears only in the medical-emergency and epidemic exemptions. All personal data gets the same consent rule. | ✅ Act text searched ([MeitY PDF](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf)). Resolves research.md s.7's ❓ |
| DPDP s.6(1) | Consent "shall be free, specific, informed, unconditional and unambiguous with a clear affirmative action… limited to such personal data as is necessary for such specified purpose" | ✅ |
| DPDP s.2(j)(ii), s.9(1) | "Data Principal" for "a person with disability, includes her lawful guardian"; before processing data of "a person with disability who has a lawful guardian", obtain "verifiable consent of… the lawful guardian" | ✅ |
| DPDP Rules 2025, Rule 11 | Due diligence "to verify that such guardian is appointed by a court of law, or by a designated authority or by a local level committee, under the law applicable to guardianship"; "designated authority" = one under RPwD s.15 | 🟡 text via [dpdpa.com](https://www.dpdpa.com/dpdparules/rule11.html) (bare text, not the Gazette) |
| RPwD Act 2016 | "person with disability" = "long term physical, mental, intellectual or sensory impairment which, in interaction with barriers, hinders his full and effective participation"; "deaf" = "70 DB hearing loss in speech frequencies in both ears"; "hard of hearing" = "60 DB to 70 DB". | ✅ Act text ([National Trust copy](https://thenationaltrust.gov.in/upload/uploadfiles/files/RPWD%20ACT%202016.pdf)) |
| YouTube compliance guide | Don't "Harvest, track, infer, derive or store the following about a user without their consent. Examples include…: Health information…" | ✅ raw text |

🔵 **What this means**
- **Rule 11 rarely applies here.** It covers adults who *have* a court- or authority-appointed guardian (mostly people with intellectual or severe multiple disabilities). Deaf, blind and motor-impaired adults normally consent for themselves under s.6. Don't ask every user about guardianship. If a guardian signs up on someone's behalf, route them to the same flow as the future parent-first family account (research-summary "Lawyer" row).
- **A preference is not a diagnosis, but a combination can reveal one.** "Captions on" alone says little (many hearing people use captions). "Screen reader + audio-focused + large buttons" strongly suggests blindness. Treat the whole set as health-adjacent under YouTube's guide and consent to it explicitly.
- **Don't infer.** Reading the OS setting "TalkBack is on" and saving "user is blind" would be *inferring* health information. Using the OS signal only to adapt the screen in the moment, without storing or sending it, is ordinary accessibility practice (🔵, no source says otherwise; lawyer to confirm).
- **On-device only.** If the need never leaves the phone, the developer never receives it. Whether DPDP still treats the app maker as processing it: ❓ lawyer. Either way it's the lowest-risk design and meets YouTube's guide with consent.
- **Keep it out of everything else:** not sent to the LLM host, not in analytics, not in the behaviour layer, not used for ranking beyond the named effect (e.g. "Captions" → prefer captioned videos).
- Penalty ceiling for a s.9 breach is ₹200 crore (brief; research.md s.11). Note: dpdpa.com's Rule 11 commentary says ₹250 crore; that figure is the security-safeguards penalty, so that site's commentary is wrong on this point (🔵).

**Wording of the choice screen (🔵 draft, by need, not condition)**

> **Make the app work for you** (optional)
> ☐ Show captions and prefer captioned videos
> ☐ Show videos in Indian Sign Language
> ☐ Bigger buttons
> ☐ Work well with my screen reader
> ☐ Videos that are easy to follow by listening
> These settings stay on this phone. We don't send them to our servers or use them for anything else. Change them any time in Settings.

No "Are you deaf/blind?", no disability list, no certificate, no RPwD percentages. Each box is its own clear affirmative action (s.6).

**Alternatives**

| Option | Pros | Cons |
|---|---|---|
| Need-based toggles, on device, explicit (recommended) | Meets s.6 and YouTube's guide; no health data on servers | Settings lost on phone change unless user exports them |
| Sync needs to the account | Survives reinstall | Health-adjacent data on servers; needs its own consent notice, deletion within 7 days on request (III.E.4.g), security duties |
| Auto-detect from OS accessibility settings and store | Zero setup | "Infer… Health information" without consent: ✗ |
| Ask for disability type or certificate | Could unlock grants/reporting | Unnecessary data; fails s.6 "necessary"; puts users off |

**How competitors handle it:** 🔵 Mainstream apps (YouTube, Android) keep accessibility as device settings, not account data. I found no Indian study app with a disability onboarding screen.

**Risks:** Legal medium (lawyer still needed on on-device storage and the guardian route); technical low; product low.

**Needs testing:** Do users understand "stays on this phone"? Does anyone skip the screen because it feels like a medical form?

**Effort for a solo developer:** Low.

**Risk level:** Medium (legal questions still open, design risk low).

---

## 15g. Who else serves this

**Possible?** Yes, there's room. I found no app that builds a learning feed from YouTube around accessibility needs, in India or abroad.

| Who | What | Overlap | Label |
|---|---|---|---|
| DCMP (US Described and Captioned Media Program) | Free library of "Standards-aligned videos with high-quality captions and audio description"; funded by the US Department of Education (OSEP); for families and school staff of students with disabilities | Closest model abroad. K-12, US, own hosted library, not YouTube | ✅ [dcmp.org](https://dcmp.org/) |
| Able Player | Open-source accessible player wrapping YouTube | A tool you can learn from (15c) | 🟡 |
| Android Live Caption / Live Transcribe | OS captions for any audio, Hindi supported on some phones | A helper for your users, not a rival (15a) | ✅ |
| DEF EduSign Academy, DEF-ISL app | Online learning for Deaf students; ISL app | Own content, ISL-first; potential partner | 🟡 |
| ISH News | ISL news, 100K+ subscribers | Content source and recruiting channel | 🟡 |
| ISLRTC / NIOS / NCERT (DIKSHA) | Government ISL content, mostly school level | Content source | ✅ |
| Be My Eyes, Ava, etc. | Visual help, live captions for conversations | Different job | 🔵 |
| Unhook, StudyTube, LearnTube, SyncStudy, PW | No accessibility features found | Not competing here | 🔵 (round 1 listings) |

**Funding**

| Source | Detail | Label |
|---|---|---|
| Prosus Social Impact Challenge for Accessibility (SICA) | Round 1 found prizes of ₹25 L / ₹18 L / ₹12 L | 🟡 (round 1); ❓ whether a 2026–27 edition is open. I couldn't reach the site and ran out of web searches. |
| DEPwD schemes (e.g. the scheme for implementing the RPwD Act, ISLRTC projects) | Government funding for accessibility work | ❓ not checked this round |
| Company CSR (Companies Act) | Education and disability work are standard CSR areas | 🟡 (research.md s.8) |
| ACT for Education | Funds edtech for Bharat | 🟡 (research.md s.8) |

🔵 The draft 2026 RPwD rules (15c) may raise corporate interest in accessibility partners, since large firms will need them within a year of final notice.

**Best way:** Don't compete with content makers. Be the feed that finds their work: partner with ISH, DEF or ISLRTC for channel lists and user recruiting; use DCMP as the model for "quality captioned learning video"; apply for SICA-type grants once a working caption-first prototype exists.

**Risks:** Product: small market for a solo developer; grants are competitive. Legal: low.

**Needs testing:** Would ISH/DEF share channel lists or help find testers?

**Effort for a solo developer:** Low (outreach, not code).

**Risk level:** Low.

---

## Talk-to-users note: start with deaf / hard-of-hearing?

🔵 **The evidence supports starting there, with one split.**
- Captions are the most doable feature: documented API fields, three player parameters, Android Live Caption in Hindi, near-zero cost (15a).
- The pain is measurable: 10–20% word error on Indian lectures (15a).
- The community is organised and reachable online (ISH News, DEF), so recruiting testers is realistic.
- **Split the group:** *hard-of-hearing and late-deafened* learners who read Hindi or English well get value from captions today. *Deaf ISL-first* learners may not, and ISL content for the launch fields barely exists (15b). Interview both, but expect the first group to be the early users.
- Add 2–3 blind or low-vision users early anyway. The draft 2026 RPwD rules (15c) would make screen-reader support a legal floor, and the embedded player is the biggest unknown there.

---

# Group: Costs, funding and compliance

Checked 2026-09-26. Prices in USD from official pages unless marked; ₹ at 96/USD (open.er-api.com, 26 Sep 2026). GCP prices are the **us-central1 list prices** shown on each page by default. The Mumbai (asia-south1) figures load through JavaScript and I could not read them, so India prices are ❓ and may be somewhat higher.

## 23. Running costs and funding

**Possible?** **Yes** for running costs: at every scale the money is small next to one fact, which is that YouTube search quota, not cloud spend, decides how far the app can grow. **Partly** for funding: freemium works only if you charge for your own features, never for YouTube content or YouTube search. Ads mostly don't fit, by policy and by mission.

**Best way:** start on the cheapest setup (one small VM or Cloud Run + a tiny Postgres, no Redis), put the classifier on CPU, and use the LLM only as a fallback. Fund the early stage with cloud credits and one or two government grants. Once the product works, add a paid tier for your own study tools and a paid family account. Treat "self-host the LLM" as a privacy and control choice. On cost alone it doesn't pay until roughly 1M MAU.

### 23.1 Assumptions (all 🔵 mine, change them and the totals move)

| Assumption | Value | Why |
|---|---|---|
| Daily active / monthly active | 30% | Typical for a study habit app; untested |
| Searches per active user per day | 3 | A study session or two |
| Backend requests per active user per day | 40 | Feed pages, notes sync, player events, settings |
| CPU time per request | 0.1 vCPU-second, 512 MiB | Light API server |
| Search cache hit rate | 50% | Popular queries shared across users, cached ≤ 30 days (III.E.4) |
| YouTube calls per uncached search | 1 `search.list` call + 1 `videos.list` unit (duration, embeddable, region, Made for Kids) | |
| Videos that need a label per month | 20k / 500k / 10M | Labels expire within 30 days, so the "cache" is re-filled monthly |
| Share sent to the LLM | 20% (the rest settled by the CPU classifier) | Confidence threshold; untested |
| Tokens per LLM classification | 400 in, 100 out (unbatched; gpt-oss is a reasoning model, so allow for reasoning tokens) | Batching 20 titles per prompt cuts this ~5× |
| Goal parses | 2 per MAU per month, 1,000 in / 300 out | New or edited goals |
| Response size | 20 KB | Video streams come from YouTube's servers, not yours, so they add nothing to your egress bill |

### 23.2 Unit prices found

| Item | Price | Label |
|---|---|---|
| Cloud Run, request-based | $0.000024 per vCPU-second, $0.0000025 per GiB-second, $0.40 per million requests. Free each month: 180,000 vCPU-s, 360,000 GiB-s, 2M requests | ✅ [Cloud Run pricing](https://cloud.google.com/run/pricing) |
| Cloud Run region tiers | Mumbai (asia-south1) is **not** in the Tier 2 list; Delhi (asia-south2) is Tier 2 (dearer) | ✅ same page |
| Cloud Run NVIDIA L4 GPU | $0.0001867 per second = **$0.67/hour ≈ $491/month** if always on (CPU and memory extra) | ✅ same page |
| Cloud SQL shared-core | db-f1-micro $0.0105/h (**$7.67/mo**), db-g1-small $0.035/h (**$25.55/mo**); no SLA on these | ✅ [Cloud SQL pricing](https://cloud.google.com/sql/pricing) |
| Cloud SQL dedicated (Enterprise) | $0.0413 per vCPU-hour, $0.007 per GiB-hour; HA doubles. SSD storage ≈ $0.17 per GB-month ($0.34 HA) | ✅ same page |
| Memorystore for Redis | Basic 1–4 GiB $0.049 per GiB-hour (**1 GiB ≈ $36/mo**); Standard 5–10 GiB $0.054 per GiB-hour | ✅ [Memorystore pricing](https://cloud.google.com/memorystore/docs/redis/pricing) |
| Supabase | Free: 500 MB database, 50,000 MAU, **paused after 1 week of inactivity**. Pro from $25/mo incl. $10 compute credit; Small compute $15, Medium $60 | 🟡 [pricing](https://supabase.com/pricing) (via fetch summary); **Mumbai `ap-south-1` available** ✅ [regions](https://supabase.com/docs/guides/platform/regions) |
| Neon | Launch $0.106 per CU-hour, $0.35 per GB-month, scale to zero | 🟡 [pricing](https://neon.com/pricing); **no Mumbai region** on the regions page (❓ closest is likely Singapore) |
| Upstash Redis | Free 500K commands/mo; pay-as-you-go $0.20 per 100K commands; fixed 250 MB $10/mo | 🟡 [pricing](https://upstash.com/pricing/redis); Mumbai region 🟡 (search result, not confirmed on an Upstash page) |
| Fly.io | shared-cpu-1x 256 MB ≈ $1.94/mo; volumes $0.15/GB-mo | 🟡 [pricing](https://docs.fly.io/about/pricing/); **no Mumbai (bom) region** listed now |
| DigitalOcean droplet | $6 (1 GB) / $12 (2 GB) / $24 (4 GB, 2 vCPU) per month; Bangalore data centre exists | 🟡 [pricing](https://www.digitalocean.com/pricing/droplets) |
| Groq (self-serve) | **gpt-oss-20b $0.075 in / $0.30 out** per M tokens; gpt-oss-120b $0.15 / $0.60; **gpt-oss-safeguard-20b $0.075 / $0.30** (a safety-policy classifier); Qwen3.8-27B $0.80 / $4.00. **Llama 3.1 8B and Llama 3.3 70B are now marked "Enterprise / Contact Sales"** | ✅ [Groq models page](https://console.groq.com/docs/models) (raw HTML) |
| Fireworks | Serverless by size: < 4B $0.10, 4–16B $0.20, > 16B $0.90 per M tokens (same in and out); MoE ≤ 56B $0.50; batch 50% off. Embeddings ≤ 150M params $0.008 per M tokens. On-demand H100 $8/hour | 🟡 [serverless pricing](https://docs.fireworks.ai/serverless/pricing), [pricing](https://fireworks.ai/pricing) (via fetch summary) |
| India GPU cloud | E2E Networks L4 from ₹49/hour, ≈ ₹30,762/month | 🟡 [E2E page](https://www.e2enetworks.com/gpus/nvidia-l4) (vendor) |
| DigiLocker check | ≈ ₹2.50 per request (EKO aggregator) to ≈ ₹3 per verified parent | 🟡 [EKO](https://eps.eko.in/products/digilocker-api), [MediaNama](https://www.medianama.com/2025/03/223-how-much-does-parental-consent-verification-cost-under-indias-dpdp-act/) |
| Apple Developer Program | 99 USD a year (≈ ₹9,500; charged in local currency) | 🟡 [Apple](https://developer.apple.com/programs/whats-included/) |
| Google Play registration | US$25 once | 🟡 [Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en) (search result) |
| Google Play service fee | **15% on auto-renewing subscriptions** at any revenue; 15% on first $1M otherwise | 🟡 [Play Help](https://support.google.com/googleplay/android-developer/answer/112622?hl=en) (via fetch summary) |
| Domain | `.in` ≈ ₹500–900 a year at renewal | 🟡 [registrar list](https://www.chennaihost.com/domains-price-list.html) |
| Legal review (India) | Privacy policy + terms + DPDP notices ≈ ₹50,000–₹2 lakh one-off; fractional DPO ₹2–8 lakh a year (not required unless you become a Significant Data Fiduciary) | 🟡 [Consently](https://www.consently.in/blog/dpdp-act-compliance-cost-india-2026), [Inc42](https://inc42.com/features/india-dpdpa-startups-privacy-compliance-costs-burden-law/) (vendor/news, treat as rough) |

### 23.3 Cost model (🔵 my arithmetic on the prices above)

| | **100 MAU** (30 DAU) | **10,000 MAU** (3,000 DAU) | **1,000,000 MAU** (300,000 DAU) |
|---|---|---|---|
| Backend requests / month | 36,000 | 3.6M | 360M |
| Compute | Cloud Run inside free tier: **$0** (or one $6–12 droplet for everything) | Cloud Run ≈ **$5–30** (more if you keep a warm instance) | Cloud Run ≈ **$600–1,500** (≈ $1,050 on request pricing; instance billing with concurrency is cheaper) |
| Database | db-f1-micro + 10 GB ≈ **$9** (or Supabase Free, but it pauses after a week without traffic) | db-g1-small + 20 GB ≈ **$29** (2 vCPU/8 GB ≈ $101 if needed) | 4 vCPU/16 GB **HA** + 200 GB ≈ **$475** |
| Cache | none (Postgres table) | Upstash ≈ **$10–15** or Memorystore 1 GB ≈ $36 | Memorystore Standard 5 GB ≈ **$197** |
| Egress | ~$0 | 72 GB ≈ **$6–9** ❓ rate | 7.2 TB ≈ **$600–850** ❓ rate |
| LLM classification | < **$1** | ≈ **$6** (20% fallback) to $30 (all) | ≈ **$120** to $600 |
| Goal parsing (LLM) | < $0.05 | ≈ **$3** | ≈ **$330** |
| CPU embeddings/classifier | inside compute | ≈ $1 | ≈ $5–10 (10M titles × ~30 ms) |
| Logs, monitoring, backups | ~$0 | ≈ $10 | ≈ $100–300 |
| **Monthly total** | **≈ $10–15 (₹1,000–1,500)** | **≈ $70–200 (₹7,000–19,000)** | **≈ $2,400–4,300 (₹2.3–4.1 lakh)**, ≈ ₹0.25–0.40 per MAU |
| YouTube `search.list` calls needed / day | **45** (fits the default 100) | **4,500** (45× default: **needs audit + extension**) | **450,000** (4,500× default: ❓ whether YouTube would ever grant this) |
| YouTube general units / day | ~50 | ~4,500 (fits 10,000) | ~450,000 (**needs extension**) |

Fixed and one-off costs: Apple ≈ ₹9,500/yr, Play ≈ ₹2,400 once, domain ≈ ₹900/yr, legal ≈ ₹0.5–2 lakh once (more for the family-account opinion, ❓). DigiLocker for the later family account: at ₹2.5–3 per parent, 100,000 families ≈ ₹2.5–3 lakh, one-off per family, plus aggregator setup fees ❓.

**What the model says:**
1. **Quota is the ceiling, not money.** Past a few dozen daily users, search needs an approved extension (see 24). Without one, the app has to lean on curated channel feeds (`playlistItems.list`, 1 unit) and the shared search cache.
2. **The LLM is cheap.** Even sending every video to the LLM costs about $600 a month at 1M MAU. Batching 20 titles per prompt cuts that about 5×.
3. **Self-hosting doesn't save money until very late.** One always-on L4 costs about $491/month on Cloud Run (GPU alone) or ≈ ₹30,762 on E2E. That only beats the Groq bill at around 1M MAU. Reasons to self-host earlier are privacy (no third party sees titles) and not depending on one provider. ❓ How many classifications per second one L4 handles needs a load test.
4. **Groq change worth noting:** the Llama models research.md assumed are now enterprise-only on Groq. Self-serve open models are gpt-oss-20b/120b and Qwen3.8-27B. Fireworks still sells small models (4–16B) at $0.20 per M tokens.

### 23.4 Funding options

**What you may charge for** (✅ [Developer Policies III.F and III.G](https://developers.google.com/youtube/terms/developer-policies)):
- "API Clients must not charge users to watch content in an embedded YouTube player."
- You must not "sell YouTube API Services or access to any components of YouTube API Services unless you obtain YouTube's prior written approval." 🔵 So a paid tier that unlocks **more searches or a better YouTube feed** is risky. Charge for your own things: notes and export, planner, revision reminders, cross-device sync, study stats built from the user's own data, the family account and parent tools.
- API Clients "must not offer or provide incentives, rewards, or other compensation to users for… viewing content." 🔵 So no coins, points or streak rewards tied to watching videos. Rewards for the user's own study actions (notes written, planner kept) are safer.
- "Selling an API Client" and "ad-enabled API Clients" are permitted, subject to the rules above. ✅

**Ads** (✅ III.G): you must not sell ads "on or within YouTube audiovisual content or the YouTube player" without written approval, nor "on any page or screen that contains YouTube API Data unless other data, content, or material not obtained from YouTube appears on the same page and offers enough independent value." DPDP s.9(3) bans targeted ads to children ✅ (research.md 11). 🔵 Verdict: no ads on feed, search or player screens. Ads on the notes or planner screens are allowed but go against the "no distraction" promise. I'd skip ads.

| Option | Pros | Cons | Label |
|---|---|---|---|
| **Freemium (own features)** | Proven in this niche (SyncStudy); fits policy if nothing YouTube-sourced is paywalled | Indian students pay little; Play and Apple take 15% of subscriptions | ✅ policy, 🟡 fees |
| **Family account (paid by parent)** | Parents pay for focus; DigiLocker check is a one-off ₹2.5–3 | Built later; must stay "user sets the rules" for the child too | 🔵 |
| **Ads** | Familiar in India | Policy limits above; mission clash; no targeted ads to minors | ✅ policy |
| **Startup India Seed Fund (SISFS)** | Up to ₹20 lakh grant, ₹50 lakh debt/convertible, through incubators | Needs a DPIIT-recognised company under 2 years old; portal showed the last startup date as **31 May 2026**, so ❓ whether a new round opens | 🟡 [SISFS](https://seedfund.startupindia.gov.in/), [summary](https://certifykaro.com/blogs/startup-india-seed-fund-scheme-2026-latest-updates-eligibility-and-application-guide) |
| **MeitY Startup Hub** | TIDE 2.0 EIR grants up to ₹7 lakh; SAMRIDH matching up to ₹40 lakh | Through incubators/accelerators; competitive | 🟡 [TIDE 2.0](https://msh.meity.gov.in/schemes/tide), [SAMRIDH](https://msh.meity.gov.in/schemes/samridh) |
| **Prosus SICA** | Accessibility grants ($35k/$25k/$15k in 2022) plus Social Alpha follow-on | Commitment was $250k over 3 years from 2022; ❓ no 2026 round found. Needs real accessibility work, which isn't researched yet | 🟡 [YourStory](https://yourstory.com/2022/09/prosus-social-impact-challenge-accessibility-2022) |
| **DEPwD** | Has an R&D scheme; budget up ~30% for 2026-27 | ADIP funds device purchase and distribution, not app startups; no startup grant found | 🟡 [DEPwD R&D](https://depwd.gov.in/en/research-development/), [MediaNama](https://www.medianama.com/2026/09/223-government-proposal-tech-disability/) |
| **Google for Startups Cloud** | Start tier up to $2,000 with no investor; Scale up to $200k (AI-first up to $350k) with a partner investor | Start tier covers only a few months at 10k MAU; big tiers need funding | 🟡 [Google](https://cloud.google.com/startup), [summary](https://cloudkompas.com/blog/google-cloud-for-startups-2026-credits-guide) |
| **AWS Activate** | Founders ~$1,000 self-serve; Portfolio up to $100k | You'd split across two clouds; YouTube API is on GCP anyway | 🟡 [AWS](https://aws.amazon.com/startups/lp/aws-activate-credits?lang=en-US) |
| **B2B / institutions** (coaching institutes, colleges, CS/CMA study circles) | Fewer, larger customers; may unlock the DPDP educational-institution route for minors | Long sales; ❓ whether a private app qualifies (lawyer) | 🔵 |

### How competitors fund themselves

| Product | Model | Label |
|---|---|---|
| **SyncStudy** | Free (3 playlists), **Pro ₹99/mo** (20 playlists, AI quiz, AI planner), **Ultra ₹149/mo** (unlimited, AI tutor). Paid features are its own tools, not YouTube access | 🟡 [pricing page](https://www.syncstudy.in/pricing) (via fetch summary) |
| **StudyTube: No distractions** | Free + in-app purchases; Play shows no "Contains ads" label; 50K+ downloads, 4.2★ (1.13K reviews). Rated 3+ | ✅ [Play, India listing](https://play.google.com/store/apps/details?id=com.thecodefuel.studytube) (raw page, 26 Sep 2026) |
| **Unhook** | Free; donations via PayPal and similar. unhook.app claims 1,000,000+ active users. It's a browser extension, so it has no API or server costs | ✅ [unhook.app](https://unhook.app/) (users), 🟡 donations |
| **YPT (Yeolpumta)** | **Contains ads + in-app purchases**; 50 lakh+ downloads, 4.5★ (79.4K reviews) | ✅ [Play, India listing](https://play.google.com/store/apps/details?id=com.pallo.passiontimerscoped) |
| **Physics Wallah** | Free YouTube lectures as the funnel; paid batches in its own app (4.5M paying) | 🟡 research.md section 2 |
| **LearnTube India** | "100% ad-free" PW videos and coin rewards | 🔵 both look like breaches of III.I (blocking ads) and III.F (rewards for viewing). Don't copy |

**Sources:** listed in the tables above.

**Risks:**
- Legal: a paid tier that improves the YouTube feed may count as selling access to YouTube API Services (III.G). Keep a clear line between paid and YouTube-sourced features. Lawyer and audit should see the paywall design.
- Technical: Mumbai prices unread; egress rate unverified; Groq model line-up changes without notice (it already did).
- Product: Indian students expect free. A ₹99 tier needs features people value without YouTube in them.

**Needs testing:** real requests per user; search cache hit rate (the biggest lever on quota); LLM fallback share; L4 throughput for self-hosting; willingness to pay (ask in your interviews).

**Effort for a solo developer:** Low for costs (small bills until 10k MAU); Medium for funding (grant applications need a registered company and DPIIT recognition).

**Risk level:** Low for cost; Medium for funding.

## 24. Full compliance: YouTube audit, Terms, RMF, DPDP, deletion

**Possible?** **Yes** for everything except one item. Privacy policy, terms, branding, player rules, 7-day deletion, DPDP notices, breach reporting and grievance handling are all doable by a solo developer with a lawyer's review. **The exception:** a model that infers whether a YouTube video is "learning" or "entertainment", or "safe", is **not clearly allowed without YouTube's permission**. Read literally, the compliance guide bans it (24.3). Say that plainly to the user: the core AI filter may need exactly the kind of special permission the project said it wouldn't seek.

**Best way:** apply for the audit early (before building the classifier), describe the filter fully in the form, and ask the question in writing. Build the app so it still works if the answer is "no": user-set rules plus fields YouTube itself returns. Split stored data into classes so the YouTube 7-day rule and DPDP log-retention rules don't collide.

### 24.1 The audit and quota extension process (✅ read on the live form and pages, 26 Sep 2026)

**What the pages say** ([Quota and Compliance Audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits)):
- Default: "100 search.list calls, 100 videos.insert calls, and 10,000 units per day combined for all other endpoints." ✅ (confirms research.md 17.2)
- More quota requires an audit "to show that your project is in compliance with the YouTube API Services Terms of Service." Separate forms exist for appeals, periodic re-audits, and change of control. A new request within 12 months of a passed audit uses the same form.
- Timeline: only "A member of YouTube's API Services team will contact you as soon as possible." **No SLA.** ✅
- The compliance guide says: "If, after reviewing this article and the policies linked to above, you're unsure whether your service is allowed, please apply for an API Compliance Audit, and include a clear summary that mentions any end users in the audit form." ✅ [guide](https://developers.google.com/youtube/terms/developer-policies-guide). **This is the official route to ask the derived-data question.**

**Form fields** ([Audit and Quota Extension Form](https://support.google.com/youtube/contact/yt_api_form), raw page):

| Section | Fields that matter for this app |
|---|---|
| 1. Request type | "additional quota" or "keep current quota (re-audit)" |
| 2. Organisation | Apply as organisation **or as an individual** ("write 'self'"); legal name, address, **https website**; category (has "Education and E-Learning"); size (has "Independent Developer/Sole Proprietor"). Note on the form: apps must show "significant independent value to the YT ecosystem" |
| 3. Business model | "Describe your organization's work as it relates to YouTube" (100–5,000 characters); audience; **monetisation** (subscriptions / freemium / free / ads on pages with YouTube content); whether you sell ads in or on the player; Google contacts |
| 4. API client | Name, and **"Does this API Client name contain the word 'YouTube'?"** (not allowed without approval); primary URL; **privacy policy URL** (required); terms URL; public or not; **demo account "with FULL access to all features, including premium"** |
| 5. Per project | Cloud project number; use-case category (e.g. "Websites & Mobile Apps", "Education & Research"); OAuth yes/no; **optional opt-in to the derived-metrics amendment**; expected daily volume; **required uploads:** privacy policy screenshots "(Showing YouTube sections, Google Privacy Policy link, deletion policies, etc.)", homepage screenshot "showing where Privacy Policy link is located with YouTube branding visible", terms of service; **player/embed screenshots** for app use cases; endpoints used; total quota **plus a separate quota figure and justification for `search.list`** |
| 6. Evidence | Screenshots ≥ 1280×720, address bar visible; optional architecture and user-flow diagrams |
| 7. Attestations | Agree to Terms; you will "notify YouTube in writing of any changes to my stated use case and seek approval for such changes prior to continued use"; truthfulness; consent to Google processing the submission "including via automated/LLM-based systems" |

**Did the June 2026 granular quota change alter the audit?** Yes, in shape:
- `search.list` and `videos.insert` now have their own buckets, and the form asks for their quota **and justification separately** ✅. Google says the change "simplifies the path to quota increases by allowing YouTube to more easily verify and approve requests based on specific method usage" ✅ [revision history, 1 June 2026](https://developers.google.com/youtube/v3/revision_history).
- New **Developer Policies III.L** (derived metrics and storage), applying to requests "starting June 01, 2026" ✅. See 24.3.
- 3 June 2026: new `videos.batchGetStats` method with its own 10,000-unit bucket ✅.
- ❓ Whether approvals got faster. I found no data.

**Timelines and rejection reasons** (🟡, secondary; I couldn't open primary developer threads): reports range from a few weeks to several months, with one Google Community thread said to show five months. Approvals often come in below the amount asked. Common rejection reasons: vague use case; the live product differs from what was described; missing or weak privacy policy; unclear data handling; branding breaches; scraping-like or bulk-harvesting use; wrong form. [singhamandeep.com](https://singhamandeep.com/youtube-data-api-quota-increase-audit/), [SocialCrawl](https://www.socialcrawl.dev/blog/youtube-data-api-2026). ⚠️ SocialCrawl (cited in research.md 4) still describes the old "100 searches burn 10,000 units" model. It is out of date on quota.

**Other audit-related rules** ✅ ([Developer Policies](https://developers.google.com/youtube/terms/developer-policies), guide):
- YouTube may audit at any time, and you must give review accounts on request (III.H; ToS §6).
- A project with no use for **90 days** can lose its credentials or quota.
- **No "sharding":** don't spread one use case over several Cloud projects for more quota. Separate projects for iOS and Android, or for dev and prod, are allowed.

### 24.2 Required Minimum Functionality (✅ [RMF](https://developers.google.com/youtube/terms/required-minimum-functionality))

| Rule | Why it matters here |
|---|---|
| Embedded players must identify the app through the HTTP **Referer**. In a WebView, set it yourself (`loadDataWithBaseURL` / `loadHTMLString:baseURL:` or a Referer header) as `https://<app ID>`, e.g. the bundle ID | 🔵 A missing Referer is a likely cause of the iOS "Error 153" listed under testing in research-summary. Test this first |
| Use the OS WebView (Android WebView/CustomTabs; iOS WKWebView/SFSafariViewController) | Rules out custom player shells |
| Player at least **200×200 px**; controls fully visible | Small "mini-player" layouts are limited |
| Autoplay only when more than half the player is visible; one autoplaying player per screen | |
| Thumbnails that start playback at least **120×70 px** | |
| **No overlays** or frames over any part of the player; no mouseover or touch actions on the player | No "focus timer" drawn over the video |
| "For API Clients with a high number of requests… additional credentials might be required to access the YouTube embedded player" | ❓ Unknown threshold; could matter at 1M MAU |


### 24.3 The compliance-guide lines on categories and safety, and how an auditor may read them

**The text** (✅ raw [guide](https://developers.google.com/youtube/terms/developer-policies-guide), heading "Only offer metrics that are available via YouTube's API services", list "Don't use YouTube's API to:"):
- "Make any claims on whether a video or channel is safe or suitable to watch or advertise against."
- "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API."
- "Merge or combine YouTube API data with any other data."
- And, under the standard player experience: "Links must open in the YouTube application whenever the application is available on a user's device, or if not installed, via the system web browser."

**What the June 2026 amendment adds** (✅ [derived-metrics policy](https://developers.google.com/youtube/terms/derived-metrics-policy), Developer Policies III.L, audit form section 5): audited developers may create extra metrics, including **"Content Categorization and Tagging"** ("assign descriptive sub-genres or tags to videos"; tags must be "clearly disclosed to the user that they are your tags") and **"Brand Suitability & Safety Scoring"**, and store derived metrics up to 36 months. But: "These policies are only applicable to audited developers with **analytics use cases**", "Your API Service must reflect an analytics use case on YouTube", and you opt in by choosing "Analytics & Reporting" as the use case.

**Literal reading (🔵, how I expect a careful reviewer to read it):**
- A learning-vs-entertainment label *is* inferring "the content category/type of a video". A harmful-content filter *is* a claim on whether a video is "safe or suitable to watch".
- Joining classifier output with titles and descriptions is "merging" API data with other data.
- The amendment confirms that YouTube sees content tagging and safety scoring as derived metrics. They're **banned by default** and allowed only by opt-in permission, and only for analytics products.
- Keeping labels internal doesn't help much. "X results hidden" tells the user the app judged those videos, and hiding *is* acting on the inferred category.
- Result: **not allowed without the amendment. The amendment is a special permission, and this app isn't an analytics use case.**

**Counter-reading (🔵, the best honest case for the app):**
- The heading is about *metrics offered to users* ("Only offer metrics…"; "Don't use YouTube's API to offer independently calculated or derived metrics"). Internal, never-displayed labels that apply a filter the user chose aren't "offered".
- The same guide lists "Restrict, filter, or prohibit a user's access to content on YouTube without their knowledge or consent" as a don't. That implies filtering *with* knowledge and consent is expected, and any useful filter needs some judgement about content.
- The classifier is trained on non-YouTube text, labels are cached ≤ 30 days, and the user can see and override every hidden result.
- YouTube's own `safeSearch` parameter shows it accepts result filtering as a feature.
- Weakness: the wording ("Infer or estimate the content category/type") isn't limited to display. I rate this reading arguable, not safe.

**Where to disclose, and the risk each way:**

| | Disclose in the form | Don't disclose |
|---|---|---|
| Where | "Describe your organization's work as it relates to YouTube" (5,000 characters): say plainly that an in-app model reads titles and descriptions at request time to hide results the user asked to hide, with no labels shown, ≤ 30-day cache, and "X hidden · Show". Repeat it in the `search.list` justification; attach the architecture diagram. The guide's "unsure" sentence invites exactly this | — |
| Risk | Quota refused, or a request to remove the filter. You can appeal, and the app keeps default quota | **Not a real option.** You attest truthfulness and promise to report use-case changes. The reviewer gets a full-access demo account. III.H forbids concealing use. Periodic audits follow. The guide warns violations can mean key revocation or "termination of the Google account" ✅ |
| Upside | A written answer before you build the model | None lasting |

**Is "no special permission" still workable?** **Partly.** 🔵
- **If the filter is model-based inference on YouTube titles, the literal reading says it needs permission**, and the only published permission path (III.L) doesn't fit this app. The stance and the AI filter conflict; the user should decide which gives way.
- **What stays allowed without permission:** the goal parser working on the user's own text; search queries built from the goal (the strongest lever: the feed is shaped by *what you search for*, not by classifying results); user-set channel and keyword mutes; human-curated channel lists; fields YouTube returns (`categoryId`, which the guide explicitly allows as "the content type returned by the YouTube API"; `duration`; `madeForKids`; `safeSearch=strict`).
- Automated channel lists built by a model sit in the same grey zone as labels.
- The fallback still gives a usable product and matches the worst case in research-summary ("channel lists, mutes, Shorts off and notes").

**Links:** the "must open in the YouTube application… or… system web browser" line makes research.md section 4 partly out of date. It says "At most you choose where the link opens". In fact **you can't choose. Links go to the YouTube app if installed.** The escape problem is fixed by design and can't be reduced by routing.

### 24.4 API Terms of Service and Developer Policies: items easy to miss (✅ [ToS](https://developers.google.com/youtube/terms/api-services-terms-of-service), [Policies](https://developers.google.com/youtube/terms/developer-policies), [Branding](https://developers.google.com/youtube/terms/branding-guidelines))

| Item | Requirement |
|---|---|
| Terms of use | Link to the YouTube Terms (https://www.youtube.com/t/terms) and state in *your* terms that users "are agreeing to be bound by the YouTube Terms of Service" (III.A) |
| Privacy policy | Users agree to it **before** using features. It must be always easy to reach, say the app uses YouTube API Services, **link the Google Privacy Policy**, and explain what's collected, used and shared, third-party content or ads, and cookies/device storage. With OAuth data it must also explain revocation at https://security.google.com/settings/security/permissions and give a complaints contact (III.A.2) |
| Re-consent | Prompt users to re-accept the privacy policy before using data for new purposes |
| Deletion wording | Must "make clear that deleting the data stored by the API Client does not… affect data stored by YouTube" (III.E.4) |
| 7 vs 30 days | Policies: delete within **7 calendar days** of a request or account deletion. The guide says "within 30 days". ⚠️ The documents disagree; follow the stricter 7 |
| Branding | YouTube attribution on every screen with YouTube content. **No "YouTube", "YT" or variants in the app name**; no YouTube logos beside the app name; any YouTube logo links back to YouTube content |
| Rewards | No incentives or rewards for viewing (III.F): no streaks or coins for watching |
| Security | "Reasonable and appropriate" controls; industry-standard transport encryption (ToS §8; III.E) |
| Quota | Must not exceed or circumvent quota (ToS §15) |
| Publicity | YouTube may name your app in its marketing (ToS §13) |
| Termination | Delete all API Data and certify in writing if asked (§24.3). "It is solely your responsibility… to be prepared to… operate your API Client(s) without access to any aspect of the YouTube API Services" (§24.5) |
| Law and venue | California law; Santa Clara County courts (§25.11) |
| Made for Kids | Look up MFK status of each embedded video; tracking off for MFK videos (III.E.4.j) |

### 24.5 DPDP obligations for a small Data Fiduciary (✅ Act and Rules, gazette text)

| Duty | What the text says | Status |
|---|---|---|
| **When** | Rules 3, 5–16 commence "eighteen months after the date of publication" (published 13/14 Nov 2025, so ~13/14 May 2027); Rule 4 (Consent Managers) after one year | ✅. A MeitY proposal to cut this to 12 months (Nov 2026) was **not gazetted** as of 21 Sep 2026 🟡 [ConsentOS](https://consentos.in/learn/dpdp-compliance-timeline/), [Chambers](https://chambers.com/articles/meity-plans-to-cut-short-dpdp-compliance-timeline-and-notify-cross-border-restrictions-for-sdfs) |
| **Notice (Rule 3)** | Stand-alone; clear, plain; "itemised description of such personal data"; purposes and the services they enable; a link to the app/site; how to **withdraw consent "with the ease… comparable to" giving it**, exercise rights, and complain to the Board | ✅ |
| **Security (Rule 6)** | Minimum: encryption/masking/tokens; access control; logs and monitoring; backups; **keep logs and data for detection for one year**; security terms in processor contracts | ✅ |
| **Breach (Rule 7)** | Tell each affected user "without delay" (what, consequences, mitigation, what they can do, contact). Tell the Board "without delay", then a detailed report **within 72 hours** (extendable on written request) | ✅ |
| **CERT-In (separate law)** | Report listed cyber incidents **within 6 hours**; keep ICT logs for a **rolling 180 days within India** | ✅ [CERT-In Directions, 28 Apr 2022](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf) (new, not in research.md) |
| **Erasure (s.8(7), Rule 8)** | Erase when consent is withdrawn or the purpose ends. The **Third Schedule** periods (3 years, 48-hour warning) apply **only** to e-commerce ≥ 2 crore users, online gaming ≥ 50 lakh, social media ≥ 2 crore. **This app is in none**, so the general "as soon as reasonable" rule applies | ✅ |
| **Minimum log retention (Rule 8(3))** | Every fiduciary keeps "such personal data, associated traffic data and other logs of the processing for a minimum period of **one year**" for Seventh Schedule (state access) purposes, then erases | ✅ |
| **Contact (Rule 9, s.8(9))** | Publish a contact person (DPO only "if applicable", i.e. SDF); include it in every rights reply | ✅ |
| **Rights and grievances (Rule 14, s.8(10))** | Publish how to make requests and the identifier needed; answer grievances within **90 days** at most; allow a nominee | ✅ |
| **Significant Data Fiduciary** | **No numeric threshold.** Notified by the government on volume and sensitivity of data, risk to users, sovereignty, elections, security, public order (s.10). If notified: yearly DPIA and audit, DPO in India, algorithm due diligence, possible localisation (Rule 13) | ✅. 🔵 Unlikely for years; a children's-data app at scale could attract it |
| **Children (s.9, Rule 10)** | Verifiable parental consent; no tracking, behavioural monitoring or targeted ads | ✅ (research.md 11, 17.4) |

### 24.6 How the YouTube 7-day rule and DPDP erasure fit

| Data class | YouTube rule | DPDP / CERT-In rule | Fit (🔵) |
|---|---|---|---|
| User content tied to API data (bookmarks, notes with video IDs, progress) | Delete within **7 days** of request or account deletion | Erase on withdrawal/request "as soon as" reasonable | **Same direction**: delete within 7 days |
| Account data (email, goal text, settings) | 7 days | Erase on request | Same: 7 days |
| Shared caches (titles, labels, search results) | ≤ 30 days | Not personal data if no user ID attached | Keep user IDs out of caches |
| **Processing and security logs** | "User data" gone within 7 days (❓ whether logs count) | **Keep ≥ 1 year** (Rule 8(3)); CERT-In 180 days in India | **Conflict.** Log only pseudonymous user ID, time, action, IP, **never video IDs or titles**, so logs hold no API Data; ToS §5 requires obeying the law. **Lawyer** |
| Payment records | — | Tax/accounting retention | Keep; no API Data |

### 24.7 Other items found

- **Store account deletion:** Google Play and Apple require in-app account deletion (Play also a web link). 🟡 from memory, not re-read this session. It lines up with the 7-day rule.
- **Selling subscriptions** may bring Consumer Protection (E-Commerce) Rules duties and GST past the threshold. ❓ **Lawyer/CA**.

### 24.8 Compliance checklist (across research.md and this section)

| # | Item | Source | Lawyer? |
|---|---|---|---|
| 1 | App name without "YouTube"/"YT"; attribution on every YouTube screen; logos link back | Branding; III.F | No |
| 2 | Terms: YouTube ToS link and "bound by YouTube ToS" sentence | III.A | Review |
| 3 | Privacy policy accepted before use; all III.A.2 items; Google Privacy Policy link; deletion wording | III.A, III.E.4 | **Yes** |
| 4 | DPDP Rule 3 notice: itemised data, purposes, withdraw/rights/complaint routes; language options | Rule 3, s.5 | **Yes** |
| 5 | Separate consent for the adult behaviour layer | research.md 17 | **Yes** |
| 6 | Accessibility/health-related settings: consent or on-device only | Guide; DPDP | **Yes** |
| 7 | Delete-data and delete-account in app; done within 7 days incl. processors and backups | III.E.4; s.8(7) | Review |
| 8 | Logs without API Data; 1-year (Rule 8(3)) and 180-day in-India (CERT-In) retention | Rule 8(3); CERT-In | **Yes** |
| 9 | Breach plan: users without delay; Board without delay + 72h report; CERT-In 6h | Rule 7; CERT-In | Review |
| 10 | Published contact person; grievances answered ≤ 90 days | Rules 9, 14 | No |
| 11 | Security baseline; processor contracts (Groq/Fireworks DPA) | Rule 6; ToS §8 | Review contracts |
| 12 | API data caches ≤ 30 days; no user IDs in shared caches | III.E.4 | No |
| 13 | **Classifier vs "infer content category" / "safe or suitable": written answer via the audit** | Guide; III.E.4.h; III.L | YouTube |
| 14 | Titles sent to an LLM host ("merge or combine"; third-party access) | Guide; III.E | YouTube + review |
| 15 | Search results unmodified; hidden results disclosed with "Show" | III.C; guide | No |
| 16 | Player: Referer/app ID, OS WebView, ≥ 200×200, no overlays, ads and related videos untouched, links open in YouTube app or system browser | RMF; III.I; guide | No |
| 17 | No rewards for watching; no gating beyond login/age check; no charge to watch | III.F | No |
| 18 | Paid tier only for own features; no paid access to YouTube search/feeds without approval | III.G | **Yes** |
| 19 | No ads on YouTube-data screens without independent value; none on the player; no targeted ads to minors | III.G; s.9(3) | Review |
| 20 | Made for Kids lookup; tracking off | III.E.4.j | No |
| 21 | `safeSearch=strict`; drop age-restricted, non-embeddable, region-blocked | research.md 17.7 | No |
| 22 | No undocumented endpoints (drop `--check-shorts`); fix `fetch_videos.py` retention | III.D; research-summary | No |
| 23 | One Cloud project per platform/env, no sharding; stay active (90 days) | Guide; III.D | No |
| 24 | Audit pack: privacy/homepage/ToS/player screenshots, demo account, `search.list` justification, architecture diagram; report use-case changes | Form | No |
| 25 | 18+ gate and minor-signal re-check | DPDP s.9 | **Yes** |
| 26 | Family account: Rule 10 verifiable consent (DigiLocker), no behavioural tracking | Rule 10 | **Yes** |
| 27 | Educational-institution exemption for B2B | Fourth Schedule | **Yes** |
| 28 | IS 17802 accessibility applicability | research.md 3 | **Yes** |
| 29 | Pirated paid-course re-uploads in feeds | research-summary | **Yes** |
| 30 | Subscriptions: consumer e-commerce rules, GST, store billing | Consumer Protection; GST | **Yes** (lawyer/CA) |
| 31 | Termination plan: delete all API Data, certify; app degrades without YouTube | ToS §24 | No |

**Sources:** inline above. Read raw: Developer Policies, compliance guide, derived-metrics policy, API ToS, RMF, Branding Guidelines, quota audit page, live audit form, revision history, DPDP Act and Rules (gazette text), CERT-In Directions 2022.

**Risks:**
- Legal: the category/safety filter may be ruled out; log retention vs 7-day deletion; DPDP consent wording.
- Technical: the audit may take months or be refused, so the app must run on default quota; a wrong Referer breaks playback.
- Product: if the model filter goes, "any goal → learning feed" rests on query building and user rules alone.

**Needs testing:** whether reviewers accept the filter description (only the audit can answer); the Referer fix for iOS Error 153; feed quality with query building + `categoryId` + channel lists and no model.

**Effort for a solo developer:** Medium. Documents, the deletion pipeline, log design and the audit pack are routine work; the lawyer items and the wait on YouTube are not.

**Risk level:** **High** for the AI filter's policy status; Medium for the rest.

---

# Transcript-based understanding: three routes (added 2026-09-27)

You asked for this because transcript-based understanding is core to the idea. Research only, not a plan.

## Why the API blocks it

- ✅ [captions.download](https://developers.google.com/youtube/v3/docs/captions/download): "This method requires the user to have permission to edit the video." It costs **200 units** per call and needs OAuth (`youtube.force-ssl` or `youtubepartner`). So the API gives transcripts only to a video's owner or editors, never for arbitrary videos.
- ✅ Developer Policies III.E: apps must not "download, import, backup, cache, or store copies of YouTube audiovisual content without YouTube's prior written approval". So transcribing the audio ourselves is also out, even for videos marked Creative Commons (`status.license = creativeCommon` ✅).
- 🔵 Captions *shown in the embedded player* are fine for viewers, but the app can't read them: the player is a cross-origin iframe.
- Even with a transcript in hand, using it to decide a video's type runs into the guide's "Infer or estimate the content category/type" line (feasibility section 0 above), unless the transcript comes from outside the API under our own licence (route C).

## Route A: the compliance audit and the III.L tagging route

**What the text allows** ✅ ([derived-metrics policy](https://developers.google.com/youtube/terms/derived-metrics-policy)): "You may use analysis to assign descriptive sub-genres or tags to videos and channels", additive to YouTube's categories and "clearly disclosed to the user that they are your tags". It applies only to developers who pick "Analytics & Reporting" as their use case, and "Your API Service must reflect an analytics use case on YouTube."

**Can a learning app ask?** Yes, anyone can ask in the audit. The guide invites it: "If… you're unsure whether your service is allowed, please apply for an API Compliance Audit, and include a clear summary that mentions any end users" ✅. **Will it qualify?** Probably not as written. 🔵 A viewer-side study app isn't an analytics product, and ticking "Analytics & Reporting" to get in would misdescribe it. That is the kind of thing an audit exists to catch.

**It doesn't solve transcripts anyway.** 🔵 III.L covers analysis of *API Data*. Other people's transcripts aren't API Data we can get, so even a "yes" would only cover tags made from titles and descriptions.

**How to describe the use case honestly (🔵 suggested content for the audit summary):**
1. What the app is: a study app for adults in India that plays YouTube videos in the embedded player, with notes, bookmarks and a goal-based feed.
2. What we'd like to do: tag videos as "learning" or "entertainment" from title and description, at request time, to hide entertainment in a mode the user turns on.
3. How it's disclosed: the mode is chosen by the user; hidden results show "X hidden by [App] · Show"; if tags are allowed, we'd label them as our tags.
4. What we store: tags no longer than 30 days (or as the policy allows); no YouTube data used to train models; titles sent only to a zero-retention LLM host.
5. The direct question: "Does this fall under section 3, Content Categorization and Tagging, of the derived-metrics policy, even though our use case is education rather than analytics? If not, is user-enabled filtering on titles allowed at all?"
6. The use case chosen on the form: the true one (education / end-user app), with this question in the summary.

**Timing:** weeks to months, many rejections 🟡 (research.md s.4). The form's exact fields beyond the derived-metrics page are ❓.

## Route B: a browser extension on youtube.com (no API)

**What YouTube's Terms of Service say** ✅ ([YouTube Terms, India page](https://www.youtube.com/t/terms?gl=IN), "Permissions and Restrictions"). Users are not allowed to:
- "access, reproduce, download, distribute, transmit, broadcast, display, sell, license, alter, modify or otherwise use any part of the Service or any Content except: (a) as expressly authorized by the Service; or (b) with prior written permission from YouTube";
- "circumvent, disable, fraudulently engage with, or otherwise interfere with any part of the Service";
- "access the Service using any automated means (such as robots, botnets or scrapers) except (a) in the case of public search engines, in accordance with YouTube's robots.txt file; or (b) with YouTube's prior written permission".

**Reading (🔵):** the Terms bind the *user*. An extension helps the user act on the page they've opened. Three levels of risk:

| What the extension does | Terms reading (🔵) |
|---|---|
| Hides page parts (feed, Shorts, sidebar) with CSS/JS, like Unhook | Arguably "alter… any part of the Service"; tolerated in practice for years (Unhook 1M+ users on Chrome) |
| Reads the transcript of the video the user opened, when they ask | User-initiated, one video. Same pattern as "YouTube Summary with ChatGPT & Claude": **2,000,000 users**, updated 4 Sept 2026, offers "Copy Transcript" ✅ ([store](https://chromewebstore.google.com/detail/youtube-summary-with-chat/nmmicjeknamkfloonkhhcjmomieiodli)) |
| Fetches transcripts in the background for every search result, to filter them | Automated requests to YouTube's internal endpoints: the closest to "automated means… scrapers". Also fragile: those endpoints are undocumented and can change or add bot checks at any time ❓ |

**Has YouTube acted against such extensions?**
- Ad blocking: yes. ✅ [YouTube Help](https://support.google.com/youtube/answer/14129599?hl=en): "When you block YouTube ads, you violate YouTube's Terms of Service… If you continue to use ad blockers, we may block your video playback." The extension must never touch ads.
- Third-party clients: Vanced (2022) and Invidious (2023) got cease-and-desist letters 🟡 (research.md s.4). Both replaced YouTube's app or site; neither was an extension on youtube.com.
- Distraction blockers and transcript/summary extensions: **I found no action** ❓. My web-search budget ran out mid-task, so this check is thinner than I'd like.

**How the named extensions work:**
- **Unhook** ✅: hides page elements; doesn't read video content. Chrome, Firefox, Edge ([unhook.app](https://unhook.app/)); on Firefox it has 168,291 users, is "Available on Firefox for Android", and asks for access to www.youtube.com and m.youtube.com ([AMO](https://addons.mozilla.org/en-US/firefox/addon/youtube-recommended-videos/)).
- **YouTube Educational Filter** ✅ ([store](https://chromewebstore.google.com/detail/youtube-educational-filte/jhipccnnfgdkjmcbmmahndgboljmhood?hl=en)): "reads the titles and channels of your home page's feed, asks OpenAI 'does this actually teach something?', and filters out the junk". Sends "video titles, channel names, view counts, and durations" to OpenAI. **88 users**, updated 30 July 2026. It doesn't read transcripts.

**Chrome Web Store rules** ✅ ([program policies](https://developer.chrome.com/docs/webstore/program-policies/policies)): "Collection and use of web browsing activity is prohibited, except to the extent required for a user-facing feature described prominently in the Product's Chrome Web Store page and in the Product's user interface", plus the Limited Use rules. Sending titles or transcripts to our server is allowed only as a prominently described feature. DPDP applies to that browsing data too 🔵.

**How well it works on phones: poorly.**
- India's web traffic is 64% mobile (Aug 2026) 🟡 ([StatCounter](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/india)), and Chrome is 88% of mobile browsing 🟡 ([StatCounter](https://gs.statcounter.com/browser-market-share/mobile/india)). Chrome for Android doesn't run extensions 🔵 (well known; not re-checked this round).
- Firefox for Android does (Unhook works there ✅), and Safari on iOS supports web extensions 🟡. Both are small in India.
- 🔵 Most phone viewing happens in the YouTube app, which no extension can touch. So an extension reaches mainly **desktop and laptop** users. That suits students studying at a laptop, but it's a minority of viewing.

**Other costs (🔵):** YouTube changes its page often, so extensions break and need constant fixes. The extension competes with Unhook (1M+ users, free) on the hiding part.

## Route C: creator partnerships and openly licensed sources

**C1. Creator authorises us through the API (OAuth).** ✅ `captions.download` works once the creator (or their channel's editor) authorises us. But:
- ✅ Developer Policies III.E: "API Clients must not display or allow access to Authorized Data to anyone other than the authorizing user or agents expressly approved by that user." 🔵 So a creator's transcript fetched this way can't be shown to viewers, and features built from it for viewers are doubtful.
- 200 units per track → about 50 tracks a day on the default 10,000 🔵.
- **Verdict: weak.** Not the right tool.

**C2. Creator licence outside the API (recommended).** 🔵 A short written agreement: the creator sends us their caption files (exported from YouTube Studio) or their own notes, plus *their own* labels ("CMA Inter Paper 8, Marginal costing, Lecture 12"). This is content licensed to us, not API Data. So:
- no 30-day limit (the licence sets the terms);
- the labels are the creator's own metadata, not our inference, which avoids the "infer… content category" line;
- we can search inside lectures, map lectures to syllabus topics, jump to the moment a topic starts, and build revision notes;
- still needed: the "not from YouTube" disclosure when our data sits next to YouTube data (III.E.4.h ✅), and a lawyer-drafted licence.
- Who would say yes: small and mid-size CS, CMA and NEET-repeater educators who want reach 🔵. Large players (PW) have their own apps and are unlikely.

**C3. NPTEL.** ✅ [nptel.ac.in](https://nptel.ac.in/aboutus): "Distributed under Creative Commons Attribution-ShareAlike CC BY - NC - SA"; "More than 70000 hours of video content, transcribed and subtitled"; "Translation of more than 12000 hrs of English transcripts in regional Indian languages"; its YouTube channel has "40+ lakhs subscribers".
- 🔵 Transcripts come from NPTEL's site (not the API) and match NPTEL's own YouTube videos, which we embed as usual.
- **NC:** fine while the app is free. A paid app needs written permission from NPTEL (IIT Madras) 🔵.
- **SA:** summaries or notes we build from the transcripts and show to users are adaptations, so they must carry CC BY-NC-SA and credit NPTEL ✅ (CC: SA is triggered when adaptations are "publicly shared").
- **Fit:** strong for AI and engineering; thin for Company Secretary, CMA and NEET ❓ (not checked per course).

**C4. SWAYAM.** ✅ Ten national coordinators, including NPTEL (engineering), UGC, CEC, IGNOU, IIMB, NCERT, NIOS ([swayam.gov.in/about](https://swayam.gov.in/about)). Its licence isn't stated on the pages I read ❓. Treat each coordinator separately; NPTEL is the only one with a licence I've seen.

## Comparison

| Route | Transcripts for | Reach in India | Policy / legal risk | Effort (solo) |
|---|---|---|---|---|
| A. Audit / III.L | None (III.L covers titles and descriptions only) | Whole app | Low (asking is safe); likely "no" | Low |
| B. Extension, UI hiding + transcript of the opened video on request | Any video the user opens | **Low**: desktop browsers only; not the YouTube app; not Chrome Android | **Medium**: Terms "alter/modify"; tolerated so far ❓ | Medium, then ongoing fixes |
| B+. Extension fetching transcripts for all search results | Every result | Same low reach | **High**: "automated means… scrapers"; fragile | High |
| C1. Creator OAuth via API | Partner videos | Partner catalogue | Medium: Authorized Data can't be shown to others | Medium |
| C2. Creator licence outside the API | Partner videos | Partner catalogue; all platforms | **Low** with a proper licence | High (outreach, contracts) |
| C3. NPTEL | ~70k hours | All platforms; mainly AI/engineering | Low if free or with NPTEL permission; NC and SA duties | Low–Medium |

## Recommended combination (🔵)

1. **Be plain about the limit.** Transcript-based understanding of *arbitrary* YouTube videos, inside a compliant app, on phones: **No.** No route gives it.
2. **Build transcript features where we hold the rights:** NPTEL first (large, ready, Indian-language translations); ask NPTEL now whether a paid app can use it. Then 5–10 creator partners per test field under an off-API licence, with the creator's own topic labels. This becomes a "deep" layer: search inside lectures, syllabus mapping, jump-to-topic, notes. It's also strong "independent value" for III.I.1.
3. **For everything else, keep the compliant light layer:** YouTube's own fields, curated lists, user rules, goal-based queries (feasibility sections 1 and 13).
4. **File the audit honestly** (route A) and ask the tagging question in writing. Don't tick "Analytics & Reporting".
5. **An extension only as an optional desktop companion, later:** UI hiding plus "use the transcript of this video" when the user asks. No background transcript fetching for search results, and never touch ads. Expect low reach and high upkeep.

**Needs testing:** how many creators in CS/CMA/NEET would sign a licence; NPTEL's answer on commercial use; transcript quality for Hinglish lectures (creator captions vs YouTube auto-captions); whether users value in-lecture search enough to prefer partner content.

---

# Conflicts between expectations

Ordered by impact. "Resolvable" means a design exists that keeps both expectations; "Choice" means you have to decide which gives way.

| # | Expectations in conflict | The conflict | Resolvable? |
|---|---|---|---|
| C1 | **1, 10a, 13** vs **24** and "no special permission" | The filter's core (our classifier judging YouTube videos as entertainment or unsafe) is banned on the literal reading of the guide. The only documented route (III.L) is for analytics apps. | **Choice.** (a) Launch with the classifier off: YouTube's own fields (`topicCategories`, `safeSearch`, `ytAgeRestricted`, etc.) + curated lists + user rules. (b) Describe the classifier honestly in the audit and accept YouTube's answer. (c) Build around the classifier anyway: not advised. (a) and (b) combine. |
| C2 | **9** (labels internal, "X results hidden") vs **24** (III.C Permitted Feature Limitation) | III.C requires saying *why* something is limited and that *the app*, not YouTube, did it. | **Resolvable** with small wording: "3 hidden by [App] · Why · Show". Labels can stay unshown until the user taps "Why". |
| C3 | **9** ("as simple as normal YouTube") vs branding rules / guide | The app can't look like YouTube or be "difficult to distinguish" from it. | **Resolvable:** YouTube-simple *flow*, own look and brand. |
| C4 | **16** (fewer escapes) vs player rules | Player links must open in the YouTube app; end-of-video related videos can't be blocked. | **Partly.** Reduce escapes around the player (autoplay off, own "next" section, show the next item before the video ends); can't prevent them. |
| C5 | **9** ("user never does extra work") vs **1, 7, 13** (clean filters rely on user rules) and **4** (silent signals may be thin) | If the classifier is off (C1), mutes and keyword rules carry more weight, which means user effort. If silent signals are too thin, a rare "Did this help?" may be needed. | **Choice**, driven by C1. App-suggested, one-tap-accept rules keep the effort low. |
| C6 | **18, 20** (studied, Done for today, weekly totals) vs **24** (III.F no rewards for watching) | Coins, points or streaks earned by watching are banned. | **Resolvable:** track study (notes, "studied", plans kept), never reward; no coins, leaderboards or watch streaks. |
| C7 | **3** (any goal, automated sources) vs guide ("custom scores to channels", "infer… category of a… channel") | Automated "good channel for CMA" lists judge channels from API data. | **Resolvable in part:** human-curated lists (your stated base) are clean; automated lists should rest on *your users' actions*, not on analysing channel metadata. |
| C8 | **6** (Shorts limited) vs guide (content-type inference) | "Is this a Short?" from duration + aspect ratio may count as inferring content type. | **Partly.** Using returned fields (duration, player size) as a plain user rule ("hide videos under 3 min in portrait") is closer to a filter than an inference. ❓ |
| C9 | **2** (search freely) vs **12** (speed) and quota | Search is capped at 100 calls/day app-wide; each result also needs a `videos.list` call for safety fields. | **Resolvable at small scale** (shared cache; curated feeds); needs the audit to grow. |
| C10 | **11** (Hinglish well) vs **12** (1–2 s) | Larger multilingual models handle mixed text better but are slow on CPU (~3.1 s per 50 titles for e5-large vs ~0.22 s for MiniLM, measured). | **Trade-off to test.** |
| C11 | **14** (18+ only) vs NEET as a test field | NEET candidates skew 17 and under, which strains a self-declared 18+ gate. | **Resolvable:** you already limited NEET testing to 18+; recruit repeaters. |
| C12 | **24** (7-day deletion) vs DPDP Rule 8(3) (logs ≥ 1 year) and CERT-In (180 days) | Logs must be kept long; YouTube data about a user must go within 7 days. | **Resolvable:** keep YouTube data (video IDs, titles) out of logs. **Lawyer** to confirm. |
| C13 | **21** (teen/kids later) vs YouTube III.J | A teen mode may make the whole app "child-directed" under YouTube's policy (children are defined by local law, which in India is under 18). | **Resolvable:** notify Google, no write actions (already none planned), Made for Kids handling. |
| C14 | **23** (funding) vs III.F.3 / III.G and the mission | Can't charge to watch or sell API access; ads clash with "no distraction" and are barred for minors. | **Resolvable:** charge only for your own features (notes, planner, sync), grants, or institutional licences. |
| C15 | **15e** (audio-focused) vs III.I.9 (no background play) | Screen-off listening is banned. | **Resolvable** by redefining "audio-focused" as lecture-style videos with the screen on. |
| C16 | **13** (safety is a fixed rule above the brain) vs guide ("claims… safe or suitable to watch") | The fixed rule promises what the clean tools can't fully deliver. | **Choice** on wording: promise "we filter using YouTube's safety signals and your rules", not "no harmful content". |

No two expectations are logically impossible together. The hard one is **C1**: the three fixed rules (safety, law, mission) and "no special permission" all hold, but the promise "no entertainment, no harmful content" depends on a classifier that YouTube's guide literally forbids.

---

# Corrections to research.md (applied 2026-09-27)

| research.md | Correction | Source |
|---|---|---|
| Section 6 (escape) | Player links **must** open in the YouTube app, not the browser | ✅ guide |
| Sections 15–19 | Missing the guide's "metrics" list and III.L; the classifier risk is higher than stated | ✅ guide, Policies III.L |
| Section 17.3 | Groq Llama models are enterprise-tier; use GPT-OSS/Qwen on Groq or Fireworks | 🟡 Groq docs |
| Section 17.4 / 11 | Children's duties start exactly 13 May 2027; Fourth Schedule defines "educational institution"; Part B entry 6 exempts the age check | ✅ Rules (Group D) |
| Section 7 | DPDP has no "sensitive data" class (confirmed) | ✅ Act (Group E) |
| Section 3 | NIOS has 270+ Class 10 ISL videos on YouTube | 🟡 (Group E) |
| Section 4 / 17 | The guide says delete on request within 30 days; the binding Policies say 7. Follow 7 | ✅ both |
| Summary risk table | IS 17802 reach now largely answered by the draft 2026 RPwD rules (still draft) | 🟡 (Group E) |
| Research sources | NPTEL and MIT OCW are NC-licensed: not usable as training text for a paid app | 🟡 (Group A) |
| Missing | CERT-In 6-hour incident reporting | 🟡 (Group F) |
| Section 2 / 16 | `modestbranding` has had no effect since Aug 2023; YouTube's 0-minute Shorts limit is confirmed | 🟡 (Group C) |

---

# Open questions

1. **The classifier (C1).** Launch with the classifier off (YouTube's fields, curated lists, user rules), and describe the classifier honestly in the audit form? If YouTube says no, does the model filter go, or the "no special permission" stance?
2. **Disclosure wording (C2).** Accept "N hidden by [App] · Why · Show", with labels shown only on "Why"?
3. **Rewards (C6).** Confirm: no coins, points, leaderboards or streaks tied to watching; weekly totals count study actions only?
4. **Safety wording (C16).** Should safety-related searches ("paper leak", self-harm terms) be blocked with a notice or helpline, and should the promise be "filtered by YouTube's safety signals and your rules" rather than "no harmful content"?
5. **Feedback (C5).** Allow one rare, per-video "Did this help?" if silent signals prove too thin?
6. **Comments.** Collapsed by default, or off entirely?
7. **Platform.** PWA plus a Play Store wrapper first, Capacitor for iOS later?
8. **Family account.** When an adult adds a child later, verify the adult with a real signal (e.g. DigiLocker), since a typed date of birth may not count as "reliable details"?
9. **Company.** Register a company? It's needed for most grants and likely brings the app under the draft 2026 accessibility rules.
10. **International.** Which countries first?
11. **research.md.** Apply the corrections above to research.md and the summary now, or leave them until planning starts?
