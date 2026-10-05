import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { vi } from 'vitest'
import { routes } from '../routes'

export const ME = {
  email: 'asha@example.com',
  created_at: '2026-09-29T10:00:00Z',
  settings: { shorts_enabled: false, shorts_daily_limit_min: null, search_language: 'en' },
}

type Handler = (init: RequestInit & { url: string }) => { status: number; body?: unknown }

// Fake backend: maps "METHOD /path" to a handler. Unknown calls fail the test loudly.
export function mockApi(handlers: Record<string, Handler>) {
  const calls: Array<{ method: string; path: string; body: unknown }> = []
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = String(input)
    const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
    const method = (init.method ?? 'GET').toUpperCase()
    calls.push({ method, path, body: init.body ? JSON.parse(String(init.body)) : undefined })
    const handler = handlers[`${method} ${path}`]
    if (!handler) throw new Error(`Unexpected API call: ${method} ${path}`)
    const { status, body } = handler({ ...init, url })
    return new Response(status === 204 ? null : JSON.stringify(body === undefined ? {} : body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return { calls, fetchMock }
}

export function signInForTest(extra: Record<string, Handler> = {}) {
  localStorage.setItem('focuslearn.token', 'test-token')
  return mockApi({
    'GET /api/me': () => ({ status: 200, body: ME }),
    'POST /api/ai-notes': () => ({ status: 200, body: { status: 'none' } }),
    ...extra,
  })
}

// Renders the real app routes at a given path.
export function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return { router, ...render(<RouterProvider router={router} />) }
}
