import type { EventTypeSummary } from '@shared/api/events'
import { usePrototypeVariant } from '@shared/ui/PrototypeSwitcher'

// PROTOTYPE #339 — variant B/C re-set the type chip in sentence case (no uppercase/tracking); A is
// untouched. See UI.md.
export function EventTypeBadge({ type }: { type: EventTypeSummary }) {
  const variant = usePrototypeVariant(['A', 'B', 'C'] as const)
  const color = type.color ?? '#888'
  const className =
    variant === 'A'
      ? 'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.09em]'
      : 'rounded-full px-2 py-0.5 text-[11px] font-semibold'
  return (
    <span className={className} style={{ backgroundColor: color + '14', color }}>
      {type.name}
    </span>
  )
}
