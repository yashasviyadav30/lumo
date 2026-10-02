import { EllipsisVertical, EyeOff, Star, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { APP_NAME } from '../config'
import { ago, formatDuration, type VideoCard } from '../lib/search'

type Props = {
  video: VideoCard
  hiddenBecause?: string[] // shown when a hidden video is revealed with "Show"
  playable?: boolean
  onMute?: (channelId: string) => void
  onFollow?: (channelId: string) => void
  onStar?: (videoId: string) => void
}

// One ⋮ menu per card (like YouTube) instead of a row of buttons under every video.
function CardMenu({ video, onMute, onFollow, onStar }: Pick<Props, 'video' | 'onMute' | 'onFollow' | 'onStar'>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: Event) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  const pick = (fn?: (id: string) => void, id?: string) => () => {
    setOpen(false)
    fn?.(id!)
  }
  return (
    <div className="card-menu" ref={ref}>
      <button className="menu-btn" aria-label="More actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <EllipsisVertical size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="menu" role="menu">
          {onStar && (
            <button role="menuitem" onClick={pick(onStar, video.video_id)}>
              <Star size={16} aria-hidden="true" /> Star video
            </button>
          )}
          {onFollow && (
            <button role="menuitem" onClick={pick(onFollow, video.channel_id)}>
              <UserPlus size={16} aria-hidden="true" /> Follow channel
            </button>
          )}
          {onMute && (
            <button role="menuitem" onClick={pick(onMute, video.channel_id)}>
              <EyeOff size={16} aria-hidden="true" /> Hide channel
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// YouTube's thumbnail and title are shown exactly as YouTube gives them: nothing is drawn over the thumbnail.
export default function VideoItem({ video, hiddenBecause, playable = true, onMute, onFollow, onStar }: Props) {
  const meta = [
    video.channel_title,
    video.live === 'live' ? 'LIVE' : formatDuration(video.duration_s),
    ago(video.published_at),
  ].filter(Boolean)
  const body = (
    <>
      <div className="thumb">{video.thumbnail_url && <img src={video.thumbnail_url} alt="" loading="lazy" />}</div>
      <div className="meta">
        <span className="title">{video.title}</span>
        <span className="channel">{meta.join(' · ')}</span>
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
      {(onMute || onFollow || onStar) && <CardMenu video={video} onMute={onMute} onFollow={onFollow} onStar={onStar} />}
      {hiddenBecause && (
        <p className="hidden-reason">
          Hidden by {APP_NAME}: {hiddenBecause.join('; ')}
          {!playable && ' · Can’t play in this app'}
        </p>
      )}
    </li>
  )
}
