// Screenshots of the v3 study page (Notes, Mind map, My notes) in light and dark, phone and laptop.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Throwaway account, always deleted.
// Run: node e2e/study-v3.mjs [videoId]   → e2e/screenshots/v3-*.png
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const VIDEO = process.argv[2] ?? 'aircAruvnKk'
const NOTES_WAIT_MS = 4 * 60_000
const dir = new URL('./screenshots/', import.meta.url)
fs.mkdirSync(dir, { recursive: true })
const file = (name) => new URL(`v3-${name}.png`, dir).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const PHONE = { width: 412, height: 915 }
const LAPTOP = { width: 1366, height: 860 }
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
let signedUp = false
let deleted = false
const shot = async (name, opts = {}) => {
  await page.waitForTimeout(700)
  await page.screenshot({ path: file(name), ...opts })
  console.log('✔', name)
}
const tab = (name) => page.getByRole('tab', { name })
const setTheme = async (t) => {
  await page.evaluate((v) => localStorage.setItem('focuslearn.theme', v), t)
  await page.reload()
  await page.locator('.player-frame').waitFor()
}

try {
  await page.goto(BASE + '/welcome')
  await page.getByRole('link', { name: /Start free/ }).first().click()
  await page.getByLabel('Email').fill(`v3-${Date.now()}@example.com`)
  await page.getByLabel(/Password/).fill('v3 test password 1')
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  signedUp = true
  await page.getByRole('button', { name: 'Create account' }).click()
  await page.getByLabel('Your learning goal').waitFor({ timeout: 90_000 })

  await page.evaluate(() => {
    localStorage.setItem('focuslearn.guideSeen', '1')
    localStorage.setItem('focuslearn.studyHintSeen', '1')
  })
  await page.goto(BASE + '/watch/' + VIDEO)
  await page.locator('.ai-notes').waitFor()
  await page.locator('.ai-skeleton').waitFor({ state: 'detached' })
  await shot('phone-light-start', { fullPage: true })

  const generate = page.getByRole('button', { name: /Generate summary/ })
  if (await generate.count()) await generate.click()
  await page.waitForTimeout(1500)
  await shot('phone-light-making', { fullPage: true })
  await page.locator('.sum-short').waitFor({ timeout: NOTES_WAIT_MS })

  await page.getByRole('button', { name: 'Brief summary' }).click()
  await page.locator('.ai-points summary').first().click()
  await shot('phone-light-notes', { fullPage: true })
  await page.getByRole('button', { name: /Copy to my notes/ }).first().click()

  await tab(/Mind map/).click()
  await page.locator('.mm-node').first().waitFor()
  await page.locator('.mm-node.d1').first().click()
  await shot('phone-light-map', { fullPage: true })
  await shot('phone-light-map-screen') // what the phone really shows (full-page shots move sticky bars)
  await page.getByRole('button', { name: 'Close' }).click() // the idea's card closes before full screen
  await page.getByRole('button', { name: 'Open full screen' }).click()
  await page.locator('.mm-node.d2').first().click()
  await shot('phone-light-map-full')
  await page.keyboard.press('Escape') // closes the card
  await page.keyboard.press('Escape') // then full screen

  await tab(/My notes/).click()
  await page.locator('.np-doc').waitFor()
  await shot('phone-light-mynotes', { fullPage: true })
  await page.evaluate(() => window.scrollTo(0, 900))
  await shot('phone-light-scrolled') // the player must still be on screen (pinned)

  await setTheme('dark')
  await tab(/Mind map/).click()
  await page.locator('.mm-node').first().waitFor()
  await shot('phone-dark-map', { fullPage: true })
  await page.setViewportSize(LAPTOP)
  await tab(/^Summary/).click()
  await page.locator('.sum-short').waitFor()
  await shot('laptop-dark-notes')
  await setTheme('light')
  await tab(/Mind map/).click()
  await page.locator('.mm-node').first().waitFor()
  await shot('laptop-light-map')
  await setTheme('system')

  await page.goto(BASE + '/settings')
  await page.getByRole('button', { name: 'Delete my data' }).click()
  await page.getByRole('button', { name: 'Yes, delete everything' }).click()
  await page.waitForURL('**/welcome')
  deleted = true
  console.log('✔ test account deleted')
} catch (e) {
  console.log('FAILED:', e.message)
  await page.screenshot({ path: file('failure'), fullPage: true }).catch(() => {})
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
