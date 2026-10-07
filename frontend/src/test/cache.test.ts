import { describe, expect, it, vi } from 'vitest'
import { forget, fresh, peek, writeToken } from '../lib/api'

describe('screen memory', () => {
  it('asks once for two screens wanting the same thing, and keeps the answer', async () => {
    const load = vi.fn(async () => ['video'])
    const [a, b] = await Promise.all([fresh('feed:all', load), fresh('feed:all', load)])
    expect(load).toHaveBeenCalledTimes(1)
    expect(a).toBe(b)
    expect(peek('feed:all')).toEqual(['video'])
  })

  it('forgets by prefix, and forgets everything when the person changes', async () => {
    await fresh('feed:all', async () => 1)
    await fresh('library', async () => 2)
    forget('feed:')
    expect(peek('feed:all')).toBeUndefined()
    expect(peek('library')).toBe(2)
    writeToken(null)
    expect(peek('library')).toBeUndefined()
  })

  it('a request started before forget neither comes back as current nor gets kept', async () => {
    let finish: (v: string) => void = () => {}
    const old = fresh('feed:all', () => new Promise<string>((r) => (finish = r)))
    forget('feed:') // e.g. a new goal was saved while the old feed was loading
    const next = fresh('feed:all', async () => 'goal feed')
    finish('old feed')
    expect(await old).toBe('old feed')
    expect(await next).toBe('goal feed')
    expect(peek('feed:all')).toBe('goal feed')
  })

  it('keeps nothing from a failed load', async () => {
    await expect(fresh('shorts', async () => Promise.reject(new Error('down')))).rejects.toThrow('down')
    expect(peek('shorts')).toBeUndefined()
  })
})
