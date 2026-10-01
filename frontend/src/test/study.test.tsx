import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { clock, notebookMarkdown, type Note } from '../lib/study'
import { renderAt, signInForTest } from './render'

const VID = 'lecture0001'
const VIDEO = { video_id: VID, title: 'ESG Lecture 6', channel_id: 'c', channel_title: 'CS Teacher', thumbnail_url: '', duration_s: 4000, published_at: null, live: 'none', has_captions: true }

function note(over: Partial<Note> = {}): Note {
  return { id: 'n1', video_id: VID, t_seconds: 2530, kind: 'note', tag: null, starred: false, text: '', solved: false, answer: '', cards: 0, created_at: '2026-10-01T10:00:00Z', ...over }
}

// A stand-in for the YouTube player: records options, reports a fixed time.
function fakeYouTube(currentTime = 2530) {
  const created: Array<Record<string, unknown>> = []
  const seeks: number[] = []
  window.YT = {
    Player: class {
      constructor(_el: HTMLElement, opts: Record<string, unknown>) {
        created.push(opts)
        const events = opts.events as { onReady: (e: { target: unknown }) => void }
        setTimeout(() => events.onReady({ target: this }))
      }
      destroy() {}
      seekTo(s: number) {
        seeks.push(s)
      }
      getCurrentTime() {
        return currentTime
      }
      getPlayerState() {
        return 2
      }
      playVideo() {}
    },
  }
  return { created, seeks }
}

afterEach(() => {
  delete window.YT
  vi.restoreAllMocks()
})

describe('study page', () => {
  it('marks the current second in one tap, then fills it in later', async () => {
    const yt = fakeYouTube()
    const { calls } = signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 0, notes: [] } }),
      'POST /api/notes': () => ({ status: 201, body: note() }),
      'POST /api/notes/update': () => ({ status: 200, body: note({ text: 'CSR spend = 2% of profit', tag: 'def' }) }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    await waitFor(() => expect(yt.created).toHaveLength(1))
    await userEvent.click(await screen.findByRole('button', { name: /Mark/ }))
    expect(await screen.findByRole('status')).toHaveTextContent('Marked at 42:10')
    expect(calls.find((c) => c.path === '/api/notes')?.body).toMatchObject({ video_id: VID, t_seconds: 2530 })

    expect(screen.getByText('1 mark to fill in')).toBeInTheDocument()
    await userEvent.type(screen.getByRole('textbox', { name: 'Note at 42:10' }), 'CSR spend = 2% of profit')
    await userEvent.click(screen.getByRole('button', { name: 'Def' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('CSR spend = 2% of profit')).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/notes/update')?.body).toMatchObject({ text: 'CSR spend = 2% of profit', tag: 'def' })
    expect(screen.queryByText(/to fill in/)).not.toBeInTheDocument()
  })

  it('jumps the player back to a note when its time is tapped', async () => {
    const yt = fakeYouTube()
    signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 0, notes: [note({ text: 'BRSR top 1000', t_seconds: 600 })] } }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    await waitFor(() => expect(yt.created).toHaveLength(1))
    await new Promise((r) => setTimeout(r, 0))
    await userEvent.click(await screen.findByRole('button', { name: 'Jump to 10:00' }))
    expect(yt.seeks).toContain(600)
  })

  it('resumes where she stopped, and can start from the beginning', async () => {
    const yt = fakeYouTube()
    signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 2530, notes: [] } }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    await waitFor(() => expect(yt.created).toHaveLength(1))
    expect(yt.created[0].playerVars).toMatchObject({ start: 2530, autoplay: 0, controls: 1 })
    await userEvent.click(screen.getByRole('button', { name: 'Start from the beginning' }))
    await waitFor(() => expect(yt.created).toHaveLength(2))
    expect(yt.created[1].playerVars).not.toHaveProperty('start')
  })

  it('makes a card by hiding the words she taps', async () => {
    fakeYouTube()
    const { calls } = signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 0, notes: [note({ text: 'CSR spend = 2% of profit' })] } }),
      'POST /api/cards': () => ({ status: 201, body: {} }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    await userEvent.click(await screen.findByRole('button', { name: 'Make a card' }))
    const sheet = screen.getByRole('dialog', { name: 'Make a card' })
    await userEvent.click(within(sheet).getByRole('button', { name: '2%' }))
    await userEvent.click(within(sheet).getByRole('button', { name: 'Save card' }))
    expect(await screen.findByText(/Card made/)).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/cards')?.body).toEqual({ note_id: 'n1', blanks: ['2%'] })
  })

  it('never puts the video ID in a URL (R11)', async () => {
    fakeYouTube()
    const { calls } = signInForTest({
      'POST /api/study/open': () => ({ status: 200, body: { video: VIDEO, position_s: 0, notes: [] } }),
      'POST /api/notes': () => ({ status: 201, body: note({ kind: 'doubt' }) }),
      'POST /api/progress': () => ({ status: 204 }),
    })
    renderAt(`/watch/${VID}`)
    await userEvent.click(await screen.findByRole('button', { name: /Doubt/ }))
    expect(await screen.findByText(/Doubt parked at 42:10/)).toBeInTheDocument()
    expect(calls.length).toBeGreaterThan(1)
    for (const c of calls) expect(c.path).not.toContain(VID)
  })
})

