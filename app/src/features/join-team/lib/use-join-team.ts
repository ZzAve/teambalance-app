import { useNavigate } from '@tanstack/react-router'
import { ApiError } from '@shared/api/api-error'
import { useAcceptInvitation } from '@shared/api/invitations'
import { useTranslation } from 'react-i18next'

/**
 * Thin wiring over useAcceptInvitation for /onboarding/join. Accepting sets the Active Team server
 * side (ADR-0023 §4), so `/` lands them in the Team they joined.
 *
 * useAcceptInvitation throws one ApiError (status 404, or 401) for invalid and expired alike — the accept
 * endpoint returns 404 for both deliberately, so there is no oracle.
 */
export function useJoinTeam() {
  const navigate = useNavigate()
  const acceptInvitation = useAcceptInvitation()
  const { t } = useTranslation()

  const join = (token: string) => {
    acceptInvitation.mutate(token, {
      onSuccess: () => navigate({ to: '/' }),
    })
  }

  const errorMessage = acceptInvitation.isError
    ? acceptInvitation.error instanceof ApiError && [401, 404].includes(acceptInvitation.error.status)
      ? t('invite.join.invalidOrExpired')
      : t('invite.join.genericError')
    : null

  return { join, isPending: acceptInvitation.isPending, errorMessage }
}
