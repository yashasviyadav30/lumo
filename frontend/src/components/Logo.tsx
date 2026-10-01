// Our own mark: a focus ring on a lime tile. Deliberately nothing like YouTube's red play button (R9).
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="#c6f432" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="#0a0b09" strokeWidth="5" />
      <circle cx="32" cy="32" r="6" fill="#0a0b09" />
    </svg>
  )
}
