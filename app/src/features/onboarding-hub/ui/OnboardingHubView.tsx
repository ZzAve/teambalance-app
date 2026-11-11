import type { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface OnboardingHubViewProps {
  onChooseJoin: () => void
  /** The request-a-team card; a slot so this View stays free of network wiring. */
  requestTeam: ReactNode
  /**
   * They signed in from an Invite Link that had expired or been rotated by the time they clicked it
   * (#342). Naming it is the whole point: the sign-in worked, so without this they would be told only
   * that they have no team, and would have no idea the invite was the part that failed.
   */
  inviteUnavailable?: boolean
}

/**
 * Presentational onboarding fork for a signed-in, teamless user — replaces the old hard redirect
 * onto the create-team form. Deliberately not personalized (displayName is an email-derived
 * placeholder for new users). The route container owns navigation to /onboarding/join; the
 * request-a-team card (ADR-0047) owns the way on to /create-team.
 */
export function OnboardingHubView({ onChooseJoin, requestTeam, inviteUnavailable }: OnboardingHubViewProps) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto mt-10 max-w-sm text-center">
      <h1 className="font-display text-title font-bold">{t('onboarding.welcome')}</h1>
      {inviteUnavailable && (
        <p className="mt-3 rounded-lg border border-gold/40 bg-gold/10 p-3 text-small text-foreground">
          <Trans i18nKey="onboarding.inviteUnavailable" components={{ b: <span className="font-medium" /> }} />
        </p>
      )}
      <p className="mt-2 text-small text-muted-foreground">
        {inviteUnavailable
          ? t('onboarding.howToStart')
          : t('onboarding.signedInNoTeam')}
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <button
          type="button"
          onClick={onChooseJoin}
          className="rounded-lg border border-border bg-blue/5 p-4 text-left transition-colors hover:border-blue"
        >
          <span className="block font-display text-lead font-bold">{t('onboarding.haveInvite')}</span>
          <span className="mt-1 block text-small text-muted-foreground">{t('onboarding.sharedLink')}</span>
        </button>

        {requestTeam}
      </div>
    </div>
  )
}
