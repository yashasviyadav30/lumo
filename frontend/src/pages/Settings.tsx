import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { APP_NAME } from '../config'
import { useSession } from '../lib/session'

export default function Settings() {
  const { me, signOut, deleteAccount } = useSession()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onDelete() {
    setError(null)
    try {
      const note = await deleteAccount()
      navigate('/welcome', { replace: true, state: { note } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t delete. Please try again.')
    }
  }

  return (
    <section>
      <div className="page-head">
        <h1>Settings</h1>
        <p>
          <Link to="/personal">Back to Personal</Link>
        </p>
      </div>

      <div className="card settings-section">
        <h2>Account</h2>
        <p>Signed in as {me?.email}</p>
        <button className="secondary" onClick={() => signOut().then(() => navigate('/welcome'))}>
          Sign out
        </button>
      </div>

      <div className="card settings-section">
        <h2>Delete my data</h2>
        <p>
          This deletes your account and everything {APP_NAME} stored for it, straight away. It doesn’t delete anything
          on YouTube.
        </p>
        {!confirming ? (
          <button className="danger" onClick={() => setConfirming(true)}>
            Delete my data
          </button>
        ) : (
          <div className="confirm" role="group" aria-label="Confirm deletion">
            <p>
              <strong>Are you sure?</strong> This can’t be undone.
            </p>
            <button className="danger" onClick={onDelete}>
              Yes, delete everything
            </button>{' '}
            <button className="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="card settings-section">
        <h2>About</h2>
        <p>
          {APP_NAME} shows YouTube videos through YouTube’s own player. It’s not made by YouTube or Google. We try to
          hide harmful content, but no filter is perfect. <Link to="/privacy">Privacy</Link>
        </p>
      </div>
    </section>
  )
}
