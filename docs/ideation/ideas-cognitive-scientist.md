# Ideas from a cognitive scientist (round 2, step 2)

Persona: a researcher who studies memory, attention and habits. Date: 2026-09-29.

**How I see the problem.** YouTube is built for *watching*, and watching is the weakest way to learn: it feels smooth, so students judge they know it (the illusion of fluency), then "forget all the concepts and formulae the next day". The things that make memories last (recalling, spacing, mixing, explaining, sleeping between sessions) feel harder and slower, so nobody does them unless something makes them easy. That is our opening. We can't read the video (R4), but we don't need to: the learning happens in what the student *produces* (predictions, recalls, mistakes, explanations), and all of that is her own data. The player is also a tool: pause, seek and speed, driven by our own buttons, can turn a passive lecture into practice.

**Labels for citations.** ✅ = I checked the paper's details with a web search today. 🟡 = cited from my knowledge of the literature, not re-read today; check before quoting in public. Where an effect is weaker or contested, I say so.

**Round 1 overlap.** Round 1 already has blurt after a lecture (A10), recall questions from notes (D1), spaced review (D2), jump back (D3) and the blank-page test (D4). I don't repeat them. Several ideas below upgrade them (SCI-04, SCI-07, SCI-08) and I say how.

---

### SCI-01. Predict button
- **What:** One button beside the player: "Predict". It pauses the video; she types or says what comes next (the next step of a derivation, the answer to the question the teacher just asked, which section applies). Play resumes; after the answer, one tap: "right / partly / wrong". Wrong predictions turn into review cards at that second.
- **Principle:** Generating a prediction creates the chance to be surprised, and surprise drives learning (Brod, Hasselhorn & Bunge 2018 ✅). Errors followed by feedback help later recall (Kornell, Hays & Bjork 2009 🟡).
- **Pain it solves:** "Watching feels like studying but doesn't stick" (aspirants insight 2); "I completely watch lectures and make notes but can't be able to do self study".
- **Why she'd switch from YouTube:** A CS teacher asks "which section applies here?" to a class; on YouTube she just waits for the answer, here she commits first and finds out whether she was right.
- **Effort (solo dev):** Low. `pauseVideo`, `getCurrentTime`, a text box and a card type.
- **Rules:** ✅ R7 (our button, beside the player). R4: the LLM never sees the video; it can only turn her own prediction and her correction into a card.

### SCI-02. Checkpoints every N minutes (opt-in)
- **What:** She chooses "check me every 15 min". At each point our code pauses the video and asks for one line: "What was the last 15 minutes about?" She can skip with one tap or just press play on the player. Her lines become a self-made table of contents with timestamps.
- **Principle:** Short tests placed inside an online lecture cut mind wandering by about half and raised final test scores (Szpunar, Khan & Schacter 2013, PNAS 🟡). Segmenting long material at the learner's pace helps (Mayer & Chandler 2001 🟡).
- **Pain it solves:** "Every 30 minutes or so after studying I crave to go on one of the two"; 2-hour lectures (row 10); "Comment section is very important for time stamps in a 7 hour long video".
- **Why she'd switch from YouTube:** A 3-hour marathon turns into twelve 15-minute blocks with her own summary line for each, which also gives her the timestamps she now hunts for in the comments.
- **Effort (solo dev):** Low. A timer on `getCurrentTime`, a pause, a one-line box.
- **Rules:** ⚠️ R7 and "no gating": off by default; she turns it on; the player's own play button always resumes; we never cover the player. Don't pause during an ad (check player state; if unsure, wait).

