import type { ReactNode } from 'react'
import { cn } from '@shared/lib/utils'

interface StackProps {
  /** Label → the instance to show under it. Insertion order is render order. */
  items: Record<string, ReactNode>
  /**
   * Column override (e.g. `grid-cols-3`) for a primitive gallery: lays cases out in a fixed-column
   * grid instead of the default flex column, and splits camelCase labels into captions. Omit for the
   * default labelled stack.
   */
  columns?: string
}

/**
 * Several instances of one View, stacked and labelled, in a single story (ADR-0032 §1). This is how
 * a View's non-data states — loading, error, empty, the error-banner variants — share one Chromatic
 * snapshot instead of one each. Each instance sits in its own `region` named by its label, so a
 * `play` can scope its assertions: `within(canvas.getByRole('region', { name: 'Loading' }))`.
 *
 * Pass `columns` for a primitive gallery (ADR-0032 §2) instead: a fixed column count — unlike
 * `flex-wrap` — keeps every row the same width, so a row never strands a single case alone.
 */
export function Stack({ items, columns }: StackProps) {
  return (
    <div className={columns ? cn('grid grid-cols-1 gap-4', columns) : 'flex flex-col gap-8'}>
      {Object.entries(items).map(([label, node]) =>
        columns ? (
          <div key={label} className="flex flex-col items-center gap-2">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              {toCaption(label)}
            </p>
            {node}
          </div>
        ) : (
          <section key={label} aria-label={label} className="flex flex-col gap-2">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            {node}
          </section>
        ),
      )}
    </div>
  )
}

// Gallery labels are the record's keys, written as camelCase identifiers (they also back
// `data-testid` lookups in `play`) — split them into words so a long one
// (`hostFallbackWhenTitleBlank`) wraps and reads as a caption instead of running on as one word.
// Casing doesn't matter: the caption is rendered `uppercase`.
function toCaption(label: string): string {
  return label.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}
