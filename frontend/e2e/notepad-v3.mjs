// My notes like a small Google Doc: coloured underline, a pasted screenshot, full screen. Phone, light + night.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Throwaway account, always deleted.
// Run: node e2e/notepad-v3.mjs   → e2e/screenshots/v3pad-*.png
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const VIDEO = 'aircAruvnKk'
const dir = new URL('./screenshots/', import.meta.url)
fs.mkdirSync(dir, { recursive: true })
const file = (name) => new URL(`v3pad-${name}.png`, dir).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
let signedUp = false
let deleted = false
const shot = async (name) => {
  await page.waitForTimeout(700)
  await page.screenshot({ path: file(name) })
  console.log('✔', name)
}

try {
  await page.goto(BASE + '/welcome')
  await page.getByRole('link', { name: /Start free/ }).first().click()
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  await page.getByLabel('Email').fill(`pad-${Date.now()}@example.com`)
  await page.getByLabel(/Password/).fill('pad test password 1')
  signedUp = true
  await page.getByRole('button', { name: 'Create account' }).click()
  await page.getByLabel('Your learning goal').waitFor({ timeout: 90_000 })
  await page.evaluate(() => {
    localStorage.setItem('focuslearn.guideSeen', '1')
    localStorage.setItem('focuslearn.studyHintSeen', '1')
  })

  await page.goto(BASE + '/watch/' + VIDEO)
  await page.getByRole('tab', { name: /My notes/ }).click()
  const doc = page.locator('.np-doc')
  await doc.waitFor()
  await doc.click()
  await page.keyboard.type('Neurons hold numbers called activations')
  await page.keyboard.press('Shift+Home')
  await page.getByRole('button', { name: 'Coloured underline' }).click()
  await page.getByRole('menuitem', { name: 'Red underline', exact: true }).click()
  await page.keyboard.press('End')
  await page.waitForTimeout(150)
  await page.keyboard.press('Enter')
  const underline = await page.locator('.np-doc span[data-underline]').count()
  console.log('coloured underline spans:', underline)

  // Paste a real PNG through the browser's own paste event, like a phone or laptop screenshot.
  await doc.evaluate(async (el) => {
    const c = document.createElement('canvas')
    c.width = 640
    c.height = 360
    const g = c.getContext('2d')
    g.fillStyle = '#0b766c'
    g.fillRect(0, 0, 640, 360)
    g.fillStyle = '#ffffff'
    g.font = 'bold 44px sans-serif'
    g.fillText('A pasted screenshot', 90, 195)
    const blob = await new Promise((r) => c.toBlob(r, 'image/png'))
    const dt = new DataTransfer()
    dt.items.add(new File([blob], 'shot.png', { type: 'image/png' }))
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }))
  })
  const img = page.locator('.np-doc img.np-img')
  await img.waitFor({ timeout: 30_000 })
  const src = await img.getAttribute('src')
  const loaded = await img.evaluate((i) => new Promise((r) => (i.complete ? r(i.naturalWidth) : (i.onload = () => r(i.naturalWidth)))))
  console.log('pasted image src ok:', src.startsWith('/api/notepad/images/'), '| shown width:', loaded)
  await page.getByText('Saved').waitFor({ timeout: 15_000 })
  await shot('phone-mynotes')

  const saved = async () =>
    page.evaluate(async (vid) => {
      const r = await fetch('/api/study/open', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` }, body: JSON.stringify({ video_id: vid }) })
      const c = (await r.json()).notepad?.content ?? ''
      return { hasImage: c.includes('"image"'), hasUnderline: c.includes('colourUnderline'), length: c.length }
    }, VIDEO)
  await page.waitForTimeout(1500)
  console.log('saved on the server:', JSON.stringify(await saved()))
  await page.getByRole('button', { name: 'Full screen' }).click()
  await shot('phone-full')
  await page.keyboard.press('Escape')
  await page.evaluate(() => localStorage.setItem('focuslearn.theme', 'dark'))
  await page.reload()
  await page.getByRole('tab', { name: /My notes/ }).click()
  await page.locator('.np-doc img.np-img').waitFor()
  await page.getByRole('button', { name: 'Full screen' }).click()
  await shot('phone-night-full')

  await page.goto(BASE + '/settings')
  await page.getByRole('button', { name: 'Delete my data' }).click()
  await page.getByRole('button', { name: 'Yes, delete everything' }).click()
  await page.waitForURL('**/welcome')
  deleted = true
  console.log('✔ test account deleted')
} catch (e) {
  console.log('FAILED:', e.message)
  await page.screenshot({ path: file('failure') }).catch(() => {})
  process.exitCode = 1
} finally {
  if (signedUp && !deleted) {
    await page
      .evaluate(() => fetch('/api/me', { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` } }))
      .then(() => console.log('✔ test account deleted after the failure'))
      .catch((e) => console.log('COULD NOT DELETE TEST ACCOUNT:', e.message))
  }
  await browser.close()
  console.log(errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors')
}
