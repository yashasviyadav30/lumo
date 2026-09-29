import { Navigate, Outlet } from 'react-router'
import { useSession } from '../lib/session'

// Everything except the welcome, sign-up, sign-in and privacy pages needs an account (18+, R10).
export default function RequireAccount() {
  const { me, loading } = useSession()
  if (loading) return <p aria-busy="true">Loading…</p>
  if (!me) return <Navigate to="/welcome" replace />
  return <Outlet />
}
