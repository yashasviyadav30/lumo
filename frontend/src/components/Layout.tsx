import { ArrowLeft, House, Library, Moon, NotebookPen, Search, Settings, SquarePlay, Sun, SunMoon } from 'lucide-react'
import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import { getTheme, nextTheme, setTheme, type Theme } from '../lib/theme'
import FirstGuide from './FirstGuide'
import Logo from './Logo'
import WakingBanner from './WakingBanner'

const tabs = [
  { to: '/', label: 'Home', end: true, Icon: House },
  { to: '/shorts', label: 'Shorts', end: false, Icon: SquarePlay },
  { to: '/library', label: 'Library', end: false, Icon: Library },
  { to: '/personal', label: 'My notes', end: false, Icon: NotebookPen },
]
const TAB_PATHS = tabs.map((t) => t.to)
const THEME_LABEL: Record<Theme, string> = { system: 'Same as phone', light: 'Light', dark: 'Night' }

// Quick theme switch in the top bar (plan v3): Same as phone → Light → Night.
function ThemeButton() {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : SunMoon
  return (
    <button
      className="icon-btn"
      aria-label={`Theme: ${THEME_LABEL[theme]}. Change theme`}
      title={`Theme: ${THEME_LABEL[theme]}`}
      onClick={() => {
        const t = nextTheme(theme)
        setTheme(t)
        setThemeState(t)
      }}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  )
}

// Laptop: a YouTube-style search box in the top bar. The text goes to the Search page in memory, never the URL (R11).
function TopSearch() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate('/search', { state: { q: q.trim() } })
    setQ('')
  }
  return (
    <form className="top-search" role="search" onSubmit={submit}>
      <label htmlFor="top-q" className="visually-hidden">
        Search
      </label>
      <input id="top-q" type="search" name="q" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <button type="submit" aria-label="Submit search">
        <Search size={19} aria-hidden="true" />
      </button>
    </form>
  )
}

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
          <Logo size={28} />
          <span className="brand">{APP_NAME}</span>
        </Link>
        <TopSearch />
        <div className="top-actions">
          <Link to="/search" className="icon-btn top-search-link" aria-label="Search">
            <Search size={21} aria-hidden="true" />
          </Link>
          <ThemeButton />
          <Link to="/settings" className="icon-btn" aria-label="Settings">
            <Settings size={20} aria-hidden="true" />
          </Link>
        </div>
      </header>
      <WakingBanner />
      <main id="main" className="content" tabIndex={-1}>
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main" style={{ '--tabs': tabs.length } as CSSProperties}>
        {tabs.map(({ to, label, end, Icon }) => (
          <NavLink key={to} to={to} end={end} className="tab">
            <Icon size={22} strokeWidth={2} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <FirstGuide />
    </div>
  )
}
