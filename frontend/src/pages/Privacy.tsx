import Notice from '../components/Notice'
import { APP_NAME } from '../config'

// Draft privacy page (plan 2.7). The lawyer's version replaces it before launch (step 13.1).
export default function Privacy() {
  return (
    <section className="narrow">
      <h1>{APP_NAME} privacy (draft)</h1>
      <p className="help">This is a draft for testing. The final version will be reviewed by a lawyer before launch.</p>
      <Notice />
      <h2>Your choices</h2>
      <ul>
        <li>Delete your account and all its data at any time: Settings → Delete my data. We delete it at once.</li>
        <li>
          To control what Google stores, see{' '}
          <a href="https://myaccount.google.com/security" rel="noopener">
            Google’s security settings
          </a>
          .
        </li>
      </ul>
      <h2>Where your data is kept</h2>
      <p>Our database is in Mumbai, India. The app server runs in Singapore during testing.</p>
    </section>
  )
}
