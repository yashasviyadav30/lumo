import { Link } from 'react-router'
import { APP_NAME } from '../config'

// The first-run notice (plan 2.7). Placeholder until the lawyer's version (step 13.1).
export default function Notice() {
  return (
    <div className="notice">
      <h2>What {APP_NAME} stores, and why</h2>
      <ul>
        <li>
          <strong>Your email and password</strong> (the password is stored scrambled), so you can sign in.
        </li>
        <li>
          <strong>That you confirmed you’re 18 or over.</strong> We don’t keep your date of birth.
        </li>
        <li>
          <strong>Your goals, mutes and settings</strong>, so your feed shows what you’re learning.
        </li>
        <li>
          <strong>Video details from YouTube</strong> (titles, channels), for up to 30 days, then deleted.
        </li>
        <li>
          <strong>A basic request log</strong> for security, kept 1 year in India. It never lists the videos you watch.
        </li>
      </ul>
      <p>
        You can delete your account and everything we stored at any time in Settings. We try to hide harmful content,
        but no filter is perfect.
      </p>
      <p>
        Videos play from YouTube, so{' '}
        <a href="https://www.youtube.com/t/terms" rel="noopener">
          YouTube’s Terms of Service
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/privacy" rel="noopener">
          Google’s Privacy Policy
        </a>{' '}
        also apply. Read our <Link to="/privacy">privacy page</Link>.
      </p>
    </div>
  )
}
