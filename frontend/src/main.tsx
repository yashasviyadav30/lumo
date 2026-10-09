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


// The installed app’s opening screen (index.html): about 1.6 s from launch, and never cut before the letters land.
const splash = document.getElementById('splash')
if (splash && getComputedStyle(splash).display !== 'none') {
  const bar = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media*="dark"])')
  const keep = bar?.content
  if (bar) bar.content = '#4b3fbf' // the status bar matches the violet while it shows
  window.setTimeout(() => {
    splash.classList.add('done')
    if (bar && keep) bar.content = keep
    window.setTimeout(() => splash.remove(), 400)
  }, Math.max(1100, 1600 - performance.now()))
} else splash?.remove()

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
