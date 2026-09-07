import {describe, expect, it} from 'vitest'
import type {RosterState} from '@shared/api/events'
import {makeEvent, makeRoster} from '@shared/testing/event-fixtures'
import {
    ALL_TURNOUT_BUCKETS,
    TURNOUT_BY_STATE,
    spansMultipleTurnoutBuckets,
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

describe('spansMultipleTurnoutBuckets', () => {
    it('is false for an empty list', () => {
        expect(spansMultipleTurnoutBuckets([])).toBe(false)
    })

    it('is false for a team that sets no targets, where every event is a tally', () => {
        expect(spansMultipleTurnoutBuckets([eventInState('TALLY_ONLY'), eventInState('TALLY_ONLY')]))
            .toBe(false)
    })

    it('is false when two states share one band — the group would still filter nothing', () => {
        expect(spansMultipleTurnoutBuckets([eventInState('SPOTS_OPEN'), eventInState('HEADCOUNT_SHORT')]))
            .toBe(false)
    })

    it('is true once the list spans two bands', () => {
        expect(spansMultipleTurnoutBuckets([eventInState('CRITICAL'), eventInState('LINEUP_SET')]))
            .toBe(true)
    })
})
