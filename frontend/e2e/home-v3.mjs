// Screenshots of the v3 Home, Search, Shorts and Settings (phone + laptop, light + night), with the first-time guide.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Throwaway account, always deleted.
// Run: node e2e/home-v3.mjs   → e2e/screenshots/v3home-*.png
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const dir = new URL('./screenshots/', import.meta.url)
fs.mkdirSync(dir, { recursive: true })
const file = (name) => new URL(`v3home-${name}.png`, dir).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const PHONE = { width: 412, height: 915 }
const LAPTOP = { width: 1366, height: 860 }
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
let signedUp = false
let deleted = false
const shot = async (name) => {
  await page.waitForTimeout(800)
  await page.screenshot({ path: file(name) })
  console.log('✔', name)
}
const setTheme = async (t) => {
  await page.evaluate((v) => localStorage.setItem('focuslearn.theme', v), t)
  await page.reload()
}

try {
  await page.goto(BASE + '/welcome')
  await shot('phone-welcome')
  await page.getByRole('link', { name: /Start free/ }).first().click()
  await page.getByLabel('Email').fill(`v3home-${Date.now()}@example.com`)
  await page.getByLabel(/Password/).fill('v3 test password 1')
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  signedUp = true
  await page.getByRole('button', { name: 'Create account' }).click()

  await page.getByRole('dialog').waitFor({ timeout: 90_000 })
  await shot('phone-guide-1')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await shot('phone-guide-3')
  await page.getByRole('button', { name: /Start using/ }).click()
  await shot('phone-home-new')

  await page.getByLabel('Your learning goal').fill('class 10 physics light')
  await page.getByRole('button', { name: 'Start' }).click()
  await page.locator('.vgrid li.vcard').first().waitFor({ timeout: 60_000 })
  await shot('phone-home-feed')
  const first = page.locator('.vgrid li.vcard').first()
  await first.getByRole('button', { name: 'More actions' }).click()
  await shot('phone-home-menu')
  await page.keyboard.press('Escape')

  await page.getByRole('link', { name: 'Search' }).first().click()
  await page.getByRole('searchbox').fill('how to focus while studying')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await page.locator('.vgrid li.vcard').first().waitFor({ timeout: 60_000 })
  await shot('phone-search')

  await page.getByRole('link', { name: 'Shorts' }).click()
  await page.locator('.feed-empty, .vgrid li.vcard').first().waitFor({ timeout: 60_000 })
  await shot('phone-shorts-empty')

  await page.goto(BASE + '/settings')
  await page.getByRole('heading', { name: 'What’s hidden' }).waitFor()
  await shot('phone-settings')

  await setTheme('dark')
  await page.goto(BASE + '/')
  await page.locator('.vgrid li.vcard').first().waitFor({ timeout: 60_000 })
  await shot('phone-night-home')

  await page.setViewportSize(LAPTOP)
  await page.goto(BASE + '/')
  await page.locator('.vgrid li.vcard').first().waitFor({ timeout: 60_000 })
  await shot('laptop-night-home')
  await setTheme('light')
  await page.locator('.vgrid li.vcard').first().waitFor({ timeout: 60_000 })
  await shot('laptop-light-home')
  await setTheme('system')

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
