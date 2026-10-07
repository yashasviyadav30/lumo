import { useRouteError } from 'react-router'
import Logo from './Logo'

// Shown instead of the router's developer page when a screen fails to load. The usual cause: Lumo was updated
// while this tab was open, so the old screen file is gone. A reload fetches the new version.
export default function RouteError() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : ''
  const updated = /dynamically imported module|Importing a module script failed|error loading dynamically/i.test(message)
  return (
    <div className="boot" role="alert">
      <Logo size={56} />
      <h1 className="route-error-title">{updated ? 'Lumo was just updated' : 'Something went wrong'}</h1>
      <span>{updated ? 'Reload to open the new version. Your notes are safe.' : 'Reload the page, or go back to Home.'}</span>
      <div className="route-error-actions">
        <button onClick={() => window.location.reload()}>Reload</button>
        {!updated && (
          <a className="button secondary" href="/">
            Go to Home
          </a>
        )}
      </div>
    </div>
  )
}
