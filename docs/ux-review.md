# FocusLearn UX review

Reviewed 2 October 2026 against the running app (backend :8000, frontend :5173), at phone size (412×915) and laptop size (1280×860), with a throwaway account (`ux-1790914067639@example.com`, deleted at the end; sign-in now fails, as it should). Screenshots are in `docs/ux-review/` (`p..` = phone, `l..` = laptop, `b..` = benchmark apps). Another agent was editing the frontend during the review, so a few items below may already be fixed.

## Summary

1. The study core works and is fast: Mark, Doubt and Follow give feedback in about 0.35 s, sign-up takes 1.9 s, search 1.9 s.
2. The app is crowded with duplicate doors: Search has four entry points, Personal three, and the Home page is 9,746 px tall on a phone, with the study tools buried under 23 feed videos.
3. The Watch page, where students spend most of their time, is missing what YouTube trained them to expect (description, comments with timestamps, date, a save button), and on a phone the video scrolls away while you write notes.
4. "Star" means three different things (a starred mark, a starred note, and soon a starred video), and none of them fills on the capture bar, so taps feel like they did nothing.
5. The neon-lime dark theme looks striking but tires the eyes over a 2-hour lecture. Keep lime as a small brand accent, soften the dark theme, and add a light theme.

**Colour in one line:** keep dark as an option but move to a soft graphite base (`#14161B`) with off-white text (`#E6E8EF`), use lime (`#C6F432`) only for the single main button and the active tab, give success/doubt/star their own calm colours, and add a warm-paper light theme (`#FAFAF7`) that follows the system setting.

## Top 10 fixes

