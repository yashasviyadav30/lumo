# User research, part 1: Indian exam aspirants and YouTube study

Groups: CS, CMA, CA, NEET, JEE, UPSC. Date: 2026-09-29.

## How this was gathered, and its limits

- **Reddit could not be read.** reddit.com, old.reddit.com, a Redlib mirror and the Pullpush API all refused or rate-limited the fetch, and the search engine almost never returned Reddit threads. So there are **no Reddit quotes** here. Someone should read r/CAIndia, r/JEENEETards, r/UPSC, r/NEET and r/CompanySecretary by hand before trusting this file's weights.
- **Quora blocks fetching (403).** Quora quotes are question titles taken from search results and URL slugs. The slugs drop punctuation, so apostrophes and commas were put back; the words themselves are unchanged. All are 🟡.
- **Careers360 Q&A pages could be read.** Each is a student's own question. Pages I opened are ✅.
- Some quotes come from coaching-institute blogs (EnsureIAS, AKS IAS). They describe aspirants but are written by coaching firms selling to them. They are marked "(coaching blog)".
- **CS and CMA are thin.** I found almost no first-person CS or CMA complaints online beyond question titles about amendments, free lectures, time and teacher choice. The founder's sister (CS Professional) is a better source for these two groups than the web.
- ✅ = I read the page. 🟡 = search snippet or title only.

---

## 1. Pain points

