import { SquarePlay } from './icons'
import { useEffect, useState } from 'react'
import { googleClientId, importSubscriptions, youtubeAccessToken } from '../lib/google'

// "Import my YouTube subscriptions": their real creators on day one (plan v3). Read-only, one time.
export default function ImportSubscriptions({ onDone }: { onDone?: () => void }) {
  const [clientId, setClientId] = useState<string | null>(null)
  const [state, setState] = useState<{ busy: boolean; msg: string | null; error: boolean }>({ busy: false, msg: null, error: false })
  useEffect(() => {
    googleClientId().then(setClientId)
  }, [])
  if (!clientId) return null

  async function run() {
    setState({ busy: true, msg: null, error: false })
    try {
      const r = await importSubscriptions(await youtubeAccessToken(clientId!))
      setState({
        busy: false,
        error: false,
        msg:
          r.subscriptions === 0
            ? 'No YouTube subscriptions found on that Google account.'
            : `Now following ${r.imported} new channel${r.imported === 1 ? '' : 's'} from your ${r.subscriptions} YouTube subscriptions. Unfollow any of them from the ⋮ menu.`,
      })
      onDone?.()
    } catch (e) {
      setState({ busy: false, error: true, msg: e instanceof Error ? e.message : 'Couldn’t import. Try again.' })
    }
  }
  return (
    <div className="import-subs">
      <button className="secondary" onClick={run} disabled={state.busy}>
        <SquarePlay size={18} aria-hidden="true" /> {state.busy ? 'Importing…' : 'Import my YouTube subscriptions'}
      </button>
      {state.msg && (
        <p className={state.error ? 'error' : 'notice-line'} role={state.error ? 'alert' : 'status'}>
          {state.msg}
        </p>
      )}
    </div>
  )
}
