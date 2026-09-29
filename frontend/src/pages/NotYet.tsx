import { Link } from 'react-router'
import { APP_NAME } from '../config'

// R10: under-18s can't have an account yet. Nothing about them was stored.
export default function NotYet() {
  return (
    <section className="narrow">
      <h1>Not yet, sorry</h1>
      <p>
        {APP_NAME} is for people aged 18 and over for now. We’re working on a family account so younger students can
        join with a parent’s permission.
      </p>
      <p>We haven’t saved anything you typed.</p>
      <Link to="/welcome">Back</Link>
    </section>
  )
}
