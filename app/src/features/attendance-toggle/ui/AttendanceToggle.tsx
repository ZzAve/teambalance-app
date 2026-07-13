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
    activeClass: 'bg-red-500 text-white border-red-500 hover:bg-red-500/90',
    inactiveClass: 'border-red-300 text-red-500 hover:bg-red-500/10',
  },
]

interface AttendanceToggleProps {
  value: AttendanceState
  onToggle: (state: AttendanceState) => void
  disabled?: boolean
}

// Presentational: current response + callback come in as props; the mutation lives in the
// page container. Idle/pending/selected states are pure render args (Storybook-ready).
export function AttendanceToggle({ value, onToggle, disabled = false }: AttendanceToggleProps) {
  return (
    <div className="flex gap-2.5">
      {RESPONSE_OPTIONS.map(({ value: option, label, icon: Icon, activeClass, inactiveClass }) => {
        const isActive = value === option
        const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          onToggle(option)
        }
        return (
          <button
            key={option}
            aria-pressed={isActive}
            disabled={disabled}
            onClick={handleClick}
            className={[
              'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-semibold transition-all active:scale-95',
              isActive ? activeClass : inactiveClass,
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            ].join(' ')}
          >
            <Icon size={18} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
