import { useEffect, useRef } from 'react'

// While something covers the page (a full-screen map or notepad, a detail sheet, the guide), the phone's Back
// button closes it, as people expect, instead of leaving the page. It adds one history entry for the same address
// while open; closing it another way (✕, Esc) takes that entry back out.
export function useBackToClose(open: boolean, close: () => void) {
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })
  useEffect(() => {
    if (!open) return
    const mark = `lumo-${Math.random().toString(36).slice(2)}`
    window.history.pushState({ ...window.history.state, lumoLayer: mark }, '')
    // Only the top layer closes: Back from a sheet over the full-screen map lands on the map's own entry.
    const onPop = () => window.history.state?.lumoLayer !== mark && closeRef.current()
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      if (window.history.state?.lumoLayer === mark) window.history.back() // closed by ✕ or Esc: drop our entry
    }
  }, [open])
}
