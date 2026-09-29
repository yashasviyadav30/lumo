import { useState, type FormEvent } from 'react'
import HiddenLine from '../components/HiddenLine'
import VideoItem from '../components/VideoItem'
import { followChannel, muteChannel, searchVideos, type SearchResponse } from '../lib/search'

export default function Search() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  async function run(q: string, keepNotice = false) {
    if (!q.trim()) return
    setBusy(true)
    setError(null)
    if (!keepNotice) setNotice(null)
    setShowHidden(false)
    try {
      setData(await searchVideos(q.trim()))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.')
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    run(query)
  }

  async function onMute(channelId: string) {
    await muteChannel(channelId)
    setNotice('Channel muted. It won’t appear in your results.')
    run(query, true)
  }

  async function onFollow(channelId: string) {
    await followChannel(channelId)
    setNotice('Following this teacher. Their videos won’t be hidden by YouTube’s category.')
  }

  return (
    <section>
      <h1>Search</h1>
      <form className="search-form" role="search" onSubmit={onSubmit}>
        <label htmlFor="q" className="visually-hidden">
          Search a topic
        </label>
        <input
          id="q"
          type="search"
          placeholder="e.g. CMA Inter cost accounting"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          enterKeyHint="search"
        />
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
          {notice}
        </p>
      )}
      {data?.note && <p className="notice-line">{data.note}</p>}

      {data && (
        <>
          <ul className="video-list" aria-label="Results">
            {data.results.map((v) => (
              <VideoItem key={v.video_id} video={v} onMute={onMute} onFollow={onFollow} />
            ))}
            {showHidden &&
              data.hidden.map((v) => (
                <VideoItem key={v.video_id} video={v} hiddenBecause={v.reasons} playable={v.playable} onFollow={onFollow} />
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
