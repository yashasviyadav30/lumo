import { Link, useParams } from 'react-router'
import Player from '../components/Player'
import { VIDEO_ID } from '../lib/youtube'

export default function Watch() {
  const { videoId = '' } = useParams()

  if (!VIDEO_ID.test(videoId)) {
    return (
      <section>
        <h1>Video not found</h1>
        <p>That link doesn’t point to a YouTube video.</p>
        <Link to="/search">Search instead</Link>
      </section>
    )
  }

  return (
    <section className="watch">
      <Player videoId={videoId} />
      <p className="attribution">
        Video plays from YouTube.{' '}
        <a href={`https://www.youtube.com/watch?v=${videoId}`} rel="noopener">
          Watch on YouTube
        </a>
      </p>
    </section>
  )
}
