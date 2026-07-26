import { Link } from '@tanstack/react-router'
import { Repeat } from 'lucide-react'
import type { SeriesPeek as SeriesPeekModel, SeriesPeekEntry } from '../lib/series-peek'

interface SeriesPeekProps {
  peek: SeriesPeekModel
}

function formatOccurrence(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function Occurrence({ entry }: { entry: SeriesPeekEntry }) {
  const label = formatOccurrence(entry.startTime)
  const content = (
    <div
      className={[
        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm tabular-nums transition-colors',
        entry.isCurrent ? 'bg-blue/10 font-semibold text-foreground' : 'text-muted-foreground hover:bg-muted/60',
      ].join(' ')}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${entry.isCurrent ? 'bg-blue' : 'bg-blue/40'}`} />
      {label}
      {entry.isCurrent && (
        <span className="ml-auto rounded-full bg-blue/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue">
          This one
        </span>
      )}
    </div>
  )
  // The current occurrence is the page you're on — the rest link to their own detail.
  return entry.isCurrent ? content : <Link to="/events/$eventId" params={{ eventId: entry.id }}>{content}</Link>
}

/**
 * A compact "part of a series" peek on the event-detail route (ADR-0014): first-two + last-two
 * occurrences with a "+N more" gap, the current one highlighted. Purely presentational — the
 * peek model is built by buildSeriesPeek from the occurrence's siblings.
 */
export function SeriesPeek({ peek }: SeriesPeekProps) {
  return (
    <div className="mt-6 rounded-2xl border border-blue/15 bg-blue/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue/10 text-blue">
          <Repeat size={15} />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">Part of a series</p>
          <p className="text-xs text-muted-foreground">
            Occurrence {peek.currentPosition} of {peek.total}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {peek.head.map((e) => (
          <Occurrence key={e.id} entry={e} />
        ))}
        {peek.hiddenCount > 0 && (
          <div className="flex items-center gap-2 px-2.5 py-1 text-xs italic text-muted-foreground">
            <span className="h-px flex-1 bg-border" />+{peek.hiddenCount} more
            <span className="h-px flex-1 bg-border" />
          </div>
        )}
        {peek.tail.map((e) => (
          <Occurrence key={e.id} entry={e} />
        ))}
      </div>
    </div>
  )
}