### SCI-03. Two questions before play
- **What:** Before she presses play on a new lecture, a small box: "What do you expect this lecture to answer? Write 2 questions." Or, if she prefers, the app shows 2 prequestions made by the LLM **from the official syllabus topic she picked** (our data), never from the video. After the lecture, the same questions come back for her to answer.
- **Principle:** Prequestions before a video raised post-test scores (Carpenter & Toftness 2017 ✅). Caveat: a follow-up with authentic, longer lectures found smaller effects (Toftness, Carpenter et al. 2018 🟡), so keep it light and optional.
- **Pain it solves:** Passive watching (insight 2); "Aspirants often spend more time searching for the right videos than actually studying" (her own questions tell her which lecture answers what she needs).
- **Why she'd switch from YouTube:** She starts each lecture with a purpose and ends it with an answer she wrote herself.
- **Effort (solo dev):** Low (her questions) / Medium (LLM prequestions from syllabus text).
- **Rules:** ✅ R4: the LLM reads only the syllabus topic and her goal, not the title or description. R3: we don't judge whether the video covers the topic; she does. Skippable, never gates play (R8).

### SCI-04. Rewatch only the miss (bounded replay)
- **What:** When a review card fails, "Watch this bit again" plays a **window** (from 30 s before her note to 60 s after) and then our code pauses and asks her to try the card again right away. Improves round 1's D3: bounded, and it closes the loop with a second recall.
- **Principle:** Retrieval, then feedback, then retrieval again is the core of the testing effect (Roediger & Karpicke 2006 🟡; Butler & Roediger 2008 on feedback 🟡). Re-watching the whole lecture is re-reading, which has weak benefits (Callender & McDaniel 2009 🟡; Dunlosky et al. 2013 rate rereading "low utility" 🟡).
- **Pain it solves:** "Should I revise topics by watching recorded sessions as most of the students do?"; "Do not rewatch a complete 90-minute video because you forgot one five-minute method."
- **Why she'd switch from YouTube:** YouTube can only replay the whole thing; this replays the 90 seconds she actually forgot.
- **Effort (solo dev):** Low after notes and cards exist (`seekTo`, a timer, `pauseVideo`).
- **Rules:** ✅ R7 (our buttons and API calls). R1: stores video ID + seconds only.

### SCI-05. "Test before you rewatch"
- **What:** When she opens a lecture she has already finished, a line beside the player offers: "60 seconds first: write what you remember." Then her notes appear with the gaps she missed shown side by side, and chips like "rewatch 12:10–15:40" for each gap. Play works as normal the whole time.
- **Principle:** Illusion of fluency: a smooth explanation raises how much students *think* they learned without raising what they learned (Carpenter, Wilford, Kornell & Mullaney 2013 🟡). Students in active classes felt they learned less but learned more (Deslauriers et al. 2019, PNAS 🟡).
- **Pain it solves:** "revise by re-watching" (row 15); "just at the time of test i forget".
- **Why she'd switch from YouTube:** A 2-hour re-watch becomes 1 minute of recall plus 10 minutes of targeted replay.
- **Effort (solo dev):** Low–Medium.
- **Rules:** ⚠️ No gating: an offer shown below the player, one-tap dismiss, "don't ask again for this lecture". Never pause or block play to force it.

### SCI-06. Speed coach from her own results
- **What:** She can set speed from our own buttons (`setPlaybackRate`). The app pairs the speed she used with how she did on that lecture's checkpoints and cards, and shows it plainly: "At 2x your recall was 80%; at 2.5x, 45%." A suggested routine: first pass at 1.5–2x, then recall, then the misses at 1x.
- **Principle:** Up to 2x cost almost nothing in comprehension, immediately or a week later; beyond 2x it dropped; the time saved is best spent on extra study (Murphy, Hoover et al. 2022 ✅). The effect may not hold for hard material, which is why we measure *her*.
- **Pain it solves:** "Any tips to complete 2hr lectures videos more quickly"; "being able to adjust the playback speed is crucial for efficient revision" (PW review).
- **Why she'd switch from YouTube:** YouTube lets her go fast; this tells her *how fast is too fast for her* in costing vs law.
- **Effort (solo dev):** Low–Medium (log speed per session, join with card results).
- **Rules:** ✅ Judges the user, not the video (R3). R7: speed set through the API, which YouTube allows. For 18+ only (R10), as it learns from behaviour.

