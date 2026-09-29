# User research, part 2: college students and app reviews

Date: 2026-09-29.

## How this was gathered, and its limits

- **Play Store:** rating, installs and review text pulled with the `google-play-scraper` library (country India, English), about 100–600 reviews per app (most relevant + newest). I read the top 1–3★ and 5★ reviews by "helpful" votes. Quotes are copied exactly; long ones are cut with "…" but no words changed. Dates are review dates.
- **Chrome Web Store, SyncStudy site, blogs:** read with a web fetch.
- **Blocked:** Reddit (search and fetch both refused), Quora (403), Medium (403). So there are **no Reddit or Quora quotes** here. The college-student voice comes mostly from Play Store reviews of college apps (Last Moment Tuitions, Gate Smashers, EduRev BCom) and from general study apps.
- **Who is speaking:** Play Store reviews rarely say "I am a BTech student". Where the review shows it (semester, MU, AKTU, BCom, CDAC, college), I say so. Otherwise the speaker is "student, level unknown" and may be a JEE/NEET/school student. Treat this as a limit on part A.
- Labels: ✅ read in the primary source (the review or page itself), 🟡 snippet or self-reported claim, 🔵 my reasoning, ❓ unknown.

---

## 1. College-student pain points

"Speaker" says what the review reveals about who wrote it.

