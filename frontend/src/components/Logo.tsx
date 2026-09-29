// Our own mark: a focus ring on a deep blue tile. Deliberately nothing like YouTube's red play button (R9).
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#1f3a5f" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#f4c95d" strokeWidth="5" />
      <circle cx="32" cy="32" r="6" fill="#ffffff" />
    </svg>
  )
}
