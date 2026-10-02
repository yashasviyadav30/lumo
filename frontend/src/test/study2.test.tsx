import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { splitTimes } from '../lib/study'
import { renderAt, signInForTest } from './render'

const VID = 'lecture0001'
const VIDEO = { video_id: VID, title: 'ESG Lecture 6', channel_id: 'c', channel_title: 'CS Teacher', thumbnail_url: '', duration_s: 4000, published_at: '2024-01-01T00:00:00Z', live: 'none', has_captions: true }

function fakeYouTube() {
  const seeks: number[] = []
  window.YT = {
    Player: class {
      constructor(_el: HTMLElement, opts: Record<string, unknown>) {
        const events = opts.events as { onReady: (e: { target: unknown }) => void }
        setTimeout(() => events.onReady({ target: this }))
      }
      destroy() {}
      seekTo(s: number) {
        seeks.push(s)
      }
      getCurrentTime() {
        return 100
      }
      getPlayerState() {
        return 1
      }
      playVideo() {}
    },
  }
  return { seeks }
}

afterEach(() => {
  delete window.YT
  vi.restoreAllMocks()
})

describe('times in text', () => {
  it('finds m:ss and h:mm:ss times', () => {
    expect(splitTimes('Intro 0:00, CSR at 12:40 and 1:02:05 end').filter((p) => p.t !== undefined).map((p) => p.t)).toEqual([0, 760, 3725])
    expect(splitTimes('no times here')).toEqual([{ text: 'no times here' }])
  })
})

describe('study page extras', () => {
  it('stars the video at once, and the star fills', async () => {
    fakeYouTube()
    const { calls } = signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 0, notes: [], description: '', starred: false, notepad: null } }),
      'POST /api/videos/star': () => ({ status: 200, body: { starred: true } }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    const star = await screen.findByRole('button', { name: /^Star/ })
    expect(star).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(star)
    expect(screen.getByRole('button', { name: /Starred/ })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(calls.find((c) => c.path === '/api/videos/star')?.body).toEqual({ video_id: VID, starred: true }))
  })

  it('shows the description and comments; their times jump the video', async () => {
    const yt = fakeYouTube()
    signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 0, notes: [], description: 'Chapters:\n0:00 Intro\n12:40 CSR rules', starred: false, notepad: null } }),
      'POST /api/study/comments': () => ({
        status: 200,
        body: { disabled: false, comments: [{ author: '@asha', author_url: '', text: 'Important part at 25:10 !!', likes: 42, published_at: null, replies: 0 }, { author: '@ravi', author_url: '', text: 'Thanks sir', likes: 3, published_at: null, replies: 1 }] },
      }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    await userEvent.click(await screen.findByRole('tab', { name: /Description/ }))
    await new Promise((r) => setTimeout(r, 0))
    await userEvent.click(screen.getByRole('button', { name: 'Jump to 12:40' }))
    expect(yt.seeks).toContain(760)

    await userEvent.click(screen.getByRole('tab', { name: /Comments/ }))
    await userEvent.click(await screen.findByRole('button', { name: 'Jump to 25:10' }))
    expect(yt.seeks).toContain(1510)
    await userEvent.click(screen.getByRole('button', { name: /With times/ }))
    expect(screen.queryByText('Thanks sir')).not.toBeInTheDocument()
  })
})

describe('library', () => {
  it('has Starred and History, and History shows where she stopped', async () => {
    signInForTest({
      'GET /api/library': () => ({
        status: 200,
        body: { starred: [{ video_id: VID, video: VIDEO, at: new Date().toISOString() }], history: [{ video_id: VID, video: VIDEO, at: new Date().toISOString(), position_s: 754 }] },
      }),
    })
    renderAt('/library')
    expect(await screen.findByText('ESG Lecture 6')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: /History/ }))
    expect(await screen.findByText(/Resume 12:34/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument()
  })
})
