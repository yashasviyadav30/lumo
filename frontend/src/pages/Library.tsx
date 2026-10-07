import { History, Star, X } from '../components/icons'
import { useConfirmTap } from '../lib/useConfirmTap'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api, fresh, peek, remember } from '../lib/api'
import { ago, formatDuration } from '../lib/search'
import { clock, getLibrary, lectureTitle, starVideo, type LibraryItem } from '../lib/study'

type Tab = 'starred' | 'history'

function day(iso: string) {
  const d = new Date(iso)
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000)
  return days < 1 ? 'Today' : days < 2 ? 'Yesterday' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
}

// A compact row (small thumbnail, text beside it), like YouTube History and Spotify's Library.
function Row({ item, resume, onRemove, removeLabel }: { item: LibraryItem; resume?: number; onRemove: () => void; removeLabel: string }) {
  const v = item.video
  const total = v?.duration_s ?? 0
  return (
    <li className="row-item">
      <Link to={`/watch/${item.video_id}`} className="row-link">
        <span className="row-thumb">
          <span className="thumb">{v?.thumbnail_url && <img src={v.thumbnail_url} alt="" width={160} height={90} loading="lazy" />}</span>
          {resume !== undefined && total > 0 && (
            <span className="watched" aria-hidden="true">
              <span style={{ width: `${Math.min(100, (resume / total) * 100)}%` }} />
            </span>
          )}
        </span>
        <span className="meta">
          <span className="title">{lectureTitle(v, item.video_id)}</span>
          <span className="channel">
            {resume !== undefined
              ? `${v?.channel_title ? v.channel_title + ' · ' : ''}Resume ${clock(resume)}`
              : [v?.channel_title, formatDuration(v?.duration_s ?? null), ago(v?.published_at)].filter(Boolean).join(' · ')}
          </span>
        </span>
      </Link>
      <button className="icon-btn" onClick={onRemove} aria-label={removeLabel} title={removeLabel}>
        <X size={18} aria-hidden="true" />
      </button>
    </li>
  )
}

// Things the user saved or watched. Their notes live in "My notes".
type Lib = { starred: LibraryItem[]; history: LibraryItem[] }

export default function Library() {
  const confirm = useConfirmTap()
  const [tab, setTab] = useState<Tab>('starred')
  const [lib, setLib] = useState(() => peek<Lib>('library') ?? null)
  const [error, setError] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)

  useEffect(() => {
    const kept = peek<Lib>('library')
    fresh('library', getLibrary)
      .then(setLib)
      .catch(() => !kept && setError(true))
  }, [])
  useEffect(() => {
    if (lib) remember('library', lib) // so coming back shows the list as it was left
  }, [lib])

  // The row goes at once; if the server says no, it comes back with a message (a privacy action must not fake it).
  const change = async (next: (l: Lib) => Lib, save: () => Promise<unknown>, message: string) => {
    const before = lib
    setFailed(null)
    setLib((l) => l && next(l))
    try {
      await save()
    } catch {
      setLib(before)
      setFailed(message)
    }
  }
  const unstar = (id: string) =>
    change((l) => ({ ...l, starred: l.starred.filter((s) => s.video_id !== id) }), () => starVideo(id, false), 'Couldn’t remove the star. Try again.')
  const forget = (id: string | null) =>
    change(
      (l) => ({ ...l, history: id ? l.history.filter((h) => h.video_id !== id) : [] }),
      () => api('/api/history/remove', { method: 'POST', body: JSON.stringify(id ? { video_id: id } : {}) }),
      'Couldn’t clear that from your history. Try again.',
    )

  const items = lib ? lib[tab] : []
  const groups: Array<[string, LibraryItem[]]> = []
  for (const h of tab === 'history' ? items : []) {
    const label = day(h.at)
    if (groups.at(-1)?.[0] !== label) groups.push([label, []])
    groups.at(-1)![1].push(h)
  }

  return (
    <section>
      <div className="page-head title-row">
        <h1>Library</h1>
        {tab === 'history' && items.length > 0 && (
          <button className="link" onClick={() => confirm.tap('clear', () => forget(null))}>
            {confirm.armed ? 'Tap again to clear all' : 'Clear all'}
          </button>
        )}
      </div>
      <div className="tabs" role="tablist" aria-label="Library">
        <button role="tab" aria-selected={tab === 'starred'} className={tab === 'starred' ? 'on' : ''} onClick={() => setTab('starred')}>
          <Star size={15} aria-hidden="true" /> Starred
          {lib && lib.starred.length > 0 && <span className="count">{lib.starred.length}</span>}
        </button>
        <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>
          <History size={15} aria-hidden="true" /> History
        </button>
      </div>
      {error && <p className="error">Couldn’t load your library.</p>}
      {failed && (
        <p className="error" role="alert">
          {failed}
        </p>
      )}
      {!lib && !error && <div className="skeleton" style={{ height: 180 }} aria-busy="true" />}
      {lib && items.length === 0 && (
        <div className={`card empty ${tab === 'starred' ? 'tint-butter' : 'tint-peach'}`}>
          <span className="icon-circle">
            {tab === 'starred' ? <Star size={22} aria-hidden="true" /> : <History size={22} aria-hidden="true" />}
          </span>
          <h3>{tab === 'starred' ? 'No starred videos yet' : 'Nothing watched yet'}</h3>
          <p className="help">
            {tab === 'starred'
              ? 'Tap ☆ Star under a video, or Star video in a card’s ⋮ menu.'
              : 'Videos you watch show up here, with where you stopped.'}
          </p>
        </div>
      )}
      {tab === 'starred' && (
        <ul className="row-list" role="tabpanel">
          {items.map((s) => (
            <Row key={s.video_id} item={s} onRemove={() => unstar(s.video_id)} removeLabel="Remove from Starred" />
          ))}
        </ul>
      )}
      {tab === 'history' &&
        groups.map(([label, list]) => (
          <div key={label} role="tabpanel">
            <h2 className="day-label">{label}</h2>
            <ul className="row-list">
              {list.map((h) => (
                <Row key={h.video_id} item={h} resume={h.position_s ?? 0} onRemove={() => forget(h.video_id)} removeLabel="Remove from History" />
              ))}
            </ul>
          </div>
        ))}
    </section>
  )
}
