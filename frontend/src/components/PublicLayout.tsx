import { Link, Outlet } from 'react-router'
import { APP_NAME } from '../config'
import Logo from './Logo'
import WakingBanner from './WakingBanner'

export default function PublicLayout() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/welcome" className="brand-link">
          <Logo size={32} />
          <span className="brand">{APP_NAME}</span>
        </Link>
      </header>
      <WakingBanner />
      <main id="main" className="content public">
        <Outlet />
      </main>
    </div>
  )
}
