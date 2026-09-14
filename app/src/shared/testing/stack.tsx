import type { ReactNode } from 'react'

interface StackProps {
  /** Label → the instance to show under it. Insertion order is render order. */
  items: Record<string, ReactNode>
}

/**
 * Several instances of one View, stacked and labelled, in a single story (ADR-0031 §1). This is how
 * a View's non-data states — loading, error, empty, the error-banner variants — share one Chromatic
 * snapshot instead of one each. Each instance sits in its own `region` named by its label, so a
 * `play` can scope its assertions: `within(canvas.getByRole('region', { name: 'Loading' }))`.
 */
export function Stack({ items }: StackProps) {
  return (
    <div className="flex flex-col gap-8">
      {Object.entries(items).map(([label, node]) => (
        <section key={label} aria-label={label} className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {node}
        </section>
      ))}
    </div>
  )
}