### SCI-07. Cards that retire (successive relearning)
- **What:** Instead of cards that repeat forever (round 1 D2), each card aims for **3 correct recalls on 3 different days**, then retires to a monthly check. Home shows "12 cards left to lock in for CSR", a finish line she can see.
- **Principle:** Successive relearning (recall to criterion, across spaced sessions) gives large, lasting gains (Rawson & Dunlosky 2011; Rawson, Dunlosky & Sciartelli 2013 🟡). Spacing beats massing (Cepeda et al. 2006 meta-analysis 🟡).
- **Pain it solves:** "I forget all the concepts and formulae the next day"; Anki's "high learning curve" and endless card piles.
- **Why she'd switch from YouTube:** A clear, finite job per topic ("lock in 12 cards") instead of a guilt pile.
- **Effort (solo dev):** Low (a simpler scheduler than FSRS).
- **Rules:** ✅ Cards are her data. R8: counts are study actions, not watching, and give no rewards.

### SCI-08. Sure or guess? (confidence + calibration)
- **What:** Before a card's answer shows, she taps "sure" or "guess". Every week she sees her calibration: "You were sure and wrong on 9 cards." Those "sure but wrong" cards get a special, earlier repeat.
- **Principle:** Students are overconfident about what they know, especially after re-study (Dunlosky & Rawson 2012 🟡; Koriat 1997 🟡). Errors made with high confidence are corrected best once feedback is given (hypercorrection effect, Butterfield & Metcalfe 2001 🟡).
- **Pain it solves:** "Knows it in practice, blanks in the test" (row 14); insight 2.
- **Why she'd switch from YouTube:** It shows her the gap between "I watched it" and "I know it", which no video app can.
- **Effort (solo dev):** Low.
- **Rules:** ✅.

### SCI-09. Mark "known" tomorrow, not today
- **What:** The syllabus map (round 1 C1) asks "how well do you know CSR?" **the next day**, after 3 quick recall cards, not right after the lecture. Her status is set by that delayed check. The map shows "last checked 12 days ago" per topic.
- **Principle:** Judgements of learning made after a delay are far more accurate than immediate ones (delayed-JOL effect, Nelson & Dunlosky 1991 🟡). Generating keywords after a delay also improves judgement of text understanding (Thiede, Anderson & Therriault 2003 🟡).
- **Pain it solves:** Syllabus status that lies because it records watching, not knowing; "I completely watch lectures ... but can't be able to do self study".
- **Why she'd switch from YouTube:** Her syllabus map finally means something before the exam.
- **Effort (solo dev):** Low on top of C1 and cards.
- **Rules:** ✅ Status is hers; nothing guessed from watching (R8).

### SCI-10. Mixed review, not topic blocks
- **What:** The daily review deliberately mixes papers and topics. For numerical papers (CMA costing, FM), she saves her own practice problems with the method hidden; the card asks "which method, and why?" before "solve it".
- **Principle:** Interleaving helps learners tell similar categories apart (Kornell & Bjork 2008 🟡; Rohrer & Taylor 2007 on maths problems 🟡; classroom replication by Rohrer, Dedrick & Stershic 2015 🟡). Learners wrongly prefer blocking (Yan, Bjork & Bjork 2016 🟡), so we explain why in one line.
- **Pain it solves:** "YouTube gives lectures but no practice" (row 17); one-shot and marathon studying (rows 11, 12).
- **Why she'd switch from YouTube:** Playlists are blocked by design (one chapter after another); this trains the exam skill of picking the right method cold.
- **Effort (solo dev):** Low (ordering) / Medium (problem cards with hidden method).
- **Rules:** ✅ Problems are her own text or photos of her own work, not video frames.

