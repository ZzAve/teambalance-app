import type { ComponentType, MouseEvent } from 'react'
import { Check, HelpCircle, X } from 'lucide-react'

export type AttendanceState = 'ATTENDING' | 'MAYBE' | 'ABSENT' | 'NOT_RESPONDED'

interface ResponseOption {
  value: AttendanceState
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  activeClass: string
  inactiveClass: string
}

const RESPONSE_OPTIONS: ResponseOption[] = [
  {
    value: 'ATTENDING',
    label: 'Going',
    icon: Check,
    activeClass: 'bg-green text-white border-green hover:bg-green/90',
    inactiveClass: 'border-green/30 text-green hover:bg-green/10',
  },
  {
    value: 'MAYBE',
    label: 'Maybe',
    icon: HelpCircle,
    activeClass: 'bg-gold text-white border-gold hover:bg-gold/90',
    inactiveClass: 'border-gold/30 text-gold hover:bg-gold/10',
  },
  {
    value: 'ABSENT',
    label: "Can't go",
    icon: X,
    activeClass: 'bg-red text-white border-red hover:bg-red/90',
    inactiveClass: 'border-red/30 text-red hover:bg-red/10',
  },
]

interface AttendanceToggleProps {
  value: AttendanceState
  onToggle: (state: AttendanceState) => void
  disabled?: boolean
  /**
   * Icon-only, right-sized for a per-attendee row where the control repeats down a long list
   * (the roster view). The full-width labelled form stays the default for the primary
   * "Your response" control. Same three options, same callback — only the density changes.
   */
  compact?: boolean
}

// Presentational: current response + callback come in as props; the mutation lives in the
// page container. Idle/pending/selected states are pure render args (Storybook-ready).
export function AttendanceToggle({ value, onToggle, disabled = false, compact = false }: AttendanceToggleProps) {
  return (
    <div className={compact ? 'inline-flex gap-1' : 'flex gap-2.5'}>
      {RESPONSE_OPTIONS.map(({ value: option, label, icon: Icon, activeClass, inactiveClass }) => {
        const isActive = value === option
        const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          onToggle(option)
        }
        return (
          <button
            key={option}
            // Icon-only rows lose the visible label, so name the control for a screen reader.
            aria-label={compact ? label : undefined}
            aria-pressed={isActive}
            disabled={disabled}
            onClick={handleClick}
            className={[
              'flex items-center justify-center rounded-xl border-2 font-semibold transition-all active:scale-95',
              compact ? 'h-9 w-10' : 'flex-1 gap-2 py-3.5 text-sm',
              isActive ? activeClass : inactiveClass,
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            ].join(' ')}
          >
            <Icon size={compact ? 16 : 18} />
            {!compact && label}
          </button>
        )
      })}
    </div>
  )
}
