import { Link, Outlet } from 'react-router'
import { APP_NAME } from '../config'
import Logo from './Logo'

export default function PublicLayout() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/welcome" className="brand-link">
          <Logo size={32} />
          <span className="brand">{APP_NAME}</span>
        </Link>
      </header>
      <main id="main" className="content public">
        <Outlet />
      </main>
    </div>
  )
}