### SCI-11. "Why is this true?" prompts on her notes
- **What:** On any note, one tap asks the LLM for 1–2 "why" or "how does this differ from ..." questions built only from her notes ("Why does Section 135 apply only above ₹5 crore profit?", "How is this different from your note on CSR spending at 14:02?"). She answers in her own words; the answer is saved under the note.
- **Principle:** Elaborative interrogation (Pressley et al. 1987 🟡); rated "moderate utility" by Dunlosky et al. 2013 🟡, strongest when the learner has some prior knowledge, which she does after a lecture.
- **Pain it solves:** Copying notes that don't become understanding (row 16); law papers where "why" helps apply the rule.
- **Why she'd switch from YouTube:** Her notes start talking back to her.
- **Effort (solo dev):** Medium (Groq prompt, UI for answers).
- **Rules:** ✅ R4: reads only her notes. Label questions as AI-made; she can delete them. Privacy notice must mention the AI provider.

### SCI-12. Worked example, then your turn (fading)
- **What:** When the teacher solves a numerical, she taps "Worked example" at that second. The app saves it and, two days later, gives her a card: "Solve a similar one" with the teacher's steps she wrote down **faded** one by one over later reviews (first all steps shown but the last, then two missing, then none). She adds the numbers herself or from her question bank.
- **Principle:** Worked examples beat problem solving for novices (Sweller & Cooper 1985 🟡); fading the steps eases the move to solving alone (Renkl & Atkinson 2003 🟡); self-explaining each step helps (Chi et al. 1989 🟡). Once expert, examples stop helping (expertise reversal, Kalyuga et al. 2003 🟡), so fading matters.
- **Pain it solves:** "I have no any source to do practice" (row 17); CMA/CA numerical papers.
- **Why she'd switch from YouTube:** The teacher's example becomes her own practice ladder, tied to the exact second she can replay.
- **Effort (solo dev):** Medium (step-by-step card UI).
- **Rules:** ✅ Her own typed steps; no frames or transcript.

### SCI-13. Listen first, write after
- **What:** A note mode for the "notes are too slow" crowd. While the lecture plays she writes nothing, only taps "mark" (one tap stamps the second). At each natural pause (her marks, or a checkpoint from SCI-02) the video pauses and she writes the note **from memory** for that stretch, with her marks as anchors she can replay.
- **Principle:** Generation effect: what you produce yourself is remembered better than what you copy (Slamecka & Graf 1978 🟡; meta-analysis Bertsch et al. 2007 🟡). Reviewing notes matters more than taking them (Kiewra 1985 🟡). Writing verbatim while watching adds load and shallow processing (laptop vs longhand, Mueller & Oppenheimer 2014 🟡, though replications were mixed: Morehead, Dunlosky & Rawson 2019 🟡).
- **Pain it solves:** "how to write notes faster while watching lectures???"; "Making notes take a real long time" (rows 8, 9).
- **Why she'd switch from YouTube:** Fewer pauses, faster lectures, and notes that are already a recall exercise.
- **Effort (solo dev):** Low–Medium (a mode on top of round 1 A1).
- **Rules:** ✅ R7 (pause via API, beside the player).

