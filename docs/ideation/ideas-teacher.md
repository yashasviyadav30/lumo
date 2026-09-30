# Ideas from the teacher's side (round 2, step 2)

Persona: a CS/CMA/CA (or NEET) teacher with about 200k subscribers. Free lectures on YouTube, a paid batch on the side, notes on Telegram. Date: 2026-09-29.

## How I see the problem

My comment section is a help desk. Every long lecture gets "sir timestamps please", "notes PDF kab milega?" and the same doubt forty times. I post notes on Telegram, and within a week my paid batch notes are on a pirate channel next to them. YouTube Studio tells me where viewers drop off, but not *why*: I can't see which minute confused them, which chapter they skipped, or whether anyone who finished my playlist passed. I'd tell students to use an app only if it takes work off me, puts my notes and my order in front of them, keeps my name on my material, and shows me (in aggregate) where they struggle. It must cost me nothing and look nothing like a rival coaching app that will poach my students.

Labels: ✅ read in a primary source, 🟡 secondary or from memory, 🔵 my reasoning, ❓ unknown. Pain names refer to `research-aspirants.md` (A-row) and `research-apps-college.md` (C-row).

**Build note on round 1:** idea E3 "Teacher kits" was one line. Most ideas below are the pieces that make a teacher actually say yes to E3: what they give, what they get back, and how students arrive.

---

## Part 1: what the teacher gives, and why it helps students daily

### TEACH-01. Official timestamp map (teacher-owned chapters)
- **What:** The teacher (or their assistant) pastes or types a topic list with times once per lecture in a small dashboard. Students see it beside the player as tappable syllabus topics ("Sec 135 CSR · 42:10"), linked to our syllabus chips, and their own notes slot under each topic.
- **Pain it solves:** "Comment section is very important for time stamps in a 7 hour long video" (C-3); "Rewatching a whole lecture to find one part" (C-25).
- **Why she'd switch from YouTube:** YouTube chapters stop at a title; here each chapter is tied to her syllabus, her notes and her revision, and it exists even where the teacher never wrote chapters in the description.
- **Effort (solo dev):** Low–Medium. One table (video ID, seconds, label, topic ID) and a paste box that parses "mm:ss label" lines.
- **Rules:** ⚠️ fits with care. The labels are the teacher's own data given to us directly under the partner licence, not YouTube data, so R1's 30 days doesn't bind them 🔵. Don't scrape the description for this; the teacher pastes it. R3 is fine: a human owner labels the video, our AI doesn't.

### TEACH-02. Notes PDF shelf beside the lecture (the Telegram replacement)
- **What:** The teacher uploads the notes PDF and DPP/question sheet for each lecture once. Students see "Sir's notes for this lecture" beside the player, open them, and pin their own notes to pages.
- **Pain it solves:** Telegram hoarding ("keep collecting material without studying it", A-39); notes come from Telegram and copying is slow (A-8, A-9).
- **Why she'd switch from YouTube:** No more hunting a Telegram channel for "Lecture 14 notes.pdf"; the right PDF is already next to the right lecture.
- **Effort (solo dev):** Medium. File storage on R2 free tier (portability rule), a PDF viewer, an upload form.
- **Rules:** ✅ fits. Teacher's own files under licence. Not YouTube content.

### TEACH-03. Teacher's recall questions at timestamps
- **What:** The teacher adds 3–5 short questions per lecture, each tied to the second where the answer is taught. They join the student's spaced review (round 1 D2) next to questions made from her own notes. Wrong answer → "Watch sir explain it again at 42:10".
- **Pain it solves:** "I have no any source to do practice" (A-17); "I forget all the concepts ... the next day" (A-13).
- **Why she'd switch from YouTube:** Pi Lens gives AI questions from the video; this gives questions *from the teacher himself*, which students trust more and which we're allowed to use.
- **Effort (solo dev):** Low once D1/D2 exist. Same question table, with an author field.
- **Rules:** ✅ fits. Human-written by the owner, no AI on the video (R3, R4).

