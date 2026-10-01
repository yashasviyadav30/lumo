import { Library as LibraryIcon } from 'lucide-react'
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
      <div className="page-head">
        <h1>Library</h1>
        <p>Every lecture you have taken notes on.</p>
      </div>
      {error && <p className="error">Couldn’t load your lectures.</p>}
      {!book && !error && <div className="skeleton" style={{ height: 180 }} aria-busy="true" />}
      {book && book.lectures.length === 0 && (
        <div className="card empty">
          <span className="icon-circle">
            <LibraryIcon size={22} aria-hidden="true" />
          </span>
          <h3>Your shelf is empty</h3>
          <p className="help">Lectures you take notes on show up here.</p>
          <div className="actions">
            <Link to="/search" className="button">
              Find a lecture
            </Link>
          </div>
        </div>
      )}
      <ul className="video-list">
        {book?.lectures.map((l) => {
          const doubts = l.notes.filter((n) => n.kind === 'doubt' && !n.solved).length
          return (
            <li key={l.video_id} className="video">
              <Link to={`/watch/${l.video_id}`} className="video-link">
                <span className="thumb">{l.video?.thumbnail_url && <img src={l.video.thumbnail_url} alt="" loading="lazy" />}</span>
                <span className="meta">
                  <span className="title">{lectureTitle(l.video, l.video_id)}</span>
                  {l.video && <span className="channel">{l.video.channel_title}</span>}
                  <span className="counts">
                    <span className="badge violet">
                      {l.notes.length} note{l.notes.length === 1 ? '' : 's'}
                    </span>
                    {doubts > 0 && (
                      <span className="badge bad">
                        {doubts} open doubt{doubts === 1 ? '' : 's'}
                      </span>
                    )}
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