### SCI-14. Draw it from memory
- **What:** A small drawing pad beside the player (and on the review screen). A card can say "Draw the cost sheet structure" or "Draw the ESG reporting flow"; she sketches from memory, then compares with the drawing she saved earlier. A photo of her paper sketch works too.
- **Principle:** Dual coding (Paivio 1971/1986 🟡; Mayer's multimedia principles 🟡). Drawing a word's meaning beat writing it out in recall tests (Wammes, Meade & Fernandes 2016, "the drawing effect" 🟡).
- **Pain it solves:** Forgetting structures and flows; row 13.
- **Why she'd switch from YouTube:** Her own diagrams become revision cards linked back to the second the teacher drew them.
- **Effort (solo dev):** Medium (canvas, image storage).
- **Rules:** ✅ Her drawing or photo. ❌ never capture the video frame; the pad must not overlap the player.

### SCI-15. Teach it back in 60 seconds (Hindi, English or Hinglish)
- **What:** After a topic, "Explain it to a friend": she speaks for 60 seconds; the browser types it. The LLM compares her explanation with **her own notes** and lists what she left out ("You didn't mention the 2% rule from your note at 22:15"), each with a jump link.
- **Principle:** Learning by explaining and expecting to teach (Nestojko et al. 2014 🟡; Fiorella & Mayer 2013 🟡). Its benefit comes mostly from the retrieval involved (Koh, Lee & Lim 2018 🟡). Free recall is retrieval practice (Karpicke & Blunt 2011, Science 🟡).
- **Pain it solves:** Studying alone with nobody to talk to (rows 32, 33); Hindi-medium students left out of English-only tools (Pi Lens review).
- **Why she'd switch from YouTube:** Speaking is faster than typing on a phone, and she hears where her explanation breaks.
- **Effort (solo dev):** Medium (speech-to-text varies by browser; LLM compare).
- **Rules:** ✅ R4: LLM reads her transcript of *her own voice* and her notes only. Mic permission; don't keep audio, only text.

### SCI-16. If-then study plans with a deep link
- **What:** She writes plans as "If [cue], then [action]": "If it's 9:30 pm and dinner is done, then I open ESG lecture 4 at 12:10." At the cue time, a notification opens the app straight to that lecture at that second, with her 2 due cards first.
- **Principle:** Implementation intentions: a medium-to-large effect on goal attainment across 94 studies (Gollwitzer & Sheeran 2006 🟡).
- **Pain it solves:** Working CS student with "3–4 hours at night" (row 28); consistency (row 36); backlog (row 7).
- **Why she'd switch from YouTube:** YouTube's notification sends her to a new video; this one sends her to *her* plan at the exact second she stopped.
- **Effort (solo dev):** Medium (web push for a PWA; iOS support is weaker ❓).
- **Rules:** ✅ The cue opens a plan, not a reward. R8: no streaks attached.

### SCI-17. Parking lot for stray thoughts
- **What:** A small "Park it" box beside the player: when "check Instagram", "that video about X" or "call Riya" pops into her head, she types it in two words and keeps going. At the end of the session the parked items appear: "Do these now or drop them."
- **Principle:** Unfinished tasks leave attention residue that hurts the next task (Leroy 2009 🟡). Writing down a plan for unfinished goals frees the mind of them (Masicampo & Baumeister 2011 🟡). Interruptions cost time to recover (Mark, Gudith & Klocke 2008 🟡).
- **Pain it solves:** "Every 30 minutes or so ... I crave to go on one of the two"; "The phone is both the classroom and the distraction".
- **Why she'd switch from YouTube:** YouTube's answer to a stray thought is a sidebar that feeds it; this puts it on hold.
- **Effort (solo dev):** Low.
- **Rules:** ✅.

### SCI-18. Came back? Rewind to where your mind left
- **What:** If she switches away from our tab or app while the lecture plays (Page Visibility API on our page), when she returns a line below the player says: "You were away 3 min 40 s. Rewind to 32:10?" One tap `seekTo`. A weekly private note: "You left 14 times, mostly after 25 minutes." That helps her set SCI-02's checkpoint gap.
- **Principle:** Mind wandering during video lectures rises over time and hurts retention (Risko et al. 2012 🟡; Szpunar et al. 2013 🟡).
- **Pain it solves:** Row 1 ("I get distracted much to youtube"); losing your place (StudyTube review "our previous video would have gone").
- **Why she'd switch from YouTube:** It notices the gap she didn't, and fixes it with one tap.
- **Effort (solo dev):** Low.
- **Rules:** ✅ Reads only our page's visibility; nothing about other apps. R8: shows her data to her, no rewards. R11: logs keep no video IDs. R10: 18+ only as it learns from behaviour.

### SCI-19. Same cue, same first move (a start ritual)
- **What:** Every session opens the same way: her chosen cue ("chai, then open app") and a fixed 2-minute warm-up of 3 due cards, then "Resume ESG at 32:10". She picks the ritual once; the app keeps it identical so it becomes automatic.
- **Principle:** Habits form through repeating an action in a stable context; the median time to automaticity was 66 days, with a wide range (Lally et al. 2010 🟡). Habits are cued by context, not by motivation (Wood & Neal 2007 🟡). Starting with a warm retrieval also primes the session (🔵 my reasoning).
- **Pain it solves:** Inconsistency (row 36); "I loose my motivation for studying" (row 7).
- **Why she'd switch from YouTube:** YouTube's first screen is a feed; this first screen is two minutes of her own work and then her lecture.
- **Effort (solo dev):** Low.
- **Rules:** ✅ Not a reward and not a gate: a "skip to lecture" link is always there.

### SCI-20. Bedtime 5, morning 5 🌶
- **What:** At a bedtime she sets, 5 cards from today's new notes. Next morning, the same 5 again. The app shows her own before/after: "Night: 2 of 5. Morning: 4 of 5." Set for the night-study crowd; the "day" ends when *she* says (answering YPT's 5 AM reset complaint).
- **Principle:** Sleep consolidates memory (Diekelmann & Born 2010 🟡). Sleeping *between* two study sessions halved the practice needed to relearn and improved recall 6 months later (Mazza et al. 2016 ✅).
- **Pain it solves:** Night study (rows 1, 28); "I forget all the concepts ... the next day"; all-nighters breaking "today" (YPT review).
- **Why she'd switch from YouTube:** YouTube at midnight is a rabbit hole; this is a 5-minute close to the day that she can see working the next morning.
- **Effort (solo dev):** Low (reuses cards; notification timing).
- **Rules:** ✅. Careful wording: no health advice beyond "sleep helps memory"; never a streak.

