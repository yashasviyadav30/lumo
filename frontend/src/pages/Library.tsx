import { History, Star, X } from '../components/icons'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../lib/api'
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
          <span className="thumb">{v?.thumbnail_url && <img src={v.thumbnail_url} alt="" loading="lazy" />}</span>
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

// Things she saved or watched. Her notes live in "My notes".
export default function Library() {
  const [tab, setTab] = useState<Tab>('starred')
  const [lib, setLib] = useState<{ starred: LibraryItem[]; history: LibraryItem[] } | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getLibrary()
      .then(setLib)
      .catch(() => setError(true))
  }, [])

  const unstar = async (id: string) => {
    setLib((l) => l && { ...l, starred: l.starred.filter((s) => s.video_id !== id) })
    await starVideo(id, false).catch(() => {})
  }
  const forget = async (id: string | null) => {
    setLib((l) => l && { ...l, history: id ? l.history.filter((h) => h.video_id !== id) : [] })
    await api('/api/history/remove', { method: 'POST', body: JSON.stringify(id ? { video_id: id } : {}) }).catch(() => {})
  }

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
          <button className="link" onClick={() => forget(null)}>
            Clear all
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
      {!lib && !error && <div className="skeleton" style={{ height: 180 }} aria-busy="true" />}
      {lib && items.length === 0 && (
        <div className="card empty">
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
