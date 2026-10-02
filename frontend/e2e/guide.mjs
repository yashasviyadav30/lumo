// Builds docs/guide/screens.json for the visual guide: every screen, with an arrow from each button or panel.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Uses a throwaway account, deleted at the end.
// Run: node e2e/guide.mjs && node e2e/guide-build.mjs
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
// Where the API lives: same origin locally (Vite proxy); Render for the live site.
const API = process.env.E2E_API ?? '' // same origin: Vite proxy locally, the Cloudflare Worker live
let signedUp = false
let deleted = false
const root = new URL('../../docs/guide/', import.meta.url)
const out = (name) => new URL(name, root).pathname.replace(/^\/([A-Za-z]:)/, '$1')
fs.mkdirSync(out(''), { recursive: true })

const PHONE = { width: 412, height: 915 }
const LAPTOP = { width: 1280, height: 860 }
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
const screens = []
const log = (...a) => console.log('✔', ...a)

async function trim(selector, keep) {
  await page.evaluate(([sel, n]) => document.querySelectorAll(sel).forEach((el, i) => i >= n && el.remove()), [selector, keep])
}

// items: [locator, title, text]. Missing elements are skipped (and reported).
// full: grow the window to the page height (no scrolling); otherwise shoot exactly what is on screen.
async function shoot(id, title, intro, items, { size = PHONE, full = true } = {}) {
  await page.setViewportSize(size)
  await page.waitForTimeout(600)
  let height = size.height
  if (full) {
    height = Math.max(size.height, await page.evaluate(() => document.documentElement.scrollHeight))
    await page.setViewportSize({ width: size.width, height })
    await page.waitForTimeout(400)
  }
  const callouts = []
  for (const [loc, t, text] of items) {
    const box = await loc.first().boundingBox().catch(() => null)
    if (!box || box.y > height) {
      console.log('  (skipped, not on screen):', t)
      continue
    }
    callouts.push({ title: t, text, box })
  }
  const img = (await page.screenshot({ type: 'jpeg', quality: 80 })).toString('base64')
  await page.setViewportSize(PHONE)
  screens.push({ id, title, intro, width: size.width, height, img, callouts })
  log(id, `${callouts.length} arrows`)
}

