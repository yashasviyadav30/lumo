// Layout and standards scan of every screen: phone + laptop, light + night. Prints every problem it finds.
// Checks: top bar first and at the top (also after scrolling), tab bar at the bottom (phone) / left (laptop),
// nothing wider than the screen, tap targets big enough, every button named, images have alt, one h1 per page.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Throwaway account, always deleted.
// Run: node e2e/audit.mjs   (SHOTS=1 also saves a screenshot of every screen to e2e/screenshots/audit-*.png)
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const PUBLIC = ['/welcome', '/sign-in', '/sign-up', '/privacy']
const APP = ['/', '/search', '/shorts', '/groups', '/library', '/personal', '/settings', '/watch/aircAruvnKk']
const SIZES = { phone: { width: 412, height: 915 }, laptop: { width: 1366, height: 860 } }
const issues = []

async function check(page, label, signedIn) {
  await page.waitForTimeout(1500)
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 90_000 }).catch(() => {})
  const r = await page.evaluate((signedIn) => {
    const out = []
    const vw = innerWidth
    const vh = innerHeight
    const top = document.querySelector('header.topbar')
    const main = document.querySelector('main')
    if (!top) out.push('no top bar')
    else {
      const t = top.getBoundingClientRect()
      if (t.top > 2) out.push(`top bar starts at y=${Math.round(t.top)} (should be 0)`)
      if (main && main.getBoundingClientRect().top < t.bottom - 2) out.push('page content starts above the top bar')
      if (main && top.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_PRECEDING) out.push('top bar comes after the content in the page')
    }
    if (signedIn) {
      const nav = document.querySelector('nav.tabbar')
      const studyOnPhone = vw < 960 && location.pathname.startsWith('/watch/') // hidden there on purpose
      if (studyOnPhone) {
        if (nav && nav.getBoundingClientRect().height > 0) out.push('tab bar shows on the study page (it covers the notes)')
      } else if (!nav) out.push('no tab bar')
      else {
        const n = nav.getBoundingClientRect()
        if (!studyOnPhone && vw < 960 && (n.bottom > vh + 1 || vh - n.bottom > 24)) out.push(`phone tab bar not at the bottom (bottom=${Math.round(n.bottom)}, screen=${vh}; a floating bar may sit up to 24px above)`)
        if (!studyOnPhone && vw >= 960 && (n.left > 40 || n.top > 140)) out.push(`laptop side bar not at the left/top (x=${Math.round(n.left)}, y=${Math.round(n.top)})`)
      }
    }
    if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways (${document.documentElement.scrollWidth}px wide on a ${vw}px screen)`)
    const visible = (el) => {
      const b = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
    }
    const wide = [...document.querySelectorAll('main *')].filter((el) => visible(el) && el.getBoundingClientRect().right > vw + 2 && !el.closest('.chipbar, .chips, .tabs, .react-flow, .np-toolbar, .lp-stage'))
    if (wide.length) out.push(`${wide.length} element(s) stick out past the screen edge, e.g. <${wide[0].tagName.toLowerCase()} class="${wide[0].className}">`)
    const named = (el) => (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').trim()
    const unnamed = [...document.querySelectorAll('button, a[href], [role=button], [role=tab]')].filter((el) => visible(el) && !named(el) && !el.closest('[aria-hidden="true"]'))
    if (unnamed.length) out.push(`${unnamed.length} button/link(s) with no name, e.g. <${unnamed[0].tagName.toLowerCase()} class="${unnamed[0].className}">`)
    if (vw < 960) {
      const small = [...document.querySelectorAll('button, [role=tab], a.button, .icon-btn')].filter((el) => {
        if (!visible(el) || el.closest('.np-toolbar, .react-flow__controls, .np-menu') || el.classList.contains('link')) return false
        const b = el.getBoundingClientRect()
        return b.height < 32 || b.width < 32
      })
      if (small.length) out.push(`${small.length} tap target(s) smaller than 32px, e.g. "${named(small[0]).slice(0, 30)}"`)
    }
    const noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt'))
    if (noAlt.length) out.push(`${noAlt.length} image(s) without alt`)
    const h1 = document.querySelectorAll('h1').length
    if (h1 !== 1) out.push(`${h1} h1 headings (should be 1)`)
    return out
  }, signedIn)
  if (signedIn) {
    const tall = await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 700)
    if (tall) {
      await page.evaluate(() => window.scrollTo(0, 700))
      await page.waitForTimeout(300)
      const y = await page.evaluate(() => Math.round(document.querySelector('header.topbar')?.getBoundingClientRect().top ?? 0))
      if (Math.abs(y) > 2) r.push(`top bar scrolls away (at y=${y} after scrolling)`)
    }
  }
  if (process.env.SHOTS) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: `e2e/screenshots/audit-${label.replace(/[^a-z0-9]+/gi, '-')}.png` })
  }
  for (const msg of r) issues.push(`${label}: ${msg}`)
  console.log(r.length ? `✘ ${label}: ${r.join(' | ')}` : `✔ ${label}`)
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
let token = null
try {
  for (const [size, vp] of Object.entries(SIZES)) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: vp, colorScheme: theme })
      for (const path of PUBLIC) {
        await page.goto(BASE + path)
        await check(page, `${size}/${theme} ${path}`, false)
      }
      if (!token) {
        const email = `audit-${Date.now()}@example.com`
        token = await page.evaluate(async (email) => {
          const r = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'audit test password 1', date_of_birth: '1999-02-02', accepted_notice: true }) })
          return (await r.json()).token
        }, email)
      }
      await page.evaluate((t) => {
        localStorage.setItem('focuslearn.token', t)
        localStorage.setItem('focuslearn.guideSeen', '1')
        localStorage.setItem('focuslearn.studyHintSeen', '1')
      }, token)
      for (const path of APP) {
        await page.goto(BASE + path)
        await check(page, `${size}/${theme} ${path}`, true)
      }
      await page.close()
    }
  }
} finally {
  if (token) {
    const page = await browser.newPage()
    await page.goto(BASE + '/welcome')
    await page.evaluate((t) => fetch('/api/me', { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } }), token)
    console.log('✔ audit account deleted')
  }
  await browser.close()
}
console.log(`\n${issues.length} problem(s)`)
for (const i of issues) console.log(' -', i)
