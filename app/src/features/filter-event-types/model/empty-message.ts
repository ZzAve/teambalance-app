import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import { ALL_ATTENDANCE_STATES } from '@entities/event/lib/attendance-states'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from './turnout'
import { i18n } from '@shared/i18n/i18n'

interface EmptyMessageInput {
    /** A hero is on screen, so the page is not empty — only the list beneath it is. */
    hasHero: boolean
    showPast: boolean
    activeTypeIds: Set<string>
    allTypeIds: string[]
    activeStates: Set<AttendanceState>
    activeTurnouts: Set<TurnoutBucket>
}

/** The two bands that mean "short of people". The other two must not borrow their wording. */
const SHORT_BUCKETS: TurnoutBucket[] = ['missing-position', 'spots-open']

/**
 * What the events list says when it has nothing to show.
 *
 * With four filter dimensions the specific messages are combinatorial, so only a *single* narrowed
 * dimension earns one; anything else falls back to the generic line, which is true whatever the
 * combination. The answer and turnout dimensions narrow that further to the selections whose
 * emptiness has a plain-English meaning: "Nothing needs your answer" after filtering to `Going`, or
 * "No events are short of players" after filtering to `Covered`, would both be lies.
 */
export function emptyEventsMessage({
    hasHero,
    showPast,
    activeTypeIds,
    allTypeIds,
    activeStates,
    activeTurnouts,
}: EmptyMessageInput): string {
    if (hasHero) return i18n.t('events.empty.nothingElse')

    const typeFiltered = activeTypeIds.size < allTypeIds.length
    const stateFiltered = activeStates.size < ALL_ATTENDANCE_STATES.length
    const turnoutFiltered = activeTurnouts.size < ALL_TURNOUT_BUCKETS.length
    const narrowed = [typeFiltered, stateFiltered, turnoutFiltered].filter(Boolean).length

    if (narrowed === 0) return showPast ? i18n.t('events.empty.noneYet') : i18n.t('events.empty.noneUpcoming')
    if (narrowed === 1) {
        if (typeFiltered) return i18n.t('events.empty.noneForType')
        if (stateFiltered && activeStates.size === 1 && activeStates.has('NOT_RESPONDED')) {
            return i18n.t('events.empty.nothingToAnswer')
        }
        if (turnoutFiltered && [...activeTurnouts].every((b) => SHORT_BUCKETS.includes(b))) {
            return i18n.t('events.empty.noneShort')
        }
    }
    return i18n.t('events.empty.noneMatch')
}
