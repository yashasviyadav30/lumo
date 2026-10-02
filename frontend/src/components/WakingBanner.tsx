import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'

// Shown while the free server wakes up (first visit after a quiet spell). Disappears by itself.
export default function WakingBanner() {
  const [waking, setWaking] = useState(false)
  useEffect(() => {
    const on = (e: Event) => setWaking((e as CustomEvent<boolean>).detail)
    window.addEventListener('focuslearn:waking', on)
    return () => window.removeEventListener('focuslearn:waking', on)
  }, [])
  if (!waking) return null
  return (
    <p className="waking" role="status">
      <Loader size={16} className="spin" aria-hidden="true" /> Waking up the server… this can take up to a minute.
    </p>
  )
}
