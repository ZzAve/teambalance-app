import { useEffect, useState } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import type { CreateTeamError } from '@shared/api/teams'
import { suggestSlug } from '../lib/suggest-slug'
import { validateSlug } from '../lib/validate-slug'

interface CreateTeamFormProps {
  isPending: boolean
  /** The typed failure from the last submit, placed by its code (field vs banner); null while clean. */
  error?: CreateTeamError | null
  onSubmit: (values: { name: string; slug: string; creationCode: string }) => void
  /**
   * Delay before the "still setting up" reassurance line appears while submitting. Exposed only so a
   * story can force it visible without a real wait; defaults to ~5s to cover the known API cold-start
   * (#92) — POST /api/teams runs CREATE SCHEMA + Flyway in-request.
   */
  reassuranceDelayMs?: number
}

/**
 * Presentational create-team form (#158). Prop-only (isPending / error / onSubmit) so every state is a
 * story with no network; the mutation, navigation, and success side-effects live in the route
 * container. Owns only local field state and the slug's auto-suggest-until-edited behaviour.
 *
 * The slug is validated, not derived: it is auto-suggested from the name until the user edits it (a
 * dirty flag then stops the sync), and validated client-side against the same contract the backend
 * enforces so a bad address is caught before submit.
 */
export function CreateTeamForm({ isPending, error, onSubmit, reassuranceDelayMs = 5000 }: CreateTeamFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugDirty, setSlugDirty] = useState(false)
  const [creationCode, setCreationCode] = useState('')
  const [reassuranceElapsed, setReassuranceElapsed] = useState(false)

  const handleNameChange = (value: string) => {
    setName(value)
    // Auto-suggest a slug from the name until the user takes over the address field.
    if (!slugDirty) setSlug(suggestSlug(value))
  }

  // While a submit is in flight, reveal the reassurance line after the delay. The timer is only armed
  // when pending; the elapsed flag is reset in cleanup (when pending clears), so each submit waits
  // afresh. Display is additionally gated by isPending below.
  useEffect(() => {
    if (!isPending) return
    const timer = setTimeout(() => setReassuranceElapsed(true), reassuranceDelayMs)
    return () => {
      clearTimeout(timer)
      setReassuranceElapsed(false)
    }
  }, [isPending, reassuranceDelayMs])

  const clientSlugError = slug.length > 0 ? validateSlug(slug) : null
  const canSubmit =
    name.trim().length > 0 && creationCode.trim().length > 0 && clientSlugError === null && slug.length > 0 && !isPending

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Hard double-submit guard: a second submit against the same (now-consumed) code must be impossible.
    if (!canSubmit) return
    onSubmit({ name: name.trim(), slug, creationCode: creationCode.trim() })
  }

  const placed = (...codes: CreateTeamError['code'][]) =>
    error && codes.includes(error.code) ? error.message : null
  const nameError = placed('INVALID_NAME')
  const slugError = placed('INVALID_SLUG', 'SLUG_TAKEN') ?? clientSlugError
  const codeError = placed('INVALID_CREATION_CODE')
  const bannerError = placed('GENERIC')

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {bannerError && (
        <p role="alert" className="text-sm text-destructive">
          {bannerError}
        </p>
      )}

      <div>
        <Label htmlFor="team-name">Team name</Label>
        <Input
          id="team-name"
          value={name}
          disabled={isPending}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Tovo Heren 4"
        />
        {nameError && <p className="mt-1 text-sm text-destructive">{nameError}</p>}
      </div>

      <div>
        <Label htmlFor="team-slug">Team address</Label>
        <Input
          id="team-slug"
          value={slug}
          disabled={isPending}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugDirty(true)
          }}
          placeholder="tovo-heren-4"
        />
        {slugError && <p className="mt-1 text-sm text-destructive">{slugError}</p>}
      </div>

      <div>
        <Label htmlFor="creation-code">Creation code</Label>
        <Input
          id="creation-code"
          value={creationCode}
          disabled={isPending}
          onChange={(e) => setCreationCode(e.target.value)}
          placeholder="Enter your creation code"
        />
        {codeError && <p className="mt-1 text-sm text-destructive">{codeError}</p>}
      </div>

      <Button type="submit" disabled={!canSubmit}>
        {isPending ? 'Creating your team…' : 'Create team'}
      </Button>
      {isPending && reassuranceElapsed && (
        <p className="text-sm text-muted-foreground">
          Setting up your team's space — this can take a few seconds…
        </p>
      )}
    </form>
  )
}
