import { ArrowUpRight, EyeOff, Network, Play, ShieldCheck, StickyNote } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { APP_NAME } from '../config'
import { pendingJoin } from '../lib/groups'
import { useSession } from '../lib/session'

const FEATURES = [
  { Icon: EyeOff, title: 'All of YouTube’s learning', text: 'Search anything and watch it here. Games, comedy, entertainment and songs stay hidden; you choose the rest. You always see what was hidden.' },
  { Icon: Network, title: 'A summary and mind map in one tap', text: 'A brief summary, key points and a zoomable mind map of any video, made by AI. Tap a time to jump to that part.' },
  { Icon: StickyNote, title: 'Your own notes beside the video', text: 'Write while you watch, stamp the time, copy the AI’s points in. Download as PDF or share on WhatsApp.' },
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
          <span>Notes</span>
          <span>Mind map</span>
          <span>My notes</span>
        </div>
        <div className="n">
          <b>12:40</b> CSR spend = 2% of average net profit
        </div>
        <div className="n">
          <b>18:05</b> BRSR is for the top 1000 listed companies
        </div>
        <div className="n">
          <b>24:31</b> Section 8 companies: who must report
        </div>
        <div className="due">Mind map ready →</div>
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
      {pendingJoin() && (
        <p className="notice-line" role="status">
          You’ve been invited to a study group. Sign up or sign in, and you’ll join it straight away.
        </p>
      )}
      <div className="landing-hero">
        <div>
          <p className="kicker">Learn anything, without the distractions</p>
          <h1>
            Study <span className="hl">smarter</span> on YouTube, <span className="dim">without the rabbit holes.</span>
          </h1>
          <p className="lead">
            {APP_NAME} is YouTube for learning: everything useful, nothing distracting, with a summary and a mind
            map of every video.
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
