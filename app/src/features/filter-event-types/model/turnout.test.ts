import {describe, expect, it} from 'vitest'
import type {RosterState} from '@shared/api/events'
import {makeEvent, makeRoster} from '@shared/testing/event-fixtures'
import {
    ALL_TURNOUT_BUCKETS,
    TURNOUT_BY_STATE,
    hasTurnoutTargets,
    turnoutBucket,
} from './turnout'

const eventInState = (state: RosterState) =>
    makeEvent({id: state, roster: makeRoster({state, positions: [], openSlots: 0})})

describe('turnoutBucket', () => {
    // Exhaustive on purpose (#311): every one of the seven Roster States is pinned to its band, so a
    // state added server-side lands here as a failure instead of falling through to no bucket.
    const EXPECTED: Record<RosterState, (typeof ALL_TURNOUT_BUCKETS)[number]> = {
        CRITICAL: 'missing-position',
        SPOTS_OPEN: 'spots-open',
        HEADCOUNT_SHORT: 'spots-open',
        LINEUP_SET: 'covered',
        HEADCOUNT_FULL: 'covered',
        TALLY_ONLY: 'no-target',
        OFF: 'no-target',
    }

    it('covers exactly the seven Roster States, so a new one fails rather than falls through', () => {
        expect(Object.keys(TURNOUT_BY_STATE).sort()).toEqual(Object.keys(EXPECTED).sort())
    })

    it.each(Object.entries(EXPECTED))('puts %s in the %s band', (state, bucket) => {
        expect(turnoutBucket(state as RosterState)).toBe(bucket)
    })

    it('is a total partition: every state lands in one of the four chips', () => {
        for (const bucket of Object.values(TURNOUT_BY_STATE)) {
            expect(ALL_TURNOUT_BUCKETS).toContain(bucket)
        }
    })
})

describe('hasTurnoutTargets', () => {
    it('is false for an empty list', () => {
        expect(hasTurnoutTargets([])).toBe(false)
    })

    it('is false for a team that sets no targets, where every event is a tally or a social', () => {
        expect(hasTurnoutTargets([eventInState('TALLY_ONLY'), eventInState('OFF')])).toBe(false)
    })

    // The group must not come and go with "Show past events": upcoming events that all share one
    // band still keep it, so the member sees the same filter in both views.
    it('is true once one event has a target, even when every event shares one band', () => {
        expect(hasTurnoutTargets([eventInState('SPOTS_OPEN'), eventInState('HEADCOUNT_SHORT')])).toBe(true)
    })
})
