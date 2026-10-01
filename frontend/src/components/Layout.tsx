import { House, Library, Search, User } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'
import { APP_NAME } from '../config'
import { useSession } from '../lib/session'
import Logo from './Logo'

const tabs = [
  { to: '/', label: 'Home', end: true, Icon: House },
  { to: '/search', label: 'Search', end: false, Icon: Search },
  { to: '/library', label: 'Library', end: false, Icon: Library },
  { to: '/personal', label: 'Personal', end: false, Icon: User },
]

export default function Layout() {
  const { me } = useSession()
  return (
    <div className="app signed-in">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <Link to="/" className="brand-link" aria-label={`${APP_NAME} home`}>
          <Logo size={32} />
          <span className="brand">{APP_NAME}</span>
        </Link>
        <span className="spacer" />
        <Link to="/personal" className="avatar" aria-label="Your space" tabIndex={-1}>
          {me?.email?.[0] ?? '·'}
        </Link>
      </header>
      <main id="main" className="content" tabIndex={-1}>
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">
        {tabs.map(({ to, label, end, Icon }) => (
          <NavLink key={to} to={to} end={end} className="tab">
            <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