### TEACH-04. "Watch in this order" paths (which batch, which playlist)
- **What:** The teacher publishes ordered paths: "CMA Inter Costing, new syllabus, Dec 2026 attempt: these 48 lectures in this order", plus "if you're 3 weeks from exam: these 12". Old batches are marked "superseded by…" by the teacher.
- **Pain it solves:** "a lot of videos of PW of different batches of the same teacher so I'm always confused" (A-18); lecture backlogs (A-7).
- **Why she'd switch from YouTube:** On YouTube, three batches of the same teacher look the same. Here the teacher tells her which one is current and what to skip.
- **Effort (solo dev):** Medium. Builds on C2 (playlist → course); a path is a list of video IDs and notes.
- **Rules:** ✅ fits. Video IDs are our data; the order is the teacher's. Titles re-fetched when shown (R1).

### TEACH-05. Amendment and errata pins
- **What:** The teacher marks a stretch of an older lecture: "22:00–31:40 outdated after the April 2026 amendment. See the 6-minute update here." The pin shows beside the player when she reaches that time and in her notebook on that topic.
- **Pain it solves:** "my module is not the latest one so what should I do for the amendment parts" (A-24); "Up to what date's amendments are applicable" (A-25); NEET dropped chapters (A-26).
- **Why she'd switch from YouTube:** YouTube will happily play a lecture on repealed law with no warning. This is the one thing a law-exam student can't get anywhere else.
- **Effort (solo dev):** Low. A timed note with a link, authored by the teacher, shown when `getCurrentTime` passes the start.
- **Rules:** ✅ fits. Shown beside or below, never over the player (R7). Pausing is her choice, not automatic.

### TEACH-06. Search inside the teacher's lectures (licensed transcripts)
- **What:** For partner teachers who send us their own caption files (or authorise us through their own YouTube account), students can search "where did sir explain deferred tax?" across the whole course and jump to the second.
- **Pain it solves:** "Rewatching a whole lecture to find one part" (C-25); searching takes study time (A-22).
- **Why she'd switch from YouTube:** YouTube's transcript panel searches one video at a time; this searches the whole 120-lecture course at once.
- **Effort (solo dev):** Medium. Caption files → Postgres full-text search with timestamps. Owner OAuth for `captions.download` adds work 🟡 (the API gives captions only to the video owner).
- **Rules:** ⚠️ fits with care. Transcripts only under a signed licence (shared brief). R4 says the LLM never reads YouTube transcripts: keep this plain text search, no LLM, until the licence and a rule update say otherwise.

### TEACH-07. Hinglish and Hindi topic labels from the teacher
- **What:** The teacher labels topics in the words they use in class ("Marginal costing wala chapter", "CSR ka 2% rule"). Students search in those words and find the right lecture moment.
- **Pain it solves:** Hindi-medium students left out (C-22); our search felt worse than YouTube's (sister).
- **Why she'd switch from YouTube:** She searches the way her teacher talks and lands on the exact minute, not on 25 look-alike videos.
- **Effort (solo dev):** Low. Extra label field; include in search.
- **Rules:** ✅ fits.

---

## Part 2: what the teacher gets back (aggregated, privacy-safe)

### TEACH-08. Doubt heatmap on each lecture
- **What:** Students tap "Didn't get this" (round 1 A4) as usual. The teacher sees, per lecture, a strip showing where doubts cluster: "41 students marked doubts between 38:00 and 41:30". No names, no student text unless the student chooses to share it.
- **Pain it solves:** Doubts have no home (A-29, A-30); "nobody ... bothers to respond to the questions asked" (C-10).
- **Why she'd switch from YouTube:** Her doubt lands somewhere the teacher actually looks, which a YouTube comment under 3,000 others never does.
- **Effort (solo dev):** Medium. Bucket doubts per 30 s; a simple bar chart in the teacher view.
- **Rules:** ⚠️ fits with care. Show a bucket only when 10+ distinct students are in it (k-anonymity 🔵). Consent line at sign-up and on first doubt; DPDP Act consent applies 🟡. R11: this lives in the database, not in logs.

### TEACH-09. Weekly "top 5 doubts" answer loop 🌶
- **What:** Each week the teacher gets the five most-shared doubts (only those students chose to share, in their words, grouped by the LLM from *student text only*). The teacher records one short YouTube video answering them. We then pin each answer to the exact second each student's doubt came from, and tell those students "Sir answered your doubt".
- **Pain it solves:** Doubts have no home (A-29, A-30); loneliness (A-32).
- **Why she'd switch from YouTube:** Her doubt gets a real answer from her own teacher, delivered back to the moment she was stuck. That's a coaching-class feature for free.
- **Effort (solo dev):** Medium. Grouping, a teacher inbox, a notification.
- **Rules:** ⚠️ fits with care. R4: the LLM groups *students' own words*, never the video. The answer video is a normal YouTube video; linking it is fine. Students opt in per doubt.