### SCI-21. Backlog triage by test-first 🌶
- **What:** For a 100-lecture backlog, she picks the syllabus topics behind it. For each topic: 2 minutes of "write what you already know" plus a sure/guess rating. The app sorts the backlog into three lists she can edit: "watch fully", "watch at 2x and check", "only a recall check". It never decides on the video, only on *her* answers.
- **Principle:** Pretesting shows what you don't know and prepares you to learn it (Richland, Kornell & Kao 2009 🟡). Learners who already know a topic gain little from full instruction (expertise reversal, Kalyuga et al. 2003 🟡).
- **Pain it solves:** "20, 50, 100 or 150 Lectures Backlog?"; "I have a huge backlog" (row 7); guilt spiral (row 34).
- **Why she'd switch from YouTube:** It turns "150 lectures" into "38 to watch, 60 fast, 52 just to check", from her own evidence.
- **Effort (solo dev):** Medium.
- **Rules:** ✅ R3: judges the user's knowledge, not videos. The sort is a suggestion; nothing is hidden or locked.

### SCI-22. Fresh start, no red marks
- **What:** After missed days the app shows no broken streak and no red calendar. It offers a "fresh start" on the next Monday, the 1st of the month, or the day after a test, with a smaller plan ("3 cards and 1 lecture a day this week"). One line of self-forgiveness text she can write or skip.
- **Principle:** People start goals more often at temporal landmarks (fresh-start effect, Dai, Milkman & Riis 2014 🟡). Students who forgave themselves for procrastinating on one exam procrastinated less before the next (Wohl, Pychyl & Bennett 2010 🟡).
- **Pain it solves:** "I haven't studied anything from 2 weeks. I feel from Inside that I can't do anything in life" (row 34); "i get very frustrated thinking that i am wasting my time" (row 35).
- **Why she'd switch from YouTube:** On a bad week YouTube is where she hides; this is a place that doesn't punish her for coming back.
- **Effort (solo dev):** Low.
- **Rules:** ✅ Fits R8 by design (no streaks).

### SCI-23. Exam-shaped spacing, explained
- **What:** From her exam date, the app sets revision gaps per topic and says why in one line: "Next CSR review in 9 days: exam in 70 days, so reviews every ~10 days work best." As the exam nears, gaps shrink.
- **Principle:** The best gap between study sessions grows with how long you must remember; roughly 10–20% of the retention interval for about a year's retention (Cepeda et al. 2008 🟡). The IES practice guide recommends spacing and quizzing (Pashler et al. 2007 🟡).
- **Pain it solves:** "Lectures ... pile up into backlogs" (insight 6); no plan (insight 9).
- **Why she'd switch from YouTube:** Her December exam date shapes her whole week, and the app shows its reasoning.
- **Effort (solo dev):** Medium (a small scheduler; the explanation is the hard part).
- **Rules:** ✅.

