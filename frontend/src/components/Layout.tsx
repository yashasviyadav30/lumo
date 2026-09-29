import { NavLink, Outlet } from 'react-router'
import { APP_NAME } from '../config'
import Logo from './Logo'

const tabs = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Search', end: false },
  { to: '/library', label: 'Library', end: false },
  { to: '/settings', label: 'Settings', end: false },
]

export default function Layout() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <Logo size={28} />
        <span className="brand">{APP_NAME}</span>
      </header>
      <main id="main" className="content" tabIndex={-1}>
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className="tab">
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
