import {
  Download,
  LayoutList,
  MapPin,
  NotebookPen,
  PlaySquare,
  Search,
  Star,
  StickyNote,
} from '../components/icons'
import { Suspense, useEffect, useRef, useState } from 'react'
import { lazyWithReload } from '../lib/lazy'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  clock,
  lectureTitle,
  notebook,
  notebookMarkdown,
  tagLabel,
  type Note,
  type Notebook,
} from '../lib/study'

// Loaded only when there is a notepad page to show (the editor is big).
const NotepadView = lazyWithReload(() => import('../components/Notepad').then((m) => ({ default: m.NotepadView })))

type Filter = 'all' | 'doubts' | 'starred'
type View = 'videos' | 'notes'
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'doubts', label: 'Doubts' },
  { id: 'starred', label: 'Important' },
]
const VIEW_KEY = 'focuslearn.notes-view'

function savedView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'notes' ? 'notes' : 'videos'
  } catch {
    return 'videos'
  }
}

function NoteItem({ n, videoId, source }: { n: Note; videoId: string; source?: string }) {
  return (
    <li className={`note${n.kind === 'doubt' ? ' is-doubt' : ''}`}>
      <Link
        to={`/watch/${videoId}`}
        state={{ t: n.t_seconds }}
        className="time-chip static"
        aria-label={`Open at ${clock(n.t_seconds)}`}
      >
        {clock(n.t_seconds)}
      </Link>
      <div className="note-body">
        {(source || n.kind === 'doubt' || n.tag || n.starred) && (
          <div className="note-head">
            {n.kind === 'doubt' && (
              <span className={`badge ${n.solved ? 'good' : 'bad'}`}>{n.solved ? 'Solved' : 'Doubt'}</span>
            )}
            {n.tag && <span className={`badge tag-${n.tag}`}>{tagLabel(n.tag)}</span>}
            {n.starred && <Star size={15} weight="fill" color="var(--amber)" aria-label="important" />}
            {source && <span className="source">{source}</span>}
          </div>
        )}
        <p className="note-text">{n.text}</p>
        {n.answer && <p className="answer">Answer: {n.answer}</p>}
      </div>
    </li>
  )
}

