import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VIDEO_ID, playerErrorMessage, playerVars } from '../lib/youtube'
import { renderAt, signInForTest } from './render'

afterEach(() => {
  delete window.YT
  vi.restoreAllMocks()
})

describe('watch page (1.2)', () => {
  beforeEach(() => {
    signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: null, position_s: 0, notes: [] } }),
      'POST /api/progress': () => ({ status: 204 }),
    })
  })

  it('accepts real video IDs and rejects others', () => {
    expect(VIDEO_ID.test('dQw4w9WgXcQ')).toBe(true)
    expect(VIDEO_ID.test('short')).toBe(false)
    expect(VIDEO_ID.test('dQw4w9WgXcQ<script>')).toBe(false)
  })

  it('shows a friendly message for a bad video link', async () => {
    renderAt('/watch/bad-id')
    expect(await screen.findByRole('heading', { name: 'Video not found' })).toBeInTheDocument()
  })

  it('creates the official player with standard controls and no autoplay (R7)', async () => {
    const created: Array<Record<string, unknown>> = []
    window.YT = {
      Player: class {
        constructor(_el: HTMLElement, opts: Record<string, unknown>) {
          created.push(opts)
        }
        destroy() {}
        seekTo() {}
        getCurrentTime() {
          return 0
        }
        getPlayerState() {
          return -1
        }
        playVideo() {}
        pauseVideo() {}
      },
    }
    renderAt('/watch/dQw4w9WgXcQ')
    await waitFor(() => expect(created).toHaveLength(1))
    const opts = created[0]
    expect(opts.videoId).toBe('dQw4w9WgXcQ')
    expect(opts.host).toBe('https://www.youtube-nocookie.com')
    expect(opts.playerVars).toMatchObject({ autoplay: 0, controls: 1, playsinline: 1 })
    expect(await screen.findByRole('link', { name: 'Watch on YouTube' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    )
  })

  it('never turns off controls or turns on autoplay', () => {
    const vars = playerVars('https://example.test')
    expect(vars.controls).toBe(1)
    expect(vars.autoplay).toBe(0)
    expect(vars.origin).toBe('https://example.test')
  })

  it('explains player errors in plain words', () => {
    expect(playerErrorMessage(150)).toMatch(/owner doesn’t allow/)
    expect(playerErrorMessage(153)).toMatch(/153/)
    expect(playerErrorMessage(999)).toMatch(/999/)
  })
})
