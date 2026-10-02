import { useState } from 'react'
import TimeText from './TimeText'

// The video's description from YouTube, folded to a few lines like YouTube does. Chapter times are tappable.
export default function Description({ text, onSeek }: { text: string; onSeek: (t: number) => void }) {
  const [open, setOpen] = useState(false)
  if (!text.trim()) return <p className="help">This video has no description.</p>
  const long = text.length > 280 || text.split('\n').length > 4
  return (
    <div className={`description${open || !long ? ' open' : ''}`}>
      <p className="description-text">
        <TimeText text={text} onSeek={onSeek} />
      </p>
      {long && (
        <button className="link" onClick={() => setOpen(!open)}>
          {open ? 'Show less' : '…more'}
        </button>
      )}
    </div>
  )
}
