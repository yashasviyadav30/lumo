// The README's screenshots: Home, Summary, Mind map, a group (phone) and the study page (laptop, night).
// Uses a throwaway account, always deleted. Run: E2E_BASE=<live url> node e2e/readme-shots.mjs
// → e2e/screenshots/readme-*.png (then shrink them into docs/screenshots/ as WebP).
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const VIDEO = 'aircAruvnKk' // 3Blue1Brown's neural network lecture: the richest mind map
// Well-known learning channels with strong thumbnails; Home shows their newest videos first.
const FOLLOW = {
  UCsXVk37bltHxD1rDPwtNM8Q: 'Kurzgesagt',
  'UCHnyfMqiRRG1u-2MsSQLbXA': 'Veritasium',
  UCsooa4yRKGN_zEE8iknghZA: 'TED-Ed',
  UCYO_jab_esuFRV4b17AJtAw: '3Blue1Brown',
  'UC6nSFpj9HTCZ5t-N3Rm3-HA': 'Vsauce',
  UCUHW94eEFW7hkUMVaZz4eDg: 'MinutePhysics',
  'UCZYTClx2T1of7BRZ86-8fow': 'SciShow',
}
const PHONE = { width: 412, height: 915 }
const LAPTOP = { width: 1440, height: 900 }
const out = (name) => `e2e/screenshots/readme-${name}.png`

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 2, colorScheme: 'light' })
const api = (path, body) =>
  page.evaluate(
    ([path, body]) =>
      fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` },
        body: JSON.stringify(body),
      }).then((r) => (r.status === 204 ? null : r.json())),
    [path, body],
  )
// On phones the player and the Mark row stay pinned: scroll so `selector` starts just under them.
const showUnderPlayer = async (selector) => {
  for (let i = 0; i < 2; i++)
    await page.evaluate((sel) => {
      const pinned = document.querySelector('.study .capture')?.getBoundingClientRect().bottom ?? 0
      const top = document.querySelector(sel).getBoundingClientRect().top
      window.scrollBy(0, top - pinned - 10)
    }, selector)
  await page.waitForTimeout(600)
}
let token = null

try {
  await page.goto(BASE + '/welcome')
  token = await page.evaluate(async () => {
    const r = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `readme-${Date.now()}@example.com`, password: 'readme shots password 1', date_of_birth: '1998-04-12', accepted_notice: true }),
    })
    return (await r.json()).token
  })
  await page.evaluate((t) => {
    localStorage.setItem('focuslearn.token', t)
    localStorage.setItem('focuslearn.guideSeen', '1')
    localStorage.setItem('focuslearn.studyHintSeen', '1')
  }, token)

  for (const channel_id of Object.keys(FOLLOW)) await api('/api/follows', { channel_id })

  // Home with a goal
  await page.goto(BASE + '/')
  await page.getByLabel('Your learning goal').fill('science and how the world works')
  await page.getByRole('button', { name: 'Start' }).click()
  await page.getByText('Learning:').waitFor({ timeout: 90_000 }) // the goal's own feed, not the one before it
  // the feed is in and the first thumbnails have drawn
  await page.waitForFunction(
    () => {
      const imgs = [...document.querySelectorAll('.vgrid li.vcard img')].slice(0, 2)
      return imgs.length === 2 && imgs.every((i) => i.complete && i.naturalWidth > 0) && !document.querySelector('.vgrid [aria-busy="true"], .vgrid .skeleton')
    },
    null,
    { timeout: 90_000 },
  )
  await page.waitForTimeout(1500)
  await page.screenshot({ path: out('home') })

  // The summary, notes and key terms come from one of those channels' videos (8 to 25 minutes), for variety.
  const feed = await api('/api/feed', { recent: [] })
  const names = new Set(Object.values(FOLLOW).filter((n) => n !== '3Blue1Brown'))
  const PICK = feed.results.find((v) => names.has(v.channel_title) && v.duration_s >= 480 && v.duration_s <= 1500)?.video_id ?? VIDEO
  console.log('summary video:', PICK)

  // Study page: summary, notes and key terms on PICK
  await page.goto(BASE + '/watch/' + PICK)
  const generate = page.getByRole('button', { name: /Generate summary/ })
  await page.locator('.sum-short, .ai-notes button').first().waitFor({ timeout: 60_000 })
  if (await generate.count()) await generate.click()
  await page.locator('.sum-short').waitFor({ timeout: 4 * 60_000 })
  await page.waitForTimeout(5000) // the YouTube player draws its poster
  await showUnderPlayer('.study-tabs')
  await page.screenshot({ path: out('summary') })
  // the brief summary as study notes, and the key terms
  await page.getByRole('button', { name: 'Brief summary' }).click()
  await page.waitForTimeout(500)
  await showUnderPlayer('.sum-brief')
  await page.screenshot({ path: out('brief') })
  await showUnderPlayer('.key-terms')
  await page.screenshot({ path: out('terms') })
  // the share panel, on the same video
  await page.getByRole('button', { name: 'Share', exact: true }).first().click()
  await page.locator('.share-links').waitFor()
  await page.waitForTimeout(800)
  await showUnderPlayer('.share-inline')
  await page.screenshot({ path: out('share') })

  // The mind map on the 3Blue1Brown lecture
  await page.goto(BASE + '/watch/' + VIDEO)
  await page.locator('.sum-short, .ai-notes button').first().waitFor({ timeout: 60_000 })
  await page.getByRole('tab', { name: /Mind map/ }).click()
  await page.locator('.mm-node').first().waitFor()
  await showUnderPlayer('.study-tabs')
  await page.waitForTimeout(800)
  await page.screenshot({ path: out('mind-map') })
  // an idea's card under the map
  await page.locator('.mm-node.d1').first().click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: out('idea-card') })
  await page.getByRole('button', { name: 'Close' }).click()
  // the map full screen, then with an idea's card
  await page.getByRole('button', { name: 'Open full screen' }).click()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: out('map-full') })
  await page.locator('.mm-node.d1').nth(1).click()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: out('map-full-card') })
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // A group with a shared video and an answered doubt
  const g = await api('/api/groups', { name: 'Science study circle', my_name: 'Maya' })
  await api('/api/groups/post', { group_id: g.id, kind: 'video', video_id: PICK, attach: 'notes', text: 'Watch this before Sunday. The summary is a great start.' })
  const doubt = await api('/api/groups/post', { group_id: g.id, kind: 'doubt', video_id: VIDEO, t_seconds: 173, text: 'Why does each neuron hold a number between 0 and 1?' })
  await api('/api/groups/reply', { post_id: doubt.id, text: 'That is the activation. Sigmoid squeezes any sum into 0 to 1 (see 13:10).' })
  await api('/api/groups/post/answered', { post_id: doubt.id, answered: true })
  await page.goto(BASE + '/groups/' + g.id)
  await page.getByRole('list', { name: 'Posts' }).waitFor()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: out('group') })

  // Laptop, night: the study page
  await page.setViewportSize(LAPTOP)
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto(BASE + '/watch/' + PICK)
  await page.locator('.sum-short').waitFor({ timeout: 60_000 })
  await page.waitForTimeout(4000)
  await page.screenshot({ path: out('laptop') })
  console.log('✔ readme shots')
} catch (e) {
  console.log('FAILED:', e.message)
  await page.screenshot({ path: out('failure') }).catch(() => {})
  process.exitCode = 1
} finally {
  if (token) {
    await page.evaluate((t) => fetch('/api/me', { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } }), token).catch(() => {})
    console.log('✔ test account deleted')
  }
  await browser.close()
}
