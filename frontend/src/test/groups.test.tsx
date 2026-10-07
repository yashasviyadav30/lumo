import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ME, mockApi, renderAt, signInForTest } from './render'

const GID = '11111111-2222-3333-4444-555555555555'
const VIEW = {
  id: GID,
  name: 'CA Inter batch',
  invite_code: 'abcDEF123456',
  my_name: 'Asha',
  i_own: true,
  members: [{ id: 1, name: 'Asha', owner: true, me: true }],
}
const post = (over: Record<string, unknown> = {}) => ({
  id: 'p1',
  kind: 'doubt',
  author: 'Ravi',
  mine: false,
  can_delete: true,
  reported: false,
  text: 'What is a cost unit?',
  video_id: null,
  video: null,
  t_seconds: null,
  attach: null,
  replies: 0,
  created_at: new Date().toISOString(),
  ...over,
})

describe('study groups (plan v3 step 4)', () => {
  it('creates a group with their chosen name and opens it', async () => {
    const { calls } = signInForTest({
      'GET /api/groups': () => ({ status: 200, body: { groups: [], unread: 0 } }),
      'POST /api/groups': () => ({ status: 201, body: VIEW }),
      'POST /api/groups/open': () => ({ status: 200, body: { ...VIEW, posts: [] } }),
    })
    const { router } = renderAt('/groups')
    await userEvent.type(await screen.findByLabelText('Group name'), 'CA Inter batch')
    await userEvent.type(screen.getByLabelText('Your name in this group'), 'Asha')
    await userEvent.click(screen.getByRole('button', { name: 'Create group' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/groups/${GID}`))
    expect(calls.find((c) => c.path === '/api/groups' && c.method === 'POST')?.body).toEqual({ name: 'CA Inter batch', my_name: 'Asha' })
    expect(await screen.findByText(/Tap Invite/)).toBeInTheDocument()
  })

  it('shows posts, opens a thread and replies in it; IDs stay in request bodies (R11)', async () => {
    const { calls } = signInForTest({
      'GET /api/groups': () => ({ status: 200, body: { groups: [], unread: 0 } }),
      'POST /api/groups/open': () => ({ status: 200, body: { ...VIEW, posts: [post({ replies: 1 })] } }),
      'POST /api/groups/thread': () => ({ status: 200, body: { post: post(), replies: [post({ id: 'r1', kind: 'reply', author: 'Asha', mine: true, text: 'The unit you cost by' })] } }),
      'POST /api/groups/reply': () => ({ status: 201, body: post({ id: 'r2', kind: 'reply', author: 'Asha', mine: true, text: 'e.g. per kg' }) }),
    })
    renderAt(`/groups/${GID}`)
    const list = await screen.findByRole('list', { name: 'Posts' })
    expect(within(list).getByText('What is a cost unit?')).toBeInTheDocument()
    await userEvent.click(within(list).getByRole('button', { name: /1 reply/ }))
    expect(await screen.findByText('The unit you cost by')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Reply'), 'e.g. per kg')
    await userEvent.click(screen.getByRole('button', { name: 'Send reply' }))
    expect(await screen.findByText('e.g. per kg')).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/groups/reply')?.body).toEqual({ post_id: 'p1', text: 'e.g. per kg' })
    expect(calls.every((c) => !c.path.includes(GID))).toBe(true)
  })

  it('the owner marks a doubt answered from its menu', async () => {
    const { calls } = signInForTest({
      'GET /api/groups': () => ({ status: 200, body: { groups: [], unread: 0 } }),
      'POST /api/groups/open': () => ({ status: 200, body: { ...VIEW, posts: [post({ can_answer: true, answered: false })] } }),
      'POST /api/groups/post/answered': () => ({ status: 204 }),
    })
    renderAt(`/groups/${GID}`)
    const list = await screen.findByRole('list', { name: 'Posts' })
    expect(within(list).queryByText('Answered')).not.toBeInTheDocument()
    await userEvent.click(within(list).getByRole('button', { name: 'Post actions' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Mark answered' }))
    expect(await within(list).findByText('Answered')).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/groups/post/answered')?.body).toEqual({ post_id: 'p1', answered: true })
  })

  it('an invite opened while signed out joins right after sign-in', async () => {
    const { calls } = mockApi({
      'POST /api/auth/login': () => ({ status: 200, body: { token: 't1', me: ME } }),
      'POST /api/groups/preview': () => ({ status: 200, body: { id: GID, name: 'CA Inter batch', members: 3, full: false, member: false } }),
      'POST /api/groups/join': () => ({ status: 200, body: VIEW }),
      'POST /api/groups/open': () => ({ status: 200, body: { ...VIEW, posts: [] } }),
      'GET /api/groups': () => ({ status: 200, body: { groups: [], unread: 0 } }),
    })
    const { router } = renderAt('/join/abcDEF123456')
    expect(await screen.findByText(/invited to a study group/)).toBeInTheDocument()
    await router.navigate('/sign-in')
    await userEvent.type(await screen.findByLabelText('Email'), 'asha@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'correct horse 1')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await userEvent.type(await screen.findByLabelText('Your name in this group'), 'Asha')
    await userEvent.click(screen.getByRole('button', { name: 'Join group' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/groups/${GID}`))
    expect(calls.find((c) => c.path === '/api/groups/join')?.body).toEqual({ code: 'abcDEF123456', my_name: 'Asha' })
  })
})
