import { Link } from 'react-router'
import { APP_NAME } from '../config'
import { formatDuration, type VideoCard } from '../lib/search'

type Props = {
  video: VideoCard
  hiddenBecause?: string[] // shown when a hidden video is revealed with "Show"
  playable?: boolean
  onMute?: (channelId: string) => void
  onFollow?: (channelId: string) => void
}

// YouTube's thumbnail and title are shown exactly as YouTube gives them: nothing is drawn over the thumbnail.
export default function VideoItem({ video, hiddenBecause, playable = true, onMute, onFollow }: Props) {
  const body = (
    <>
      <div className="thumb">
        {video.thumbnail_url && <img src={video.thumbnail_url} alt="" loading="lazy" />}
      </div>
      <div className="meta">
        <span className="title">{video.title}</span>
        <span className="channel">
          {[video.live === 'live' ? 'LIVE' : formatDuration(video.duration_s), video.channel_title].filter(Boolean).join(' · ')}
        </span>
      </div>
    </>
  )
  return (
    <li className={`video${hiddenBecause ? ' revealed' : ''}`}>
      {playable ? (
        <Link className="video-link" to={`/watch/${video.video_id}`}>
          {body}
        </Link>
      ) : (
        <div className="video-link disabled" aria-disabled="true">
          {body}
        </div>
      )}
      {hiddenBecause && (
        <p className="hidden-reason">
          Hidden by {APP_NAME}: {hiddenBecause.join('; ')}
          {!playable && ' · Can’t play in this app'}
        </p>
      )}
      {(onMute || onFollow) && (
        <div className="video-actions">
          {onFollow && (
            <button className="link" onClick={() => onFollow(video.channel_id)}>
              Follow teacher
            </button>
          )}
          {onMute && (
            <button className="link" onClick={() => onMute(video.channel_id)}>
              Mute channel
            </button>
          )}
        </div>
      )}
    </li>
  )
}