### TEACH-10. "Where students stop" in syllabus terms
- **What:** YouTube Studio shows drop-off by minute. We show it by syllabus: "Of 2,300 students following your Costing path, 60% marked Chapter 6 done, 18% marked Chapter 9 done." Based on what students *mark*, not on watch time.
- **Pain it solves:** Backlogs (A-7) seen from the teacher side: the teacher can post a catch-up plan where the drop is.
- **Why she'd switch from YouTube:** Indirect: her teacher starts saying "I saw most of you are stuck at Chapter 9, here's a shortcut", because of this app.
- **Effort (solo dev):** Low–Medium. Counts over user-marked topic status (round 1 C1).
- **Rules:** ✅ fits. User-marked, aggregated with a minimum group size. Never tied to watching, so no R8 issue. R10: only 18+ accounts, so no minors' behaviour used.

### TEACH-11. Pass-rate proof 🌶
- **What:** After results day, students can tell us "passed / not yet" for their attempt. Teachers see: "Of 412 students who followed your path and reported, 71% passed." Teachers can publish that number on their channel with a link to the app.
- **Pain it solves:** Choice overload over teachers: "Which is the best teacher for CMA Inter FM among all?" (A-21); "so many courses for the very same subject" (C-21).
- **Why she'd switch from YouTube:** She can see honest, student-reported results before picking a teacher, which no channel or ad gives her.
- **Effort (solo dev):** Low to build; High to make honest (self-report bias, small samples, teachers gaming it).
- **Rules:** ⚠️ fits with care. Show only with a large sample and a plain "self-reported, not verified" label. No ranking of teachers by our AI (R3 is about videos, but the spirit applies 🔵). Opt-in per student.

### TEACH-12. Private cohort by class code
- **What:** The teacher says in a video "join my free Dec 2026 batch in FocusLearn with code COST26". Students who join get the teacher's path, notes and questions; the teacher sees cohort-level progress and doubts. Students can leave any time.
- **Pain it solves:** No study group at home (A-31, A-33); "Which lectures should I watch of that teacher" (A-18).
- **Why she'd switch from YouTube:** She's in her teacher's batch with 3,000 others working through the same plan this week, not alone with a playlist.
- **Effort (solo dev):** Medium. Cohort table, join codes, teacher view.
- **Rules:** ⚠️ fits with care. 18+ only (R10) is a real limit for NEET teachers: most droppers are 18+, but many Class 12 students aren't. Say so to NEET teachers up front.

### TEACH-13. Monday letter to the teacher
- **What:** An automatic weekly email: new students, topics most marked done, doubt hotspots, open amendment pins, one suggestion ("Chapter 9 has 3x the doubts of any other; a 10-minute recap may help").
- **Pain it solves:** Doubts have no home (A-29); gives the teacher a reason to keep their kit fresh, which keeps students' material current (A-24).
- **Why she'd switch from YouTube:** Indirect: teachers who read this keep feeding the app, so the app keeps getting better than YouTube for their students.
- **Effort (solo dev):** Low. A scheduled job and an email (free tier).
- **Rules:** ✅ fits. Only aggregated data. If the LLM writes the suggestion, it reads our aggregates only (R4).

---

## Part 3: getting teachers and students in together

### TEACH-14. "Open this lecture in FocusLearn" link and QR
- **What:** Each partner lecture gets a short link and QR (`fl.app/t/cost14`). The teacher puts it in the pinned comment, description and on a slide. It opens the lecture with the teacher's timestamps, notes PDF and questions ready.
- **Pain it solves:** "sir timestamps please" / "notes kab milega" comments (C-3, A-8); students can't find the right material fast (A-22).
- **Why she'd switch from YouTube:** The teacher sends her. That's the strongest reason there is.
- **Effort (solo dev):** Low. A redirect table and a QR generator.
- **Rules:** ✅ fits. The teacher's own description text is theirs to write. Our page still plays the official embed (R7).

### TEACH-15. Zero-work onboarding for the teacher
- **What:** The teacher signs in, pastes their playlist links and Telegram folder of PDFs; we list lectures and let their assistant drag each PDF onto its lecture and paste chapter lines. A kit can go live in one evening.
- **Pain it solves:** Teacher side: they will not do extra work. Student side: every pain above depends on teachers actually filling the kit.
- **Why she'd switch from YouTube:** Only indirectly: without this, no kits exist.
- **Effort (solo dev):** Medium. Mostly form UI on top of C2.
- **Rules:** ✅ fits. Playlist items fetched with cheap API calls; only IDs kept long-term (R1).

