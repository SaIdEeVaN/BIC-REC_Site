import { useEffect } from 'react'

// Sends the visitor to another site. Firebase already redirects a direct visit (firebase.json), so this only
// runs for in-app navigation, which never reaches the server. `replace` keeps the redirecting route out of
// history, so Back returns to the page the visitor came from.
export default function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  return (
    <div className="wrap section" role="status">
      <p className="meta">redirecting…</p>
      <p className="t-body mt-3">
        Taking you to{' '}
        <a href={to} className="font-bold underline decoration-2 underline-offset-4">
          {to.replace(/^https?:\/\//, '')}
        </a>
        .
      </p>
    </div>
  )
}
