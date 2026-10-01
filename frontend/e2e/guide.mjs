// Builds docs/guide/app-guide.html: every screen, with an arrow from each button or panel to what it does.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Uses a throwaway account, deleted at the end.
// Run: node e2e/guide.mjs
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const root = new URL('../../docs/guide/', import.meta.url)
const out = (name) => new URL(name, root).pathname.replace(/^\/([A-Za-z]:)/, '$1')
fs.mkdirSync(out(''), { recursive: true })

const W = 412
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: W, height: 915 }, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
const screens = []
const log = (...a) => console.log('✔', ...a)

// Keep long lists short so each picture stays readable.
async function trim(selector, keep) {
  await page.evaluate(([sel, n]) => document.querySelectorAll(sel).forEach((el, i) => i >= n && el.remove()), [selector, keep])
}

// items: [locator, title, text]. Missing elements are skipped (and reported).
async function shoot(id, title, intro, items) {
  await page.waitForTimeout(700)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.setViewportSize({ width: W, height: Math.max(915, height) })
  await page.waitForTimeout(500)
  const callouts = []
  for (const [loc, t, text] of items) {
    const box = await loc.first().boundingBox().catch(() => null)
    if (!box) {
      console.log('  (skipped, not on screen):', t)
      continue
    }
    callouts.push({ title: t, text, box })
  }
  const img = (await page.screenshot({ type: 'jpeg', quality: 80 })).toString('base64')
  await page.setViewportSize({ width: W, height: 915 })
  screens.push({ id, title, intro, width: W, height: Math.max(915, height), img, callouts })
  log(id, `${callouts.length} arrows`)
}