| # | Group | The pain, in plain words | Quote | Source | |
|---|---|---|---|---|---|
| 1 | JEE | Studies at night on YouTube because home is noisy by day, and YouTube pulls them off course | "i choose night time maximum to online study but i get distracted much to youtube what is the solution" | https://www.careers360.com/question-hi-i-jee-aspirant-as-we-know-this-is-the-last-lap-of-preparation-for-jee-usually-as-colleges-are-not-opened-at-house-i-dont-have-any-room-to-study-at-morning-there-will-be-noisy-in-house-so-ichoose-night-time-maximum-to-online-study-but-i-get-distracted-much-to-youtube-what-is-thesolution | ✅ |
| 2 | JEE | Wants YouTube to show only the channels they chose | "is there any way so that i can only my subscriber's videos ... so that i cant get distracted" | https://www.careers360.com/question-is-there-any-way-so-that-i-can-only-my-subscribers-videos-in-video-so-that-i-cant-get-distracted-and-stay-ocuused-while-doing-online-study-basically-i-m-jee-aspirant | ✅ |
| 3 | all | The phone is both the classroom and the distraction; books alone don't work for them | "I need my phone to study but it also distracts me ... books don't explain well and videos are the only thing that help" | https://www.quora.com/I-need-my-phone-to-study-but-it-also-distracts-me-What-should-I-do-knowing-that-books-don-t-explain-well-and-videos-are-the-only-thing-that-help | 🟡 |
| 4 | all | Only a phone, no laptop, so no browser extensions or split screen | "I have to study from YouTube and I don't have a laptop" | https://www.quora.com/I-want-to-study-but-my-phone-is-my-distraction-I-have-to-study-from-YouTube-and-I-don-t-have-a-laptop-What-do-I-do | 🟡 |
| 5 | all | The pull comes back every half hour | "Every 30 minutes or so after studying I crave to go on one of the two" (YouTube, Quora) | https://www.quora.com/How-can-I-stop-wasting-so-much-time-on-YouTube-and-Quora-Every-30-minutes-or-so-after-studying-I-crave-to-go-on-one-of-the-two-What-could-I-do-instead | 🟡 |
| 6 | all | Turning history off does not stop recommendations (matches the sister's "history off" point) | "How is YouTube recommending me videos and channels when I have paused search and watch history?" | https://www.quora.com/How-is-YouTube-recommending-me-videos-and-channels-when-I-have-paused-search-and-watch-history | 🟡 |
| 7 | all | Distraction feeds a lecture backlog, which feeds lost motivation | "Sometimes I loose my motivation for studying and I have a huge backlog" | https://www.quora.com/Why-am-I-so-diverted-by-YouTube-and-not-being-able-to-focus-on-my-studies-I-know-I-need-to-stop-but-its-highly-diverting-Sometimes-I-loose-my-motivation-for-studying-and-I-have-a-huge-backlog-what-must-I-do | 🟡 |
| 8 | JEE | Taking notes while watching is too slow | "how to write notes faster while watching lectures??? iit jee student" | https://www.careers360.com/question-how-to-write-notes-faster-while-watching-lectures-iit-jee-student | ✅ |
| 9 | JEE | Same, from another student | "Making notes take a real long time. How can I fix that one?" | https://www.quora.com/Making-notes-take-a-real-long-time-How-can-I-fix-that-one-Im-preparing-for-the-JEE-2023 | 🟡 |
| 10 | JEE | Lectures are long (2 hours+) and there are too many | "Any tips to complete 2hr lectures videos more quickly for jeemains?" | https://www.careers360.com/question-any-tips-to-complete-2hr-lectures-videos-more-quickly-for-jeemains | 🟡 |
| 11 | JEE | Unsure whether a one-shot is enough | "SHOULD I FOLLOW 2 HRS ONE SHOT LECTURES FOR JEE PREPARATION?" | https://www.careers360.com/question-should-i-follow-2-hrs-one-shot-lectures-for-jee-preparation | ✅ |
| 12 | CA | Hopes a marathon can replace full study | "Can I clear the CA inter by only marathon lectures?" | https://www.quora.com/Can-I-clear-the-CA-inter-by-only-marathon-lectures | 🟡 |
| 13 | NEET | Forgets the next day | "I forget all the concepts and formulae the next day" | https://www.quora.com/When-I-study-physics-for-the-NEET-I-forget-all-the-concepts-and-formulae-the-next-day-What-should-I-do-to-overcome-this | 🟡 |
| 14 | NEET | Knows it in practice, blanks in the test | "just at the time of test i forget ... how i can remember a thing long time" | https://www.careers360.com/question-hey-dear-i-m-preparing-for-neet-2023-and-i-m-12th-passed-i-m-facing-a-major-problem-in-biology-i-prepared-very-well-for-test-and-everything-is-going-fine-but-juts-at-the-time-of-test-i-forget-what-i-should-how-i-can-remember-a-thing-long-time | 🟡 |
| 15 | JEE/all | Revision means re-watching the recordings, and they doubt that works | "Should I revise topics by watching recorded sessions as most of the students do?" | https://www.quora.com/I-m-an-Unacademy-student-Should-I-revise-topics-by-watching-recorded-sessions-as-most-of-the-students-do | 🟡 |
| 16 | NEET | Watching and copying notes doesn't turn into real study | "I completely watch lectures and make notes but can't be able to do self study" | https://www.quora.com/I-completely-watch-lectures-and-make-notes-but-cant-be-able-to-do-self-study-What-is-your-strategy-for-self-studying-for-the-NEET-2023 | 🟡 |
| 17 | JEE | YouTube gives lectures but no practice | "I'm doing self study from YouTube channel for jee 2022 but I have no any source to do practice" | https://www.careers360.com/question-im-doing-self-study-from-youtube-channel-for-jee-2022-but-i-have-no-any-source-to-do-practice-please-guide-me-how-do-i-practice | ✅ |
| 18 | NEET | The same teacher has many batches on YouTube; which playlist is the right one? | "a lot of videos of PW of different batches of the same teacher so I'm always confused" | https://www.quora.com/On-YouTube-there-are-a-lot-of-videos-of-PW-of-different-batches-of-the-same-teacher-so-I-m-always-confused-Which-lectures-should-I-watch-of-that-teacher-for-my-NEET-preparation-2 | 🟡 |
| 19 | JEE | Choosing between big channels | "youtube pe kisse padhe physics wallah ya unacademy jee" (whom to study from on YouTube) | https://www.careers360.com/question-youtube-pe-kisse-padhe-physics-wallah-ya-unacademy-jee | 🟡 |
| 20 | CA | Choosing a paid platform or teacher | "is unacademy subscripttion is best for Ca intermediate classes? is there educators/teachers are best" | https://www.caclubindia.com/forum/ca-inter-educators-569538.asp | ✅ |
| 21 | CMA | Choosing a teacher per paper | "Which is the best teacher for CMA Inter FM among all?" | https://www.quora.com/Which-is-the-best-teacher-for-CMA-Inter-FM-among-all | 🟡 |
| 22 | UPSC | Searching takes the time meant for study (coaching blog) | "Aspirants often spend more time searching for the right videos than actually studying." | https://www.ensureias.com/blog/upsc-preparation/can-one-prepare-for-upsc-through-youtube | ✅ |
| 23 | UPSC | Too much content, no idea what to trust (coaching blog) | "Several aspirants report feeling overwhelmed by the volume of content, unsure which videos to trust or follow." | same as 22 | ✅ |
| 24 | CA | Law changes; their lectures and module are out of date | "after that there are so many amendments and my module is not the latest one so what should I do for the amendment parts" | https://www.quora.com/How-should-I-study-IDT-in-CA-inter-I-had-given-November-19-attempt-and-after-that-there-are-so-many-amendments-and-my-module-is-not-the-latest-one-so-what-should-I-do-for-the-amendment-parts | 🟡 |
| 25 | CS | Unsure which amendments apply to their attempt | "Up to what date's amendments are applicable to the June 18th CS executive exams? I have CS executive books of Sep 17th and Nov 17th" | https://www.quora.com/Up-to-what-dates-amendments-are-applicable-to-the-June-18th-CS-executive-exams-I-have-CS-executive-books-of-Sep-17th-and-Nov-17th | 🟡 |
| 26 | NEET | Syllabus changed; old lectures cover dropped chapters | "Did some chapters get removed from the NEET syllabus for NEET 2024?" | https://www.quora.com/Did-some-chapters-get-removed-from-the-NEET-syllabus-for-NEET-2024 | 🟡 |
| 27 | CS | Hard to find a complete free set of lectures for the new syllabus | "How to get full lectures for the new syllabus of CS executive for free" | https://www.quora.com/How-can-I-get-full-lectures-for-the-new-syllabus-of-CS-executive-for-free | 🟡 |
| 28 | CS | Works full time; only nights are left | "How can I creak the CS executive in just 5 months by self-study? I am working 9am to 6pm" | https://www.quora.com/How-can-I-creak-the-CS-executive-in-just-5-months-by-self-study-I-am-working-9am-to-6pm | 🟡 |
| 29 | UPSC | Can't ask doubts in a crowded class; uses YouTube instead | "It is not always possible to clear doubts in class. There are too many students there. YouTube videos often help" (Kajal, aspirant) | https://theprint.in/feature/youtube-is-the-new-mukherjee-nagar-for-upsc-students-tutors-are-influencers/1185198/ | ✅ |
| 30 | JEE | Self-studiers have nowhere to take doubts | "How did you solve your doubts while preparing for the JEE through YouTube" | https://www.quora.com/How-did-you-solve-your-doubts-while-preparing-for-the-JEE-through-YouTube | 🟡 |
| 31 | NEET | Home has no peers to measure against | "I don't have any competitive environment at home unlike coaching institutes" | https://www.careers360.com/question-hii-i-am-2023-neet-aspirant-i-am-preparing-for-neet-with-the-help-of-youtube-can-u-please-tell-me-how-to-study-efficiently-because-i-dont-have-any-competitive-environment-at-home-unlike-coaching-institutes | ✅ |
| 32 | UPSC | Alone at home, nobody to talk to | "How do I take out my emotions when I have nobody to talk to?" | https://www.quora.com/What-do-I-do-if-I-have-no-friends-and-stay-at-home-all-day-to-study-for-the-UPSC-How-do-I-take-out-my-emotions-when-I-have-nobody-to-talk-to | 🟡 |
| 33 | UPSC | Studying alone in a home town, no study group | "I have started preparing alone for IAS Exams at my home town. How are study groups important" | https://www.quora.com/Upsc-2016-I-have-started-preparing-alone-for-IAS-Exams-at-my-home-town-How-are-study-groups-important-and-in-absence-of-it-how-should-I-manage | 🟡 |
| 34 | JEE | Guilt spiral after lost days | "I haven't studied anything from 2 weeks. I feel from Inside that I can't do anything in life" | https://www.quora.com/How-do-I-stop-feeling-Guilty-I-am-JEE-aspirant-and-I-cant-Focus-on-my-study-due-to-this-I-havent-studied-anything-from-2-weeks-I-feel-from-Inside-that-I-cant-do-anything-in-life-I-even-sometimes-thought-to-give-up | 🟡 |
| 35 | NEET | Wasted-time frustration | "i get very frustrated thinking that i am wasting my time in useless stuffs" | https://www.careers360.com/question-i-was-preparing-well-for-neet-2020-but-from-10-days-i-get-distracted-and-at-present-i-couldnt-focus-on-my-study-its-very-hard-to-focus-sometimes-i-get-very-frustrated-thinking-that-i-am-wasting-my-time-in-useless-stuffs-still-i-couldnt-motivate-myself-what-to-do-pleasehelp-me | 🟡 |
| 36 | NEET | Inconsistency; tries public live-streaming to force themselves | "I'm having a problem with consistency so I'll do daily live streams for 30 days" | https://www.quora.com/Should-I-do-a-live-stream-on-YouTube-study-with-me-for-the-NEET-2024-exam-on-May-5th-I-feel-I-will-be-more-productive-with-it-Im-having-a-problem-with-consistency-so-Ill-do-daily-live-streams-for-30-days-April-1st | 🟡 |
| 37 | NEET | Can't afford coaching; YouTube is the only option | "Is it possible to crack the NEET without coaching by self-study, as I am financially very weak" | https://www.quora.com/Is-it-possible-to-crack-the-NEET-without-coaching-by-self-study-as-I-am-financially-very-weak | 🟡 |
| 38 | NEET | Self-doubt about studying without coaching | "at many times I'm gets disturbed that coaching is a must to crack the Neet" | https://www.quora.com/Im-preparing-for-the-NEET-2022-without-coaching-but-at-many-times-Im-gets-disturbed-that-coaching-is-a-must-to-crack-the-Neet-How-can-I-get-rid-of-this-and-continue-my-preparation-with-full-efforts | 🟡 |
| 39 | UPSC | Telegram hoarding: collecting PDFs, not studying them (coaching blog) | "keep collecting material without studying it" | https://aksias.com/youtube-telegram-instagram-boon-or-distraction-for-upsc-aspirants/ | ✅ |
| 40 | UPSC | Watching strategy and topper videos instead of studying | "Looping strategy videos instead of studying" (coaching blog); a student asks "How many topper videos should we watch on YouTube for the UPSC CSE strategy?" | aksias (above) ✅; https://www.quora.com/How-many-topper-videos-should-we-watch-on-YouTube-for-the-UPSC-CSE-strategy 🟡 | ✅/🟡 |
| 41 | all | Mid-roll ads break a derivation in half. **Weak source:** a sponsored piece selling an ad blocker, and ads can't be removed under R7 anyway | "Mid-lesson, a 30-second insurance ad breaks a derivation in half." | https://m.dailyhunt.in/news/india/english/news+karnataka-epaper-newskarn/online+learning+in+india+how+ads+disrupt+students+midlesson-newsid-n704251986 | ✅ |

---

## 2. How they study today

| Habit or tool | Who | What I saw | |
|---|---|---|---|
| **Free YouTube lectures as the main course** (Physics Wallah, Unacademy, Vikas Divyakirti, CA/CS/CMA faculty channels) | all | ThePrint: "YouTube is the new Mukherjee Nagar." A UPPCS topper: "without Youtube my selection would not have probably happened." A JEE student: "I can stop, rewind, or fast forward. It's so customised." | ✅ |
| **YouTube as the doubt channel**: look up another teacher when stuck | UPSC, NEET, JEE | Kajal (row 29). Quora answers say "for doubts go to YouTube lectures" on the specific topic. | ✅/🟡 |
| **One-shots, marathons, "last day revision"** | CA, JEE, NEET | CA faculties post "Last Day Marathon" and "one shot" videos per paper; students ask whether that alone is enough (rows 11, 12). | 🟡 |
| **Lecture backlogs** as a normal state | JEE, NEET | Teacher videos titled "How to Clear 100+ Lecture Backlogs in 1 Week" and "20, 50, 100 or 150 Lectures Backlog?" The word "backlog" is part of their everyday speech. | 🟡 |
| **Speed-up (1.5x–2x)** to get through long lectures | JEE, CA | Row 10; Quora answers suggest 2x. | 🟡 |
| **Paper notebooks**, plus teachers' PDF notes and DPPs from Telegram | JEE, NEET | Answers say "most educators provide notes and DPP on their telegram channel"; students copy by hand and find it slow (rows 8, 9). | 🟡 |
| **Telegram channels** for notes, lecture links, exam updates, and pirated paid batches | all, esp. CA/CMA and JEE/NEET | A CMA Inter channel (2.94K subscribers) mixes admit-card news, study plans and WhatsApp group links. Channels like "Physicswallah Lakshya Batch Lecture Notes and DPPs" re-share paid content. Delhi High Court has ordered Telegram channels blocked for ALLEN, Apna College, and teacher Neetu Singh (Neetu Singh v. Telegram FZ LLC). Delhi Police arrested three people for selling pirated UPSC material on Telegram. | ✅ (CMA channel) / 🟡 |
| **ICAI/ICSI study material, RTPs, amendment lectures** | CA, CS, CMA | The fix for outdated lectures is the latest RTP plus "amendment videos from 2 different faculties on YouTube". CS students ask which amendment cut-off applies to them (row 25). | 🟡 |
| **PYQs and mock tests** as the check on "just watching" | all | Every self-study answer pushes PYQs and mocks. Students say YouTube gives them no practice (row 17). | ✅/🟡 |
| **Digital notes in Notion** | UPSC mainly | Notion has UPSC templates; coaching blogs push "current affairs digital, static subjects handwritten". | 🟡 |
| **Anki flashcards** | NEET | A shared AnkiWeb NEET deck has 8,000+ NCERT-based cards; its maker says he used it 6 months and scored 660. | 🟡 |
| **YPT (Yeolpumta), live study rooms, "study with me" streams** for company and accountability | NEET, UPSC, NIMCET | Quora spaces invite people into YPT groups; one NEET student planned daily live streams to fix consistency (row 36). LiveStudyRoom.in targets UPSC/JEE/NEET. | 🟡 |
| **Self-made blocks**: phone in another room, app timers, Unhook-style extensions, "Watch Later" for anything off-topic | all | The standard Quora and Careers360 advice. It only works on a laptop, and many have only a phone (row 4). | 🟡 |
| **Night study** | JEE, CS (working) | Home is noisy by day (row 1); working CS students have "3–4 hours at night" (row 28). | ✅/🟡 |

**Tools that already exist in this space** (for positioning, not user voices): SyncStudy (playlist → course, progress, timestamped notes, hides the sidebar, Indian exam templates), Courseifier, TrackMyCourse, Select Tube (only chosen channels), Utudy (YouTube class planner with notes), StudyTube app, Unhook and "YouTube Study Mode" extensions. 🟡 from store pages and search. "Hide distractions" and "playlist tracker" are already crowded.

---

## 3. What they wish existed

Direct "I wish" statements were rare. Most wishes show up as questions. What I found:

| Wish | Group | Quote | Source | |
|---|---|---|---|---|
| YouTube that shows only the channels I picked | JEE | "is there any way so that i can only my subscriber's videos" | row 2 | ✅ |
| Peers and competition while studying at home | NEET | "I don't have any competitive environment at home unlike coaching institutes" | row 31 | ✅ |
| A study group when you prepare alone | UPSC | "How are study groups important and in absence of it how should I manage" | row 33 | 🟡 |
| Someone watching, to stay consistent | NEET | "I feel I will be more productive with it" (about live-streaming study) | row 36 | 🟡 |
| A way to take notes as fast as the lecture | JEE | "how to write notes faster while watching lectures???" | row 8 | ✅ |
| Practice attached to the lectures | JEE | "I have no any source to do practice" | row 17 | ✅ |
| Someone to say which lectures are current | CA, CS | "my module is not the latest one" | rows 24, 25 | 🟡 |
| Someone to tell them which batch or playlist to follow | NEET | "Which lectures should I watch of that teacher" | row 18 | 🟡 |
| A place to ask doubts | UPSC, JEE | row 29, row 30 | | ✅/🟡 |

No quote found for: reminders to revise what they watched, a timeline of their own notes against lecture timestamps, or a planner that maps playlists to the syllabus. These are 🔵 inferences from the pains above, not stated wishes.

---

## 4. The 10 strongest insights (ranked by how often and how strongly they came up)

1. **The phone is the classroom and the trap at once.** The single most repeated complaint in every group. Many have no laptop, so extension-based fixes don't reach them. (rows 1–7)
2. **Watching feels like studying but doesn't stick.** They forget the next day, revise by re-watching, and ask whether watching and copying notes counts as study. (rows 13–16; aksias "Watching ≠ Studying")
3. **Choice overload: which teacher, which batch, which playlist.** It shows up in JEE, NEET, CA, CMA and UPSC. The NEET "different batches of the same teacher" question is the sharpest version. (rows 18–23)
4. **Notes from video are slow and painful.** They copy by hand in notebooks, pause often, or lean on teachers' Telegram PDFs. (rows 8, 9)
5. **Loneliness and guilt, especially at home or at night.** They lack peers, a study group, or anyone to talk to, and they feel guilt after lost days. They turn to YPT, live study rooms and study-with-me streams to get company. (rows 31–36)
6. **Lectures are too long and pile up into backlogs.** Two-hour lectures, 2x speed, 100-lecture backlogs, one-shots and marathons as the escape. (rows 7, 10–12)
7. **Doubts have no home.** Crowded classes and solo study both leave doubts unanswered. YouTube itself is the doubt tool: they search another teacher's video. (rows 29, 30)
8. **Outdated content is a law-exam problem (CA, CS, CMA) and a syllabus-change problem (NEET 2024).** They can't tell whether a lecture matches their attempt. (rows 24–27)
9. **YouTube supplies lectures, not a course.** There is no practice, no PYQs tied to the lecture, no plan. JEE and NEET self-studiers say so directly, and UPSC blogs call "lack of structure" the biggest drawback. (row 17; EnsureIAS)
10. **Money drives YouTube use, and Telegram fills the gaps.** "Financially very weak" students choose YouTube. Telegram carries notes, links and pirated paid batches. Courts have blocked such channels, and UPSC aspirants hoard PDFs they never read. (rows 37–39)

Note for design (🔵): insights 2, 4, 5 and 7 fit the rules (our own notes, timestamps, doubts and study groups; no YouTube data judged). Insight 1 is partly covered already and crowded with competitors. Insight 3 runs into R3 (we can't judge videos), so help there must come from people (teachers, peers, the user's own lists), not from our AI.
