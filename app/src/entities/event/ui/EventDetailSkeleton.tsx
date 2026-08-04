import { Skeleton } from '@shared/ui/skeleton'

/**
 * Loading placeholder for the event detail route — sketches the real layout (header block, response
 * toggle, tabbed attendee list) so the page shows its shape while the event loads, rather than a
 * bare "Loading…" line.
 */
export function EventDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading event">
      {/* Header block: type icon + badge / title / date */}
      <div className="mt-2 flex items-start gap-4">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Your response toggle */}
      <div className="mt-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      {/* Tabbed attendee list */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
        <div className="flex gap-2 border-b border-border/40 p-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-5 flex-1 rounded-full" />
          ))}
        </div>
        <div className="divide-y divide-border/40">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
