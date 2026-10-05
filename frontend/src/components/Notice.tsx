import { Link } from 'react-router'
import { APP_NAME } from '../config'

// The first-run notice (plan 2.7). Placeholder until the lawyer's version (step 13.1).
export default function Notice() {
  return (
    <div className="notice">
      <h2>What {APP_NAME} stores, and why</h2>
      <ul>
        <li>
          <strong>Your email</strong>, and your password stored scrambled. If you continue with Google, we get your
          Google email only, and there is no password.
        </li>
        <li>
          <strong>That you confirmed you’re 18 or over.</strong> We don’t keep your date of birth.
        </li>
        <li>
          <strong>What you choose:</strong> your goal, the channels you follow, what you hide or mark “Not interested”,
          and your settings, so Home shows what you want to learn.
        </li>
        <li>
          <strong>What you write:</strong> your notes, marks, doubts and notepad, and where you stopped in each video.
        </li>
        <li>
          <strong>Study groups:</strong> the name you choose in each group, and your posts and replies. Members of that
          group see them. Reports you make are kept so the group can stay safe.
        </li>
        <li>
          <strong>Feedback</strong> you send from Settings.
        </li>
        <li>
          <strong>AI notes:</strong> made by Google’s Gemini from the public video only. Nothing you type is sent to
          Gemini. Notes are shared with everyone who opens that video and deleted after 30 days.
        </li>
        <li>
          <strong>Video details from YouTube</strong> (titles, channels), for up to 30 days, then deleted. If you import
          your YouTube subscriptions, we read them once with your permission and keep only the channels you then
          follow.
        </li>
        <li>
          <strong>A basic request log</strong> for security, kept 1 year in India. It never lists the videos you watch.
          Your recent searches stay on your device.
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
