import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { parseInviteToken } from '../lib/parse-invite-token'

interface JoinTeamViewProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (token: string) => void
  submitting?: boolean
  error?: string | null
}

/**
 * Presentational paste-your-invite UI (the /onboarding/join fork branch). value/onChange are
 * controlled by the route container rather than owned locally, so a failed submit can be retried
 * without losing what was pasted. Accepts a full invite URL or a bare token — parsed via the pure
 * parseInviteToken before onSubmit ever sees it.
 */
export function JoinTeamView({ value, onChange, onSubmit, submitting, error }: JoinTeamViewProps) {
  const { t } = useTranslation()
  const canSubmit = value.trim().length > 0 && !submitting

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(parseInviteToken(value))
  }

  return (
    <div>
      <h1 className="font-display text-title font-bold">{t('joinTeam.heading')}</h1>
      <p className="mt-2 text-small text-muted-foreground">
        {t('joinTeam.intro')}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="invite-token">{t('joinTeam.inviteLink')}</Label>
          <Input
            id="invite-token"
            value={value}
            disabled={submitting}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://app.teambalance.nl/invite/..."
          />
        </div>
        {error && (
          <p role="alert" className="text-small text-red-ink">
            {error}
          </p>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? t('joinTeam.joining') : t('joinTeam.join')}
        </Button>
      </form>

      <details className="mt-8 text-small text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground">{t('joinTeam.noLink')}</summary>
        <p className="mt-2">
          {t('joinTeam.askAdmin')}
        </p>
        <p className="mt-2">
          {t('joinTeam.ownTeam')}{' '}
          {/* Plain anchor, not router Link — keeps this view router-free so it stays story-able. */}
          <a href="/create-team" className="text-blue underline">
            {t('joinTeam.createTeam')}
          </a>
        </p>
      </details>
    </div>
  )
}
