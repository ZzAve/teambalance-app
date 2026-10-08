import { useState } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { validateSlug } from '@shared/lib/validate-slug'
import { placeCreateTeamError, type CreateTeamError } from '@entities/team/api/teams'
import { FormError } from '@shared/ui/FormError'

interface CreateMemberlessTeamViewProps {
  isPending: boolean
  /** The typed failure from the last submit, placed by its code (field vs banner); null while clean. */
  error?: CreateTeamError | null
  /** Set after a successful create, so the console confirms the (empty) team is ready to enter. */
  createdName?: string | null
  onSubmit: (values: { name: string; slug: string }) => void
}

/**
 * Presentational memberless-create form for the platform console (ADR-0024 §5). Prop-only
 * (isPending / error / createdName / onSubmit) so every state renders from props with no network; the
 * mutation and the team-list refresh live in the container. No creation code field — the platform-admin
 * allowlist on `/admin` is the gate — and no member is created, so there is no founder to name.
 */
export function CreateMemberlessTeamView({
  isPending,
  error,
  createdName,
  onSubmit,
}: CreateMemberlessTeamViewProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const clientSlugError = slug.length > 0 ? validateSlug(slug) : null
  const canSubmit = name.trim().length > 0 && slug.length > 0 && clientSlugError === null && !isPending

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ name: name.trim(), slug })
  }

  const placed = (...codes: CreateTeamError['code'][]) => placeCreateTeamError(error, ...codes)
  const nameError = placed('INVALID_NAME')
  const slugError = placed('INVALID_SLUG', 'SLUG_TAKEN') ?? clientSlugError
  const bannerError = placed('GENERIC', 'INVALID_CREATION_CODE')

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-title font-bold">Create a team</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Creates an empty team you can enter and set up, then hand over with an admin invite link. You
          don't join it.
        </p>
      </div>

      {bannerError && <FormError>{bannerError}</FormError>}
      {createdName && !bannerError && (
        <p role="status" className="text-small text-green">
          Created “{createdName}”. Enter it from the list below to set it up.
        </p>
      )}

      <div>
        <Label htmlFor="ml-team-name">Team name</Label>
        <Input
          id="ml-team-name"
          value={name}
          disabled={isPending}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tovo Dames 5"
        />
        {nameError && <p className="mt-1 text-small text-destructive">{nameError}</p>}
      </div>

      <div>
        <Label htmlFor="ml-team-slug">Team address</Label>
        <Input
          id="ml-team-slug"
          value={slug}
          disabled={isPending}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="tovo-dames-5"
        />
        {slugError && <p className="mt-1 text-small text-destructive">{slugError}</p>}
      </div>

      <Button type="submit" disabled={!canSubmit} className="self-start">
        {isPending ? 'Creating…' : 'Create team'}
      </Button>
    </form>
  )
}
