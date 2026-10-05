import { Send } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import { LANGS, getNotesLang, setNotesLang, type NotesLang } from '../lib/aiNotes'
import { api } from '../lib/api'
import { listMutes, unmuteChannel } from '../lib/search'
import { useSession } from '../lib/session'
import { getTextSize, getTheme, setTextSize, setTheme, type TextSize, type Theme } from '../lib/theme'

// YouTube's own category groups (R3). Gaming, comedy and entertainment are hidden by default (plan v3).
const GROUPS: Array<[string, string, string]> = [
  ['gaming', 'Gaming', 'Video games and game streams'],
  ['comedy', 'Comedy', 'Stand-up, sketches and pranks'],
  ['entertainment', 'Entertainment and TV shows', 'Serials, reality shows, trailers'],
  ['music', 'Music', 'Songs, including motivational ones'],
  ['films', 'Films', 'Movies and animation'],
  ['news', 'News', 'News channels and politics'],
  ['vlogs', 'Travel and vlogs', 'Travel, daily-life vlogs'],
  ['sports', 'Sports', 'Matches and highlights'],
]

function Segmented<T extends string>({ label, value, options, onPick }: { label: string; value: T; options: Array<[T, string]>; onPick: (v: T) => void }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} className={value === v ? 'on' : ''} aria-pressed={value === v} onClick={() => onPick(v)}>
          {text}
        </button>
      ))}
    </div>
  )
}

function Appearance() {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const [size, setSize] = useState<TextSize>(getTextSize)
  const [lang, setLang] = useState<NotesLang>(getNotesLang)
  return (
    <div className="card settings-section">
      <h2>Look and reading</h2>
      <p className="help">Theme</p>
      <Segmented
        label="Theme"
        value={theme}
        options={[
          ['system', 'Same as phone'],
          ['light', 'Light'],
          ['dark', 'Night'],
        ]}
        onPick={(t) => {
          setTheme(t)
          setThemeState(t)
        }}
      />
      <p className="help">Text size</p>
      <Segmented
        label="Text size"
        value={size}
        options={[
          ['normal', 'Normal'],
          ['large', 'Large'],
          ['larger', 'Larger'],
        ]}
        onPick={(s) => {
          setTextSize(s)
          setSize(s)
        }}
      />
      <label className="help" htmlFor="notes-lang" style={{ display: 'block' }}>
        AI notes language
      </label>
      <select
        id="notes-lang"
        className="ai-lang"
        value={lang}
        onChange={(e) => {
          const l = e.target.value as NotesLang
          setNotesLang(l)
          setLang(l)
        }}
      >
        {LANGS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Hidden() {
  const { me, refresh } = useSession()
  const [hidden, setHidden] = useState<string[]>(me?.settings.hidden_groups ?? ['comedy', 'entertainment', 'gaming'])
  const [channels, setChannels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    listMutes()
      .then((m) => setChannels(m.filter((x) => x.kind === 'channel').map((x) => x.value)))
      .catch(() => setChannels([]))
  }, [])
  async function toggle(group: string) {
    const next = hidden.includes(group) ? hidden.filter((g) => g !== group) : [...hidden, group]
    setHidden(next)
    setError(null)
    try {
      await api('/api/me/settings', { method: 'POST', body: JSON.stringify({ hidden_groups: next }) })
      await refresh()
    } catch {
      setHidden(hidden)
      setError('Couldn’t save. Check your connection and try again.')
    }
  }
  return (
    <div className="card settings-section">
      <h2>What’s hidden</h2>
      <p className="help">
        Switched on = hidden from Home and Search. The type comes from YouTube’s own label for each video. Channels you
        follow always show.
      </p>
      <div className="group-toggles">
        {GROUPS.map(([id, name, hint]) => (
          <label key={id} className="switch-row">
            <span>
              {name}
              <span className="help">{hint}</span>
            </span>
            <input type="checkbox" role="switch" className="switch" checked={hidden.includes(id)} onChange={() => toggle(id)} />
          </label>
        ))}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p>
        Channels you chose not to see: <strong>{channels.length}</strong>{' '}
        {channels.length > 0 && (
          <button
            className="link"
            onClick={async () => {
              await Promise.all(channels.map(unmuteChannel))
              setChannels([])
            }}
          >
            Show them again
          </button>
        )}
      </p>
    </div>
  )
}

function Feedback() {
  const [text, setText] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  async function send(e: FormEvent) {
    e.preventDefault()
    if (text.trim().length < 3) return
    setState('sending')
    try {
      await api('/api/feedback', { method: 'POST', body: JSON.stringify({ text: text.trim(), page: '/settings' }) })
      setText('')
      setState('sent')
    } catch {
      setState('error')
    }
  }
  return (
    <form className="card settings-section feedback-form" onSubmit={send}>
      <h2>Send feedback</h2>
      <label className="help" htmlFor="feedback">
        What’s good, what’s broken, what’s missing? Your words go to the team; your email isn’t shown with them.
      </label>
      <textarea id="feedback" name="feedback" maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" disabled={state === 'sending' || text.trim().length < 3} style={{ marginTop: 8 }}>
        <Send size={16} aria-hidden="true" /> {state === 'sending' ? 'Sending…' : 'Send'}
      </button>
      {state === 'sent' && (
        <p className="notice-line" role="status">
          Thank you. We read every message.
        </p>
      )}
      {state === 'error' && (
        <p className="error" role="alert">
          Couldn’t send. Check your connection and try again.
        </p>
      )}
    </form>
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
      <h1 className="page-title">Settings</h1>
      <div className="settings-list">
        <div className="card settings-section">
          <h2>Account</h2>
          <p>Signed in as {me?.email}</p>
          <button className="secondary" onClick={() => signOut().then(() => navigate('/welcome'))}>
            Sign out
          </button>
        </div>
        <Appearance />
        <Hidden />
        <Feedback />
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
            {APP_NAME} shows YouTube videos through YouTube’s own player. It’s not made by YouTube or Google. AI notes
            are made by Google’s Gemini from the video. We try to hide distracting content, but no filter is perfect.{' '}
            <Link to="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
