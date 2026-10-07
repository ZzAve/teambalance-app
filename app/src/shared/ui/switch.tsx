import { cn } from '@shared/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  'aria-label': string
  disabled?: boolean
}

export function Switch({ checked, onCheckedChange, disabled, 'aria-label': ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? 'bg-green' : 'bg-muted-foreground/30',
      )}
    >
      <span
        // left is pinned explicitly: a bare `absolute` would fall back to the static position,
        // which a button's centred text alignment drags to the middle of the track.
        className={cn(
          'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}
