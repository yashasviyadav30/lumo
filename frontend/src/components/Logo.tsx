// Lumo's mark: a sun rising over an open book, the light you learn by. Pastel butter, lavender and pink from the
// app's palette on an ink tile. Our own design, nothing like YouTube's red play button (R9).
const Mark = () => (
  <>
    <circle cx="32" cy="33" r="15" fill="#fbe38e" />
    <path d="M8 37Q20.5 31 31 38.5V53Q20.5 46 8 51Z" fill="#c9c3f5" />
    <path d="M56 37Q43.5 31 33 38.5V53Q43.5 46 56 51Z" fill="#f6bed6" />
  </>
)

// The mark without its tile, for dark backgrounds.
export function Orb({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="4 14 56 44" aria-hidden="true" focusable="false" className={className}>
      <Mark />
    </svg>
  )
}

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className="logo-tile">
      <rect width="64" height="64" rx="18" fill="#16151a" />
      <Mark />
    </svg>
  )
}
