import type { FormEvent } from 'react'
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
  const canSubmit = value.trim().length > 0 && !submitting

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(parseInviteToken(value))
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Join your team</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste the invite link you were sent below — or easiest of all, just click the link directly.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="invite-token">Invite link</Label>
          <Input
            id="invite-token"
            value={value}
            disabled={submitting}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://app.teambalance.nl/invite/..."
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? 'Joining…' : 'Join'}
        </Button>
      </form>

      <details className="mt-8 text-sm text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground">I don't have a link</summary>
        <p className="mt-2">
          Ask your team's captain or admin to send you the invite link — they can generate one from the
          team's Members page. Once you have it, paste it above.
        </p>
        <p className="mt-2">
          Starting your own team instead?{' '}
          {/* Plain anchor, not router Link — keeps this view router-free so it stays story-able. */}
          <a href="/create-team" className="text-blue underline">
            Create a team
          </a>
        </p>
      </details>
    </div>
  )
}
