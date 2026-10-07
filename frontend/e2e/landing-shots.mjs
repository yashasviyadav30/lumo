// Screenshots of the public landing page: phone and laptop, light and night. No account needed.
// Run: node e2e/landing-shots.mjs   → e2e/screenshots/lp-*.png
import fs from 'node:fs'
import { chromium } from 'playwright'
const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const dir = new URL('./screenshots/', import.meta.url)
fs.mkdirSync(dir, { recursive: true })
const file = (n) => new URL(`lp-${n}.png`, dir).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const browser = await chromium.launch({ channel: 'msedge', headless: true })
for (const [name, viewport] of [['phone', { width: 412, height: 915 }], ['laptop', { width: 1440, height: 900 }]]) {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: name === 'phone' ? 2 : 1, colorScheme: theme })
    await page.goto(BASE + '/welcome')
    await page.locator('.lp-hero').waitFor()
    await page.waitForTimeout(1600)
    await page.screenshot({ path: file(`${name}-${theme}`) })
    await page.screenshot({ path: file(`${name}-${theme}-full`), fullPage: true })
    console.log('✔', name, theme)
    await page.close()
  }
}
await browser.close()
