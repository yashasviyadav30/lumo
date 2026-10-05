// Renders public/favicon.svg into the PWA icon PNGs. Run after changing the logo: node e2e/make-icons.mjs
import fs from 'node:fs'
import { chromium } from 'playwright'
const svg = fs.readFileSync('public/favicon.svg', 'utf8')
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage()
async function render(size, html, out) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`)
  await page.screenshot({ path: out, omitBackground: true })
  console.log('wrote', out)
}
const full = (s) => svg.replace('<svg ', `<svg width="${s}" height="${s}" `)
await render(192, full(192), 'public/icon-192.png')
await render(512, full(512), 'public/icon-512.png')
// Maskable: full-bleed night background, the orb inside the 80% safe zone (Android crops to a circle or squircle).
const orbOnly = svg.replace(/<rect[^>]*\/>/, '<rect width="64" height="64" fill="#160f20"/>').replace('<svg ', '<svg width="512" height="512" ')
await render(512, orbOnly, 'public/icon-maskable-512.png')
await browser.close()
