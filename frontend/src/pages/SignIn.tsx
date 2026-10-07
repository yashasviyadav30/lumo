import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import GoogleButton from '../components/GoogleButton'
import { nextAfterSignIn } from '../lib/groups'
import { useSession } from '../lib/session'

export default function SignIn() {
  const { signIn, googleAuth } = useSession()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function attempt(work: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await work()
      navigate(nextAfterSignIn(), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    attempt(() => signIn(String(form.get('email')), String(form.get('password'))))
  }

  return (
    <section className="auth card">
      <h1>Sign in</h1>
      <GoogleButton onCredential={(credential) => attempt(() => googleAuth({ credential }))} />
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" spellCheck={false} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="help">
        Forgot your password? If your email is a Gmail address, tap Continue with Google above: it opens the same
        account.
      </p>
      <p>
        New here? <Link to="/sign-up">Create an account</Link>
      </p>
    </section>
  )
}
