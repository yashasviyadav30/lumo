// Appearance: dark (default), light, or follow the phone. A per-device choice, so localStorage is enough.
export type Theme = 'dark' | 'light' | 'system'
const KEY = 'focuslearn.theme'

export function getTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'system' ? t : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(t: Theme = getTheme()) {
  document.documentElement.dataset.theme = t
  const light = t === 'light' || (t === 'system' && matchMedia('(prefers-color-scheme: light)').matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#fafaf7' : '#12141a')
}

export function setTheme(t: Theme) {
  try {
    localStorage.setItem(KEY, t)
  } catch {
    // private mode: the choice lasts for this visit only
  }
  applyTheme(t)
}
