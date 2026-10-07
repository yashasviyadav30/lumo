import { useEffect, useState } from 'react'

// Two taps for anything that can't be undone: the first turns the button into "Tap again to delete" for a few
// seconds, the second does it. No browser pop-up, and a stray tap does nothing.
export function useConfirmTap(ms = 3000) {
  const [armed, setArmed] = useState<string | null>(null)
  useEffect(() => {
    if (!armed) return
    const t = window.setTimeout(() => setArmed(null), ms)
    return () => window.clearTimeout(t)
  }, [armed, ms])
  const tap = (key: string, action: () => void) => {
    if (armed === key) {
      setArmed(null)
      action()
    } else setArmed(key)
  }
  return { armed, tap }
}
