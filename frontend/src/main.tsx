import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IconContext } from './components/icons'
import { createBrowserRouter, RouterProvider } from 'react-router'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/bricolage-grotesque'
import './index.css'
import './styles/v3.css'
import './styles/brand.css'
import './styles/pastel.css'
import { wakeServer } from './lib/api'
import { applyTextSize, applyTheme } from './lib/theme'
import { preloadPages, routes } from './routes'
import { registerSW } from 'virtual:pwa-register'

applyTheme()
applyTextSize()
wakeServer()

// New versions: check whenever the app comes back to the screen, and switch to them at once (autoUpdate
// reloads the page). Without this, a phone kept the old app until it was fully closed and opened twice.
registerSW({
  immediate: true,
  onRegisteredSW(_url, reg) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg?.update().catch(() => {})
    })
  },
})

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IconContext.Provider value={{ weight: 'duotone' }}>
      <RouterProvider router={router} />
    </IconContext.Provider>
  </StrictMode>,
)
preloadPages()