### SCI-24. Mistake log with a "why wrong" tag
- **What:** When she gets a PYQ or mock question wrong, she logs it in 10 seconds: the question (typed or photo of her own paper), a tag (concept / misread / careless / time), and the lecture second where she learned it. The log becomes cards; the tags show her patterns ("40% of misses are misreads").
- **Principle:** Learning from errors, with feedback, is powerful when the setting is low-stakes (Metcalfe 2017 🟡). Hypercorrection for confident errors (Butterfield & Metcalfe 2001 🟡).
- **Pain it solves:** Notion users hand-build this ("I ... note down mcqs which I made mistake during mcqs prectise"); no practice on YouTube (row 17).
- **Why she'd switch from YouTube:** Every mistake links back to the exact second of the teacher explaining it.
- **Effort (solo dev):** Low–Medium.
- **Rules:** ✅ Her questions and photos. ⚠️ If she photographs a copyrighted paper, keep it private to her; never publish.

### SCI-25. Swap questions with a study twin 🌶
- **What:** Two friends on the same paper each write 3 questions from **their own notes** on a lecture and send them to each other. She answers his; he answers hers. Wrong answers jump to the second in the lecture that the *writer* noted.
- **Principle:** Writing questions for others is generative; answering them is retrieval. Guided reciprocal peer questioning improved lecture comprehension (King 1992 🟡).
- **Pain it solves:** "I don't have any competitive environment at home" (row 31); "How do I take out my emotions when I have nobody to talk to?" (row 32); "Seeing others studying is like a boost."
- **Why she'd switch from YouTube:** YouTube comments are strangers; this is a friend quizzing her on the exact lecture she watched.
- **Effort (solo dev):** Medium–High (pairing, sharing, abuse reporting).
- **Rules:** ⚠️ Opt-in, 18+ (R10), shares only user-written text and video ID + seconds (R1). No leaderboards or points (R8).

### SCI-26. Exam conditions on demand
- **What:** A weekly "exam room" mode: 20 minutes, timer visible, no notes, mixed cards and her saved PYQs, answers written out (for CS descriptive papers) and then checked against her notes. She can also mark "studied somewhere new today" (library, terrace), and cards from that session get tested elsewhere.
- **Principle:** Retrieval practice protected memory under stress, while re-study did not (Smith, Floerke & Thomas 2016, Science 🟡). Studying in varied places improved recall in some classic studies (Smith, Glenberg & Bjork 1978 🟡); later work finds the context effect is small and inconsistent, so this part is a light touch.
- **Pain it solves:** "just at the time of test i forget" (row 14).
- **Why she'd switch from YouTube:** It rehearses the one moment YouTube never prepares her for: the exam hall.
- **Effort (solo dev):** Low–Medium.
- **Rules:** ✅.

### SCI-27. "Known", not "watched" (the honest meter)
- **What:** The app never shows "hours watched" or "lectures completed" as progress. Its one progress number is **"cards you can recall today, per paper"** and the share of syllabus topics checked in the last 14 days. Watching time is visible only in a private diary, never as a goal.
- **Principle:** Self-testing, not re-study time, predicts grades (Hartwig & Dunlosky 2012 🟡). Performance during study is a poor guide to learning (Soderstrom & Bjork 2015 🟡).
- **Pain it solves:** "Watching ≠ studying" (aksias); hoarding without studying (row 39); strategy-video loops (row 40).
- **Why she'd switch from YouTube:** It is the first number in her study life that tells the truth about exam readiness.
- **Effort (solo dev):** Low once cards exist.
- **Rules:** ✅ Fits R8 better than any watch-based meter: nothing counts or rewards viewing.

