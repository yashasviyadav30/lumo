import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>
    </section>
  )
}