| # | Fix | Screen | Severity | Effort |
|---|---|---|---|---|
| 1 | Make the player sticky on phones (pinned at the top while notes, description and comments scroll under it), and on laptop hide the left nav on the Watch page so the video gets the width. | Watch | High | M |
| 2 | Cut Home to one screen: greeting, one "Continue" card, the feed. Delete the "Your study tools" grid, the weekly stats tiles, "How it works" for returning users, and the "Study with friends · Coming next" tile. | Home | High | S |
| 3 | One Search entry: a search icon in the top bar (YouTube's place) or the Search tab, not both, plus no "Smart search" tile and no "Find a lecture" hero button that just opens Search. | Home, shell | High | S |
| 4 | Untangle "Star": star = save the video (filled star, in the action row under the title). Rename the capture-bar Star to "Important" with a flag icon, or drop it and let the notepad highlight do the job. Every toggle fills at once on tap (optimistic), with a short pop. | Watch | High | S |
| 5 | Put the title and an action row (Star · Notes · Doubt · Share-free) straight under the player, YouTube-style. Show upload date ("2 yr ago") next to the channel. Then description (2 lines + "more"), then comments. | Watch, cards | High | M |
| 6 | Don't let Mark or the N key save at 0:00 before the video has started. Show "Play the video first" instead. All five test notes landed at 0:00 and one became an "(empty mark)" in the notebook. | Watch | High | S |
| 7 | Move "Follow channel" and "Hide channel" off every video card into a ⋮ menu (YouTube, Spotify). Today they add 46 extra buttons to one Home page. | Feed, Search | Med | S |
| 8 | Library = what you saved and watched: tabs Starred · History (· Playlists later). Personal = your own work: notes, doubts, cards, with a "With videos / Only notes" switch. Move Settings to a gear in Personal's header; drop the duplicate avatar link and the Privacy row (keep it in Settings). | Library, Personal | High | M |
| 9 | Toasts sit on top of the input you are typing in (`p13-doubt-open.png`, `p15-watch-notes.png`). Show them at the top under the player, or inline next to the button that caused them, and keep them to 1.5 s. | Watch | Med | S |
| 10 | Show the "Your data is deleted" message after account deletion. It never appears (`p25-after-delete.png`); likely cause: `setMe(null)` makes `RequireAccount` redirect to /welcome before `navigate(..., { state: { note } })` runs (unsure, not traced). | Settings | Med | S |

## Colour recommendation

### What the current theme gets right and wrong

Current tokens (`frontend/src/index.css`) all pass WCAG AA: text `#F2F5EC` on `#0A0B09` is 17.9:1, muted `#939B8E` on cards is 5.9–6.9:1, lime on black is 15.4:1. Contrast is not the problem. The problems are:

- **Too much contrast and too much lime.** Near-white on near-black at 17.9:1 causes halation (text "glows") for people with astigmatism, roughly half of adults. Material Design's dark theme uses `#121212`, not black, and desaturated accents because saturated colours "vibrate" on dark grounds and strain the eyes. Big lime slabs (the Home hero, the Welcome "02." card, the "Solved" buttons) are high-arousal, the opposite of calm.
- **Lime means everything.** `--primary`, `--green` and `--focus` are all `#C6F432`. So the main button, success, "Knew it", focus rings and the active tab look the same. Students can't read meaning from colour.
- **The grid background** adds texture behind text on every screen. Calm apps (Notion, Kindle, Headspace, Forest) use flat backgrounds.
- **Dark only.** Studies on reading find dark text on light faster and better understood for most people with normal vision; many students study in daylight. Notion, Google Docs, Keep, Kindle, Khan Academy and Coursera all default to light and offer dark.

**Verdict: change.** Keep the lime as the brand mark, demote it to one job, soften the dark theme, add a light theme that follows the system.

### Proposed palette

Dark ("Graphite"):

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#12141A` | page | – |
| `--surface` | `#1A1D25` | cards | – |
| `--surface-2` | `#232733` | inputs, chips | – |
| `--line` | `#2C3140` | borders | – |
| `--text` | `#E6E8EF` | body | 15.0:1 on bg, 13.8:1 on surface |
| `--muted` | `#A3A9B8` | secondary text | 7.8:1 on bg, 7.2:1 on surface |
| `--primary` | `#C6F432` | one main button per screen, active tab, logo dot | ink `#12141A` on it ≈ 15:1 |
| `--info` | `#8AB4F8` | links, time chips | 8.7:1 |
| `--success` | `#7DD3A8` | solved, "Knew it" | 10.3:1 |
| `--star` | `#F2C46D` | stars, important | 11.3:1 |
| `--doubt` | `#F28B82` | doubts, delete | 7.7:1 |

Light ("Paper"):

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#FAFAF7` | page (warm off-white, less glare than pure white) | – |
| `--surface` | `#FFFFFF` | cards | – |
| `--text` | `#1F2328` | body | 15.1:1 |
| `--muted` | `#5B6270` | secondary | 5.9:1 |
| `--primary` | `#2F5BD3` (with lime logo kept) | main button; white text on it 5.9:1 | 5.6:1 as text |
| `--success` | `#1F7A4D` | | 5.1:1 |
| `--star` | `#A15C00` (fill `#F2C46D`) | | 5.0:1 |
| `--doubt` | `#B3261E` | | 6.3:1 |

Notepad highlight colours (both themes, as background behind text, Keep/Notion-style, 5 at most): yellow `#F2C46D`, green `#7DD3A8`, blue `#8AB4F8`, pink `#F4A6C6`, orange `#F5B07A`; at 30% opacity on dark, 45% on light, text keeps `--text`.

Why it suits long sessions: no pure black or pure white, one accent, desaturated status colours, every text pair at 4.5:1 or more but body text under ~15:1, flat background. The light theme is the better default for reading notes in daylight; dark stays one tap away.

## Navigation recommendation

Today: tabs Home · Search · Library · Personal, plus an avatar (→ Personal), Settings only inside Personal, Cards outside the tabs, and Home's tool grid repeating most of it.

Search entry points counted on a new account's Home: Search tab, "Find a lecture" hero button, "Smart search" tool tile, "Notes on the lecture" tile (goes to /search when you have no lecture yet). Personal entry points: Personal tab, avatar, "Notebook" tile, "Doubts" tile.

Recommended:

| Tab | Holds | Why |
|---|---|---|
| **Home** | Continue card, today's cards due (one pill), feed with topic chips | One next action, then browsing. Duolingo and Khan open on "continue". |
| **Search** (or a top-bar icon, not both) | search box, topic chips from the goal | YouTube and Spotify keep search in one place. Pick the tab: students use it a lot and a tab is easier on a phone. Then delete the other three doors. |
| **Library** | Starred videos, History, (Playlists later) | Matches YouTube's "You"/Library and Spotify's Your Library: things you saved or watched. Today Library shows "lectures with notes", which duplicates Personal. |
| **Personal** (rename "Notes" or "My notes"; icon notebook-pen) | All notes and doubts, With videos / Only notes, Revision cards (pill with due count), gear → Settings | It is the student's own work. "Personal" plus a person icon reads as "profile/account". |

- Remove the top-right avatar link (it duplicates the tab; YouTube removed its avatar from the top bar when it added the "You" tab in 2023).
- Settings: a gear in the Personal header. Privacy: inside Settings only.
- Cards: reach from the Home pill and Personal; no tab (it is used once a day).
- Laptop: the left nav is a floating box with an empty column under it (`l02-home.png`). Use a slim icon rail (72 px, YouTube's collapsed guide) and hide it fully on Watch.

## Per screen

### Welcome and sign-up (`p01-welcome.png`, `l01-welcome.png`, `p02-signup.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Six feature cards, one "Coming next" (friends). Promise of something that doesn't exist. | Duolingo, Headspace: 3 benefits max, one CTA. | Show 3 cards (Focused search, Notes on the second, Cards that come back). Drop "Study with friends" until it ships. | Low | S |
| Sign-up asks for full date of birth; help says "We don't keep it". | Most 18+ apps: one "I am 18 or over" tick or year only. | Fine for R10; keep, but use a year picker if the backend only needs age (unsure what the compliance plan requires). | Low | S |
| Password label says "at least 8 characters"; the task brief says 12+. | – | Align label and rule. | Low | S |
| Phone mock uses lime slabs; looks like a dev tool more than a study desk. | Notion, Khan: real screenshot of the product. | Use a real screenshot of the Watch page with the notepad once it exists. | Low | S |

### Home (`p03-home-new.png`, `p04-home-goal.png`, `p05-home-full.png`, `p23-home-returning.png`, `l02-home.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Page is 9,746 px tall on a phone. "Your study tools", stats and "How it works" sit under 23 videos where no one scrolls. | YouTube Home is only feed; Duolingo Home is only the path; Khan opens on "continue". | Keep: greeting (one line), one Continue card, feed. Delete the tools grid, stats tiles, friends tile. Show "How it works" only on the empty first visit, above the goal box. | High | S |
| New user sees a lime hero "Pick a lecture… Find a lecture" and a goal box below it: two first steps. | One first step (Duolingo: "What do you want to learn?"). | Empty account: the goal box *is* the hero. After a goal: the feed fills; hero becomes "Continue" only when there is something to continue. | High | S |
| Hero priority shows "2 doubts waiting" ahead of the feed when nothing is resumable (`p23`). Doubts are not today's main job. | Duolingo, Anki: due reviews first, then continue. | Order: Continue lecture > cards due > nothing (no doubts hero). Doubts get a small count on the Personal tab. | Med | S |
| Goal "CA Inter audit" produced no topic chips: the chip bar has one chip, "For you", which does nothing. | YouTube hides the chip bar until there are chips. | Hide the chip bar when there is only one chip. | Low | S |
| Weekly stats ("0 cards reviewed this week") read like a score. R8 forbids rewards for watching; these are about notes and cards, so likely fine, but they push towards gamified feel. (unsure) | Anki shows stats on a separate screen, not Home. | Move stats to Personal, hide zeros. | Low | S |
| Feed skeleton boxes are tall and grey for ~2 s (`p23`). | YouTube skeleton: thumbnail + 2 text lines. | Match the real card shape; fine otherwise. | Low | S |
| "Good morning, let's study." with the date: nice, but takes 100 px on every visit. | Headspace greeting is one line, small. | One line, smaller. | Low | S |

### Search (`p06-search-empty.png`, `p07-search-results.png`, `p08-search-why.png`, `p09-follow-feedback.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Subtitle "All of YouTube except songs, movies, shows, news and vlogs. We always show what we hid." is a sentence to read before you can search. | YouTube, Spotify: just a box with a placeholder. | Remove the subtitle; the hidden line under results already explains (R6). | Low | S |
| Result cards show duration and channel, but no upload date, though `published_at` is in the data. CA/CS law changes every attempt; date matters. | YouTube: "55K views · 5 years ago". | Add "2 yr ago" to the meta line (YouTube field, so fine for R3). | Med | S |
| Follow / Hide buttons under every result. | YouTube and Spotify use a ⋮ menu per card. | ⋮ menu with Follow channel, Hide channel, Star video. | Med | S |
| Hidden line "3 hidden · Why · Show" is good and honest (R6). The "Why" list is long text. | – | Keep. Use small icons per reason (Shorts icon, lock for "can't embed"). | Low | S |
| Search button is a separate big lime pill. | YouTube: icon in the box, Enter to search. | Search icon button inside the box; saves width on phones. | Low | S |

### Watch (`p10-watch.png`, `p10b-watch-full.png`, `p11`–`p15`, `l04-watch.png`, `l05-watch-after-key-mark.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Phone: the player scrolls away when you read or write notes (`p15`). | YouTube mobile, Coursera, Udemy: player pinned at top, content scrolls below. | `position: sticky; top: 0` on the player block on phones. Nothing may cover the player (R7), so the sticky player sits above the content, not over it. | High | M |
| Laptop: three columns (nav + video + notes) squeeze the video to ~600 px (`l04`). | YouTube hides the guide on watch; Coursera and Udemy give the video ~65% and notes ~35%. | Hide the left nav on Watch; video ~62%, notes panel ~38%, resizable later. | High | S |
| Title sits under the capture bar and hint line. | YouTube: title right under the player, then channel row with actions. | Player → title (2 lines max) → channel · date → action row → notes/description. | Med | S |
| Mark at 0:00 when the video hasn't started; the N key too. No warning. | Notion/YiNote stamp only while playing. | If player time is 0 and state isn't playing, show "Press play first". | High | S |
| Capture "Star" makes a starred mark, but its icon never fills (`fill="none"` after tap). Note rows have a second Star with a different meaning. A video star is coming. | Spotify: one save icon, fills/turns green with a pop. YouTube: one Save. | One meaning per icon. Star = video. Capture bar: Mark, Doubt, Notes, −10s. "Important" becomes a highlight colour in the notepad. | High | S |
| Hint "Mark saves this second. Write the note at the next pause." under the bar on every visit. | Hints appear once (Notion tooltips). | Show once, then hide. Long-press/tooltip on icons instead. | Low | S |
| Tags "Def / Sec / PYQ / Trick" are abbreviations; "Sec" is unclear (section? second?). | Keep labels are full words, colour-coded. | Full words: Definition, Section, Past question, Trick, each with a colour dot. | Med | S |
| Every note shows Edit and Delete buttons, doubts show an answer field and a big lime "Solved" (`p15`). Visually loud. | Keep and Notion: actions on hover / ⋮; tap note text to edit inline. | Tap text to edit; ⋮ for Delete and Make card; Solved as a small check. | Med | S |
| Several targets are 32 px high (time chips, Star, Edit, Delete) and the Watch-on-YouTube link is 17 px. | WCAG 2.2 target 24 px min; Material/Apple 44–48 px. | Make all at least 40–44 px tall on phones. | Med | S |
| Toast "Doubt parked at 0:00. Keep going." covers the input you'd type in (`p13`), and "Card made" covers a note (`p15`). | YouTube snackbars sit at the bottom but above content in a reserved strip; Keep shows inline "Saved". | Toast under the player, or inline next to the button; 1.5 s. | Med | S |
| Doubt prompt opens in the side column on phone, below the title; okay, but its "Later" link next to "Save" is easy to miss. | – | Fine; make "Later" a plain secondary button. | Low | S |
| No description, no comments. | YouTube: description collapsed under title; comments below, timestamps clickable. | Being built; see "Items already in progress" for the layout to check against. | High | – |

### Library (`p16-library.png`, `l06-library.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Library lists "every lecture you have taken notes on", the same set Personal shows grouped. Two screens, one list. | YouTube "You": History, Playlists, Watch later. Spotify: chips Playlists / Albums / Liked. Kindle: Library = books you own. | Library = Starred and History (being built). Notes live in Personal. | High | M |
| Big thumbnails, one per screen on a phone. Fine for a feed, slow for a shelf. | YouTube History and Spotify Library: compact rows (small thumb left, title right). | Compact rows in Library; big cards only in the feed. | Med | S |
| Counts "5 notes · 2 open doubts" are useful. | – | Keep as small icons with numbers (notebook icon 5, ? icon 2). | Low | S |

### Personal (`p17-personal.png`, `p18-personal-doubts.png`, `l07-personal.png`, `l07b-personal-full.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Top half is profile card + 3 stats + 4 menu rows. The notebook starts below the fold. | Notion, Keep: your notes are the first thing; settings in a corner. | Header: title "My notes" + gear. Then search, filters, notes. Move stats to the bottom or remove. | High | S |
| Email shown large (and wraps badly on phones, `p17`). | Spotify/YouTube show a name or avatar, email only in Settings. | Remove email from this screen. | Low | S |
| Filter row All / Doubts / Starred + a separate Search button. | Keep: search bar on top, filter chips under, live results while typing. | Live search (debounced), chips: All · Doubts · Important · tag colours. | Med | S |
| Empty marks show as "(empty mark)" rows. | – | Collect them in one "3 marks to fill in" row at the top. | Med | S |
| No way to see notes without the video blocks. | Being built ("With videos / Only notes"). | See below. | High | – |

### Revision cards (`p19-cards.png`, `p20-card-answer.png`, `p21-cards-done.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| Works well: one card, big "Show answer", three grades, swipe, replay of the 90 s on "Forgot". The replay is a strong idea. | Anki, Quizlet, RemNote. Anki users mostly use only Again and Good. | Keep three grades (Forgot / Not sure / Knew it); it is already simpler than Anki's four. | – | – |
| "Show answer" button has a lime glow and gradient; the card is a dark box. Lots of empty space under it on phones. | Quizlet: card fills the screen, tap to flip. | Make the card taller; tap the card to flip (already works) and drop the glow. | Low | S |
| Source line "SA 200 || Overall Objective… · 0:00" truncated. | – | Show channel + time chip that opens the moment. | Low | S |
| Card maker (`p14`): tap words to hide. Clear. | Quizlet/RemNote cloze. | Keep. Add a hint of how many words are picked (max 5). | Low | S |

### Settings (`p22-settings.png`, `p24-delete-confirm.png`, `p25-after-delete.png`)

| Problem | What the best apps do | Fix | Sev | Effort |
|---|---|---|---|---|
| "Back to Personal" as an underlined link under the title. | iOS/Android: back arrow at top-left. | Back arrow in the top bar on all sub-pages (Settings, Cards, Watch). | Low | S |
| "Show Shorts" is a checkbox. | Every settings screen uses a switch for on/off. | Switch. | Low | S |
| No theme choice. | Notion, YouTube, Keep: Appearance → System / Light / Dark. | Add Appearance (follows the new palette). | Med | S |
| After deletion the Welcome page shows no confirmation. | Google, Spotify confirm with a message or email. | Fix the redirect race (see top 10, #10). | Med | S |
| Hide list shows category chips (good, R3-safe). | – | Keep. | – | – |

## Items already in progress: best-practice layout to check against

### 1. Description and comments with clickable timestamps

What YouTube does (`b01-youtube-watch-laptop.png`):
- Order under the player: title → channel row with Subscribe and actions → **description box** → **comments**.
- Description box: grey rounded box, first line "55K views · 5 years ago" in bold, then 2–3 lines of text, "...more" at the end. Tapping anywhere opens it in place. Timestamps (`12:30`) and the chapter list become blue links that seek the player without reloading. "Show less" at the bottom.
- Comments: header "49 Comments" + "Sort by" (Top / Newest). Each comment: avatar 40 px, `@handle · 3 years ago` in muted small text, comment text, likes. Timestamps in comments are blue links that seek. Long comments clamp to ~4 lines with "Read more".
- On mobile, comments are collapsed into a single card ("Comments 49" with the top comment preview); tap opens a bottom sheet over the page content (not over the player).
- Coursera/Udemy put Transcript, Notes and Q&A in tabs under the video; that pattern fits FocusLearn's narrow phone column better than one long scroll.

Check the implementation for:
- Tabs under the player on phone: **Notes · About · Comments** (About = description). Notes default.
- Timestamps in both description and comments seek the embedded player (`seekTo`) and show a small "Jumped to 12:30" cue; they must not open YouTube.
- Sort comments by relevance first ("Top"), like YouTube; that is where the "timestamps of important parts" comments sit.
- One-tap "Add to my notes" on a timestamp comment is tempting, but it copies other people's text into user data. Keep it to the time only (creates a Mark at that second), not the comment text. (unsure whether copying text is allowed; safer not to.)
- Quota and storage: `commentThreads.list` costs 1 unit per page (search costs 100), so 20 comments per open is cheap, but it still counts against the 10,000-unit pool (R12). Fetch on tab open, not on page load; cache ≤30 days (R1). Show author names and link to YouTube as YouTube shows them; don't filter comments by our own judgement (R3); don't log video IDs (R11). R9: these are YouTube data, no "not from YouTube" note needed on them, but the user's own notes shown beside them should stay visually distinct.
- Empty states: "Comments are off for this video" (YouTube returns 403 `commentsDisabled`) and "Description is empty".

### 2. Split-screen rich-text notepad per video

What the best apps do:
- **Coursera:** Notes panel on the right of the video on desktop; "Save note" button under the video; notes list with time chip, tap to seek.
- **Notion / Google Docs:** floating format toolbar on text selection (Bold, Highlight, H1/H2, bullet, checklist). Highlight is a background colour from 5–10 swatches. `/` commands for headings and lists. Autosave, no Save button, "Saved" shown faintly.
- **Google Keep:** colour per note (12 swatches), checklists, pin. Very light chrome.
- **HoverNotes, YiNote, ReClipped:** video left, notepad right; a "insert timestamp" button drops a clickable time at the cursor; screenshot button.
- **Notability / GoodNotes:** split view with a draggable divider.

Layout to check against:
- One tap to open: a **Notes** button with a notebook-pen icon in the action row under the player (and the N key on laptop).
- Laptop: video left ~60%, notepad right ~40%, drag handle between, full height. Phone portrait: player pinned top (16:9, about 230 px), notepad fills the rest below it, keyboard pushes the notepad, never the player. Phone landscape: side by side 50/50.
- Toolbar: one slim row (sticky above the keyboard on phones): **B**, *I*, H, bullet, checklist, highlight (5 colours), text colour (same 5), "⏱ insert time". Hide the rest. Formatting appears on selection too (Notion).
- Each paragraph or block can carry a time chip; tapping it seeks. "Insert time" stamps the current second at the cursor.
- Autosave with "Saved" in muted text; offline-safe; no Save button.
- Marks, doubts and the free notepad must be one place, not two. Marks become timed lines inside the notepad; doubts are lines with a "?" style. Otherwise students won't know where their notes are.
- Nothing overlaps the player (R7). The notepad may never be a floating layer on top of the iframe.
- Close: an × or the same Notes button toggles back; the notepad state stays.

### 3. Star a video, Library tabs Starred and History

What the best apps do:
- **YouTube:** "Save" (bookmark icon) in the action pill row under the title; tapping opens "Save to…" with Watch later and playlists; a snackbar "Saved to Watch later · Change". Library/"You": History carousel first, then Playlists, Watch later, Liked.
- **Spotify:** a (+) that becomes a filled green ✓ on save, with a small bounce; Your Library has chips (Playlists, Artists, Albums) and Liked Songs pinned at the top.
- **Pocket / Kindle:** Saves list with sort (Newest), compact rows, archive.
- **Instagram/Twitter like:** icon fills and scales 1 → 1.2 → 1 in ~150 ms; the state changes before the network call returns (optimistic), and reverts with a toast if it fails.

Check the implementation for:
- Star sits in the action row under the title (and in each card's ⋮ menu), not in the capture bar.
- Tap: fill to `--star` colour at once, 150 ms pop, `aria-pressed` true, short toast "Starred · in Library". On failure, revert and say "Couldn't star. Try again."
- Library: segmented tabs **Starred · History** at the top (Playlists later as a third). History grouped by day ("Today", "Yesterday"), each row shows a progress bar under the thumbnail area (not on it, R7) and "Resume 23:10". Star rows sorted by newest star. Clear empty states with one action.
- History is YouTube data per user: titles fetched fresh, nothing older than 30 days stored (R1), no history for Made-for-Kids videos (R14), and History removable item by item plus "Clear all".

### 4. Personal: "With videos" vs "Only notes"

What the best apps do:
- **Kindle Notebook:** highlights grouped under each book's cover; a filter for highlights / notes.
- **Google Keep:** grid or list toggle (one icon in the top bar), notes as cards with their colours.
- **Notion:** same database, different views (List, Gallery, Table) via tabs at the top.
- **Readwise:** "Books" view and "All highlights" feed.

Check the implementation for:
- A two-option segmented control at the top: **By video** (cards: small thumbnail + title, notes under it, collapsible) and **All notes** (a flat feed of notes newest first, each with a small "SA 200 · 12:30" source chip that opens the video at that second).
- The choice is remembered (localStorage is fine; it is a per-viewer convenience).
- Search and filter chips apply to both views.
- In "All notes", the note's highlight colours and tags show, so it reads like a revision sheet; add "Export" there.

### 5. Removing the duplicate Search on Home

What the best apps do: YouTube has one search (top bar), Spotify one (tab), Khan one (header). None put a second search card on Home.

Check the implementation for: no "Smart search" tile, no "Find a lecture" hero button that only opens Search; the empty-Home first step is the goal box. Also remove the "Notes on the lecture" tile that falls back to /search. The goal "Change" link can stay.

## Features: keep, change, cut

Evidence base: Pendo's 2019 study of 615 products found ~80% of features are rarely or never used; Anki users mostly press only Again and Good; YouTube's own move from Library to "You" put History and Playlists first because those are what people open.

| Feature | Verdict | Why |
|---|---|---|
| Goal → feed | Keep | Core value; the feed is what users open the app for. Hide the chip bar when it has one chip. |
| Search with hidden line (R6) | Keep, one entry point | Used often; honest. |
| Mark (stamp the second) | Keep | The core study action. Guard against 0:00. |
| Doubt | Keep, merge into the notepad | Useful, but a second list of notes confuses. A doubt = a note with a "?" style and a "Solved" tick. |
| Capture-bar Star (starred mark) | Cut / replace | Duplicates note star and clashes with video star. Use a highlight colour. |
| −10s button | Keep (unsure) | YouTube's player already has double-tap −10s on phones but not in the embed; keep until usage data says otherwise. |
| Tags Def/Sec/PYQ/Trick | Change | Full words with colours; 4 is the right number. |
| "Fill in marks later" tray | Keep, simplify | Good idea; show as one compact strip "2 marks to fill". |
| Revision cards | Keep | Strong; the 90-second replay on "Forgot" is the best feature in the app. |
| Card swipe | Keep, low priority | Buttons are what most people use; swipe is a bonus. |
| Home study tools grid | Cut | Repeats the tabs; buried at the bottom anyway. |
| Home weekly stats | Cut from Home | Low value, gamified feel; move to Personal or drop. |
| "How it works" | Keep only for new users | Hide after first note. |
| Study with friends (Coming next) | Cut from UI | Shows a feature that doesn't exist on two screens. |
| Follow channel | Keep, move to ⋮ | Feeds "For you"; doesn't need a button on every card. |
| Hide channel | Keep, move to ⋮ | Same. Undo works well. |
| Export notes (.md) | Keep, move to Personal ⋮ | Rarely used, but a trust feature. ".md" means nothing to most students: say "Download my notes". |
| Profile card with email | Cut | No use on a notes screen. |
| Avatar in top bar | Cut | Duplicates the Personal tab. |
| Show Shorts setting | Keep | User choice; switch control. |

## Method notes

- Real tasks done: sign up, set goal, browse feed, one search (plus cached reloads, 1 live search call), open a lecture, Mark, fill in, Doubt, starred mark, star a note, make a card, review it, Library, Personal (all, doubts), Settings, delete account.
- Timings measured: sign-up 1.9 s; search 1.9 s; Follow, Mark and Star feedback ~0.35 s; note-star toggle 0.46 s (waits for the server; make it optimistic).
- Headless browser could not press play inside the YouTube iframe, so the "0:00" marks partly come from that; a real user who taps Mark before pressing play hits the same thing.
- Benchmarks opened live: YouTube watch page (`b01`), Khan Academy video page (`b03`). Others from documentation and articles:
  - YouTube timestamps and chapters: https://www.sendible.com/insights/youtube-timestamp-link
  - YouTube Library → "You" tab: https://www.androidcentral.com/apps-software/youtube-replacing-library-with-you-tab
  - Coursera notes beside lectures: https://blog.coursera.org/ready-for-retention-presenting-a-unified-note-taking-experience/
  - Split-screen video notes (HoverNotes, Glasp, YiNote): https://hovernotes.io/en/blog/youtube-notes-youtube-note-taking
  - commentThreads.list quota (1 unit): https://developers.google.com/youtube/v3/docs/commentThreads/list
  - Material dark theme (#121212, desaturated colours): https://codelabs.developers.google.com/codelabs/design-material-darktheme
  - Dark mode, halation and reading speed: https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone
  - Anki button usage: https://forums.ankiweb.net/t/an-info-tip-regarding-recommended-button-usage/39834
  - Spotify save (+ → ✓): https://community.spotify.com/t5/Your-Library/The-Heart-button-is-being-replaced-with-a-Plus-button/td-p/5513715
  - Pendo feature adoption: https://www.pendo.io/resources/the-2019-feature-adoption-report/
