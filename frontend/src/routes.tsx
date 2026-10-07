import { Navigate, Outlet, type RouteObject } from 'react-router'
import Layout from './components/Layout'
import PublicLayout from './components/PublicLayout'
import RequireAccount from './components/RequireAccount'
import { lazyWithReload } from './lib/lazy'
import { SessionProvider } from './lib/session'
import Home from './pages/Home'
import Welcome from './pages/Welcome'

// Home and the welcome page load at once; every other screen downloads the first time it opens.
const pages = {
  Group: () => import('./pages/Group'),
  Groups: () => import('./pages/Groups'),
  Join: () => import('./pages/Join'),
  Library: () => import('./pages/Library'),
  NotFound: () => import('./pages/NotFound'),
  NotYet: () => import('./pages/NotYet'),
  Personal: () => import('./pages/Personal'),
  Privacy: () => import('./pages/Privacy'),
  Search: () => import('./pages/Search'),
  Settings: () => import('./pages/Settings'),
  Shorts: () => import('./pages/Shorts'),
  SignIn: () => import('./pages/SignIn'),
  SignUp: () => import('./pages/SignUp'),
  Watch: () => import('./pages/Watch'),
}
const Group = lazyWithReload(pages.Group)
const Groups = lazyWithReload(pages.Groups)
const Join = lazyWithReload(pages.Join)
const Library = lazyWithReload(pages.Library)
const NotFound = lazyWithReload(pages.NotFound)
const NotYet = lazyWithReload(pages.NotYet)
const Personal = lazyWithReload(pages.Personal)
const Privacy = lazyWithReload(pages.Privacy)
const Search = lazyWithReload(pages.Search)
const Settings = lazyWithReload(pages.Settings)
const Shorts = lazyWithReload(pages.Shorts)
const SignIn = lazyWithReload(pages.SignIn)
const SignUp = lazyWithReload(pages.SignUp)
const Watch = lazyWithReload(pages.Watch)

// Once the first screen is up and the phone is idle, fetch the other screens too, so later taps open at once.
export function preloadPages() {
  const run = () => Object.values(pages).forEach((load) => load().catch(() => undefined))
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}

export const routes: RouteObject[] = [
  {
    element: (
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    ),
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: 'welcome', element: <Welcome /> },
          { path: 'sign-up', element: <SignUp /> },
          { path: 'sign-in', element: <SignIn /> },
          { path: 'not-yet', element: <NotYet /> },
          { path: 'privacy', element: <Privacy /> },
          // Spellings people type by hand
          { path: 'signin', element: <Navigate to="/sign-in" replace /> },
          { path: 'login', element: <Navigate to="/sign-in" replace /> },
          { path: 'signup', element: <Navigate to="/sign-up" replace /> },
        ],
      },
      {
        element: <RequireAccount />,
        children: [
          {
            path: '/',
            element: <Layout />,
            children: [
              { index: true, element: <Home /> },
              { path: 'search', element: <Search /> },
              { path: 'library', element: <Library /> },
              { path: 'personal', element: <Personal /> },
              { path: 'shorts', element: <Shorts /> },
              { path: 'groups', element: <Groups /> },
              { path: 'groups/:groupId', element: <Group /> },
              { path: 'join/:code', element: <Join /> },
              { path: 'settings', element: <Settings /> },
              { path: 'watch/:videoId', element: <Watch /> },
              { path: '*', element: <NotFound /> },
            ],
          },
        ],
      },
    ],
  },
]
