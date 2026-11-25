import { Fragment, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@shared/ui/skeleton'
import { QueryErrorState } from '@shared/ui/QueryErrorState'
import { eventTypeName } from '@entities/event/lib/event-type-name'
import { verdictWord, type LineupState } from '@entities/event/lib/lineup'
import { VERDICT_TONE } from '@entities/event/ui/verdict-tone'
import { PageHeader } from '@widgets/page-header/ui/PageHeader'
import { nextState, type CellState, type SeasonGrid } from '../lib/season-grid'

interface SeasonPageViewProps {
  grid?: SeasonGrid
  isLoading?: boolean
  isError?: boolean
  onRetry: () => void
  /** Click-to-cycle a cell to the next answer (any member may answer for anyone, ADR-0003). */
  onSetAnswer: (eventId: string, userId: string, state: LineupState) => void
}

const CELL: Record<LineupState, string> = {
  ATTENDING: 'bg-green text-white',
  MAYBE: 'bg-gold text-foreground',
  ABSENT: 'bg-red text-white',
  NOT_RESPONDED: 'border border-border',
}
// A mark besides the colour, so the state does not rest on colour alone (WCAG 1.4.1); the calendar links use the same three.
const MARK: Record<LineupState, string> = { ATTENDING: '✓', MAYBE: '?', ABSENT: '✗', NOT_RESPONDED: '' }

/**
 * The season at a glance: members by Position down the side, the season's events across, an answer
 * per cell, a today marker between past and upcoming, and under the grid each targeted Position's
 * verdict per event. Prop-only (ADR-0017); the route builds the grid. Wide: the frame lifts its
 * column cap for this page from `lg`, and the table scrolls sideways at any width (a season is
 * more columns than any screen).
 */
export function SeasonPageView({ grid, isLoading, isError, onRetry, onSetAnswer }: SeasonPageViewProps) {
  const { t, i18n } = useTranslation()
  const day = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' })

  const body = () => {
    if (isError) return <QueryErrorState title={t('season.loadFailed')} onRetry={onRetry} />
    if (isLoading || !grid) return <Skeleton className="h-96 w-full" />
    if (grid.columns.length === 0) return <p className="text-small text-muted-foreground">{t('season.empty')}</p>

    const { columns, pastCount, groups, verdictLabels } = grid
    const span = columns.length + 3
    // The today marker sits between the past and the upcoming columns.
    const withToday = (cells: ReactNode[], today: ReactNode) => [
      ...cells.slice(0, pastCount),
      <Fragment key="today">{today}</Fragment>,
      ...cells.slice(pastCount),
    ]
    const todayLine = (
      <td className="relative p-0">
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-blue/60" />
      </td>
    )

    return (
      <div className="overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-1 text-small">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background text-left font-medium text-muted-foreground">{t('season.member')}</th>
              <th className="px-1 text-right font-medium text-muted-foreground">{t('season.attended')}</th>
              {withToday(
                columns.map(({ event }) => (
                  <th key={event.id} scope="col" title={event.title} className="min-w-9 align-bottom font-medium">
                    <span className="mx-auto mb-1 block h-1.5 w-4 rounded-full" style={{ backgroundColor: event.eventType.color ?? undefined }} />
                    <span className="block text-caption leading-tight text-muted-foreground">{eventTypeName(event.eventType)}</span>
                    <span className="block text-caption leading-tight">{day.format(new Date(event.startTime))}</span>
                  </th>
                )),
                <th className="p-0 align-bottom">
                  {/* Vertical, so the label does not widen the marker column. */}
                  <span className="mx-auto block rotate-180 text-caption font-bold text-blue [writing-mode:vertical-rl]">{t('season.today')}</span>
                </th>,
              )}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.label}>
                <tr>
                  <th colSpan={span} className="sticky left-0 bg-background pt-3 text-left font-display font-bold">
                    {group.label}
                  </th>
                </tr>
                {group.members.map((member) => (
                  <tr key={member.userId}>
                    <th scope="row" className="sticky left-0 z-10 max-w-40 truncate bg-background pr-2 text-left font-normal">
                      {member.displayName}
                    </th>
                    <td className="px-1 text-right tabular-nums text-muted-foreground">
                      {member.attendedShare == null ? '–' : `${Math.round(member.attendedShare * 100)}%`}
                    </td>
                    {withToday(
                      member.states.map((state, i) => (
                        <td key={columns[i].event.id} className="p-0">
                          <Cell
                            state={state}
                            label={t('season.cell', {
                              name: member.displayName,
                              event: columns[i].event.title,
                              state: state ? t(`attendance.word.${state}`) : t('season.notOnEvent'),
                            })}
                            onClick={state && (() => onSetAnswer(columns[i].event.id, member.userId, nextState(state)))}
                          />
                        </td>
                      )),
                      todayLine,
                    )}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
          {verdictLabels.length > 0 && (
            <tfoot>
              <tr>
                <th colSpan={span} className="sticky left-0 bg-background pt-4 text-left font-display font-bold">
                  {t('lineup.heading')}
                </th>
              </tr>
              {verdictLabels.map((label) => (
                <tr key={label}>
                  <th scope="row" className="sticky left-0 z-10 bg-background pr-2 text-left font-normal">
                    {label}
                  </th>
                  <td />
                  {withToday(
                    columns.map(({ event, verdicts }) => {
                      const row = verdicts[label]
                      const verdict = row && verdictWord(row)
                      return (
                        <td key={event.id} title={verdict ?? undefined} className={`text-center text-caption font-bold tabular-nums ${row ? VERDICT_TONE[row.tone ?? 'short'] : ''}`}>
                          {row && `${row.attending}/${row.required}`}
                          {verdict && <span className="sr-only">{` ${verdict}`}</span>}
                        </td>
                      )
                    }),
                    todayLine,
                  )}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('season.title')} />
      {body()}
    </div>
  )
}

function Cell({ state, label, onClick }: { state: CellState; label: string; onClick: (() => void) | null }) {
  const look = `flex h-8 w-9 items-center justify-center rounded-sm text-caption font-bold ${state ? CELL[state] : ''}`
  if (!onClick) return <span aria-label={label} title={label} className={look} />
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`${look} hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}>
      {state && MARK[state]}
    </button>
  )
}
