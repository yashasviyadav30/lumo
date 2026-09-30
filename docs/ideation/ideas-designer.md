# Ideas from a product designer (Instagram / Duolingo / Spotify / Notion lens)

ID prefix: DESIGN. Date: 2026-09-29. Labels: ✅ primary source, 🟡 secondary, 🔵 my reasoning, ❓ unknown.

## How I see the problem

YouTube wins the first three seconds: you open it and something is already waiting for you. Our app opens to a search bar, so it loses before the student has done anything. 🔵 The fix is not a better search. Home has to open on something only we have: *her* half-finished lecture, *her* doubts, *her* notes from yesterday. Then every tap during a lecture must work with one thumb, because the other hand holds a pen. And the app needs moments worth sharing in a WhatsApp group, because that is how anything spreads in Indian college batches. 🔵 Most apps that build habits run on streaks and rewards. R8 bans those for watching, so our loop has to rest on things that feel good in themselves: seeing your own progress, finishing a small task, having company, and knowing who you are as a studier.

Each idea names the pattern it borrows and says what changes for study.

---

### DESIGN-01. "Aaj" card: Home opens on one thing to do
- **What:** Home's top card shows one big action, not a feed: "Resume Section 135 at 42:10" or "4 recall cards · 2 min" or "1 doubt still open". One thumb tap starts it. Below it, at most two smaller cards. The card changes by time of day (morning = recall, night = resume lecture). *Borrowed from:* Spotify's Home "Jump back in" row and Daylist; Duolingo's single "Start" button. *For study:* the card never suggests a new video from YouTube; it only points at her own unfinished things.
- **Pain it solves:** "Aspirants often spend more time searching for the right videos than actually studying" (research-aspirants #22); lecture backlog (#7); losing your place (college #5).
- **Why she'd switch from YouTube:** YouTube's Home asks "what's new?"; ours says "here's where you stopped", so the first tap is study, not scrolling.
- **Effort (solo dev):** Low–Medium. The data (resume point, due cards, doubts) comes from round 1's A8, D2 and A4; this is layout plus simple ranking rules.
- **Rules:** ✅ R1: stores video ID + seconds; titles re-fetched when shown. R3/R4: ranking uses only her data. R8: no reward, only a pointer.

### DESIGN-02. First 60 seconds: value before sign-up
- **What:** A new user sees three buttons: "Paste my teacher's playlist", "Pick my paper" (CS ESG, CMA Costing…), "Just try a lecture". Within 60 seconds she is inside a lecture with the note bar live and has made her first note. Sign-up comes after, framed as "Save your 1 note". *Borrowed from:* Duolingo's onboarding (you finish a lesson before you create an account). *For study:* the "lesson" is her own teacher's lecture and her own first note, so she leaves with something that is hers.
- **Pain it solves:** the sister's verdict: "It doesn't feel different from YouTube." Today's first screen is sign-up then a search box, which is exactly what YouTube looks like.
- **Why she'd switch from YouTube:** in the first minute she does something YouTube can't (a note stamped at 3:12 that jumps back), before being asked for anything.
- **Effort (solo dev):** Medium. Guest notes kept locally, moved to the account at sign-up.
- **Rules:** ⚠️ R10: an "I am 18 or older" check must come first, before any data is kept. R1: guest notes hold only video ID + seconds + her text. Playlist import uses cheap calls, not the 100/day search quota.

### DESIGN-03. The thumb bar
- **What:** A fixed bar just below the player, within thumb reach: **Mark · Doubt · ★ · −10s · Pause**. Big targets (48 px+), light buzz on tap, no typing needed. Long-press Mark opens quick chips: "Formula", "Definition", "PYQ aaya tha", "Samajh nahi aaya". *Borrowed from:* the Instagram Reels side rail (every action under your thumb) and Spotify's Now Playing controls. *For study:* the actions are capture, not likes.
- **Pain it solves:** "how to write notes faster while watching lectures???" (#8); "Making notes take a real long time" (#9). Research: phone-only students (#4).
- **Why she'd switch from YouTube:** marking an important moment costs one tap without looking away; on YouTube she has to pause, open another app and type.
- **Effort (solo dev):** Low. Round 1's A1 note model plus a well-sized bar.
- **Rules:** ✅ R7: below the player, never over it; our buttons call `getCurrentTime`, `seekTo`, `pauseVideo`. R8: nothing counted as a reward.

### DESIGN-04. Mark now, write later
- **What:** Marks made during the lecture are empty on purpose. When she pauses or the lecture ends, a small tray slides up: "You marked 6 moments. Fill them in?" Each one replays 10 seconds around the mark while she types or speaks. Unfilled marks wait in an inbox. *Borrowed from:* Instagram drafts and Gmail's "snooze": capture now, finish later. *For study:* writing happens right after the lecture, which is also a light recall moment.
- **Pain it solves:** notes too slow (#8, #9); "Do not rewatch a complete 90-minute video because you forgot one five-minute method" (college #25).
- **Why she'd switch from YouTube:** she can watch the whole lecture without breaking flow and still end with real notes.
- **Effort (solo dev):** Low–Medium. A "draft" state on notes and a tray UI.
- **Rules:** ✅ Her text only. R7: the replay uses `seekTo` from our button.

### DESIGN-05. Study Stories: yesterday's notes, tap-through every morning
- **What:** At the top of Home, a ring around her avatar means "yesterday's notes are ready". Tap and it plays like Stories: one of her own notes per screen, 5–8 screens. Tap right = next. "Jaanti hoon" (I know this) or "Phir se" (again) feeds spaced review. Swipe up = jump to that second in the lecture. *Borrowed from:* Instagram Stories. *For study:* the stories are her own notes, and the ring tells her something is waiting without a streak.
- **Pain it solves:** "I forget all the concepts and formulae the next day" (#13); revising by rewatching (#15).
- **Why she'd switch from YouTube:** it takes the same thumb motion as Instagram and 90 seconds, and it fixes the thing she fears most: forgetting.
- **Effort (solo dev):** Low–Medium. Reuses notes and D2 scheduling; the Stories viewer is a simple full-screen carousel.
- **Rules:** ✅ R4: no LLM needed; if questions are generated, only from her notes. R8: counts cards reviewed for her own view, no reward.

### DESIGN-06. Study Wrapped
- **What:** At the end of each month, and after the exam, a swipeable recap: "212 notes · 38 doubts solved · your busiest hour was 1 AM · the topic you marked most: CSR · your fastest-improving paper: ESG". The last card is a square image made for WhatsApp status. *Borrowed from:* Spotify Wrapped. *For study:* it counts study actions (notes, doubts, recall), never hours watched.
- **Pain it solves:** guilt spiral: "I feel from Inside that I can't do anything in life" (#34); "I get very frustrated thinking that I am wasting my time" (#35). YPT users love "I know All my faults, when I wasted time, when I studied hard" (college, YPT 5★).
- **Why she'd switch from YouTube:** YouTube's history shows what she watched; Wrapped shows what she *did*, and she'll want to post it.
- **Effort (solo dev):** Medium. Queries are easy; good-looking shareable cards take design time (canvas → PNG).
- **Rules:** ⚠️ R8: leave watch time out of the shareable card so it can't read as a reward for watching. R1: teacher or channel names only if fetched fresh, or use the names she typed. Sharing is opt-in.

### DESIGN-07. Doubt card for WhatsApp
- **What:** Any doubt can become a clean image card: "Stuck at 42:10 · CS ESG · Why does Section 135 exclude…?" plus a link. The friend taps the link and our web page opens at that exact second, with a box to answer. No account needed to answer. The answer lands in her Doubts board. *Borrowed from:* Instagram's "Add Yours" sticker and Google Docs comment links. *For study:* the thing shared is a question at a moment, which pulls a friend into the app to help.
- **Pain it solves:** "nobody … bothers to respond to the questions asked!" (college #10); "How did you solve your doubts while preparing for the JEE through YouTube" (#30); crowded classes (#29).
- **Why she'd switch from YouTube:** YouTube comments are strangers; this sends the exact moment to the three friends who will actually answer.
- **Effort (solo dev):** Medium. Share-card image, public doubt page, anonymous answer with rate limiting.
- **Rules:** ⚠️ R10: answerers who aren't signed in must still pass an 18+ check before we keep their text. Moderation needed on the answer box. R1: card shows her text and her paper name, not the YouTube title. R7: the friend's page embeds the official player.

### DESIGN-08. Turn the WhatsApp group into a study room
- **What:** One link, pasted into the batch's WhatsApp group, creates a room. Members see a quiet list: "Riya · Costing Ch 4 · 12 notes today", "Aman · 3 doubts solved". No chat (they already have WhatsApp). *Borrowed from:* Strava clubs and Spotify Blend's invite link. *For study:* the room shows study actions only, never which video someone is watching.
- **Pain it solves:** "I don't have any competitive environment at home unlike coaching institutes" (#31); "Seeing others studying is like a boost" (college #20); "how can mere students afford to pay inorder to not be alone while studying?" (college #19).
- **Why she'd switch from YouTube:** her real classmates are in here, free, with no feed of strangers.
- **Effort (solo dev):** Medium. Groups, invite links, a daily summary query.
- **Rules:** ⚠️ R8: no leaderboard ranking; show a list sorted by name or recent activity, not a score. R10: 18+ only. R11: room activity never logs video IDs or titles. Opt-in per member.

### DESIGN-09. Blend: two notebooks on one lecture
- **What:** She and a friend both studied the same lecture. Blend lays both sets of marks on one timeline: moments only she marked, only the friend marked, and both marked (probably important). Each side can copy the other's note in one tap. *Borrowed from:* Spotify Blend. *For study:* the overlap is a signal the two friends made themselves, not our AI judging the video.
- **Pain it solves:** notes too slow (#8, #9); studying alone (#33).
- **Why she'd switch from YouTube:** she gets half her notes from a friend and sees in a second what both of them found important.
- **Effort (solo dev):** Medium. Share permissions and a merged timeline.
- **Rules:** ✅ R3: the "both marked" signal comes from users, not from judging the video. ⚠️ Opt-in for each lecture; the friend can un-share.

### DESIGN-10. My study profile
- **What:** A profile page that says who she is as a studier: "CS Professional · Dec 2026 attempt · night owl · Hinglish notes". Below, a grid of her papers as tiles with covers she picks, each showing her own marked progress. A private-by-default public link lets her show a senior or a study twin. *Borrowed from:* the Instagram profile grid and Letterboxd's profile. *For study:* the grid is papers and progress, not posts; no follower counts.
- **Pain it solves:** the sister's own ask: a "Personal" page holding her notes, links and material; self-doubt without coaching (#38).
- **Why she'd switch from YouTube:** YouTube has no "me as a student"; this page makes the app hers.
- **Effort (solo dev):** Low–Medium. Mostly a view over data we already plan to keep.
- **Rules:** ✅ Her data. ⚠️ Public link off by default; no follower or like counts (keeps it from turning into a feed).

### DESIGN-11. Night-owl mode and "my day ends at…"
- **What:** She sets when her day ends (say 4 AM). After 10 PM the app dims to a warm dark theme, text gets larger, and the thumb bar moves lower. Counts, reviews and Wrapped all use her day, not midnight. *Borrowed from:* Spotify Daylist (changes by time of day) and iOS Sleep focus. *For study:* the time rules serve night study rather than fight it.
- **Pain it solves:** "the app resets daily study time at like 4:30-5:00 AM … that makes the whole time tracking thing useless" (college #18); night study because home is noisy (#1); working CS students with "3–4 hours at night" (#28).
- **Why she'd switch from YouTube:** it feels built for how she studies, at 1 AM, which no other app does.
- **Effort (solo dev):** Low. A setting, CSS theme and a date offset.
- **Rules:** ✅.

### DESIGN-12. The notification is the task
- **What:** One push a day at most, at a time she picks. The notification itself holds one recall card: "Section 135: which companies must spend on CSR?" with actions "Show answer" and "Later". Answering takes 15 seconds from the lock screen. If she ignores three in a row, it asks once "Fewer reminders?" and backs off. *Borrowed from:* Duolingo's reminders, with the guilt taken out. *For study:* no "you'll lose your streak", only a small useful task.
- **Pain it solves:** forgets next day (#13); "Every 30 minutes or so after studying I crave to go on one of the two" (#5): the phone buzz becomes study instead of a pull back to YouTube.
- **Why she'd switch from YouTube:** YouTube's notifications pull her into new videos; ours finishes a study task without opening anything.
- **Effort (solo dev):** Medium. Web push on a PWA; on iPhone it works only once the app is added to the home screen (iOS 16.4+) 🟡; action buttons vary by platform ❓.
- **Rules:** ✅ Card built from her notes (R4). R8: no streak, no reward, no guilt copy.

### DESIGN-13. Comeback screen, not a broken streak
- **What:** After days away, Home does not show a zero or a lost streak. It says: "Welcome back. You were on Costing Ch 4 at 18:20. Want a 3-day catch-up?" and offers a tiny first step (one lecture, 5 cards). *Borrowed from:* Headspace's gentle return screens; the opposite of Duolingo's streak loss. *For study:* the design goal is a return within one tap, with no shame.
- **Pain it solves:** "I haven't studied anything from 2 weeks … I even sometimes thought to give up" (#34); backlog and lost motivation (#7).
- **Why she'd switch from YouTube:** after a bad week, this is the app that makes starting again easy instead of the one that makes her feel worse.
- **Effort (solo dev):** Low. A Home state and some copy.
- **Rules:** ✅ Uses her own data; no rewards.

### DESIGN-14. Backlog shredder 🌶
- **What:** Her backlog (all unwatched lectures in her imported playlists) shows as a stack of cards. She swipes each: right = "Must watch", up = "Skim at 2x", left = "Skip, the one-shot covers it". Then a plan: "Must: 23 lectures ≈ 31 hrs → 11 days at your pace". *Borrowed from:* Tinder's swipe and Superhuman's inbox zero. *For study:* she makes every call; the app only does the maths.
- **Pain it solves:** "How to Clear 100+ Lecture Backlogs in 1 Week" (research-aspirants §2); 2-hour lectures and one-shots (#10, #11, #12).
- **Why she'd switch from YouTube:** a 100-lecture backlog turns into a finite, sorted list in five minutes of swiping, and it feels good.
- **Effort (solo dev):** Medium. Swipe UI plus durations from `videos.list` (cheap).
- **Rules:** ✅ R3: she judges each lecture; we never label or rank videos. R1: titles and durations refreshed, only IDs and her choice kept. R8: nothing gated; "Skip" still plays if tapped.

### DESIGN-15. Hinglish and Hindi UI, chosen in one tap
- **What:** A language switch on the first screen: English · Hinglish · हिन्दी. Hinglish labels are how students talk: "Samajh nahi aaya", "Baad mein", "Phir se", "Ho gaya". Voice notes accept Hindi. *Borrowed from:* PhonePe and Google Pay India, which ship local-language UIs from day one. *For study:* notes and recall work the same in all three.
- **Pain it solves:** "everything in it is in English. I am preparing for NEET from Hindi medium" (college #22, a Pi Lens review).
- **Why she'd switch from YouTube:** the app talks like her; Pi Lens, the closest rival, doesn't.
- **Effort (solo dev):** Low–Medium. String files; translation checked by a native speaker.
- **Rules:** ✅.

### DESIGN-16. Lite mode for cheap phones and thin data
- **What:** The app shell stays under ~150 KB and loads in 2 seconds on a slow 4G phone. Notes, doubts and recall work fully offline and sync later. The player loads only when she taps play, not on page open. A small line shows "Revision today used 0 MB of data". *Borrowed from:* Facebook Lite and YouTube Go. *For study:* revision must never cost data.
- **Pain it solves:** "within just 40 minutes, my 1.3 GB data was consumed … I also need to watch lectures on the same phone" (college #23); Notion's "Android version is dead slow" (college, Notion 2★).
- **Why she'd switch from YouTube:** she can revise on the bus with no data, which YouTube can't do.
- **Effort (solo dev):** Medium. Service worker, IndexedDB queue, sync conflicts.
- **Rules:** ✅ Offline store holds only her data. ⚠️ R1: if we cache titles offline, drop them after 30 days. The player stays the official embed; we don't cache video.

### DESIGN-17. Revision Reel 🌶
- **What:** Her own starred moments, played one after another in a vertical, Reels-like screen. The player sits on top; below it, a swipe zone. Swipe up = our code calls `seekTo` (or loads the next lecture) to the next starred moment. Twelve moments from a 3-hour marathon become a 20-minute reel that *ends*. *Borrowed from:* Instagram Reels and YouTube Shorts. *For study:* the most addictive format on the phone, pointed at a finite list she built herself.
- **Pain it solves:** revising by rewatching (#15); "Comment section is very important for time stamps in a 7 hour long video" (college #3); "Do not rewatch a complete 90-minute video" (college #25).
- **Why she'd switch from YouTube:** it scratches the same swipe itch as Shorts, but every swipe is her own revision, and it stops.
- **Effort (solo dev):** Medium. Needs start/end highlights (round 1 A5) and careful player handling.
- **Rules:** ⚠️ R7: the swipe zone is below the player, never over it; each swipe is a user action; ads still play; no muting or hiding the player. R8: no count of reels watched.

### DESIGN-18. Templates by toppers and seniors
- **What:** A gallery of study setups others made: "CS ESG in 60 days by a Dec 2025 qualifier", "CMA Inter Costing formula sheet". Cloning one gives her the topic list, the chosen playlist IDs in order, empty recall prompts per topic and a weekly plan. *Borrowed from:* Notion's template gallery. *For study:* the template is a path through lectures, chosen by a person who passed.
- **Pain it solves:** choice overload: "which lectures should I watch of that teacher" (#18); "there are just so many courses for the very same subject" (college #21, 12,181 votes); UPSC "unsure which videos to trust" (#23).
- **Why she'd switch from YouTube:** YouTube can't tell her which of five batches to follow; a senior's setup can, in one tap.
- **Effort (solo dev):** Medium. Template format, publish/clone, a light review queue.
- **Rules:** ✅ R3: the choice is a human's, not our AI's. R1: stores IDs; titles fetched when shown. ⚠️ Review templates by hand at first so no one ships a "Party songs" course (seen on SyncStudy 🟡).

### DESIGN-19. Study check-in at a random moment 🌶
- **What:** Once a day, at a random time inside her own study window, a prompt: "2 minutes: what are you studying right now?" She writes one line or snaps her notebook page. It goes to her study twin or room, and they see it only if they posted too. *Borrowed from:* BeReal. *For study:* the proof is of study, a notebook page, never a screen.
- **Pain it solves:** "I'm having a problem with consistency so I'll do daily live streams for 30 days" (#36); lonely home study (#32, #33).
- **Why she'd switch from YouTube:** it gives the "someone is watching" push of a study-with-me stream, with no camera and no stranger.
- **Effort (solo dev):** Medium. Needs push (DESIGN-12), photo upload to S3-compatible storage, and a room (DESIGN-08).
- **Rules:** ⚠️ Never a screenshot of the video (no frames of YouTube content). R8: nothing rewarded, no count of check-ins as a streak. Opt-in; easy to snooze.

### DESIGN-20. Formula wallpaper 🌶
- **What:** She stars notes as "sheet". One tap turns today's three starred formulas or definitions into a lock-screen wallpaper sized for her phone, redone each morning if she likes. Also an A4 sheet to print. *Borrowed from:* Pinterest boards and iOS/Android lock-screen customising. *For study:* she sees three facts 80 times a day without opening anything.
- **Pain it solves:** "I forget all the concepts and formulae the next day" (#13); "just at the time of test i forget" (#14).
- **Why she'd switch from YouTube:** revision happens every time she unlocks the phone, even on the way to open YouTube.
- **Effort (solo dev):** Low. Canvas to PNG and a download; setting a wallpaper stays a manual step on the web.
- **Rules:** ✅ Her own text only.

### DESIGN-21. My syllabus as a path
- **What:** Each paper shows as a winding path of topic nodes from the official syllabus. The node she's on glows; tapping it shows her lectures, notes and doubts for that topic. She marks nodes done herself. Every node is open from day one. *Borrowed from:* the Duolingo path. *For study:* no locks and no gating; it is a map, not a gate.
- **Pain it solves:** "YouTube supplies lectures, not a course" (insight 9); "no dots connect looks like studing randomly on YouTube" (college #9).
- **Why she'd switch from YouTube:** she can see where she is in the whole paper; YouTube only knows the video she's on.
- **Effort (solo dev):** Medium. Topic maps exist; the path view is custom UI.
- **Rules:** ✅ R8: user-marked, no rewards, nothing locked (III.F.3). Status never inferred from watching.

### DESIGN-22. Moment mixtape 🌶
- **What:** She strings together clips from different lectures (start and end seconds) into a named list: "Section 135 in 7 bits: 3 teachers, 14 minutes". Shared as a link, it opens in our app and plays the bits in order. *Borrowed from:* sharing a Spotify playlist. *For study:* the unit is a moment, not a whole video, and a student curates it for classmates.
- **Pain it solves:** "for doubts go to YouTube lectures" of another teacher (research-aspirants §2); searching eats study time (#22); amendment lectures from "2 different faculties" (research-aspirants §2).
- **Why she'd switch from YouTube:** YouTube can't share "minute 12 to 15 of this, then minute 40 to 44 of that" as one thing.
- **Effort (solo dev):** Medium. Reuses the Revision Reel player (DESIGN-17).
- **Rules:** ⚠️ R7: each clip plays in the official player with ads; we only `seekTo` and pause at the end via our own timer. R1: store IDs + seconds + her title for the list. R3: curation by the student.

### DESIGN-23. "Teacher said" quote card
- **What:** She types a line the teacher said at 42:10 ("CSR is not charity, it is compliance"). One tap makes a clean quote card with her paper name and a link to that second, ready for WhatsApp status. *Borrowed from:* Spotify's lyric share cards and Kindle highlight sharing. *For study:* the shared thing is a memorable line from class, plus a link back into our app.
- **Pain it solves:** isolation (#32) and the group habit of sharing material on WhatsApp and Telegram (research-aspirants §2).
- **Why she'd switch from YouTube:** it gives her something worth posting from a lecture, which YouTube's share button (a bare link) doesn't.
- **Effort (solo dev):** Low. Same card maker as DESIGN-06 and DESIGN-07.
- **Rules:** ✅ Her own typed text. ⚠️ R1: teacher or channel name only if she types it or we fetch it fresh; never a thumbnail or frame on the card.

### DESIGN-24. Friend activity, quiet
- **What:** A thin strip on Home: "Riya added a note 3 min ago · Aman solved a doubt". Tapping a name shows only what they chose to share. No likes, no replies. *Borrowed from:* Spotify's Friend Activity sidebar. *For study:* it shows study actions, and says nothing about which video anyone is watching.
- **Pain it solves:** "Seeing others studying is like a boost" (college #20); body-doubling without paying (college #19).
- **Why she'd switch from YouTube:** at 1 AM she sees two friends are also up and studying, which makes quitting to YouTube harder.
- **Effort (solo dev):** Low–Medium once rooms (DESIGN-08) exist.
- **Rules:** ⚠️ R8: no counts compared, no ranking. R11: activity events never hold video IDs or titles. Opt-in and a "hide me" switch.

### DESIGN-25. Night-before-exam card 🌶
- **What:** The evening before her exam date, Home turns into one calm screen: her ten most-starred notes, the doubts she solved, and a card friends in her room can sign ("All the best, you did 212 notes for this"). After the exam, it opens Study Wrapped. *Borrowed from:* Spotify Wrapped's timing and group greeting cards. *For study:* a moment of care at the scariest point, built from her own work.
- **Pain it solves:** self-doubt (#38); blanking in the test (#14); isolation (#32).
- **Why she'd switch from YouTube:** on the night that matters most, this app knows her exam and her work; YouTube shows her motivational videos from strangers.
- **Effort (solo dev):** Low–Medium once exam dates (round 1 B7) and rooms exist.
- **Rules:** ✅ Her data and friends' messages. ⚠️ Friends' messages need the room's moderation and 18+ rules.

### DESIGN-26. "Your notes are safe" you can see
- **What:** A small cloud tick next to every note shows it's synced. Personal shows "Last backup: 2 min ago · Export all (PDF / Markdown)". Once a week, an optional reminder: "Download your notes?" *Borrowed from:* WhatsApp's chat backup screen. *For study:* trust is the feature; students have lost months of records in other apps.
- **Pain it solves:** "I have my exams coming and I've been recording for the last 6 months, I cant just lose it all." (college #17, 821 votes); "all of that progress disappears" (college #16).
- **Why she'd switch from YouTube:** before she puts six months of notes in any app she needs proof they won't vanish; this shows it on every screen.
- **Effort (solo dev):** Low–Medium. Sync status UI; export reuses round 1 B6.
- **Rules:** ✅ Exports contain her data and youtube.com links with times, no YouTube titles copied (or titles fetched fresh at export time).

---

## My top 3

1. **DESIGN-05 Study Stories.** It borrows the one gesture every student already does 50 times a day and uses it to fight "I forget it the next day". It gives a daily reason to open the app with no streak.
2. **DESIGN-07 Doubt card for WhatsApp.** It solves a real pain (doubts with no home) and every share pulls a classmate into the app at the exact second, which is how we grow for free.
3. **DESIGN-03 + DESIGN-04 Thumb bar and mark-now-write-later.** They make capture one tap without looking away, which removes the "notes are too slow" pain and makes every lecture here feel different from YouTube in the first minute.
