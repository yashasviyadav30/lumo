> **Outdated.** Written before the research phase. Do not follow. The new plan will be based on [research-summary.md](../research-summary.md) and user interviews.

# Project Plan: Focused YouTube Learning App (working name)

## 1. Project brief

Students and aspirants use YouTube to study, but Shorts, recommendations and entertainment pull them away. This app gives each user a feed built around what they need to learn. Videos still play from YouTube through the official embedded player, so the app works alongside YouTube instead of replacing it.

### Modes

| Mode | Who it's for | What the feed shows |
|---|---|---|
| Aspirant | Exam aspirants (UPSC, SSC, JEE, NEET, etc.) | Exam-wise, syllabus-wise lectures and revision |
| Student | School students | Class and subject-wise learning content |
| Tech | Developers and CS learners | Programming, tools, cloud, AI/ML |
| Motivational | Anyone who wants it | Talks and study motivation (see open decision below) |
| Fashion | Fashion learners | Design, styling, industry skills (see open decision below) |
| Accessibility | People with disabilities | Content matched to the help they need, plus an accessible app |

### Core rules

1. Shorts are the user's choice. They are off by default in Aspirant mode and can be turned on or off in every mode. When on, they pass the same filter as other videos and come as a limited set (no endless scroll). Any daily time limit is set by the user, never by the app.
2. Search stays open to any learning topic. A CS student can search law or history and see results.
3. Entertainment (movies, songs, gaming, comedy, vlogs) is hidden in learning modes.
4. Each mode has its own rules. Fashion content is fine in Fashion mode but hidden in Aspirant mode.
5. The filter should rather show a borderline learning video than hide it. Over-blocking is the bigger failure.
6. Accessibility mode asks what help the user needs, not what their diagnosis is.
7. The app runs on Windows, Mac, Android and iPhone.

## 2. Hard limits to know before building

- **Search quota.** YouTube Data API gives a default of 100 search calls per day per project. Plan: cache search results, build curated channel lists per mode, use cheap read calls, and apply for a quota increase before launch (Google reviews and audits these requests).
- **Player rules.** YouTube does not allow hiding ads or changing the embedded player. Read the YouTube API Services Terms and Developer Policies before launch.
- **Leaving the app.** Clicking the YouTube logo in the embedded player can open youtube.com. Test whether this can be blocked in each platform's webview.
- **Captions.** The official API cannot download transcripts of other people's videos. It can tell whether a video has captions.
- **Shorts detection.** There is no official "is Short" flag in the API. Use duration plus a URL check, and test it.
- **Uploader categories are unreliable.** YouTube categories (Education, Music, Entertainment) are chosen by the uploader. Use them as one signal, not the final answer.
- **Children's data.** School students are under 18. Check India's DPDP Act 2023 rules on parental consent before collecting any of their data.
- **Disability data is sensitive.** Collect as little as possible, make it optional, keep it on the device where possible, and never share it.

## 3. How content filtering works

The filter answers one question: "Is this video for learning, or for entertainment?" It does not restrict topics.

### Layers

1. **User settings:** Shorts shown or hidden based on the user's Shorts setting for that mode. Live streams blocked if needed.
2. **Channel lists per mode:** trusted channels (always allowed) and blocked channels.
3. **AI classifier:** reads title, description, tags and channel name. Returns learning, entertainment or unsure, plus a topic tag. Must handle Hindi, English and Hinglish titles.
4. **Mode rules:** decide show or hide based on the label and the active mode.
5. **Unsure videos:** shown, but ranked lower. (Follows core rule 5.)
6. **Cache:** each video is classified once and stored by video ID. This keeps AI costs low.

### User feedback

- A "This shouldn't be here" button on every video.
- When results are hidden, show "X results hidden" with the reason and a one-tap "I need this" request.
- Feedback goes into the test set and improves the classifier.

### Measuring the filter

Build a labeled test set of 500 to 1,000 real video titles (mixed languages, mixed topics). Track two numbers:

- **Wrongly blocked:** learning videos the filter hid. This number matters most.
- **Wrongly allowed:** entertainment that got through.

Set target numbers after the first round of testing.

## 4. Suggested tech stack

| Part | Choice | Why |
|---|---|---|
| Backend | Python + FastAPI | Already known |
| Database | PostgreSQL | Users, channel lists, cached labels |
| Cache | Redis | Search results and API responses |
| Frontend | React (Next.js) as a PWA | One codebase, runs in any browser, installable |
| Mobile apps (later) | Capacitor | Wraps the web app for Android and iOS |
| Desktop apps (later) | Tauri | Wraps the web app for Windows and Mac |
| AI filter | LLM API first, own trained classifier later | Fast start, then an AI/ML project of its own |
| Hosting | Docker on GCP Cloud Run | Already known |

## 5. Step-by-step plan

Time estimates assume part-time work and are rough.

### Phase 0: Validate the idea (1 to 2 weeks)

