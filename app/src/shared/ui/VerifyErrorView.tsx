import { Link } from '@tanstack/react-router'
import { Button } from '@shared/ui/button'

interface VerifyErrorViewProps {
  /** The failure copy — a missing/expired magic link, or the invite-accept-failure message. */
  message: string
  /**
   * Local escape hatch (ADR-0027 §3): a client-only `clearSession()`. Present when a session exists —
   * or might (e.g. the "authenticated but stranded" invite-accept-failure); omitted once the auth
   * probe has resolved to "no user".
   */
  onLogout?: () => void
}

/**
 * The `/auth/verify` error state, rendered *instead of* RootLayout (ADR-0027 §3). "Back to login" is
 * always offered; the escape hatch is added when a session exists — most importantly the
 * "authenticated but stranded, no team" invite-accept-failure edge, where a client-only logout is the
 * only way out. Prop-only; the container reads the session and passes `onLogout`.
 */
export function VerifyErrorView({ message, onLogout }: VerifyErrorViewProps) {
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <h1 className="font-display text-2xl font-bold">Link expired</h1>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Link to="/login" className="text-sm font-medium text-blue">
          Back to login
        </Link>
        {onLogout && (
          <Button variant="ghost" onClick={onLogout}>
            Log out
          </Button>
        )}
      </div>
    </div>
  )
}
