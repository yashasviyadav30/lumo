import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt, signInForTest } from './render'

const CMA_GOAL = {
  id: 'g1',
  text: 'CMA Inter costing',
  field: 'cma',
  field_label: 'CMA (Cost and Management Accountant), ICMAI',
  level: 'cma-intermediate',
  level_label: 'CMA Intermediate',
  topic_id: 'cma-int-p8-cost-accounting',
  language: 'en',
  did_you_mean: [],
  minor_signals: [],
  query: 'CMA Inter Cost Accounting',
  topics: [
    { id: 'cma-int-p8-cost-accounting', name: 'Paper 8: Cost Accounting', query: 'CMA Inter Cost Accounting' },
    { id: 'cma-int-p8-materials', name: 'Material cost', query: 'CMA Inter material cost' },
  ],
}

const SEARCH_OK = { status: 200, body: { mode: 'live', results: [], hidden: [], hidden_count: 0, searches_left: 90, note: null } }

describe('goal on Home (Stage 4A)', () => {
  it('asks for any goal and shows one line of what it understood', async () => {
    const { calls } = signInForTest({
      'GET /api/goals/active': () => ({ status: 200, body: null }),
      'POST /api/goals': () => ({ status: 201, body: CMA_GOAL }),
    })
    renderAt('/')
    await userEvent.type(await screen.findByLabelText('Your learning goal'), 'CMA Inter costing')
    await userEvent.click(screen.getByRole('button', { name: 'Set goal' }))
    expect(await screen.findByText('CMA · CMA Intermediate · Paper 8: Cost Accounting')).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/goals')!.body).toEqual({ text: 'CMA Inter costing' })
    expect(await screen.findByRole('button', { name: 'Material cost' })).toBeInTheDocument() // topics join the feed's chip bar
  })

  it('asks one Did-you-mean tap only when the goal is ambiguous', async () => {
    signInForTest({
      'GET /api/goals/active': () => ({
        status: 200,
        body: { ...CMA_GOAL, text: 'CS', field: null, query: null, topics: [], did_you_mean: [{ index: 0, label: 'Company Secretary (ICSI)' }, { index: 1, label: 'Computer Science' }] },
      }),
      'POST /api/goals/g1/choose': () => ({ status: 200, body: { ...CMA_GOAL, field_label: 'CS (Company Secretary), ICSI', level_label: null, topic_id: null, topics: [] } }),
    })
    renderAt('/')
    await userEvent.click(await screen.findByRole('button', { name: 'Company Secretary (ICSI)' }))
    expect(await screen.findByText('CS')).toBeInTheDocument()
  })

  it('a topic chip shows its search in the feed without putting the query in the URL (R11)', async () => {
    const { calls } = signInForTest({
      'GET /api/goals/active': () => ({ status: 200, body: CMA_GOAL }),
      'POST /api/search': () => SEARCH_OK,
    })
    const { router } = renderAt('/')
    await userEvent.click(await screen.findByRole('button', { name: 'Material cost' }))
    await waitFor(() => expect(calls.some((c) => c.path === '/api/search')).toBe(true))
    expect(calls.find((c) => c.path === '/api/search')!.body).toEqual({ q: 'CMA Inter material cost' })
    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('')
  })

  it('notes school signals in a goal (18+ only for now)', async () => {
    signInForTest({ 'GET /api/goals/active': () => ({ status: 200, body: { ...CMA_GOAL, minor_signals: ['class 11'] } }) })
    renderAt('/')
    expect(await screen.findByRole('note')).toHaveTextContent('ages 18 and over')
  })
})
