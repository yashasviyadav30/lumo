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
