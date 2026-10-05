import { API_BASE } from '../config'

const TOKEN_KEY = 'focuslearn.token'

// Storage can be blocked (private mode); the app must still work, just without staying signed in.
export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function writeToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string) {
    super(messageFor(code, status))
    this.status = status
    this.code = code
  }
}

// Plain-word messages for the backend's error codes.
export function messageFor(code: string, status = 0): string {
  const messages: Record<string, string> = {
    under_18: 'under_18',
    email_taken: 'An account with this email already exists. Try signing in.',
    wrong_email_or_password: 'That email and password don’t match.',
    too_many_attempts: 'Too many tries. Wait a minute and try again.',
    not_signed_in: 'Please sign in again.',
    notice_not_accepted: 'Please read and accept the notice first.',
    invalid_date_of_birth: 'Please check your date of birth.',
    database_not_configured: 'The app is being set up. Please try again later.',
    network: 'Can’t reach the server. If you just opened the app, wait a few seconds and try again.',
    no_account: 'There’s no account for this Google email yet. Create one first: it takes a moment.',
    invalid_token: 'Google sign-in didn’t work. Try again.',
    google_not_configured: 'Google sign-in isn’t switched on yet. Use email for now.',
    google_denied: 'Google didn’t allow access to your YouTube subscriptions.',
    invite_not_found: 'This invite link doesn’t work any more. Ask your friend for a new one.',
    group_full: 'This group is full (50 members).',
    group_not_found: 'This group isn’t available. You may have left or been removed.',
    too_many_groups: 'You’re in 20 groups already. Leave one to join another.',
    not_allowed: 'Only the group owner can do that.',
    post_not_found: 'That post was deleted.',
    video_unknown: 'Notes work on videos opened from search or the feed. Find this video there first.',
    too_many_notes_today: 'You’ve started 15 new notes today. Try again tomorrow; notes others made still open.',
  }
  return messages[code] ?? (status >= 500 ? 'Something went wrong on our side. Please try again.' : 'Please check the form and try again.')
}

// The free server sleeps after 15 idle minutes and takes up to a minute to wake (also during a redeploy).
// Requests that are safe to repeat wait for it, with a "waking up" banner, instead of failing at once.
const WAKE_LIMIT_MS = 75_000
const SAFE_POSTS = ['/api/auth/login', '/api/auth/signup', '/api/search', '/api/notebook', '/api/study/open', '/api/study/comments', '/api/ai-notes']
let wakingCount = 0
function setWaking(on: boolean) {
  wakingCount = Math.max(0, wakingCount + (on ? 1 : -1))
  window.dispatchEvent(new CustomEvent('focuslearn:waking', { detail: wakingCount > 0 }))
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Fire-and-forget ping when the app opens, so the server is awake by the time she signs in.
export function wakeServer() {
  fetch(API_BASE + '/health').catch(() => {})
}

async function fetchWaiting(url: string, init: RequestInit, canRetry: boolean): Promise<Response> {
  const start = Date.now()
  let waiting = false
  try {
    for (let attempt = 0; ; attempt++) {
      try {
        const res = await fetch(url, init)
        if (!canRetry || ![502, 503, 504].includes(res.status) || Date.now() - start > WAKE_LIMIT_MS) return res
      } catch (e) {
        // A real network failure (server asleep or restarting) is a TypeError from fetch.
        if (!canRetry || !(e instanceof TypeError) || Date.now() - start > WAKE_LIMIT_MS) throw e
      }
      if (!waiting) {
        waiting = true
        setWaking(true)
      }
      await sleep(Math.min(2000 + attempt * 1500, 8000))
    }
  } finally {
    if (waiting) setWaking(false)
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = readToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const method = (init.method ?? 'GET').toUpperCase()
  const canRetry = method === 'GET' || (method === 'POST' && SAFE_POSTS.includes(path))
  let res: Response
  try {
    res = await fetchWaiting(API_BASE + path, { ...init, headers }, canRetry)
  } catch {
    throw new ApiError(0, 'network')
  }
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = typeof data?.detail === 'string' ? data.detail : 'error'
    throw new ApiError(res.status, detail)
  }
  return data as T
}
