# Research: Focused YouTube Learning App

Research phase only. Nothing here is a decision. Started 2026-09-26.

**How to read the labels**

- ✅ **Verified**: I read it in a primary source (official docs, the store listing, the law or judgment itself, or a peer-reviewed paper).
- 🟡 **Secondary**: reported by a news site, blog or vendor. Probably right, but I haven't checked the original.
- 🔵 **Assumption**: my own reasoning or estimate. Test it before you rely on it.
- ❓ **Don't know**: I couldn't find it or couldn't confirm it.

---

## 1. The problem: is YouTube distraction real and big?

### What the evidence says

| Finding | Label | Source |
|---|---|---|
| Indian students use YouTube heavily for study. 93% of medical students in one survey used it to learn anatomy. 71.7% of students in another study preferred YouTube to library resources. | 🟡 | [PMC survey of medical students](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10996882/), [PMC e-learning study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9103976/) |
| Smartphone addiction is widely studied in Indian students. Reported rates vary a lot: ~25% of young adults scored "high", 35% in a Kerala college study, 46% in a Maharashtra study, 52.7% of Grade IX students in one survey. | 🟡 (studies exist; the rates depend on the scale used) | [Kerala study, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12718660/), [ResearchGate](https://www.researchgate.net/publication/341063968_Disconnect_to_detox_a_study_of_smartphone_addiction_among_young_adults_in_India), [Zenodo Grade IX](https://zenodo.org/records/21791111) |
| Drivers of overuse named by students: fear of missing out (83%), mood (67%), escapism (60%), peer culture (47%). | 🟡 | [Springer, technical universities](https://link.springer.com/article/10.1007/s11135-026-03020-5) |
| Aspirants ask in public how to watch only subscribed channels "so that I can't get distracted". Coaching blogs name YouTube Shorts and the algorithm as a main distraction. | ✅ (the posts exist) | [Careers360 Q1](https://www.careers360.com/question-is-there-any-way-so-that-i-can-only-my-subscribers-videos-in-video-so-that-i-cant-get-distracted-and-stay-ocuused-while-doing-online-study-basically-i-m-jee-aspirant), [Careers360 Q2](https://www.careers360.com/question-hi-i-jee-aspirant-as-we-know-this-is-the-last-lap-of-preparation-for-jee-usually-as-colleges-are-not-opened-at-house-i-dont-have-any-room-to-study-at-morning-there-will-be-noisy-in-house-so-ichoose-night-time-maximum-to-online-study-but-i-get-distracted-much-to-youtube-what-is-thesolution), [PW blog](https://www.pw.live/upsc/exams/avoid-distractions-in-upsc-preparation), [aksias.com](https://aksias.com/youtube-telegram-instagram-boon-or-distraction-for-upsc-aspirants/) |
| Coaching blogs also flag a second problem: aspirants watch hours of lectures passively instead of revising. | 🟡 | [Ensure IAS](https://www.ensureias.com/blog/upsc-preparation/can-one-prepare-for-upsc-through-youtube) |
| 1M+ Chrome users run Unhook to strip YouTube recommendations and Shorts. | ✅ | [Chrome Web Store](https://chromewebstore.google.com/detail/unhook-remove-youtube-dis/khncfooichmfjbepaaaebmommgaepoid) |

### What I couldn't find

- ❓ No study that measures **YouTube-specific** distraction in Indian aspirants. Most studies measure "smartphone addiction" in general.
- ❓ No data on whether distracted students would **switch to another app** to watch YouTube lectures. That is the question your idea depends on, and only interviews will answer it.

### Takeaway

🔵 The pain is real and people talk about it openly. Whether they'll switch apps to fix it is unproven. Unhook's 1M users show demand for "YouTube minus distractions". The small user numbers of the study-specific apps (section 2) show that a dedicated study app is harder to grow.

---

## 2. Competitors

### Browser extensions (desktop, modify youtube.com itself)

| Product | What it does | Users / rating | Label |
|---|---|---|---|
| **Unhook** | Hides home feed, sidebar, Shorts, comments, end screens, autoplay. 20+ toggles. Free. | 1,000,000+ users, 4.9★ (4,500 ratings), updated March 2026 | ✅ [store](https://chromewebstore.google.com/detail/unhook-remove-youtube-dis/khncfooichmfjbepaaaebmommgaepoid) |
| **DF Tube** | Hides recommendations, homepage grid, Shorts; disables autoplay. Now also on iPhone/Android via the Timeful app. | ❓ user count not checked | ✅ [store](https://chromewebstore.google.com/detail/df-tube-distraction-free/mcigjliffjfjceioeeiolliiimglknji), 🟡 [mobile](https://www.betimeful.com/blogs/df-tube) |
| **YourTube – Study Mode** (Indian developer, Roorkee) | Locks YouTube to chosen playlists/channels, study timer, coins, leaderboard. | **143 users**, 4.8★ (6 ratings) | ✅ [store](https://chromewebstore.google.com/detail/yourtube-study-mode-for-y/imedkdjjljfacpkdnhcchmdpjgdeakga) |
| **StudyTube (extension)** | Blurs recommendations and Shorts while you search. | 4.2★ | 🟡 [store](https://chromewebstore.google.com/detail/studytube/bhpaehgaojjijokpambljhifinkfnaoj) |
| **YouTube Educational Filter** | Reads titles/channels on the home page and hides "junk" (reaction, drama, clickbait). Closest to your AI filter idea. | ❓ | 🟡 [store](https://chromewebstore.google.com/detail/youtube-educational-filte/jhipccnnfgdkjmcbmmahndgboljmhood?hl=en) |
| **FilterTube** (India) | Keyword/channel blocking, hide Shorts, strict profiles, all local. | ❓ | 🟡 [site](https://www.filtertube.in/) |

### Apps and web apps (own UI, embed YouTube)

| Product | What it does | Users / rating | Label |
|---|---|---|---|
| **StudyTube: No Distractions** (The CodeFuel, since April 2023) | Search, watch without Shorts/recommendations, bookmarks, resume, playlists, app blocker, study planner. Reviews say "no ads". | ~47k downloads, 4.36★ (800 ratings) | 🟡 [AppBrain](https://www.appbrain.com/app/studytube-no-distraction/com.thecodefuel.studytube), [Play](https://play.google.com/store/apps/details?id=com.thecodefuel.studytube&hl=en_US) |
| **LearnTube India** | Web app. PW playlists by subject/board, timestamp notes, AI doubt solver, quizzes, coin rewards. Uses the IFrame API. **Advertises "100% ad-free" PW videos.** | ❓ | ✅ [their blog](https://learntubeindia.in/blog/watch-physics-wallah-without-ads-free) |
| **SyncStudy** | Turns any YouTube playlist into a course with progress tracking, timestamp notes, daily planner. Syllabus templates for JEE, NEET, UPSC, CBSE. Free for 3 playlists, ₹99/month Pro. | ❓ | 🟡 [their blog](https://www.syncstudy.in/blog/best-app-for-students-india) |
| **Regain**, **FocusDen** | App blockers / focus timers with a YouTube study mode. | ❓ | 🟡 [Play](https://play.google.com/store/apps/details?id=ai.regainapp&hl=en_IN) |
| **YPT (Yeolpumta)** | Study timer, study groups, rankings, app blocking. Popular with UPSC aspirants. Not a YouTube tool, but competes for the same "focus" habit. | 7.4M downloads (global) | 🟡 [AppBrain](https://www.appbrain.com/app/ypt-yeolpumta/com.pallo.passiontimerscoped) |
| **Lightspeed SmartPlay** | School-network YouTube filter with a video database. B2B, US schools. | ❓ | 🟡 [site](https://www.lightspeedsystems.com/solutions/engagement-impact/safe-youtube-for-schools/) |

### Indian edtech

| Player | Relevance | Label |
|---|---|---|
| **Physics Wallah** | Most content free; own app has lectures without YouTube's distractions. 15M+ students, 4.5M paying, FY25 revenue ₹2,890 cr, IPO Nov 2025. PW already solves this for PW students. | 🟡 [Wikipedia](https://en.wikipedia.org/wiki/Physics_Wallah), [BusinessToday](https://www.businesstoday.in/technology/news/story/unacademys-sale-to-upgrad-is-the-final-act-of-indias-edtech-boom-553343-2026-09-04) |
| **Unacademy** | Sold to upGrad in 2026 at ~94% below its 2021 peak. Warning about the cost of paid edtech in India. | 🟡 [BusinessToday](https://www.businesstoday.in/technology/news/story/unacademys-sale-to-upgrad-is-the-final-act-of-indias-edtech-boom-553343-2026-09-04) |

### YouTube's own features

| Feature | What it does | Label |
|---|---|---|
| **Shorts feed limit** (Oct 2025) | Daily Shorts limit, 15 min to 2 h, mobile app only. Dismissible. A 0-minute option was reportedly added in April 2026. | 🟡 [9to5Google](https://9to5google.com/2025/10/22/youtubes-new-daily-timer-stops-you-from-wasting-all-your-time-watching-shorts/); the 0-minute claim is ❓ (⚠️ 2026-09-27: confirmed 🟡, [feasibility.md](feasibility.md) 6) |
| **Take a break / bedtime reminders** | Pause reminders every 15–180 min. | ✅ [YouTube Help](https://support.google.com/youtube/answer/9012523?hl=en&co=GENIE.Platform%3DAndroid) |
| **"Show fewer Shorts"** | Temporarily reduces Shorts on the home feed. | 🟡 [9to5Google](https://9to5google.com/2024/10/03/youtube-shorts-3-minutes/) |
| **YouTube Courses** | Announced for India in 2022–23 (paid, structured courses). | ❓ current status unknown |

### Gaps I see (🔵 my reading)

1. **Nobody does good multilingual (Hindi/Hinglish) filtering of search results.** Existing tools either hide everything (Unhook) or lock you to a list you pick yourself (YourTube, SyncStudy).
2. **Nobody serves deaf, blind or motor-impaired learners** in this space.
3. **Small reach.** The study-specific apps are tiny (143 users, ~47k downloads) next to Unhook (1M+). Distribution looks like the hard part, not features.
4. **Several competitors seem to break YouTube's rules** (ads removed; see section 4). Building a compliant version is harder but safer, and could itself be a selling point.

---

## 3. Accessibility

### What learners with different disabilities need from video

| Group | Needs | Label | Source |
|---|---|---|---|
| **Deaf / hard of hearing** | Accurate captions. Auto-captions aren't enough: one study found 7.7 phrase errors per minute. Many deaf learners read ISL more easily than written English/Hindi, so ISL content matters too. | ✅ (study), 🔵 (ISL point, based on ISLRTC's existence and purpose) | [ERIC paper](https://eric.ed.gov/?id=EJ1112346), [National Deaf Center](https://nationaldeafcenter.org/news-items/auto-captions-and-deaf-students-why-automatic-speech-recognition-technology-not-answer-yet/) |
| **Blind / low vision** | Audio description of what's on screen (slides, board work); keyboard/screen-reader navigation; chapter navigation for long videos ("over 20 minutes it becomes super difficult to navigate"). | ✅ | [Wilkens 2026, J. Visual Impairment](https://doi.org/10.1177/02646196251322134), [ACM ASSETS 2025](https://dl.acm.org/doi/10.1145/3663547.3746349) |
| **Motor impairments** | Large targets, keyboard/switch access, fewer steps, voice control. | 🔵 (standard WCAG guidance; no India study found) | [WCAG via IS 17802](https://www.barrierbreak.com/indias-digital-inclusion-initiative-is-now-a-law-is-17802-mandates-accessible-ict-products-and-services/) |
| **Speech impairments** | Mostly an input problem (voice search won't work well), less a video problem. Text search and simple controls matter. | 🔵 | — |
| **Learning / cognitive** | ❓ Not researched yet. | ❓ | — |

### What exists in India

| Resource | What it is | Label |
|---|---|---|
| **ISLRTC YouTube channel** | 10,000-word ISL dictionary, basic ISL course, NCERT textbooks in ISL. | ✅ [channel](https://www.youtube.com/channel/UC3AcGIlqVI4nJWCwHgHFXtg), [ISLRTC](https://islrtc.nic.in/ncert-books-in-isl/) |
| **NCERT + ISLRTC** | ~550 ISL videos for classes 1–5 so far; classes I–VI content on DIKSHA. | ✅ [ISLRTC](https://islrtc.nic.in/ncert-books-in-isl/), [CIET](https://www.ciet.ncert.gov.in/sign) |
| **PM e-VIDYA DTH Channel 31** | TV channel for ISL learning. | ✅ [CIET](https://ciet.ncert.gov.in/activity/biSL) |

🔵 ISL content for **older students and aspirants** looks very thin. I found almost nothing above class 6. (⚠️ Corrected 2026-09-27: NIOS has "more than 270 Video in Sign Language in 7 subjects… at secondary level" (Class 10) on YouTube ✅ [PM e-Vidya](https://pmevidya.education.gov.in/cwsn.html); above Class 10 is still thin.) That gap is real but also means an ISL feed would have little to show today.

### Laws and standards

| Item | What it says | Label |
|---|---|---|
| **RPwD Act 2016, s.40, s.42, s.46** | Accessibility of ICT; service providers must comply with accessibility rules. | 🟡 [Deque](https://www.deque.com/blog/how-the-rights-of-persons-with-disabilities-act-rpwd-impacts-digital-accessibility-in-india/) |
| **IS 17802 (2023)** | Indian standard for accessible ICT products and services, aligned with WCAG 2.1 / EN 301 549. Covers websites and apps. | 🟡 [BarrierBreak](https://www.barrierbreak.com/indias-digital-inclusion-initiative-is-now-a-law-is-17802-mandates-accessible-ict-products-and-services/) |
| **Rajive Raturi v. Union of India (SC, 8 Nov 2024)** | Held that merely advisory accessibility guidelines go against the RPwD Act; told the government to frame mandatory rules. | ✅ [Judgment PDF](https://api.sci.gov.in/supremecourt/2005/9321/9321_2005_1_1503_56986_Judgement_08-Nov-2024.pdf) |
| **Does IS 17802 legally bind a small private app like this?** | ❓ I don't know. Sources disagree on how far it reaches private companies. Ask a lawyer. Building to WCAG 2.1 AA is sensible either way. ⚠️ Updated 2026-09-27: the **draft RPwD (Amendment) Rules 2026** (S.O. 3962(E), 16 July 2026) would make IS 17802 mandatory for apps offered in India, with 18 months to comply and a public conformance report. Still a draft ([feasibility.md](feasibility.md) 15). | ❓ |

### A technical limit that hits accessibility mode

- ✅ The API can't download captions of other people's videos (`captions.download` needs edit rights on the video). [Google docs](https://developers.google.com/youtube/v3/docs/captions/download)
- 🔵 The `contentDetails.caption` flag, I believe, is `true` only for uploaded (human) captions, not auto-generated ones. **Verify this in Phase 1.** If right, it's actually useful: "has real captions" is what deaf users need.
- 🔵 Because you can't read the captions, you can't check their quality or translate them.

---

## 4. YouTube API and terms

This section decides whether the idea can exist in its current shape. Quotes are from the [Developer Policies](https://developers.google.com/youtube/terms/developer-policies) and the [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide). ✅ for the quoted text; my interpretation is marked 🔵.

### Allowed / not allowed

| Topic | Rule (✅) | What it means for you (🔵) |
|---|---|---|
| **Filtering** | ⚠️ Superseded (source), see section 17.1: this line is in the compliance *guide*, not the Developer Policies. Not allowed: "Restrict, filter, or prohibit a user's access to content on YouTube **without their knowledge or consent**." | Filtering seems OK **if the user knowingly turns it on and can see what was hidden.** Your "X results hidden" and "I need this" ideas fit this well. Make them core, not nice-to-have. |
| **Search results** | III.C: apps "must not modify or replace the text, images, information, or other content of, the search results" and must not mix in non-YouTube results. | Hiding some results is probably not "modifying" them, but I'm **not sure**. Showing a result with a changed title or thumbnail is clearly out. Re-ranking "unsure" videos lower: ❓ unclear. |
| **Player** | Must not "modify, build upon, or block any portion or functionality of a YouTube player"; must not "remove, obscure, alter, or disable any links that appear in YouTube players". | **You can't block the YouTube logo link.** The "escape to YouTube" problem can't be solved by blocking. At most you choose where the link opens (see section 6). ⚠️ Corrected 2026-09-27: the compliance guide says links "must open in the YouTube application whenever the application is available on a user's device", so you can't choose. See [feasibility.md](feasibility.md). |
| **Related videos** | Not allowed: "Disabling or blocking Related Video links from appearing after the video completes." | You can't hide end-of-video suggestions. (`rel=0` only limits them to the same channel.) |
| **Ads** | Must not "modify, interfere with, replace, or block advertisements". | **LearnTube India's "100% ad-free" and StudyTube's "no ads" claims look like breaches.** Don't copy them. |
| **Autoplay / background play** | Background play is not allowed. | Autoplay-off is fine. |
| **Replicating YouTube** | III.I.1: no substitute for YouTube apps without "significant independent value". | Your value must be clear: the filter, notes, study tools, accessibility. A plain "YouTube without Shorts" app is at risk. |
| **Gating** | Can't make users do anything besides pressing play to watch. | No "finish this quiz to unlock the video". |
| **Storage** | Most API data can be stored **30 days max**, then refreshed or deleted (III.E.4). | Your "classify once, keep forever" cache needs a 30-day refresh of the video data. Whether your **own label** ("learning") counts as API data: ❓ I don't know. |
| **Derived data** | III.E.4.h limits "derived data or metrics" built from API data. | ❓ I don't know if a learning/entertainment label counts. Probably aimed at things like fake view counts, but check. |
| **Made for Kids** | Must look up Made for Kids status and disable tracking for those videos (III.E.4.j). | Matters for Student mode. |
| **Undocumented access** | Must use only documented API methods; no scraping. | ⚠️ **The `/shorts/` URL check I wrote earlier (`--check-shorts` in `fetch_videos.py`) is not part of the API and could count as scraping.** Treat it as research-only or drop it. |
| **Enforcement** | Violations can mean quota cuts, key revocation, or Google account termination. | 🟡 [search summary of policies](https://developers.google.com/youtube/terms/developer-policies) |

### Quota

| Fact | Label |
|---|---|
| Default: 10,000 units/day per project. `search.list` = 100 units, so ~100 searches/day. `videos.list` = 1 unit for up to 50 videos. | ✅ [Google](https://developers.google.com/youtube/v3/getting-started) — **⚠️ Superseded, see section 17.2:** since 1 June 2026, `search.list` has its own bucket (100 calls/day, 1 unit each) and no longer uses the 10,000 general units. |
| More quota needs a compliance audit (privacy policy, terms, video walkthrough). | ✅ [Google](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) |
| Approval takes weeks to months and many requests are rejected. | 🟡 [SocialCrawl](https://www.socialcrawl.dev/blog/youtube-data-api-2026) |

🔵 100 searches/day serves maybe 20–50 active users. **Open search doesn't scale without an approved increase.** Channel feeds via `playlistItems.list` (1 unit) scale much better.

### Shorts detection

- ✅ No official "is Short" flag. [Google discussion](https://github.com/googleapis/googleapis/discussions/1153)
- ✅ Since 15 Oct 2024, Shorts can be up to **3 minutes**, so "≤ 60 s" no longer works. [YouTube Help](https://support.google.com/youtube/answer/15424877?hl=en)
- 🔵 A duration cutoff of ≤ 180 s would also catch many short learning clips (formula revision, one-concept videos). That's the over-blocking you want to avoid.
- 🔵 The URL-redirect trick works today but is undocumented (see above).

### Apps that got shut down

| Case | What happened | Lesson (🔵) | Label |
|---|---|---|---|
| **YouTube Vanced** (2022) | Ad-blocking YouTube client shut down after Google's cease-and-desist. | Blocking ads draws legal action. | 🟡 [OSnews](https://www.osnews.com/story/134673/google-forces-youtube-vanced-to-shut-down-due-to-legal-reasons/) |
| **Invidious** (2023) | Got a C&D citing API policy; ignored it because it doesn't use the API. | Google watches third-party front-ends. | 🟡 [Wikipedia](https://en.wikipedia.org/wiki/Invidious), [TorrentFreak](https://torrentfreak.com/youtube-orders-invidious-privacy-software-to-shut-down-in-7-days-230609/) |
| An API-compliant study app being blocked | ❓ I found none. | — | ❓ |

---

## 5. Filtering approaches

### Options

| Approach | Pros | Cons | Label |
|---|---|---|---|
| **YouTube category** (`categoryId`) | Free, in every API response. | Uploader picks it. Many lectures are tagged "People & Blogs" or "Entertainment". | ✅ (it's uploader-set), 🔵 (how often wrong: untested) |
| **Channel allow/block lists per mode** | Very accurate for known channels. Cheap. Explainable. Makes feeds possible without search. | Needs someone who knows each field. Misses new/small teachers. | 🔵 |
| **Keyword rules** | Free, instant. | Breaks on Hinglish, misspellings, clickbait. Hard to maintain. | 🔵 |
| **Classic ML on titles** (Naive Bayes, logistic regression) | Cheap, runs anywhere. Papers report ~83–85% accuracy on YouTube categories. | Those studies are English and use different labels. Needs lots of labelled data. | 🟡 [ResearchGate](https://www.researchgate.net/publication/338942051_YouTube_Video_Classification_based_on_Title_and_Description_Text) |
| **Indic language models** (MuRIL, IndicBERT, HingBERT) | Built for Indian languages and code-mixed text; MuRIL beat other models on Hinglish tasks. | You'd need to fine-tune and host it. | 🟡 [arXiv MuRIL](https://arxiv.org/abs/2506.16066), [arXiv NER comparison](https://arxiv.org/html/2509.02514) |
| **LLM API** (Claude Haiku, Gemini Flash-Lite, etc.) | Handles Hinglish and context ("movie review" vs "film studies lecture") well with no training. Fast to start. | Costs per call. Can be inconsistent. Sends video metadata (not user data) to a third party. | 🔵 |

### Cost per 1,000 videos (LLM)

Prices ✅ from [claude.com/pricing](https://claude.com/pricing) and 🟡 from [Gemini pricing roundup](https://www.cloudzero.com/blog/gemini-pricing/). The token counts are 🔵 **my assumptions**: ~400 input tokens per video (instructions + title + trimmed description + tags) and ~30 output tokens.

| Model | Price (in / out per M tokens) | Est. per 1,000 videos | With 50% batch discount |
|---|---|---|---|
| Claude Haiku 4.5 | $1 / $5 | ~$0.55 | ~$0.28 |
| Gemini 3.1 Flash-Lite | $0.25 / $1.50 | ~$0.15 | ~$0.08 |
| Gemini 2.5 Flash-Lite (retires 16 Oct 2026) | $0.10 / $0.40 | ~$0.05 | — |

🔵 Because each video is classified once and cached, even 1 million videos costs roughly $80–$550. **LLM cost isn't the bottleneck. YouTube quota is.**

### Handling Hindi / English / Hinglish

- 🔵 Your test set must include Devanagari titles, romanised Hindi ("kaise padhe"), and mixed titles. Measure accuracy **per language**. A filter that's good on English and bad on Hinglish would quietly fail your main users.
- 🟡 ~90% of YouTube use in India is reported to be in regional languages. [Medium](https://medium.com/@agrawal.chemical/youtube-content-consumption-trends-in-india-d6c2433ed615). Beyond Hindi, Tamil, Telugu, Bengali etc. will come later.

### Avoiding over-blocking

🔵 Ideas, all untested:

1. **Default to show.** Hide only when confident it's entertainment. "Unsure" is shown.
2. **Trusted channels skip the classifier.**
3. **Always tell the user** ("3 hidden, show anyway"). This also keeps you on the right side of the "without their knowledge" rule.
4. **Judge by intent, not topic.** Your idea already does this: law for a CS student is fine; songs aren't.
5. **Track "wrongly blocked" as the headline number**, per language.

### Decision point: filtering strategy

> ⚠️ Superseded, see sections 16 and 19: human-curated lists as seed data + a removable classifier trained on non-YouTube text + LLM fallback for "unsure" + automated source lists refreshed within 30 days.

| Option | Pros | Cons |
|---|---|---|
| A. Channel lists only | Cheapest, most accurate, needs no search quota | Closed world; fails your "search any learning topic" rule |
| B. LLM only | Flexible, handles Hinglish | Every search result needs a call; depends on quota for search |
| C. **Channel lists + LLM for the rest** | Accurate on known channels, flexible elsewhere | Two systems to maintain |
| D. Start LLM, train own model later | Good learning project; lower cost later | Training needs thousands of labels |

---

## 6. Platform choices

### Options

| Option | Pros | Cons | Label |
|---|---|---|---|
| **PWA** (web app) | One codebase, runs everywhere, no store review, fastest to ship. iOS push works since 16.4 once installed. | No app-store presence (bad for discovery in India). Manual "Add to Home Screen" on iOS. Can't control where the YouTube logo link opens. | 🟡 [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) |
| **Capacitor** (web app in a native shell) | Reuses the PWA. Store presence. Can intercept link navigation. | **iOS WKWebView breaks YouTube embeds with Error 152/153** (missing referrer). Known fix: serve the player from a page on your own domain. Slowest start-up (~2.3 s reported). | 🟡 [Capacitor issue](https://github.com/Cap-go/capacitor-youtube-player/issues/49), [Medium fix](https://medium.com/@davidvesely.cz/fixing-youtube-error-153-in-ios-capacitor-apps-a-simple-proxy-solution-5807d3df83d5), [Oflight benchmark](https://www.oflight.co.jp/en/columns/flutter-rn-capacitor-tauri-performance) |
| **React Native** | Native UI, good lists and gestures. Uses JS/TS. | YouTube still plays in a WebView, so the same referrer issues apply. Separate from a web version. | 🟡 [CORSPROXY blog](https://corsproxy.io/blog/fix-youtube-error-150-153-webview/) |
| **Flutter** | Fast, one codebase for mobile + desktop + web. | New language (Dart). Flutter YouTube players also hit the logo-link problem. Web output is weaker. | 🟡 [youtube_player_flutter issue](https://github.com/sarbagyastha/youtube_player_flutter/issues/866) |
| **Native (Kotlin + Swift)** | Best control and performance. | Two or more codebases. Too much for one person. | 🔵 |
| **Browser extension** | No API quota for search (user uses YouTube's own search). Proven demand (Unhook). Cheap. | Desktop only in practice; Android via Firefox only; iOS Safari extensions are limited. Your main users are on phones (~87% of Indian YouTube visits are mobile, 🟡). | 🟡 [Medium](https://medium.com/@agrawal.chemical/youtube-content-consumption-trends-in-india-d6c2433ed615) |

### The escape problem

- ✅ Policy: you must not "remove, obscure, alter, or disable any links that appear in YouTube players". So **you can't block the YouTube logo.**
- ✅ Technically, on Android you can intercept the navigation (`shouldOverrideUrlLoading`) and choose to open it in a Custom Tab or browser. [Google AdMob docs](https://developers.google.com/admob/android/browser/webview/click-behavior)
- ⚠️ Corrected 2026-09-27: the next point is wrong. ✅ The [compliance guide](https://developers.google.com/youtube/terms/developer-policies-guide) says: "Links must open in the YouTube application whenever the application is available on a user's device, or if not installed, via the system web browser." So routing the link to the browser is not allowed when the YouTube app is installed.
- 🔵 (Superseded, see the correction above) Opening the link in the browser (instead of the YouTube app) is probably allowed, since the link still works. Showing a gentle "You're leaving study mode" note before it opens: ❓ unclear if that counts as "obscuring". Ask YouTube's API support or read their audit feedback.
- 🔵 Honest conclusion: **the app can reduce escapes, not prevent them.** Your pitch should say "fewer temptations", not "locked".

### Decision point: first platform

| Option | Pros | Cons |
|---|---|---|
| **A. PWA first, wrap later** | Fastest; test the idea on any phone | No Play Store listing at first |
| B. Android app first (Capacitor or native) | Play Store discovery; most Indian students use Android | Slower; Android only |
| C. Extension first | Cheapest; no quota problem | Misses phone users |

---

## 7. Privacy and legal

### DPDP Act 2023 and DPDP Rules 2025

| Point | Label | Source |
|---|---|---|
| DPDP Rules notified **13 Nov 2025**. Most duties, including children's data, apply from **14 May 2027**. ⚠️ Corrected 2026-09-27: **13 May 2027** ✅ ([feasibility.md](feasibility.md) 14). | 🟡 | [Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/), [PIB notification](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf) |
| "Child" = **under 18**. You need **verifiable parental consent** before processing any child's data (s.9, Rule 10). | 🟡 | [dpdpa.com Rule 10](https://www.dpdpa.com/dpdparules/rule10.html) |
| Parent must be a verifiable, identifiable adult. DigiLocker is one named method. | 🟡 | [Consently](https://www.consently.in/blog/verifiable-parental-consent-dpdp-rules-2025-edtech-gaming) |
| **No tracking, behavioural monitoring, or targeted ads for children.** | 🟡 | [Tsaaro](https://tsaaro.com/blogs/safeguarding-minors-online-understanding-parental-consent-obligations-and-behavioural-monitoring-restrictions-under-the-dpdpa-and-dpdp-rules) |
| Some exemptions for **educational institutions** (Rule 12, Fourth Schedule). | 🟡 | [dpdpa.com](https://www.dpdpa.com/dpdparules.html) |
| Persons with disabilities who have a **lawful guardian** need guardian consent, verified via court order or official authority (Rule 11). | 🟡 | [dpdpa.com Rule 11](https://www.dpdpa.com/dpdparules/rule11.html) |

🔵 What this means:

- **Student mode is all minors.** A personal feed built from what they watched looks a lot like "behavioural monitoring". Even many aspirants (JEE/NEET) are 16–17. You'd need an age gate and parental consent for them too.
- **Partnering with schools or coaching institutes** may fall under the educational-institution exemption. ❓ Needs a lawyer.
- **Disability data:** DPDP doesn't have a GDPR-style "sensitive data" class (⚠️ confirmed 2026-09-27 ✅, [feasibility.md](feasibility.md) 15f). Your plan to ask about needs, not diagnoses, keep it on the device, and make it optional is still the right call. A "need captions" setting stored only on the phone may not be personal data you process at all.
- YouTube's own rules add a layer: Made-for-Kids videos need tracking turned off.
- ⚠️ Added 2026-09-27: **CERT-In Directions (28 Apr 2022)** require reporting listed cyber incidents **within 6 hours** and keeping ICT logs for a rolling **180 days within India** ✅ ([CERT-In](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf)). DPDP Rule 8(3) asks for logs kept at least 1 year. Keep YouTube data (video IDs, titles) out of logs so this doesn't clash with YouTube's 7-day deletion rule ([feasibility.md](feasibility.md) 24).

---

## 8. Money

### Running costs (🔵 rough estimates, not quotes)

| Item | Early stage (~1,000 users) | Notes |
|---|---|---|
| YouTube API | ₹0 | Free, but limited by quota |
| LLM filter | < ₹500 / month | Cached; see section 5 |
| Hosting (Cloud Run + small Postgres + Redis) | ₹1,000–5,000 / month | ❓ Check the GCP calculator; managed Postgres is usually the biggest line |
| Domain, Play Store ($25 once), Apple ($99/year) | ~₹10,000 / year | 🔵 store fees from memory; verify |
| Legal review (privacy policy, DPDP) | ❓ | One-off, may be the biggest early cost |

### Who might pay

| Option | Pros | Cons | Label |
|---|---|---|---|
| **Students (freemium)** | SyncStudy charges ₹99/month; PW proves students pay for good content. | Indian students expect free. Can't charge to watch embedded videos (III.F.3). Can charge for your own features (notes, planner). | ✅ (policy), 🟡 (SyncStudy price) |
| **Parents** | Parents pay to reduce kids' distraction. | Needs parental-consent flow anyway; conflicts with "user sets the limits". | 🔵 |
| **Schools / coaching institutes (B2B)** | They want students on *their* content. DPDP exemption may help. Fewer, bigger customers. | Long sales cycles. | 🔵 |
| **Grants / CSR (accessibility)** | Companies Act CSR funds; Prosus Social Impact Challenge for Accessibility gave ₹25 L / ₹18 L / ₹12 L. ACT for Education funds edtech for Bharat. | Competitive; tied to real accessibility impact. | 🟡 [StartupGrantsIndia](https://www.startupgrantsindia.com/?search=assistive+technology), [ACT](https://actgrants.in/act-for-education/) |
| **Ads in your app** | Common in India. | Ads in a "no distraction" app contradict the pitch; no targeted ads to children. | 🔵 |

---

## 9. Challenging the idea

### Weakest assumptions (🔵 my view)

1. **"People will switch apps."** Unhook has 1M users because it changes YouTube *where people already are*. Study-specific apps have hundreds to tens of thousands. The pain is proven; the switching isn't.
2. **"The AI filter is the product."** Aspirants mostly watch a known set of teachers (PW, StudyIQ, Unacademy educators, etc.). A good channel list might cover most of what they need, and the AI may matter less than you think. Test this: take 50 real aspirants' watch lists and see what share comes from the top 50 channels.
3. **"Open search for any topic."** (⚠️ Superseded, see section 17.2: search now has its own 100-call bucket; you'll apply for the audit, and the app must work without it.) The default quota gives ~100 searches a day for the whole app. This rule can't hold at scale until Google approves more quota, and they may say no.
4. **"We can stop users escaping to YouTube."** Policy forbids blocking player links. You can only reduce escapes.
5. **"Six modes."** (⚠️ Superseded, see section 18: the open goal engine replaces fixed modes and exam lists.) Each mode needs its own channel list, rules, testing and an expert. That's six products.
6. **"The filter can rank and hide search results."** Probably OK with consent, but III.C is vague. Confirm before you build around it.

### Which modes make sense (🔵)

> ⚠️ Superseded, see sections 10, 16 and 18: your mode order is in section 10, Music & Movies was dropped (16), and the open goal engine (18) replaces fixed exam lists. Accessibility still needs its own research round.

| Mode | Verdict | Why |
|---|---|---|
| **Aspirant** | Keep, strongest | Clear, motivated users; clear syllabus; clear competitor gap on Hinglish filtering. |
| **Tech** | Keep | Easy for you to curate; mostly adults (no DPDP child problem); English-heavy so the filter is easier. |
| **Student (school)** | Delay | All minors → parental consent, no behavioural profiling. Much of the need is covered by PW and school apps. |
| **Accessibility** | Keep, but treat as its own product | Real gap and grant-fundable. But its needs (captions quality, ISL, audio description, screen readers) are different, and the content (ISL above class 6) barely exists yet. |
| **Motivational** | Drop or fold in | Motivation videos are a known procrastination trap; hard to argue it's "learning". |
| **Fashion** | Drop for now | Doesn't fit the pitch; you'd need a curator; tiny share of your target users. Could come back as one of many "skill" topics. |

### Other angles worth considering (🔵)

| Angle | Idea | Why it might be better |
|---|---|---|
| **Playlist-to-course + filter** | Aspirant picks teachers and playlists; app turns them into a syllabus tracker; filter only for extra search. | Needs little search quota. SyncStudy proves the model but doesn't filter or do Hinglish. |
| **Accessibility-first** | "Find learning videos with real captions, in Hindi and English", then ISL, then screen-reader-friendly player. | Almost no competition; grant-fundable; strong hackathon story. Smaller market. |
| **Coaching-institute white label** | Institutes give students a locked app of their own channel plus approved channels. | Institutes pay. Aggregating one owner's channels is explicitly allowed (III.E.2.a). |
| **Extension + mobile web** | Start as a Chrome/Firefox extension that filters youtube.com itself (like Unhook, plus your Hinglish AI filter). | Proven distribution, no API quota for search. Misses phone users. |
| **Study-session layer, not a feed** | Keep YouTube; add a "study session" that tracks what you watch, lets you mark videos as study, and reports time. | Smaller build; works alongside existing habits. |

---

## Things to verify next (research, not planning)

- [ ] Does `contentDetails.caption = true` mean human captions only? (Test on 20 videos.)
- [ ] Is hiding search results with user consent OK under III.C? (Read YouTube API support forums / ask during audit.)
- [ ] Is a cached "learning/entertainment" label "API data" under the 30-day rule?
- [ ] Does IS 17802 bind small private apps?
- [ ] DPDP: does an app for 16–17-year-old aspirants need DigiLocker-level parental consent?
- [ ] Current status of YouTube Courses in India.
- [ ] Download counts and 1–3★ reviews for StudyTube, LearnTube, SyncStudy (Play Store pages didn't load fully).

---

# Round 2 (2026-09-26)

## 10. Your direction after round 1

Recorded as you gave it. These are your inputs, not a plan.

- **Mode order:** Aspirant → school Student → Kids → Accessibility → Motivational → Fashion → Music & Movies.
- **Inside Aspirant:** categories of learning, motivational, informative, related news.
- **Filtering and recommendations:** designed with ML, including training your own model.
- **Experience:** almost no onboarding questions. The app learns from what users watch and skip. Shorts on/off. One-tap filtering of any channel or topic. Suggestions that push toward work, not away from it.
- **Ages:** all ages eventually, including kids.
- **Ambition:** a real product, all major platforms, international.

### Tensions this creates (🔵 my reading, details in the sections below)

| Your wish | What it runs into |
|---|---|
| "Learns from what users watch and skip" | For under-18s in India this is likely "behavioural monitoring", which DPDP s.9(3) bans (section 11). |
| "Train our own model" (⚠️ Superseded, see section 16: classifier trained only on non-YouTube text) | YouTube's policy bans using API data "to create new or derived data" and limits storage to 30 days (section 15). This is the biggest open risk found so far. |
| "Almost no questions" | Research on temptation says what people *click* is a poor guide to what they *want*. Some explicit signal is needed (sections 12–13). |
| "Music & Movies mode" (⚠️ Superseded, see section 16: dropped) | Turns the app toward a general YouTube substitute, which III.I.1 forbids without "significant independent value". It also blurs the "no distraction" pitch. |

---

## 11. Personalisation by age: DPDP, YouTube and international rules

### India: DPDP Act 2023 and Rules 2025

| Point | Label | Source |
|---|---|---|
| Child = under 18. Verifiable parental consent before processing any child's data (s.9(1)). | ✅ | [s.9, Indian Kanoon](https://indiankanoon.org/doc/98869575/) |
| s.9(3): no "tracking or behavioural monitoring of children or targeted advertising directed at children". | ✅ | [s.9, Indian Kanoon](https://indiankanoon.org/doc/98869575/) |
| Commentators read this as covering "behaviour-based content recommendations" and "in-app nudges and gamification" in edtech. | 🟡 | [Khurana & Khurana](https://www.khuranaandkhurana.com/children-data-protection-in-the-age-of-edtech-and-platform-design), [CUTS](https://cuts-ccier.org/examining-the-scope-of-behaviour-tracking-and-targeted-advertisement-of-children-andsuggesting-an-optimum-regulatory-approach/) |
| **Exemption, Part A entry 3:** educational institutions may do "tracking and behavioural monitoring (a) for the educational activities of such institution; or (b) in the interests of safety of children enrolled". | ✅ (text) | [Fourth Schedule](https://privacylawhub.com/bare-acts/dpdp-rules-2025/schedule-iv-fourth-schedule-exemptions-from-section-9-1-and-9-3-) |
| Whether a private edtech **app** counts as an "educational institution" is unsettled. Lawyers advise limiting tracking until courts clarify. | 🟡 | [Law.asia](https://law.asia/childrens-data-protection-dpdp-act/), [Dalberg](https://dalberg.com/our-ideas/navigating-the-dpdp-act-what-it-means-for-edtech-and-the-future-of-digital-learning/) |
| **Exemption, Part B entry 5:** processing to ensure that content "likely to cause any detrimental effect on the well-being of a child is not accessible to her", limited "to the extent necessary". | ✅ (text) | [Fourth Schedule](https://privacylawhub.com/bare-acts/dpdp-rules-2025/schedule-iv-fourth-schedule-exemptions-from-section-9-1-and-9-3-) |
| s.9(5): government may exempt a fiduciary whose processing is "verifiably safe", above an age it notifies. None notified yet. | 🟡 | [dpdpa.com s.9](https://www.dpdpa.com/dpdpa2023/chapter-2/section9.html) |
| The Fourth Schedule and child rules apply from **13/14 May 2027**. ⚠️ Corrected 2026-09-27: exactly **13 May 2027** (Gazette 13 Nov 2025 + 18 months) ✅. The Fourth Schedule also defines "educational institution" ("an institution of learning that imparts education, including vocational education"), and Part B entry 6 exempts an age check from parental consent ✅ ([feasibility.md](feasibility.md) 14). | 🟡 | [dpdprules.org](https://dpdprules.org/rules/fourth-schedule) |

**Is personalisation allowed for under-18s in India? 🔵 My reading, not legal advice:**

| Kind of personalisation | Likely status for under-18s |
|---|---|
| Filtering out harmful/entertainment content | **Probably OK** under Part B entry 5, if limited to what's necessary. Still needs parental consent. |
| Feed built from settings the child or parent chose (exam, class, subjects, muted channels) | **Probably OK.** It's not "monitoring behaviour". |
| "Up next" based only on the video playing now (contextual) | **Probably OK.** No profile is built. |
| Feed that learns from watch history, skips, time of day | **Likely banned** as behavioural monitoring, unless the "educational institution" exemption applies to you. ❓ Lawyer needed. |
| Streaks, study-time stats, gamification | **Grey area.** Commentators flag gamification. ❓ |

⚠️ This means **your core feature ("it learns what I need") may be adults-only in India** unless you partner with schools/coaching institutes (who can use the exemption) or the law is clarified. Note that many JEE/NEET aspirants are 16–17.

### YouTube API rules for child users

| Rule | Label |
|---|---|
| A "Child-Directed API Client" must comply with COPPA, GDPR and other laws, must **tell Google** it is child-directed, and must not use personalised ads. | ✅ [Policies III.J](https://developers.google.com/youtube/terms/developer-policies) |
| Child-directed apps must not allow any **write actions** (likes, comments, uploads, subscriptions). | ✅ III.J.2 |
| Must set the Made for Kids parameter and turn off tracking for Made-for-Kids videos. | ✅ III.J / III.E.4.j |
| YouTube's own teen protections: limits repeated recommendations of body-image, aggression and similar topics; break and bedtime reminders on by default for under-18s; no personalised ads for teens. | 🟡 [TechCrunch](https://techcrunch.com/2023/11/02/youtubes-new-teen-safeguards-limit-repeated-viewing-of-some-video-topics-and-more/), [YouTube Blog](https://blog.youtube/news-and-events/updates-youtube-supervised-accounts-teens/) |
| A public API for YouTube Kids content | ❓ I found none. |

### International (for later, but it shapes the design now)

| Place | Rule on personalising for minors | Label |
|---|---|---|
| **EU** (DSA Art. 28, guidelines July 2025) | Platforms should prioritise "explicit, user-provided signals" over "implicit, engagement-based signals" for minors, and avoid profiling that captures most of a minor's activity. Draft guidance pushes a non-profiling feed option to all platforms. | 🟡 [Taylor Wessing](https://www.taylorwessing.com/en/insights-and-events/insights/2025/07/rd-european-commission-guidelines-on-protection-of-minors-under-the-digital-services-act), [EU Commission](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors) |
| **EU** (GDPR Art. 8) | Parental consent below 13–16 depending on country. | ✅ [GDPR text](https://gdpr-info.eu/art-8-gdpr/); country list 🟡 and possibly out of date |
| **UK** (Children's Code, Standard 12) | Profiling **off by default** for children unless there's a compelling reason. | ✅ [ICO](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/) |
| **US** (COPPA, amended rule in force 22 April 2026) | Under-13s: parental consent, written retention policy, separate consent for sharing with third parties. | 🟡 [Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/coppa-rule-amendment-compliance-deadline-approaches) |

🔵 **The useful pattern:** regulators everywhere are moving the same way for minors. Explicit, stated preferences are OK. Silent learning from behaviour is not. A design where **the user's stated goal controls the feed and behaviour plays only a small part** (section 13A) fits both your anti-trap aim and these laws. For minors you can switch the behavioural part off and keep the rest.

---

## 12. Revealed vs stated preferences, enrichment vs temptation

### Key research

| Work | What it found | Label |
|---|---|---|
| **Kleinberg, Mullainathan, Raghavan**, "The Challenge of Understanding What Users Want" (EC 2022) | Platforms read wants from behaviour, but "we often make choices in the moment that are inconsistent with what we actually want". Raising engagement can make users less happy, depending on what kind of content drives it. | ✅ [arXiv](https://arxiv.org/abs/2202.11776) |
| **Kleinberg et al.**, "The Inversion Problem" (Perspectives on Psych. Science, 2024) | Algorithms predict behaviour but should try to infer mental state (what the person wants). | 🟡 [SAGE](https://journals.sagepub.com/doi/abs/10.1177/17456916231212138) |
| **Anwar, Dhillon, Schoenebeck**, "Recommendation and Temptation" (RecSys 2025) | See below. | ✅ [ACM](https://dl.acm.org/doi/10.1145/3705328.3748063), [arXiv HTML](https://arxiv.org/html/2412.10595) |
| **Milli et al.**, Twitter audit (PNAS Nexus 2025, 806 US users) | The engagement ranking amplified anger, sadness and anxiety. Users didn't prefer the political posts it picked. A feed ranked by **stated** preferences cut some divisive content. | ✅ [PNAS Nexus](https://academic.oup.com/pnasnexus/article/4/3/pgaf062/8052060) |
| **Mozilla**, "Does This Button Work?" (2022, 22,722 volunteers) | YouTube's own controls barely work: "Dislike" stopped 12% of similar unwanted recs, "Not interested" 11%, "Don't recommend channel" 43%. | ✅ [Mozilla](https://www.mozillafoundation.org/en/research/library/user-controls/) |
| **YouTube**, "On YouTube's recommendation system" (2021) | YouTube itself uses 1–5★ surveys and counts only 4–5★ views as "valued watchtime", then trains a model to predict survey answers for everyone. | 🟡 [YouTube Blog](https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/) |
| **Bonsai** (CHI 2026, 15 Bluesky users) | Users wrote feed intentions in plain language; the system sourced, filtered and ranked to match. It worked, but "curating intentional feeds required more effort than they are used to", and users wanted transparency. | ✅ [arXiv](https://arxiv.org/abs/2509.10776) |

### "Recommendation and Temptation" in plain words

- Every item has two values for each user: **enrichment** (real value to them) and **temptation** (instant pull, separate from value).
- When **choosing** what to click, people weight temptation more. When **rating** afterwards, they weight enrichment more. So **clicks reveal temptation; ratings reveal enrichment.**
- The user always has an **outside option**. The paper's own examples: "doom scrolling, exam studying, or sleep". A tempting low-value item can push out both good content *and* good offline choices.
- The recommender's goal is **enrichment actually consumed**, not clicks. They prove the best strategy is simple: each time, show the item with the highest *expected* enrichment, which weighs value against the chance the user actually picks it.
- In their simulations of a "student procrastination" setup (tempting but low-value platform content), the method did about 20–30% better on enrichment than click-based or rating-only baselines.
- **Limits they name:** tested on simulations and MovieLens (with synthetic clicks), not a live product. It needs you to estimate how tempting the outside options are, which in practice means asking users.

🔵 **What this means for you:** your "almost no questions" goal and this research pull in opposite directions. Clicks alone will learn temptation. You need **some** deliberate signal (ratings, "was this useful?", notes taken), but it can be light (section 13B). Also, the outside option matters: **closing the app to go study is a success, not a loss.**

---

## 13. Design options

### 13A. The user's goal limits what can appear; behaviour only reorders within it

| Option | How it works | Pros | Cons |
|---|---|---|---|
| **1. Hard gate** | Goal (mode + exam + subjects + mutes) decides which videos are eligible. Behaviour ranks only inside that set. | Can never drift into entertainment. Easy to explain. Works for minors if you switch the behavioural ranking off. | Weak discovery. A stale goal gives a stale feed. Depends on the classifier being right. |
| **2. Gate + small labelled "explore" slot** | Same as 1, plus e.g. 1 in 10 slots for nearby topics, marked "Outside your goal". | Discovery without a silent leak. | The slot itself can become the temptation. Needs a user switch. |
| **3. Enrichment-first ranking** (Anwar et al.) | Inside the gate, rank by estimated enrichment (from ratings/notes/completions), not clicks. | Most directly anti-trap. Research-backed. | Needs explicit feedback data. More complex. Untested on real users. |
| **4. Short-term focus** | "This week: Polity" narrows the gate further and expires on its own. | Matches how aspirants plan. One tap. | Another thing to set; must not become a chore. |
| **5. Pure behaviour ranking with filters** (YouTube's model minus bad categories) | Learn from clicks, remove blocked categories. | Least effort for the user. | Exactly the trap: learns temptation inside the allowed set (e.g. motivational binges). Not allowed for minors. |

🔵 Options 1 + 3 (+ 4 later) fit your rules best. Option 5 is the one to avoid.

### 13B. Light explicit feedback

| Option | Pros | Cons |
|---|---|---|
| **Occasional one-tap "Did this help your prep?"** after a video (sampled, not every time; YouTube does this) | Directly measures enrichment. One tap. | Few people answer; those who do may be extreme. Must be rare to avoid annoyance. |
| **Treat actions as deliberate signals**: taking a note, bookmarking a timestamp, "mark as studied", finishing a playlist item | No extra question. Strong sign of value. | Only some users take notes. Watching to the end can also mean temptation. |
| **One-tap mute channel/topic, with undo and a "Muted" list** | This is your "podcast" story. Strong, clear signal. | Must be a hard rule, not a soft weight. Mozilla found YouTube's soft version was only 11–43% effective. |
| **Weekly 20-second check-in**: "Which 3 of these helped most?" | Rich signal, low frequency. | Easy to ignore. Needs good timing. |
| **App suggests a mute** when it sees a pattern (a channel clicked often, never rated helpful) | Uses behaviour to *offer* control, not take it. Fits "user sets the rules". | Can feel like being watched. Needs a clear "why". Behavioural for minors. |
| **Plain-language goal box** (Bonsai style) | Very flexible. | Bonsai users found it more effort than expected. Conflicts with "almost no questions". |

### 13C. Capping "tempting but low-value" content

| Option | Pros | Cons |
|---|---|---|
| **Per-category quota** (e.g. max 1 motivational per 10 feed items), user-set, with a suggested default | Simple, visible, predictable. | Users must decide what counts as "tempting"; one person's podcast is another's study aid. |
| **Daily time budget per category**, set by the user (like your Shorts rule) | Consistent with your Shorts design. | Time limits are easy to dismiss; YouTube's own Shorts timer is dismissible. |
| **Context rule**: motivational only at session start or after a study block | Motivation where it helps, not as a replacement for study. | More rules to explain. |
| **Learned temptation score**: often clicked, rarely rated helpful → shown less, with a label | Needs no setup. Research-backed idea. | Behavioural (not for minors). Opaque unless you explain it. Needs rating data. |
| **Friction**: a short pause ("You've watched 3 motivational videos today, continue?") | Strong evidence: the *one sec* app's pause made users drop 36% of attempts and try to open target apps 37% less after 6 weeks (PNAS 2023, ~280 users). | Annoying if overused. Must be user-enabled. |

🔵 Whatever you pick, **label it** ("Motivation: 2 of your 3 today") and let the user raise the cap in one tap.

### 13D. Success metrics other than watch time

| Metric | What it tells you | Watch out for |
|---|---|---|
| **Valued study time**: minutes on videos rated helpful or with notes taken | Closest to "enrichment consumed". Mirrors YouTube's "valued watchtime". | Depends on feedback rate. |
| **Goal progress**: syllabus/playlist items completed per week | Ties to the user's actual goal. | Needs a syllabus model per exam. |
| **Intentional exits**: sessions ended by the user ("Done for today") vs abandoned or escaped to YouTube | Measures the trap directly. Escaping is a failure; finishing is a success. | You can't see what happens after they leave. |
| **Tempting share**: % of feed time in categories the user capped | Shows if caps hold. | — |
| **Over-block rate**: "I need this" / "Show anyway" taps | Your most important filter number. | — |
| **Weekly "time well spent?" check** (1–5) | Direct regret measure. | Survey fatigue. |
| **4-week and 12-week retention** | Still needed: a helpful app nobody keeps is not helpful. | If you optimise only this, you drift back to engagement. Keep it as a guardrail, not the goal. |
| **Guardrail: total watch time** | Watch it only so it doesn't rise *while* valued time stays flat. That pattern = trap forming. | Never make it a target. |

---

## 14. Behavioural science a study app can use

Your rule for every feature: **the user sets the rules, the app says what it hides and why, the user can always override.**

A general warning first: **controlling tools backfire.** Research on digital self-control tools finds that hard blocks with no override cause frustration, and people abandon the tool (psychological reactance). Autonomy-supportive design does better. [JMIR 2026](https://formative.jmir.org/2026/1/e85349/XML), [SDT review, Interacting with Computers](https://academic.oup.com/iwc/advance-article/doi/10.1093/iwc/iwae040/7760010) 🟡. A 2023 meta-analysis found limited evidence that these tools build lasting habits. [Roffarello & De Russis, ACM TOCHI](https://dl.acm.org/doi/10.1145/3571810) ✅.

### Commitment devices

**What it is:** choosing now to limit your future options, because you expect to be tempted later.

**Evidence:**
- ✅ Bryan, Karlan & Nelson review (Annual Review of Economics 2010): commitment can work, but **take-up is often low**, and soft commitments behave differently from hard ones. [Annual Reviews](https://www.annualreviews.org/doi/pdf/10.1146/annurev.economics.102308.124324)
- ✅ The famous Ariely & Wertenbroch (2002) "self-imposed deadlines" study was **retracted by *Psychological Science* on 2 Sept 2026**, after Data Colada found signs of data tampering and co-author Wertenbroch requested retraction. Don't cite it. Verified via the publisher's retraction record ([retraction notice, DOI 10.1177/09567976261488042](https://doi.org/10.1177/09567976261488042); checked through Crossref's publisher metadata, which links it to the original DOI as a "Retraction" dated 2026-09-02). Background: [Data Colada](https://datacolada.org/138), [Retraction Watch](https://retractionwatch.com/2026/09/03/procrastination-study-duke-dan-ariely-psychological-science-data-colada-tampering-retraction/). (Re-verified 2026-09-26.)

| Example in the app | Risk of feeling controlling | How to keep it on the user's side |
|---|---|---|
| **Study block**: "Lock Shorts and Motivational for 90 min" | Medium. Hard locks cause reactance. | Soft lock: ending early takes a 10-second pause and one tap, never impossible. |
| **Rules set in a calm moment** (e.g. Sunday): next week's caps | Low | Show them as "Your rules (set Sunday)". Changeable any time, with a short delay. |
| **Shorts off / daily limit** (your existing rule) | Low, because the user set it. | Already fits. |
| **Tell a friend / study partner** your goal | Medium. Social pressure can shame. | Opt-in only; share progress, not failures. |

### Nudges and choice architecture (Thaler & Sunstein)

**What it is:** a nudge changes behaviour "without forbidding any options" or changing incentives much. Its dark twin is **sludge**: friction that works against the person. [Wikipedia](https://en.wikipedia.org/wiki/Nudge_(book)), [Science, "Nudge, not sludge"](https://www.science.org/doi/10.1126/science.aau9241)

**Evidence:**
- ✅ Mertens et al. (PNAS 2022), 200+ studies: average effect d = 0.43. [PNAS](https://www.pnas.org/doi/10.1073/pnas.2107346118)
- ✅ Maier et al. (PNAS 2022): after correcting for publication bias, **no evidence** of an overall effect remains. Some kinds of nudge may still work. [PNAS](https://www.pnas.org/doi/10.1073/pnas.2200300119)
- ✅ The *one sec* pause (a self-chosen nudge), 280 participants over 6 weeks: 36% of attempts to open a target app were abandoned after the pop-up, and attempts fell 37% versus week one; together, **57% fewer actual openings**. A follow-up experiment (N = 500) found the **option to dismiss** had the strongest effect, the time delay helped, and the deliberation message "was not effective". Re-verified 2026-09-26 against the abstract. [PNAS 2023](https://www.pnas.org/doi/10.1073/pnas.2213114120), [Europe PMC, PMC9974409](https://europepmc.org/article/MED/36795756). 🔵 Participants had chosen to install the app, so they were already motivated.
- 🔵 So: expect small effects, test each one, and prefer nudges the user switches on themselves.

| Example in the app | Risk | How to keep it on the user's side |
|---|---|---|
| **Defaults**: Shorts off in Aspirant, autoplay off | Low if shown clearly | One place in Settings lists every default. |
| **Order**: "Continue Polity lecture 7" is always the first card | Low | Fully transparent; user can reorder. |
| **Friction for tempting categories** (pause before the 4th motivational video) | Medium | Only if the user turned it on. Says why ("You set a cap of 3"). |
| **Progress salience**: "4 of 12 Polity chapters done" | Low | Can be hidden. |
| **Hidden steering** (quietly lowering things you like) | **High: this is sludge** | Don't. Every ranking rule should have a visible "Why am I seeing this?" |

### Implementation intentions (Gollwitzer)

**What it is:** an if-then plan. "If situation X, then I do Y."

**Evidence:** ✅ Gollwitzer & Sheeran (2006) meta-analysis: d = 0.65 across 94 tests and 8,000+ people. One of the stronger effects in behaviour-change research. [Semantic Scholar](https://www.semanticscholar.org/paper/Implementation-intentions-and-goal-achievement:-A-Gollwitzer-Sheeran/c4deb3507fe725ce6363c1735f1ba83bab20d665)

| Example in the app | Risk | How to keep it on the user's side |
|---|---|---|
| **One-tap templates**, offered later (not at sign-up): "When I open the app after 7 pm → start my next lecture" | Low–medium. Extra questions clash with "minimal onboarding". | Offer once after a few days of use; skip is one tap. |
| **Temptation plans**: "If a podcast looks tempting → save it to 'After study'" | Low | A "parking lot" list; nothing is blocked, only postponed. |
| **Session start**: app opens straight to the plan the user made | Low | The user can change the start screen. |

### Habit formation

**Evidence:**
- ✅ Lally et al. (2010), 96 people: a daily behaviour took a median **66 days** to become automatic, with a range of **18 to 254 days**. Missing one day barely mattered. [Wiley](https://onlinelibrary.wiley.com/doi/10.1002/ejsp.674)
- 🔵 Habits form around **stable cues** (same time, same place, after the same action).
- 🔵 **Danger:** the habit you build must be "study", not "open the app". Otherwise you've built YouTube's trap with a study label.

| Example in the app | Risk | How to keep it on the user's side |
|---|---|---|
| **Cue-based start**: "After breakfast → one lecture" reminder the user sets | Low | User picks time and can turn it off. |
| **Streaks** | **High.** Loss aversion causes guilt, and your own user story is about guilt. | Forgiving weekly totals instead of fragile daily streaks; missed days don't reset to zero. |
| **"You studied 5 h this week"** summary | Low | Shows effort, not rank. |
| **Leaderboards** (like YPT) | Medium–high. Comparison can motivate or shame. Grey area for minors under DPDP. | Opt-in only; adults only. |

---

## 15. Conflicts with YouTube's Developer Policies

> ⚠️ Corrected 2026-09-27: sections 15–19 missed a list in the compliance guide that is more direct than III.E.4.h. Under "Only offer metrics that are available via YouTube's API services" → "Don't use YouTube's API to:": "Infer or estimate the content category/type of a video or channel; you may only use the content type returned by the YouTube API", "Make any claims on whether a video or channel is safe or suitable to watch or advertise against", "Merge or combine YouTube API data with any other data" ✅ [guide](https://developers.google.com/youtube/terms/developer-policies-guide). Policies III.L (from 1 June 2026) allow tagging only for audited analytics apps ✅ [derived-metrics policy](https://developers.google.com/youtube/terms/derived-metrics-policy). The classifier risk is higher than stated below. The chosen architecture keeps title-based judging off until the audit allows it (see [research-summary.md](research-summary.md) and [feasibility.md](feasibility.md)).

Quoted text ✅ from the [Developer Policies](https://developers.google.com/youtube/terms/developer-policies). What it means for you is 🔵 unless marked.

| Idea | Relevant rule | Risk |
|---|---|---|
| **Training your own model on video titles/descriptions** (⚠️ Superseded, see section 16: train only on non-YouTube text) | III.E.4.h: must not "access or use API Data to create new or derived data or metrics". III.E.4: most API data kept max 30 days. | **High and unclear.** A literal reading covers a trained classifier *and* stored labels. There's no specific mention of ML. ❓ You need a written answer from YouTube API support or the audit process before building your roadmap around this. |
| **Storing "learning/entertainment" labels per video** (⚠️ Superseded, see sections 16 and 17: cache ≤ 30 days, labels kept internal) | Same as above. | **Medium–high.** Showing your own labels next to YouTube data also needs a clear "not from YouTube" disclosure (III.E.4.h, second part). |
| **Curated feeds mixing many channels** | III.E.2: "Do not aggregate API Data except… channels under the same content owner." | ❓ Probably aimed at combining statistics across channels, since normal search results already span channels. Unclear. |
| **Hiding or capping videos** | Guide: don't filter "without their knowledge or consent". | **Low** if the user sets it and sees what's hidden. |
| **Reordering search results** | III.C: must not "modify or replace the text, images, information, or other content" of search results. | ❓ Reordering isn't explicitly banned. Hiding + reordering together may be read as modifying. |
| **Enrichment/temptation scores from the user's own ratings and clicks** | These are your user data, not API data. | **Low–medium**, but they're tied to video IDs (API data). ❓ |
| **Friction/pause before playing** (⚠️ Superseded, see section 16: nothing is locked or unlocked) | III.F.3: can't gate video access with actions other than pressing play. | **Medium.** A "continue?" pause before a video may count as gating. A pause on *opening the category* or *the app* is safer. ❓ |
| **"Push toward work" suggestions** | III.I.1: needs "significant independent value" over YouTube. | **Low.** This *is* your independent value. |
| **Music & Movies mode** (⚠️ Superseded, see section 16: dropped) | III.I.1: no substitute for YouTube. | **Medium–high.** Hard to argue independent value. |
| **Kids mode** | III.J: tell Google, no write actions, Made for Kids handling. | Manageable, but it's a separate compliance track. |
| **Metrics like "valued study time"** | III.E.4.h: must not create derived metrics from API data. | **Low** if built from *your* data (the user's time and ratings), not YouTube's view counts. |

---

## Updated open questions

1. **ML on YouTube data:** will you ask YouTube (API support or audit) whether a classifier trained on titles, and stored labels, are allowed under III.E.4.h? The "own model" part of your vision depends on it.
2. **Under-18s in India:** would you accept that behaviour-based learning is off for minors (settings + context only), or do you want to pursue the "educational institution" route through schools and coaching partners?
3. **Explicit signal:** which light feedback are you comfortable with: occasional "Did this help?", notes and bookmarks as signals, a weekly check-in, or app-suggested mutes?
4. **Who decides what's "tempting"?** Motivational content is inside Aspirant mode as a category you want. Should the user set its cap, should the app suggest one, or both?
5. **Music & Movies:** do you still want it, knowing it makes the "not a YouTube substitute" argument harder and blurs the pitch?

---

# Round 3 (2026-09-26)

## 16. Your answers, checked against DPDP and the Developer Policies

### Your answers (recorded as given)

1. **No special permission from YouTube.** Stay inside the Developer Policies: a classifier trained only on non-YouTube text, run at request time, results cached ≤ 30 days; zero-shot LLM as fallback; human-curated channel lists per mode; personalisation only from our own user data. Anything that can't fit the rules is redesigned or dropped.
2. **Under-18s: behaviour learning off.** One system with a behaviour layer that can be switched on or off. Under 18: settings + current video + content filter only. 18+: behaviour only reorders within allowed content, and adults can switch it off. Age asked at sign-up; parental consent flow built from the start. School/coaching partnerships only as a future option. *(⚠️ Superseded, see sections 17.4 and 18: accounts are 18+ at launch; minors come later through a parent-first family account.)*
3. **Feedback:** silent signals (notes, timestamp bookmarks, "mark as studied", finishing a playlist item, "I need this"). Mute is a hard rule. "Done for today" screen with one optional "Was today's time useful?". No per-video questions, no weekly check-in. App-suggested mutes only for 18+, always with the reason.
4. **Motivational content:** user sets any cap. The app places motivational videos at session start or after a study block but never locks or unlocks them. They stay in search and categories. For 18+ heavy watchers, the app offers once to set a limit. Small label: "Motivation: 2 today". *(⚠️ Superseded, see section 17: no visible labels or counters.)*
5. **Music & Movies dropped.** Mission: *help people become better learners by giving them content that makes them smarter, not content that keeps them scrolling.* Every feature must pass this test.

### The policy text that matters most (✅ verbatim, [Developer Policies III.E.4](https://developers.google.com/youtube/terms/developer-policies))

- **d)** "API Clients may temporarily store **limited amounts** of Non-Authorized Data for as long as is necessary for the purposes of the API Client but **not longer than 30 calendar days**."
- **e)** Stored API data must be kept "consistent with the current data available through YouTube API Services."
- **f)** Apps "must display the most updated API Data available".
- **g)** Apps "must provide a way for a user to request that you delete stored data related to that user" (**within 7 calendar days**). (⚠️ Note 2026-09-27: the compliance guide says "within 30 days", but the binding Policies say 7 ✅. Follow 7.)
- **h)** "Your API Clients must not (i) replace API Data with similar, independently calculated data, or (ii) access or use API Data to create new or derived data or metrics."
- "API Data" includes "data, content… and information provided to API Clients through the YouTube API services". There's **no stated exception for video or channel IDs.**
- I found no text allowing API data to be shared with third parties or service providers. There's also no text that explicitly bans it. ❓

### Answer 1: stay inside the rules

| Part | Verdict | Why |
|---|---|---|
| Classifier trained only on non-YouTube text | ✅ **Removes the training risk** | No API data goes into training, so nothing derived from API data is stored in the model. |
| Running that classifier on YouTube titles at request time | ⚠️ **Residual risk** | The label ("learning") is still arguably "derived data" created from API data (III.E.4.h). Training on outside text doesn't change what happens at runtime. **Counter-argument (🔵):** the compliance guide bans filtering "without their knowledge or consent", which implies consented filtering is expected, and filtering needs *some* judgement about each video. This can't be fully settled without asking YouTube, and you've chosen not to. |
| Caching labels ≤ 30 days | ⚠️ Helps, doesn't settle it | Meets III.E.4.d on storage time, but a stored label is still derived data. Also note "**limited amounts**": a large cache of every video ever seen may not count as "limited". |
| Zero-shot LLM fallback (decided, see section 17.3) | ⚠️ **New risk** | It sends titles and descriptions (API data) to an outside LLM provider. The policies don't clearly allow or ban this. ❓ Lower-risk variants: a provider contract with no retention and no training on inputs, or a self-hosted open model. |
| Human-curated channel lists | ✅ Mostly fine | 🔵 If a curator copies channel IDs from youtube.com by hand, they arguably aren't "provided through the API". If you fetch them via the API, the 30-day rule may apply. ❓ Low risk in practice, but record where each ID came from. |
| Personalisation from our own user data only | ✅ Fine | Notes, mutes, "mark as studied" and time spent are your data. But see the next row. |
| Our data tied to video IDs (notes, bookmarks, history) | ⚠️ **Medium** | A note is kept for months and points to a video ID. The ID came from the API. There's no ID exception in the text. 🔵 Common practice is to keep IDs and **re-fetch titles and thumbnails when showing them** (which III.E.4.e/f require anyway). ❓ |
| Product risk: training on non-YouTube text | ⚠️ **Accuracy risk, not a legal one** | YouTube titles are short, clickbait-heavy and often Hinglish ("🔥 Polity ONE SHOT 🔥 | Laxmikanth"). A model trained on course catalogues or articles may misread them and over-block, which is your worst failure. You still have to **test on real YouTube titles**. |
| **The Phase 1 test set** (and `fetch_videos.py`) | ⚠️ **Conflicts with III.E.4.d** | A labelled test set of 500–1,000 YouTube titles kept for months breaks the 30-day limit. The CSV that `fetch_videos.py` writes is API data too. 🔵 Workaround: keep only **video IDs + your own human labels** long-term, and re-fetch titles fresh for each test run. Whether your human label is "derived data": same ❓ as above. |
| Non-YouTube training text sources | ❓ Check each licence | Wikipedia is CC BY-SA, course sites have their own terms, and scraping other sites brings its own legal risk. Synthetic titles written by an LLM *without* YouTube input avoid this. ⚠️ Added 2026-09-27: NPTEL (CC BY-NC-SA ✅) and MIT OCW (CC BY-NC-SA 🟡) are NonCommercial, so they're not usable as training text for a paid app. See [feasibility.md](feasibility.md) 10a. |

🔵 **Summary:** your redesign removes the clearest risks (training on API data, keeping it long-term). What remains is the runtime-label question under III.E.4.h. Any filtering app faces that risk, and you can only reduce it:
- Keep labels **internal** (used to filter and rank, not shown as a score or metric).
- If you do show a category, add the "not from YouTube, part of our product" notice that III.E.4.h requires.
- Cache as little and as briefly as you can.
- Have a **plan for the day YouTube says no**, e.g. channel lists + user mutes only.

### Answer 2: under-18s

| Part | Verdict | Why |
|---|---|---|
| Behaviour layer off for under-18s | ✅ Matches s.9(3) | Settings, current video and filter are the defensible trio (section 11). |
| Filter for minors | ✅ | Fits Fourth Schedule Part B entry 5 ("not accessible to her… to the extent necessary"). Parental consent is still needed for the account. |
| Layer switchable for adults | ✅ Good | 🔵 Treat it as a **separate consent purpose** under DPDP (consent must be specific). It also matches the EU direction of offering a non-profiling feed. |
| **Age asked at sign-up (self-declared)** | ⚠️ **Weak point** | Rule 10 makes you verify that the *parent* is an identifiable adult, but says little about checking the child's own age. ✅ [Rule 10](https://www.dpdpa.com/dpdparules/rule10.html). A 16-year-old can simply type 18. 🔵 Use the signals you already have: if someone picks "Class 11", "JEE 2028" or similar, treat them as a minor whatever age they typed. |
| Parental consent from day one (⚠️ Superseded, see sections 17.4 and 18: 18+ only at launch) | ✅ Good, with a catch | Consent is needed **before** processing a child's data. Asking age, then holding the account in a "waiting for parent" state, is the usual pattern. Verification: parent already a verified user, government ID, or a DigiLocker-style token (Rule 10 illustrations). 🔵 This adds real friction and cost to the youngest users' sign-up, and friction is the enemy of "almost no questions". |
| **Option worth researching: no-account mode for minors** (⚠️ Superseded, see section 17: you rejected it) | ❓ | Settings and mutes stored **only on the device**, with no server account. If you don't collect or process their personal data, DPDP obligations may not apply at all. That would mean no sync and no notes backup. Ask a lawyer. |
| Signals like notes for minors | ⚠️ Keep them out of ranking | Storing a minor's notes is a feature (with consent). Using them to **rank** the feed is behaviour learning. The switch must cover this too. |

### Answer 3: feedback

| Part | Verdict | Why |
|---|---|---|
| Silent signals (notes, bookmarks, studied, finished) | ✅ Fine for 18+ | Your own data. Best available proxy for "enrichment" (section 12). |
| Same signals for under-18s | ⚠️ | Stored = OK with consent. Used to rank = not OK (see above). |
| "I need this" taps | ✅ | Also doubles as your over-blocking metric. |
| Mute as hard rule | ✅ | Consented filtering; Mozilla showed soft mutes fail. |
| "Was today's time useful?" | ✅ for 18+; ⚠️ for minors | For minors, store it **only in aggregate** (not tied to their profile) so it's product analytics, not monitoring. 🔵 |
| App-suggested mutes 18+ only, with reason | ✅ | Behavioural, so correctly adults-only. |
| Data deletion | ⚠️ New requirement | III.E.4.g: users must be able to request deletion, done **within 7 days**. That's stricter than you might assume from DPDP. |

### Answer 4: motivational content

| Part | Verdict | Why |
|---|---|---|
| Never lock/unlock | ✅ **Correct call** | Avoids III.F.3 ("gate access to a video by requiring a user to take an action other than clicking the play button"). |
| Placing motivational at session start / after a study block | ✅ | This is your own feed order, not modified YouTube search results. |
| Still available in search | ✅ | Keeps III.C concerns low. |
| One-time "set a limit?" offer for heavy 18+ watchers | ✅ | Behavioural, adults only, one-time, dismissible. |
| **"Motivation: 2 today" label** (⚠️ Superseded, see section 17: labels internal, no counters) | ⚠️ Two issues | (1) The "Motivation" category is your derived label; shown next to YouTube data it needs a clear "our label, not YouTube's" disclosure (III.E.4.h, second part). (2) For **minors**, counting what they watch is close to tracking. 🔵 Count only within the session or on the device. |

### Answer 5: Music & Movies dropped

✅ Removes the III.I.1 ("substitute for YouTube") concern. 🔵 Your mission test is also the best defence in a YouTube audit or dispute: it's the "significant independent value" III.I.1 asks for. Later modes (Motivational, Fashion, Kids) should each be run through the same test.

### Risks still open after this round

| Risk | Level | Can it be designed away? |
|---|---|---|
| Runtime label = "derived data" (III.E.4.h) | **Medium–high** | Reduced, not removed. Needs a fallback that works without labels. |
| LLM fallback sends API data to a third party | Medium | Yes: no-retention contract or self-hosted model. |
| Long-term test set of YouTube titles | Medium | Yes: store IDs + your labels, re-fetch titles for each run. |
| Video IDs in notes/bookmarks kept long-term | Low–medium | Mostly: store IDs only, re-fetch titles. ❓ |
| Minors lying about age | Medium | Partly: use class/exam signals. |
| Parental-consent friction | Medium (product) | Partly: no-account on-device mode (❓ legal). |
| Classifier trained on non-YouTube text over-blocks real titles | Medium (product) | Yes: test on fresh YouTube titles; LLM fallback for "unsure". |

---

## Open questions after round 3

> Answered in section 17.

1. **Fallback if III.E.4.h is ever enforced against labels:** are you OK with a reduced mode (channel lists + user mutes + Shorts off, no classifier) as the "worst case" product?
2. **LLM fallback:** hosted provider with a no-retention contract, or self-hosted open model (more work, no data leaves you)?
3. **Minors:** should we research a no-account, on-device mode for under-18s as an alternative to the parental-consent flow?
4. **Category labels in the UI:** show them ("Motivation", "Learning") with a disclosure, or keep them internal and show only the user's own caps?

---

# Round 4 (2026-09-26)

## 17. Your round 3 answers, and new research

### Your answers (recorded as given)

- **Overall goal:** as simple as normal YouTube, just better. All intelligence stays inside the app; the user never does extra work.
- **1. Worst case accepted:** channel lists, mutes, Shorts off, notes, no classifier. The classifier is a separate, removable layer.
- **2. LLM:** hosted, under a no-retention/no-training agreement, model easy to swap; move to self-hosted open model as usage grows.
- **3. Under-18s:** no-account mode rejected. Compare (a) consent flow for under-18 accounts, (b) 18+ only at launch, or a hybrid.
- **4. Labels:** all internal. Disclosure = one line when choosing a mode ("Aspirant mode hides entertainment and distractions") + a quiet "X results hidden · Show" line under search results.

### 17.1 The missing source: exact quote ✅

Verified against the raw page text (downloaded and searched, not a summary).

- **Page:** *Complying with YouTube's Developer Policies* (the compliance **guide**, not the Developer Policies document itself). <https://developers.google.com/youtube/terms/developer-policies-guide>
- **Heading:** "Respect user privacy." → "Examples" → "Don't use YouTube's API to:"
- **Quote:** "Restrict, filter, or prohibit a user's access to content on YouTube without their knowledge or consent."

Two things to note:

1. **The Developer Policies document itself contains no sentence about filtering.** Earlier sections attributed the line to both pages. The correct source is the guide only. The guide is Google's official explanation of the policies, but it's a set of examples, not the policy text.
2. The same list also says don't "Harvest, track, infer, derive or store the following about a user without their consent", and **"Health information"** is the first example. That matters for Accessibility mode later: the help someone needs must be stored only with explicit consent.

The same page also says: "If… you're unsure whether your service is allowed, please apply for an API Compliance Audit." The audit is Google's normal route, not a special favour (see 17.2).

🔵 **Your disclosure design (mode line + "X results hidden · Show") covers "knowledge", and the user choosing the mode covers "consent".** I think that's enough. Two small additions would make it stronger: the mode line should be on the screen where the mode is *chosen* (not buried in Settings), and "Show" should reveal the hidden results right there.

### 17.2 ⚠️ Correction and a conflict: search quota

**Correction (✅ [revision history, 1 June 2026](https://developers.google.com/youtube/v3/revision_history); [search.list docs](https://developers.google.com/youtube/v3/docs/search/list); [quota page](https://developers.google.com/youtube/v3/determine_quota_cost)):** YouTube moved to "granular" quotas. `search.list` now has **its own bucket: 100 calls per day, 1 unit each.** Every extra page of results is another call. The 10,000 general units now go entirely to cheap calls (`videos.list`, `playlistItems.list`, `channels.list`, 1 unit each). Google says the change "simplifies the path to quota increases".

**Conflict with "no special permission":** 100 searches a day is the whole app's limit, not per user. Real search for more than a few dozen active users **requires a quota extension, which requires a compliance audit.**

🔵 How I'd square this with your rule: an audit isn't *special permission*. It's the standard process every serious API app goes through, and it approves normal use rather than bending rules. The design principle can be: **the app must work, in reduced form, on default quota.** Feeds from curated channels, shared caching of popular searches, and "related" built from cheap calls (17.6) keep the app usable. More search quota then *scales* it; the app doesn't *depend* on it. This is your call, but I'd treat applying for the audit before launch as expected, not optional.

### 17.3 LLM providers with no-retention terms for small developers

| Provider | Default retention of prompts/outputs | Zero retention for a small self-serve account? | Training on your data | Label |
|---|---|---|---|---|
| **Groq** | None by default for inference; up to 30 days for reliability/abuse checks | **Yes: "All customers may enable Zero Data Retention (ZDR) in Data Controls settings."** | Not stated on that page ❓ | ✅ [Groq docs](https://console.groq.com/docs/your-data) |
| **Fireworks AI** | **"Zero Data Retention by default"** for open models; data only in memory during the request | Yes (default). Exceptions: prompt caching (minutes), opt-in features, Responses API stores 30 days unless `store=False`. | Not stated ❓ | ✅ [Fireworks docs](https://docs.fireworks.ai/guides/security_compliance/data_handling) |
| **Amazon Bedrock** | Configurable; a `data_retention_mode` of `none` can be set at account/project level | Reportedly yes, self-set. Some newer models require 30-day retention and are blocked under `none`. | Not used for training | 🟡 [AWS blog](https://aws.amazon.com/blogs/security/enforce-zero-data-retention-on-amazon-bedrock-with-bedrock-projects-and-service-control-policies/), [AWS docs](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html) |
| **Anthropic (Claude API)** | Deleted within 30 days; flagged content up to 2 years | **No, ZDR is via the sales team.** Top "Covered Models" (Fable 5/5.1, Mythos 5/5.1) always need 30-day retention. | "Never used for model training without your express permission" | ✅ [Claude docs](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention), [privacy center](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data) |
| **OpenAI** | Abuse-monitoring logs up to 30 days | **No, ZDR needs prior approval.** | Not by default for API | 🟡 [OpenAI docs](https://developers.openai.com/api/docs/guides/your-data) |
| **Google Gemini API (paid)** | Logged for abuse checks; retention configurable, up to 55 days | **No** on the Developer API; Google points to Vertex AI (enterprise terms) for guaranteed ZDR. | Not on paid tier | ✅ [Gemini ZDR page](https://ai.google.dev/gemini-api/docs/zdr), 🟡 retention days |

**Speed** (🟡 [Kunal Ganglani benchmarks](https://www.kunalganglani.com/blog/llm-api-latency-benchmarks-2026), [AIMultiple](https://research.aimultiple.com/llm-latency-benchmark/)): Groq first token usually < 200 ms; Gemini Flash < 300 ms; Claude Haiku 4.5 ~600 ms on a medium prompt. A classification answer is a few tokens, so total time ≈ first-token time + network.

**Recommendation (🔵):** use an **open-weight model** (e.g. a Llama or Qwen family model; pick by testing on Hinglish titles) on **Groq or Fireworks with ZDR on**. ⚠️ Corrected 2026-09-27: Groq's Llama models are now enterprise-tier 🟡; GPT-OSS and Qwen models remain self-serve on Groq and Fireworks ([feasibility.md](feasibility.md)).
- Both offer zero retention to small accounts without a sales call.
- Both are fast enough.
- Most important for your plan: **the same open model can later run on your own server**, so "move to self-hosted" is a hosting change, not a model change. With a closed model (Claude, Gemini, GPT), moving to self-hosted means switching models and re-testing accuracy.
- ❓ Open models' accuracy on Hinglish titles is unknown until you test. Keep one closed model as a benchmark during testing only.

### 17.4 Under-18s: (a) consent flow vs (b) 18+ at launch

**First, your filter question.** Confirmed, with one nuance:

- DPDP s.9(1) requires verifiable parental consent before processing **any** personal data of a child. ✅
- Fourth Schedule Part B entry 5 exempts processing for making harmful content "not accessible to her… to the extent necessary" from s.9(1) and 9(3). ✅ [text](https://privacylawhub.com/bare-acts/dpdp-rules-2025/schedule-iv-fourth-schedule-exemptions-from-section-9-1-and-9-3-)
- 🔵 So the filter's own narrow processing may not need consent. **But the account, notes, bookmarks, sync, progress and everything else do.** The filter protects children from harmful videos. It doesn't replace parental consent for processing their data.

**What "verifiable" means in practice** (DPDP Rule 10, ✅ [text](https://www.dpdpa.com/dpdparules/rule10.html)):
- You must check that the person consenting is an **identifiable adult**. Two routes: (1) "reliable details of identity and age" you already hold (e.g. the parent is already a verified user of your app), or (2) details the parent provides or a **"virtual token"** from an authorised entity: in practice **DigiLocker** (Aadhaar-linked).
- Rule 10 doesn't say how to check the *child's* age. Self-declaration plus "due diligence" is the common reading. 🟡
- Cost estimate: DigiLocker-based consent ≈ **₹3 per verification** (₹29.9 lakh per 1 million); government-ID checks ≈ ₹15 each. 🟡 [MediaNama](https://www.medianama.com/2025/03/223-how-much-does-parental-consent-verification-cost-under-indias-dpdp-act/). Integration is usually through aggregators (e.g. Cashfree, Setu, Digio) rather than DigiLocker directly.
- Gaps: parents without DigiLocker, and guardians who aren't parents, aren't handled well. 🟡 same source.

**Maximum penalty** ✅/🟡: the DPDP Act Schedule sets **up to ₹200 crore** for breaching the children's obligations (s.9); ₹250 crore is the cap for failing to protect against data breaches. These are ceilings; the Data Protection Board sets the actual amount using factors in s.33(2). [dcomply](https://dcomply.in/dpdp-penalty), [DPDP Comply](https://dpdpcomply.com/blog/dpdp-act-penalties-explained). Enforcement of the children's rules starts **13/14 May 2027** (⚠️ corrected 2026-09-27: exactly 13 May 2027 ✅).

**How incumbents do it today** (✅ from their own pages):

| Company | Approach | Would it meet Rule 10 from May 2027? (🔵) |
|---|---|---|
| **Physics Wallah** | "in case of minors, consent… is **deemed** to be given by their guardians/parents"; "It is **implied** that at the time of registration the parents/guardians of a minor agree". Minors use the platform "under the supervision of a parent". [Terms](https://www.pw.live/terms-and-conditions). MediaNama raised child-data concerns about PW in June 2026. [MediaNama](https://www.medianama.com/2026/06/223-physicswallah-educational-gaming-entryn-consent-children-data-privacy/) | **Unlikely.** Deemed/implied consent isn't verified. |
| **Unacademy** | Minors "may not register… only your Parent… can register on the Platform on your behalf"; "we… assume that information has been provided with consent of the Parent". No verification described. [Privacy policy](https://unacademy.com/privacy) | **Unlikely** as written. Parent-registers is the right shape but lacks verification. |

🔵 Both rely on assumed consent. When enforcement starts, they'll have to change, so the whole market's sign-up friction will rise together. Doing it properly isn't a disadvantage relative to them after May 2027.

**Drop-off:** ❓ No India-specific data. A vendor blog claims 30–70% abandonment at document-based age verification. 🟡 [Xident](https://xident.io/blog/age-verification-drop-off-reduce-abandonment-convert-users-2026/) (vendor, treat with caution). 🔵 For a 16–17-year-old aspirant who studies alone at night, "go get your parent to verify with DigiLocker" is a big ask; I'd expect heavy drop-off, but that's an assumption to test.

**Options compared:**

| | (a) Consent flow at launch | (b) 18+ only at launch | (c) **Hybrid (recommended)** |
|---|---|---|---|
| What it is | Minors can sign up; parent verifies (DigiLocker or verified parent account) before the account works | Age gate; under-18s told "coming soon" | (⚠️ Superseded, see section 18: any field at launch, 18+ accounts only.) Launch 18+ with an **exam choice where most users are adults**; build the age flag, behaviour switch and consent data model from day one; add a **parent-first family account** (parent signs up, verifies once, creates the child's profile) before May 2027 |
| Solo build effort 🔵 | High: parent accounts, verification vendor, linking, consent records, withdrawal, audit trail, notices, support for failures | Low: age question, block, class/exam cross-check | Low at launch; the consent flow is built once the product works |
| Drop-off for 16–17 | High ❓ | 100% (excluded) | Excluded at first, then parent-first flow |
| Legal risk | Low if done right; high if done badly | Low; main risk is minors lying about age (use class/exam signals) | Low |
| Effect on your first users | Can serve JEE/NEET from day one, slowly | Loses most JEE/NEET users | Start with exams whose candidates are mostly adults |
| Cost | ~₹3 per verified parent + vendor fees | ~0 | ~0 at launch |

⚠️ Superseded, see section 18: you chose to limit age (18+), not fields. The exam-based reasoning below is kept for the record.

🔵 **Why (c):** the users you can serve cleanly at launch are adults. UPSC Civil Services has a minimum age of **21** 🟡 and SSC exams mostly start at 18 🟡, so starting Aspirant mode with **UPSC/SSC/state PSC/banking** avoids the child-consent problem almost entirely. JEE/NEET (many 16–17) come next, through a parent-first family account. That's the lowest-friction verified route Rule 10 describes (a parent who is already a verified user). It also lets you prove the product before spending on verification.

### 17.5 Classification without transcripts

**What you can use legally at runtime** (all from `videos.list`/`channels.list`, 1 unit each, ✅ [video resource](https://developers.google.com/youtube/v3/docs/videos)):

| Signal | Value for "learning vs entertainment" (🔵) |
|---|---|
| Title | Strongest single text signal; noisy (clickbait, emoji, Hinglish) |
| Description (first ~500 chars) | Often has syllabus words, "Lecture 7", playlist links, book names |
| **Chapters** | Not an API field; parsed from timestamps in the description. Many lectures have them. A chapter list like "Fundamental Rights / Article 14 / Article 19" is a strong learning signal. |
| Channel name + channel description | Very strong; most channels are consistently one thing. Also enables channel-level decisions reused across all its videos. |
| `categoryId` | Weak (uploader-chosen) |
| `topicDetails.topicCategories` | Wikipedia topic URLs; coarse (e.g. "Knowledge", "Society") |
| Duration | Helps: 40-min+ videos lean lecture; ≤3 min may be a Short |
| `caption`, `defaultAudioLanguage` | Minor signals |
| `contentRating.ytRating = ytAgeRestricted`, `status.madeForKids`, `status.embeddable` | Safety and playability filters (17.7) |
| `liveBroadcastContent` | Separates "study with me" live streams |

**How accurate?** ❓ **I don't know, and I found no study measuring learning-vs-entertainment on Indian (Hindi/Hinglish) YouTube metadata.**
- Nearest evidence: title + description classifiers reached ~83–85% on multi-class YouTube categories (English, older data). 🟡 [ResearchGate](https://www.researchgate.net/publication/338942051_YouTube_Video_Classification_based_on_Title_and_Description_Text)
- 🔵 A two-way learning/entertainment decision should be easier than multi-class, and channel-level signals help a lot.
- 🔵 Where transcripts would have mattered most: videos with vague titles ("Must watch 😱", "Day 47"), podcasts that mix study advice and chat, movie reviews vs film-studies lectures, music theory vs songs.
- 🔵 Mitigation already in your design: curated channels skip the classifier; "unsure" is shown lower, not hidden; "Show" is one tap. Measure per language on a test set of IDs + your labels with titles fetched fresh (section 16).

**Can results come back in 1–2 seconds?** 🔵 Likely yes if the LLM is never on the critical path:
1. Cached search → instant.
2. Uncached: `search.list` + `videos.list` (two calls, each typically a few hundred ms ❓ measure) + a **small local classifier** (milliseconds on CPU for 25–50 titles).
3. Show results immediately. Videos the local model is unsure about are shown (rule 5) and sent to the LLM **in the background**; the answer improves the ranking on the next load (cached ≤ 30 days).
4. So the LLM's ~0.2–0.6 s first-token time never blocks the screen.

### 17.6 Related useful videos without `relatedToVideoId`

✅ `relatedToVideoId` was deprecated 12 June 2023 and unsupported from **7 August 2023**. [Revision history](https://developers.google.com/youtube/v3/revision_history)

**Options within the rules** (costs from the ✅ quota page):

| Source | How | Quota | Pros | Cons |
|---|---|---|---|---|
| **Same teacher's series** | `playlists.list` for the video's channel → find a playlist containing the current video → next items (`playlistItems.list`) | 1 unit per call | Best "what next" for lectures: the teacher's own order | Only works when the teacher uses playlists (most Indian lecture channels do 🔵) |
| **Links in the description** | Parse playlist/video links the uploader put in the description | 0 extra (already fetched) | The creator's own suggestions | Some links are promos |
| **Curated channels' recent uploads** | `playlistItems.list` on each curated channel's uploads playlist; match by topic words from the current title | 1 unit per 50 videos | Cheap, high quality, stays in your allow-list | Only covers curated channels; cache must respect the 30-day, "limited amounts" rule |
| **Keyword search** | `search.list` with key terms from title/chapters, `type=video`, `safeSearch=strict`, `relevanceLanguage` | Uses the 100/day search bucket | Finds things outside your lists | Scarce quota; share cached results across users |
| **Human syllabus map** | Curators map exam syllabus topics → recommended playlists/channels | 0 API cost | Most "on goal"; fits Aspirant mode | Curation work per exam |
| **Your own users' signals** | "People who marked X as studied also marked Y" (aggregated, from your data only) | 0 | Learns what actually helps | Needs users first. 🔵 For minors, showing an **aggregate from adults** based on the *current video* is contextual, not tracking the minor, but check with a lawyer. |
| `topicDetails` / `topicId` | Search by Freebase topic | search bucket | — | Too coarse to be useful here 🔵 |

**Policy points (🔵):**
- Keep this section **visibly separate and labelled** (e.g. "More on this topic"). III.C bars merging non-YouTube results into search results; these are YouTube videos, but separation keeps it clean and honest.
- Don't show your own scores or ranks as numbers (III.E.4.h); just order the list.
- This is also a strong "independent value" point for III.I.1: syllabus- and series-aware "what next" is something YouTube doesn't offer.

### 17.7 Content safety

**`safeSearch=strict`** ✅ [search.list docs](https://developers.google.com/youtube/v3/docs/search/list), verbatim: "YouTube will try to exclude all restricted content from the search result set. Based on their content, search results could be removed from search results or demoted in search results." (`moderate`, the default, "will filter content that is restricted in your locale".)
- 🔵 "Try to" = best effort, not a guarantee. It only applies to **`search.list`**, not to videos you get from playlists, channels or description links.
- ❓ YouTube doesn't publish exactly what "restricted content" includes. It's presumably tied to YouTube's Restricted Mode / age restriction, but I couldn't confirm the link officially.

**Age-restricted videos in the embedded player** ✅ [YouTube Help](https://support.google.com/youtube/answer/2802167?hl=en): "Age-restricted videos can't be watched on most third-party websites… These videos will redirect viewers back to YouTube when played." (Since Sept 2020 🟡 [9to5Google](https://9to5google.com/2020/09/22/youtube-age-restricted-videos/).)
- 🔵 That's a **dead end and an escape route** at once: the user taps play and lands on YouTube.
- ✅ You can detect these in advance: `contentDetails.contentRating.ytRating` = `ytAgeRestricted`. Also check `status.embeddable` (some videos block embedding) and `regionRestriction` (not viewable in India). [video resource](https://developers.google.com/youtube/v3/docs/videos)
- 🔵 Recommendation: drop age-restricted, non-embeddable and region-blocked videos from **every** list (search, feed, related), not only search. This removes a source of escapes and broken taps. Mention it in the "X results hidden" count so it stays transparent.

---

## Recommendations after round 4 (🔵 research conclusions, not a plan)

1. **Disclosure:** your two-line design meets the guide's "knowledge or consent" wording. Put the mode line on the mode-choice screen, and make "Show" reveal hidden results in place.
2. **Search quota:** design the app to work on default quota (curated feeds, shared cache, cheap "related"). Treat the compliance audit for more search quota as a normal pre-launch step, not a dependency.
3. **LLM:** an open-weight model on Groq or Fireworks with zero retention on. It's fast, needs no sales call, and the same model can later be self-hosted.
4. **Under-18s:** (⚠️ Superseded, see section 18: any field, 18+ only.) hybrid. Launch with adult-heavy exams (UPSC/SSC/state PSC/banking). Build the age flag and behaviour switch now. Add a parent-first family account for JEE/NEET before May 2027. Never use "deemed consent" as PW and Unacademy do.
5. **Classification:** metadata-only is workable but unmeasured. Keep the LLM off the critical path; the local model plus "unsure → show" keeps results within 1–2 s.
6. **Related videos:** teacher's own playlist series first, then description links, curated channels and syllabus maps; keyword search only when quota allows. Keep it a separate, labelled section.
7. **Safety:** `safeSearch=strict` on every search, plus filtering out age-restricted, non-embeddable and region-blocked videos everywhere.

## Open questions after round 4

1. **Quota audit:** do you accept applying for the standard compliance audit before launch (for more search quota), given the app must still work without it?
2. **First exams:** (⚠️ Superseded, see section 18: no fixed exam list.) are you OK starting Aspirant mode with UPSC/SSC/state PSC/banking (mostly adults), and bringing JEE/NEET in with the family account?
3. **Test budget:** to choose the LLM, we need to compare 2–3 open models (plus one closed model as a benchmark) on a Hinglish test set. Is a small test spend acceptable?

---

# Round 5 (2026-09-26)

## 18. Open goals, and cold start

### Your direction (recorded as given)

- **Quota:** you'll apply for the standard compliance audit before launch. The app must still work on default quota.
- **No fixed exam list.** The app should understand any goal typed in ("CS Professional ESG paper", "CMA Inter costing", "NEET biology") and build the feed itself with ML, training and algorithms.
- **Only three fixed rules sit above the "brain":** safety (no adult content), law (under-18 rules), and the mission.
- **Limit age, not fields:** any field at launch, accounts 18+ only. Under-18s later via the parent-first family account.
- **First test users:** CS (Company Secretary), CMA, NEET, AI.
- **Test budget** for comparing models on Hinglish titles: approved.

### 18.1 Checks on this direction

| Point | Finding | Label |
|---|---|---|
| "CS Professional ESG paper" | Real: "Environmental, Social and Governance (ESG) – Principles & Practice" is Paper 1 of the CS Professional Programme (ICSI Syllabus 2022). | ✅ [ICSI](https://www.icsi.edu/academic-portal/new-syllabus-2022/professional-programme/) |
| "CMA Inter costing" | Real: Paper 8 "Cost Accounting", CMA Intermediate (ICMAI Syllabus 2022). | ✅ [ICMAI P8 syllabus PDF](https://icmai.in/upload/Students/Syllabus2022/Inter/P8.pdf) |
| **NEET with an 18+ rule** | NEET's minimum age is **17**, and most first-time candidates are 17–18. An 18+ launch means NEET test users must be 18+ (droppers, repeaters). Expect many NEET sign-ups to be blocked or to lie about age. | 🟡 [Allen](https://allen.in/neet/eligibility-criteria), [Careers360](https://medicine.careers360.com/articles/neet-eligibility-criteria) |
| **"CS" is ambiguous** | Your own example: CS = Company Secretary *or* Computer Science. An open-goal system will meet this constantly (e.g. CA, CMA, PO, "AI"). | 🔵 |
| **Safety rule is narrow** | "No adult content" misses other harms an open-goal app will meet: self-harm, dangerous stunts, hate, **medical misinformation** (relevant to NEET), and India-specific **"paper leak" / "guaranteed questions" scam videos**. Pirated re-uploads of paid courses are a law issue too. | 🔵 |

🔵 **Suggestion for the three rules:** widen "safety" to *harmful content* (adult, self-harm, dangerous acts, hate, scams) and let the goal engine flag **minor signals** in the goal text ("Class 11", "boards 2027", "NEET 2028" by someone who'd be 16). Under your 18+ launch rule, that signal should trigger an age re-check, not silent acceptance.

### 18.2 How a general goal-understanding engine can work

Everything below works on your constraints: no YouTube data in training, labels made at request time, ≤ 30-day caches, default quota.

| Stage | What it does | Techniques | Evidence / label |
|---|---|---|---|
| **1. Understand the goal** | Turn free text into a structured goal: field, exam/body, level, paper/subject, language preference. Resolve ambiguity with **one tap** ("Company Secretary or Computer Science?"). | LLM parsing into a fixed schema; embeddings to match against goals other users already typed ("CMA Inter costing" = "CMA Intermediate Paper 8") | 🔵 |
| **2. Build a topic map** | A tree of topics for that goal: ESG → frameworks → BRSR → … | **Grounded** in the official syllabus when one exists (ICSI, ICMAI, NTA/NMC): fetch the syllabus document, let the LLM extract topics from it (retrieval-augmented, not from memory). For fields without a syllabus (e.g. "AI"), use the LLM's knowledge plus reputable open course outlines. | 🟡 LLMs asked to plan learning paths **without grounding** invent units and concepts; grounding in a knowledge space is how benchmarks prevent it. [PersonaPath](https://arxiv.org/html/2609.18861), [LearnLens](https://arxiv.org/html/2507.04295) |
| **3. Find sources** | Find channels and playlists that teach those topics. | (a) Ask the LLM for well-known channels/teachers in that field, then **verify each** with `channels.list` (1 unit); (b) a few broad `search.list` calls per goal; (c) keep channels whose recent uploads the classifier rates on-goal. | 🔵 (a) costs no search quota; LLM suggestions can be wrong or stale, which verification catches. |
| **4. Fill the feed cheaply** | Pull recent uploads and playlists of the found channels. | `playlistItems.list` (1 unit per 50 videos) and `playlists.list` from the 10,000 general units | ✅ quota costs, section 17.2 |
| **5. Match videos to topics** | Decide which topic each video covers and how relevant it is. | Multilingual embeddings (e.g. BGE-M3, multilingual-E5) comparing video metadata to topic text; LLM query expansion (HyDE / Query2Doc: write a "pseudo-description" of an ideal video per topic, match against real ones) | 🟡 HyDE/Query2Doc beat classic retrieval in zero-shot tests. [Survey](https://arxiv.org/pdf/2412.17558), [HyDE explainer](https://machinelearningplus.com/gen-ai/hypothetical-document-embedding-hyde-a-smarter-rag-method-to-search-documents/). ❓ No Hinglish code-mixed retrieval benchmark found; Hindi-only benchmark exists ([Hindi-BEIR](https://arxiv.org/pdf/2408.09437)). **Must test.** |
| **6. Apply the fixed rules** | Safety, law (age), mission. | `safeSearch=strict`, `ytAgeRestricted` / embeddable / region filters, content classifier, age flag | Section 17.7 |
| **7. Rank** | Order within what's allowed. | Under 18: settings + context only. 18+: add behaviour (notes, studied, finished, "I need this", mutes) | Sections 13, 16 |
| **8. Learn** | Improve the topic map and source list over time. | Signals **pooled across users with the same goal** (your data, not YouTube's); exploration via bandits | Section 18.3 |

**Two policy points on this design (🔵):**
- An **automatically built** "channel X is good for CMA costing" list is derived from classifying API data, the same III.E.4.h grey area as labels. Human-curated lists are cleaner. Safer versions: re-verify automated source lists at least every 30 days, and let **user signals** (your own data) carry most of the weight in keeping a source.
- The topic map, goal text and user signals are **your own data**, so they're free of the 30-day rule. Only the YouTube parts (IDs, titles, labels) need refreshing.

### 18.3 Cold start: fields with little data

Three kinds of cold start meet here: a **new goal** (nobody has typed it before), a **new user**, and a **new video/channel**.

| Technique | Solves | How | Evidence |
|---|---|---|---|
| **Official syllabus grounding** | New goal | Topic map from the exam body's document | 🔵; hallucination risk shown above |
| **LLM world knowledge** | New goal, new item | Zero-shot: the LLM proposes topics and candidate channels; recommendation cast as language reasoning | 🟡 2025 survey of LLM cold-start methods ([arXiv 2501.01945](https://arxiv.org/pdf/2501.01945)); ColdRAG combines knowledge graphs with retrieval-augmented LLMs ([arXiv 2505.20773](https://arxiv.org/html/2505.20773v2)); LLMTreeRec ([COLING 2025](https://aclanthology.org/2025.coling-main.59/)) |
| **Content-based matching** | New video | Embeddings + classifier on metadata; no watch history needed | 🔵 |
| **Pooling across users with the same goal** | New user | The 2nd CMA-costing user benefits from what the 1st marked as studied | 🔵 Your data only; for minors later, only aggregates applied by context |
| **Exploration (bandits)** | All three | Mostly show what's known to help, sometimes try a promising unknown source; learn from the result | ✅ Classic: LinUCB (Li et al., 2010); Thompson sampling handles uncertainty and priors naturally ([arXiv 1405.7544](https://arxiv.org/pdf/1405.7544)). 🟡 Recent work uses **LLM-derived priors** to start Thompson sampling in cold start ([arXiv 2608.03382](https://arxiv.org/pdf/2608.03382)). |
| **Early-feedback care** | New user | The first few recommendations shape whether a new user stays | 🟡 [ACM TORS](https://dl.acm.org/doi/10.1145/3554819) |

**Where this is weakest (🔵 and one 🟡):**
- **Niche Indian exams are exactly where LLM knowledge is thinnest.** One study questions whether LLM query-expansion gains come from real reasoning or from the model already "knowing" the answer ([arXiv 2504.14175](https://arxiv.org/html/2504.14175v1), 🟡). If so, gains shrink for CS/CMA topics the model barely saw. That's why syllabus grounding matters more than LLM memory.
- **Search quota vs many new goals.** If each brand-new goal needs ~5–10 searches to find sources, the 100/day bucket bootstraps only ~10–20 new goals a day. The LLM-suggests-channels route and pooling popular goals ease this; the audit fixes it at scale.
- **Hinglish.** Unknown until tested (18.4).

### 18.4 What your four test fields will stress

| Field | Syllabus to ground on | Likely difficulty (🔵) |
|---|---|---|
| **CS (Company Secretary)** | ICSI Syllabus 2022 ✅ | Fewer, smaller channels; legal jargon; Hinglish lectures; the "CS" ambiguity |
| **CMA** | ICMAI Syllabus 2022 ✅ | Overlaps heavily with CA content (cost accounting); must tell "useful CA video" from "off-goal" |
| **NEET** | NTA/NMC syllabus 🟡 | Huge content supply, lots of motivation/"topper" videos and Shorts; **age** (many under 18); medical-misinformation risk |
| **AI** | None official | Goal is vague ("AI" for what?); fast-changing; hype and "earn with AI" content; the goal parser must ask one clarifying tap (e.g. "Build ML models / Use AI tools / AI for exams") |

🔵 This mix is a good test: two niche syllabus fields, one huge crowded field, and one field with no syllabus.

### 18.5 Test plan inputs (research, not a plan)

For the approved model comparison, the research so far suggests measuring:
- **Per field and per language** (Hindi, English, Hinglish): on-goal precision of the feed, wrongly blocked, wrongly allowed.
- **Goal parsing:** does "CMA Inter costing" map to the right paper? Does "CS" trigger a clarifying tap?
- **Latency:** local model vs hosted open model (Groq/Fireworks) vs one closed benchmark model.
- **Data handling:** test set stored as video IDs + your labels; titles fetched fresh per run (section 16).

## Open questions after round 5

1. **Safety rule:** widen "no adult content" to harmful content in general (self-harm, dangerous acts, hate, scams like "paper leak")?
2. **Clarifying taps:** is **one** optional tap acceptable when a goal is ambiguous ("CS" → Company Secretary or Computer Science)? It's the one place "no extra work" may need an exception.
3. **NEET at 18+:** accept that NEET testing covers only 18+ users (mostly repeaters) until the family account exists?
4. **Automated source lists:** OK to keep them only as a refreshed (≤ 30-day), user-signal-backed layer, with human-curated lists as the stable base for your four test fields?

---

# Round 6 (2026-09-26)

## 19. Your round 5 answers (recorded as given)

1. **Safety widened** to all harmful content: adult content, self-harm, dangerous acts, hate, scams (e.g. "paper leak"), and medical misinformation.
2. **Clarifying taps only when the app can't work it out.** Use context first ("CS ESG paper" → Company Secretary, no question). When truly ambiguous, one tap like YouTube's "Did you mean", never a form.
3. **NEET testing is 18+ only** until the family account exists.
4. **Sources:** human-curated lists are the stable base for the four test fields, built with people who know each field. Automated source lists sit on top, refreshed within 30 days and backed by user signals. **Curated lists are seed data for the brain to learn from, not hardcoded logic.**

🔵 One note on point 4: if curated lists are used to *train* anything, store them as channel IDs plus your curators' judgements (your data), not as copies of YouTube titles or descriptions (section 16).

**Status:** research paused while you talk to real users. The summary is in [research-summary.md](research-summary.md).

---

# Housekeeping (2026-09-26)

- Marked every line a later round changed with "⚠️ Superseded, see section X". No decisions were changed.
- Fixed cross-references: in 17.2, "(17.7)" is now "(17.6)"; in 17.5, "(17.8)" is now "(17.7)".
- Re-verified two claims against primary sources:
  - Ariely & Wertenbroch (2002) retraction: now ✅, retracted 2 Sept 2026.
  - *one sec*: 36% / 37% confirmed, plus the 57% overall figure and the finding that the "option to dismiss" worked best.
- Added "Accessibility not yet revisited" and a "User interviews" template to [research-summary.md](research-summary.md).

# Corrections applied (2026-09-27)

Applied from the feasibility round ([feasibility.md](feasibility.md), "Corrections to research.md"). Each change is marked "⚠️ Corrected/Added/Updated 2026-09-27" where it sits.

- Sections 4 and 6: player links must open in the YouTube app, not the browser.
- Sections 15–19: note on the guide's "metrics" list and Policies III.L; the classifier risk is higher than stated.
- Section 16: NPTEL and MIT OCW are NonCommercial, so not training text for a paid app.
- Section 17.3: Groq's Llama models are enterprise-tier; GPT-OSS and Qwen stay self-serve.
- Sections 7, 11 and 17.4: children's duties start exactly 13 May 2027; "educational institution" is defined; Part B entry 6 exempts the age check.
- Section 7: DPDP has no "sensitive data" class (confirmed); CERT-In 6-hour reporting and 180-day in-India logs added.
- Section 3: NIOS has 270+ Class 10 ISL videos; IS 17802 reach updated for the draft RPwD Rules 2026.
- Section 2: YouTube's 0-minute Shorts limit confirmed. (`modestbranding`, deprecated with no effect since Aug 2023, isn't mentioned in this file.)
- Section 16: the guide says delete within 30 days; the binding Policies say 7. Follow 7.
