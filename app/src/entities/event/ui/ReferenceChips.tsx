import { ExternalLink } from 'lucide-react'
import type { Reference } from '@shared/api/events'
import { referenceLabel } from '../lib/reference-label'

/**
 * Renders an event's References (ADR-0016) as external-link chips. On the card `max` caps the visible
 * chips and the rest collapse into a non-interactive "+N" marker; on the detail page pass a large
 * `max` to show them all. Each chip is a real anchor — `relative z-10` lifts it above the card's
 * stretched-link overlay so it stays independently clickable.
 */
export function ReferenceChips({ references, max = 2 }: { references: Reference[]; max?: number }) {
  if (references.length === 0) return null

  const shown = references.slice(0, max)
  const overflow = references.length - shown.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((ref, i) => (
        <a
          key={`${ref.url}-${i}`}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-blue"
        >
          <ExternalLink size={11} className="shrink-0" />
          {referenceLabel(ref)}
        </a>
      ))}
      {overflow > 0 && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground/70">
          +{overflow}
        </span>
      )}
    </div>
  )
}
