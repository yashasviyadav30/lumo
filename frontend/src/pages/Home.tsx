import { Link } from 'react-router'
import { APP_TAGLINE } from '../config'

export default function Home() {
  return (
    <section>
      <h1>{APP_TAGLINE}</h1>
      <p>Tell us what you’re learning, and your feed will show only that.</p>
      <Link className="button" to="/search">
        Search a topic
      </Link>
    </section>
  )
}
