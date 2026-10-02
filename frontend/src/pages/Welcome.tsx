import { ArrowUpRight, EyeOff, Layers, Play, ShieldCheck, StickyNote } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { APP_NAME } from '../config'
import { useSession } from '../lib/session'

const FEATURES = [
  { Icon: EyeOff, title: 'Only study videos', text: 'All of YouTube minus songs, movies, shows, news and vlogs. You always see what was hidden.' },
  { Icon: StickyNote, title: 'Notes beside the lecture', text: 'Mark a second in one tap, or open the notepad beside the video. Every note jumps back to its moment.' },
  { Icon: Layers, title: 'Cards that come back', text: 'Your notes return as cards right before you forget. Forgot one? Re-watch just those 90 seconds.' },
]

// A drawing of the study page, so people see the app before signing up. Decorative only.
function PhoneMock() {
  return (
    <div className="stage" aria-hidden="true">
      <span className="orbit" />
      <span className="orbit two" />
      <div className="phone">
        <div className="notch" />
        <div className="vid">
          <Play size={26} fill="currentColor" />
        </div>
        <div className="bar">
          <span>Mark</span>
          <span>Doubt</span>
          <span>Star</span>
          <span>−10s</span>
        </div>
        <div className="n">
          <b>12:40</b> CSR spend = 2% of average net profit
        </div>
        <div className="n">
          <b>18:05</b> BRSR is for the top 1000 listed companies
        </div>
        <div className="n">
          <b>24:31</b> <i>Doubt: does Section 8 count?</i>
        </div>
        <div className="due">Tonight: 5 cards to review →</div>
      </div>
    </div>
  )
}

export default function Welcome() {
  const { farewell } = useSession()
  const note = (useLocation().state as { note?: string } | null)?.note ?? farewell
  return (
    <section className="landing">
      {note && (
        <p className="notice-line" role="status">
          {note}
        </p>
      )}
      <div className="landing-hero">
        <div>
          <p className="kicker">Keep your study focused</p>
          <h1>
            Study <span className="hl">smarter</span> on YouTube, <span className="dim">without the rabbit holes.</span>
          </h1>
          <p className="lead">
            {APP_NAME} turns YouTube lectures into a study desk: clean search, notes on the exact second, doubts, and
            revision cards that come back on time.
          </p>
          <div className="actions">
            <Link className="button gradient" to="/sign-up">
              Get started
              <span className="arrow" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <Link className="button secondary" to="/sign-in">
              Sign in
            </Link>
          </div>
          <p className="trust">
            <span className="ring">
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            Free. No ads from us. Videos play through YouTube’s own player.
          </p>
        </div>
        <PhoneMock />
      </div>

      <h2 className="section-title">
        Your <span className="hl">study desk</span> <span className="dim">on YouTube.</span>
      </h2>
      <div className="feature-grid">
        {FEATURES.map(({ Icon, title, text }, i) => (
          <div key={title} className="card feature">
            <span className="num">{String(i + 1).padStart(2, '0')}.</span>
            <span className="icon-circle">
              <Icon size={22} aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <p className="help" style={{ textAlign: 'center' }}>
        For ages 18 and over. Not made by YouTube or Google.
      </p>
    </section>
  )
}
