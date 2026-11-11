import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TeamRequest, TeamRequestErrorCode } from '@shared/api/team-requests'
import { Button } from '@shared/ui/button'
import { FormError } from '@shared/ui/FormError'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Textarea } from '@shared/ui/textarea'
import { deriveRequestTeamState } from '../lib/request-team-state'

export const TEAM_NAME_MAX = 100
export const PURPOSE_MAX = 1000

interface RequestTeamViewProps {
  /** The caller's latest request; null/undefined when they never made one. */
  request?: TeamRequest | null
  isLoading?: boolean
  isSubmitting?: boolean
  /** The failure from the last submit, shown inline. */
  errorCode?: TeamRequestErrorCode | null
  onSubmit: (values: { teamName: string; purpose: string }) => void
  /** Opens /create-team, with the approved code and name prefilled when given. */
  onOpenCreateTeam: (prefill?: { code: string; name: string }) => void
}

/**
 * The "get a team" card shown on the onboarding hub and the Teams view (ADR-0047). Prop-only; the
 * query and mutation live in the container. Which state shows is decided by deriveRequestTeamState.
 */
export function RequestTeamView({
  request,
  isLoading,
  isSubmitting,
  errorCode,
  onSubmit,
  onOpenCreateTeam,
}: RequestTeamViewProps) {
  const { t } = useTranslation()
  const state = deriveRequestTeamState(request)

  // A real href so open-in-new-tab works; a plain click navigates inside the SPA instead.
  const link = (prefill?: { code: string; name: string }) => ({
    href: prefill ? `/create-team?${new URLSearchParams(prefill)}` : '/create-team',
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      onOpenCreateTeam(prefill)
    },
  })

  return (
    <div className="rounded-lg border border-border p-4 text-left">
      <h2 className="font-display text-lead font-bold">{t('requestTeam.title')}</h2>

      {isLoading && <p className="mt-2 text-small text-muted-foreground">{t('account.loading')}</p>}

      {!isLoading && state.kind === 'pending' && (
        <p className="mt-2 text-small" role="status">
          {t('requestTeam.pending', { name: state.teamName })}
        </p>
      )}

      {!isLoading && state.kind === 'approved' && (
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-small">{t('requestTeam.approvedHint')}</p>
          <Button asChild>
            <a {...link({ code: state.code, name: state.teamName })}>
              {t('requestTeam.approvedCta', { name: state.teamName })}
            </a>
          </Button>
        </div>
      )}

      {!isLoading && state.kind === 'rejected' && (
        <div className="mt-2 text-small" role="status">
          <p className="font-semibold">{t('requestTeam.rejected')}</p>
          {state.reason && <p className="mt-1 text-muted-foreground">{t('requestTeam.rejectedReason', { reason: state.reason })}</p>}
          <p className="mt-1 text-muted-foreground">{t('requestTeam.askAgain')}</p>
        </div>
      )}

      {!isLoading && (state.kind === 'form' || state.kind === 'rejected') && (
        <RequestForm isSubmitting={isSubmitting} errorCode={errorCode} onSubmit={onSubmit} />
      )}

      <p className="mt-4 text-small">
        <a {...link()} className="text-blue underline">
          {t('requestTeam.haveCode')}
        </a>
      </p>
    </div>
  )
}

function RequestForm({
  isSubmitting,
  errorCode,
  onSubmit,
}: Pick<RequestTeamViewProps, 'isSubmitting' | 'errorCode' | 'onSubmit'>) {
  const { t } = useTranslation()
  const nameId = useId()
  const purposeId = useId()
  const [teamName, setTeamName] = useState('')
  const [purpose, setPurpose] = useState('')
  const canSubmit = teamName.trim().length > 0 && purpose.trim().length > 0 && !isSubmitting

  const fieldError = (code: 'INVALID_NAME' | 'INVALID_PURPOSE') =>
    errorCode === code ? <p className="mt-1 text-small text-red-ink">{t(`errors.teamRequest.${code}`)}</p> : null

  return (
    <form
      className="mt-3 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (canSubmit) onSubmit({ teamName: teamName.trim(), purpose: purpose.trim() })
      }}
    >
      <p className="text-small text-muted-foreground">{t('requestTeam.intro')}</p>
      {(errorCode === 'NOT_PENDING' || errorCode === 'GENERIC') && (
        <FormError>{t(errorCode === 'NOT_PENDING' ? 'requestTeam.alreadyPending' : 'errors.teamRequest.generic')}</FormError>
      )}
      <div>
        <Label htmlFor={nameId}>{t('requestTeam.teamName')}</Label>
        <Input
          id={nameId}
          value={teamName}
          maxLength={TEAM_NAME_MAX}
          disabled={isSubmitting}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder={t('createTeam.namePlaceholder')}
        />
        {fieldError('INVALID_NAME')}
      </div>
      <div>
        <Label htmlFor={purposeId}>{t('requestTeam.purpose')}</Label>
        <Textarea
          id={purposeId}
          value={purpose}
          maxLength={PURPOSE_MAX}
          disabled={isSubmitting}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder={t('requestTeam.purposePlaceholder')}
        />
        {fieldError('INVALID_PURPOSE')}
      </div>
      <Button type="submit" disabled={!canSubmit}>
        {isSubmitting ? t('requestTeam.submitting') : t('requestTeam.submit')}
      </Button>
    </form>
  )
}
