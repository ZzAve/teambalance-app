import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Repeat } from 'lucide-react'
import type { SeriesPeek as SeriesPeekModel, SeriesPeekEntry } from '../lib/series-peek'
import { useTeamRoutes } from '@shared/lib/team-routes'

interface SeriesPeekProps {
  peek: SeriesPeekModel
}

function formatOccurrence(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function Occurrence({ entry }: { entry: SeriesPeekEntry }) {
  const routes = useTeamRoutes()
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
  return entry.isCurrent ? content : <Link to={routes.event(entry.id)}>{content}</Link>
}

/**
 * A "part of a series" disclosure on the event-detail route (ADR-0014). The membership line is
 * usually incidental context, so the card is **collapsed by default** — showing only "Part of a
 * series · Occurrence X of Y" — and expands on click to reveal the first-two + last-two occurrences
 * (with a "+N more" gap) and the current one highlighted. Purely presentational; the peek model is
 * built by buildSeriesPeek.
 */
export function SeriesPeek({ peek }: SeriesPeekProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-6 rounded-2xl border border-blue/15 bg-blue/5 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue/10 text-blue">
          <Repeat size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight">Part of a series</p>
          <p className="text-xs text-muted-foreground">
            Occurrence {peek.currentPosition} of {peek.total}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`ml-auto shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-1">
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
      )}
    </div>
  )
}
