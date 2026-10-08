import { useEffect, useRef } from 'react'

// While something covers the page (a full-screen map or notepad, a detail card, a menu, the guide), the phone's
// Back button closes it, as people expect, instead of leaving the page. It adds one history entry for the same
// address while open; closing it another way (✕, Esc, a tap outside) takes that entry back out.
//
// When a layer closes while another layer's entry sits above it (Play in the map's sheet closes the sheet and full
// screen together), its entry can't be removed from the middle, so it is marked stale and skipped the next time Back
// lands on it: no dead Back presses.
const stale = new Set<string>()
let watching = false
function skipStaleEntries() {
  if (watching) return
  watching = true
  window.addEventListener('popstate', () => {
    const mark = window.history.state?.thryweLayer
    if (mark && stale.has(mark)) {
      stale.delete(mark)
      window.history.back()
    }
  })
}

export function useBackToClose(open: boolean, close: () => void) {
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })
  useEffect(() => {
    if (!open) return
    skipStaleEntries()
    const mark = `thrywe-${Math.random().toString(36).slice(2)}`
    window.history.pushState({ ...window.history.state, thryweLayer: mark }, '')
    // Only the top layer closes: Back from a card over the full-screen map lands on the map's own entry.
    const onPop = () => window.history.state?.thryweLayer !== mark && !stale.has(mark) && closeRef.current()
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      if (window.history.state?.thryweLayer === mark) window.history.back() // closed by ✕ or Esc: drop our entry
      else stale.add(mark) // not on top any more: skip it when Back reaches it
    }
  }, [open])
}
