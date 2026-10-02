import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, ApiError, readToken, writeToken } from './api'

export type Me = {
  email: string
  created_at: string
  settings: { shorts_enabled: boolean; shorts_daily_limit_min: number | null; search_language: string }
}

type SignUpInput = { email: string; password: string; date_of_birth: string; accepted_notice: boolean }

type SessionValue = {
  me: Me | null
  loading: boolean
  farewell: string | null
  signUp(input: SignUpInput): Promise<void>
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  deleteAccount(): Promise<string>
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  // The "your data is deleted" message. Kept here because clearing the account redirects to /welcome at once.
  const [farewell, setFarewell] = useState<string | null>(null)
  const [loading, setLoading] = useState(() => readToken() !== null)

  useEffect(() => {
    if (!readToken()) return
    api<Me>('/api/me')
      .then(setMe)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) writeToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const r = await api<{ token: string; me: Me }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) })
    writeToken(r.token)
    setMe(r.me)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const r = await api<{ token: string; me: Me }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    writeToken(r.token)
    setMe(r.me)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } finally {
      writeToken(null)
      setMe(null)
    }
  }, [])

  const deleteAccount = useCallback(async () => {
    const r = await api<{ note: string }>('/api/me', { method: 'DELETE' })
    writeToken(null)
    setFarewell(r.note)
    setMe(null)
    return r.note
  }, [])

  const value = useMemo(
    () => ({ me, loading, farewell, signUp, signIn, signOut, deleteAccount }),
    [me, loading, farewell, signUp, signIn, signOut, deleteAccount],
  )
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used inside SessionProvider')
  return value
}
