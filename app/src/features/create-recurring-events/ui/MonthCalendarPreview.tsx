import { AlertTriangle } from 'lucide-react'
import type { CalendarPreview } from '../model/recurrence'
import { MAX_OCCURRENCES, WEEKDAYS } from '../model/recurrence'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const { months, count, overCap, outOfSeasonCount, truncated } = preview

  return (
    <div className="rounded-lg border border-border/60 bg-card p-4 shadow-sm">
      {/* Count + legend */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-caption font-semibold text-white"
          style={{ backgroundColor: accentColor }}
          data-testid="occurrence-count"
        >
          {t('createRecurringEvents.events', { count })}
        </span>
        <div className="flex items-center gap-3 text-caption text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: accentColor }} />
            {t('createRecurringEvents.preview.occurrence')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-green/15" />
            {t('createRecurringEvents.preview.season')}
          </span>
        </div>
      </div>

      {/* Cap / out-of-season warnings */}
      {overCap && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-caption leading-snug text-gold-ink">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{t('createRecurringEvents.preview.overCap', { max: MAX_OCCURRENCES })}</span>
        </div>
      )}
      {!overCap && outOfSeasonCount > 0 && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-caption leading-snug text-red-ink">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{t('createRecurringEvents.preview.outOfSeason', { count: outOfSeasonCount })}</span>
        </div>
      )}

      {count === 0 && (
        <p className="py-6 text-center text-small text-muted-foreground">
          {t('createRecurringEvents.preview.noDates')}
        </p>
      )}

      {/* Month grids */}
      <div className="flex max-h-80 flex-col gap-4 overflow-y-auto">
        {months.map((month) => (
          <div key={`${month.year}-${month.month}`}>
            <p className="mb-1.5 text-small font-semibold">{month.label}</p>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {WEEKDAYS.map(({ value, short }) => (
                <span key={value} className="py-1 text-caption font-medium text-muted-foreground">
                  {short}
                </span>
              ))}
              {month.weeks.flat().map((cell, i) => {
                if (!cell.date) return <span key={i} />
                const base = 'flex aspect-square items-center justify-center rounded-md text-caption tabular-nums'
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
        {truncated && (
          <p className="pt-1 text-center text-caption italic text-muted-foreground">
            {t('createRecurringEvents.preview.truncated', { months: months.length, count })}
          </p>
        )}
      </div>
    </div>
  )
}
