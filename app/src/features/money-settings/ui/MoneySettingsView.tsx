import { useId, useState } from 'react'
import type { MoneyPoolSettings } from '@shared/api/money-pool'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Switch } from '@shared/ui/switch'
import { bunqMeLinkError, centsToEuroText, euroTextToCents, settingsChanged } from '../lib/money-settings'

interface MoneySettingsViewProps {
  /** The saved settings (the baseline the draft is compared against). */
  settings?: MoneyPoolSettings
  /** The settings query is in flight — render the loading shell instead of the form. */
  isLoading?: boolean
  /** The settings query failed — render the error shell instead of the form. */
  isError?: boolean
  isSaving?: boolean
  /** The last save went through — confirmed to the admin until the draft changes again. */
  saved?: boolean
  /** Backend error surfaced from the container (e.g. a rejected save), shown inline. */
  error?: string | null
  onSave: (settings: MoneyPoolSettings) => void
}

/**
 * Presentational money pool settings — the complete section, heading and all: the on/off switch, the
 * Beer Counter price and the team's bunq.me link. Owns only local draft state; the query and
 * mutation live in the MoneySettings container. Loading and error shells are props-driven so every
 * state renders as a story without a network (ADR-0017).
 */
export function MoneySettingsView({ settings, isLoading, isError, isSaving, saved, error, onSave }: MoneySettingsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-title font-bold">Money pool</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Show your team's shared pool, and what its balance buys in beers.
        </p>
      </div>

      {isLoading && (
        <p role="status" className="text-small text-muted-foreground">
          Loading…
        </p>
      )}
      {isError && (
        <p role="alert" className={ERROR_CLASS}>
          Couldn't load the money pool settings. Please try again.
        </p>
      )}
      {settings && !isLoading && !isError && (
        <MoneySettingsForm settings={settings} isSaving={isSaving} saved={saved} error={error} onSave={onSave} />
      )}
    </div>
  )
}

// Error texts sit on a card: the destructive red is 4.7:1 on it, but only 4.4:1 on the page background.
const ERROR_CLASS = 'rounded-lg bg-card p-3 text-small text-red-ink'
const FIELD_ERROR_CLASS = `${ERROR_CLASS} mt-1`

function MoneySettingsForm({
  settings,
  isSaving,
  saved,
  error,
  onSave,
}: Pick<MoneySettingsViewProps, 'isSaving' | 'saved' | 'error' | 'onSave'> & { settings: MoneyPoolSettings }) {
  const id = useId()
  const priceId = `${id}-beer-price`
  const linkId = `${id}-bunq-me-link`
  const [enabled, setEnabled] = useState(settings.enabled)
  const [priceText, setPriceText] = useState(centsToEuroText(settings.beerPrice))
  const [link, setLink] = useState(settings.bunqMeLink ?? '')

  // The draft starts over from the saved values whenever they change (another admin's change, or this
  // save coming back normalised), so it is never compared against a baseline it was not made from. Only
  // the draft resets: remounting the form would replace the Save button and the status region, and a live
  // region has to stay mounted for its text to be announced.
  const savedValues = `${settings.enabled}|${settings.beerPrice}|${settings.bunqMeLink}`
  const [seenSavedValues, setSeenSavedValues] = useState(savedValues)
  if (seenSavedValues !== savedValues) {
    setSeenSavedValues(savedValues)
    setEnabled(settings.enabled)
    setPriceText(centsToEuroText(settings.beerPrice))
    setLink(settings.bunqMeLink ?? '')
  }

  const beerPrice = euroTextToCents(priceText)
  const priceError = Number.isNaN(beerPrice) ? 'Enter a price between €0,01 and €100,00.' : null
  const linkError = bunqMeLinkError(link)
  const draft = { enabled, beerPrice: beerPrice as number | undefined, bunqMeLink: link.trim() || undefined }
  const changed = settingsChanged(settings, draft)
  const canSave = !priceError && !linkError && changed

  return (
    <>
      <div className="flex flex-col">
        <Label className="flex min-h-11 items-center justify-between gap-3 leading-normal">
          Show the money pool to the team
          <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Show the money pool to the team" />
        </Label>
        <p className="text-caption text-muted-foreground">
          When switched off, the Money tab and page are hidden for everyone in the team.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={priceId}>Beer price (€)</Label>
        <Input
          id={priceId}
          inputMode="decimal"
          value={priceText}
          placeholder="2,70"
          onChange={(e) => setPriceText(e.target.value)}
          aria-invalid={!!priceError}
          aria-describedby={priceError ? `${priceId}-error` : undefined}
          className="w-48"
        />
        <div>
          <p className="text-caption text-muted-foreground">Leave empty to hide the Beer Counter.</p>
          {/* Mounted before it has anything to say: a live region added together with its text is not announced. */}
          <div aria-live="polite" aria-atomic="true">
            {priceError && (
              <p id={`${priceId}-error`} className={FIELD_ERROR_CLASS}>
                {priceError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={linkId}>bunq.me link</Label>
        <div>
          <Input
            id={linkId}
            inputMode="url"
            value={link}
            placeholder="https://bunq.me/yourteam"
            onChange={(e) => setLink(e.target.value)}
            aria-invalid={!!linkError}
            aria-describedby={linkError ? `${linkId}-error` : undefined}
          />
          <div aria-live="polite" aria-atomic="true">
            {linkError && (
              <p id={`${linkId}-error`} className={FIELD_ERROR_CLASS}>
                {linkError}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className={ERROR_CLASS}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button disabled={isSaving || !canSave} onClick={() => onSave(draft)}>
          {isSaving ? 'Saving…' : 'Save money pool'}
        </Button>
        <p role="status" className="text-small text-muted-foreground">
          {saved && !changed ? 'Saved' : ''}
        </p>
      </div>
    </>
  )
}
