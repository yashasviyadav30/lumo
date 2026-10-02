import { Layers, Pencil, Play } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import Feed from '../components/Feed'
import { APP_NAME } from '../config'
import { chooseMeaning, getActiveGoal, goalSummary, setGoal, type Goal } from '../lib/goals'
import { clock, homeSummary, lectureTitle, type HomeSummary } from '../lib/study'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function greeting(d = new Date()) {
  const h = d.getHours()
  return h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

// One next step (UX review): continue the last lecture, and today's cards if any. Nothing else competes.
function Continue({ s }: { s: HomeSummary }) {
  const cards = s.cards_due > 0 && (
    <Link to="/cards" className="pill-link">
      <Layers size={16} aria-hidden="true" /> Review {plural(s.cards_due, 'card')} due
    </Link>
  )
  if (!s.resume) return cards ? <div className="hero plain">{cards}</div> : null
  const v = s.resume.video
  const total = v?.duration_s ?? 0
  return (
    <div className="hero">
      <Link to={`/watch/${s.resume.video_id}`} className="hero-thumb" aria-hidden="true" tabIndex={-1}>
        {v?.thumbnail_url && <img src={v.thumbnail_url} alt="" />}
      </Link>
      <div>
        <p className="hero-kicker">Continue</p>
        <Link to={`/watch/${s.resume.video_id}`} className="hero-main">
          <span className="t">{lectureTitle(v, s.resume.video_id)}</span>
          <span className="s">
            {v?.channel_title ? `${v.channel_title} · ` : ''}stopped at {clock(s.resume.position_s)}
          </span>
        </Link>
        {total > 0 && (
          <span className="hero-progress" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (s.resume.position_s / total) * 100)}%` }} />
          </span>
        )}
        <div className="hero-actions">
          <Link to={`/watch/${s.resume.video_id}`} className="button small">
            <Play size={16} aria-hidden="true" /> Resume
          </Link>
          {cards}
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    ['Pick a lecture', 'From your feed or Search.'],
    ['Mark while you watch', 'One tap saves that second.'],
    ['Review tonight', 'Your notes come back as cards.'],
  ]
  return (
    <div className="steps">
      {steps.map(([title, text]) => (
        <div key={title} className="step">
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [goal, setGoalState] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<HomeSummary | null>(null)

  useEffect(() => {
    // Draw Home once both are in, so the top card never flashes the wrong thing.
    Promise.allSettled([
      homeSummary().then(setSummary),
      getActiveGoal().then((g) => setGoalState(g && g.id ? g : null)),
    ]).finally(() => setLoading(false))
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

  if (loading) return <div className="skeleton" style={{ height: 160, marginTop: 16 }} aria-busy="true" />

  const isNew = !summary?.totals || (summary.totals.notes === 0 && !summary.resume)
  const goalReady = goal && !editing && goal.did_you_mean.length === 0

  return (
    <section>
      <header className="greet">
        <h1>
          {greeting()}, <span className="hl">let’s study.</span>
        </h1>
      </header>

      {(!goal || editing) && (
        <div className="card goal-card">
          {isNew && !editing && <HowItWorks />}
          <h2 style={{ marginTop: isNew && !editing ? 18 : 0 }}>What are you studying?</h2>
          <form className="search-form" onSubmit={onSubmit}>
            <label htmlFor="goal" className="visually-hidden">
              Your learning goal
            </label>
            <input
              id="goal"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. CMA Inter costing, NEET biology"
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
        </div>
      )}

      {goal && !editing && goal.did_you_mean.length > 0 && (
        <div className="card goal-card">
          <h2 style={{ marginTop: 0 }}>Did you mean…</h2>
          <p className="help">“{goal.text}” can mean more than one thing.</p>
          <div className="chips">
            {goal.did_you_mean.map((c) => (
              <button key={c.index} className="chip" onClick={() => onChoose(c.index)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {summary && <Continue s={summary} />}

      {goalReady && (
        <>
          <p className="goal-line">
            <span className="goal-label">Your goal:</span> <strong>{goalSummary(goal)}</strong>{' '}
            <button
              className="link"
              aria-label="Change"
              onClick={() => {
                setText(goal.text)
                setEditing(true)
              }}
            >
              <Pencil size={14} aria-hidden="true" /> Change
            </button>
          </p>
          {goal.minor_signals.length > 0 && (
            <p className="notice-line" role="note">
              This goal mentions school (“{goal.minor_signals[0]}”). {APP_NAME} is for ages 18 and over for now.
            </p>
          )}
        </>
      )}
      <Feed key={goal?.id ?? 'none'} topics={goalReady ? goal.topics : []} />
    </section>
  )
}