// "My notes": everything the user wrote, first thing on the screen. Settings are in the top bar.
export default function Personal() {
  const navigate = useNavigate()
  const [book, setBook] = useState<Notebook | null>(null)
  const [q, setQ] = useState('')
  const start = (useLocation().state as { only?: Filter } | null)?.only ?? 'all'
  const [filter, setFilter] = useState<Filter>(start)
  const [view, setViewState] = useState<View>(savedView)
  const [error, setError] = useState<string | null>(null)

  const setView = (v: View) => {
    setViewState(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      // fine: the choice lasts for this visit
    }
  }

  // Only the latest request may fill the list, so a slow older reply can't overwrite a newer one.
  const latest = useRef(0)
  const load = (query: string, f: Filter) => {
    const ticket = ++latest.current
    return notebook(query, f === 'all' ? undefined : f)
      .then((b) => ticket === latest.current && setBook(b))
      .catch(() => setError('Couldn’t load your notes.'))
  }

  // Search while typing (a short pause first), in the request body (R11).
  useEffect(() => {
    const t = window.setTimeout(() => load(q.trim(), filter), q ? 300 : 0)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reruns on q/filter only
  }, [q, filter])

  const exportMd = async () => {
    const all = await notebook('')
    const url = URL.createObjectURL(new Blob([notebookMarkdown(all)], { type: 'text/markdown' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-notes.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const lectures = book?.lectures ?? []
  const toFill = lectures.reduce((n, l) => n + l.notes.filter((x) => x.kind === 'note' && !x.text).length, 0)
  const written = (l: Notebook['lectures'][number]) => l.notes.filter((x) => x.text || x.kind === 'doubt')
  const allNotes = lectures
    .flatMap((l) => written(l).map((n) => ({ n, l })))
    .sort((a, b) => b.n.created_at.localeCompare(a.n.created_at))

  return (
    <section>
      <div className="page-head title-row">
        <h1>My notes</h1>
        <div className="head-actions">
          <button className="export-btn" onClick={exportMd} title="Export my notes (.md)">
            <Download size={18} aria-hidden="true" /> Export
          </button>
        </div>
      </div>

      <div className="search-form" role="search">
        <label htmlFor="note-q" className="visually-hidden">
          Search your notes
        </label>
        <div className="search-box">
          <Search size={20} aria-hidden="true" />
          <input
            id="note-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your notes"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="notes-bar">
        <div className="chips" role="group" aria-label="Show">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`chip${filter === f.id ? ' on' : ''}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="view-switch" role="group" aria-label="View">
          <button
            className={view === 'videos' ? 'on' : ''}
            aria-pressed={view === 'videos'}
            onClick={() => setView('videos')}
            title="By video"
          >
            <PlaySquare size={16} aria-hidden="true" /> By video
          </button>
          <button
            className={view === 'notes' ? 'on' : ''}
            aria-pressed={view === 'notes'}
            onClick={() => setView('notes')}
            title="All notes, no videos"
          >
            <LayoutList size={16} aria-hidden="true" /> All notes
          </button>
        </div>
      </div>

      {toFill > 0 && filter === 'all' && !q && (
        <p className="fill-row">
          <MapPin size={16} aria-hidden="true" /> {toFill} mark{toFill === 1 ? '' : 's'} to fill in: open the lecture
          and write one line for each.
        </p>
      )}

      {error && <p className="error">{error}</p>}
      {!book && !error && <div className="skeleton" style={{ height: 160 }} aria-busy="true" />}
      {book && book.total === 0 && (
        <div className="card empty tint-mint">
          <span className="icon-circle">
            <NotebookPen size={22} aria-hidden="true" />
          </span>
          <h3>{q || filter !== 'all' ? 'Nothing matches' : 'No notes yet'}</h3>
          <p className="help">
            {q || filter !== 'all'
              ? 'Try other words or another filter.'
              : 'Open any lecture and tap Mark or Notepad while you listen.'}
          </p>
        </div>
      )}

      {view === 'notes' ? (
        <>
          <ul className="notes">
            {allNotes.map(({ n, l }) => (
              <NoteItem key={n.id} n={n} videoId={l.video_id} source={lectureTitle(l.video, l.video_id)} />
            ))}
          </ul>
          {lectures
            .filter((l) => l.notepad)
            .map((l) => (
              <div key={l.video_id} className="notepad-card">
                <p className="notepad-label">
                  <StickyNote size={14} aria-hidden="true" /> {lectureTitle(l.video, l.video_id)}
                </p>
                <Suspense fallback={null}>
                  <NotepadView
                    content={l.notepad!.content}
                    onSeek={(t) => navigate(`/watch/${l.video_id}`, { state: { t } })}
                  />
                </Suspense>
              </div>
            ))}
        </>
      ) : (
        lectures.map((l) => (
          <div key={l.video_id} className="lecture-block">
            <Link to={`/watch/${l.video_id}`} className="lecture-head">
              <span className="thumb">
                {l.video?.thumbnail_url && <img src={l.video.thumbnail_url} alt="" width={160} height={90} loading="lazy" />}
              </span>
              <span className="meta">
                <span className="title">{lectureTitle(l.video, l.video_id)}</span>
                {l.video && <span className="channel">{l.video.channel_title}</span>}
              </span>
            </Link>
            {written(l).length > 0 && (
              <ul className="notes">
                {written(l).map((n) => (
                  <NoteItem key={n.id} n={n} videoId={l.video_id} />
                ))}
              </ul>
            )}
            {l.notepad && (
              <div className="notepad-card">
                <p className="notepad-label">
                  <StickyNote size={14} aria-hidden="true" /> Notepad
                </p>
                <Suspense fallback={null}>
                  <NotepadView
                    content={l.notepad.content}
                    onSeek={(t) => navigate(`/watch/${l.video_id}`, { state: { t } })}
                  />
                </Suspense>
              </div>
            )}
          </div>
        ))
      )}
    </section>
  )
}
