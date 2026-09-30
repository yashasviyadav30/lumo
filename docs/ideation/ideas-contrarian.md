# Ideas round 2: the contrarian

Persona: someone who thinks "a better YouTube for studying" is the wrong product. Date: 2026-09-29.
Labels: ✅ read in a primary source, 🟡 secondary, 🔵 my reasoning, ❓ unknown.

## How I see the problem

We are building a worse YouTube and hoping students will switch to it out of virtue. They won't. The first user already said so: "Nothing here would make me switch; YouTube is better." Students do not lack lectures or a quiet player. They lack four things YouTube will never give them: **someone who notices when they stop, practice that looks like the exam, people to study with, and a plan that survives a bad week.** None of those needs us to play a single video. The player is the least valuable thing we own, and it is the part that carries every rule we have to follow.

---

## Part 1: Why the current idea fails

### 1. Our search can never beat YouTube's, and our quota makes it worse
- The app gets **100 YouTube searches a day for all users combined** (shared brief). At 1,000 users that is one search per ten users per day. YouTube gives each of them unlimited searches, tuned on billions of queries. 🔵
- The sister's test proved it: "YouTube's search is better." ✅ (shared brief)
- Our search is YouTube's search with results removed. Removing things is not a feature anyone opens an app for. 🔵

### 2. "Hide distractions" is already free, and the phone version is the one we can't win
- Unhook: 1,000,000 Chrome users, 4.9★, free. ✅ (research-apps-college, Unhook)
- StudyTube wins phones because it **blocks ads and judges videos with AI**. We may do neither (R7, R3). ✅/🔵
- And the leak cannot be closed: on our embedded player, YouTube's own links open the YouTube app (R7). Every tap on the title or end screen sends her straight back to the feed we promised to protect her from. 🔵

### 3. Filtering is a rule minefield with no winning move
- R3 bans us from judging a video from its title or description. So all we have is YouTube's own fields, such as the category the uploader picked. Uploaders choose that themselves, so a CS lecture can be filed under "People & Blogs" and a prank video under "Education". 🔵
- StudyTube, which *can* use AI, still gets it wrong both ways: "they say 'this content are not related to study'" and "now it doesn't block the non education videos, so it seems pointless". ✅
- If a far freer app can't filter well, a rule-bound one will do worse. Every wrong hide costs trust; every wrong show proves the filter useless. 🔵

### 4. The "notes beside the video" space is taken by people with more money and fewer rules
- PW Pi Lens: 100,000+ installs, 4.58★, a panel beside any YouTube video with notes, PYQs, quizzes and flashcards. ✅ Its best parts come from reading the video, which R4 bans for us.
- SyncStudy: playlist → course, timestamped notes, focus mode, Indian exam templates, ₹99/month. 🟡
- Being the third-best notes panel is not a business. 🔵

### 5. Students won't move where they watch. They will add a tool to where they already watch.
- The YouTube app is pre-installed, signed in, and it is where WhatsApp and Telegram links open. 🔵
- The most-loved study apps in the research are **not video players**: YPT 5M+ installs (study groups), Anki 10M+ (memory), Forest 10M+ (focus). ✅ They sit *beside* the content, not in place of it.
- Pi Lens is the closest winner, and it is a companion to YouTube, not a replacement: "No need to switch tabs anymore." ✅

### 6. Distraction is the loudest complaint, but not the one that fails the exam
Being fair: distraction is the most repeated pain in the research (rows 1–7). ✅ But look at what comes after it:
- "I forget all the concepts and formulae the next day" (NEET, row 13) 🟡
- "I'm doing self study from YouTube … but I have no any source to do practice" (JEE, row 17) ✅
- "I don't have any competitive environment at home" (NEET, row 31) ✅
- "I haven't studied anything from 2 weeks" (JEE, row 34) 🟡
- "financially very weak" (NEET, row 37) 🟡

Distraction is the symptom students can name. **No accountability, no practice and no company** are the causes. A student with a study partner waiting for her 9 pm check-in does not open Shorts at 8:55. 🔵

### 7. What to throw away from the current prototype
Be blunt: most of what exists is scaffolding for the wrong product.

