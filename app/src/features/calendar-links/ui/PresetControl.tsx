import { useId } from 'react'
import { Info } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import type { Preset } from '../model/preset'

const PRESETS: Preset[] = ['me', 'partner', 'custom']

interface PresetControlProps {
  value: Preset
  teamName: string
  disabled?: boolean
  onChange: (preset: Preset) => void
}

/** Me / Partner / Custom as a native radiogroup, the ThemeToggleView pattern, with an explainer popover. */
export function PresetControl({ value, teamName, disabled, onChange }: PresetControlProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const groupName = useId()

  return (
    <div>
      <div className="flex items-center gap-1">
        <h3 id={headingId} className="text-small font-semibold text-muted-foreground">
          {t('calendarLinks.whoFor')}
        </h3>
        {/* Radix Popover opens on click/tap, so it works on a phone where hover does not exist. */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={t('calendarLinks.aboutPresets')}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <Info size={16} aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            <p>
              <Trans i18nKey="calendarLinks.aboutMe" components={{ strong: <strong /> }} />
            </p>
            <p>
              <Trans i18nKey="calendarLinks.aboutPartner" values={{ team: teamName }} components={{ strong: <strong /> }} />
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-border bg-card p-1"
      >
        {PRESETS.map((option) => {
          const selected = value === option
          return (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={[
                  'flex min-h-11 items-center justify-center rounded-lg text-caption font-semibold transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
                  selected ? 'bg-blue/10 text-blue' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {t(`calendarLinks.preset.${option}`)}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