### TEACH-16. Named, traceable notes PDFs (anti-piracy for the teacher's own files)
- **What:** When a student opens or downloads the teacher's notes PDF, we stamp a light footer: "Prepared by CA X for Priya S · FocusLearn". Pirated copies on Telegram then show whose account leaked them.
- **Pain it solves:** Teacher piracy (A research, Telegram section: Delhi High Court blocks for Neetu Singh and others 🟡).
- **Why she'd switch from YouTube:** Indirect: teachers will put their *better* notes here once they aren't scared of leaks, so students get material they can't get on Telegram.
- **Effort (solo dev):** Medium. PDF stamping in a Worker (pdf-lib), or on upload.
- **Rules:** ⚠️ fits with care. Tell students plainly their name is on the file. This covers the teacher's own PDFs only, never YouTube video (we can't touch the video). Weak against a determined pirate who retypes the notes 🔵.

### TEACH-17. Paid-course bridge, respectfully
- **What:** Beside a free lecture the teacher can show one quiet line: "Want the full test series? See my course" with their link. Students can hide it for that teacher.
- **Pain it solves:** Teacher motive (their paid batch pays the bills). Student side: sales pressure is hated ("I get more than two calls every week", C Unacademy).
- **Why she'd switch from YouTube:** It doesn't pull her in; its job is to get teachers to say yes. The "hide" button keeps her trust.
- **Effort (solo dev):** Low.
- **Rules:** ⚠️ fits with care. Never gate or cover the player (R7, R8). No affiliate cut for now (money and trust); keep it a plain link. Must not make the page look like an ad board.

### TEACH-18. Teacher "office hour" room on a lecture 🌶
- **What:** Once a week the teacher (or a TA) opens a 30-minute text room pinned to one lecture. Students in the room watch at their own pace and post doubts with the exact second. The teacher answers in text, tapping the timestamp to show where.
- **Pain it solves:** "It is not always possible to clear doubts in class. There are too many students" (A-29); studying alone at night (A-32, C-19).
- **Why she'd switch from YouTube:** A YouTube live chat is 2,000 lines of "hi sir". This is a small room where her question is tied to the exact minute.
- **Effort (solo dev):** High. Realtime chat (Supabase Realtime free tier), moderation.
- **Rules:** ⚠️ fits with care. Needs report/block and a moderator; no watching rewards. Room is our space beside the embed, never over it.

### TEACH-19. Senior-student TAs 🌶
- **What:** The teacher appoints a few qualified students (passed CS/CMA last attempt) as TAs for their cohort. TAs answer open doubts on the heatmap (TEACH-08) and their answers carry the teacher's approval tick.
- **Pain it solves:** Doubts go unanswered (C-10, A-30); teacher has no time.
- **Why she'd switch from YouTube:** Her doubt gets an answer within a day from someone who cleared the same paper.
- **Effort (solo dev):** Medium. Roles on the cohort plus an answer flow.
- **Rules:** ⚠️ fits with care. Human answers to student text, no AI on video. Needs quality control; the teacher owns the tick.

### TEACH-20. "Study with sir" timetable 🌶
- **What:** The teacher posts a live timetable for the free batch ("Mon 8 pm: Lecture 21, Costing"). Students who join a slot see a count of others studying the same lecture right now and the shared doubt strip. Each watches in their own embed.
- **Pain it solves:** "I don't have any competitive environment at home" (A-31); "Seeing others studying is like a boost" (C-20); consistency (A-36).
- **Why she'd switch from YouTube:** She's in her teacher's class at 8 pm with 1,200 others, on her own phone, with no feed around it.
- **Effort (solo dev):** Medium. Scheduled sessions, a presence count.
- **Rules:** ⚠️ fits with care. Count people *present*, never reward watching or show who watched most (R8). Presence count uses our session data, not YouTube stats.

