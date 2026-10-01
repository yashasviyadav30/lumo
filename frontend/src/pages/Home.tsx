import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import { chooseMeaning, getActiveGoal, goalSummary, setGoal, type Goal } from '../lib/goals'
import { clock, homeSummary, lectureTitle, type HomeSummary } from '../lib/study'

// Home opens on one thing to do: resume, else cards due, else open doubts.
function OneThing({ s }: { s: HomeSummary | null }) {
  if (!s) return null
  const extra: string[] = []
  if (s.cards_due) extra.push(`${s.cards_due} card${s.cards_due === 1 ? '' : 's'} due`)
  if (s.doubts_open) extra.push(`${s.doubts_open} open doubt${s.doubts_open === 1 ? '' : 's'}`)
  if (s.resume) {
    return (
      <div className="hero">
        <p className="hero-kicker">Continue</p>
        <Link to={`/watch/${s.resume.video_id}`} className="hero-main">
          {lectureTitle(s.resume.video, s.resume.video_id)}
          <span className="help"> · from {clock(s.resume.position_s)}</span>
        </Link>
        {s.cards_due > 0 && (
          <Link to="/cards" className="hero-side">
            Review {extra[0]}
          </Link>
        )}
      </div>
    )
  }
  if (s.cards_due) {
    return (
      <div className="hero">
        <p className="hero-kicker">Today</p>
        <Link to="/cards" className="hero-main">
          Review {extra[0]}
        </Link>
      </div>
    )
  }
  if (s.doubts_open) {
    return (
      <div className="hero">
        <p className="hero-kicker">Still open</p>
        <Link to="/personal" state={{ only: 'doubts' }} className="hero-main">
          {extra[0]}
        </Link>
      </div>
    )
  }
  return null
}

export default function Home() {
  const navigate = useNavigate()
  const [goal, setGoalState] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<HomeSummary | null>(null)

  useEffect(() => {
    homeSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
    getActiveGoal()
      .then((g) => setGoalState(g && g.id ? g : null))
      .catch(() => setGoalState(null))
      .finally(() => setLoading(false))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    setError(null)
    try {
      setGoalState(await setGoal(text.trim()))
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t save your goal.')
    } finally {
      setBusy(false)
    }
  }

  async function onChoose(index: number) {
    if (!goal) return
    setGoalState(await chooseMeaning(goal.id, index))
  }

  // The query goes to the search page in memory, not in the URL (R11).
  const openSearch = (q: string) => navigate('/search', { state: { q } })

  if (loading) return <p aria-busy="true">Loading…</p>

  if (!goal || editing) {
    return (
      <section>
        {!editing && <OneThing s={summary} />}
        <h1>What are you learning?</h1>
        <p>Type it the way you’d say it. Any exam, subject or skill.</p>
        <form className="search-form" onSubmit={onSubmit}>
          <label htmlFor="goal" className="visually-hidden">
            Your learning goal
          </label>
          <input
            id="goal"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. CMA Inter costing, NEET biology, machine learning"
            autoComplete="off"
          />
          <button type="submit" disabled={busy || !text.trim()}>
            {busy ? 'Saving…' : 'Set goal'}
          </button>
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <p className="help">
          {APP_NAME} hides entertainment and distractions, and always shows you what it hid.
        </p>
      </section>
    )
  }

  if (goal.did_you_mean.length > 0) {
    return (
      <section>
        <h1>Did you mean…</h1>
        <p>“{goal.text}” can mean more than one thing.</p>
        <div className="chips">
          {goal.did_you_mean.map((c) => (
            <button key={c.index} className="chip" onClick={() => onChoose(c.index)}>
              {c.label}
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <OneThing s={summary} />
      <p className="goal-line">
        <span className="goal-label">Your goal:</span> <strong>{goalSummary(goal)}</strong>{' '}
        <button
          className="link"
          onClick={() => {
            setText(goal.text)
            setEditing(true)
          }}
        >
          Change
        </button>
      </p>

      {goal.minor_signals.length > 0 && (
        <p className="notice-line" role="note">
          This goal mentions school (“{goal.minor_signals[0]}”). {APP_NAME} is for ages 18 and over for now.
        </p>
      )}

      {goal.query && (
        <button className="primary-wide" onClick={() => openSearch(goal.query!)}>
          Search: {goal.query}
        </button>
      )}

      {goal.topics.length > 0 && (
        <>
          <h2>Topics</h2>
          <div className="chips">
            {goal.topics.map((t) => (
              <button key={t.id} className="chip" onClick={() => openSearch(t.query)}>
                {t.name}
              </button>
            ))}
          </div>
        </>
      )}
      <p className="help">Your feed from trusted teachers comes in the next stage.</p>
    </section>
  )
}
