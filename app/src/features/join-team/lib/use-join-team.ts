import { useNavigate } from '@tanstack/react-router'
import { useAcceptInvitation } from '@shared/api/invitations'
import { useTranslation } from 'react-i18next'

/**
 * Thin wiring over useAcceptInvitation for /onboarding/join. Accepting sets the Active Team server
 * side (ADR-0023 §4), so `/` lands them in the Team they joined.
 *
 * useAcceptInvitation throws one generic Error for invalid and expired alike — the accept endpoint
 * returns 404 for both deliberately, so there is no oracle.
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
    ? acceptInvitation.error instanceof Error && acceptInvitation.error.message === 'invite link invalid or expired'
      ? t('invite.join.invalidOrExpired')
      : t('invite.join.genericError')
    : null

  return { join, isPending: acceptInvitation.isPending, errorMessage }
}
