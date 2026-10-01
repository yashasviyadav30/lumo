import { BookOpen, CircleHelp, Layers, MapPin, Pencil, Play, Search, Sparkles, Users } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import { chooseMeaning, getActiveGoal, goalSummary, setGoal, type Goal } from '../lib/goals'
import { clock, homeSummary, lectureTitle, type HomeSummary } from '../lib/study'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function greeting(d = new Date()) {
  const h = d.getHours()
  return h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

// Home opens on one thing to do: resume, else cards due, else open doubts, else start.
function Today({ s, onStart }: { s: HomeSummary | null; onStart: () => void }) {
  const pills = s && (
    <div className="hero-pills">
      {s.cards_due > 0 && (
        <Link to="/cards" className="hero-pill">
          <Layers size={16} aria-hidden="true" /> Review {plural(s.cards_due, 'card')} due
        </Link>
      )}
      {s.doubts_open > 0 && (
        <Link to="/personal" state={{ only: 'doubts' }} className="hero-pill">
          <CircleHelp size={16} aria-hidden="true" /> {plural(s.doubts_open, 'open doubt')}
        </Link>
      )}
      {s.marks_to_fill > 0 && (
        <span className="hero-pill">
          <MapPin size={16} aria-hidden="true" /> {plural(s.marks_to_fill, 'mark')} to fill in
        </span>
      )}
    </div>
  )

  if (s?.resume) {
    const v = s.resume.video
    return (
      <div className="hero">
        <p className="hero-kicker">Continue where you stopped</p>
        <Link to={`/watch/${s.resume.video_id}`} className="hero-main">
          {v?.thumbnail_url && (
            <span className="hero-thumb">
              <img src={v.thumbnail_url} alt="" />
            </span>
          )}
          <span>
            <span className="t">{lectureTitle(v, s.resume.video_id)}</span>
            <span className="s">
              {v?.channel_title ? `${v.channel_title} · ` : ''}from {clock(s.resume.position_s)}
            </span>
          </span>
        </Link>
        <Link to={`/watch/${s.resume.video_id}`} className="button small">
          <Play size={16} aria-hidden="true" /> Resume
        </Link>
        {pills}
      </div>
    )
  }
  if (s && s.cards_due > 0) {
    return (
      <div className="hero">
        <p className="hero-kicker">Today</p>
        <p className="hero-main">
          <span className="t">{plural(s.cards_due, 'card')} ready to review</span>
        </p>
        <Link to="/cards" className="button small">
          <Layers size={16} aria-hidden="true" /> Review {plural(s.cards_due, 'card')} due
        </Link>
      </div>
    )
  }
  if (s && s.doubts_open > 0) {
    return (
      <div className="hero">
        <p className="hero-kicker">Still open</p>
        <p className="hero-main">
          <span className="t">{plural(s.doubts_open, 'doubt')} waiting for an answer</span>
        </p>
        <Link to="/personal" state={{ only: 'doubts' }} className="button small">
          <CircleHelp size={16} aria-hidden="true" /> {plural(s.doubts_open, 'open doubt')}
        </Link>
      </div>
    )
  }
  return (
    <div className="hero">
      <p className="hero-kicker">Start here</p>
      <p className="hero-main">
        <span className="t">Pick a lecture and take your first note</span>
      </p>
      <button className="button small" onClick={onStart}>
        <Search size={16} aria-hidden="true" /> Find a lecture
      </button>
    </div>
  )
}

function Tools({ s }: { s: HomeSummary | null }) {
  const lecture = s?.resume ? `/watch/${s.resume.video_id}` : '/search'
  const tools = [
    { to: '/search', Icon: Search, tone: '', title: 'Smart search', text: 'Study videos only. Shorts and entertainment hidden.' },
    { to: lecture, Icon: MapPin, tone: '', title: 'Notes on the lecture', text: 'Tap Mark at any second. Fill it in later.', badge: s?.marks_to_fill ? `${s.marks_to_fill} to fill` : '' },
    { to: '/cards', Icon: Layers, tone: 'green', title: 'Revision cards', text: 'Come back right before you forget.', badge: s?.cards_due ? `${s.cards_due} due` : '' },
    { to: '/personal', state: { only: 'doubts' }, Icon: CircleHelp, tone: 'orange', title: 'Doubts', text: 'Park a doubt, keep watching, solve it later.', badge: s?.doubts_open ? `${s.doubts_open} open` : '' },
    { to: '/personal', Icon: BookOpen, tone: 'amber', title: 'Notebook', text: 'All your notes by lecture. Search and export.' },
    { to: '', Icon: Users, tone: 'pink', title: 'Study with friends', text: 'Send a doubt to a friend, get the answer back.', soon: true },
  ]
  return (
    <div className="tools">
      {tools.map((t) => {
        const inner = (
          <>
            <span className={`icon-circle ${t.tone}`}>
              <t.Icon size={22} aria-hidden="true" />
            </span>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
            {t.badge && <span className="badge violet">{t.badge}</span>}
            {t.soon && <span className="badge soon">Coming next</span>}
          </>
        )
        return t.soon ? (
          <div key={t.title} className="tool muted">
            {inner}
          </div>
        ) : (
          <Link key={t.title} to={t.to} state={t.state} className="tool">
            {inner}
          </Link>
        )
      })}
    </div>
  )
}

function HowItWorks() {
  const steps = [
    ['Find a lecture', 'Search your topic. Only study videos show up.'],
    ['Mark while you watch', 'Tap Mark or Doubt under the video. It saves that second.'],
    ['Review tonight', 'Turn notes into cards. They come back before you forget.'],
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
  const navigate = useNavigate()
  const [goal, setGoalState] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<HomeSummary | null>(null)

  useEffect(() => {
    // Draw Home once both are in, so the "today" card never flashes the wrong thing.
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

  // The query goes to the search page in memory, not in the URL (R11).
  const openSearch = (q: string) => navigate('/search', { state: { q } })
  const start = () => (goal?.query ? openSearch(goal.query) : navigate('/search'))

  if (loading) return <div className="skeleton" style={{ height: 200, marginTop: 16 }} aria-busy="true" />

  let goalBlock
  if (!goal || editing) {
    goalBlock = (
      <div className="card goal-card">
        <h2>What are you learning?</h2>
        <p className="help" style={{ marginBottom: 12 }}>
          Type it the way you’d say it. Any exam, subject or skill.
        </p>
        <form className="search-form" onSubmit={onSubmit}>
          <label htmlFor="goal" className="visually-hidden">
            Your learning goal
          </label>
          <input id="goal" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. CMA Inter costing, NEET biology" autoComplete="off" />
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
    )
  } else if (goal.did_you_mean.length > 0) {
    goalBlock = (
      <div className="card goal-card">
        <h2>Did you mean…</h2>
        <p className="help">“{goal.text}” can mean more than one thing.</p>
        <div className="chips">
          {goal.did_you_mean.map((c) => (
            <button key={c.index} className="chip" onClick={() => onChoose(c.index)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    )
  } else {
    goalBlock = (
      <div className="card goal-card">
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
        {goal.query && (
          <button className="primary-wide gradient" onClick={() => openSearch(goal.query!)}>
            <Search size={18} aria-hidden="true" /> Search: {goal.query}
          </button>
        )}
        {goal.topics.length > 0 && (
          <>
            <h3 style={{ margin: '14px 0 0' }}>Topics</h3>
            <div className="chips scroll">
              {goal.topics.map((t) => (
                <button key={t.id} className="chip" onClick={() => openSearch(t.query)}>
                  {t.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const isNew = !summary?.totals || summary.totals.notes === 0
  return (
    <section>
      <header className="greet">
        <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1>{greeting()}</h1>
      </header>

      <Today s={summary} onStart={start} />

      {summary?.week && summary.totals && (
        <div className="stats" aria-label="This week">
          <div className="stat">
            <b>{summary.week.reviews}</b>
            <span>cards reviewed this week</span>
          </div>
          <div className="stat">
            <b>{summary.week.notes}</b>
            <span>notes this week</span>
          </div>
          <div className="stat">
            <b>{summary.totals.lectures}</b>
            <span>lectures studied</span>
          </div>
        </div>
      )}

      {isNew && (
        <>
          <div className="section-head">
            <h2>
              <Sparkles size={18} aria-hidden="true" /> How it works
            </h2>
          </div>
          <HowItWorks />
        </>
      )}

      <div className="section-head">
        <h2>What you’re studying</h2>
      </div>
      {goalBlock}

      <div className="section-head">
        <h2>Your study tools</h2>
      </div>
      <Tools s={summary} />
    </section>
  )
}
