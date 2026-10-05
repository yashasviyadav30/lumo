import { Search as SearchIcon, UserPlus } from '../components/icons'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ImportSubscriptions from '../components/ImportSubscriptions'
import VideoItem, { NoticeLine } from '../components/VideoItem'
import { getShorts, type VideoCard } from '../lib/search'
import { useVideoActions } from '../lib/useVideoActions'

// Shorts only from channels she follows (plan v3): the useful reels, without an endless scroll of strangers.
export default function Shorts() {
  const [data, setData] = useState<{ results: VideoCard[]; follows: number } | null>(null)
  const [error, setError] = useState(false)
  const { actions, visible, notice, undo } = useVideoActions()

  useEffect(() => {
    getShorts()
      .then(setData)
      .catch(() => setError(true))
  }, [])

  return (
    <section>
      <h1 className="page-title">Shorts</h1>
      <p className="page-sub">Only from channels you follow.</p>
      <NoticeLine notice={notice} onUndo={undo} />
      {error && (
        <p className="error" role="alert">
          Couldn’t load Shorts. Check your connection and try again.
        </p>
      )}
      {!data && !error && (
        <ul className="vgrid small" aria-busy="true" aria-label="Loading Shorts">
          {[0, 1, 2, 3].map((i) => (
            <li key={i}>
              <div className="skeleton" style={{ aspectRatio: '16 / 9' }} />
            </li>
          ))}
        </ul>
      )}
      {data && data.follows === 0 && (
        <div className="feed-empty">
          <UserPlus size={26} aria-hidden="true" />
          <h3>Follow channels to see their Shorts</h3>
          <p>On any video, tap ⋮ and then Follow channel. Their Shorts appear here, and nobody else’s.</p>
          <ImportSubscriptions onDone={() => getShorts().then(setData).catch(() => setError(true))} />
          <Link to="/search" className="button small" style={{ marginTop: 12 }}>
            <SearchIcon size={16} aria-hidden="true" /> Find channels
          </Link>
        </div>
      )}
      {data && data.follows > 0 && data.results.length === 0 && (
        <div className="feed-empty">
          <h3>No Shorts yet</h3>
          <p>The channels you follow haven’t posted Shorts recently.</p>
        </div>
      )}
      {data && (
        <ul className="vgrid small" aria-label="Shorts">
          {data.results.filter(visible).map((v) => (
            <VideoItem key={v.video_id} video={v} actions={actions} />
          ))}
        </ul>
      )}
    </section>
  )
}
