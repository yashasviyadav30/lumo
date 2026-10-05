import { useEffect, useRef, useState } from 'react'
import { googleClientId, loadGis } from '../lib/google'

// Google's own "Continue with Google" button. Hidden when the server has no Google client ID.
export default function GoogleButton({ onCredential, after = 'or use email' }: { onCredential: (credential: string) => void; after?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const callback = useRef(onCredential)
  const [clientId, setClientId] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    callback.current = onCredential
  })
  useEffect(() => {
    googleClientId().then(setClientId)
  }, [])
  useEffect(() => {
    if (!clientId) return
    let live = true
    loadGis()
      .then((g) => {
        if (!live || !box.current) return
        g.accounts.id.initialize({ client_id: clientId, callback: (r) => callback.current(r.credential) })
        g.accounts.id.renderButton(box.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: 300 })
      })
      .catch(() => setFailed(true))
    return () => {
      live = false
    }
  }, [clientId])

  if (!clientId) return null
  return (
    <div className="google-block">
      <div ref={box} className="google-btn" />
      {failed && <p className="help">Couldn’t load Google sign-in. Use email below, or try again later.</p>}
      <p className="or-line">
        <span>{after}</span>
      </p>
    </div>
  )
}
