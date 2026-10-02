import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import { api } from '../lib/api'
import { listMutes, unmuteChannel } from '../lib/search'
import { useSession } from '../lib/session'
import { getTheme, setTheme, type Theme } from '../lib/theme'

const HIDE_LIST = [
  'Songs (Music)',
  'Movies, trailers and animation',
  'Entertainment shows and comedy',
  'News & Politics',
  'Travel vlogs',
  'Gaming',
]

// What's hidden, in plain words, and the switches that are hers to change.
function Filters({ shortsOn }: { shortsOn: boolean }) {
  const [shorts, setShorts] = useState(shortsOn)
  const [hiddenChannels, setHiddenChannels] = useState<string[]>([])

  useEffect(() => {
    listMutes()
      .then((m) => setHiddenChannels(m.filter((x) => x.kind === 'channel').map((x) => x.value)))
      .catch(() => setHiddenChannels([]))
  }, [])

  async function toggleShorts() {
    const next = !shorts
    setShorts(next)
    await api('/api/me/settings', { method: 'POST', body: JSON.stringify({ shorts_enabled: next }) }).catch(() =>
      setShorts(!next),
    )
  }

  async function unhideAll() {
    await Promise.all(hiddenChannels.map(unmuteChannel))
    setHiddenChannels([])
  }

  return (
    <div className="card settings-section">
      <h2>What’s hidden</h2>
      <p className="help">
        Everything else on YouTube shows, including podcasts and interviews. The type comes from YouTube’s own label for
        each video.
      </p>
      <div className="chips">
        {HIDE_LIST.map((h) => (
          <span key={h} className="badge">
            {h}
          </span>
        ))}
      </div>
      <label className="switch-row">
        <span>
          Show Shorts
          <span className="help">Short vertical videos. Off keeps the feed calm.</span>
        </span>
        <input type="checkbox" role="switch" className="switch" checked={shorts} onChange={toggleShorts} />
      </label>
      <p>
        Channels you hid: <strong>{hiddenChannels.length}</strong>{' '}
        {hiddenChannels.length > 0 && (
          <button className="link" onClick={unhideAll}>
            Unhide all
          </button>
        )}
      </p>
    </div>
  )
}

function Appearance() {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const pick = (t: Theme) => {
    setThemeState(t)
    setTheme(t)
  }
  const options: Array<[Theme, string]> = [
    ['dark', 'Dark'],
    ['light', 'Light'],
    ['system', 'Same as phone'],
  ]
  return (
    <div className="card settings-section">
      <h2>Appearance</h2>
      <div className="segmented" role="group" aria-label="Theme">
        {options.map(([t, label]) => (
          <button key={t} className={theme === t ? 'on' : ''} aria-pressed={theme === t} onClick={() => pick(t)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Settings() {
  const { me, signOut, deleteAccount } = useSession()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onDelete() {
    setError(null)
    try {
      const note = await deleteAccount()
      navigate('/welcome', { replace: true, state: { note } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t delete. Please try again.')
    }
  }

  return (
    <section>
      <div className="page-head">
        <h1>Settings</h1>
      </div>

      <div className="card settings-section">
        <h2>Account</h2>
        <p>Signed in as {me?.email}</p>
        <button className="secondary" onClick={() => signOut().then(() => navigate('/welcome'))}>
          Sign out
        </button>
      </div>

      <Appearance />
      <Filters shortsOn={!!me?.settings.shorts_enabled} />

      <div className="card settings-section">
        <h2>Delete my data</h2>
        <p>
          This deletes your account and everything {APP_NAME} stored for it, straight away. It doesn’t delete anything
          on YouTube.
        </p>
        {!confirming ? (
          <button className="danger" onClick={() => setConfirming(true)}>
            Delete my data
          </button>
        ) : (
          <div className="confirm" role="group" aria-label="Confirm deletion">
            <p>
              <strong>Are you sure?</strong> This can’t be undone.
            </p>
            <button className="danger" onClick={onDelete}>
              Yes, delete everything
            </button>{' '}
            <button className="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="card settings-section">
        <h2>About</h2>
        <p>
          {APP_NAME} shows YouTube videos through YouTube’s own player. It’s not made by YouTube or Google. We try to
          hide harmful content, but no filter is perfect. <Link to="/privacy">Privacy</Link>
        </p>
      </div>
    </section>
  )
}
