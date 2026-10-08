import { LINE, STACK, THRY, WE } from './wordmark'

// Thrywe's mark: the name itself, "Thry" in cream and "we" in butter, on the app's violet. Drawn as shapes, so it
// looks the same everywhere. Our own design, nothing like YouTube's red play button (R9).
const VIOLET = '#4b3fbf'
const CREAM = '#fbf7ef'
const BUTTER = '#fbe38e'

// The badge on one line, for top bars and loading screens. `size` is its height.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      height={size}
      width={(size * LINE.w) / LINE.h}
      viewBox={`${LINE.x} ${LINE.y} ${LINE.w} ${LINE.h}`}
      aria-hidden="true"
      focusable="false"
      className="logo-tile"
    >
      <rect x={LINE.x} y={LINE.y} width={LINE.w} height={LINE.h} rx={LINE.rx} fill={VIOLET} />
      <path fill={CREAM} d={THRY} />
      <path fill={BUTTER} d={WE} />
    </svg>
  )
}

// The square app icon: "Thry" over "we". Same drawing as the home-screen icon.
export function AppIcon({ size = 64, className }: { size?: number; className?: string }) {
  const w = STACK.x1 - STACK.x0
  const h = STACK.y1 - STACK.y0
  const side = w / 0.7 // the word block fills 70% of the tile's width
  const x = STACK.x0 - (side - w) / 2
  const y = STACK.y0 - (side - h) / 2
  return (
    <svg width={size} height={size} viewBox={`${x} ${y} ${side} ${side}`} aria-hidden="true" focusable="false" className={className}>
      <rect x={x} y={y} width={side} height={side} rx={side * 0.22} fill={VIOLET} />
      <path fill={CREAM} d={THRY} />
      <path fill={BUTTER} transform={`translate(${STACK.dx} ${STACK.lead})`} d={WE} />
    </svg>
  )
}