describe('cards review', () => {
  const CARD = { id: 'c1', note_id: 'n1', front: 'CSR spend = _____ of profit', answer: 'CSR spend = 2% of profit', blanks: ['2%'], video_id: VID, t_seconds: 2530, replay: { start: 2500, end: 2590 }, video: VIDEO }

  it('replays only the bit around the note when she forgot', async () => {
    const yt = fakeYouTube()
    const { calls } = signInForTest({
      'GET /api/cards/due': () => ({ status: 200, body: { cards: [CARD] } }),
      'POST /api/cards/grade': () => ({ status: 200, body: { retired: false, due_at: '', replay: CARD.replay } }),
    })
    renderAt('/cards')
    expect(await screen.findByText('CSR spend = _____ of profit')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Show answer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Forgot' }))
    expect(await screen.findByRole('heading', { name: 'Watch this bit' })).toBeInTheDocument()
    await waitFor(() => expect(yt.created).toHaveLength(1))
    expect(yt.created[0].playerVars).toMatchObject({ start: 2500, end: 2590, autoplay: 0 })
    expect(calls.find((c) => c.path === '/api/cards/grade')?.body).toEqual({ id: 'c1', grade: 'forgot' })

    // The forgotten card comes back once more in this session; then she's done.
    await userEvent.click(screen.getByRole('button', { name: 'Ask me again later' }))
    await userEvent.click(screen.getByRole('button', { name: 'Show answer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Knew it' }))
    expect(await screen.findByRole('heading', { name: 'Done. Sleep well.' })).toBeInTheDocument()
    expect(screen.queryByText(/streak|points|score/i)).not.toBeInTheDocument() // R8
  })
})

describe('home and personal', () => {
  it('opens Home on one thing to do: resume the lecture', async () => {
    signInForTest({
      'GET /api/home/summary': () => ({ status: 200, body: { resume: { video_id: VID, position_s: 2530, video: VIDEO }, cards_due: 3, doubts_open: 1, marks_to_fill: 0 } }),
      'GET /api/goals/active': () => ({ status: 200, body: null }),
    })
    renderAt('/')
    expect(await screen.findByRole('link', { name: /ESG Lecture 6/ })).toHaveAttribute('href', `/watch/${VID}`)
    expect(screen.getByRole('link', { name: 'Review 3 cards due' })).toHaveAttribute('href', '/cards')
  })

  it('searches her notes and filters doubts, all in the request body', async () => {
    const book = { lectures: [{ video_id: VID, video: VIDEO, notes: [note({ kind: 'doubt', text: 'What is XBRL?' })] }], total: 1 }
    const { calls } = signInForTest({ 'POST /api/notebook': () => ({ status: 200, body: book }) })
    renderAt('/personal')
    expect(await screen.findByText(/What is XBRL\?/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Doubts' }))
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search your notes' }), 'xbrl{Enter}')
    expect(calls.filter((c) => c.path === '/api/notebook').at(-1)?.body).toEqual({ q: 'xbrl', only: 'doubts' })
  })

  it('exports notes as Markdown with links back to YouTube', () => {
    const md = notebookMarkdown({ lectures: [{ video_id: VID, video: VIDEO, notes: [note({ text: 'CSR = 2%', starred: true, tag: 'def' })] }], total: 1 })
    expect(md).toContain('## ESG Lecture 6')
    expect(md).toContain(`[42:10](https://www.youtube.com/watch?v=${VID}&t=2530s) ★ **DEF** CSR = 2%`)
    expect(clock(3725)).toBe('1:02:05')
  })
})
