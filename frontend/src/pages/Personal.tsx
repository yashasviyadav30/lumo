import { ChevronRight, Download, Layers, Search, Settings, ShieldCheck, Star, NotebookPen } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { useSession } from '../lib/session'
import { clock, homeSummary, lectureTitle, notebook, notebookMarkdown, type HomeSummary, type Notebook } from '../lib/study'

type Filter = 'all' | 'doubts' | 'starred'
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All notes' },
  { id: 'doubts', label: 'Doubts' },
  { id: 'starred', label: 'Starred' },
]

// Her own space: every note she has made, by lecture. Nothing here comes from other people.
export default function Personal() {
  const { me } = useSession()
  const [book, setBook] = useState<Notebook | null>(null)
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const [q, setQ] = useState('')
  const start = (useLocation().state as { only?: Filter } | null)?.only ?? 'all'
  const [filter, setFilter] = useState<Filter>(start)
  const [error, setError] = useState<string | null>(null)

  // Only the latest request may fill the list, so a slow older reply can't overwrite a newer one.
  const latest = useRef(0)
  const load = (query: string, f: Filter) => {
    const ticket = ++latest.current
    return notebook(query, f === 'all' ? undefined : f)
      .then((b) => ticket === latest.current && setBook(b))
      .catch(() => setError('Couldn’t load your notes.'))
  }

  useEffect(() => {
    load('', start)
    homeSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once, on open
  }, [])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    load(q.trim(), filter)
  }

  const pick = (f: Filter) => {
    setFilter(f)
    load(q.trim(), f)
  }

  const exportMd = async () => {
    const all = await notebook('')
    const url = URL.createObjectURL(new Blob([notebookMarkdown(all)], { type: 'text/markdown' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-notes.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section>
      <div className="card profile">
        <span className="avatar big" aria-hidden="true">
          {me?.email?.[0] ?? '·'}
        </span>
        <div style={{ minWidth: 0 }}>
          <p className="email">{me?.email}</p>
          <p className="help">Your private space. Only you see this.</p>
        </div>
      </div>

      {summary?.week && summary.totals && (
        <div className="stats">
          <div className="stat">
            <b>{summary.totals.notes}</b>
            <span>notes</span>
          </div>
          <div className="stat">
            <b>{summary.totals.lectures}</b>
            <span>lectures</span>
          </div>
          <div className="stat">
            <b>{summary.totals.cards}</b>
            <span>cards</span>
          </div>
        </div>
      )}

      <div className="card list-card" style={{ marginTop: 14 }}>
        <Link to="/cards" className="list-row">
          <span className="icon-circle green">
            <Layers size={18} aria-hidden="true" />
          </span>
          <span className="grow">Revision cards</span>
          {summary && summary.cards_due > 0 && <span className="badge violet">{summary.cards_due} due</span>}
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
        <button className="list-row" onClick={exportMd}>
          <span className="icon-circle amber">
            <Download size={18} aria-hidden="true" />
          </span>
          <span className="grow">Export my notes (.md)</span>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
        <Link to="/settings" className="list-row">
          <span className="icon-circle gray">
            <Settings size={18} aria-hidden="true" />
          </span>
          <span className="grow">Settings</span>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/privacy" className="list-row">
          <span className="icon-circle gray">
            <ShieldCheck size={18} aria-hidden="true" />
          </span>
          <span className="grow">Privacy</span>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <div className="section-head">
        <h2>Notebook</h2>
        {book && <span className="help">{book.total} shown</span>}
      </div>
      <form className="search-form" onSubmit={onSearch} role="search">
        <label htmlFor="note-q" className="visually-hidden">
          Search your notes
        </label>
        <div className="search-box">
          <Search size={20} aria-hidden="true" />
          <input id="note-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your notes" autoComplete="off" />
        </div>
        <button type="submit">Search</button>
      </form>
      <div className="segmented" role="group" aria-label="Show">
        {FILTERS.map((f) => (
          <button key={f.id} className={filter === f.id ? 'on' : ''} aria-pressed={filter === f.id} onClick={() => pick(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {book && book.total === 0 && (
        <div className="card empty">
          <span className="icon-circle">
            <NotebookPen size={22} aria-hidden="true" />
          </span>
          <h3>{q || filter !== 'all' ? 'Nothing matches' : 'No notes yet'}</h3>
          <p className="help">
            {q || filter !== 'all' ? 'Try other words or another filter.' : 'Open any lecture and tap Mark while you listen.'}
          </p>
        </div>
      )}
      {book?.lectures.map((l) => (
        <div key={l.video_id} className="lecture-block">
          <h3>
            <Link to={`/watch/${l.video_id}`}>{lectureTitle(l.video, l.video_id)}</Link>
          </h3>
          {l.video && <p className="help">{l.video.channel_title}</p>}
          <ul className="notes">
            {l.notes.map((n) => (
              <li key={n.id} className={`note${n.kind === 'doubt' ? ' is-doubt' : ''}`}>
                <Link to={`/watch/${l.video_id}`} state={{ t: n.t_seconds }} className="time-chip static" aria-label={`Open at ${clock(n.t_seconds)}`}>
                  {clock(n.t_seconds)}
                </Link>
                <div className="note-body">
                  <div className="note-head">
                    {n.kind === 'doubt' && <span className={`badge ${n.solved ? 'good' : 'bad'}`}>{n.solved ? 'Solved' : 'Doubt'}</span>}
                    {n.tag && <span className="badge">{n.tag.toUpperCase()}</span>}
                    {n.starred && <Star size={15} fill="currentColor" color="var(--amber)" aria-label="starred" />}
                  </div>
                  <p className="note-text">{n.text || <span className="help">(empty mark)</span>}</p>
                  {n.answer && <p className="answer">Answer: {n.answer}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
