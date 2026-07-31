import { useState } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import type { SeasonInput } from '@shared/api/season'
import { isSeasonConfigured, seasonChanged, validateSeasonRange, type SeasonBounds } from '../lib/season'

interface TeamSettingsViewProps {
  /** The saved season (the baseline the draft is compared against); defaults to an unset season. */
  season?: SeasonBounds
  /** The season query is in flight — render the loading shell instead of the form. */
  isLoading?: boolean
  /** The season query failed — render the error shell instead of the form. */
  isError?: boolean
  isSaving?: boolean
  /** Backend error surfaced from the container (e.g. a rejected save), shown inline. */
  error?: string | null
  onSave: (bounds: SeasonInput) => void
}

/**
 * Presentational Team Settings UI — the complete section, heading and all: the season start/end
 * pickers. Owns only local draft state; the query + mutation live in the TeamSettings container.
 *
 * The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
 * container, so every state — loading / error / unset / set / change-warning — renders purely from
 * props as a story (see TeamSettingsView.stories.tsx), with no network. Editing an already-configured
 * season surfaces a non-blocking warning — changing the window never moves or deletes existing events.
 */
export function TeamSettingsView({ season = {}, isLoading, isError, isSaving, error, onSave }: TeamSettingsViewProps) {
  const [start, setStart] = useState(season.start ?? '')
  const [end, setEnd] = useState(season.end ?? '')

  const draft: SeasonBounds = { start, end }
  const rangeError = validateSeasonRange(draft)
  const dirty = seasonChanged(season, draft)
  // Warn only once the user has actually changed a previously-meaningful window (or set/cleared one).
  const showWarning = dirty && (isSeasonConfigured(season) || isSeasonConfigured(draft))

  const handleSave = () => {
    if (rangeError || !dirty) return
    onSave({ start: start || undefined, end: end || undefined })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold">Season</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bound your team's events to a season. Once set, events cannot be scheduled outside this window.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-sm text-red-500">Couldn't load team settings. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <>
          {!isSeasonConfigured(season) && !dirty && (
            <p className="text-sm text-muted-foreground">No season set — events can be scheduled on any date.</p>
          )}

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="season-start">Start date</Label>
              <Input
                id="season-start"
                type="date"
                value={start}
                max={end || undefined}
                onChange={(e) => setStart(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="season-end">End date</Label>
              <Input
                id="season-end"
                type="date"
                value={end}
                min={start || undefined}
                onChange={(e) => setEnd(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          {rangeError && <p className="text-sm text-red-500">{rangeError}</p>}

          {showWarning && !rangeError && (
            <p className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-foreground" role="alert">
              Changing the season won't move or delete existing events — some may now fall outside the new window.
            </p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <Button disabled={isSaving || !dirty || !!rangeError} onClick={handleSave}>
              {isSaving ? 'Saving…' : 'Save season'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
