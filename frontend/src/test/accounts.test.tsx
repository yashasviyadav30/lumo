import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ME, mockApi, renderAt, signInForTest } from './render'

async function fillSignUp(dob: string) {
  await userEvent.type(await screen.findByLabelText('Email'), 'asha@example.com')
  await userEvent.type(screen.getByLabelText(/Password/), 'correct horse 1')
  await userEvent.type(screen.getByLabelText('Date of birth'), dob)
  await userEvent.click(screen.getByLabelText(/I’ve read what/))
  await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
}

describe('accounts (Stage 2)', () => {
  it('sends signed-out visitors to the welcome page', async () => {
    mockApi({})
    const { router } = renderAt('/')
    await screen.findByRole('link', { name: 'Get started' })
    expect(router.state.location.pathname).toBe('/welcome')
  })

  it('shows the notice before sign-up, including YouTube and Google links (2.7)', async () => {
    mockApi({})
    renderAt('/sign-up')
    expect(await screen.findByText(/We don’t keep your date of birth/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YouTube’s Terms of Service' })).toHaveAttribute('href', 'https://www.youtube.com/t/terms')
    expect(screen.getByRole('link', { name: 'Google’s Privacy Policy' })).toHaveAttribute('href', 'https://policies.google.com/privacy')
    expect(screen.getByText(/We try to hide harmful content/)).toBeInTheDocument()
  })

  it('signs up an adult and opens the app', async () => {
    const { calls } = mockApi({
      'POST /api/auth/signup': () => ({ status: 201, body: { token: 't1', me: ME } }),
    })
    const { router } = renderAt('/sign-up')
    await fillSignUp('2000-05-01')
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(calls.find((c) => c.path === '/api/auth/signup')?.body).toMatchObject({ email: 'asha@example.com', date_of_birth: '2000-05-01', accepted_notice: true })
    expect(localStorage.getItem('focuslearn.token')).toBe('t1')
  })

  it('shows the polite "not yet" page to under-18s and keeps no token (2.2)', async () => {
    mockApi({ 'POST /api/auth/signup': () => ({ status: 403, body: { detail: 'under_18' } }) })
    const { router } = renderAt('/sign-up')
    await fillSignUp('2012-05-01')
    await waitFor(() => expect(router.state.location.pathname).toBe('/not-yet'))
    expect(screen.getByText(/We haven’t saved anything you typed/)).toBeInTheDocument()
    expect(localStorage.getItem('focuslearn.token')).toBeNull()
  })

  it('shows a plain message for a wrong password', async () => {
    mockApi({ 'POST /api/auth/login': () => ({ status: 401, body: { detail: 'wrong_email_or_password' } }) })
    renderAt('/sign-in')
    await userEvent.type(await screen.findByLabelText('Email'), 'asha@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'nope nope')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('That email and password don’t match.')
  })

  it('deletes all data after a confirmation (2.5)', async () => {
    const { calls } = signInForTest({
      'DELETE /api/me': () => ({ status: 200, body: { deleted: true, note: 'gone' } }),
    })
    const { router } = renderAt('/settings')
    await userEvent.click(await screen.findByRole('button', { name: 'Delete my data' }))
    expect(calls.some((c) => c.method === 'DELETE')).toBe(false) // nothing happens before confirming
    await userEvent.click(screen.getByRole('button', { name: 'Yes, delete everything' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/welcome'))
    expect(calls.some((c) => c.method === 'DELETE' && c.path === '/api/me')).toBe(true)
    expect(localStorage.getItem('focuslearn.token')).toBeNull()
  })

  it('drops a token the server no longer accepts', async () => {
    localStorage.setItem('focuslearn.token', 'expired')
    mockApi({ 'GET /api/me': () => ({ status: 401, body: { detail: 'not_signed_in' } }) })
    const { router } = renderAt('/')
    await waitFor(() => expect(router.state.location.pathname).toBe('/welcome'))
    expect(localStorage.getItem('focuslearn.token')).toBeNull()
  })
})

describe('Continue with Google (plan v3 step 3)', () => {
  it('signs in with Google when the server has a client ID, and asks new people to sign up first', async () => {
    let send: ((r: { credential: string }) => void) | undefined
    window.google = {
      accounts: {
        id: {
          initialize: (o: { callback: (r: { credential: string }) => void }) => (send = o.callback),
          renderButton: (el: HTMLElement) => (el.textContent = 'Continue with Google'),
        },
        oauth2: { initTokenClient: () => ({ requestAccessToken() {} }) },
      },
    } as unknown as typeof window.google
    let known = false
    const { calls } = mockApi({
      'GET /api/config': () => ({ status: 200, body: { google_client_id: 'cid.apps.googleusercontent.com' } }),
      'POST /api/auth/google': () => (known ? { status: 200, body: { token: 'g1', me: ME } } : { status: 404, body: { detail: 'no_account' } }),
      'GET /api/me': () => ({ status: 200, body: ME }),
    })
    const { router } = renderAt('/sign-in')
    expect(await screen.findByText('Continue with Google')).toBeInTheDocument()
    send!({ credential: 'google-id-token' })
    expect(await screen.findByRole('alert')).toHaveTextContent('no account for this Google email')
    known = true
    send!({ credential: 'google-id-token' })
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(calls.filter((c) => c.path === '/api/auth/google').at(-1)?.body).toEqual({ credential: 'google-id-token' })
    expect(localStorage.getItem('focuslearn.token')).toBe('g1')
    delete window.google
  })
})
