import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Player from '../components/Player'
import { clock, dueCards, gradeCard, lectureTitle, type ReviewCard } from '../lib/study'

type Grade = 'forgot' | 'unsure' | 'knew'

// Review her own cards. No streaks, no scores: when they're done, she's done (R8).
export default function Cards() {
  const [cards, setCards] = useState<ReviewCard[] | null>(null)
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const [replay, setReplay] = useState<{ start: number; end: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dueCards()
      .then((r) => setCards(r.cards))
      .catch(() => setError('Couldn’t load your cards. Check your connection.'))
  }, [])

  if (error) return <p className="error">{error}</p>
  if (!cards) return <p aria-busy="true">Loading…</p>

  const card = cards[i]
  if (!card) {
    return (
      <section className="review-done">
        <h1>{cards.length ? 'Done. Sleep well.' : 'No cards due'}</h1>
        <p className="help">
          {cards.length
            ? 'These come back when you are about to forget them.'
            : 'Make cards from your notes on any lecture. They come back here on the right day.'}
        </p>
        <Link to="/" className="button secondary">
          Back to Home
        </Link>
      </section>
    )
  }

  const next = () => {
    setShown(false)
    setReplay(null)
    setI(i + 1)
  }

  const grade = async (g: Grade) => {
    const r = await gradeCard(card.id, g)
    if (g === 'forgot' && r.replay) {
      setReplay(r.replay)
      // Forgotten cards come back at the end of this session.
      setCards([...cards, card])
    } else next()
  }

  return (
    <section className="review">
      <p className="help">
        Card {i + 1} of {cards.length} · from {lectureTitle(card.video, card.video_id)} at {clock(card.t_seconds)}
      </p>
      <div className="card-face">
        <p className="card-front">{card.front}</p>
        {shown && (
          <p className="card-answer">
            <span className="help">Your note: </span>
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
            Ask me again later
          </button>
        </div>
      ) : !shown ? (
        <button className="primary-wide" onClick={() => setShown(true)}>
          Show answer
        </button>
      ) : (
        <div className="grades" role="group" aria-label="How did it go?">
          <button className="secondary" onClick={() => grade('forgot')}>
            Forgot
          </button>
          <button className="secondary" onClick={() => grade('unsure')}>
            Not sure
          </button>
          <button onClick={() => grade('knew')}>Knew it</button>
        </div>
      )}
    </section>
  )
}
