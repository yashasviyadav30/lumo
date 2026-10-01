import { BookOpen, CircleHelp, EyeOff, Layers, MapPin, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import Logo from '../components/Logo'
import { APP_NAME } from '../config'

const FEATURES = [
  { Icon: EyeOff, tone: '', title: 'Only study videos', text: 'Search YouTube without Shorts, entertainment or rabbit holes. We always show you what we hid.' },
  { Icon: MapPin, tone: '', title: 'Notes on the exact second', text: 'Tap Mark while the teacher talks. Fill it in at the next pause. Tap it later to jump back.' },
  { Icon: CircleHelp, tone: 'orange', title: 'Park a doubt, keep going', text: 'Save a doubt in one tap without stopping the lecture. Solve it later.' },
  { Icon: Layers, tone: 'green', title: 'Cards from your own notes', text: 'Hide a few words, and the card comes back right before you forget. Forgot? Re-watch just those 90 seconds.' },
  { Icon: BookOpen, tone: 'amber', title: 'Your notebook', text: 'Every note, by lecture. Search it, filter doubts, export it.' },
  { Icon: Users, tone: 'pink', title: 'Study with friends', text: 'Send a doubt to a friend and get the answer back on the same second. Coming next.' },
]

export default function Welcome() {
  const note = (useLocation().state as { note?: string } | null)?.note
  return (
    <section className="landing">
      {note && (
        <p className="notice-line" role="status">
          {note}
        </p>
      )}
      <div className="landing-hero">
        <Logo size={64} />
        <h1>Study on YouTube. Skip the rabbit holes.</h1>
        <p>
          {APP_NAME} turns YouTube lectures into a study desk: clean search, notes on the exact second, doubts and
          revision cards that come back on time.
        </p>
        <div className="actions">
          <Link className="button" to="/sign-up">
            Get started
          </Link>
          <Link className="button secondary" to="/sign-in">
            Sign in
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        {FEATURES.map(({ Icon, tone, title, text }) => (
          <div key={title} className="card feature">
            <span className={`icon-circle ${tone}`}>
              <Icon size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="help" style={{ textAlign: 'center' }}>
        For ages 18 and over. Videos play through YouTube’s own player. Not made by YouTube or Google.
      </p>
    </section>
  )
}
