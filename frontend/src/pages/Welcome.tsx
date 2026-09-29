import { Link } from 'react-router'
import Logo from '../components/Logo'
import { APP_NAME, APP_TAGLINE } from '../config'

export default function Welcome() {
  return (
    <section className="narrow welcome">
      <Logo size={64} />
      <h1>{APP_NAME}</h1>
      <p className="lead">{APP_TAGLINE}</p>
      <p>
        Tell it what you’re learning. It searches YouTube for you, hides entertainment and distractions, and always
        shows you what it hid.
      </p>
      <div className="actions">
        <Link className="button" to="/sign-up">
          Get started
        </Link>
        <Link className="button secondary" to="/sign-in">
          Sign in
        </Link>
      </div>
      <p className="help">For ages 18 and over.</p>
    </section>
  )
}
