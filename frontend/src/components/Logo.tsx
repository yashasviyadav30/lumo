import { useId } from 'react'

// Our own mark: a focus ring on a violet tile. Deliberately nothing like YouTube's red play button (R9).
export default function Logo({ size = 32 }: { size?: number }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5847e8" />
          <stop offset=".55" stopColor="#8a5cf6" />
          <stop offset="1" stopColor="#c264d8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <circle cx="32" cy="32" r="16" fill="none" stroke="#fff" strokeWidth="5" />
      <circle cx="32" cy="32" r="6" fill="#ffc24a" />
    </svg>
  )
}
