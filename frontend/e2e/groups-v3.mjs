// Two people in a study group, end to end: create, invite, join, share a video, reply in the thread, unread badge.
// Needs the backend on :8000 and `npx vite` on :5173 (or set E2E_BASE). Two throwaway accounts, always deleted.
// Run: node e2e/groups-v3.mjs   → e2e/screenshots/v3groups-*.png
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE ?? 'http://localhost:5173'
const VIDEO = 'aircAruvnKk'
const dir = new URL('./screenshots/', import.meta.url)
fs.mkdirSync(dir, { recursive: true })
const file = (name) => new URL(`v3groups-${name}.png`, dir).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const PHONE = { width: 412, height: 915 }

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []
const people = []

async function person(label) {
  const ctx = await browser.newContext({ viewport: PHONE, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`))
  const p = { label, page, signedUp: false, deleted: false }
  people.push(p)
  return p
}
const shot = async (page, name) => {
  await page.waitForTimeout(800)
  await page.screenshot({ path: file(name) })
  console.log('✔', name)
}
async function signUp(p, path = '/welcome') {
  const { page } = p
  await page.goto(BASE + path)
  await page.getByRole('link', { name: /Start free/ }).first().click()
  await page.getByLabel('Date of birth').fill('1999-02-02')
  await page.getByLabel(/I’ve read what/).check()
  await page.getByLabel('Email').fill(`${p.label}-${Date.now()}@example.com`)
  await page.getByLabel(/Password/).fill('groups test password 1')
  p.signedUp = true
  await page.getByRole('button', { name: 'Create account' }).click()
}
async function skipGuide(page) {
  const skip = page.getByRole('button', { name: 'Skip' })
  if (await skip.isVisible({ timeout: 15_000 }).catch(() => false)) await skip.click()
}
async function remove(p) {
  await p.page.goto(BASE + '/settings')
  await p.page.getByRole('button', { name: 'Delete my data' }).click()
  await p.page.getByRole('button', { name: 'Yes, delete everything' }).click()
  await p.page.waitForURL('**/welcome')
  p.deleted = true
}

try {
  const asha = await person('asha')
  await signUp(asha)
  await asha.page.getByLabel('Your learning goal').waitFor({ timeout: 90_000 })
  await skipGuide(asha.page)
  await asha.page.getByRole('link', { name: 'Groups' }).click()
  await asha.page.getByLabel('Group name').fill('Neural nets study circle')
  await asha.page.getByLabel('Your name in this group').fill('Asha')
  await shot(asha.page, 'phone-create')
  await asha.page.getByRole('button', { name: 'Create group' }).click()
  await asha.page.getByRole('button', { name: 'Invite' }).waitFor()
  const groupUrl = asha.page.url()
  const code = await asha.page.evaluate(
    (gid) => fetch('/api/groups/open', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` }, body: JSON.stringify({ group_id: gid }) }).then((r) => r.json()).then((j) => j.invite_code),
    groupUrl.split('/').pop(),
  )

  // Asha shares a video with its mind map from the study page.
  await asha.page.goto(BASE + '/watch/' + VIDEO)
  await asha.page.getByRole('button', { name: 'Share' }).click()
  await asha.page.getByLabel('Open it on').selectOption('map')
  await asha.page.getByLabel('Message (optional)').fill('Watch this before Sunday, the mind map is great')
  await shot(asha.page, 'phone-share-sheet')
  await asha.page.getByRole('button', { name: 'Share', exact: true }).last().click()
  await asha.page.getByText('Shared.').waitFor()

  // Ravi opens the invite link while signed out, signs up, and lands on the join screen.
  const ravi = await person('ravi')
  await ravi.page.goto(BASE + '/join/' + code)
  await ravi.page.getByText(/invited to a study group/).waitFor({ timeout: 60_000 })
  await shot(ravi.page, 'phone-invited-welcome')
  await ravi.page.getByRole('link', { name: /Start free/ }).first().click()
  await ravi.page.getByLabel('Date of birth').fill('1998-03-03')
  await ravi.page.getByLabel(/I’ve read what/).check()
  await ravi.page.getByLabel('Email').fill(`ravi-${Date.now()}@example.com`)
  await ravi.page.getByLabel(/Password/).fill('groups test password 1')
  ravi.signedUp = true
  await ravi.page.getByRole('button', { name: 'Create account' }).click()
  await ravi.page.getByLabel('Your name in this group').waitFor({ timeout: 90_000 })
  await skipGuide(ravi.page)
  await ravi.page.getByLabel('Your name in this group').fill('Ravi')
  await shot(ravi.page, 'phone-join')
  await ravi.page.getByRole('button', { name: 'Join group' }).click()
  await ravi.page.getByRole('list', { name: 'Posts' }).waitFor()
  await ravi.page.getByRole('button', { name: 'Reply' }).first().click()
  await ravi.page.getByRole('textbox', { name: 'Reply' }).fill('Thanks! The part at 3:40 about layers finally clicked')
  await ravi.page.getByRole('button', { name: 'Send reply' }).click()
  await ravi.page.getByText('finally clicked').waitFor()
  await shot(ravi.page, 'phone-thread')

  // Asha sees the unread badge on Groups.
  await asha.page.goto(BASE + '/')
  await asha.page.locator('.tab-badge').waitFor({ timeout: 30_000 })
  await shot(asha.page, 'phone-badge')
  await asha.page.goto(groupUrl)
  await asha.page.getByRole('list', { name: 'Posts' }).waitFor()
  await asha.page.evaluate(() => localStorage.setItem('focuslearn.theme', 'dark'))
  await asha.page.reload()
  await asha.page.getByRole('list', { name: 'Posts' }).waitFor()
  await asha.page.getByRole('button', { name: /1 reply/ }).click()
  await asha.page.getByText('finally clicked').waitFor()
  await shot(asha.page, 'phone-night-group')

  await remove(ravi)
  await remove(asha)
  console.log('✔ both test accounts deleted')
} catch (e) {
  console.log('FAILED:', e.message)
  for (const p of people) await p.page.screenshot({ path: file(`failure-${p.label}`) }).catch(() => {})
  process.exitCode = 1
} finally {
  for (const p of people) {
    if (p.signedUp && !p.deleted) {
      await p.page
        .evaluate(() => fetch('/api/me', { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('focuslearn.token')}` } }))
        .then(() => console.log(`✔ ${p.label} deleted after the failure`))
        .catch((e) => console.log(`COULD NOT DELETE ${p.label}:`, e.message))
    }
  }
  await browser.close()
  console.log(errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors')
}
