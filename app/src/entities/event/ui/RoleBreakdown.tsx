import type { RoleCount } from '@shared/api/events'

interface RoleBreakdownProps {
  breakdown: RoleCount[]
}

/**
 * Presentational breakdown of attending members grouped by role, rendered as chips.
 * Renders nothing when no role has attendees. Extracted from the event-detail page so
 * its empty/populated states are testable in isolation (see RoleBreakdown.stories.tsx).
 */
export function RoleBreakdown({ breakdown }: RoleBreakdownProps) {
  if (breakdown.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2">
      {breakdown.map(({ role, attending }) => (
        <span
          key={role}
          className="rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green"
        >
          {attending} {role}
        </span>
      ))}
    </div>
  )
}
