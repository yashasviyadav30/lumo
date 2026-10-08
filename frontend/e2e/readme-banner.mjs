// The README's banner (light and dark) and its two buttons, drawn from the real app screenshots.
// Run after readme-shots.mjs: node e2e/readme-banner.mjs → docs/brand/*.webp and *.svg
import fs from 'node:fs'
import { chromium } from 'playwright'

const shot = (name) => `data:image/png;base64,${fs.readFileSync(`e2e/screenshots/readme-${name}.png`).toString('base64')}`
const logo = fs.readFileSync('public/favicon.svg', 'utf8')
fs.mkdirSync('../docs/brand', { recursive: true })

const theme = {
  light: { bg: '#fbf7ef', ink: '#16151a', sub: '#5d5966', frame: '#16151a' },
  dark: { bg: '#121116', ink: '#f4f2ee', sub: '#aaa6b4', frame: '#2a2833' },
}

const page = (t) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1600px;height:820px;background:${t.bg};font-family:'Plus Jakarta Sans',sans-serif;overflow:hidden;position:relative}
.blob{position:absolute;border-radius:40px}
.b1{width:260px;height:180px;background:#fbe38e;left:-60px;top:560px;transform:rotate(-10deg)}
.b2{width:200px;height:200px;border-radius:50%;background:#f6bed6;left:560px;top:-90px}
.b3{width:300px;height:220px;background:#c9c3f5;right:-80px;bottom:-110px;transform:rotate(12deg)}
.b4{width:140px;height:140px;border-radius:50%;background:#bfebdd;left:640px;bottom:40px}
.text{position:absolute;left:110px;top:150px;width:680px}
.brand{display:flex;align-items:center;gap:20px}
.brand svg{width:92px;height:92px;border-radius:24px;box-shadow:0 10px 30px rgb(22 21 26/.25)}
.brand span{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:76px;color:${t.ink};letter-spacing:-2px}
h1{margin-top:34px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:54px;line-height:1.02;color:${t.ink};letter-spacing:-1.5px}
h1 em{font-style:normal;color:#7b6ff0}
p{margin-top:24px;font-size:25px;line-height:1.45;color:${t.sub};font-weight:500;width:560px}
.pills{display:flex;gap:12px;margin-top:30px}
.pill{padding:10px 18px;border-radius:999px;font-weight:600;font-size:18px;color:#16151a}
.phone{position:absolute;width:272px;height:604px;border-radius:44px;background:${t.frame};padding:10px;box-shadow:0 30px 70px rgb(22 21 26/.35)}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:35px;display:block}
.p1{left:820px;top:150px;transform:rotate(-7deg)}
.p2{left:1060px;top:80px;transform:rotate(0deg);z-index:2}
.p3{left:1300px;top:170px;transform:rotate(7deg)}
</style></head><body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>
<div class="text">
  <div class="brand">${logo}<span>Thrywe</span></div>
  <h1>Learn anything from YouTube. <em>Without the noise.</em></h1>
  <p>An AI summary and mind map for any video, your notes beside the player, and study groups.</p>
  <div class="pills"><span class="pill" style="background:#fbe38e">Summaries</span><span class="pill" style="background:#c9c3f5">Mind maps</span><span class="pill" style="background:#bfebdd">Study groups</span></div>
</div>
<div class="phone p1"><img src="${shot('home')}"></div>
<div class="phone p2"><img src="${shot('map-full-card')}"></div>
<div class="phone p3"><img src="${shot('brief')}"></div>
</body></html>`

const browser = await chromium.launch({ channel: 'msedge' })
const tab = await browser.newPage({ viewport: { width: 1600, height: 820 }, deviceScaleFactor: 1.5 })
for (const [name, t] of Object.entries(theme)) {
  await tab.setContent(page(t), { waitUntil: 'networkidle' })
  await tab.waitForTimeout(600)
  await tab.screenshot({ path: `e2e/screenshots/banner-${name}.png` })
  console.log('banner', name)
}
await browser.close()

// Buttons as small SVGs (GitHub shows SVG images; links wrap them in the README).
const button = (label, bg, fg) => {
  const w = 34 + label.length * 11.5 + 30
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="52" viewBox="0 0 ${w} 52"><rect width="${w}" height="52" rx="26" fill="${bg}"/><text x="${w / 2}" y="33" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="19" font-weight="700" fill="${fg}">${label}</text></svg>`
}
fs.writeFileSync('../docs/brand/button-open.svg', button('Open Thrywe  →', '#16151a', '#ffffff'))
fs.writeFileSync('../docs/brand/button-install.svg', button('Install the app', '#c9c3f5', '#16151a'))
console.log('buttons')
