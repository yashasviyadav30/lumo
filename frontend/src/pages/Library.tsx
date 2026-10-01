import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { lectureTitle, notebook, type Notebook } from '../lib/study'

// Lectures she has studied, newest notes first. Titles are fetched fresh from YouTube, never stored.
export default function Library() {
  const [book, setBook] = useState<Notebook | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    notebook('')
      .then(setBook)
      .catch(() => setError(true))
  }, [])

  return (
    <section>
      <h1>Library</h1>
      {error && <p className="error">Couldn’t load your lectures.</p>}
      {!book && !error && <p aria-busy="true">Loading…</p>}
      {book && book.lectures.length === 0 && (
        <p className="help">
          Lectures you take notes on show up here. <Link to="/search">Find a lecture</Link>
        </p>
      )}
      <ul className="video-list">
        {book?.lectures.map((l) => {
          const doubts = l.notes.filter((n) => n.kind === 'doubt' && !n.solved).length
          return (
            <li key={l.video_id} className="video">
              <Link to={`/watch/${l.video_id}`} className="video-link">
                {l.video?.thumbnail_url && (
                  <span className="thumb">
                    <img src={l.video.thumbnail_url} alt="" loading="lazy" />
                  </span>
                )}
                <span className="meta">
                  <span className="title">{lectureTitle(l.video, l.video_id)}</span>
                  {l.video && <span className="channel">{l.video.channel_title}</span>}
                  <span className="channel">
                    {l.notes.length} note{l.notes.length === 1 ? '' : 's'}
                    {doubts ? ` · ${doubts} open doubt${doubts === 1 ? '' : 's'}` : ''}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
