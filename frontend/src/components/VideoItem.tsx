import { Ban, EllipsisVertical, EyeOff, Star, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { APP_NAME } from '../config'
import { ago, formatDuration, type VideoCard } from '../lib/search'
import type { Notice, VideoActions } from '../lib/useVideoActions'

type Props = {
  video: VideoCard
  progress?: number // seconds watched here: drawn as a red line under the thumbnail
  hiddenBecause?: string[] // shown when a hidden video is revealed with "Show"
  playable?: boolean
  actions?: Partial<VideoActions>
}

// One ⋮ menu per card, like YouTube, instead of a row of buttons under every video.
function CardMenu({ video, actions }: { video: VideoCard; actions: Partial<VideoActions> }) {
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
  const item = (label: string, Icon: typeof Star, fn: ((id: string) => unknown) | undefined, id: string) =>
    fn && (
      <button
        role="menuitem"
        onClick={() => {
          setOpen(false)
          fn(id)
        }}
      >
        <Icon size={17} aria-hidden="true" /> {label}
      </button>
    )
  return (
    <div className="card-menu" ref={ref}>
      <button className="menu-btn" aria-label="More actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <EllipsisVertical size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="menu" role="menu">
          {item('Star video', Star, actions.onStar, video.video_id)}
          {item('Follow channel', UserPlus, actions.onFollow, video.channel_id)}
          {item('Not interested', EyeOff, actions.onNotInterested, video.video_id)}
          {item('Don’t show this channel', Ban, actions.onMute, video.channel_id)}
        </div>
      )}
    </div>
  )
}

export function NoticeLine({ notice, onUndo }: { notice: Notice | null; onUndo: () => void }) {
  if (!notice) return null
  return (
    <p className="notice-line" role="status">
      {notice.text}{' '}
      {notice.undo && (
        <button className="link" onClick={onUndo}>
          Undo
        </button>
      )}
    </p>
  )
}

// YouTube's thumbnail and title are shown exactly as YouTube gives them: nothing is drawn over the thumbnail (R7).
export default function VideoItem({ video, progress, hiddenBecause, playable = true, actions }: Props) {
  const sub = [video.channel_title, video.live === 'live' ? 'LIVE' : formatDuration(video.duration_s), ago(video.published_at)]
    .filter(Boolean)
    .join(' · ')
  const pct = progress && video.duration_s ? Math.min(100, Math.max(3, (progress / video.duration_s) * 100)) : 0
  const to = `/watch/${video.video_id}`
  const thumb = (
    <>
      <div className="vcard-thumb">
        {video.thumbnail_url && <img src={video.thumbnail_url} alt="" loading="lazy" width={320} height={180} />}
      </div>
      {pct > 0 && (
        <span className="vcard-watched">
          <span style={{ width: `${pct}%` }} />
        </span>
      )}
    </>
  )
  const text = (
    <>
      <span className="vcard-title">{video.title}</span>
      <span className="vcard-sub">{sub}</span>
      {pct > 0 && <span className="visually-hidden">, watched {Math.round(pct)}%</span>}
    </>
  )
  return (
    <li className={`vcard${hiddenBecause ? ' revealed' : ''}`}>
      {playable ? (
        <Link className="vcard-link" to={to} tabIndex={-1} aria-hidden="true">
          {thumb}
        </Link>
      ) : (
        <div className="vcard-link disabled">{thumb}</div>
      )}
      <div className="vcard-body">
        {playable ? (
          <Link className="vcard-link" to={to}>
            {text}
          </Link>
        ) : (
          <div className="vcard-link disabled" aria-disabled="true">
            {text}
          </div>
        )}
        <div className="vcard-menu-slot">{actions && <CardMenu video={video} actions={actions} />}</div>
      </div>
      {hiddenBecause && (
        <p className="hidden-reason">
          Hidden by {APP_NAME}: {hiddenBecause.join('; ')}
          {!playable && ' · Can’t play in this app'}
        </p>
      )}
    </li>
  )
}
