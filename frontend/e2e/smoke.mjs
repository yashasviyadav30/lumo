// End-to-end smoke test in real Microsoft Edge: sign up → goal → topic → search → hidden line → watch → delete account.
// Needs the backend on :8000 (with backend/.env) and `npm run dev` on :5173. Uses 1 search call at most. Run: npm run e2e
import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'
const shots = new URL('./screenshots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
await import('node:fs').then((fs) => fs.mkdirSync(shots, { recursive: true }))
const email = `e2e-${Date.now()}@example.com`
const log = (...a) => console.log('✔', ...a)

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 }) // phone-sized
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

try {
  await page.goto(BASE + '/')
  await page.waitForURL('**/welcome')
  log('signed-out visitor lands on /welcome')
  await page.screenshot({ path: shots + '1-welcome.png' })

  await page.getByRole('link', { name: 'Get started' }).click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel(/Password/).fill('e2e test password 1')
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  await page.screenshot({ path: shots + '2-signup.png', fullPage: true })
  await page.getByRole('button', { name: 'Create account' }).click()
  await page.getByLabel('Your learning goal').waitFor()
  log('signed up and reached the goal screen')

  await page.getByLabel('Your learning goal').fill('CMA Inter costing')
  await page.getByRole('button', { name: 'Set goal' }).click()
  await page.getByText('Your goal:').waitFor()
  log('goal understood as:', await page.locator('.goal-line strong').innerText())
  await page.screenshot({ path: shots + '3-goal.png', fullPage: true })

  await page.getByRole('button', { name: /^Search: / }).click()
  await page.waitForURL('**/search')
  await page.locator('.video-list li').first().waitFor({ timeout: 20000 })
  const shown = await page.locator('.video-list li').count()
  const hiddenLine = (await page.locator('.hidden-line').count()) ? await page.locator('.hidden-line p').innerText() : '(nothing hidden)'
  log(`search shows ${shown} videos; hidden line: ${hiddenLine.replace(/\s+/g, ' ')}`)
  if (page.url().includes('?')) throw new Error('query leaked into the URL')
  await page.waitForFunction(() => [...document.querySelectorAll('.video-list img')].slice(0, 3).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 })
  log('first thumbnails loaded (YouTube images, unaltered)')
  await page.screenshot({ path: shots + '4-search.png', fullPage: false })

  if (await page.getByRole('button', { name: 'Why' }).count()) {
    await page.getByRole('button', { name: 'Why' }).click()
    log('Why:', (await page.locator('.why').innerText()).split('\n')[0])
  }

  await page.locator('.video-list li a.video-link').first().click()
  await page.waitForURL('**/watch/*')
  const iframe = page.locator('.player-frame iframe')
  await iframe.waitFor({ timeout: 20000 })
  const src = await iframe.getAttribute('src')
  log('player iframe host:', new URL(src).host, '| autoplay=' + new URL(src).searchParams.get('autoplay'), '| controls=' + new URL(src).searchParams.get('controls'))
  await page.waitForTimeout(4000)
  const playerError = await page.locator('.player-error').count()
  log('player error shown:', playerError ? await page.locator('.player-error').innerText() : 'none')
  await page.screenshot({ path: shots + '5-watch.png' })

  await page.getByRole('link', { name: 'Settings' }).click()
  await page.getByRole('button', { name: 'Delete my data' }).click()
  await page.getByRole('button', { name: 'Yes, delete everything' }).click()
  await page.waitForURL('**/welcome')
  log('account deleted; back on /welcome')

  console.log(errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors')
} catch (e) {
  await page.screenshot({ path: shots + 'failure.png', fullPage: true })
  console.log('FAILED:', e.message, errors.length ? '| page errors: ' + errors.join(' | ') : '')
  process.exitCode = 1
} finally {
  await browser.close()
}
