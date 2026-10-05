import { Outlet, type RouteObject } from 'react-router'
import Layout from './components/Layout'
import PublicLayout from './components/PublicLayout'
import RequireAccount from './components/RequireAccount'
import { SessionProvider } from './lib/session'
import Home from './pages/Home'
import Library from './pages/Library'
import NotFound from './pages/NotFound'
import NotYet from './pages/NotYet'
import Personal from './pages/Personal'
import Privacy from './pages/Privacy'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Shorts from './pages/Shorts'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Watch from './pages/Watch'
import Welcome from './pages/Welcome'

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
