import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/sora'
import './index.css'
import { applyTheme } from './lib/theme'
import { routes } from './routes'

applyTheme()

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