| Part | Verdict | Why |
|---|---|---|
| Search page as the front door (`routers/search.py`, `query_builder.py`, `filters.py`) | **Throw away as the product.** Keep a tiny "find a video" utility at most. | It loses to YouTube on every axis and eats the 100/day quota. |
| "N hidden · Why · Show" line | **Throw away as the pitch.** Keep it as a setting if search stays. | Honest, but nobody switches apps for a list of what was removed. |
| Home as a search bar | **Throw away.** | Home should say "what you owe today", not "what do you want to watch". |
| Library of saved videos | **Throw away.** | YouTube's Watch Later already does this. |
| Free-text "type any goal" with LLM parsing (`goals.py`, `llm.py`) | **Shrink.** A pick-list of exam + attempt + paper is enough. | Students of CS or CMA know their exam; parsing Hinglish goals is a clever answer to a question nobody asks. |
| Topic maps from the official syllabus (`data/fields/*.json`, `docs/curation/`) | **Keep. This is the most valuable thing we have.** | Syllabus maps power plans, check-ins, PYQ drills and cohorts. |
| Accounts, 18+ gate, purge job, data-rule tests | **Keep.** | Any product needs them, and they keep us inside R1, R10, R11. |
| Player component | **Keep, but demote.** Use it only for "jump back to 42:10". | It is a tool inside studying, not the destination. |

---

## Part 2: What would actually work

### CONTRA-01. Nightly check-in bot (Telegram first, WhatsApp later)
- **What:** Every night at a time she picks, a bot asks "What did you study today?" She replies in one line or a voice note. The bot logs it against her syllabus and replies with tomorrow's one task. No app to open.
- **Pain it solves:** "I haven't studied anything from 2 weeks" (row 34); inconsistency (row 36); working CS students with "3–4 hours at night" (row 28).
- **Why she'd switch from YouTube:** She doesn't switch at all. She keeps watching on YouTube and answers a message where she already lives.
- **Effort (solo dev):** Low on Telegram (Bot API is free). Medium on WhatsApp: replies inside 24 hours of her message are free, but a bot-started reminder is a paid "utility" message, about US$0.0016 each in India 🟡 (Meta per-message pricing since July 2025). Ask before spending.
- **Rules:** ✅ Counts what she says she studied, not what she watched (R8). The LLM reads only her own reply (R4). If she pastes a YouTube link, store the video ID only (R1, R11).

### CONTRA-02. Study pod of five, same exam, same attempt
- **What:** Put her in a group of 5 people sitting the same paper in the same attempt ("CS Prof, ESG, Dec 2026"). The group sees each person's daily check-in (done / partly / missed) and nothing else. Silent members get dropped and replaced after a week.
- **Pain it solves:** "I don't have any competitive environment at home" (row 31); "I have started preparing alone … How are study groups important" (row 33); YPT's top 5★ reason is groups ✅.
- **Why she'd switch from YouTube:** Four people will notice if she skips tonight. YouTube notices nothing.
- **Effort (solo dev):** Medium (matching, pod chat or a shared board, replacing drop-outs).
- **Rules:** ⚠️ Opt-in, 18+, shows study check-ins only, never watch history. No leaderboard for watching (R8).

