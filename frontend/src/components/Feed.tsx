import { useEffect, useState } from 'react'
import { followChannel, getFeed, muteChannel, searchVideos, unmuteChannel, type FeedResponse } from '../lib/search'
import { starVideo } from '../lib/study'
import HiddenLine from './HiddenLine'
import VideoItem from './VideoItem'

type Chip = { id: string; name: string; query: string | null }

// YouTube-style Home feed: a chip bar ("For you" + her topics) over a grid of videos.
// "For you" mixes new uploads from channels she follows with her goal's topics. A topic chip shows that
// topic's search in place. The same hide list applies everywhere, and hidden videos are always listed (R6).
export default function Feed({ topics }: { topics: Array<{ id: string; name: string; query: string }> }) {
  const chips: Chip[] = [{ id: 'for-you', name: 'For you', query: null }, ...topics.map((t) => ({ ...t }))]
  const [active, setActive] = useState('for-you')
  const [data, setData] = useState<FeedResponse | null>(null)
  const [error, setError] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [lastHidden, setLastHidden] = useState<string | null>(null)

  const load = (chip: Chip) => {
    setData(null)
    setError(false)
    setShowHidden(false)
    const req = chip.query ? searchVideos(chip.query) : getFeed()
    return req.then(setData).catch(() => setError(true))
  }

  useEffect(() => {
    load(chips[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first load only; chips reload on tap
  }, [])

  const pick = (chip: Chip) => {
    setActive(chip.id)
    setNotice(null)
    load(chip)
  }
  const current = chips.find((c) => c.id === active) ?? chips[0]

  async function onMute(channelId: string) {
    await muteChannel(channelId)
    setLastHidden(channelId)
    setNotice('Channel hidden. It won’t come back in your feed or search.')
    setData((d) => d && { ...d, results: d.results.filter((v) => v.channel_id !== channelId) })
  }
  async function onUndo() {
    if (!lastHidden) return
    await unmuteChannel(lastHidden)
    setLastHidden(null)
    setNotice('Channel is back.')
    load(current)
  }
  async function onStar(videoId: string) {
    await starVideo(videoId, true)
    setLastHidden(null)
    setNotice('Starred. Find it in Library → Starred.')
  }
  async function onFollow(channelId: string) {
    await followChannel(channelId)
    setLastHidden(null)
    setNotice('Following. This channel’s new videos will come to your feed.')
  }

  return (
    <div className="feed">
      {chips.length > 1 && (
        <div className="chips scroll" role="group" aria-label="Feed">
          {chips.map((c) => (
            <button
              key={c.id}
              className={`chip${c.id === active ? ' on' : ''}`}
              aria-pressed={c.id === active}
              onClick={() => pick(c)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      {notice && (
        <p className="notice-line" role="status">
          {notice}{' '}
          {lastHidden && (
            <button className="link" onClick={onUndo}>
              Undo
            </button>
          )}
        </p>
      )}
      {error && <p className="error">Couldn’t load videos. Check your connection and try again.</p>}
      {!data && !error && (
        <ul className="video-list" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="skeleton" style={{ aspectRatio: '16 / 12' }} />
          ))}
        </ul>
      )}
      {data && (
        <>
          {data.results.length === 0 && (
            <div className="card empty">
              <h3>Nothing here yet</h3>
              <p className="help">Set a goal or follow a few channels, and your feed fills up.</p>
            </div>
          )}
          <ul className="video-list" aria-label="Your feed">
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
          <HiddenLine hidden={data.hidden} shown={showHidden} onToggleShow={() => setShowHidden(!showHidden)} />
        </>
      )}
    </div>
  )
}