### SCI-28. Ad break, recall break 🌶
- **What:** Mid-roll ads can't be skipped or covered (R7). When she taps "ad's on" (or, if the player state reliably shows it, automatically ❓), one due card appears **below** the player. The ad plays in full, in view.
- **Principle:** Short, spaced retrieval spread through the day beats one long block (Cepeda et al. 2006 🟡); this uses dead time for it (🔵).
- **Pain it solves:** "Mid-lesson, a 30-second insurance ad breaks a derivation in half" (weak source, row 41).
- **Why she'd switch from YouTube:** It turns the most annoying 30 seconds into one quick win.
- **Effort (solo dev):** Low (manual button). Automatic detection ❓: the IFrame API doesn't clearly expose ad state.
- **Rules:** ⚠️ R7: never cover, hide, mute or shrink the ad or player; never block its controls. Check YouTube's API policies on drawing attention away from ads before shipping; if unclear, drop it.

### SCI-29. My own voice as the cue 🌶
- **What:** On any card, she can record a 5-second voice hint in her own words ("remember: two percent, three years average"). Hints are shown only after a failed first attempt, never before.
- **Principle:** Hints after a failed attempt keep the retrieval effort while preventing a long stall (desirable difficulties, Bjork 1994; Bjork & Bjork 2011 🟡). Self-generated cues beat others' cues for recall (Tullis & Benjamin 2015 🟡).
- **Pain it solves:** Anki's card-making cost ("making cards takes a bit of time"); Hindi-medium students.
- **Why she'd switch from YouTube:** Revision in her own voice and language, not the teacher's 2-hour one.
- **Effort (solo dev):** Medium (audio storage; costs; keep short).
- **Rules:** ✅ Her audio only. Storage needs free-tier limits; ask before any cost.

---

## Rule notes across all ideas

- Every idea runs on what the student writes, says, draws or taps, plus video ID + seconds (R1, R4). None reads titles, descriptions or transcripts; none judges videos (R3).
- The player is only controlled through the IFrame API from our own buttons or opt-in timers; nothing sits on top of it (R7).
- No points, coins or streaks anywhere. Counts are study actions shown to her, never a reward for watching (R8). Behaviour-based features (SCI-06, 18, 21) are 18+ only (R10). Logs hold no video IDs (R11).

## My top 3

1. **SCI-01 + SCI-02 + SCI-18: a lecture that asks you back.** Predict button, opt-in checkpoints and "you were away, rewind?" together turn watching into practice inside the player's own time. It's cheap to build, and nothing on YouTube, Pi Lens or SyncStudy does it without reading the video.
2. **SCI-05 + SCI-04: test before you rewatch, then replay only the miss.** This replaces the #1 revision habit, re-watching, with something shorter and far more effective, and it's the clearest "why use this instead of YouTube" story.
3. **SCI-07 + SCI-27: cards that retire, and a "known, not watched" meter.** A finite job per topic and an honest progress number. It gives her a daily reason to open the app even on days she watches nothing, and it follows R8 by design.

**Most surprising:** SCI-20, Bedtime 5 / morning 5. Mazza et al. 2016 found that sleeping between two sessions halved the practice needed to relearn. It suits a night-studying Indian aspirant exactly, and it costs almost nothing to build on top of cards.

## Sources checked today
- [Murphy et al. 2022, Learning in double time (Applied Cognitive Psychology)](https://onlinelibrary.wiley.com/doi/abs/10.1002/acp.3899)
- [Carpenter & Toftness 2017, prequestions and video (JARMAC)](https://www.sciencedirect.com/science/article/abs/pii/S2211368116301103)
- [Brod, Hasselhorn & Bunge 2018, prediction and surprise (Learning and Instruction)](https://www.sciencedirect.com/science/article/abs/pii/S0959475217303468)
- [Mazza et al. 2016, Relearn faster and retain longer (Psychological Science)](https://doi.org/10.1177/0956797616659930)
