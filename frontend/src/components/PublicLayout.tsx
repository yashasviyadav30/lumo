import { Link, Outlet, useLocation } from 'react-router'
import { APP_NAME } from '../config'
import Logo from './Logo'
import WakingBanner from './WakingBanner'

export default function PublicLayout() {
  const landing = useLocation().pathname === '/welcome'
  return (
    <div className={`app${landing ? ' landing-page' : ''}`}>
      <header className="topbar">
        <Link to="/welcome" className="brand-link">
          <Logo size={32} />
          <span className="brand">{APP_NAME}</span>
        </Link>
        {landing && (
          <nav className="lp-nav" aria-label="Account">
            <Link to="/sign-in">Sign in</Link>
            <Link to="/sign-up" className="button small">
              Start free
            </Link>
          </nav>
        )}
      </header>
      <WakingBanner />
      <main id="main" className="content public">
        <Outlet />
      </main>
    </div>
  )
}
