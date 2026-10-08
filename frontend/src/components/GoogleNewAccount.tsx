import { useState, type FormEvent } from 'react'
import { APP_NAME } from '../config'
import Notice from './Notice'

// Google said yes, but this email has no Thrywe account yet: the only things left are the 18+ check (R10) and the
// notice. Asked right here, with Google's answer kept, so nobody has to press the Google button twice.
export default function GoogleNewAccount({
  busy,
  initialDob = '',
  onCreate,
  onCancel,
}: {
  busy: boolean
  initialDob?: string
  onCreate: (dob: string) => void
  onCancel: () => void
}) {
  const [dob, setDob] = useState(initialDob)
  const [notice, setNotice] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (dob && notice) onCreate(dob)
  }
  return (
    <form className="google-new" onSubmit={submit}>
      <h2>One last step</h2>
      <p className="help">Your Google account is new to {APP_NAME}. Confirm two things and you’re in.</p>
      <label htmlFor="g-dob">Date of birth</label>
      <input id="g-dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} aria-describedby="g-dob-help" />
      <p id="g-dob-help" className="help">
        Used once to check you’re 18 or over. We don’t keep it.
      </p>
      <details className="notice-fold">
        <summary>What {APP_NAME} stores, and why</summary>
        <Notice />
      </details>
      <label className="check">
        <input type="checkbox" required checked={notice} onChange={(e) => setNotice(e.target.checked)} /> I’ve read what{' '}
        {APP_NAME} stores and why
      </label>
      <button type="submit" disabled={busy || !dob || !notice}>
        {busy ? 'Creating…' : 'Create my account'}
      </button>
      <button type="button" className="link" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
