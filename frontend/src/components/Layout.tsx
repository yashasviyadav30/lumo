import { ArrowLeft, House, Library, NotebookPen, Search } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import Logo from './Logo'

const tabs = [
  { to: '/', label: 'Home', end: true, Icon: House },
  { to: '/search', label: 'Search', end: false, Icon: Search },
  { to: '/library', label: 'Library', end: false, Icon: Library },
  { to: '/personal', label: 'My notes', end: false, Icon: NotebookPen },
]
const TAB_PATHS = ['/', '/search', '/library', '/personal']

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const subPage = !TAB_PATHS.includes(pathname)
  const watching = pathname.startsWith('/watch/')
  return (
    <div className={`app signed-in${watching ? ' watching' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        {subPage && (
          <button
            className="back-btn"
            aria-label="Back"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          >
            <ArrowLeft size={22} aria-hidden="true" />
          </button>
        )}
        <Link to="/" className="brand-link" aria-label={`${APP_NAME} home`}>
          <Logo size={30} />
          <span className="brand">{APP_NAME}</span>
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
