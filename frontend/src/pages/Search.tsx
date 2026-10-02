import { EyeOff, Search as SearchIcon } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router'
import HiddenLine from '../components/HiddenLine'
import VideoItem from '../components/VideoItem'
import { getActiveGoal, type Goal } from '../lib/goals'
import { starVideo } from '../lib/study'
import { followChannel, muteChannel, searchVideos, unmuteChannel, type SearchResponse } from '../lib/search'

export default function Search() {
  const location = useLocation()
  const handedOver = (location.state as { q?: string } | null)?.q ?? ''
  const [query, setQuery] = useState(handedOver)
  const [data, setData] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [lastHidden, setLastHidden] = useState<string | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)

  // Topic ideas for the empty screen come from her own goal.
  useEffect(() => {
    getActiveGoal()
      .then((g) => setGoal(g && g.id ? g : null))
      .catch(() => setGoal(null))
  }, [])

  async function run(q: string, keepNotice = false) {
    if (!q.trim()) return
    setBusy(true)
    setError(null)
    if (!keepNotice) {
      setNotice(null)
      setLastHidden(null)
    }
    setShowHidden(false)
    try {
      setData(await searchVideos(q.trim()))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.')
    } finally {
      setBusy(false)
    }
  }

  // A topic tapped on Home arrives in memory (not in the URL) and runs straight away.
  useEffect(() => {
    if (handedOver) run(handedOver)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handedOver])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    run(query)
  }

  async function onMute(channelId: string) {
    await muteChannel(channelId)
    setNotice('Channel hidden. It won’t appear in your search or feed again.')
    setLastHidden(channelId)
    run(query, true)
  }

  async function onUndoHide() {
    if (!lastHidden) return
    await unmuteChannel(lastHidden)
    setLastHidden(null)
    setNotice('Channel is back.')
    run(query, true)
  }

  async function onStar(videoId: string) {
    await starVideo(videoId, true)
    setLastHidden(null)
    setNotice('Starred. Find it in Library → Starred.')
  }

  async function onFollow(channelId: string) {
    await followChannel(channelId)
    setNotice('Following this channel. Its new videos come to your Home feed.')
  }

  return (
    <section>
      <div className="page-head">
        <h1>Search</h1>
      </div>
      <form className="search-form" role="search" onSubmit={onSubmit}>
        <label htmlFor="q" className="visually-hidden">
          Search a topic
        </label>
        <div className="search-box">
          <SearchIcon size={20} aria-hidden="true" />
          <input
            id="q"
            type="search"
            placeholder="e.g. CMA Inter cost accounting"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
          />
        </div>
        <button type="submit" disabled={busy || !query.trim()}>
          {busy ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="notice-line" role="status">
          {notice}{' '}
          {lastHidden && (
            <button className="link" onClick={onUndoHide}>
              Undo
            </button>
          )}
        </p>
      )}
      {data?.note && <p className="notice-line">{data.note}</p>}

      {!data && !busy && (
        <>
          {goal && goal.topics.length > 0 && (
            <>
              <h2>Topics for your goal</h2>
              <div className="chips">
                {goal.topics.map((t) => (
                  <button
                    key={t.id}
                    className="chip"
                    onClick={() => {
                      setQuery(t.query)
                      run(t.query)
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="card empty">
            <span className="icon-circle">
              <EyeOff size={22} aria-hidden="true" />
            </span>
            <h3>A calmer YouTube</h3>
            <p className="help">No Shorts, no entertainment, no autoplay. Open any lecture to take notes on it.</p>
          </div>
        </>
      )}
      {busy && !data && (
        <ul className="video-list" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="skeleton" style={{ aspectRatio: '16 / 12' }} />
          ))}
        </ul>
      )}

      {data && (
        <>
          <ul className="video-list" aria-label="Results">
            {data.results.map((v) => (
              <VideoItem key={v.video_id} video={v} onMute={onMute} onFollow={onFollow} onStar={onStar} />
            ))}
            {showHidden &&
              data.hidden.map((v) => (
                <VideoItem
                  key={v.video_id}
                  video={v}
                  hiddenBecause={v.reasons}
                  playable={v.playable}
                  onFollow={onFollow}
                />
              ))}
          </ul>
          {data.results.length === 0 && data.hidden.length === 0 && data.mode !== 'quota_exhausted' && (
            <p>No results. Try different words.</p>
          )}
          <HiddenLine hidden={data.hidden} shown={showHidden} onToggleShow={() => setShowHidden(!showHidden)} />
        </>
      )}
    </section>
  )
}
