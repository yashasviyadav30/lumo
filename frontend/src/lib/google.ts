import { api } from './api'

// Google sign-in and YouTube subscription import (plan v3, step 3), through Google Identity Services.
type TokenResponse = { access_token?: string; error?: string }
type Gis = {
  accounts: {
    id: {
      initialize(o: { client_id: string; callback: (r: { credential: string }) => void }): void
      renderButton(el: HTMLElement, o: Record<string, unknown>): void
    }
    oauth2: {
      initTokenClient(o: {
        client_id: string
        scope: string
        callback: (r: TokenResponse) => void
        error_callback?: (e: { type: string }) => void
      }): { requestAccessToken(): void }
    }
  }
}
declare global {
  interface Window {
    google?: Gis
  }
}

let config: Promise<string | null> | null = null
// The server says whether Google is set up; without a client ID the Google buttons stay hidden.
export function googleClientId(): Promise<string | null> {
  config ??= api<{ google_client_id: string | null }>('/api/config')
    .then((c) => c.google_client_id)
    .catch(() => {
      config = null
      return null
    })
  return config
}

let script: Promise<Gis> | null = null
export function loadGis(): Promise<Gis> {
  if (window.google) return Promise.resolve(window.google)
  script ??= new Promise<Gis>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => (window.google ? resolve(window.google) : reject(new Error('google_script')))
    s.onerror = () => {
      script = null
      reject(new Error('Couldn’t load Google sign-in. Check your connection.'))
    }
    document.head.appendChild(s)
  })
  return script
}

// Asks them for read-only YouTube access once; the token goes to our server for one import and is never kept.
export async function youtubeAccessToken(clientId: string): Promise<string> {
  const g = await loadGis()
  return new Promise((resolve, reject) => {
    g.accounts.oauth2
      .initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        callback: (r) => (r.access_token ? resolve(r.access_token) : reject(new Error('Google didn’t give access.'))),
        error_callback: () => reject(new Error('The Google window was closed.')),
      })
      .requestAccessToken()
  })
}

export const importSubscriptions = (access_token: string) =>
  api<{ imported: number; subscriptions: number }>('/api/follows/import', { method: 'POST', body: JSON.stringify({ access_token }) })
