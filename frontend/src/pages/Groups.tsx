import { Plus, UsersRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { createGroup, keepName, lastName, myGroups, relTime, type GroupSummary } from '../lib/groups'

function CreateForm({ onCancel }: { onCancel?: () => void }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [me, setMe] = useState(lastName)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const g = await createGroup(name.trim(), me.trim())
      keepName(me.trim())
      navigate(`/groups/${g.id}`, { state: { justCreated: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t create the group.')
      setBusy(false)
    }
  }
  return (
    <form className="start-card" onSubmit={submit}>
      <h2>New study group</h2>
      <label htmlFor="g-name">Group name</label>
      <input id="g-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CA Inter batch, Physics with Riya…" maxLength={80} autoComplete="off" />
      <label htmlFor="g-me">Your name in this group</label>
      <input id="g-me" className="field-input" value={me} onChange={(e) => setMe(e.target.value)} maxLength={40} autoComplete="nickname" />
      <p className="help">Members see this name, never your email.</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="inline-form">
        <button type="submit" disabled={busy || name.trim().length < 2 || !me.trim()}>
          {busy ? 'Creating…' : 'Create group'}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default function Groups() {
  const [data, setData] = useState<GroupSummary[] | null>(null)
  const [error, setError] = useState(false)
  const [creating, setCreating] = useState(false)
  useEffect(() => {
    myGroups()
      .then((r) => setData(r.groups))
      .catch(() => setError(true))
  }, [])

  return (
    <section>
      <div className="title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1 className="page-title">Groups</h1>
        {data && data.length > 0 && !creating && (
          <button className="small" onClick={() => setCreating(true)}>
            <Plus size={16} aria-hidden="true" /> New group
          </button>
        )}
      </div>
      <p className="page-sub">Study with friends: share videos, ask doubts at the exact second, answer in threads.</p>
      {error && (
        <p className="error" role="alert">
          Couldn’t load your groups. Check your connection and try again.
        </p>
      )}
      {!data && !error && <div className="skeleton" style={{ height: 160 }} aria-busy="true" />}
      {data && (data.length === 0 || creating) && <CreateForm onCancel={data.length > 0 ? () => setCreating(false) : undefined} />}
      {data && data.length === 0 && (
        <p className="help">Got an invite link from a friend? Just open it, and you’ll join their group.</p>
      )}
      {data && data.length > 0 && (
        <ul className="group-list">
          {data.map((g) => (
            <li key={g.id}>
              <Link to={`/groups/${g.id}`} className="group-row">
                <span className="icon-circle">
                  <UsersRound size={20} aria-hidden="true" />
                </span>
                <span className="group-row-text">
                  <b>{g.name}</b>
                  <span className="help">
                    {g.members} member{g.members === 1 ? '' : 's'} · active {relTime(g.last)}
                  </span>
                </span>
                {g.unread > 0 && (
                  <span className="count-badge" aria-label={`${g.unread} new`}>
                    {g.unread}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
