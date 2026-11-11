import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TeamRequest, TeamRequestErrorCode } from '@shared/api/team-requests'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { i18n } from '@shared/i18n/i18n'

export const REASON_MAX = 500

interface TeamRequestsViewProps {
  requests?: TeamRequest[]
  isLoading?: boolean
  isError?: boolean
  isSaving?: boolean
  /** Failure of the last approve/reject, shown inline. */
  errorCode?: TeamRequestErrorCode | null
  onApprove: (request: TeamRequest) => void
  /** `reason` is undefined when the admin left it blank. */
  onReject: (request: TeamRequest, reason: string | undefined) => void
}

const STATUS_STYLES = {
  APPROVED: 'bg-green/12 text-green',
  REJECTED: 'bg-muted text-muted-foreground',
  PENDING: 'bg-blue/10 text-blue',
}

const date = (iso: string) => new Date(iso).toLocaleDateString(i18n.language)

/**
 * Platform-admin list of team requests (ADR-0047): the pending ones with Approve / Reject (optional
 * reason), then the recently decided ones. Local state is only which row's reject form is open.
 * A 403 renders nothing here: the creation-codes view below already shows the no-access shell.
 */
export function TeamRequestsView({
  requests = [],
  isLoading,
  isError,
  isSaving,
  errorCode,
  onApprove,
  onReject,
}: TeamRequestsViewProps) {
  const { t } = useTranslation()
  const pending = requests.filter((r) => r.status === 'PENDING')
  const decided = requests.filter((r) => r.status !== 'PENDING')

  return (
    <section>
      <h2 className="font-display text-title font-bold">{t('teamRequests.title')}</h2>

      {isLoading && <p className="mt-4 text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="mt-4 text-small text-red-ink">{t('teamRequests.loadFailed')}</p>}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-4">
          {errorCode && (
            <p role="alert" className="text-small text-red-ink">
              {t(errorCode === 'NOT_PENDING' ? 'teamRequests.alreadyDecided' : 'errors.teamRequest.generic')}
            </p>
          )}

          {pending.length === 0 ? (
            <p className="text-small text-muted-foreground">{t('teamRequests.nonePending')}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {pending.map((r) => (
                <PendingRow key={r.id} request={r} isSaving={isSaving} onApprove={onApprove} onReject={onReject} />
              ))}
            </ul>
          )}

          {decided.length > 0 && (
            <div>
              <h3 className="mb-2 text-small font-semibold">{t('teamRequests.decided')}</h3>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {decided.map((r) => (
                  <li key={r.id} className="p-3">
                    <p className="font-medium">{r.teamName}</p>
                    <p className="text-small text-muted-foreground">{r.requesterEmail}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-caption font-semibold ${STATUS_STYLES[r.status]}`}
                    >
                      {t(`teamRequests.status.${r.status}`)}
                    </span>
                    <span className="ml-2 text-caption text-muted-foreground">{date(r.decidedAt ?? r.requestedAt)}</span>
                    {r.rejectReason && (
                      <p className="mt-1 text-small text-muted-foreground">{t('requestTeam.rejectedReason', { reason: r.rejectReason })}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function PendingRow({
  request,
  isSaving,
  onApprove,
  onReject,
}: {
  request: TeamRequest
  isSaving?: boolean
  onApprove: (request: TeamRequest) => void
  onReject: (request: TeamRequest, reason: string | undefined) => void
}) {
  const { t } = useTranslation()
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const reasonId = `reject-reason-${request.id}`

  return (
    <li className="flex flex-col gap-2 p-3">
      <div className="min-w-0">
        <p className="font-medium">{request.teamName}</p>
        <p className="text-small text-muted-foreground">
          {request.requesterEmail} · {date(request.requestedAt)}
        </p>
        <p className="mt-1 whitespace-pre-line break-words text-small">{request.purpose}</p>
      </div>

      {rejecting ? (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            onReject(request, reason.trim() || undefined)
            setRejecting(false)
            setReason('')
          }}
        >
          <Label htmlFor={reasonId}>{t('teamRequests.reasonLabel')}</Label>
          <Input id={reasonId} value={reason} maxLength={REASON_MAX} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit" variant="destructive" size="sm" disabled={isSaving}>
              {t('teamRequests.confirmReject')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setRejecting(false)}>
              {t('teamRequests.cancel')}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" disabled={isSaving} onClick={() => onApprove(request)}>
            {t('teamRequests.approve')}
          </Button>
          <Button variant="outline" size="sm" disabled={isSaving} onClick={() => setRejecting(true)}>
            {t('teamRequests.reject')}
          </Button>
        </div>
      )}
    </li>
  )
}
