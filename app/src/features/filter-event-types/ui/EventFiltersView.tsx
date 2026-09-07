import { useEffect, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { EventTypeItem } from '@shared/api/event-types'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { ALL_ATTENDANCE_STATES } from '../model/attendance-states'

interface EventFiltersViewProps {
  eventTypes: EventTypeItem[]
  /** Ids of the types currently shown. Every id active = no type filter in effect. */
  activeTypeIds: Set<string>
  /** Attendance States currently shown. Every state active = no answer filter in effect. */
  activeStates: Set<AttendanceState>
  showPast: boolean
  /** How many events survive the current filter — announced, never shown (ADR-0029). */
  resultCount: number
  onToggleType: (typeId: string) => void
  onToggleState: (state: AttendanceState) => void
  onToggleShowPast: (showPast: boolean) => void
}

/** The answer chips, worded as the member's own answer control words them (#273, CONTEXT.md). */
const STATE_CHIPS: { state: AttendanceState; label: string; active: string; inactive: string }[] = [
  {
    state: 'ATTENDING',
    label: 'Going',
    active: 'bg-green border-green text-white',
    inactive: 'border-green/40 text-green',
  },
  {
    state: 'MAYBE',
    label: 'Maybe',
    active: 'bg-gold border-gold text-white',
    inactive: 'border-gold/40 text-gold',
  },
  {
    state: 'ABSENT',
    label: "Can't",
    active: 'bg-red border-red text-white',
    inactive: 'border-red/40 text-red',
  },
  {
    state: 'NOT_RESPONDED',
    label: 'Not responded',
    // No semantic color: not responding is the absence of an answer, not a fourth verdict.
    active: 'bg-muted-foreground border-muted-foreground text-white',
    inactive: 'border-muted-foreground/40 text-muted-foreground',
  },
]

/**
 * The events page's single filter control: an icon button that opens a popover holding the
 * event-type chips, the answer chips and the "Show past events" switch. It replaces the old
 * Upcoming/Past segmented tab bar — past events are a filter, not a mode, and the page no longer
 * spends a band of chrome on a control that only flipped which way the same list grew.
 *
 * Each chip group is a total partition of the list, so "all chips on" is the unfiltered default and
 * can never hide anything (ADR-0029 §1). Selection is isolate-first and lives in the route, which
 * owns the one toggler both groups share.
 *
 * Prop-only apart from the popover's own open/closed state, which is local view state: the selected
 * types, the selected answers and the show-past flag live in the route so they can drive
 * `useEvents`, the hero and Bulk Attend.
 */
export function EventFiltersView({
  eventTypes,
  activeTypeIds,
  activeStates,
  showPast,
  resultCount,
  onToggleType,
  onToggleState,
  onToggleShowPast,
}: EventFiltersViewProps) {
  const [open, setOpen] = useState(false)
  // A dot on the trigger so an active filter is visible with the popover closed — otherwise a
  // filtered list looks like an empty one. Every dimension counts, or the answer chips would narrow
  // the list invisibly.
  const hasActiveFilter =
    showPast ||
    activeTypeIds.size < eventTypes.length ||
    activeStates.size < ALL_ATTENDANCE_STATES.length

  // Escape has to be caught on the document: focus stays on the trigger, which is a sibling of the
  // popover, so a handler on the panel itself would never see the key.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="relative">
      <button
        aria-label="Filters"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <SlidersHorizontal size={16} />
        {hasActiveFilter && (
          <span
            data-testid="active-filter-dot"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-background bg-blue"
          />
        )}
      </button>

      {/* The result count is announced, not shown: a member who taps a chip inside a popover gets no
          other feedback that the list behind it moved. */}
      <p aria-live="polite" className="sr-only">
        {resultCount === 1 ? '1 event matches these filters' : `${resultCount} events match these filters`}
      </p>

      {open && (
        <>
          {/* Click-outside catcher. Not focusable — Escape and the trigger are the keyboard paths. */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Filters"
            className="card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-2xl border border-border/60 bg-card p-3.5"
          >
            {/* A team with no event types (or a types request that failed) still gets the past
                toggle — it is the only way to reach past events now that the tab bar is gone. */}
            {eventTypes.length > 0 && (
              <>
                <div role="group" aria-labelledby="event-types-filter-heading">
                  <h3
                    id="event-types-filter-heading"
                    className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground"
                  >
                    Event types
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.map((type) => {
                      const isActive = activeTypeIds.has(type.id)
                      const color = type.color ?? '#888'
                      return (
                        <button
                          key={type.id}
                          aria-pressed={isActive}
                          onClick={() => onToggleType(type.id)}
                          style={
                            isActive
                              ? { backgroundColor: color, borderColor: color, color: '#fff' }
                              : { borderColor: color + '66', color }
                          }
                          className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                        >
                          {type.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="-mx-3.5 my-3.5 h-px bg-border/60" />
              </>
            )}

            <div role="group" aria-labelledby="your-answer-filter-heading">
              <h3
                id="your-answer-filter-heading"
                className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground"
              >
                Your answer
              </h3>
              <div className="flex flex-wrap gap-2">
                {STATE_CHIPS.map(({ state, label, active, inactive }) => {
                  const isActive = activeStates.has(state)
                  return (
                    <button
                      key={state}
                      aria-pressed={isActive}
                      onClick={() => onToggleState(state)}
                      className={[
                        'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                        isActive ? active : inactive,
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="-mx-3.5 my-3.5 h-px bg-border/60" />

            <div className="flex items-center justify-between gap-2.5">
              <div>
                <div className="text-[13.5px] font-semibold">Show past events</div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {showPast ? 'On — past events included' : 'Off — upcoming only'}
                </div>
              </div>
              <button
                role="switch"
                aria-checked={showPast}
                aria-label="Show past events"
                onClick={() => onToggleShowPast(!showPast)}
                className={[
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                  showPast ? 'bg-green' : 'bg-muted-foreground/30',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200',
                    showPast ? 'left-[22px]' : 'left-0.5',
                  ].join(' ')}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
