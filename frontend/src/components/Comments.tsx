import { Clock, MessageSquareOff, ThumbsUp } from './icons'
import { useEffect, useState } from 'react'
import { ago } from '../lib/search'
import { getComments, hasTimes, type YtComment } from '../lib/study'
import TimeText from './TimeText'

// YouTube's top comments, as YouTube gives them. Students often post the times of the key parts, so those
// times are tappable and there is a "With times" filter (it looks at the comment's text, not the video's type).
export default function Comments({ videoId, onSeek }: { videoId: string; onSeek: (t: number) => void }) {
  const [data, setData] = useState<{ comments: YtComment[]; disabled: boolean } | null>(null)
  const [error, setError] = useState(false)
  const [onlyTimes, setOnlyTimes] = useState(false)

  useEffect(() => {
    getComments(videoId)
      .then(setData)
      .catch(() => setError(true))
  }, [videoId])

  if (error) return <p className="help">Couldn’t load comments right now.</p>
  if (!data) return <div className="skeleton" style={{ height: 160 }} aria-busy="true" />
  if (data.disabled || data.comments.length === 0)
    return (
      <div className="empty">
        <span className="icon-circle gray">
          <MessageSquareOff size={20} aria-hidden="true" />
        </span>
        <p className="help">{data.disabled ? 'Comments are turned off for this video.' : 'No comments yet.'}</p>
      </div>
    )

  const timed = data.comments.filter((c) => hasTimes(c.text))
  const list = onlyTimes ? timed : data.comments
  return (
    <div className="comments">
      <div className="segmented" role="group" aria-label="Show comments">
        <button className={!onlyTimes ? 'on' : ''} aria-pressed={!onlyTimes} onClick={() => setOnlyTimes(false)}>
          Top
        </button>
        <button className={onlyTimes ? 'on' : ''} aria-pressed={onlyTimes} onClick={() => setOnlyTimes(true)}>
          <Clock size={14} aria-hidden="true" /> With times ({timed.length})
        </button>
      </div>
      <ul className="comment-list">
        {list.map((c, i) => (
          <li key={i} className="comment">
            <span className="avatar small" aria-hidden="true">
              {c.author.replace('@', '')[0] ?? '·'}
            </span>
            <div>
              <p className="comment-meta">
                <b>{c.author}</b> · {ago(c.published_at)}
              </p>
              <p className="comment-text">
                <TimeText text={c.text} onSeek={onSeek} />
              </p>
              <p className="comment-meta">
                <ThumbsUp size={13} aria-hidden="true" /> {c.likes.toLocaleString('en-IN')}
                {c.replies > 0 && ` · ${c.replies} repl${c.replies === 1 ? 'y' : 'ies'} on YouTube`}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="attribution">Comments from YouTube.</p>
    </div>
  )
}
