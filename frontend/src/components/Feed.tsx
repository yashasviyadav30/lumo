import { Search as SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getFeed, recentSearches, searchVideos, type FeedResponse } from '../lib/search'
import { useVideoActions } from '../lib/useVideoActions'
import HiddenLine from './HiddenLine'
import VideoItem, { NoticeLine } from './VideoItem'

type Chip = { id: string; name: string; query: string | null; only?: 'podcasts' }

// YouTube-style Home: chips ("All", "Podcasts & talks", her goal's topics, her recent searches) over a grid.
// "All" mixes followed and recently watched channels, her goal and her searches. The same hide list applies
// everywhere, and hidden videos are always listed (R6).
export default function Feed({ topics }: { topics: Array<{ id: string; name: string; query: string }> }) {
  const [chips] = useState<Chip[]>(() => {
    const own = topics.map((t) => t.query.toLowerCase())
    const recent = recentSearches().filter((q) => !own.includes(q.toLowerCase()))
    return [
      { id: 'all', name: 'All', query: null },
      { id: 'podcasts', name: 'Podcasts & talks', query: null, only: 'podcasts' },
      ...topics.map((t) => ({ id: t.id, name: t.name, query: t.query })),
      ...recent.map((q) => ({ id: `recent:${q}`, name: q, query: q })),
    ]
  })
  const [active, setActive] = useState('all')
  const [data, setData] = useState<FeedResponse | null>(null)
  const [error, setError] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const { actions, visible, notice, undo } = useVideoActions()

  const load = (chip: Chip) => {
    setData(null)
    setError(false)
    setShowHidden(false)
    const req = chip.query ? searchVideos(chip.query) : getFeed(recentSearches(), chip.only)
    return req.then(setData).catch(() => setError(true))
  }

  useEffect(() => {
    load(chips[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first load only; chips reload on tap
  }, [])

  const pick = (chip: Chip) => {
    setActive(chip.id)
    load(chip)
  }
  const shown = data?.results.filter(visible) ?? []

  return (
    <div className="feed">
      {(
        <div className="chipbar" role="group" aria-label="Topics">
          {chips.map((c) => (
            <button key={c.id} className={`chip${c.id === active ? ' on' : ''}`} aria-pressed={c.id === active} onClick={() => pick(c)}>
              {c.name}
            </button>
          ))}
        </div>
      )}
      <NoticeLine notice={notice} onUndo={undo} />
      {error && (
        <p className="error" role="alert">
          Couldn’t load videos. Check your connection and try again.
        </p>
      )}
      {!data && !error && (
        <ul className="vgrid" aria-busy="true" aria-label="Loading videos">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <div className="skeleton" style={{ aspectRatio: '16 / 9' }} />
              <div className="skeleton" style={{ height: 14, marginTop: 12, width: '80%' }} />
              <div className="skeleton" style={{ height: 12, marginTop: 8, width: '50%' }} />
            </li>
          ))}
        </ul>
      )}
      {data && (
        <>
          {shown.length === 0 && (
            <div className="feed-empty">
              <h3>Your Home is empty for now</h3>
              <p>Search for something you want to learn, or follow a few channels from the ⋮ menu. Home fills up from there.</p>
              <Link to="/search" className="button small" style={{ marginTop: 12 }}>
                <SearchIcon size={16} aria-hidden="true" /> Search
              </Link>
            </div>
          )}
          <ul className="vgrid" aria-label="Your feed">
            {shown.map((v) => (
              <VideoItem key={v.video_id} video={v} progress={data.progress?.[v.video_id]} actions={actions} />
            ))}
            {showHidden &&
              data.hidden.map((v) => (
                <VideoItem key={v.video_id} video={v} hiddenBecause={v.reasons} playable={v.playable} actions={{ onFollow: actions.onFollow }} />
              ))}
          </ul>
          <HiddenLine hidden={data.hidden} shown={showHidden} onToggleShow={() => setShowHidden(!showHidden)} />
        </>
      )}
    </div>
  )
}