const api = (path, body, method) =>
  page.evaluate(
    async ([p, b, m]) => {
      const r = await fetch(p, {
        method: m ?? (b === undefined ? 'GET' : 'POST'),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` },
        body: b === undefined ? undefined : JSON.stringify(b),
      })
      return r.status === 204 ? null : r.json()
    },
    [API + path, body, method],
  )

const role = (r, name, exact = true) => page.getByRole(r, { name, exact })
const tabbar = () => page.locator('.tabbar')

// Start the video from a real tap on the player, like a student would.
async function playVideo() {
  const frame = page.locator('.player-frame iframe')
  await frame.waitFor({ timeout: 30000 })
  await page.waitForTimeout(2500)
  const box = await frame.boundingBox()
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(4000)
}

try {
  // ---------- Welcome ----------
  await page.goto(BASE + '/welcome')
  await page.locator('.landing-hero').waitFor()
  await shoot('welcome', 'Welcome page', 'What anyone sees before signing up.', [
    [role('link', 'Get started'), 'Get started', 'Make a free account. You need to be 18 or over.'],
    [role('link', 'Sign in'), 'Sign in', 'Already have an account? Sign in here.'],
    [page.locator('.phone'), 'A look inside', 'A drawing of the study page: the video, the capture buttons, your notes, tonight’s cards.'],
    [page.locator('.feature').nth(0), 'Three things it does', 'Only study videos, notes beside the lecture, and cards that come back.'],
  ])

  // ---------- Sign up ----------
  const email = `guide-${Date.now()}@example.com`
  await role('link', 'Get started').click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel(/Password/).fill('guide test password 1')
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  signedUp = true // from here on, clean up even if sign-up itself stalls
  await role('button', 'Create account').click()
  await page.getByLabel('Your learning goal').waitFor({ timeout: 90000 })
  await page.waitForTimeout(1200)

  // ---------- Home, first time ----------
  await shoot('home-new', 'Home, the very first time', 'One first step: tell the app what you study.', [
    [page.locator('.steps'), 'How it works', 'Three steps: pick a lecture, mark while you watch, review tonight. Shown only until you start.'],
    [page.getByLabel('Your learning goal'), 'Your goal', 'Type it in your own words: “CMA Inter costing”, “NEET biology”, “machine learning”.'],
    [role('button', 'Set goal'), 'Set goal', 'Saves it. Your feed fills with videos for it.'],
    [tabbar(), 'Bottom tabs', 'Home (feed), Search, Library (starred + history), My notes (everything you wrote).'],
  ])

  // ---------- Home with feed ----------
  await page.getByLabel('Your learning goal').fill('CMA Inter costing')
  await role('button', 'Set goal').click()
  await page.locator('.feed .video-list li.video').first().waitFor({ timeout: 40000 })
  const firstHref = await page.locator('.feed li.video a.video-link').first().getAttribute('href')
  const VIDEO = firstHref.split('/').pop()
  await trim('.feed .video-list li.video', 2)
  await page.locator('.feed li.video').first().getByRole('button', { name: 'More actions' }).click()
  await shoot('home-feed', 'Home: your feed', 'Like YouTube’s home page, minus songs, movies, shows, news and vlogs.', [
    [page.locator('.goal-line'), 'Your goal', 'What the feed is built around. Tap Change to study something else.'],
    [page.locator('.feed .chip').nth(0), 'For you', 'New videos from channels you follow, mixed with videos for your goal. Changes daily.'],
    [page.locator('.feed .chip').nth(1), 'Topic chips', 'Swipe sideways; tap a paper or chapter to see only that.'],
    [page.locator('.feed li.video .thumb').first(), 'A video', 'Tap to open it on the study page.'],
    [page.locator('.feed li.video .channel').first(), 'Channel · length · age', 'Who made it, how long it is, and how old it is (law changes, so age matters).'],
    [page.locator('.menu').first(), '⋮ menu', 'Star the video, follow the channel, or hide the channel for good.'],
    [tabbar(), 'Tabs', 'Always at the bottom.'],
  ])
  await page.keyboard.press('Escape')

  // ---------- Search ----------
  await role('link', 'Search').click()
  await page.getByLabel('Search a topic').fill('cost accounting lecture')
  await role('button', 'Search').click()
  await page.locator('.video-list li.video').first().waitFor({ timeout: 30000 })
  if (await page.getByRole('button', { name: 'Why' }).count()) await page.getByRole('button', { name: 'Why' }).click()
  await trim('.video-list li.video', 2)
  await shoot('search', 'Search', 'Type anything, the way you would on YouTube.', [
    [page.getByLabel('Search a topic'), 'Search box', 'A topic, a chapter, a teacher, a podcast. Your exact words are searched.'],
    [page.locator('li.video').first(), 'Result', 'Tap to open. ⋮ has Star, Follow and Hide.'],
    [page.locator('.hidden-line'), 'Hidden videos', 'How many were hidden and why (YouTube’s own labels). “Show” brings them back.'],
  ])

  // ---------- Study page ----------
  const n1 = await api('/api/notes', { video_id: VIDEO, t_seconds: 402, text: 'Material cost = purchase price + freight inwards', tag: 'def' })
  const n2 = await api('/api/notes', { video_id: VIDEO, t_seconds: 754, text: 'Prime cost = direct material + direct labour + direct expenses', tag: 'def', starred: true })
  await api('/api/notes', { video_id: VIDEO, t_seconds: 1210 })
  await api('/api/notes', { video_id: VIDEO, t_seconds: 1533, kind: 'doubt', text: 'Is abnormal loss part of material cost?' })
  await api('/api/cards', { note_id: n2.id, blanks: ['direct labour'] })
  await api('/api/progress', { video_id: VIDEO, position_s: 1630 })
  void n1

  await page.goto(BASE + '/watch/' + VIDEO)
  await playVideo()
  await shoot(
    'study',
    'Study page',
    'Opens when you tap a video. The video stays pinned at the top while you scroll your notes.',
    [
      [page.locator('.player-frame'), 'The video', 'YouTube’s own player. Nothing covers it.'],
      [page.locator('.lecture-title'), 'Title', 'Then channel and how long ago it was uploaded.'],
      [page.locator('.star-video'), 'Star', 'Save this video. The star fills at once; find it in Library → Starred. (Key: S)'],
      [page.locator('.capture .mark'), 'Mark', 'One tap saves this second. Write what it was at the next pause. (Key: N)'],
      [page.locator('.capture .doubt'), 'Doubt', 'Didn’t get it? Park it and keep watching. (Key: D)'],
      [page.locator('.capture .pad'), 'Notepad', 'Opens a full notepad beside the video: colours, highlights, lists. (Key: P)'],
      [page.locator('.capture .back'), '−10s', 'Missed something? Jump back 10 seconds.'],
      [page.getByRole('tab', { name: /Marks/ }), 'Marks', 'Your marks and doubts for this lecture.'],
      [page.getByRole('tab', { name: /Description/ }), 'Description', 'The teacher’s description. Chapter times jump the video.'],
      [page.getByRole('tab', { name: /Comments/ }), 'Comments', 'YouTube comments. Times people post (“25:10 important”) jump the video.'],
      [page.locator('.tray .time-chip').first(), 'Mark to fill in', 'Replays that moment so you can write one line.'],
      [page.locator('.tray .tags').first(), 'Type', 'Definition, Section, Past question or Trick: each has its own colour.'],
      [page.locator('.notes .note .time-chip').first(), 'Time', 'Tap to jump the video to that moment.'],
      [page.locator('.notes .note .star').first(), 'Important', 'Flags this note as important. Fills when on.'],
      [page.locator('.notes .note-text.editable').first(), 'Tap to edit', 'Tap the text to change it.'],
      [page.getByRole('button', { name: /Make a card/ }).first(), 'Make a card', 'Turns the note into a revision card.'],
    ],
    { full: true },
  )

  // ---------- Comments ----------
  await page.getByRole('tab', { name: /Comments/ }).click()
  await page.locator('.comment, .tab-panel .empty').first().waitFor({ timeout: 20000 })
  await trim('.comment-list .comment', 4)
  await shoot('comments', 'Comments from YouTube', 'Students often post the times of the key parts. Here those times are buttons.', [
    [page.getByRole('button', { name: /With times/ }), 'With times', 'Shows only comments that contain times, the most useful ones for revision.'],
    [page.locator('.comment').first(), 'A comment', 'Name, how long ago, the comment as YouTube shows it, and likes.'],
    [page.locator('.comment .ts').first(), 'A time', 'Tap and the video jumps there.'],
  ])

  // ---------- Notepad (split screen) ----------
  await page.getByRole('button', { name: 'Notepad' }).click()
  const doc = page.locator('.np-doc')
  await doc.click()
  await page.keyboard.type('Elements of cost')
  await page.keyboard.press('Shift+Home')
  await page.getByRole('button', { name: 'Heading' }).click()
  await page.keyboard.press('ArrowRight') // collapse the selection to its end
  await page.waitForTimeout(150) // human speed: the editor reads the new cursor a moment later
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Insert the video’s current time' }).click()
  await page.keyboard.type('Prime cost = DM + DL + DE')
  await page.keyboard.press('Shift+Home')
  await page.getByRole('button', { name: 'Highlight' }).click()
  await page.getByRole('menuitem', { name: 'Highlight Yellow' }).click()
  await page.keyboard.press('ArrowRight') // collapse the selection to its end
  await page.waitForTimeout(150) // human speed: the editor reads the new cursor a moment later
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Checklist' }).click()
  await page.keyboard.type('Revise CAS 1 tonight')
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Text colour' }).click()
  await page.getByRole('menuitem', { name: 'Text colour Red' }).click()
  await page.keyboard.type('Ask sir about abnormal loss')
  await page.locator('.np-status.saved').waitFor({ timeout: 10000 })
  await shoot(
    'notepad-laptop',
    'Notepad beside the video (laptop)',
    'One tap on Notepad splits the screen: video on the left, your page on the right. It saves by itself.',
    [
      [page.locator('.player-frame'), 'Video keeps playing', 'Watch and write at the same time.'],
      [page.getByRole('button', { name: 'Bold' }), 'Bold, italic, underline', 'The usual text styles.'],
      [page.getByRole('button', { name: 'Text colour' }), 'Text colour', 'Six colours, e.g. red for things to ask.'],
      [page.getByRole('button', { name: 'Highlight' }), 'Highlight', 'Four highlighter colours, like a marker pen.'],
      [page.getByRole('button', { name: 'Checklist' }), 'Lists', 'Heading, bullet list, numbered list, checklist.'],
      [page.getByRole('button', { name: 'Insert the video’s current time' }), 'Stamp the time', 'Adds the video’s current time; tap it later to jump back.'],
      [page.locator('.np-doc a').first(), 'A time stamp', 'Tap to jump the video to this moment.'],
      [page.locator('.np-status'), 'Saved', 'Saves a moment after you stop typing. No Save button.'],
      [page.getByRole('button', { name: 'Close notepad' }), 'Close', 'Back to the normal layout. Your page stays.'],
    ],
    { size: LAPTOP, full: false },
  )
  await shoot(
    'notepad-phone',
    'Notepad on a phone',
    'The video stays pinned at the top; the notepad fills the rest.',
    [
      [page.locator('.player-frame'), 'Pinned video', 'Stays on screen while you write.'],
      [page.locator('.np-toolbar'), 'Toolbar', 'Styles, colours, highlight, lists, time stamp, undo.'],
      [page.locator('.np-doc'), 'Your page', 'Write anything: definitions, formulas, your own summary.'],
    ],
    { full: false },
  )
  await page.getByRole('button', { name: 'Close notepad' }).click()

  // ---------- Card maker ----------
  await page.getByRole('tab', { name: /Marks/ }).click()
  await page.getByRole('button', { name: 'Make a card', exact: true }).first().click()
  const sheet = page.getByRole('dialog', { name: 'Make a card' })
  await sheet.getByRole('button', { name: 'freight', exact: true }).click()
  await shoot('card-maker', 'Making a revision card', 'A card is your note with a few words hidden. Later you try to remember them.', [
    [sheet.locator('.word').first(), 'Your words', 'Every word of your note is a button.'],
    [sheet.locator('.word.on').first(), 'Hidden word', 'Tap up to 5 words to hide. They turn into _____.'],
    [sheet.getByRole('button', { name: 'Save card' }), 'Save card', 'It shows up in Revision today, then again on the right days.'],
  ], { full: false })
  await sheet.getByRole('button', { name: 'Cancel' }).click()
  await page.locator('.star-video').click() // star this video so Library has something
  await page.locator('.star-video.on').waitFor({ timeout: 5000 }).catch(() => {})

  // ---------- Home after studying ----------
  await role('link', 'Home').click()
  await page.locator('.hero').waitFor()
  await page.locator('.feed li.video').first().waitFor({ timeout: 40000 })
  await trim('.feed .video-list li.video', 1)
  await shoot('home-today', 'Home after you have studied', 'The top card picks up where you left off.', [
    [page.locator('.hero-main'), 'Continue', 'Your last lecture and where you stopped. The bar shows how far you got.'],
    [page.locator('.hero .button'), 'Resume', 'Opens it at that minute.'],
    [page.locator('.pill-link'), 'Cards due', 'Today’s revision cards.'],
  ])

  // ---------- Revision ----------
  await page.goto(BASE + '/cards')
  await page.locator('.card-face').waitFor()
  await shoot('cards-front', 'Revision: the question', 'Your note with your chosen words hidden. Remember them, then check.', [
    [page.locator('.card-front'), 'The question', 'Say the missing words in your head.'],
    [role('button', 'Show answer'), 'Show answer', 'Shows your full note. Tapping the card works too.'],
    [page.locator('.back-btn'), 'Back', 'Every inner page has a back arrow here.'],
  ], { full: false })
  await role('button', 'Show answer').click()
  await shoot('cards-answer', 'Revision: grade yourself', 'This decides when the card comes back.', [
    [role('button', 'Forgot'), 'Forgot', 'Replays the 90 seconds around this note, and asks again at the end.'],
    [role('button', 'Not sure'), 'Not sure', 'Comes back tomorrow.'],
    [role('button', 'Knew it'), 'Knew it', 'Comes back later each time. Know it 3 times and it retires.'],
    [page.locator('.swipe-hint'), 'Swipe', 'On a phone: swipe left = Forgot, right = Knew it.'],
  ], { full: false })
  await role('button', 'Knew it').click()

  // ---------- Library ----------
  await role('link', 'Library').click()
  await page.locator('.row-item').first().waitFor({ timeout: 15000 }).catch(() => {})
  await shoot('library-starred', 'Library: Starred', 'Videos you starred.', [
    [page.getByRole('tab', { name: /Starred/ }), 'Starred', 'Everything you saved with ☆.'],
    [page.getByRole('tab', { name: /History/ }), 'History', 'What you watched and where you stopped.'],
    [page.locator('.row-item').first(), 'A video', 'Tap to open. × removes it.'],
  ], { full: false })
  await page.getByRole('tab', { name: /History/ }).click()
  await page.locator('.row-item').first().waitFor({ timeout: 15000 })
  await shoot('library-history', 'Library: History', 'Grouped by day, newest first.', [
    [page.locator('.day-label').first(), 'Day', 'Today, Yesterday, then dates.'],
    [page.locator('.row-item .watched').first(), 'How far you got', 'The bar under the picture.'],
    [page.locator('.row-item .channel').first(), 'Resume', 'The minute you stopped at.'],
    [role('button', 'Clear all'), 'Clear all', 'Empties History. × on a row removes one.'],
  ], { full: false })

  // ---------- My notes ----------
  await role('link', 'My notes').click()
  await page.locator('.lecture-block').first().waitFor()
  await shoot('notes-by-video', 'My notes: by video', 'Everything you wrote, grouped under each lecture.', [
    [page.getByLabel('Export my notes'), 'Export', 'Downloads all your notes with links back to the exact minute.'],
    [page.getByRole('link', { name: 'Settings' }), 'Settings', 'Theme, Shorts, hidden channels, account.'],
    [page.getByLabel('Search your notes'), 'Search', 'Results update as you type.'],
    [page.locator('.notes-bar .chips'), 'Filters', 'All, only Doubts, or only Important.'],
    [page.locator('.view-switch'), 'By video / All notes', 'With the lecture pictures, or just the notes. Remembered.'],
    [page.locator('.fill-row'), 'Marks to fill in', 'Marks you haven’t written about yet.'],
    [page.locator('.notepad-card').first(), 'Notepad page', 'Your notepad for that lecture; times inside it open the video.'],
  ])
  await page.locator('.view-switch').getByRole('button', { name: /All notes/ }).click()
  await shoot('notes-all', 'My notes: all notes', 'Just the notes, newest first, like a revision sheet.', [
    [page.locator('.notes .note').first(), 'A note', 'Its type, which lecture it came from, and the time (tap to open).'],
    [page.locator('.notes .note .source').first(), 'Source', 'The lecture this note belongs to.'],
  ], { full: false })
  await page.locator('.view-switch').getByRole('button', { name: /By video/ }).click()

  // ---------- Settings ----------
  await page.getByRole('link', { name: 'Settings' }).click()
  await page.getByRole('heading', { name: 'Appearance' }).waitFor()
  await shoot('settings', 'Settings', 'Your switches.', [
    [page.getByRole('group', { name: 'Theme' }), 'Appearance', 'Same as your phone (default), Light, or Night.'],
    [page.locator('.settings-section .chips').first(), 'What’s hidden', 'The kinds of videos hidden, using YouTube’s own labels.'],
    [page.getByRole('switch'), 'Show Shorts', 'Off by default.'],
    [page.getByText('Channels you hid'), 'Hidden channels', '“Unhide all” brings them back.'],
    [role('button', 'Delete my data'), 'Delete my data', 'Deletes your account and everything in it.'],
  ])
  await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Night' }).click()
  await role('link', 'My notes').click()
  await page.locator('.lecture-block').first().waitFor()
  await shoot('night', 'Night theme', 'For studying late: soft navy, never pure black (Settings → Appearance).', [
    [page.locator('.lecture-block').first(), 'Easy on the eyes at night', 'Soft colours that don’t glare in a dark room.'],
  ], { full: false })
  await page.getByRole('link', { name: 'Settings' }).click()
  await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Same as phone' }).click()

  // ---------- Clean up ----------
  await role('button', 'Delete my data').click()
  await role('button', 'Yes, delete everything').click()
  await page.waitForURL('**/welcome')
  deleted = true
  const farewell = await page.getByRole('status').first().innerText().catch(() => '(no message)')
  log('test account deleted; welcome says:', farewell.slice(0, 60))
} catch (e) {
  console.log('FAILED:', e.message)
  await page.screenshot({ path: out('failure.png') }).catch(() => {})
  process.exitCode = 1
} finally {
  // Never leave a test account behind, even when a step failed.
  if (signedUp && !deleted) {
    await api('/api/me', undefined, 'DELETE')
      .then(() => log('test account deleted after the failure'))
      .catch((e) => console.log('COULD NOT DELETE TEST ACCOUNT:', e.message))
  }
  await browser.close()
}

fs.writeFileSync(out('screens.json'), JSON.stringify(screens))
console.log(errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors', `· ${screens.length} screens`)
