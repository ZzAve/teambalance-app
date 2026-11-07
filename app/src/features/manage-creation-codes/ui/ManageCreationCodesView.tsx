import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CreationCode } from '@shared/api/creation-codes'
import { Button } from '@shared/ui/button'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
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
  const { t } = useTranslation()
  const [confirmTarget, setConfirmTarget] = useState<CreationCode | null>(null)

  return (
    <div>
      <h2 className="font-display text-title font-bold">{t('account.creationCodes')}</h2>
      <p className="mt-1 text-small text-muted-foreground">
        {t('creationCodes.intro')}
      </p>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isForbidden && (
        <p className="mt-4 text-small text-muted-foreground">{t('creationCodes.forbidden')}</p>
      )}
      {isError && !isForbidden && (
        <p className="mt-4 text-small text-red-ink">{t('creationCodes.loadFailed')}</p>
      )}

      {!isLoading && !isError && !isForbidden && (
        <div className="mt-4 flex flex-col gap-3">
          <div>
            <Button disabled={isSaving} onClick={onCreate}>
              {t('creationCodes.generate')}
            </Button>
          </div>

          {errorCode === 'CONSUMED' && (
            <p className="text-small text-red-ink">{t('creationCodes.consumed')}</p>
          )}

          {codes.length === 0 ? (
            <p className="text-small text-muted-foreground">{t('creationCodes.empty')}</p>
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

          <ConfirmDialog
            open={confirmTarget !== null}
            title={t('creationCodes.revokeTitle')}
            description={t('creationCodes.revokeDescription', { code: confirmTarget?.code })}
            confirmLabel={t('creationCodes.revoke')}
            onConfirm={() => {
              if (confirmTarget) onRevoke(confirmTarget)
              setConfirmTarget(null)
            }}
            onCancel={() => setConfirmTarget(null)}
          />
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
  const { t } = useTranslation()
  return (
    <li className="flex items-center gap-3 p-3">
      {/* Status stacked under the code rather than beside it, as TeamsView/PlatformTeamsView stack
          name over slug: beside it, the badge started wherever the code's own width happened to end. */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-small font-medium tracking-wide">{code.code}</p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-caption font-semibold ${STATUS_STYLES[status]}`}>
          {creationCodeStatusLabel(status)}
        </span>
      </div>
      {/* Only an unconsumed code can be revoked; a consumed one is an audit record (backend 409s). */}
      {status !== 'consumed' && (
        <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => onRequestRevoke(code)}>
          {t('creationCodes.revoke')}
        </Button>
      )}
    </li>
  )
}