- [ ] Install and use StudyTube, YourTube and Unhook for 2 to 3 days each.
- [ ] Read their 1 to 3 star reviews and list the top 10 complaints.
- [ ] Talk to 5 aspirants: what distracts them, what they search for, would they switch apps?
- [ ] Talk to 3 to 5 people with disabilities (start with deaf or hard of hearing users) through NGOs, special schools or the college Equal Opportunity Cell.
- [ ] Write down the 3 problems users mentioned most.
- [ ] Decide on the open decisions in Section 6.

**Checkpoint:** Do real users want this? If the answers are weak, change the idea before writing code.

### Phase 1: Filter prototype, no app yet (2 to 3 weeks)

- [ ] Get a YouTube Data API key and read the quota rules.
- [ ] Write a Python script that fetches video details (title, description, tags, category, duration, captions flag) for a list of video IDs.
- [ ] Collect 500+ video titles across learning and entertainment, in Hindi, English and Hinglish.
- [ ] Label them by hand: learning / entertainment.
- [ ] Build the classifier (LLM prompt first).
- [ ] Run it on the test set and measure wrongly blocked and wrongly allowed.
- [ ] Test the tricky cases: law videos for a CS student, music theory lessons, movie reviews, "study with me" streams.
- [ ] Test Shorts detection.

**Checkpoint:** Is the filter good enough that users won't feel blocked? If not, keep improving before building the app.

### Phase 2: MVP web app, Aspirant mode only (3 to 4 weeks)

- [ ] Set up FastAPI backend, PostgreSQL, Redis, Docker.
- [ ] Sign-up and onboarding: pick exam, language, subjects.
- [ ] Curate 30 to 50 trusted channels for one exam.
- [ ] Build the feed from those channels (cheap read calls, cached).
- [ ] Add search with the filter and caching.
- [ ] Embed the YouTube player with suggestions and autoplay off.
- [ ] Add timestamp notes on videos.
- [ ] Add the Shorts setting: on/off per mode (off by default in Aspirant mode), a limited set per session instead of endless scroll, a daily time limit that the user sets themselves (when they turn Shorts on, ask once whether they want a limit, with "No limit" as an option), and Shorts linked to topics the user just studied.
- [ ] Add the feedback buttons.
- [ ] Make it installable as a PWA.
- [ ] Deploy on Cloud Run.

**Checkpoint:** Does the app work end to end on a phone browser and a laptop?

### Phase 3: Test with real users (2 weeks)

- [ ] Give the app to 10 aspirants for one week.
- [ ] Track: daily use, searches, hidden results, feedback reports.
- [ ] Track Shorts use: how many users turn them on, and time on Shorts compared with long videos. If Shorts time keeps growing, make the per-session set smaller or improve the limit prompt (the daily limit itself stays the user's choice).
- [ ] Interview them at the end.
- [ ] Fix the top problems.
- [ ] Add their feedback to the filter test set.

**Checkpoint:** Did at least half of them keep using it? If not, find out why before adding modes.

### Phase 4: Accessibility mode, deaf and hard of hearing first (3 to 4 weeks)

- [ ] Onboarding asks about needs, not diagnosis:
  - I need captions
  - I use sign language (ISL)
  - I use a screen reader
  - I need large buttons and fewer taps
  - I prefer audio-focused content
- [ ] Feed filter: only videos with captions, plus curated ISL channels.
- [ ] Captions on by default in the player.
- [ ] Make the whole app work with screen readers (TalkBack, VoiceOver) and keyboards.
- [ ] Test with the users from Phase 0.
- [ ] Add screen reader users next, then other needs.

**Checkpoint:** Can a deaf user and a screen reader user use the app without help?

### Phase 5: More modes (2 to 3 weeks per mode)

- [ ] Student mode (class and subject-wise).
- [ ] Tech mode.
- [ ] Other modes, based on the Section 6 decisions.
- [ ] For each mode: curated channels, mode rules, and a small user test.

**Checkpoint:** Each new mode passes its own filter test before release.

### Phase 6: All platforms (3 to 4 weeks)

- [ ] Wrap the web app with Capacitor for Android and iOS.
- [ ] Wrap with Tauri for Windows and Mac.
- [ ] Test the "leaving the app" problem on each platform.
- [ ] Publish on Play Store first, then others.

**Checkpoint:** Same features and filter on every platform.

### Phase 7: Launch

- [ ] Apply for a higher YouTube API quota.
- [ ] Write a privacy policy (disability data, children's data).
- [ ] Review YouTube API terms compliance.
- [ ] Launch to college groups, aspirant communities and disability organisations.
- [ ] Submit to hackathons as a project.

## 6. Open decisions

- [ ] **Motivational mode:** motivational videos can become a distraction themselves. Keep it, limit it, or merge it into other modes?
- [ ] **Fashion mode:** it does not fit the "no distraction" pitch. Keep it as a learning mode for fashion students, or drop it?
- [ ] **First mode to build:** Aspirant (main audience) or Tech (easiest to curate personally)?
- [ ] **Who curates each mode:** find a partner who knows each field.
- [ ] **Money:** free, freemium, or grants for the accessibility side? AI and hosting cost money as users grow.
- [ ] **Shorts defaults:** default on or off for each mode other than Aspirant, and the size of the per-session set.
- [ ] **App name.**
