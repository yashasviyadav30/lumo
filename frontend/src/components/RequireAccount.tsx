import { Navigate, Outlet, useLocation } from 'react-router'
import { rememberJoin } from '../lib/groups'
import { useSession } from '../lib/session'

// Everything except the welcome, sign-up, sign-in and privacy pages needs an account (18+, R10).
export default function RequireAccount() {
  const { me, loading } = useSession()
  const { pathname } = useLocation()
  if (loading) return <p aria-busy="true">Loading…</p>
  if (!me) {
    const invite = pathname.match(/^\/join\/([A-Za-z0-9_-]{8,32})$/)
    if (invite) rememberJoin(invite[1]) // opened an invite while signed out: join right after signing in
    return <Navigate to="/welcome" replace />
  }
  return <Outlet />
}
