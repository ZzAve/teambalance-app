import { useId } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import type { ThemePreference } from '@shared/theme/theme'

interface ThemeToggleViewProps {
  /** The stored preference — `system` when the user has never chosen, which is the default. */
  value: ThemePreference
  onChange: (preference: ThemePreference) => void
}

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Monitor }[] = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
]

/**
 * The appearance control (F11, #159): System / Light / Dark, prop-only.
 *
 * Native radios in a labelled radiogroup rather than buttons with `aria-pressed`, so the group gets
 * arrow-key navigation, the "one of three" relationship and the checked state from the platform
 * instead of a hand-rolled approximation. The inputs are `sr-only`; the visible chip is their
 * sibling, which also carries the focus ring (`peer-focus-visible`) so keyboard focus stays visible.
 *
 * `System` is listed first because it is the default: it is where a user who has never chosen sits,
 * and the option they return to when they want the OS back.
 */
export function ThemeToggleView({ value, onChange }: ThemeToggleViewProps) {
  const headingId = useId()
  // Radios only form one group if they share a name, and this control can legitimately appear
  // twice on a page (Storybook docs, a future settings screen) — so scope the name per instance.
  const groupName = useId()

  return (
    <div>
      <h3 id={headingId} className="text-sm font-semibold text-muted-foreground">
        Appearance
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        System follows your device&apos;s light or dark setting.
      </p>
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-border bg-card p-1"
      >
        {OPTIONS.map(({ value: option, label, Icon }) => {
          const selected = value === option
          return (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              {/* min-h-11 keeps every segment at the ≥44px touch target the audit set (F7). */}
              <span
                className={[
                  'flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
                  selected ? 'bg-blue/10 text-blue' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