### TEACH-21. Mock paper that sends you back to the lecture
- **What:** The teacher uploads a mock or PYQ set, each question tagged to the lecture second where it's taught. After the test, each wrong answer shows "Revise: Lecture 14 at 42:10" and the teacher's notes page.
- **Pain it solves:** No practice with YouTube lectures (A-17); PYQs and mocks as the check on "just watching" (A research, section 2).
- **Why she'd switch from YouTube:** YouTube can't test her, and a test app can't send her to the exact minute her own teacher explained it.
- **Effort (solo dev):** Medium–High. A question player, scoring, tags.
- **Rules:** ✅ fits. Teacher's own questions. PYQ copyright: link to ICSI/ICMAI papers or let the teacher take responsibility for what they upload 🔵.

### TEACH-22. Teacher sees students' shared notes, students see the teacher's "model notes"
- **What:** Students can opt to share their notes on a lecture with the teacher's cohort. The teacher picks the best one each week as "model notes" (student credited). Everyone can copy it into their notebook.
- **Pain it solves:** Notes are slow to make (A-8, A-9); "Watching and copying notes doesn't turn into real study" (A-16).
- **Why she'd switch from YouTube:** Top students' notes, approved by her teacher, pinned to timestamps. On YouTube that exists only as a Telegram PDF with no link back.
- **Effort (solo dev):** Medium. Builds on round 1 E2 but the teacher moderates, which makes it far cheaper and safer than E2's open sharing.
- **Rules:** ⚠️ fits with care. Opt-in, 18+, credit or anonymity by the author's choice.

### TEACH-23. Paid batch inside our app via unlisted YouTube videos 🌶
- **What:** The teacher uploads the paid batch as unlisted YouTube videos, and our app sells access and shows them only to paying students.
- **Pain it solves:** Teacher piracy; teacher wants a cheap place to host paid content.
- **Why she'd switch from YouTube:** She'd get her teacher's paid lectures in one app with her notes.
- **Effort (solo dev):** Medium.
- **Rules:** ❌ breaks. R8 bars gating (nothing but "play" to watch), and YouTube's API policies bar charging for access to YouTube content 🟡. Unlisted links also leak. Listed here to mark the line. If teachers want paid hosting, they need their own video host, not us.

### TEACH-24. Teacher kit for NPTEL-style licensed courses first
- **What:** Before any teacher signs, build one full "kit" from NPTEL (CC BY-NC-SA): timestamps, transcript search, questions. Show it to teachers as the demo of what their channel could look like.
- **Pain it solves:** Teacher side: "show me it works before I give you my PDFs." Student side: college students get a real searchable course (C-12, C-13).
- **Why she'd switch from YouTube:** For NPTEL subjects, whole-course search and questions exist nowhere else.
- **Effort (solo dev):** Medium. Uses content we're already allowed to use.
- **Rules:** ✅ fits. NPTEL licence allows non-commercial use with credit; keep it free and credited.

### TEACH-25. "Sir's pace" suggested schedule
- **What:** The teacher sets the intended pace ("2 lectures a day, finish by 15 Nov for the Dec attempt"). Each student sees her own position against that pace in her plan, and the teacher's backlog advice when behind ("if you're 20 behind, do these 8 first").
- **Pain it solves:** Backlogs ("20, 50, 100 or 150 Lectures Backlog?", A research section 2); guilt after lost days (A-34).
- **Why she'd switch from YouTube:** Her teacher's plan, adjusted to where she actually is, instead of a playlist that just says "Lecture 67 of 140".
- **Effort (solo dev):** Low–Medium. Builds on round 1 C3.
- **Rules:** ✅ fits. Based on topics she marks done, not watch time (R8). Suggestions only; nothing locks.

---

## My top 3

1. **TEACH-05 + TEACH-01 Amendment pins and official timestamp map:** low effort, and for CS/CA/CMA students "this part is outdated, watch this instead" is something YouTube will never do.
2. **TEACH-08 + TEACH-09 Doubt heatmap and weekly answer loop:** gives teachers the one thing YouTube Studio lacks (where students got confused) and gives students a doubt that gets answered, so both sides have a reason to be here.
3. **TEACH-14 + TEACH-02 "Open in FocusLearn" link with the notes PDF beside the lecture:** the teacher sends students to us from their own comment and slide; that's distribution a solo dev can't buy.

Most surprising: **TEACH-16 named PDFs.** Teachers keep their best notes off Telegram because of piracy. A traceable footer may be what gets those notes into our app, and students can't get them anywhere else.

Open question ❓: none of this was tested on a real teacher. Before building, ask one CS/CMA faculty member with a mid-size channel two things: would they paste timestamps and PDFs for us, and which of doubt data, pass rate or piracy control would make them mention the app in a video.
