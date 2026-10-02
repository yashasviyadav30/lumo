// Appearance: follow the phone (default), light, or dark. A per-device choice, so localStorage is enough.
export type Theme = 'dark' | 'light' | 'system'
const KEY = 'focuslearn.theme'

export function getTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(t: Theme = getTheme()) {
  document.documentElement.dataset.theme = t
  const light = t === 'light' || (t === 'system' && matchMedia('(prefers-color-scheme: light)').matches)
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.removeAttribute('media')
    m.setAttribute('content', light ? '#f8f8f5' : '#10141f')
  })
}

export function setTheme(t: Theme) {
  try {
    localStorage.setItem(KEY, t)
  } catch {
    // private mode: the choice lasts for this visit only
  }
  applyTheme(t)
}
