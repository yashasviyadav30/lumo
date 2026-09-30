# Ideas: what would make a student open this app instead of YouTube

Ideation round, 2026-09-29. No code. Everything here is a proposal to test, not a decision.

## What the first real user told us

My sister (CS Professional) tried the live app:
- It **doesn't feel different from YouTube.** With YouTube history turned off, YouTube also shows just a search bar, and YouTube's search gives better results.
- There's **no feature that would make her switch.**
- Her suggestion: **4 tabs like Instagram**: Home, Search, Library, and a **Personal** space. While watching a lecture she wants to **make notes and add links next to the video**. The Personal page holds her notes, links and study material.

**What this means.** We built a filter. A filter only removes things; it never adds a reason to come back. And search can't be our advantage, because our search *is* YouTube's search with things taken away. The reason to switch has to be something YouTube doesn't do at all: **what happens after you press play, and after the video ends.**

One line for the new direction: **YouTube is where lectures live. This app is where studying happens.**

### Why her search felt worse (worth fixing anyway)
- YouTube personalises results even with history off (location, language, what's trending). We send `relevanceLanguage=en` and `regionCode=IN`, which can shift results for Hindi-medium teachers.
- We show one page of 25 results. YouTube scrolls on and on.
- Strict safe search and our hiding remove a few results.
- Fix: send her exact words, pick the language from what she types, and offer "More results" (one more search call). But don't chase YouTube here; make Search the doorway into the study page.

## What the competition does (and misses)

| Product | Has | Misses |
|---|---|---|
| **YouTube** | Best search, chapters, Watch later, playlists; an AI "Ask" feature in some regions | No notes, no syllabus, no progress, no revision; built to keep you watching |
| **SyncStudy** | Playlist → course with progress, timestamp notes, daily planner, JEE/NEET/UPSC/CBSE syllabus templates; ₹99/month Pro | No CS/CMA; no recall or revision from your notes; no Hinglish goal understanding; you set everything up yourself |
| **StudyTube** | Distraction-free player, bookmarks, resume where you left off | No notes, no syllabus; advertises "no ads" (breaks YouTube's rules) |
| **LearnTube India** | Timestamp notes, AI doubt solver, quizzes | Coins for studying (close to III.F's ban on rewards for watching); only PW content; "100% ad-free" claim |
| **Notion / Google Docs / notebook** | Great notes | Notes live away from the video; timestamps copied by hand; no link back to the exact moment |
| **Anki** | Best spaced repetition | You write every card yourself, away from the lecture; hard on a phone |
| **YPT, Forest** | Timers, study groups, focus | Nothing to do with the lecture itself |

**The gap nobody fills:** one place where the lecture, *your* notes on it, your doubts, your syllabus progress and your revision all live together, understood by exam and paper (CS, CMA, NEET…), in Hindi, English or Hinglish.

## Rules that shape every idea

- **R7:** the player is never covered, changed or blocked. Notes sit **beside** the player (laptop) or **below** it (phone), never on top. We may *call* the player's own functions (`seekTo`, `getCurrentTime`, `pauseVideo`) from our own buttons; that's the IFrame API's normal use, and overlays for playback controls are only allowed if they don't sit on the player.
- **R1:** notes, links, doubts and progress are **our data** (kept while the account lives). They store the **video ID and a time in seconds**, never YouTube's title, description or thumbnail. Titles are re-fetched when shown (1 unit per 50 videos), or the user gives the lecture her own name.
- **R8:** no points, coins, or streaks for **watching**. Counting *study actions* (notes written, cards recalled) for her own diary is fine as long as nothing is a reward for viewing.
- **III.E.1:** we can't save frames, audio or transcripts of YouTube videos. Screenshots of the video are out; photos of her own notebook are fine.
- **R4:** the LLM may read **her own notes and text**, never YouTube data. Notes sent to the LLM need a line in the privacy notice.
- **Portability rule:** file uploads can't use Supabase Storage; use an S3-compatible store (e.g. Cloudflare R2's free tier, which speaks the S3 API) so it moves with us.

---

## The 4 tabs

The current tabs are Home, Search, Library, Settings. Her structure replaces Settings with **Personal** (Settings moves inside Personal, behind a profile icon).

| Tab | Job | Why it beats YouTube |
|---|---|---|
| **Home** | "What should I study right now?" Continue where I stopped, today's plan, notes due for revision, next lecture in my series. | YouTube's home asks "what will keep you watching?" Ours answers "what's next for *your* exam?" and it's the same screen every day, not a new temptation. |
| **Search** | YouTube search **plus my own notes** in one box ("Search YouTube · Search my notes"). | YouTube can't search what *you* wrote. Finding "that bit about Section 135 CSR" in your own notes is something only we can do. |
| **Library** | Lectures and playlists I saved, courses built from playlists, teachers I follow, my progress in each. | YouTube's Library is a list of videos. Ours is a list of *courses* with how far you've got. |
| **Personal** | My notes, links, material, doubts, revision, diary, exam dates. My study notebook. | YouTube has nothing like it. This is the tab that makes the app *hers*. |

---

## The ideas

Each idea: **what it is** · **why she'd switch** · **effort (solo)** · **rules**.

### A. The study page (watching a lecture)

**A1. Timestamp notes beside the player.** A notes box under the player (phone) or beside it (laptop). One tap on "+ Note" stamps the current second; typing a note pauses the video if she wants. Tap any note to jump to that moment.
- *Switch:* This is exactly what she asked for. YouTube has nothing like it; notebook notes don't jump back.
- *Effort:* Medium (player time sync, a sticky player on phone, offline save).
- *Rules:* ✅ R7 (below/beside, own buttons call `seekTo`/`pauseVideo`); ✅ R1 (video ID + seconds + her text).

**A2. Links and material on a lecture.** Attach links (ICSI study material PDF, a bare act section, a blog) and her own files to the lecture or to a single note.
- *Switch:* All her material for a lecture sits in one place instead of 5 apps.
- *Effort:* Low for links; Medium for file uploads (storage).
- *Rules:* ✅ Our data. Uploads need S3-compatible storage (portability rule) and a note in the privacy notice.

**A3. Photo of my notebook page.** Snap the page she wrote by hand and pin it to the moment in the lecture.
- *Switch:* Many Indian students write by hand; this links paper notes to the video.
- *Effort:* Medium (camera upload, image compression, storage).
- *Rules:* ✅ Her own photo. ❌ Never a screenshot of the video (III.E.1).

**A4. Doubt marker.** One tap: "I didn't get this." It saves the moment into a **Doubts** list; later she marks it solved and writes the answer.
- *Switch:* Doubts get lost today. A list of exact moments she didn't understand is gold before exams.
- *Effort:* Low (a note with a type).
- *Rules:* ✅.

**A5. Highlights.** Mark a stretch ("2:10–4:30 = definition of Secretarial Audit") as important. Revision later plays only the highlights by jumping between them.
- *Switch:* Re-watching a 3-hour marathon before exams is impossible; re-watching her 12 highlights is 20 minutes.
- *Effort:* Medium (start/end marks; jumping from one to the next with our own "Next highlight" button).
- *Rules:* ✅ Uses `seekTo` from our own button; the player isn't changed.

**A6. Chapters from the description.** Show the teacher's own chapter list (parsed from the description's timestamps) next to her notes. Plan step 7.5.
- *Switch:* Handy, but YouTube already shows chapters. Not a reason to switch alone.
- *Effort:* Low.
- *Rules:* ✅ Parsed when shown, not kept (R1).

**A7. Voice notes (Hindi or English).** Hold a button and speak; the phone types it (the browser's speech-to-text), stamped at the current second.
- *Switch:* Typing on a phone while watching is slow. Speaking a note is quick.
- *Effort:* Medium (browser support varies; iPhone Safari is weaker).
- *Rules:* ✅ Uses the phone's own speech typing; ask for microphone permission.

**A8. Resume exactly where I stopped.** Every lecture remembers the second she stopped, across phone and laptop.
- *Switch:* YouTube does this only when signed in with history on, which distracted students often turn off.
- *Effort:* Low.
- *Rules:* ✅ Video ID + seconds is our data. R14: skip for Made-for-Kids videos.

**A9. Keyboard-first on laptop.** `N` new note at this second, `D` doubt, `H` highlight, `Space` play/pause through our own button, `←/→` jump 10 s.
- *Switch:* Makes note-taking feel faster than a notebook for laptop users.
- *Effort:* Low.
- *Rules:* ✅ Through the IFrame API from our page, not over the player.

**A10. After-lecture "blurt".** When a lecture ends, an optional box: "Close your eyes. Write the 3 things you remember." Then it shows her notes to compare.
- *Switch:* The single most effective habit in learning research (active recall), made one tap.
- *Effort:* Low.
- *Rules:* ✅ Optional, never gates the next video (III.F.3).

### B. The Personal tab

**B1. My notebook.** All notes grouped by **exam → paper → topic** (from the topic map), then by lecture. Each note keeps its "jump to 12:34" link.
- *Switch:* Her notes finally have the same structure as her syllabus.
- *Effort:* Medium.
- *Rules:* ✅ Titles re-fetched or named by her (R1).

**B2. Search my notes.** Full-text search across everything she wrote, in Hindi, English or Hinglish.
- *Switch:* "Where did I write about XBRL?" answered in a second.
- *Effort:* Low (Postgres full-text search).
- *Rules:* ✅.

**B3. Study material shelf.** Per paper: ICSI modules, past papers, bare acts, her uploads, links. We can pre-fill **links** to the official ICSI and ICMAI pages (public links, not copies).
- *Switch:* "Everything for ESG in one place" is a real pain today (downloads folder chaos).
- *Effort:* Low for links; Medium with uploads.
- *Rules:* ✅ Links to public pages; uploads are hers. Don't host ICSI's PDFs ourselves (copyright).

**B4. Doubts board.** Every doubt marker from every lecture, open or solved, each with its jump link.
- *Switch:* A to-do list for understanding.
- *Effort:* Low (after A4).
- *Rules:* ✅.

**B5. Study diary.** Each day builds itself: lectures studied, notes written, doubts solved, plus one line she writes ("Finished CSR chapter, tired"). A calendar shows her weeks.
- *Switch:* Shows real progress, which fights the "I studied nothing" guilt from her original YouTube complaint.
- *Effort:* Low–Medium.
- *Rules:* ✅ Counts study actions, not watch time, and gives no rewards (R8). Forgiving weekly view, no fragile streak.

**B6. Export my notes.** One tap: a PDF or Word file per paper with notes, doubts and clickable "watch at 12:34" links. Share to WhatsApp.
- *Switch:* Printable revision notes before exams; shareable with friends.
- *Effort:* Low–Medium.
- *Rules:* ✅ Links point to youtube.com with a time; no YouTube data copied.

**B7. Exam dates.** She adds her exam date (CS Professional, Dec 2026); the app counts down and plans backwards (see C3).
- *Switch:* Makes the app about *her* deadline.
- *Effort:* Low.
- *Rules:* ✅.

### C. Syllabus, progress and planning

**C1. Syllabus map with my progress.** Each paper's topics (from the official syllabus) with her status: not started, watching, studied, revised ×2. She taps to change it; nothing is guessed from watching.
- *Switch:* The one view every aspirant draws by hand in a notebook, done for her.
- *Effort:* Medium (topic maps exist; needs the status UI).
- *Rules:* ✅ User-marked status. No rewards (R8).

**C2. Paste a playlist → a course.** Paste any YouTube playlist link (her favourite teacher's ESG playlist) and it becomes a course with progress, resume and notes per lecture.
- *Switch:* SyncStudy's best feature, plus our notes, syllabus and revision. Her own teachers, not ours.
- *Effort:* Medium (`playlistItems.list`, 1 unit per 50; store IDs only; refresh titles).
- *Rules:* ✅ IDs are our data; titles refreshed within 30 days (R1).

**C3. Exam-date plan.** From the exam date and the topics not yet studied, a simple weekly plan: "This week: 3 CSR lectures, revise Companies Act notes." She can edit it; it never locks anything.
- *Switch:* Turns "I have 70 days" into "today I do this".
- *Effort:* Medium (a simple planner, not AI).
- *Rules:* ✅ Suggestions only; never gates videos (III.F.3).

**C4. What next.** After a lecture: the next lecture in her playlist or teacher's series, or the next unstudied topic in her syllabus. Plan step 5.3.
- *Switch:* Replaces YouTube's "Up next" rabbit hole with the next useful thing.
- *Effort:* Low–Medium.
- *Rules:* ✅ Shown below the player, never over it. YouTube's own end screen still appears (R7).

**C5. Revision week mode.** In the last weeks before the exam, Home switches to revision: her highlights, her notes by paper, open doubts, and due recall questions. No new lectures unless she asks.
- *Switch:* Matches exactly how students study before exams.
- *Effort:* Medium (mostly reuses A5, B1, D1).
- *Rules:* ✅.

### D. Revision that uses how memory works

**D1. Questions from my own notes.** The LLM turns *her* notes into short recall questions ("What does Section 135 require?"), and she answers from memory before seeing her note. **Active recall.**
- *Switch:* Something no video app does: the lecture becomes a quiz, built from what *she* found important.
- *Effort:* Medium.
- *Rules:* ✅ R4: the LLM reads only her notes, never YouTube data. Add "notes sent to our AI provider (zero retention)" to the privacy notice. Label questions as generated; she can edit or delete them.

**D2. Spaced review ("Due today").** Each question comes back after 1 day, 3 days, 1 week, 1 month, sooner if she got it wrong. Home shows "5 due today" (FSRS or SM-2, the Anki methods).
- *Switch:* 5 minutes a day that she can feel working. This is what brings her back daily.
- *Effort:* Medium (the scheduling maths is small; habit-friendly UI matters).
- *Rules:* ✅ No streaks or points; a forgiving count ("You reviewed 32 this week").

**D3. Jump back to learn again.** A recall question she gets wrong offers "Watch this bit again", jumping to the second the note came from.
- *Switch:* Revision that goes straight back to the teacher's explanation. Unique to video plus notes.
- *Effort:* Low (after A1 and D1).
- *Rules:* ✅.

**D4. Blank-page test per topic.** "Write everything you know about CSR." Then show her notes and highlights side by side so she can see what she missed.
- *Switch:* The best exam-prep method for theory papers (CS is mostly theory).
- *Effort:* Low.
- *Rules:* ✅.

**D5. Previous-year questions per topic.** Link past ICSI/ICMAI questions to topics; tapping one shows her notes and the lecture moments on that topic.
- *Switch:* Connects "what will be asked" with "where I learned it".
- *Effort:* High (collecting and mapping questions; copyright of papers needs checking).
- *Rules:* ⚠️ Link to official PDFs rather than copying; check ICSI's terms.

### E. Different and a bit crazy

**E1. Study twin.** Pair with one friend preparing for the same exam: see each other's *study diary* (not watch history), send a "done for today" nudge.
- *Switch:* Accountability without a social feed.
- *Effort:* Medium–High.
- *Rules:* ⚠️ Sharing is opt-in only, 18+, privacy notice; no leaderboards.

**E2. Shared notes on a lecture.** Classmates can publish their notes on a popular lecture; others can copy them into their own notebook.
- *Switch:* Strong network effect for coaching batches.
- *Effort:* High (moderation, abuse, privacy).
- *Rules:* ⚠️ Moderation needed; our data only, never YouTube's.

**E3. Teacher kits.** A teacher (partner, deep layer) publishes a course: their playlist plus topic map plus key questions. Students follow it with one tap.
- *Switch:* The teacher she already trusts, organised.
- *Effort:* Medium (after C2).
- *Rules:* ✅ With the teacher's agreement.

**E4. AI study buddy on my notes.** Ask "Explain CSR in simple Hinglish using my notes"; the answer quotes her notes and gives jump links to the lecture.
- *Switch:* Feels like ChatGPT, but grounded in her own material.
- *Effort:* Medium.
- *Rules:* ✅ R4 (only her notes and question); ⚠️ can be wrong: label it and show her sources.

**E5. WhatsApp inbox.** Forward a link or voice note to the app's WhatsApp number and it lands in her Personal inbox.
- *Switch:* Indian students live in WhatsApp.
- *Effort:* High (WhatsApp Business API costs money).
- *Rules:* ⚠️ Costs money; later.

**E6. Focus session with a lecture.** "Study 45 min" mode: the lecture plus notes, the phone's other apps silenced (Android focus mode), a gentle end screen with the blurt (A10).
- *Switch:* Turns watching into a study session.
- *Effort:* Medium (the PWA can't block other apps; only a timer and a full-screen study page).
- *Rules:* ✅ A timer isn't a reward for watching; nothing locks the video.

**E7. Browser extension companion.** Take the same notes on youtube.com on a laptop; they sync to the app.
- *Switch:* Meets her where she already is.
- *Effort:* High, and a different product.
- *Rules:* ⚠️ YouTube's Terms on modifying the site (feasibility.md); later, if ever.

---

## Top 10: "makes her switch" vs effort

Switch score (1–5) is my judgement from her feedback: 5 = she asked for it, or it's something no other app does and she'd feel it daily. Effort is for a solo developer.

| Rank | Idea | Switch | Effort | Why this rank |
|---|---|---|---|---|
| 1 | **A1 Timestamp notes beside the player** (+ A8 resume, A9 shortcuts) | 5 | Medium | Her exact request; the core of "study companion" |
| 2 | **B1 + B2 Personal notebook, searchable** | 5 | Medium | Her exact request; makes the app *hers* |
| 3 | **A4 + B4 Doubt marker and doubts board** | 4 | Low | Tiny to build on top of A1, and nobody has it |
| 4 | **A2 + B3 Links and material per lecture and per paper** | 4 | Low (links) | Her request; ends "downloads folder chaos" |
| 5 | **D1 + D2 + D3 Recall questions from my notes, spaced review, jump back** | 5 | Medium | The daily reason to open the app; no video app does it |
| 6 | **C2 Paste a playlist → course with progress** | 4 | Medium | Her own teachers, organised; SyncStudy proves demand |
| 7 | **C1 Syllabus map with my progress** | 4 | Medium | The notebook page every aspirant draws by hand |
| 8 | **B6 Export notes to PDF with jump links** | 3 | Low–Medium | Exam-time printouts; WhatsApp sharing spreads the app |
| 9 | **A10 + D4 Blurt after a lecture, blank-page test** | 3 | Low | Cheap, strong learning effect; some students won't bother |
| 10 | **C3 + C5 Exam-date plan and revision week** | 4 | Medium | Strong near exams; needs 1, 5 and 7 first |

Just missing the list: A5 highlights (great, but more UI), A7 voice notes (phone-dependent), E4 AI buddy (after notes exist), A3 notebook photos (needs storage).

## Build these 3 first: "v2, study companion"

1. **The study page** (A1 + A4 + A2-links + A8 + A9). Player on top; below it (phone) or beside it (laptop): a notes box with "+ Note at 12:34", "Doubt", "Link", and the list of her notes for this lecture, each jumping back to its second. Resume where she stopped.
2. **The Personal tab** (B1 + B2 + B4 + B3-links). Her notebook by exam → paper → topic, search across all notes, the doubts board, and a material shelf of links. Settings moves here behind a profile icon. Tabs become **Home · Search · Library · Personal**, as she suggested.
3. **Revise from my notes** (D1 + D2 + D3). Home shows "5 questions due today" built from her own notes. A wrong answer offers "Watch this bit again".

**Why these three together:** 1 and 2 answer what she asked for in her own words. 3 gives her a reason to open the app *every day* even when she isn't watching anything new, which YouTube can't give her. Together they make a loop: **watch → note → revise → jump back to watch**.

**What it changes in the plan (proposal):** these are mostly plan Stage 7 (study tools) plus a new revision step, moved **before Test 1**. Her verdict says Test 1 would fail without them. Mute, Shorts and safety (6A) still come first, since they're small, and rotating the secrets (6.7) stays right before Test 1.

**Rule checks for the three:** notes, doubts, links and review items are our data holding video IDs and seconds only (R1). The notes panel is never over the player; our buttons use the IFrame API's `seekTo`, `getCurrentTime` and `pauseVideo` (R7). The LLM reads only her notes (R4), which the privacy notice must say. No streaks or rewards (R8). No resume tracking for Made-for-Kids videos (R14).

## 5 questions to ask my sister before building

Ask them without showing the answers you hope for. Better still, draw the study page on paper and let her react.

1. **"Show me the last lecture you studied. Where did your notes go, and what happened when you needed one of them later?"** (Tests A1 and B1: are notes a real pain, and on phone or laptop?)
2. **"If your notes sat under the video and tapping one jumped back to that exact moment, when would you actually use that jump?"** (Tests whether jump-back matters, or only writing notes.)
3. **"How did you revise for your last exam, day by day? Would 5 questions a day from your own notes help you, or feel like homework?"** (Tests D1 and D2, the daily-habit bet.)
4. **"What do you keep on your phone or laptop for CS Professional besides notes: PDFs, links, past papers, doubts? Where is it all now?"** (Tests the Personal tab, B3 and B4.)
5. **"Here are three things: notes beside the video, a personal notebook by paper, and daily questions from your notes. If you could have only one tomorrow, which? Which would make you open this instead of YouTube?"** (Forces a ranking; confirms or changes the build order.)

Tip: ask 2–3 of her classmates the same five questions. One user's answers are a hint; five users' answers are a pattern.

---

# Round 2: deep ideation (started 2026-09-29)

Goal: ideas so good that students leave YouTube for studying and open this app every day. Raw material from each step is saved in `docs/ideation/`; the results are summarised here.

**Progress** (updated after each step):
- [x] 1. User research: pain points with sources
- [x] 2. Diverge: 6 viewpoints × 20+ ideas (156 ideas)
- [x] 3. Converge: skeptic's verdicts
- [x] 4. The "only here" features and a day in my sister's life
- [ ] 5. Screens and HTML mockups (`docs/mockups/`)
- [ ] 6. Ranked top 10, build order, questions for real students

## 1. Pain points (user research)

Full tables with 66 pain points, every quote and its source URL: [research-aspirants.md](ideation/research-aspirants.md) (CS, CMA, CA, NEET, JEE, UPSC) and [research-apps-college.md](ideation/research-apps-college.md) (college students and app reviews). Reddit, Quora and Medium refused automated access, so quotes come mainly from Careers360, Play Store reviews, blogs and search snippets (labelled ✅ read / 🟡 snippet in those files). First-person CS and CMA complaints are rare online, so my sister and her classmates are the best source for those two.

### What students say

| # | Pain | Example quote | Groups |
|---|---|---|---|
| 1 | **The phone is both classroom and trap.** Many have no laptop. | "I need my phone to study but it also distracts me" | All |
| 2 | **Watching feels like studying but doesn't stick.** | "I forget all the concepts and formulae the next day" | All |
| 3 | **Too many teachers, batches and playlists to choose from.** | "a lot of videos of PW of different batches of the same teacher so I'm always confused" | NEET, JEE, CA, CMA, UPSC |
| 4 | **Notes from video are slow.** | "how to write notes faster while watching lectures???" | All |
| 5 | **Loneliness and guilt, often at night.** | "How do I take out my emotions when I have nobody to talk to?" | All |
| 6 | **Long lectures pile into backlogs; marathons and one-shots are the escape.** | "Can I clear the CA inter by only marathon lectures?" | CA, CS, CMA, NEET, JEE |
| 7 | **Doubts have nowhere to go.** | "It is not always possible to clear doubts in class." · "nobody … bothers to respond to the questions asked!" | All |
| 8 | **Outdated lectures** after law amendments or syllabus cuts. | "my module is not the latest one" | CA, CS, CMA, NEET |
| 9 | **Lectures but no course:** no practice, no plan. | "I have no any source to do practice" | JEE, NEET, UPSC |
| 10 | **Money pushes students to YouTube; Telegram fills gaps**, often with pirated batches. | "financially very weak" | All |
| 11 | **Timestamps in long lectures are a daily need.** | "Comment section is very important for time stamps in a 7 hour long video." | College, CA, CS |
| 12 | **Losing study records makes people furious.** | "I cant just lose it all" (YPT review, 821 upvotes) | All |
| 13 | **Many want to study on a laptop, not a phone.** | "cant study for long hours on a mobile phone" | College, CA |
| 14 | **Studying with others helps; paying for it is resented.** | "how can mere students afford to pay inorder to not be alone while studying?" | All |

### What this changes

- **A competitor already does "notes beside any YouTube lecture".** PW's **Pi Lens** (100,000+ installs, 4.58★): "No need to switch tabs anymore." My sister's idea is validated but not new. Its loved features (summaries and quizzes "auto-generated from the video") are exactly what our rules forbid (R4). So our edge has to be **what the student herself writes and does**: her notes, doubts, mistakes, revision, and the people she studies with.
- **SyncStudy** is the closest twin (playlist → course, timestamp notes); its free tier stops at 3 playlists, and it has no CS or CMA.
- **Hiding distractions is not a pitch.** Unhook does it free, and StudyTube's ad-free playback can't be copied under our rules.
- **Choice overload (pain 3) can't be solved by our AI judging videos (R3).** Help has to come from people (teachers, peers, toppers, the user's own lists).
- Pains that fit our rules best: **2 (doesn't stick), 4 (notes are slow), 5 (lonely), 7 (doubts), 11 (timestamps), 12 (never lose records)**.

## 2. All ideas (diverge)

Six viewpoints, 156 raw ideas in total (plus the contrarian's 7 critiques of the current app, which the skeptic also judged). Each file has every idea with what it is, the pain it solves, why she'd switch, effort and a rule check.

| Viewpoint | Ideas | File | Their top 3 |
|---|---|---|---|
| Struggling aspirant alone at night | 25 | [ideas-night-aspirant.md](ideation/ideas-night-aspirant.md) | Swipe her own notes Shorts-style (NIGHT-07) · "Tonight's one step" with an energy check (01, 02) · Park the doubt in a silent night room with other CS aspirants (15, 11) |
| Topper with a strong system | 26 | [ideas-topper.md](ideation/ideas-topper.md) | R1-R2-R3 revision tracker with colours and a countdown (02, 12, 17) · Mistakes notebook with re-attempt dates (03) · A 21-day bootcamp that installs the system (19) |
| Teacher on YouTube | 25 | [ideas-teacher.md](ideation/ideas-teacher.md) | Amendment pins and the teacher's own timestamp map (05, 01) · Doubt heatmap and a weekly answer loop (08, 09) · "Open in FocusLearn" link with the notes PDF (14, 02) |
| Cognitive scientist | 29 | [ideas-cognitive-scientist.md](ideation/ideas-cognitive-scientist.md) | A lecture that asks you back: predict, checkpoints, "you were away, rewind?" (01, 02, 18) · Test before you rewatch, then replay only the miss (05, 04) · Cards that retire, and a "known, not watched" meter (07, 27) |
| Product designer | 26 | [ideas-designer.md](ideation/ideas-designer.md) | Study Stories (05) · Doubt card for WhatsApp (07) · Thumb bar, mark now and write later (03, 04) |
| Contrarian | 25 ideas + 7 critiques | [ideas-contrarian.md](ideation/ideas-contrarian.md) | Nightly check-in in a pod of five (01, 02) · A daily previous-year question written by hand (04) · Share-to-study from the YouTube app (03) |

**Most surprising ideas, one per viewpoint:**
- A weekly progress card she can send her family on WhatsApp, turning "on the phone all night" into proof of study (NIGHT-13).
- A capture inbox that deletes what she hoards after 14 days, replacing Telegram Saved Messages (TOPPER-09).
- Notes PDFs stamped with each student's name, so teachers trust us with notes they keep off Telegram (TEACH-16).
- "Bedtime 5, morning 5": sleeping between two short reviews halved the practice needed to relearn (Mazza et al. 2016) (SCI-20).
- Build nothing for a month: run the check-in and daily question by hand in a Telegram group, and code only what students still use in week four (CONTRA-24).

**Where viewpoints agree without being told to** (a strong signal):
- **Swiping through your own material** instead of Shorts: night aspirant, designer, cognitive scientist.
- **Doubts pinned to the exact second, shared with a friend or teacher:** night aspirant, teacher, designer.
- **Accountability and company rather than more content:** night aspirant, contrarian, topper.
- **Testing yourself before rewatching:** cognitive scientist, topper.
- **Working alongside YouTube** (share a video into the app) rather than replacing it: contrarian, and round 1's companion idea.

## 3. The skeptic's verdicts (converge)

A separate skeptic tested every idea against five questions: would a real student switch for it, is it just a nicer YouTube, does another app already do it, does it break a rule, can one developer build it? Full table (all 163 rows, merged ideas, rule traps): [skeptic-verdicts.md](ideation/skeptic-verdicts.md).

**Result:** 32 ideas killed, the rest merged into **28 ideas (M-01 to M-28)**. Switch score is the skeptic's judgement (5 = she'd open it daily and nothing else does it).

| Merged idea | What it is | Switch | Effort |
|---|---|---|---|
| M-01 One-tap capture bar | Mark · Doubt · ★ · −10 s under the player; fill in the marks later | 3 | Medium |
| M-02 Swipe my own cards | Shorts-style feed of cards made from *her* notes, with "watch this bit" | 4 | Medium |
| M-03 Test before rewatch, replay only the miss | 60 s recall first; a missed card replays just that stretch of the lecture | 3 (4 near exams) | Low after M-01, M-02 |
| M-04 One card a day at her hour | A daily push holding one of her cards | 3 | Medium |
| M-05 Doubts pinned to the second, answered by a friend | Doubt → WhatsApp link → friend answers at that moment | 3 | Low–Medium |
| M-06 Mistake book | Log each wrong answer; it comes back at 3, 10, 30 days | 3 | Low–Medium |
| M-07 PYQ answer-writing drill | Timed past-paper question, written on paper, checked against her notes | 4 | Medium + content |
| M-08 Revision tracker on the syllabus | R1/R2/R3 per official topic, red/amber/green, pace line | 3 | Medium |
| M-09 Exam countdown mode | Home changes at T-30, T-15, T-3, T-1 | 3 | Medium |
| M-10 Home opens on one thing to do | "Resume Sec 135 at 42:10" or "4 cards · 2 min"; restart after a gap, no guilt | 3 | Low |
| M-11 Backlog triage by swipe | Must watch / 2x / skip, then "11 days at your pace" | 3 | Medium |
| M-12 Accountability pod | 3–5 friends on the same paper, one-line nightly check-in | 4 with friends, 1 empty | Medium |
| M-13 Silent study room | "23 CS aspirants studying now" | 2 | Medium |
| M-14 Weekly share card | Edited summary she can forward to family or pod | 2 | Low |
| M-15 Amendment tracker (CS, CMA, CA) | Amendments that apply to her attempt; lectures "uploaded before" a cut-off | 3 | Low code, ongoing curation |
| M-16 Teacher class kit | A teacher shares one link: ordered lectures, chapter times, notes PDF, questions | 5 if her teacher does it | High (mostly sales) |
| M-17 Teacher feedback loop | Aggregated doubts per lecture for the teacher | 2 | Medium |
| M-18 Share-to-study from the YouTube app | Share a lecture from YouTube into our inbox (Android) | 3 | Low–Medium |
| M-19 Records you can't lose | Sync tick, backup time, export to PDF/Markdown/CSV | 2 | Low–Medium |
| M-20 Lite and offline | Cards and notes work with no data | 2 | Medium |
| M-21 Sunday mirror | One weekly screen of what she did | 2 | Low–Medium |
| M-22 A lecture that asks you back | Predict button, checkpoints (parked: adds effort to the easy part) | 1 | Low |
| M-23 Explain it back | LLM compares her explanation with her notes | 2 | Medium |
| M-24 Hinglish and Hindi UI | "Samajh nahi aaya", "Phir se" | 2 | Low–Medium |
| M-25 Personal notebook and shelf | The Personal tab she asked for | 3 | Medium |
| M-26 Hand-run pilot | 4 weeks in a Telegram group before more code | n/a | Low code |
| M-27 My course: one playlist per paper | Paste a playlist, get a course | 2 | Medium |
| M-28 Chapter map for long lectures | Teacher's, hers, and agreed student maps | 2 | Medium |

**Rule traps the personas missed** (14 found; the worst):
- **Timed auto-pauses** by our code look like changing playback (R7). Use the embed's `start`/`end` for replay windows; everything else starts from her tap.
- **Channel-scoped search** burns the 100 daily searches. Use a teacher's playlist (`playlistItems`, cheap).
- **Bot and server logs would capture pasted YouTube links** (R11). Strip URLs before logging.
- **Suggesting a topic from a shared video's title** is judging a video (R3). She picks the topic.
- **An open answer page** stores text from people who never ticked 18+ (R10). Tick before storing.
- **A live count of people watching one lecture** is a derived metric about YouTube content ❓. Count per paper, never per video.
- **A recall card during the ad** pulls attention from YouTube's ad. Killed.
- **Chrome's speech-to-text sends audio to Google** 🟡. Voice is optional, off by default, and in the privacy notice.

### The uncomfortable truths

1. **Nothing makes her *leave* YouTube.** The lectures stay on YouTube, ads play, and the player's links open YouTube. The honest goal is to be where she goes **before and after** a lecture: revision, doubts, check-ins. Measure daily revision opens, not "switched from YouTube".
2. **"Notes beside the video" is table stakes.** Pi Lens and SyncStudy have it, and Pi Lens fills its panel from the video, which we can't. Our defensible edges are slow: months of her own notes, CS/CMA specifics, and people.
3. **Almost everything depends on her writing notes, and slow notes are a top pain.** No notes, no cards, no replay, no doubts board. Test with 5 students before building the revision stack.
4. **Social features die without people.** A pod of strangers needs hundreds of users on the same paper. Start with friends she already has, or don't build it.
5. **The biggest growth lever is a teacher, and none has been asked.** One conversation with a mid-size CS/CMA teacher is worth more than a month of code.
6. **The evidence is thin.** One real user, no Reddit, almost no first-person CS/CMA quotes, and the personas graded their own ideas. Pilot before building.

## 4. The "only here" features

The skeptic is right that nothing makes her *leave* YouTube: the lectures, the ads and the player's links stay YouTube's. So the target is narrower and more honest: **the place she goes before and after a lecture, and the place she can't revise without.** Three features, together, do what no other app does.

### Only here #1: Lectures that come back to you ("Watch once. Remember it.")

**What it is.** While she watches, one thumb bar under the player: **Mark · Doubt · ★ · −10s**. Marks are one tap and empty; at a pause she fills them in (the app replays 10 seconds around each). Long-pressing a word in a note turns it into a card. Every card remembers the second it came from. At night she swipes through her own cards, Shorts-style. **If she forgets one, "Watch this bit" replays only that 90 seconds of the lecture**, then asks the card again. Before re-watching a whole lecture, the app offers "60 seconds first: what do you remember?" and then replays only the parts she missed.

**Why only here.** It needs two things at once: *her* timestamped notes (our data) and the lecture in the same app.
- **YouTube** can only replay the whole video, and has no notes.
- **Anki** has cards but no lecture to go back to.
- **SyncStudy** has notes beside videos but no recall.
- **Pi Lens** makes flashcards from the video by AI (which our rules ban), so they're the AI's idea of important, not hers, and it can't send her back to the moment she herself marked.

**Merged ideas:** M-01, M-02, M-03, M-04, M-10. Switch power: the daily reason to open the app even on days she watches nothing.

### Only here #2: Doubts that get answered, at the exact second

**What it is.** "Doubt" saves the second and one line, says "Parked, keep going", and the lecture continues. Her Doubts board lists open and solved ones. Any doubt becomes a WhatsApp link: her friend opens a page that plays the official player **at that exact second** with a box to answer. The answer lands on her doubt. Later, her accountability pod (3–5 friends on the same paper) sees a one-line nightly check-in, and a teacher who joins sees the most-asked doubts per lecture.

**Why only here.** YouTube comments bury questions and have no timestamp link back to your own list. WhatsApp has the friends but not the moment in the lecture or a board. Nobody links a doubt to a second, a friend and a to-do list.

**Merged ideas:** M-05, M-12, later M-16 and M-17. Switch power: it brings people; every shared doubt brings a classmate into the app.

### Only here #3: Made for my attempt (CS, CMA, CA)

**What it is.** Her paper's official topics as a tracker: R1/R2/R3 ticks with dates, red/amber/green after each revision, and a pace line ("R2 needs 4 chapters a week; you did 2"). An **amendment list for her attempt** (Dec 2026), each item linked to the official notice; a lecture uploaded before a cut-off date says so plainly ("uploaded before the Mar 2025 amendment; check the list"). A **past-paper writing drill**: a real ICSI question, a timer, she writes on paper, snaps it, and sees her own notes on that chapter beside her answer. In the last month, Home switches to exam mode (T-30, T-15, T-3, T-1).

**Why only here.** YouTube never tells her a lecture predates the law she'll be tested on. SyncStudy and Pi Lens cover JEE, NEET and school, not CS or CMA. Coaching test series cost money.

**Merged ideas:** M-07, M-08, M-09, M-15. Switch power: trust. "This app knows my exam."

### A day in my sister's life (CS Professional, December 2026 attempt)

- **7:50 am.** One notification: *"Which companies must spend 2% on CSR?"* It's one of her own cards, from ESG lecture 4. She answers from the lock screen. 10 seconds.
- **4:00 pm.** She opens the app. Home doesn't show a search bar. It shows one thing: **"Resume ESG · Lecture 6 at 42:10"**, and below it "5 cards due · Riya answered your doubt".
- **4:05–5:10 pm.** She watches lecture 6. The player looks and works exactly like YouTube's (it *is* YouTube's). She taps **Mark** six times and **Doubt** once, without pausing. At the break, a tray asks *"6 marks: fill them in?"* Each replays 10 seconds; she types a line ("Sec 135(5): 2% of avg net profit, 3 yrs"). She long-presses "2%" to make a card.
- **5:12 pm.** Her doubt ("Is a Section 8 company covered?") goes to her pod's WhatsApp group as a link. Riya taps it, the lecture opens at 51:30, and she types the answer. It lands on the doubt.
- **9:30 pm.** The pod's check-in: *"What did you study today?"* She writes one line; she sees two friends done, one "rest". Nobody is ranked.
- **11:40 pm.** Too tired for a lecture. Home offers **"Too tired? 5 cards instead."** She swipes. She forgets one card, taps **"Watch this bit"**, and the lecture plays 42:10–43:40 (90 seconds, not 2 hours). The card comes back; she gets it.
- **Sunday.** The tracker shows ESG chapters 1–4: R1 done, two green, two amber. The amendment list has two new MCA notifications for her attempt; a 2024 lecture she saved says *"uploaded before the Mar 2025 amendment."* She does one past-paper question: Dec 2025, Q3, 5 marks, written by hand in 9 minutes, then compared with her own notes.
- **November (T-15).** Home switches to "reds only": her amber and red chapters, her mistakes and her hardest cards. The day before the exam, a one-page hall sheet per paper, built from her ★ notes.

**Why she can't study without it by November:** six months of her own marks, cards and doubts, each tied to the second she learned it. That's the switching cost no competitor can copy, and it only exists because she built it here.

**What stays YouTube's:** finding new lectures, the lectures themselves, ads and recommendations. That's fine; we're the notebook and the revision, not the TV.
