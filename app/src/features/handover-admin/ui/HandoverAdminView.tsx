import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'

interface HandoverAdminViewProps {
  /** The active-admin-link read is in flight. */
  isLoading: boolean
  /** The active-admin-link read failed. */
  isError: boolean
  /** The team's current single-use admin handover link, or null if it has none. */
  link: string | null
  copied: boolean
  /** Set only for the moment after a revoke, to confirm the link is gone before offering a new one. */
  justRevoked: boolean
  isCreating: boolean
  isRotating: boolean
  isRevoking: boolean
  actionError: boolean
  onCopy: () => void
  onCreate: () => void
  onRotate: () => void
  onRevoke: () => void
}

/**
 * Presentational body of the admin handover control (ADR-0024 §5), mirroring the shareable-link
 * dialog: it renders exactly one of loading / error / just-revoked / no-link / the active link with
 * copy + rotate + revoke. The read, the mutations, and the copied/just-revoked flags live in the
 * HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).
 *
 * The link is read on load and survives a page refresh (ADR-0025's recoverability, extended here);
 * rotating replaces it (if it leaked) and revoking removes it — the same lifecycle as the player link,
 * but this link grants **Admin** and is spent on first accept, so the copy has to say both.
 */
export function HandoverAdminView({
  isLoading,
  isError,
  link,
  copied,
  justRevoked,
  isCreating,
  isRotating,
  isRevoking,
  actionError,
  onCopy,
  onCreate,
  onRotate,
  onRevoke,
}: HandoverAdminViewProps) {
  const heading = (
    <div>
      <h2 className="font-display text-2xl font-bold">Hand over as admin</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a single-use link that makes the first person who opens it an admin of this team. Send
        it to one person — anyone who opens it becomes an admin, and it stops working once used.
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {heading}

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load the admin link.</p>}

      {!isLoading && !isError && justRevoked && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            The link has been revoked. It can no longer make anyone an admin.
          </p>
          <Button type="button" onClick={onCreate} disabled={isCreating} className="self-start">
            {isCreating ? 'Creating…' : 'Create new admin link'}
          </Button>
          {actionError && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
        </div>
      )}

      {!isLoading && !isError && !justRevoked && !link && (
        <div className="flex flex-col gap-2">
          <Button type="button" onClick={onCreate} disabled={isCreating} className="self-start">
            {isCreating ? 'Creating…' : 'Create admin handover link'}
          </Button>
          {actionError && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
        </div>
      )}

      {!isLoading && !isError && !justRevoked && link && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input aria-label="Admin handover link" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
            <Button type="button" onClick={onCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onRotate} disabled={isRotating}>
              {isRotating ? 'Rotating…' : 'Rotate link'}
            </Button>
            <Button type="button" variant="destructive" onClick={onRevoke} disabled={isRevoking}>
              {isRevoking ? 'Revoking…' : 'Revoke link'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link grants admin and can be used once. Rotating replaces it with a new one; revoking
            removes it. Either way the old link stops working.
          </p>
          {actionError && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
        </div>
      )}
    </div>
  )
}