const api = (path, body) =>
  page.evaluate(
    async ([p, b]) => {
      const r = await fetch(p, {
        method: b === undefined ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` },
        body: b === undefined ? undefined : JSON.stringify(b),
      })
      return r.status === 204 ? null : r.json()
    },
    [path, body],
  )

const role = (r, name, exact = true) => page.getByRole(r, { name, exact })
const tabbar = () => page.locator('.tabbar')

try {
  // ---------- Welcome ----------
  await page.goto(BASE + '/welcome')
  await page.locator('.landing-hero').waitFor()
  await shoot('welcome', 'Welcome page', 'What anyone sees before signing up.', [
    [role('link', 'Get started'), 'Get started', 'Make a free account. You need to be 18 or over.'],
    [role('link', 'Sign in'), 'Sign in', 'Already have an account? Sign in here.'],
    [page.locator('.phone'), 'Picture of the study page', 'A drawing of what studying looks like: the video, the Mark / Doubt / Star buttons, your notes, and tonight’s cards.'],
    [page.locator('.feature').nth(0), 'What the app does', 'Six boxes explain the six main features. Each one is explained in detail further down this guide.'],
  ])

  // ---------- Sign up ----------
  const email = `guide-${Date.now()}@example.com`
  await role('link', 'Get started').click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel(/Password/).fill('guide test password 1')
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  await shoot('signup', 'Create your account', 'One short form. Read the grey box: it says exactly what the app stores.', [
    [page.locator('.notice'), 'What we store', 'Your email, a scrambled password, your goals and notes. Never the videos you watch in the log.'],
    [page.getByLabel('Date of birth'), 'Date of birth', 'Only used once to check you are 18 or over. It is not kept.'],
    [role('button', 'Create account'), 'Create account', 'Tap to finish. You land on Home.'],
  ])
  await role('button', 'Create account').click()
  await page.getByLabel('Your learning goal').waitFor()

  // ---------- Home, first time ----------
  await page.waitForTimeout(1500)
  await shoot('home-new', 'Home, the very first time', 'A new account is empty. Start by telling the app what you are studying.', [
    [page.locator('.greet'), 'Greeting', 'Today’s date and a hello.'],
    [page.locator('.hero'), 'Today card', 'Always shows the ONE thing to do next. Right now: find your first lecture.'],
    [page.getByLabel('Your learning goal'), 'Your goal', 'Type what you study, in your own words: “CMA Inter costing”, “NEET biology”, “machine learning”.'],
    [role('button', 'Set goal'), 'Set goal', 'Saves it. Your feed then fills with videos for that goal.'],
    [page.locator('.feed'), 'Your feed', 'Empty until you set a goal or follow channels.'],
    [page.locator('.tools'), 'Study tools', 'Six tiles, one per feature. Tap any tile to open it.'],
    [page.locator('.steps'), 'How it works', 'The 3-step routine: find a lecture, mark while you watch, review tonight.'],
    [tabbar(), 'Bottom tabs', 'Home, Search, Library (your lectures), Personal (your notes and settings).'],
  ])

  // ---------- Home with feed ----------
  await page.getByLabel('Your learning goal').fill('CMA Inter costing')
  await role('button', 'Set goal').click()
  await page.locator('.feed .video-list li.video').first().waitFor({ timeout: 40000 })
  const firstVideo = await page.locator('.feed .video-list li.video a.video-link').first().getAttribute('href')
  const VIDEO = firstVideo.split('/').pop()
  await page.locator('.feed li.video').first().getByRole('button', { name: 'Follow channel' }).click()
  await page.getByRole('status').waitFor()
  await trim('.feed .video-list li.video', 2)
  await shoot('home-feed', 'Home with your feed', 'After you set a goal. It works like YouTube’s home page, minus songs, movies, shows, news and vlogs.', [
    [page.locator('.goal-line'), 'Your goal', 'What the feed is built around. Tap Change to study something else.'],
    [page.locator('.feed .chip').nth(0), 'For you', 'A mix of new videos from channels you follow and videos for your goal. Changes every day.'],
    [page.locator('.feed .chip').nth(1), 'Topic chips', 'Swipe sideways. Tap a topic (a paper or chapter) to see videos for just that topic.'],
    [page.getByRole('status'), 'Message', 'Confirms what you just did. “Undo” appears here after hiding a channel.'],
    [page.locator('.feed li.video .thumb').first(), 'A video', 'Tap the picture or title to open the study page for that lecture.'],
    [page.locator('.feed li.video').first().getByRole('button', { name: 'Follow channel' }), 'Follow channel', 'Like subscribing. New videos from this channel come to your feed.'],
    [page.locator('.feed li.video').first().getByRole('button', { name: 'Hide channel' }), 'Hide channel', 'Never see this channel again (good for vlogs). You can undo it.'],
    [page.locator('.feed .hidden-line'), 'Hidden videos', 'How many videos were hidden. “Why” gives the reason, “Show” shows them anyway.'],
    [page.locator('.avatar'), 'Your letter', 'Shortcut to the Personal tab.'],
  ])

  // ---------- Search ----------
  await role('link', 'Search').click()
  await page.getByLabel('Search a topic').fill('cost accounting lecture')
  await role('button', 'Search').click()
  await page.locator('.video-list li.video').first().waitFor({ timeout: 30000 })
  if (await page.getByRole('button', { name: 'Why' }).count()) await page.getByRole('button', { name: 'Why' }).click()
  await trim('.video-list li.video', 2)
  await shoot('search', 'Search', 'Search anything, the way you would on YouTube. Your exact words are searched.', [
    [page.getByLabel('Search a topic'), 'Search box', 'Type a topic, a chapter, a teacher’s name, a podcast. Then tap Search.'],
    [page.locator('.page-head p'), 'What gets hidden', 'Songs, movies, shows, news and vlogs are hidden, using the type YouTube itself gives each video.'],
    [page.locator('li.video').first(), 'Result', 'Tap to open it. Lectures open on the study page, with your notes beside them.'],
    [page.locator('.hidden-line'), 'Hidden line', 'Count of hidden videos. “Why” lists the reasons; “Show” brings them back into the list.'],
  ])

  // ---------- Study page (seed realistic notes through the app's own API) ----------
  await api('/api/notes', { video_id: VIDEO, t_seconds: 402, text: 'Material cost = purchase price + freight inwards', tag: 'def' })
  const csr = await api('/api/notes', { video_id: VIDEO, t_seconds: 754, text: 'Prime cost = direct material + direct labour + direct expenses', tag: 'def', starred: true })
  await api('/api/notes', { video_id: VIDEO, t_seconds: 1210 })
  await api('/api/notes', { video_id: VIDEO, t_seconds: 1533, kind: 'doubt', text: 'Is abnormal loss part of material cost?' })
  await api('/api/cards', { note_id: csr.id, blanks: ['direct labour'] })
  await api('/api/progress', { video_id: VIDEO, position_s: 1630 })

  await page.goto(BASE + '/watch/' + VIDEO)
  await page.locator('.player-frame iframe').waitFor({ timeout: 30000 })
  await page.locator('.tray').waitFor()
  await role('button', /Doubt/, false).click()
  await page.locator('.doubt-line').waitFor()
  await shoot('study', 'Study page (the heart of the app)', 'Opens when you tap any video. The video plays at the top; everything you capture stays with this lecture.', [
    [page.locator('.player-frame'), 'The video', 'YouTube’s own player. Nothing covers it. Pause, speed and full screen work as usual.'],
    [page.locator('.resume-line'), 'Resume', 'It starts where you stopped last time. Tap “Start from the beginning” to restart.'],
    [page.locator('.capture .mark'), 'Mark', 'One tap saves THIS second of the lecture. Write what it was later. (Keyboard: N)'],
    [page.locator('.capture .doubt'), 'Doubt', 'Didn’t understand? Tap Doubt, keep watching, solve it later. (Keyboard: D)'],
    [page.locator('.capture .star-btn'), 'Star', 'Saves this second as important, e.g. “likely in the exam”. (Keyboard: S)'],
    [page.locator('.capture .back'), '−10s', 'Jumps back 10 seconds when you missed something.'],
    [page.getByRole('status'), 'Confirmation', 'Tells you what was saved and at which minute.'],
    [page.locator('.doubt-line'), 'Write your doubt', 'Optional: type the question now, or tap “Later”.'],
    [page.locator('.tray .time-chip').first(), 'Play it again', 'In “marks to fill in”: replays the moment you marked, so you can write it down.'],
    [page.locator('.tray input').first(), 'Write one line', 'What was said at that moment, in your own words.'],
    [page.locator('.tray .tags').first(), 'Type of note', 'Def = definition, Sec = section of law, PYQ = past paper question, Trick = memory trick.'],
    [page.locator('.notes .note').first().locator('.time-chip'), 'Time', 'Tap any time to jump the video back to that exact moment.'],
    [page.locator('.notes .note').first().locator('.star'), 'Star a note', 'Starred notes get their own filter in Personal.'],
    [page.locator('.notes .note.is-doubt').first(), 'An open doubt', 'Orange line = doubt. When you find the answer, write it and tap Solved.'],
    [page.getByRole('button', { name: /Make a card/ }).first(), 'Make a card', 'Turns this note into a revision card (see the next picture).'],
    [page.locator('.notes .note .del').first(), 'Edit / Delete', 'Change or remove a note.'],
  ])

  // ---------- Card maker ----------
  await page.getByRole('button', { name: 'Make a card', exact: true }).first().click()
  const sheet = page.getByRole('dialog', { name: 'Make a card' })
  await sheet.getByRole('button', { name: 'freight', exact: true }).click()
  await shoot('card-maker', 'Making a revision card', 'A card is your own note with a few words hidden. Later the app asks you to remember the hidden words.', [
    [sheet.locator('.word').first(), 'Your words', 'Every word of your note is a button.'],
    [sheet.locator('.word.on').first(), 'Hidden word', 'Tap the words you want to test yourself on (up to 5). They turn into _____.'],
    [sheet.getByRole('button', { name: 'Save card' }), 'Save card', 'Saves it. It shows up in Revision straight away, then again on the right days.'],
  ])
  await sheet.getByRole('button', { name: 'Cancel' }).click()

  // ---------- Home after studying ----------
  await role('link', 'Home').click()
  await page.locator('.hero').waitFor()
  await page.locator('.feed .video-list li.video').first().waitFor({ timeout: 40000 })
  await trim('.feed .video-list li.video', 1)
  await shoot('home-today', 'Home after you have studied', 'The top card now picks up where you left off.', [
    [page.locator('.hero-main'), 'Continue', 'The last lecture you watched, and the minute you stopped at.'],
    [page.locator('.hero .button'), 'Resume', 'Opens the lecture at that minute.'],
    [page.locator('.hero-pill').nth(0), 'Cards due', 'Revision cards waiting for you today.'],
    [page.locator('.hero-pill').nth(1), 'Open doubts', 'Doubts you haven’t solved yet.'],
    [page.locator('.hero-pill').nth(2), 'Marks to fill in', 'Seconds you marked but haven’t written about yet.'],
    [page.locator('.tool').nth(2), 'Revision cards tile', 'Shows how many cards are due. Tap to review.'],
    [page.locator('.stats'), 'This week', 'Cards reviewed, notes made, lectures studied. Just counts: no streaks, no points.'],
  ])

  // ---------- Revision ----------
  await page.goto(BASE + '/cards')
  await page.locator('.card-face').waitFor()
  await shoot('cards-front', 'Revision: the question', 'Your note, with the words you chose hidden. Try to remember them before you look.', [
    [page.locator('.title-row .badge'), 'Card count', 'Which card you are on, out of today’s total.'],
    [page.locator('.card-face .from'), 'Where it came from', 'The lecture and the minute this note was taken.'],
    [page.locator('.card-front'), 'The question', 'Say the missing words in your head.'],
    [role('button', 'Show answer'), 'Show answer', 'Reveals your full note. Tapping the card does the same.'],
  ])
  await role('button', 'Show answer').click()
  await shoot('cards-answer', 'Revision: grade yourself', 'Be honest. This decides when the card comes back.', [
    [page.locator('.card-answer'), 'Your note', 'The full note, so you can check.'],
    [page.locator('.swipe-hint'), 'Swipe', 'On a phone you can swipe the card: left = Forgot, right = Knew it.'],
    [role('button', 'Forgot'), 'Forgot', 'Shows you the 90 seconds of the lecture around this note, and asks again at the end.'],
    [role('button', 'Not sure'), 'Not sure', 'Comes back tomorrow.'],
    [role('button', 'Knew it'), 'Knew it', 'Comes back later each time: 1 day, then 3 days. Know it 3 times and it retires.'],
  ])
  await role('button', 'Forgot').click()
  await page.locator('.replay iframe').waitFor({ timeout: 30000 })
  await shoot('cards-replay', 'Revision: “Watch this bit”', 'When you forget, you re-watch only the part of the lecture where you took the note.', [
    [page.locator('.replay .player-frame'), 'The exact bit', 'Starts 30 seconds before your note and stops 60 seconds after.'],
    [role('button', 'Ask me again later'), 'Ask me again later', 'Moves on. This card comes back at the end of today’s review.'],
  ])
  await role('button', 'Ask me again later').click()
  await role('button', 'Show answer').click()
  await role('button', 'Knew it').click()
  await page.getByRole('heading', { name: 'Done. Sleep well.' }).waitFor()
  await shoot('cards-done', 'Revision: finished', 'When the cards are done, you are done. No streaks, no pressure.', [
    [page.getByRole('heading', { name: 'Done. Sleep well.' }), 'Done', 'All of today’s cards are reviewed. They will come back on their own days.'],
  ])

  // ---------- Library ----------
  await role('link', 'Library').click()
  await page.locator('li.video').first().waitFor()
  await shoot('library', 'Library', 'Every lecture you have taken notes on.', [
    [page.locator('li.video .thumb').first(), 'A lecture', 'Tap to open it again, with all your notes.'],
    [page.locator('li.video .counts').first(), 'Counts', 'How many notes you took, and open doubts in orange.'],
  ])

  // ---------- Personal ----------
  await role('link', 'Personal').click()
  await page.locator('.lecture-block').first().waitFor()
  await shoot('personal', 'Personal (only you see this)', 'Your private space: all your notes in one place, plus settings.', [
    [page.locator('.profile'), 'Your account', 'The email you signed in with.'],
    [page.locator('.stats'), 'Your totals', 'All notes, lectures and cards so far.'],
    [page.locator('.list-row').nth(0), 'Revision cards', 'Opens today’s review.'],
    [page.locator('.list-row').nth(1), 'Export my notes', 'Downloads all your notes as a file, with links back to the exact minute on YouTube.'],
    [page.locator('.list-row').nth(2), 'Settings', 'What is hidden, Shorts, sign out, delete your data.'],
    [page.getByLabel('Search your notes'), 'Search your notes', 'Find any note by a word in it.'],
    [page.locator('.segmented'), 'Filters', 'All notes, only Doubts, or only Starred notes.'],
    [page.locator('.lecture-block h3').first(), 'Lecture title', 'Notes are grouped by lecture. Tap the title to open the lecture.'],
    [page.locator('.lecture-block .time-chip').first(), 'Open at this minute', 'Tap a time and the lecture opens right at that note.'],
  ])

  // ---------- Settings ----------
  await role('link', 'Settings').click()
  await page.getByRole('heading', { name: 'What’s hidden' }).waitFor()
  await shoot('settings', 'Settings', 'Your switches.', [
    [page.locator('.settings-section .chips').first(), 'Hide list', 'The kinds of videos the app hides. Everything else shows, including podcasts.'],
    [page.getByLabel('Show Shorts'), 'Show Shorts', 'Shorts are hidden at first. Tick this to see them.'],
    [page.getByText('Channels you hid'), 'Hidden channels', 'How many channels you hid. “Unhide all” brings them back.'],
    [role('button', 'Sign out'), 'Sign out', 'Signs you out on this device.'],
    [role('button', 'Delete my data'), 'Delete my data', 'Deletes your account and everything in it, at once.'],
  ])

  // ---------- Clean up the throwaway account ----------
  await role('button', 'Delete my data').click()
  await role('button', 'Yes, delete everything').click()
  await page.waitForURL('**/welcome')
  log('test account deleted')
} catch (e) {
  console.log('FAILED:', e.message)
  process.exitCode = 1
} finally {
  await browser.close()
}

fs.writeFileSync(out('screens.json'), JSON.stringify(screens))
console.log(errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors', `· ${screens.length} screens`)
