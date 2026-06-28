import { Dumbbell, Swords, Trophy, PartyPopper, Calendar, type LucideIcon } from 'lucide-react'
import type { EventTypeSummary } from '@shared/api/events'

const ICON_MAP: Record<string, LucideIcon> = {
  Training: Dumbbell,
  Match: Swords,
  Tournament: Trophy,
  Social: PartyPopper,
}

interface EventTypeIconProps {
  type: EventTypeSummary
  size?: 'sm' | 'md'
}

export function EventTypeIcon({ type, size = 'md' }: EventTypeIconProps) {
  const Icon = ICON_MAP[type.name] ?? Calendar
  const color = type.color ?? '#888'

  if (size === 'sm') {
    return (
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: color + '14' }}
      >
        <Icon size={18} style={{ color }} />
      </div>
    )
  }

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: color + '14' }}
    >
      <Icon size={22} style={{ color }} />
    </div>
  )
}
