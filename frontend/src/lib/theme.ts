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
    m.setAttribute('content', light ? '#fbf7ef' : '#121116')
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

// Text size: a per-device choice for long reading sessions (Settings).
export type TextSize = 'normal' | 'large' | 'larger'
const SIZE_KEY = 'focuslearn.textSize'

export function getTextSize(): TextSize {
  try {
    const v = localStorage.getItem(SIZE_KEY)
    return v === 'large' || v === 'larger' ? v : 'normal'
  } catch {
    return 'normal'
  }
}

export function applyTextSize(size: TextSize = getTextSize()) {
  document.documentElement.dataset.textSize = size
}

export function setTextSize(size: TextSize) {
  try {
    localStorage.setItem(SIZE_KEY, size)
  } catch {
    // private mode: lasts for this visit
  }
  applyTextSize(size)
}

export function nextTheme(t: Theme): Theme {
  return t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'
}
