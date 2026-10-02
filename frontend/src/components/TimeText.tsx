import { clock, splitTimes } from '../lib/study'

const URL_RE = /(https?:\/\/[^\s]+)/
const IS_URL = /^https?:\/\//

// Text from YouTube (a description or a comment) with every "12:40" turned into a jump button and links kept
// as links. The words themselves are shown exactly as YouTube gives them.
export default function TimeText({ text, onSeek }: { text: string; onSeek: (t: number) => void }) {
  return (
    <>
      {splitTimes(text).map((p, i) =>
        p.t !== undefined ? (
          <button key={i} className="ts" onClick={() => onSeek(p.t!)} aria-label={`Jump to ${clock(p.t)}`}>
            {p.text}
          </button>
        ) : (
          p.text.split(URL_RE).map((chunk, j) =>
            IS_URL.test(chunk) ? (
              <a key={`${i}-${j}`} href={chunk} target="_blank" rel="noopener noreferrer nofollow">
                {chunk}
              </a>
            ) : (
              <span key={`${i}-${j}`}>{chunk}</span>
            ),
          )
        ),
      )}
    </>
  )
}
