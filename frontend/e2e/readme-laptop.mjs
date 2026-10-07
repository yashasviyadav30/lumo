// The README's laptop screenshots: Home, a video's summary and notes, the mind map (night), a study group.
// Throwaway account, always deleted. Run: E2E_BASE=<live url> node e2e/readme-laptop.mjs → e2e/screenshots/laptop-*.png
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const MAP_VIDEO = 'aircAruvnKk' // 3Blue1Brown's neural network lecture: the richest mind map
const FOLLOW = {
  UCsXVk37bltHxD1rDPwtNM8Q: 'Kurzgesagt',
  'UCHnyfMqiRRG1u-2MsSQLbXA': 'Veritasium',
  UCsooa4yRKGN_zEE8iknghZA: 'TED-Ed',
  UCYO_jab_esuFRV4b17AJtAw: '3Blue1Brown',
  'UC6nSFpj9HTCZ5t-N3Rm3-HA': 'Vsauce',
  UCUHW94eEFW7hkUMVaZz4eDg: 'MinutePhysics',
  'UCZYTClx2T1of7BRZ86-8fow': 'SciShow',
}
const out = (name) => `e2e/screenshots/laptop-${name}.png`

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' })
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
const thumbsDrawn = () =>
  page.waitForFunction(
    () => {
      const imgs = [...document.querySelectorAll('.vgrid li.vcard img')].slice(0, 6)
      return imgs.length >= 6 && imgs.every((i) => i.complete && i.naturalWidth > 0)
    },
    null,
    { timeout: 90_000 },
  )
let token = null

try {
  await page.goto(BASE + '/welcome')
  token = await page.evaluate(async () => {
    const r = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `laptop-${Date.now()}@example.com`, password: 'laptop shots password 1', date_of_birth: '1998-04-12', accepted_notice: true }),
    })
    return (await r.json()).token
  })
  await page.evaluate((t) => {
    localStorage.setItem('focuslearn.token', t)
    localStorage.setItem('focuslearn.guideSeen', '1')
    localStorage.setItem('focuslearn.studyHintSeen', '1')
  }, token)
  for (const channel_id of Object.keys(FOLLOW)) await api('/api/follows', { channel_id })
  await api('/api/goals', { text: 'science and how the world works' })

  // Home
  await page.goto(BASE + '/')
  await page.getByText('Learning:').waitFor({ timeout: 90_000 })
  await thumbsDrawn()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: out('home') })

  // A video's summary with its notes open, from one of those channels (8 to 25 minutes)
  const feed = await api('/api/feed', { recent: [] })
  const names = new Set(Object.values(FOLLOW).filter((n) => n !== '3Blue1Brown'))
  const pick = feed.results.find((v) => names.has(v.channel_title) && v.duration_s >= 480 && v.duration_s <= 1500)?.video_id ?? MAP_VIDEO
  console.log('summary video:', pick)
  await page.goto(BASE + '/watch/' + pick)
  await page.locator('.sum-short, .ai-notes button').first().waitFor({ timeout: 60_000 })
  const generate = page.getByRole('button', { name: /Generate summary/ })
  if (await generate.count()) await generate.click()
  await page.locator('.sum-short').waitFor({ timeout: 5 * 60_000 })
  // a long video may show its first minutes early: wait for the complete notes
  await page.waitForFunction(() => !document.querySelector('.partial-banner'), null, { timeout: 5 * 60_000 })
  await page.getByRole('button', { name: 'Brief summary' }).click()
  await page.waitForTimeout(5000) // the YouTube player draws its poster
  await page.screenshot({ path: out('summary') })

  // A study group with the video and an answered doubt
  const g = await api('/api/groups', { name: 'Science study circle', my_name: 'Maya' })
  const doubt = await api('/api/groups/post', { group_id: g.id, kind: 'doubt', video_id: MAP_VIDEO, t_seconds: 173, text: 'Why does each neuron hold a number between 0 and 1?' })
  await api('/api/groups/reply', { post_id: doubt.id, text: 'That is its activation. Sigmoid squeezes any sum into 0 to 1 (see 13:10).' })
  await api('/api/groups/post/answered', { post_id: doubt.id, answered: true })
  await api('/api/groups/post', { group_id: g.id, kind: 'video', video_id: pick, attach: 'notes', text: 'Watch this before Sunday. The summary is a great start.' })
  await page.goto(BASE + '/groups/' + g.id)
  await page.getByRole('list', { name: 'Posts' }).waitFor()
  await page.waitForTimeout(2500)
  await page.screenshot({ path: out('group') })

  // The mind map, full screen at night, with an idea's card
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto(BASE + '/watch/' + MAP_VIDEO)
  await page.getByRole('tab', { name: /Mind map/ }).click()
  await page.locator('.mm-node').first().waitFor({ timeout: 60_000 })
  await page.getByRole('button', { name: 'Open full screen' }).click()
  await page.waitForTimeout(1200)
  await page.locator('.mm-node.d1').nth(1).click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: out('map') })
  console.log('✔ laptop shots')
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
