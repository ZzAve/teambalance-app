import type { EventTypeItem } from '@shared/api/event-types'
import { Chip } from '@shared/ui/chip'

interface EventTypeChipProps {
  type: Pick<EventTypeItem, 'name' | 'color'>
  pressed: boolean
  onToggle: () => void
  disabled?: boolean
}

/** A Chip for one Event Type, filled with the type's colour when pressed and outlined in it when not. */
export function EventTypeChip({ type, pressed, onToggle, disabled }: EventTypeChipProps) {
  const color = type.color ?? '#888'
  return (
    <Chip
      pressed={pressed}
      disabled={disabled}
      onToggle={onToggle}
      activeStyle={{ backgroundColor: color, borderColor: color, color: '#fff' }}
      inactiveStyle={{ borderColor: color + '66', color }}
    >
      {type.name}
    </Chip>
  )
}