### CONTRA-03. Share-to-study from the YouTube app (Android share target)
- **What:** She watches in the real YouTube app. When a lecture matters, she taps Share → our app. It opens a study card for that lecture: notes, doubts, "mark topic done", and which syllabus topic it belongs to.
- **Pain it solves:** "Notes from video are slow" (rows 8, 9); losing her place (research-apps-college #5); the sister's "YouTube is better" verdict.
- **Why she'd switch from YouTube:** She doesn't have to. We become the notebook for YouTube, not a rival to it.
- **Effort (solo dev):** Low–Medium. The Web Share Target API works for an installed PWA on Android Chrome ✅ (developer.chrome.com). The YouTube app's share does not carry the current second on phone 🔵, so she types "42:10" or we offer our embedded player for jump-back.
- **Rules:** ✅ Stores video ID + seconds + her text (R1). No player overlay (R7). Titles re-fetched when shown.

### CONTRA-04. Daily PYQ, answered by hand, sent as a photo
- **What:** One past exam question a day on her paper (from ICSI/ICMAI past papers, linked to the official PDF). She writes the answer in her notebook, photographs it, and checks it against the official suggested answer. Theory papers are won by writing, not watching.
- **Pain it solves:** "I have no any source to do practice" (row 17); "watching ≠ studying" (rows 15, 16); knows it but "at the time of test i forget" (row 14).
- **Why she'd switch from YouTube:** YouTube never asks her a question. This asks one every day, from her exact paper.
- **Effort (solo dev):** Medium (collecting questions per topic by hand; photo storage on R2).
- **Rules:** ⚠️ Link to official PDFs; check ICSI/ICMAI terms before copying question text. Her photo is her data. No YouTube data used.

### CONTRA-05. Peer answer marking (mark two, get marked by two)
- **What:** She uploads a handwritten answer. Two pod members or strangers on the same paper mark it against a simple rubric (keywords, section numbers, structure). To get marks she must first mark two others.
- **Pain it solves:** no feedback when self-studying (rows 29, 30); UPSC-style answer-writing practice; "nobody … bothers to respond" (research-apps-college #10).
- **Why she'd switch from YouTube:** No YouTube teacher will ever read her answer. Two peers will, within a day.
- **Effort (solo dev):** Medium–High (queue, rubric UI, spam and abuse handling).
- **Rules:** ⚠️ 18+ only, report button, no public profiles. No YouTube data at all.

### CONTRA-06. Teacher-first: a free class register for YouTube teachers
- **What:** Give CS/CMA YouTube teachers (the ones with 20k–300k subscribers) a free tool: set the order of their playlist, post a weekly test, see which students did it, collect doubts pinned to a second. Students join "Sir's class" with one link.
- **Pain it solves:** "a lot of videos of PW of different batches of the same teacher so I'm always confused" (row 18); choice overload (rows 19–23); doubts (rows 29, 30).
- **Why she'd switch from YouTube:** Her own teacher tells her to. Distribution comes from the teacher's audience, not our marketing.
- **Effort (solo dev):** Medium (a teacher dashboard; the hard part is sales, not code).
- **Rules:** ✅ The teacher, a person, orders and judges the lectures, so R3 is not touched. Lecture IDs only (R1).

### CONTRA-07. Amendment and cut-off tracker per attempt
- **What:** For CS, CMA and CA: which amendments apply to *your* attempt, with links to the ICSI/ICAI/ICMAI notices. Humans curate it, and it changes each cycle.
- **Pain it solves:** "Up to what date's amendments are applicable to the June 18th CS executive exams?" (row 25); "my module is not the latest one" (row 24).
- **Why she'd switch from YouTube:** YouTube can't tell her whether a 2024 lecture is still valid for Dec 2026. We can, for the part of the syllabus that changed.
- **Effort (solo dev):** Low tech, steady manual work each cycle (a curator: the founder or the sister).
- **Rules:** ✅ Links to public notices; human judgement of the law, not AI judgement of videos.

### CONTRA-08. Exam-cycle app that sleeps and wakes
- **What:** The app shapes itself around the exam calendar: registration deadline, study-leave start, admit card, "60 days left" plan, revision mode, exam week, results day. Between cycles it goes quiet.
- **Pain it solves:** no plan (EnsureIAS "lack of structure"); backlog panic (rows 7, 10); working students with little time (row 28).
- **Why she'd switch from YouTube:** It knows her exam date and deadlines; YouTube knows only what she watched.
- **Effort (solo dev):** Low–Medium (a calendar per exam body, kept up by hand).
- **Rules:** ✅ Our own data.

### CONTRA-09. Backlog bankruptcy
- **What:** She pastes the playlist she's behind on and her exam date. The app says the truth: "At 1.5x you need 2h 40m a day. You have 1h." Then it offers a reset: drop to the teacher's one-shot for three chapters, keep full lectures for the heavy ones, and wipe the guilt count.
- **Pain it solves:** "I have a huge backlog" (row 7); "Can I clear the CA inter by only marathon lectures?" (row 12); guilt (rows 34, 35).
- **Why she'd switch from YouTube:** YouTube shows 147 unwatched videos. This shows a plan she can still finish.
- **Effort (solo dev):** Medium (playlist items and durations are cheap API calls; plan maths is simple).
- **Rules:** ⚠️ Durations are YouTube data: use them to compute, refresh within 30 days, keep only our plan (R1). She picks which chapters to swap, not our AI (R3).

### CONTRA-10. The one-question YouTube bouncer (Android) 🌶
- **What:** A small Android app that, when she opens the YouTube app, first shows one screen: "What are you here to study?" with a 10-second pause. She types a topic or taps "just relax". It logs the answer to her diary. It never blocks YouTube.
- **Pain it solves:** "Every 30 minutes or so after studying I crave to go on" YouTube (row 5); "the phone is the classroom and the trap" (insight 1); no laptop, so extensions don't reach her (row 4).
- **Why she'd switch from YouTube:** She keeps YouTube and gets the one thing phones lack: a pause before the feed. A peer-reviewed study of the similar "one sec" app found it cut opens of the target apps a lot over six weeks 🟡 (Grüning et al., PNAS 2023; I have not re-read the exact figure).
- **Effort (solo dev):** High (native Android; Google Play's rules on the Accessibility API are strict and need a clear declaration ❓).
- **Rules:** ⚠️ Doesn't touch the YouTube player (R7) or read what she watches (R11). Must never lock her out; "just relax" is always one tap.

### CONTRA-11. Teach-it-back voice note
- **What:** After a lecture, she records a 60-second explanation in Hindi, English or Hinglish, as if teaching a friend. The phone turns it into text; the LLM reads *her* words against her syllabus topic and asks one follow-up question about what she left out.
- **Pain it solves:** "I forget all the concepts … the next day" (row 13); "I completely watch lectures and make notes but can't be able to do self study" (row 16).
- **Why she'd switch from YouTube:** YouTube asks her to listen. This makes her speak, which is when she finds out what she doesn't know.
- **Effort (solo dev):** Medium (browser speech-to-text; iPhone weaker).
- **Rules:** ✅ The LLM reads only her own words and our syllabus (R4). Nothing from the video.

### CONTRA-12. Mistake book, not a notebook
- **What:** Forget pretty notes. Keep one list: questions she got wrong, why, and the right answer, by paper and topic. It comes back to her on a spaced schedule.
- **Pain it solves:** Notion users hand-build this: "note down mcqs which I made mistake during mcqs prectise" ✅; knows it in practice, blanks in the test (row 14).
- **Why she'd switch from YouTube:** It's the only list that shows exactly where she'd lose marks.
- **Effort (solo dev):** Low–Medium (a list plus a spaced-review queue).
- **Rules:** ✅ All her own data. Review counts are for her own view, not a reward (R8).

### CONTRA-13. Accountability partner report 🌶
- **What:** She names one person (a friend, a sibling, a parent) who gets a short weekly WhatsApp message: "7 check-ins, 3 PYQs, 1 missed day." She writes it, we format it; she can pause it anytime.
- **Pain it solves:** "I feel I will be more productive with it" about live-streaming study to be watched (row 36).
- **Why she'd switch from YouTube:** Someone she respects will read her week. That does more than any filter.
- **Effort (solo dev):** Low if we generate the text and she forwards it herself (share button); Medium if we send it (cost, consent of the recipient).
- **Rules:** ⚠️ Adults only (R10). The recipient never sees watch history. She controls it.

### CONTRA-14. Silent study room, audio-only, low data
- **What:** A "study with me" room with no video: just names, a shared timer and a "back in 10" button. Uses a few KB a minute, not a gigabyte.
- **Pain it solves:** "within just 40 minutes, my 1.3 GB data was consumed" (StudyStream review ✅); "how can mere students afford to pay inorder to not be alone while studying?" ✅
- **Why she'd switch from YouTube:** YouTube "study with me" streams are strangers she can't talk to; this is her pod, free, on 2G.
- **Effort (solo dev):** Medium (presence over websockets; no media server).
- **Rules:** ✅ Tracks presence in a study session, not video watching (R8).

### CONTRA-15. Senior on call
- **What:** Students who cleared the paper last attempt give 15 minutes a week to a small group of current students: "what I'd skip, what I'd do twice". Seniors get a certificate or a small UPI tip from students who choose to pay.
- **Pain it solves:** "Which is the best teacher for CMA Inter FM among all?" (row 21); doubts with no home (rows 29, 30); "nobody to talk to" (row 32).
- **Why she'd switch from YouTube:** Topper videos talk to thousands; a senior talks to her pod.
- **Effort (solo dev):** Medium (scheduling, a free video link such as Jitsi, trust and safety).
- **Rules:** ⚠️ 18+, report and block, no payment flows until we ask about cost and law. People judge lectures here, not our AI (R3).

### CONTRA-16. Printable weekly plan with QR codes 🌶
- **What:** Every Sunday she gets a one-page PDF: this week's topics, the lectures (as QR codes that open YouTube at the right second), one PYQ per day, and boxes to tick with a pen. Stick it on the wall.
- **Pain it solves:** "the phone is both the classroom and the distraction" (row 3); students who write in paper notebooks (research §2).
- **Why she'd switch from YouTube:** The plan lives on the wall, not in a feed. She opens YouTube only through a QR code for one lecture.
- **Effort (solo dev):** Low (PDF + QR generation from her plan).
- **Rules:** ✅ A link with `?t=` is a plain YouTube link, not copied data. No titles printed unless fetched fresh (R1); she can name lectures herself.

### CONTRA-17. Cohort mock test every Sunday
- **What:** A 30-minute test on the week's topics for everyone in the same attempt, at the same time. Results show her rank among people on the same paper, and which topics she lost marks on.
- **Pain it solves:** "I don't have any competitive environment at home" (row 31); no practice (row 17).
- **Why she'd switch from YouTube:** It recreates the coaching-centre Sunday test, free.
- **Effort (solo dev):** Medium–High (question bank written by humans or licensed teachers).
- **Rules:** ✅ Ranks for test scores, not for watching (R8). Questions must not be generated from YouTube videos (R4).

### CONTRA-18. The day ends when I say it ends
- **What:** Everything (check-ins, plans, counts) uses her own day boundary: "my day ends at 4 am." Built in from day one, not an afterthought.
- **Pain it solves:** YPT's reset "at like 4:30-5:00 AM … makes the whole time tracking thing useless" for all-nighters ✅; night study (rows 1, 28).
- **Why she'd switch from YouTube:** Not a switch reason alone, but it stops night students from quitting the tool in week one.
- **Effort (solo dev):** Low.
- **Rules:** ✅.

### CONTRA-19. Records you can never lose
- **What:** Every check-in, note and mistake auto-exports weekly to her own Google Drive or email as a PDF and CSV. Delete our app, keep her study history.
- **Pain it solves:** "I've been recording for the last 6 months, I cant just lose it all." (821 votes ✅); PW losing progress ✅.
- **Why she'd switch from YouTube:** Trust. The top rage trigger in every study app is lost records.
- **Effort (solo dev):** Low–Medium (scheduled export; Drive needs OAuth).
- **Rules:** ✅ Only our data exported; YouTube links as plain URLs.

### CONTRA-20. Small coaching centres as the customer
- **What:** Sell to the thousands of small offline coaching centres in tier-2 towns: a batch register where the teacher assigns YouTube lectures and daily PYQs, and sees who submitted. Students use it because their teacher checks it.
- **Pain it solves:** "no dots connect looks like studing randomly on YouTube" (Gate Smashers review ✅); lack of structure (EnsureIAS ✅).
- **Why she'd switch from YouTube:** Her teacher marks attendance here.
- **Effort (solo dev):** Medium code, High sales (visiting centres).
- **Rules:** ⚠️ Students may be under 18 in coaching centres: R10 means CS/CMA/CA professional-level batches only at first.

### CONTRA-21. "Explain my doubt to a human" link
- **What:** A doubt pinned to "42:10 in this lecture" becomes a shareable link. She sends it to her pod, a senior or the teacher on WhatsApp. They answer on a web page without signing up.
- **Pain it solves:** "It is not always possible to clear doubts in class" (row 29 ✅); "How did you solve your doubts … through YouTube" (row 30).
- **Why she'd switch from YouTube:** YouTube comments bury her question under 3,000 others. This goes to people who know her.
- **Effort (solo dev):** Low–Medium (a public page per doubt; spam limits).
- **Rules:** ✅ Video ID + second + her text (R1). The page embeds the player without covering it (R7).

### CONTRA-22. Money on the line 🌶
- **What:** She stakes ₹200 on a 30-day plan (a check-in on 25 of 30 days). Hit it, she gets it all back. Miss it, the money goes to a charity she chose, and her pod is told.
- **Pain it solves:** consistency (row 36); guilt spirals (row 34). Commitment contracts like stickK are the known model 🟡.
- **Why she'd switch from YouTube:** Loss hurts more than gain. ₹200 is real money to a student who can't afford coaching.
- **Effort (solo dev):** High (payments, refunds, legal check on whether this counts as a wager in India ❓).
- **Rules:** ⚠️ Tied to study check-ins, never to watching (R8). Costs money to run; ask first. Likely a later experiment, not a launch feature.

### CONTRA-23. Hindi-medium first
- **What:** The bot, plans and PYQ prompts work in Hindi and Hinglish from day one, not as a translation later.
- **Pain it solves:** "everything in it is in English. I am preparing for NEET from Hindi medium." (Pi Lens 2★ ✅)
- **Why she'd switch from YouTube:** YouTube serves Hindi lectures fine; the tools around them are English-only. This is a gap Pi Lens leaves open.
- **Effort (solo dev):** Medium (strings, LLM prompts, testing with real Hindi users).
- **Rules:** ✅.

### CONTRA-24. No app at all for the first month
- **What:** Run CONTRA-01, 02 and 04 by hand for 20 CS/CMA students in one Telegram group: the founder sends the nightly check-in and daily PYQ himself. Build software only for what they keep doing after four weeks.
- **Pain it solves:** Ours, not theirs: we have built a prototype one user rejected. This tests the real bet for ₹0.
- **Why she'd switch from YouTube:** She's not asked to. We learn whether accountability and practice pull her back daily.
- **Effort (solo dev):** Low code, Medium time (an hour a day).
- **Rules:** ✅ No YouTube data stored at all.

### CONTRA-25. The "just relax" button, honestly 🌶
- **What:** Inside the check-in, a button: "I'm taking tonight off." It counts as a planned rest, not a miss, and the plan re-flows. Two planned rests a week are normal.
- **Pain it solves:** "I feel from Inside that I can't do anything in life" (row 34); "frustrated thinking that i am wasting my time" (row 35).
- **Why she'd switch from YouTube:** Every other study app punishes a skipped day, so students quit after the first miss. This one expects it.
- **Effort (solo dev):** Low.
- **Rules:** ✅ No streaks at all (R8 spirit).

---

## My top 3

1. **CONTRA-01 + 02, the nightly check-in inside a pod of five.** Accountability is the pain behind the distraction, and a Telegram bot costs nothing to try.
2. **CONTRA-04, the daily PYQ written by hand.** CS and CMA are won by writing answers, and YouTube gives zero practice.
3. **CONTRA-03, share-to-study from the YouTube app.** Stop fighting YouTube; become its notebook, with the syllabus maps we already have.

Most surprising: **CONTRA-24.** Build nothing for a month. Run the check-in and PYQ by hand in one Telegram group, and code only what students still use in week four.

Sources for new claims: [Meta WhatsApp pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing), [YCloud on July 2025 per-message pricing](https://www.ycloud.com/blog/whatsapp-api-pricing-update), [Chrome: Web Share Target API](https://developer.chrome.com/docs/capabilities/web-apis/web-share-target). Grüning et al. (PNAS 2023) on "one sec" is from memory, not re-read ❓.
