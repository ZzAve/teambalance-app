import { useState } from 'react'
import type { CreationCode } from '@shared/api/creation-codes'
import { Button } from '@shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { creationCodeStatusLabel, deriveCreationCodeStatus, type CreationCodeStatus } from '../lib/creation-code-status'

interface ManageCreationCodesViewProps {
  codes?: CreationCode[]
  isLoading?: boolean
  isError?: boolean
  /** 403 — the caller is not a platform admin; renders a no-access shell rather than an error. */
  isForbidden?: boolean
  isSaving?: boolean
  /** Backend error discriminator (e.g. CONSUMED), shown inline. */
  errorCode?: string | null
  /** Injected so status derivation is deterministic in tests; defaults to the real clock. */
  now?: Date
  onCreate: () => void
  onRevoke: (code: CreationCode) => void
}

const STATUS_STYLES: Record<CreationCodeStatus, string> = {
  active: 'bg-green/12 text-green',
  expired: 'bg-muted text-muted-foreground',
  consumed: 'bg-blue/10 text-blue',
}

/**
 * Presentational creation-codes admin UI. Owns only local view state (the revoke-confirm dialog
 * target); the query and mutations live in the container. State shells are props-driven so every
 * state is a no-network story (ADR-0017).
 */
export function ManageCreationCodesView({
  codes = [],
  isLoading,
  isError,
  isForbidden,
  isSaving,
  errorCode,
  now = new Date(),
  onCreate,
  onRevoke,
}: ManageCreationCodesViewProps) {
  const [confirmTarget, setConfirmTarget] = useState<CreationCode | null>(null)

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Creation codes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Generate one-time codes that let a new owner create a team.
      </p>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {isForbidden && (
        <p className="mt-4 text-sm text-muted-foreground">You don't have access to creation codes.</p>
      )}
      {isError && !isForbidden && (
        <p className="mt-4 text-sm text-red">Couldn't load creation codes. Please try again.</p>
      )}

      {!isLoading && !isError && !isForbidden && (
        <div className="mt-4 flex flex-col gap-3">
          <div>
            <Button disabled={isSaving} onClick={onCreate}>
              Generate code
            </Button>
          </div>

          {errorCode === 'CONSUMED' && (
            <p className="text-sm text-red">That code was already used and cannot be revoked.</p>
          )}

          {codes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No creation codes yet. Generate one above.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {codes.map((code) => (
                <CreationCodeRow
                  key={code.code}
                  code={code}
                  status={deriveCreationCodeStatus(code, now)}
                  isSaving={isSaving}
                  onRequestRevoke={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <Dialog
            open={confirmTarget !== null}
            onOpenChange={(open) => {
              if (!open) setConfirmTarget(null)
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Revoke code</DialogTitle>
                <DialogDescription>
                  Revoke "{confirmTarget?.code}"? It can no longer be used to create a team.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmTarget(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirmTarget) onRevoke(confirmTarget)
                    setConfirmTarget(null)
                  }}
                >
                  Revoke
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

interface CreationCodeRowProps {
  code: CreationCode
  status: CreationCodeStatus
  isSaving?: boolean
  onRequestRevoke: (code: CreationCode) => void
}

function CreationCodeRow({ code, status, isSaving, onRequestRevoke }: CreationCodeRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-3 p-3">
      <span className="font-mono text-sm font-medium tracking-wide">{code.code}</span>
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
        {creationCodeStatusLabel(status)}
      </span>
      {/* Only an unconsumed code can be revoked; a consumed one is an audit record (backend 409s). */}
      {status !== 'consumed' && (
        <Button
          variant="destructive"
          size="sm"
          className="ml-auto"
          disabled={isSaving}
          onClick={() => onRequestRevoke(code)}
        >
          Revoke
        </Button>
      )}
    </li>
  )
}
