import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '@shared/i18n/i18n'

interface LanguageSwitchViewProps {
  /** The language the app is shown in now. */
  value: Language
  onChange: (language: Language) => void
  /** A choice is being stored; the control is held until it settles. */
  isSaving?: boolean
}

// Each language in its own name, so a member who cannot read the current one still finds theirs.
const OPTIONS: { value: Language; label: string }[] = [
  { value: 'nl', label: 'Nederlands' },
  { value: 'en', label: 'English' },
]

/**
 * The language control in Account (ADR-0043), prop-only. The same native-radio pattern as
 * ThemeToggleView, for the same reasons: arrow keys, the checked state and the group relationship
 * come from the platform.
 */
export function LanguageSwitchView({ value, onChange, isSaving = false }: LanguageSwitchViewProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const groupName = useId()

  return (
    <div>
      <h3 id={headingId} className="text-small font-semibold text-muted-foreground">
        {t('language.heading')}
      </h3>
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className="mt-3 grid grid-cols-2 gap-1 rounded-md border border-border bg-card p-1"
      >
        {OPTIONS.map(({ value: option, label }) => {
          const selected = value === option
          return (
            <label key={option} lang={option} className={isSaving ? 'cursor-not-allowed' : 'cursor-pointer'}>
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={selected}
                disabled={isSaving}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              {/* min-h-11 keeps every segment at the ≥44px touch target (F7). */}
              <span
                className={[
                  'flex min-h-11 items-center justify-center rounded-lg text-caption font-semibold transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
                  selected ? 'bg-blue/10 text-blue' : 'text-muted-foreground hover:text-foreground',
                  isSaving ? 'opacity-60' : '',
                ].join(' ')}
              >
                {label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
