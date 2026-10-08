import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useBackToClose } from '../lib/useBackToClose'

export type PopItem = { label: string; hint?: string; onPick: () => void }

// A button that opens a short list of choices (Share: summary or brief summary). Back, Esc or a tap outside closes it.
export default function PopMenu({ children, items, className = 'small secondary' }: { children: ReactNode; items: PopItem[]; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useBackToClose(open, () => setOpen(false))
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
  return (
    <div className="pop-menu" ref={ref}>
      <button className={className} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {children}
      </button>
      {open && (
        <div className="menu" role="menu">
          {items.map((it) => (
            <button
              key={it.label}
              role="menuitem"
              onClick={() => {
                setOpen(false)
                it.onPick()
              }}
            >
              <span className="pop-label">{it.label}</span>
              {it.hint && <span className="pop-hint">{it.hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}