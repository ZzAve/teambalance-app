import { useState } from 'react'
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
export function MoneySettingsView({ settings, isLoading, isError, isSaving, error, onSave }: MoneySettingsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-title font-bold">Money pool</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Show your team's shared pool, and what its balance buys in beers.
        </p>
      </div>

      {isLoading && <p className="text-small text-muted-foreground">Loading…</p>}
      {isError && <p className="text-small text-red">Couldn't load the money pool settings. Please try again.</p>}
      {settings && !isLoading && !isError && (
        <MoneySettingsForm settings={settings} isSaving={isSaving} error={error} onSave={onSave} />
      )}
    </div>
  )
}

function MoneySettingsForm({
  settings,
  isSaving,
  error,
  onSave,
}: Pick<MoneySettingsViewProps, 'isSaving' | 'error' | 'onSave'> & { settings: MoneyPoolSettings }) {
  const [enabled, setEnabled] = useState(settings.enabled)
  const [priceText, setPriceText] = useState(centsToEuroText(settings.beerPrice))
  const [link, setLink] = useState(settings.bunqMeLink ?? '')

  const beerPrice = euroTextToCents(priceText)
  const priceError = Number.isNaN(beerPrice) ? 'Enter a price between €0,01 and €100,00.' : null
  const linkError = bunqMeLinkError(link)
  const draft = { enabled, beerPrice: beerPrice as number | undefined, bunqMeLink: link.trim() || undefined }
  const canSave = !priceError && !linkError && settingsChanged(settings, draft)

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-small font-medium">Show the money pool to the team</span>
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Show the money pool to the team" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="money-pool-beer-price">Beer price (€)</Label>
        <Input
          id="money-pool-beer-price"
          inputMode="decimal"
          value={priceText}
          placeholder="2,70"
          onChange={(e) => setPriceText(e.target.value)}
          className="w-48"
        />
        <p className="text-caption text-muted-foreground">Leave empty to hide the Beer Counter.</p>
        {priceError && <p className="text-small text-red">{priceError}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="money-pool-bunq-me-link">bunq.me link</Label>
        <Input
          id="money-pool-bunq-me-link"
          inputMode="url"
          value={link}
          placeholder="https://bunq.me/yourteam"
          onChange={(e) => setLink(e.target.value)}
        />
        {linkError && <p className="text-small text-red">{linkError}</p>}
      </div>

      {error && <p className="text-small text-red">{error}</p>}

      <div>
        <Button disabled={isSaving || !canSave} onClick={() => onSave(draft)}>
          {isSaving ? 'Saving…' : 'Save money pool'}
        </Button>
      </div>
    </>
  )
}