| # | Pain | Quote (exact words) | Speaker | Source | Label |
|---|------|--------------------|---------|--------|-------|
| 1 | YouTube pulls you away even with a separate study account and history off | "As a student, I open yt for study and lectures but I end up clicking on the recommended video or short . And even if I've created another account for study and my watch history is off , still nothing works out for me" | student, level unknown (StudyTube 5★, 2024-12-24) | https://play.google.com/store/apps/details?id=com.thecodefuel.studytube | ✅ |
| 2 | End-of-video recommendations undo the focus | "Please remove the I button and the recommendations that come once a video ends. … I am student and YouTube feed and end recommendations have ruined my life." | student (StudyTube 3★, 2024-07-29) | same | ✅ |
| 3 | Long videos need timestamps; students rely on comments for them | "Comment section is very important for time stamps in a 7 hour long video. … Without comment section, this app is useless for me." | student, level unknown (StudyTube 1★, 2026-09-12) | same | ✅ |
| 4 | Finding the right playlist is hard | "the problem is we are in trouble to find the playlist which we want We suggest that it should have algorithm to find playlist by search terms(keys) not by links" | student (StudyTube 5★, 2025-11-05) | same | ✅ |
| 5 | Losing your place in a video | "when we go back and open the recent apps it would start showing the home page and our previous video would have gone,it's there in the watch history but it's frustrating" | student (StudyTube 5★, 2025-12-30) | same | ✅ |
| 6 | Long study on a phone is hard; want laptop/PC | "Why do i study my computer subjects on my phone useless cant study for long hours on a mobile phone atleast give a way to view it in big screens" | engineering/CS learner (Last Moment Tuitions 1★, 2023-07-12) | https://play.google.com/store/apps/details?id=co.jones.cjzgt | ✅ |
| 7 | The phone itself is the distraction | "The phone is really distracting and as a student i use Windows laptop for studying,When a solution to this is found, I will give it full stars" | student (YPT 2★, 2026-06-07) | https://play.google.com/store/apps/details?id=com.pallo.passiontimerscoped | ✅ |
| 8 | Free YouTube beats the paid course | "Free YouTube resources are honestly much better than this. Completely disappointed." | placement prep (LMT 1★, 2026-04-24) | LMT link above | ✅ |
| 9 | Paid course "no dots connect", feels like random YouTube | "no dots connect looks like studing randomly on YouTube also in live class he doesn't pay attention to those who want to ask doubt" | CS job-exam learner (Gate Smashers 1★, 2024-10-23) | https://play.google.com/store/apps/details?id=co.sansa.xemdy | ✅ |
| 10 | Doubts go unanswered | "if u have got any doubts, u have to solve it on your own as nobody on the appor whatsapp bothers to respond to the questions asked!" | CS learner (Gate Smashers 1★, 2023-09-12) | same | ✅ |
| 11 | YouTube is "good enough to pass college exams", not deeper | "though sir is doing great on YouTube but that is useful for passing in college exams." | CS learner (Gate Smashers 1★, 2025-07-03) | same | ✅ |
| 12 | Last-minute semester prep is the real use case | "helped me pass my 7th-sem exams with their well curated how to pass question banks … Their concise videos and notes made last minute prep super effective." | engineering, 7th sem (LMT 5★, 2025-01-21) | LMT link | ✅ |
| 13 | Content must match *my* university and semester | "the subjects are not same. Please make a app for kerala university with previous year questions of all sem." | BCom student (EduRev BCom 5★, 2018-10-15) | https://play.google.com/store/apps/details?id=com.edurev.bcom | ✅ |
| 14 | Notes are locked or can't leave the app | "You cannot download PDF even after you have paid it works inside app only … you can't take screenshot of content" | engineering (LMT 1★, 2023-07-13) | LMT link | ✅ |
| 15 | Paid access expires, but revision takes years | "When you buy a book, it doesn't disappear after a few months. … Students often prepare over multiple years and need to revise." | exam aspirant (PW 1★, 2026-07-09) | https://play.google.com/store/apps/details?id=xyz.penpencil.physicswala | ✅ |
| 16 | Losing progress/bookmarks | "I had marked the videos I completed, tracked what I had studied, and added bookmarks. Most of the time, all of that progress disappears" | exam aspirant (PW 1★, 2026-07-28) | PW link | ✅ |
| 17 | Losing months of records is the worst fear | "I have my exams coming and I've been recording for the last 6 months, I cant just lose it all." (821 helpful votes) | student (YPT 1★, 2024-01-16) | YPT link | ✅ |
| 18 | All-nighters break "today" | "the app resets daily study time at like 4:30-5:00 AM, and for people like me who pull all nighters... that makes the whole time tracking thing useless" | student (YPT 3★, 2025-04-23) | YPT link | ✅ |
| 19 | Studying alone; paying not to be alone feels wrong | "how can mere students afford to pay inorder to not be alone while studying?" | student (StudyStream 1★, 2025-04-05) | https://play.google.com/store/apps/details?id=live.studystream.app | ✅ |
| 20 | Seeing others study motivates | "Seeing others studying is like a boost." | high-school student (YPT 5★, 2025-07-31) | YPT link | ✅ |
| 21 | Too many courses, can't pick one | "there are just so many courses for the very same subject that it is highly difficult to find a good one in an efficient manner." (12,181 helpful votes) | exam aspirant (Unacademy 1★, 2023-09-30) | https://play.google.com/store/apps/details?id=com.unacademyapp | ✅ |
| 22 | Hindi-medium students left out | "everything in it is in English. I am preparing for NEET from Hindi medium." | NEET aspirant (Pi Lens 2★, 2026-06-24) | https://play.google.com/store/apps/details?id=live.pw.pilens | ✅ |
| 23 | Mobile data runs out | "within just 40 minutes, my 1.3 GB data was consumed … I also need to watch lectures on the same phone." | student (StudyStream 2★, 2024-08-26) | StudyStream link | ✅ |
| 24 | Playback speed is how students revise | "being able to adjust the playback speed is crucial for efficient revision and managing study time." | student (PW 2★, 2026-08-13) | PW link | ✅ |
| 25 | Rewatching a whole lecture to find one part (blog author's advice, not a student) | "Do not rewatch a complete 90-minute video because you forgot one five-minute method." | blog author writing for Indian college/exam students | https://www.sahildubey.com/2026/09/how-to-make-notes-from-youtube-lectures.html | ✅ (author voice) |

Not found: a direct quote from a college student about **loneliness at night** specifically. The nearest are #19 (studying alone) and #18 (all-nighters). ❓

---

## 2. App by app

### StudyTube (com.thecodefuel.studytube)
- **Users:** 50,000+ installs, 4.19★ from 1,131 ratings (histogram 1★ 111, 5★ 726). Released April 2023. ✅
- **What it is:** a separate YouTube client with no home feed, Shorts hidden, a "study mode" that blocks non-study videos (reviews say by AI), notes, timestamps, a chatbot, downloads. Reviews praise "no ads". ✅ (from reviews)
- **Why people use it daily:**
  - "It has ad block feature, shorts blocking feature, it allows us to add our notes … It feels like that developer really understood the problems of students" (5★) ✅
  - "there is no home page, you have to search up videos so you won't get caught clicking on random thumbnails" (5★) ✅
  - "I really like the StudyMode feature, the permanent lock is highly appreciated." (5★) ✅
- **Top complaints:**
  - Breakage: "whenever i play any video it says Sign in to confirm you're not a bot" (1★); "after the update, it's not working properly, videos anit loading showing black screen" (1★) ✅
  - Filter wrong both ways: "when I … search my study topic they say 'this content are not related to study '" (1★); "now it doesn't block the non education videos, so it seems pointless" (2★) ✅
  - Leaks back to YouTube: "The Whole YouTube web opens … when clicking on the title" and end-screen recommendations (2★) ✅
  - Paywall creep: "All features become for premium subscription" (1★, 2026-09-13) ✅
- **Gap our app could fill:** StudyTube's love comes partly from things we **cannot** do: blocking ads (R7) and judging videos with AI (R3). Its "not a bot" errors suggest it does not use only the official embedded player 🔵. A policy-safe app can't win on "no ads". It can win on reliability, a web/laptop version, notes that export in the right order ("when I save it as pdf, the position of notes gets reversed" ✅), and resume-where-I-left-off.

### SyncStudy (syncstudy.in)
- **Users:** site claims "10,000+ courses created", "4.9/5 student rating", "Thousands of active learners across India". A search snippet quotes "4.8 out of 5 with 2,400 reviews". All self-reported, not verified. 🟡 No Play Store app found under that name.
- **What it is:** turns a YouTube playlist into a "course" with progress tracking, "Timestamped Notes: Markdown notes linked to exact video moments", focus mode ("Removes recommendations, comments, and autoplay"), AI planner, quizzes, AI tutor, and "Pre-loaded trackers for JEE, NEET, UPSC, GATE". ✅ (site)
- **Pricing:** Free ₹0 ("Up to 3 playlists", "Plain text notes"); Pro ₹99/month (20 playlists, AI quiz, AI planner); Ultra ₹149/month (unlimited, AI tutor). ✅ https://syncstudy.in/pricing
- **Why people use it (site testimonials, picked by the company):** "Finally finished a 12-hour React course. The progress tracking and distraction-free player is the only reason I didn't quit halfway." — "Alok Singh, CS Student". 🟡 (testimonial on own site)
- **Top complaints:** none found. No independent reviews reachable. ❓
- **Gap:** SyncStudy is the closest thing to our direction and already covers playlist → course + timestamped notes for Indian exams. Its home page names "JEE, NEET, UPSC, GATE, and other exams"; I saw no CS or CMA tracker 🟡. A search result shows a public SyncStudy course titled "Party songs" 🟡, so public courses seem uncurated. Our room: CS/CMA/college syllabi, a doubt log, revision of the user's own notes, a free tier not capped at 3 playlists.

### YPT – Yeolpumta (com.pallo.passiontimerscoped)
- **Users:** 5,000,000+ installs, 4.55★ from 79,551 ratings. ✅
- **Why people use it daily:**
  - "it allows you to join or even create study groups, which keeps you motivated to study along with all other people who are studying." (5★, 367 votes) ✅
  - "You've helped me push from 3 hours to 10+ hours!!!" (5★) ✅
  - "I know All my faults, when I wasted time, when I studied hard" (5★) ✅
- **Top complaints:**
  - Fear of losing records (#17 above, 821 votes); server errors: "the 'did not connect to the server ' issue … YPT doesn't work when connected to campus WiFi" (3★) ✅
  - Day reset at 5 AM breaks all-nighters (#18). ✅
  - No laptop version (#7). ✅
  - Paid "flames": "we have to buy flames with real money … let us earn the flames for the hours the we study" (5★, 427 votes) ✅
- **Gap:** groups + a record you trust are the love reasons. A web app that works on laptop and campus Wi-Fi, lets the user set when "today" ends, and exports records answers four top complaints. Note R8: we can show study actions to the user and a group, but must not reward *watching* 🔵.

### Notion (notion.id)
- **Users:** 10,000,000+ installs, 4.61★ from 394,783 ratings. Few student-specific reviews. ✅
- **Why people use it:** "I used it for daily task, long-term study planning (from 1-6th semester of my uni)" (5★); "I personally use it for note down mcqs which I made mistake during mcqs prectise, this helped me a lot to revise it quickly" (5★). ✅
- **Top complaints:** "The Android version is dead slow" (2★); mobile editing: "Selecting a function & formatting takes FOREVER" (2★); AI push: "Notion in particular seems insistent on shoving it down their users throats" (1★, 346 votes); "the subscription is too expensive for an undergraduate student like me. I live in India" (5★). ✅
- **Gap:** students use Notion as a hand-built mistake log and semester planner, but mobile writing is painful and it knows nothing about the video. A mistake/doubt log tied to a video timestamp and a syllabus topic needs no setup.

### Anki / AnkiDroid (com.ichi2.anki)
- **Users:** 10,000,000+ installs, 4.71★ from 164,773 ratings. ✅
- **Why people use it daily:** "I've actually never been able to retain the stuff i study but just a little bit of effort everyday in reviewing these cards makes all the difference." (5★, 292 votes); "I owe my college degree and GPA to this app" (5★); a JEE student: "in that fun revision happens silently strong and interesting" (5★). ✅
- **Top complaints:** learning curve: "You could easily end up spending more time customizing Anki than using it." (3★); "why does the app need a 'high learning curve' to use? they're flash cards." (1★); lost work: "Just finished making a batch of 40 different cards and none of them were saved." (1★). ✅
- **Gap:** spaced repetition works, but making cards is the cost ("making cards takes a bit of time unless you buy a deck" ✅). A card made in one tap from a note at a video timestamp, where the answer is "jump back to 42:10", removes both the setup and the card-making cost.

### Unacademy (com.unacademyapp)
- **Users:** 100,000,000+ installs, 4.12★ from 1,255,375 ratings; 164,690 one-star. ✅
- **Why people use it:** "wonderful for practicing PYQs, Watching video lectures and clearing of doubts" (5★). ✅
- **Top complaints:** too many courses (#21, 12,181 votes); test series "are not organised. And there is no option provided for us to filter/ search" (2★, 6,962 votes); sales calls: "I get more than two calls every week" (1★, 1,541 votes). ✅
- **Gap:** choice overload and hard-to-find items. Students want fewer, clearly ordered options and no sales pressure.

### Physics Wallah (xyz.penpencil.physicswala)
- **Users:** 50,000,000+ installs, 4.72★ from 1,406,738 ratings. ✅
- **Why people use it:** "The teachers explain concepts in a very simple and easy-to-understand way" and "affordable" repeat in almost every 5★ review. ✅
- **Top complaints:** can't find one video among 100 DPP solutions: "if there would be a feature in that video solution section to search for it" (2★); speed control broken (#24); progress lost (#16); access expires (#15). ✅
- **Gap:** even the market leader loses students' progress and makes them scroll. Search inside "my" material, durable progress, and speed control are table stakes.

### PW Pi Lens (live.pw.pilens) — found during research, most important competitor
- **Users:** 100,000+ installs, 4.58★ from 4,113 ratings, released January 2026. Description claims "4,50,000+ students use Pi Lens on Android and Chrome". Also a Chrome extension. ✅
- **What it is:** a panel beside any YouTube video with "Notes on any youtube video", "Video Summary … auto-generated from the video", "Chapter-matched exact PYQs from the last 5 years", "Instant Quiz … built from the video's content", flashcards, mind maps, 1v1 battles. For "Class 9-12 Boards, IIT-JEE, NEET, CUET, UPSC, State Boards, or MHT-CET". ✅
- **Why people use it daily:** "The instant quizzes, PYQs, and clean notes right alongside the video save so much time. No need to switch tabs anymore." (5★); "I was unable to buy question bank .... but then I find this" (5★); "It generate notes accurately based on the knowledge given in the video, excluding unnecessary talks." (4★). ✅
- **Top complaints:** permissions: "Pi Lens will be able to read all notifications, including personal information" (1★); not every video works: "I tried it on 4- 5 video of YouTube but it responds to only one" (3★); English only, Hindi-medium left out (#22); ICSE/SSC/Railway not covered; must open the YouTube app to find a video (3★). ✅
- **Gap:** Pi Lens proves demand for "study layer beside a YouTube lecture" at scale. But it reads the video's content to make summaries and quizzes, which our R4 forbids, so we can't copy that part. It targets school/JEE/NEET, not CS, CMA or university semesters. It asks for notification access. Our room: the student's **own** notes, doubts and revision; professional and college exams; no scary permissions; web first.

### Forest (cc.forestapp)
- **Users:** 10,000,000+ installs, 4.47★ from 813,476 ratings. ✅
- **Why people use it daily:** "It's the only app that successfully gamifies productivity" (5★, 393 votes); "The statistics and data actually do help." (5★, 1,251 votes). ✅
- **Top complaints:** updates broke it and lost records: "Logged in and lost all planting records." (1★); "Trying to open the focus challenge, especially on my institute wifi never works" (1★, 388 votes); now online-only: "It shows every time that I must connect to the internet" (1★); subscription shift. ✅
- **Gap:** Forest's reward loop is exactly what R8 forbids for watching. What we can take: honest stats, and working offline/on campus Wi-Fi.

### Unhook (Chrome extension + com.unhook app)
- **Users:** Chrome extension 1,000,000 users, 4.9★ from 4.5K ratings. Android app 50,000+ installs, 3.87★ from 1,233 ratings (different developer, BeTimeful Inc). ✅
- **Why people use it:** "youtube should have had this by default , best thing ever"; "Really nice to have Youtube stop feeling like insta." (Chrome, 5★); "it really helps to avoid distraction especially when you are preparing for competitive exam like jee, neet etc." (Android, 5★). ✅
- **Top complaints:** Chrome: "The option to hide end cards at the end of videos does not work." (4★). Android: "Without premium it is just trash." (1★); "the browser extension is free btw. … on desktop it's the same thing but you can actually watch the content without paying" (1★). ✅
- **Gap:** Unhook is free and loved on desktop, which means "hide recommendations" alone is already solved there for free. On phones there is no free, reliable equivalent. It does nothing for notes, revision or syllabus.

### Also checked (college-focused)
- **Last Moment Tuitions** (co.jones.cjzgt): 50,000+, 3.85★. Loved for semester "how to pass" bundles ("I got 8.6 sgpa this time" ✅). Hated for DRM that locks out paying students ("Tommorrow is my SPCC Exam please help me" ✅) and phone-only access.
- **Gate Smashers app** (co.sansa.xemdy): 10,000+, 3.70★. Pattern: free YouTube praised, paid app criticised; doubts unanswered. ✅
- **EduRev BCom** (com.edurev.bcom): 500,000+, 4.26★. "all videos are from You tube.. one can search for these videos there also but notes are good" (3★). ✅
- **StudyStream** (live.studystream.app): 100,000+, 3.97★. Loved as body-doubling ("really amazing for introverts and who don't like study alone" ✅); hated for the free focus-room time cut to 1 hour.

### Not found / not checked
- Mem, Tactiq, VidNotes: not checked in depth; Tactiq is mainly a meeting-transcript tool. ❓
- Any App Store (iOS) reviews: not pulled. ❓

---

## 3. Apps and extensions that already do notes-on-video or spaced repetition from video

| Tool | What it does | Scale | What's missing | Targets Indian exam students? |
|------|--------------|-------|----------------|-------------------------------|
| **PW Pi Lens** (Android + Chrome) | Panel beside YouTube: PW notes, AI summary from the video, PYQs, quiz, flashcards | 100,000+ installs, 4.58★ ✅ | User's own notes are not the centre; not all videos work; English only; heavy permissions; school/JEE/NEET only | **Yes** — Boards, JEE, NEET, CUET, UPSC, MHT-CET. Not CS/CMA/university. |
| **SyncStudy** (web) | Playlist → course, timestamped markdown notes, progress, focus mode, AI quiz/tutor | self-reported "10,000+ courses" 🟡 | No independent reviews; free tier 3 playlists; CS/CMA syllabi not seen 🟡 | **Yes** — JEE, NEET, UPSC, GATE |
| **StudyTube** (Android) | Distraction-free YouTube client, notes, timestamps, AI chatbot | 50,000+, 4.19★ ✅ | Unreliable; ad-blocking and AI filtering likely break YouTube rules 🔵; no syllabus | Indirectly (JEE/NEET users in reviews) |
| **YiNote** (Chrome) | Timestamped notes while watching, click to jump | 9,000 users, 4.0★; recent reviews say it no longer opens ✅ | Looks abandoned: "you click the extension icon, nothing happens!" | No |
| **LunaNotes** (Chrome) | AI notes, screenshots, markdown for YouTube | 7,000 users, 4.0★ ✅ | Panel blocks the page; registration errors; AI summary failing | No |
| **Snipo** (Chrome/Firefox) | Timestamped notes and screenshots into Notion | ❓ | Needs Notion; screenshots of video frames (not allowed for us) | No |
| **YouTube Timestamp Notes / TubeNotes** (Chrome) | Timestamped notes, export | TubeNotes: 0 ratings ✅ | Tiny; no review; no syllabus | No |
| **ClipMark** (Chrome) | Save timestamp → Anki cards, active recall, spaced review | 17 users, 3 ratings ✅ | Almost no users | No — "USMLE Step 1/Step 2 students and IMGs" ✅ |
| **YTReps** (GitHub, desktop) | YouTube player + notes as flashcards, Anki export | open-source project ✅ | Built for language learning; not a product | No |
| **AnkiDecks** (web) | Paste a YouTube URL, it transcribes and makes cards | ❓ | Transcribes arbitrary videos (not allowed for us) | No |
| **NoteGPT** (Chrome) | Transcript, AI summary, mind map, flashcards on YouTube | 400,000 users, 4.9★ (search snippet) 🟡 | Transcript-based; general audience | No |
| **Glasp** (Chrome) | Web highlighter, YouTube transcript highlights and summaries | 500,000 users, 4.4★ ✅ | "UI is really cluttered and difficult to navigate" ✅ | No |

🔵 Pattern: the big tools (Pi Lens, NoteGPT, Glasp, AnkiDecks) all get their value from reading the **video's transcript**. We can't. The small tools that only store the **user's own** timestamped notes (YiNote, TubeNotes, ClipMark) are tiny and abandoned, and none of them has an Indian syllabus or spaced repetition for Indian exams. Nobody combines: own notes at timestamps + syllabus topic + spaced revision + doubt log, for CS/CMA or university semesters.

---

## 4. The 10 strongest insights, ranked

1. **PW already ships "study tools beside any YouTube lecture" at scale.** Pi Lens: 100,000+ installs, 4.58★, "No need to switch tabs anymore." ✅ The sister's "notes next to the lecture" idea is validated, but it is not new. We must differ by exam (CS/CMA/college), by being the user's own notes, and by privacy.
2. **What made Pi Lens loved is off-limits to us.** Its summaries and quizzes are "auto-generated from the video"; R4 bans that. Our edge has to be what the student writes: notes, doubts, mistakes, and revision of them. 🔵
3. **SyncStudy is the closest twin** (playlist → course, timestamped notes, focus mode, JEE/NEET/UPSC/GATE, ₹99–149/month). Its free tier stops at 3 playlists ✅, and I saw no CS/CMA syllabus 🟡.
4. **Timestamps in long lectures are a daily need.** "Comment section is very important for time stamps in a 7 hour long video." ✅ Our own chapter/timestamp notes (stored as video ID + seconds, allowed under R1) fill that directly.
5. **Losing records is the top rage trigger.** YPT's most-voted review (821) is "I cant just lose it all"; PW and Forest have the same. ✅ Export, sync and never losing notes matter more than features.
6. **Students want to study on a laptop.** YPT: "i use Windows laptop for studying"; LMT: "cant study for long hours on a mobile phone". ✅ Our web-first app fits; most rivals are phone-first.
7. **Studying with others is loved; paywalling it is hated.** YPT groups are the top 5★ reason; StudyStream's 1-hour free cap draws "how can mere students afford to pay inorder to not be alone while studying?" ✅ Small free study groups (counting study actions, not watching, per R8) are an opening.
8. **Free YouTube beats paid apps, but doubts go unanswered.** "Free YouTube resources are honestly much better than this"; "nobody … bothers to respond to the questions asked!" ✅ A doubt log pinned to the exact second, which the user can share with a friend or teacher, is a gap.
9. **"Hide distractions" alone is solved or unwinnable.** Unhook does it free on desktop (1M users); StudyTube wins phones with ad-blocking we can't copy. ✅/🔵 Distraction hiding should be a feature, not the pitch.
10. **Syllabus fit and night habits are ignored.** "Please make a app for kerala university with previous year questions of all sem"; YPT's 5 AM reset "makes the whole time tracking thing useless" for all-nighters. ✅ Match the user's exact exam/university, and let the user set when their day ends.
