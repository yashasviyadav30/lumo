# Plan v3: rebuild the screens around AI notes and mind maps

Agreed with the user on 2026-10-05 after a full design interview. This replaces the v2 product direction.
Rules R1–R14 in [plan.md](plan.md) still apply, except where this file says otherwise (R10 stays: 18+).

## Why v3

The user opened the app and did not want to explore it: the look, the feel and the features did not match
what they had in mind. Nobody uses the live app yet, so everything on screen can change. The backend works
and stays.

## Who it is for

Anyone **18+** who wants to learn from YouTube without its distractions. Children come later: free Gemini
forbids apps "likely to be accessed by individuals under the age of 18" (Gemini API terms, 2026-03-23), and
the DPDP Act needs verifiable parental consent. Revisit when a lawyer has checked the plan and a paid AI
provider is affordable.

## The feel

- Like YouTube: familiar layout, thumbnail grid, search on top, topic chips, our own red "watched up to here"
  line (YouTube's history is not available to outside apps).
- Theme made for long work sessions, not "relaxing": soft backgrounds (no pure white or black), one quiet
  accent, readable text, no flashing. Light, Dark and "Follow my phone", with a quick switch at the top.
- YouTube's own ads still play in the official player. No legal app can remove them.
- Name: the user will pick a new one that says "work without distractions".

## What stays out

- Gaming, comedy and entertainment hidden by default, using YouTube's own category labels only (R3).
  Users can switch any category back on.
- The rest is the user's choice: follow creators (always shown), "Not interested" on a video,
  "Don't show this channel".

## Feed and search

- Our own feed from searches, follows, videos watched here and "Not interested" taps.
- "Continue with Google" can import the user's YouTube subscriptions on day one.
- Shorts tab: only creators the user follows.
- Search quota is 100 searches a day for the whole app. Results are cached and shared. The user applies for
  Google's free quota increase, which needs the app to keep to YouTube's policies.

## Study page (the heart)

Video on top; three tabs below on phone, a side panel on laptop: **Notes · Mind map · My notes**.

- **Notes:** made by Gemini from the public YouTube URL (official, documented video understanding; free in
  preview). Short summary and key points; each point has Expand and a tappable timestamp. Read-only, with
  "Copy to my notes" and a "Made by AI, check with the video" label. Made once per video and language, then
  shared with everyone.
- **Mind map:** zoomable, full screen on phone. Tapping a box shows the explanation, "▶ Play this part" and
  "Add to my notes".
- **My notes:** the private notepad.
- **Language:** English, Hindi or "same as the video", chosen once in Settings.
- **Limits:** free tier allows about 8 hours of video a day for the whole app. When it runs out, show
  "Queued, ready by tomorrow" and keep the notepad open. Videos over about 2.5 hours get notes in parts,
  only if testing shows Gemini handles part of a video.
- **Never:** captions.download on other people's videos, timedtext, youtube-transcript-api or any scraping
  (Developer Policies III.D.7, III.E.6).
- **R4 narrowed for notes:** free Gemini keeps inputs and humans may read them, so it gets only the public video
  URL and our fixed prompt, never anything a user typed. Notes are deleted 30 days after they are made (as R1).
- **Tested 2026-10-05:** `gemini-3.5-flash-lite` made good English notes and a mind map for a 19-minute lecture
  in 13–20 s (~100K tokens). Timestamps as raw seconds went past the end of the video; `MM:SS` fixed it, and
  times past the end are dropped anyway. The free models often answer 503 "high demand", so every request
  goes through the queue with backoff. Still untested: Hindi notes and notes in parts (Gemini was overloaded).
- **Offline:** notes, mind maps and own notes open without internet after the first view.
- **Export:** notes and mind map as PDF, or share to WhatsApp.

## Study groups

- Create a group, share an invite link (WhatsApp), up to 50 members.
- One feed per group with Slack-style threads. Posts: a shared video (with notes or mind map attached), a
  doubt at a timestamp, a note.
- Creator can remove members; anyone can leave; Report on messages; "Delete my data" also deletes the
  user's group messages.
- No "who watched what" (close to R8).
- Notifications: in-app badge, plus an optional phone alert only for replies to your own posts.

## Sign-in

"Continue with Google" first, email + password second.

## Also built in

- First-time guide: 3 intro screens and one-time hints on the study page.
- Text size, a feedback button, keyboard and screen-reader support.

## Removed

Revision cards. Focus sessions were considered and dropped: people come here to work, not to calm down.

## Status (2026-10-05)

All four steps are built and live; see the top of [progress.md](progress.md). Optional and not built: phone
push alerts for replies.

## How we build it

Keep the backend (accounts, YouTube client, cache, quota guard, database, tests). Rebuild every screen in
the same repo. Each step is tested, deployed and pushed as its own commits before the next starts:

1. Study page: Notes · Mind map · My notes, export, offline, language.
2. Home and search: new look, feed, filters, follows, Shorts tab, first-time guide.
3. Google sign-in and subscription import.
4. Study groups.

## Only the user can do

- Apply for the YouTube API quota increase.
- Start Google's OAuth approval for sign-in early (it takes weeks; until then, up to 100 test users).
- Create a free Gemini API key in Google AI Studio and add it to Render as `GEMINI_API_KEY`.
- Rotate the old YouTube API key (pending since 2026-10-02).
- Pick the real app name.
