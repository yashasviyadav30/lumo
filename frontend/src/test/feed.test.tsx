import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt, signInForTest } from './render'

const card = (id: string, channel: string, title: string) => ({
  video_id: id,
  title,
  channel_id: channel,
  channel_title: `Channel ${channel.slice(-1)}`,
  thumbnail_url: '',
  duration_s: 1800,
  published_at: null,
  live: 'none',
  has_captions: true,
})
const PODCAST = card('podcast0001', 'UC' + 'p'.repeat(22), 'Podcast with a CMA topper')
const VLOG = card('vlog0000001', 'UC' + 'v'.repeat(22), 'My Maldives trip')
const NEWS = { ...card('newsclip001', 'UC' + 'n'.repeat(22), 'Breaking news'), reasons: ['YouTube lists this as News & Politics'], playable: true }

describe('home feed', () => {
  it('shows the feed, hides a channel in one tap, and can undo it', async () => {
    const { calls } = signInForTest({
      'GET /api/goals/active': () => ({ status: 200, body: null }),
      'POST /api/feed': () => ({ status: 200, body: { results: [PODCAST, VLOG], hidden: [NEWS], hidden_count: 1, progress: { podcast0001: 900 } } }),
      'POST /api/mutes': () => ({ status: 201, body: {} }),
      'POST /api/mutes/remove': () => ({ status: 204 }),
    })
    renderAt('/')
    const feed = await screen.findByRole('list', { name: 'Your feed' })
    expect(within(feed).getByText('Podcast with a CMA topper')).toBeInTheDocument()
    expect(screen.getByText(/1 hidden by/)).toBeInTheDocument() // what was hidden is always listed (R6)
    expect(within(feed).getByText(/watched 50%/)).toBeInTheDocument() // red line under the thumbnail, told to screen readers too

    const vlog = within(feed).getByText('My Maldives trip').closest('li')!
    await userEvent.click(within(vlog).getByRole('button', { name: 'More actions' })) // one ⋮ menu per card
    await userEvent.click(within(vlog).getByRole('menuitem', { name: 'Don’t show this channel' }))
    await waitFor(() => expect(within(feed).queryByText('My Maldives trip')).not.toBeInTheDocument())
    expect(calls.find((c) => c.path === '/api/mutes')?.body).toEqual({ kind: 'channel', value: VLOG.channel_id })

    await userEvent.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(calls.some((c) => c.path === '/api/mutes/remove')).toBe(true))
  })

  it('Not interested removes one video, can be undone, and sends recent searches in the body', async () => {
    localStorage.setItem('focuslearn.recentSearches', JSON.stringify(['cost sheet']))
    const { calls } = signInForTest({
      'GET /api/goals/active': () => ({ status: 200, body: null }),
      'POST /api/feed': () => ({ status: 200, body: { results: [PODCAST, VLOG], hidden: [], hidden_count: 0 } }),
      'POST /api/search': () => ({ status: 200, body: { mode: 'live', results: [], hidden: [], hidden_count: 0, searches_left: 90, note: null } }),
      'POST /api/videos/not-interested': () => ({ status: 204 }),
    })
    renderAt('/')
    const feed = await screen.findByRole('list', { name: 'Your feed' })
    expect(calls.find((c) => c.path === '/api/feed')?.body).toEqual({ recent: ['cost sheet'] })
    expect(screen.getByRole('button', { name: 'cost sheet' })).toBeInTheDocument() // her search is a chip
    const podcast = within(feed).getByText('Podcast with a CMA topper').closest('li')!
    await userEvent.click(within(podcast).getByRole('button', { name: 'More actions' }))
    await userEvent.click(within(podcast).getByRole('menuitem', { name: 'Not interested' }))
    await waitFor(() => expect(within(feed).queryByText('Podcast with a CMA topper')).not.toBeInTheDocument())
    expect(calls.find((c) => c.path === '/api/videos/not-interested')?.body).toEqual({ video_id: 'podcast0001', undo: false })
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(await within(feed).findByText('Podcast with a CMA topper')).toBeInTheDocument()
    localStorage.removeItem('focuslearn.recentSearches')
  })
})
