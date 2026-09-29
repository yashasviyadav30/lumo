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
    network: 'Can’t reach the server. Check your connection and try again.',
  }
  return messages[code] ?? (status >= 500 ? 'Something went wrong on our side. Please try again.' : 'Please check the form and try again.')
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = readToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let res: Response
  try {
    res = await fetch(API_BASE + path, { ...init, headers })
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
