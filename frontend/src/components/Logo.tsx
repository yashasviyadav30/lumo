import { useId } from 'react'

// Lumo's mark: a starlight orb on a midnight tile, the light you learn by. The orb is also the "o" of the name.
// Our own design, nothing like YouTube's red play button (R9).
export function Orb({ size = 24, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <radialGradient id={`${id}h`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8fb2ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8fb2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}o`} cx="40%" cy="36%" r="64%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#e6eeff" />
          <stop offset="72%" stopColor="#a9c4ff" />
          <stop offset="100%" stopColor="#5c7fd6" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill={`url(#${id}h)`} />
      <circle cx="20" cy="20" r="11.5" fill={`url(#${id}o)`} />
      <ellipse cx="16.4" cy="15.6" rx="3.4" ry="2.4" fill="#ffffff" opacity="0.8" transform="rotate(-28 16.4 15.6)" />
    </svg>
  )
}

export default function Logo({ size = 32 }: { size?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className="logo-tile">
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16203a" />
          <stop offset="100%" stopColor="#070a14" />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8fb2ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8fb2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}o`} cx="40%" cy="36%" r="64%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#e6eeff" />
          <stop offset="72%" stopColor="#a9c4ff" />
          <stop offset="100%" stopColor="#5c7fd6" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${id}t)`} />
      <circle cx="32" cy="32" r="26" fill={`url(#${id}h)`} />
      <circle cx="32" cy="32" r="14" fill={`url(#${id}o)`} />
      <ellipse cx="27.6" cy="27" rx="4.2" ry="2.9" fill="#ffffff" opacity="0.8" transform="rotate(-28 27.6 27)" />
    </svg>
  )
}
