// The README's demo: a 20-second tour of the live app on a phone, recorded as video, then made a GIF with ffmpeg.
// Run: E2E_BASE=<live url> node e2e/readme-demo.mjs → docs/brand/demo.gif (throwaway account, always deleted)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const VIDEO = 'aircAruvnKk'
const SIZE = { width: 412, height: 915 }
const dir = 'e2e/screenshots/demo'
fs.rmSync(dir, { recursive: true, force: true })

const browser = await chromium.launch({ channel: 'msedge' })
// Sign up first, outside the recording, so the video starts on a ready Home.
const setup = await browser.newPage()
await setup.goto(BASE + '/welcome')
const token = await setup.evaluate(async () => {
  const r = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `demo-${Date.now()}@example.com`, password: 'demo tour password 1', date_of_birth: '1998-04-12', accepted_notice: true }),
  })
  return (await r.json()).token
})
await setup.evaluate(
  (t) =>
    fetch('/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }, body: JSON.stringify({ text: 'machine learning for beginners' }) }),
  token,
)
await setup.close()

const context = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 2, recordVideo: { dir, size: SIZE } })
await context.addInitScript((t) => {
  localStorage.setItem('focuslearn.token', t)
  localStorage.setItem('focuslearn.guideSeen', '1')
  localStorage.setItem('focuslearn.studyHintSeen', '1')
}, token)
const page = await context.newPage()
const pause = (ms) => page.waitForTimeout(ms)
const started = Date.now()
let tourStart = 0
try {
  await page.goto(BASE + '/')
  await page.locator('.vgrid li.vcard img').first().waitFor({ timeout: 90_000 })
  await pause(2500)
  tourStart = (Date.now() - started) / 1000 - 0.5
  await page.mouse.wheel(0, 500)
  await pause(1600)
  await page.goto(BASE + '/watch/' + VIDEO)
  await page.locator('.sum-short').waitFor({ timeout: 60_000 })
  await pause(2200)
  await page.locator('.study-tabs').evaluate((el) => window.scrollBy({ top: el.getBoundingClientRect().top - 420, behavior: 'smooth' }))
  await pause(1800)
  await page.getByRole('button', { name: 'Brief summary' }).click()
  await pause(600)
  await page.mouse.wheel(0, 650)
  await pause(2400)
  await page.getByRole('tab', { name: /Mind map/ }).click()
  await page.locator('.mm-node').first().waitFor()
  await pause(1800)
  await page.getByRole('button', { name: 'Open full screen' }).click()
  await pause(1500)
  await page.locator('.mm-node.d1').nth(1).click()
  await pause(3200)
} finally {
  await page.close()
  await context.close() // writes the video
  const p = await browser.newPage()
  await p.goto(BASE + '/welcome')
  await p.evaluate((t) => fetch('/api/me', { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } }), token)
  await browser.close()
  console.log('test account deleted')
}

const video = fs.readdirSync(dir).find((f) => f.endsWith('.webm'))
const src = `${dir}/${video}`
// A palette made from the video itself, no dithering, and only changed areas redrawn: sharp and under 3 MB.
const filters = 'fps=10,scale=320:-1:flags=lanczos'
execFileSync('ffmpeg', ['-y', '-ss', String(tourStart), '-i', src, '-vf', `${filters},palettegen=max_colors=128:stats_mode=diff`, `${dir}/palette.png`], { stdio: 'ignore' })
execFileSync(
  'ffmpeg',
  ['-y', '-ss', String(tourStart), '-i', src, '-i', `${dir}/palette.png`, '-lavfi', `${filters} [x]; [x][1:v] paletteuse=dither=none:diff_mode=rectangle`, '../docs/brand/demo.gif'],
  { stdio: 'ignore' },
)
console.log('demo.gif', Math.round(fs.statSync('../docs/brand/demo.gif').size / 1024), 'KB')
