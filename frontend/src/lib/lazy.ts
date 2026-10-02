import { lazy, type ComponentType } from 'react'

const KEY = 'focuslearn.reloaded-for-chunk'

// Like React.lazy, but if the piece can't be downloaded (usually because a new version was deployed while
// the app was open, so the old file name is gone), reload the page once to pick up the new version.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- same constraint as React.lazy
export function lazyWithReload<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await load()
      sessionStorage.removeItem(KEY)
      return mod
    } catch (e) {
      let reloaded = false
      try {
        reloaded = sessionStorage.getItem(KEY) === '1'
        sessionStorage.setItem(KEY, '1')
      } catch {
        reloaded = true // no storage: don't risk a reload loop
      }
      if (!reloaded) {
        window.location.reload()
        return new Promise<never>(() => {}) // the page is reloading
      }
      throw e
    }
  })
}
