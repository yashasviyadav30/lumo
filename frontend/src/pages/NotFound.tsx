import { Link } from 'react-router'
import { Compass } from '../components/icons'

export default function NotFound() {
  return (
    <section className="card empty tint-peach not-found">
      <span className="icon-circle">
        <Compass size={24} aria-hidden="true" />
      </span>
      <h1>This page isn’t here</h1>
      <p className="help">The link may be old or mistyped. Your videos and notes are safe.</p>
      <Link className="button" to="/">
        Go to Home
      </Link>
    </section>
  )
}
