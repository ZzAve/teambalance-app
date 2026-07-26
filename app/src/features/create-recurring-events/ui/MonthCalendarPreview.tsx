import { AlertTriangle } from 'lucide-react'
import type { CalendarPreview } from '../model/recurrence'
import { MAX_OCCURRENCES } from '../model/recurrence'

const WEEKDAY_HEADS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface MonthCalendarPreviewProps {
  preview: CalendarPreview
  /** Event-type colour used to highlight occurrence days (falls back to the brand blue). */
  accentColor: string
}

/**
 * Live month-by-month preview of a recurring series (prototype B): the season renders as a shaded
 * band, occurrences are highlighted in the event-type colour, out-of-season occurrences flag red,
 * and a running count plus cap / out-of-season notes sit above the grid. Purely presentational —
 * every cell flag is computed by buildCalendarPreview.
 */
export function MonthCalendarPreview({ preview, accentColor }: MonthCalendarPreviewProps) {
  const { months, count, overCap, outOfSeasonCount } = preview

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      {/* Count + legend */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: accentColor }}
          data-testid="occurrence-count"
        >
          {count} {count === 1 ? 'event' : 'events'}
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: accentColor }} />
            Occurrence
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-green/15" />
            Season
          </span>
        </div>
      </div>

      {/* Cap / out-of-season warnings */}
      {overCap && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs leading-snug text-gold">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            That&rsquo;s over {MAX_OCCURRENCES} events — shorten the range or thin the schedule before creating.
          </span>
        </div>
      )}
      {!overCap && outOfSeasonCount > 0 && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-xs leading-snug text-red-500">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            {outOfSeasonCount} {outOfSeasonCount === 1 ? 'date falls' : 'dates fall'} outside the season (shown in red).
            The app will reject out-of-window starts.
          </span>
        </div>
      )}

      {count === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No dates yet — pick at least one weekday inside the range.
        </p>
      )}

      {/* Month grids */}
      <div className="flex max-h-80 flex-col gap-4 overflow-y-auto">
        {months.map((month) => (
          <div key={`${month.year}-${month.month}`}>
            <p className="mb-1.5 text-sm font-semibold">{month.label}</p>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {WEEKDAY_HEADS.map((h) => (
                <span key={h} className="py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {h}
                </span>
              ))}
              {month.weeks.flat().map((cell, i) => {
                if (!cell.date) return <span key={i} />
                const base = 'flex aspect-square items-center justify-center rounded-md text-xs tabular-nums'
                if (cell.outOfSeason) {
                  return (
                    <span key={i} className={`${base} font-semibold text-white`} style={{ backgroundColor: 'var(--color-red, #D93025)' }}>
                      {cell.day}
                    </span>
                  )
                }
                if (cell.isOccurrence) {
                  return (
                    <span key={i} className={`${base} font-semibold text-white`} style={{ backgroundColor: accentColor }}>
                      {cell.day}
                    </span>
                  )
                }
                return (
                  <span
                    key={i}
                    className={`${base} ${cell.inSeason ? 'bg-green/10 text-foreground' : 'text-muted-foreground/50'}`}
                  >
                    {cell.day}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
