import type { EventTypeSummary } from '@shared/api/events'

export function EventTypeBadge({ type }: { type: EventTypeSummary }) {
  const color = type.color ?? '#888'
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.09em]"
      style={{ backgroundColor: color + '14', color }}
    >
      {type.name}
    </span>
  )
}
