import { UsersRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { joinGroup, keepName, lastName, previewInvite } from '../lib/groups'

// Opened from an invite link: shows the group, asks her name for it, joins.
export default function Join() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState<{ id: string; name: string; members: number; full: boolean; member: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(lastName)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    previewInvite(code)
      .then((g) => (g.member ? navigate(`/groups/${g.id}`, { replace: true }) : setGroup(g)))
      .catch((err) => setError(err instanceof Error ? err.message : 'This invite didn’t work.'))
  }, [code, navigate])

  async function join(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const g = await joinGroup(code, name.trim())
      keepName(name.trim())
      navigate(`/groups/${g.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t join.')
      setBusy(false)
    }
  }

  if (error && !group)
    return (
      <section className="start-card">
        <h1>Invite not working</h1>
        <p className="error">{error}</p>
        <Link to="/groups">Go to your groups</Link>
      </section>
    )
  if (!group) return <div className="skeleton" style={{ height: 180, marginTop: 16 }} aria-busy="true" />
  return (
    <form className="start-card" onSubmit={join}>
      <span className="icon-circle">
        <UsersRound size={22} aria-hidden="true" />
      </span>
      <h1>Join “{group.name}”</h1>
      <p>
        {group.members} member{group.members === 1 ? '' : 's'}. You’ll share videos, notes and doubts with them.
      </p>
      {group.full ? (
        <p className="error">This group is full (50 members).</p>
      ) : (
        <>
          <label htmlFor="join-name">Your name in this group</label>
          <input id="join-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="nickname" />
          <p className="help">Members see this name, never your email.</p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy || !name.trim()}>
            {busy ? 'Joining…' : 'Join group'}
          </button>
        </>
      )}
    </form>
  )
}
