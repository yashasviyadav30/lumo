import { Check, CircleCheck, Layers, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router'
import Player from '../components/Player'
import { clock, dueCards, gradeCard, lectureTitle, type ReviewCard } from '../lib/study'

type Grade = 'forgot' | 'unsure' | 'knew'
const SWIPE_PX = 90

// Review her own cards. No streaks, no scores: when they're done, she's done (R8).
export default function Cards() {
  const [cards, setCards] = useState<ReviewCard[] | null>(null)
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const [replay, setReplay] = useState<{ start: number; end: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reviewed, setReviewed] = useState(0)
  const [dx, setDx] = useState(0)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    dueCards()
      .then((r) => setCards(r.cards))
      .catch(() => setError('Couldn’t load your cards. Check your connection.'))
  }, [])

  if (error) return <p className="error">{error}</p>
  if (!cards) return <div className="skeleton" style={{ height: 260, marginTop: 24 }} aria-busy="true" />

  const card = cards[i]
  if (!card) {
    return (
      <section className="review-done">
        <div className="done-icon">{cards.length ? <CircleCheck size={44} aria-hidden="true" /> : <Layers size={40} aria-hidden="true" />}</div>
        <h1>{cards.length ? 'Done. Sleep well.' : 'No cards due'}</h1>
        <p className="help">
          {cards.length
            ? `You went through ${reviewed} card${reviewed === 1 ? '' : 's'}. They come back when you are about to forget them.`
            : 'Make cards from your notes on any lecture. They come back here on the right day.'}
        </p>
        <div className="actions">
          <Link to="/" className="button secondary">
            Back to Home
          </Link>
        </div>
      </section>
    )
  }

  const next = () => {
    setShown(false)
    setReplay(null)
    setDx(0)
    setI(i + 1)
  }

  const grade = async (g: Grade) => {
    const r = await gradeCard(card.id, g)
    setReviewed((n) => n + 1)
    if (g === 'forgot' && r.replay) {
      setDx(0)
      setReplay(r.replay)
      // Forgotten cards come back at the end of this session.
      setCards([...cards, card])
    } else next()
  }

  // Swipe the revealed card: left = Forgot, right = Knew it. Buttons below do the same.
  const onDown = (e: PointerEvent) => {
    if (shown && !replay) startX.current = e.clientX
  }
  const onMove = (e: PointerEvent) => {
    if (startX.current !== null) setDx(e.clientX - startX.current)
  }
  const onUp = () => {
    if (startX.current === null) return
    startX.current = null
    if (dx > SWIPE_PX) grade('knew')
    else if (dx < -SWIPE_PX) grade('forgot')
    else setDx(0)
  }

  const tint = dx > 30 ? 'var(--green)' : dx < -30 ? 'var(--danger)' : undefined
  return (
    <section className="review">
      <div className="title-row">
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>Revision</h1>
        <span className="badge violet">
          {i + 1} / {cards.length}
        </span>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(i / cards.length) * 100}%` }} />
      </div>

      <div
        className="card-face"
        style={{ transform: dx ? `translateX(${dx}px) rotate(${dx / 30}deg)` : undefined, borderColor: tint }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={() => !shown && setShown(true)}
      >
        <span className="from">
          {lectureTitle(card.video, card.video_id)} · {clock(card.t_seconds)}
        </span>
        <p className="card-front">{card.front}</p>
        {shown && (
          <p className="card-answer">
            <span className="help">Your note</span>
            {card.answer}
          </p>
        )}
      </div>

      {replay ? (
        <div className="replay">
          <h2>Watch this bit</h2>
          <p className="help">
            Only the part around your note ({clock(replay.start)} to {clock(replay.end)}).
          </p>
          <Player videoId={card.video_id} start={replay.start} end={replay.end} />
          <button className="primary-wide" onClick={next}>
            <RotateCcw size={18} aria-hidden="true" /> Ask me again later
          </button>
        </div>
      ) : !shown ? (
        <button className="primary-wide gradient" onClick={() => setShown(true)}>
          Show answer
        </button>
      ) : (
        <>
          <p className="swipe-hint">Swipe left if you forgot, right if you knew it</p>
          <div className="grades" role="group" aria-label="How did it go?">
            <button className="forgot" onClick={() => grade('forgot')}>
              <X size={18} aria-hidden="true" />
              Forgot
            </button>
            <button className="unsure" onClick={() => grade('unsure')}>
              <span aria-hidden="true">~</span>
              Not sure
            </button>
            <button className="knew" onClick={() => grade('knew')}>
              <Check size={18} aria-hidden="true" />
              Knew it
            </button>
          </div>
        </>
      )}
    </section>
  )
}
