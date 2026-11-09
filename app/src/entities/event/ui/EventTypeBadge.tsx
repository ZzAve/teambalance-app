import type { EventTypeSummary } from '@shared/api/events'
import { eventTypeName } from '../lib/event-type-name'

export function EventTypeBadge({ type }: { type: EventTypeSummary }) {
  const color = type.color ?? '#888'
  return (
    <span
      className="rounded-full px-2 py-0.5 text-caption font-semibold"
      style={{ backgroundColor: color + '14', color }}
    >
      {eventTypeName(type)}
    </span>
  )
}
