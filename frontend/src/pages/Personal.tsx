import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { clock, lectureTitle, notebook, notebookMarkdown, type Notebook } from '../lib/study'

type Filter = 'all' | 'doubts' | 'starred'
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All notes' },
  { id: 'doubts', label: 'Doubts' },
  { id: 'starred', label: 'Starred' },
]

// Her own space: every note she has made, by lecture. Nothing here comes from other people.
export default function Personal() {
  const [book, setBook] = useState<Notebook | null>(null)
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
      <div className="title-row">
        <h1>Personal</h1>
        <Link to="/settings" className="link" aria-label="Settings">
          ⚙ Settings
        </Link>
      </div>
      <p className="help">Only you see this.</p>

      <form className="search-form" onSubmit={onSearch} role="search">
        <label htmlFor="note-q" className="visually-hidden">
          Search your notes
        </label>
        <input id="note-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your notes" autoComplete="off" />
        <button type="submit">Search</button>
      </form>
      <div className="chips" role="group" aria-label="Show">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip${filter === f.id ? ' on' : ''}`} aria-pressed={filter === f.id} onClick={() => pick(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {book && book.total === 0 && (
        <p className="help">
          {q || filter !== 'all'
            ? 'Nothing matches.'
            : 'No notes yet. Open any lecture and tap Mark while you listen.'}
        </p>
      )}
      {book?.lectures.map((l) => (
        <div key={l.video_id} className="lecture-block">
          <h2>
            <Link to={`/watch/${l.video_id}`}>{lectureTitle(l.video, l.video_id)}</Link>
          </h2>
          {l.video && <p className="help">{l.video.channel_title}</p>}
          <ul className="notes compact">
            {l.notes.map((n) => (
              <li key={n.id} className={`note${n.kind === 'doubt' ? ' is-doubt' : ''}`}>
                <span className="time-chip static">{clock(n.t_seconds)}</span>
                <div className="note-body">
                  <p className="note-text">
                    {n.starred && <span aria-label="starred">★ </span>}
                    {n.kind === 'doubt' && <span className={`badge ${n.solved ? 'good' : 'bad'}`}>{n.solved ? 'Solved' : 'Doubt'}</span>}{' '}
                    {n.tag && <span className="badge">{n.tag.toUpperCase()}</span>} {n.text || <span className="help">(empty mark)</span>}
                  </p>
                  {n.answer && <p className="answer">Answer: {n.answer}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {book && book.total > 0 && (
        <button className="secondary" onClick={exportMd}>
          Export my notes (.md)
        </button>
      )}
    </section>
  )
}
