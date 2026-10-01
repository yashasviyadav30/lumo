import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import Notice from '../components/Notice'
import { APP_NAME } from '../config'
import { ApiError } from '../lib/api'
import { useSession } from '../lib/session'

export default function SignUp() {
  const { signUp } = useSession()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)
    try {
      await signUp({
        email: String(form.get('email')),
        password: String(form.get('password')),
        date_of_birth: String(form.get('dob')),
        accepted_notice: form.get('notice') === 'on',
      })
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.code === 'under_18') {
        navigate('/not-yet', { replace: true })
        return
      }
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth card">
      <h1>Create your {APP_NAME} account</h1>
      <Notice />
      <form onSubmit={onSubmit} noValidate={false}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password (at least 8 characters)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <label htmlFor="dob">Date of birth</label>
        <input id="dob" name="dob" type="date" required aria-describedby="dob-help" />
        <p id="dob-help" className="help">
          Used once to check you’re 18 or over. We don’t keep it.
        </p>
        <label className="check">
          <input name="notice" type="checkbox" required /> I’ve read what {APP_NAME} stores and why
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </section>
  )
}
