import type { RouteObject } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Library from './pages/Library'
import NotFound from './pages/NotFound'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Watch from './pages/Watch'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'library', element: <Library /> },
      { path: 'settings', element: <Settings /> },
      { path: 'watch/:videoId', element: <Watch /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
