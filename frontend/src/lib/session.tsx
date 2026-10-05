import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, ApiError, readToken, writeToken } from './api'

export type Me = {
  email: string
  created_at: string
  settings: {
    shorts_enabled: boolean
    shorts_daily_limit_min: number | null
    search_language: string
    hidden_groups: string[]
  }
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
  refresh(): Promise<void>
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
    let r: { token: string; me: Me }
    try {
      r = await api<{ token: string; me: Me }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) })
    } catch (e) {
      // While the server wakes, sign-up is retried; if the first try did create the account, the retry
      // says "email taken". Same email and password: just sign in. Otherwise show the real error.
      if (!(e instanceof ApiError) || e.code !== 'email_taken') throw e
      try {
        r = await api<{ token: string; me: Me }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: input.email, password: input.password }),
        })
      } catch {
        throw e
      }
    }
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

  const refresh = useCallback(async () => {
    setMe(await api<Me>('/api/me'))
  }, [])

  const value = useMemo(
    () => ({ me, loading, farewell, signUp, signIn, signOut, deleteAccount, refresh }),
    [me, loading, farewell, signUp, signIn, signOut, deleteAccount, refresh],
  )
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used inside SessionProvider')
  return value
}
