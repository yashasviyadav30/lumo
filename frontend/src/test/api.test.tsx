import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '../lib/api'

afterEach(() => vi.unstubAllGlobals())

describe('waking server', () => {
  it('waits for a sleeping server instead of failing, and shows the banner meanwhile', async () => {
    const events: boolean[] = []
    const onWake = (e: Event) => events.push((e as CustomEvent<boolean>).detail)
    window.addEventListener('focuslearn:waking', onWake)
    let calls = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        calls++
        if (calls === 1) throw new TypeError('Failed to fetch') // asleep
        if (calls === 2) return new Response('', { status: 503 }) // still waking
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      }),
    )
    await expect(api('/api/auth/login', { method: 'POST', body: '{}' })).resolves.toEqual({ ok: true })
    expect(calls).toBe(3)
    expect(events).toEqual([true, false])
    window.removeEventListener('focuslearn:waking', onWake)
  }, 15000)

  it('never repeats a write that might double-save', async () => {
    const f = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    })
    vi.stubGlobal('fetch', f)
    await expect(api('/api/notes', { method: 'POST', body: '{}' })).rejects.toThrow(/Can’t reach the server/)
    expect(f).toHaveBeenCalledTimes(1)
  })
})

describe('sign-up while the server wakes', () => {
  it('signs in when a retried sign-up finds the account was already made', async () => {
    const { renderAt, signInForTest } = await import('./render')
    const { screen } = await import('@testing-library/react')
    const userEvent = (await import('@testing-library/user-event')).default
    localStorage.clear()
    const { calls } = signInForTest({
      'GET /api/me': () => ({ status: 401, body: { detail: 'not_signed_in' } }),
      'POST /api/auth/signup': () => ({ status: 409, body: { detail: 'email_taken' } }),
      'POST /api/auth/login': () => ({ status: 200, body: { token: 't', me: { email: 'a@b.co', created_at: '', settings: { shorts_enabled: false, shorts_daily_limit_min: null, search_language: 'en' } } } }),
      'GET /api/home/summary': () => ({ status: 200, body: null }),
      'GET /api/goals/active': () => ({ status: 200, body: null }),
      'GET /api/feed': () => ({ status: 200, body: { results: [], hidden: [], hidden_count: 0 } }),
    })
    localStorage.removeItem('focuslearn.token')
    renderAt('/sign-up')
    await userEvent.type(await screen.findByLabelText('Email'), 'a@b.co')
    await userEvent.type(screen.getByLabelText(/Password/), 'long password 1')
    await userEvent.type(screen.getByLabelText('Date of birth'), '1999-02-02')
    await userEvent.click(screen.getByLabelText(/I’ve read what/))
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByLabelText('Your learning goal')).toBeInTheDocument()
    expect(calls.map((c) => c.path)).toContain('/api/auth/login')
  }, 20_000) // types a whole sign-up form and renders the app: about 6 s in jsdom
})
