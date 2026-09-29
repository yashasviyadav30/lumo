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
