import type { Position } from '@shared/api/positions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

// Radix Select forbids an empty-string item value (reserved for clearing), so "Unassigned" rides a
// sentinel that never collides with a real position id.
const UNASSIGNED = '__unassigned__'

interface PositionPickerProps {
  positions: Position[]
  /** Selected position id, or null for no position. */
  value: string | null
  onChange: (positionId: string | null) => void
  /** When true, offers an explicit "Unassigned" choice (admin roster); the profile picker omits it. */
  includeUnassigned?: boolean
  disabled?: boolean
  placeholder?: string
  'aria-label'?: string
}

/**
 * Presentational position picker shared by the profile form and the admin roster. Emits the chosen
 * position id (or null when Unassigned is picked). Props-only and network-free, so its states
 * (no-positions / has-positions / preselected) render as stories.
 */
export function PositionPicker({
  positions,
  value,
  onChange,
  includeUnassigned = false,
  disabled,
  placeholder = 'Select a position',
  'aria-label': ariaLabel,
}: PositionPickerProps) {
  return (
    <Select
      // Always controlled: "" is Radix's no-selection value (shows the placeholder); the Unassigned
      // sentinel is only used when that explicit choice is offered.
      value={value ?? (includeUnassigned ? UNASSIGNED : '')}
      onValueChange={(next) => onChange(next === UNASSIGNED || next === '' ? null : next)}
      disabled={disabled}
    >
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeUnassigned && <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>}
        {positions.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
