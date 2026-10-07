import { ArrowUpRight, ChatCircleText, Clock, EyeSlash, HighlighterCircle, ImageSquare, Lightning, Sparkle, TreeStructure, UsersThree } from '../components/icons'
import { Link, useLocation } from 'react-router'
import { Orb } from '../components/Logo'
import { APP_NAME } from '../config'
import { pendingJoin } from '../lib/groups'
import { useSession } from '../lib/session'

// Sample content for the live previews below: a real-looking lecture, drawn with the app's own components' styles.
const POINTS = [
  ['0:04', 'What a neuron holds', 'A number between 0 and 1: its activation.'],
  ['3:40', 'Layers', 'Pixels in, digits out, patterns in between.'],
  ['9:09', 'Weights and biases', 'How strongly one neuron pushes the next.'],
]

function SummaryPreview() {
  return (
    <div className="lp-card lp-summary" aria-hidden="true">
      <p className="lp-card-k">
        <Sparkle size={14} weight="fill" /> Brief summary
      </p>
      <p className="lp-summary-text">How a network of simple “neurons” learns to read handwritten digits.</p>
      <ol>
        {POINTS.map(([t, title, text]) => (
          <li key={t}>
            <span className="lp-time">{t}</span>
            <span>
              <b>{title}</b>
              <small>{text}</small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// A small mind map drawn in SVG; its branches draw themselves in.
function MapPreview() {
  const leaves = [
    { x: 196, y: 26, label: 'Neurons' },
    { x: 196, y: 82, label: 'Layers' },
    { x: 196, y: 138, label: 'Weights' },
    { x: 196, y: 194, label: 'Learning' },
  ]
  return (
    <svg className="lp-map" viewBox="0 0 300 220" aria-hidden="true">
      {leaves.map((l, i) => (
        <path key={l.label} className="lp-edge" style={{ animationDelay: `${0.2 + i * 0.15}s` }} d={`M104 110 C 150 110, 150 ${l.y}, ${l.x} ${l.y}`} />
      ))}
      <g className="lp-node root">
        <rect x="8" y="90" width="96" height="40" rx="12" />
        <text x="56" y="115" textAnchor="middle">
          Neural nets
        </text>
      </g>
      {leaves.map((l, i) => (
        <g key={l.label} className="lp-node" style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
          <rect x={l.x} y={l.y - 16} width="92" height="32" rx="10" />
          <text x={l.x + 46} y={l.y + 5} textAnchor="middle">
            {l.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function Welcome() {
  const { farewell } = useSession()
  const note = (useLocation().state as { note?: string } | null)?.note ?? farewell
  return (
    <section className="lp">
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

      <div className="lp-hero">
        <div className="lp-hero-text">
          <h1>
            Learn anything from YouTube. <span className="lp-glow-text">Without the noise.</span>
          </h1>
          <p className="lp-lead">
            {APP_NAME} keeps the lessons, hides the distractions, and turns any video into a summary and a mind map.
          </p>
          <div className="lp-actions">
            <Link className="button lp-cta" to="/sign-up">
              Start free <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </Link>
            <Link className="button secondary" to="/sign-in">
              Sign in
            </Link>
          </div>
        </div>
        <div className="lp-stage" aria-hidden="true">
          <div className="lp-orb">
            <Orb size={260} />
          </div>
          <div className="lp-float one">
            <SummaryPreview />
          </div>
          <div className="lp-float two">
            <div className="lp-card lp-mini-map">
              <p className="lp-card-k">
                <TreeStructure size={14} weight="fill" /> Mind map
              </p>
              <MapPreview />
            </div>
          </div>
        </div>
      </div>

      <h2 className="lp-section-title">Everything a learner needs. Nothing they don’t.</h2>
      <div className="lp-bento">
        <article className="lp-tile big">
          <span className="lp-icon">
            <Sparkle size={22} />
          </span>
          <h3>A summary in about 30 seconds</h3>
          <p>A brief summary and the key points of any video, each with a time you can tap to jump there.</p>
          <SummaryPreview />
        </article>
        <article className="lp-tile tall">
          <span className="lp-icon">
            <TreeStructure size={22} />
          </span>
          <h3>A mind map you can explore</h3>
          <p>Zoom, drag, tap a box for the detail, and play exactly that part of the video.</p>
          <div className="lp-card">
            <MapPreview />
          </div>
        </article>
        <article className="lp-tile stat">
          <span className="lp-icon">
            <EyeSlash size={22} />
          </span>
          <p className="lp-stat">Off</p>
          <h3>songs, games and comedy, from the start</h3>
          <p>Switch any of them back on in Settings. Creators you follow always show, whatever they post.</p>
        </article>
        <article className="lp-tile wide">
          <span className="lp-icon">
            <UsersThree size={22} />
          </span>
          <h3>Study together</h3>
          <p>Groups with an invite link. Share a video, ask a doubt at the exact second, answer in threads.</p>
          <div className="lp-chat" aria-hidden="true">
            <p className="lp-bubble">
              <b>Riya</b> At <span className="lp-time">14:20</span> I lost it. Why does the bias move the curve?
            </p>
            <p className="lp-bubble me">
              <b>Arjun</b> It shifts when the neuron fires. Replay from 13:50, it clicks.
            </p>
          </div>
        </article>
        <article className="lp-tile">
          <span className="lp-icon">
            <HighlighterCircle size={22} />
          </span>
          <h3>Your notes, your way</h3>
          <p>
            Highlights, coloured underlines, screenshots pasted straight in, and time stamps that jump back to the moment.
          </p>
          <p className="lp-icons-row" aria-hidden="true">
            <HighlighterCircle size={20} /> <ImageSquare size={20} /> <Clock size={20} /> <ChatCircleText size={20} />
          </p>
        </article>
        <article className="lp-tile">
          <span className="lp-icon">
            <Lightning size={22} />
          </span>
          <h3>Made for your path</h3>
          <p>UPSC, CA, coding, spoken English, anything. Your Home fills with topics, topper interviews and podcasts for it.</p>
        </article>
      </div>

      <div className="lp-final">
        <Orb size={56} />
        <h2>Your next video could be the one that makes it click.</h2>
        <Link className="button lp-cta" to="/sign-up">
          Start free <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>

      <footer className="lp-foot">
        <span>For ages 18 and over. Videos play in YouTube’s own player; not made by YouTube or Google.</span>
        <Link to="/privacy">Privacy</Link>
      </footer>
    </section>
  )
}
