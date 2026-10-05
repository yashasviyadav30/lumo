import { useId, useState } from 'react'
import { APP_NAME } from '../config'
import { reasonCounts, type HiddenCard } from '../lib/search'

type Props = { hidden: HiddenCard[]; shown: boolean; onToggleShow: () => void }

// "N hidden by Lumo · Why · Show" (R6). Says the app hid them, not YouTube (Policies III.C).
export default function HiddenLine({ hidden, shown, onToggleShow }: Props) {
  const [why, setWhy] = useState(false)
  const whyId = useId()
  if (hidden.length === 0) return null
  const playableCount = hidden.filter((h) => h.playable).length
  return (
    <div className="hidden-line">
      <p>
        <span>
          {hidden.length} hidden by {APP_NAME}
        </span>
        {' · '}
        <button className="link" aria-expanded={why} aria-controls={whyId} onClick={() => setWhy(!why)}>
          Why
        </button>
        {' · '}
        <button className="link" onClick={onToggleShow} aria-pressed={shown}>
          {shown ? 'Hide again' : 'Show'}
        </button>
      </p>
      {why && (
        <ul id={whyId} className="why">
          {reasonCounts(hidden).map(([reason, n]) => (
            <li key={reason}>
              {n} × {reason}
            </li>
          ))}
          {playableCount < hidden.length && (
            <li className="help">Videos that can’t play outside YouTube are listed but can’t be opened here.</li>
          )}
          <li className="help">These reasons come from {APP_NAME}, not from YouTube. You can change your mutes and Shorts setting in Settings.</li>
        </ul>
      )}
    </div>
  )
}
