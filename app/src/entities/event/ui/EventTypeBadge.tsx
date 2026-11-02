import type { EventTypeSummary } from '@shared/api/events'

export function EventTypeBadge({ type }: { type: EventTypeSummary }) {
  const color = type.color ?? '#888'
  return (
    <span
      className="rounded-full px-2 py-0.5 text-caption font-semibold"
      style={{ backgroundColor: color + '14', color }}
    >
      {type.name}
    </span>
  )
}
