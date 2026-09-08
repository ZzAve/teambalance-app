import { describe, expect, it } from 'vitest'
import type { AttendanceState } from '@features/attendance-toggle/ui/AttendanceToggle'
import type { PreferenceStorage } from '@shared/preferences/preferences'
import { ALL_ATTENDANCE_STATES } from './attendance-states'
import {
  hiddenTypeIdsOf,
  parseStoredEventFilters,
  readEventFilters,
  reconcileTypeIds,
  restoreSelection,
  writeEventFilters,
} from './filter-preferences'
import { ALL_TURNOUT_BUCKETS, type TurnoutBucket } from './turnout'

// What the events list remembers between visits (ADR-0030 §1), and — the substance of it — what has
// to happen to a remembered filter before it is trusted. A filter is restored blind: the event types
// it names may have been deleted since, new ones may have appeared, and the value itself may have
// been written by another build. Every one of those has to end in a list the member can explain.

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

const filters = (over: Partial<Parameters<typeof writeEventFilters>[2]> = {}) => ({
  showPast: false,
  hiddenTypeIds: new Set<string>(),
  activeStates: new Set(ALL_ATTENDANCE_STATES),
  activeTurnouts: new Set(ALL_TURNOUT_BUCKETS),
  ...over,
})

describe('reconcileTypeIds', () => {
  it('shows every type when nothing is hidden — the unfiltered default (ADR-0029 §1)', () => {
    expect(reconcileTypeIds(new Set(), ['a', 'b', 'c'])).toEqual(new Set(['a', 'b', 'c']))
  })

  it('shows every type but the hidden ones', () => {
    expect(reconcileTypeIds(new Set(['b']), ['a', 'b', 'c'])).toEqual(new Set(['a', 'c']))
  })

  // The stale-id case: a type hidden last visit has since been deleted or archived. It must not
  // narrow anything — the ids that remain are the only ones that can be judged.
  it('ignores a hidden id that no longer exists', () => {
    expect(reconcileTypeIds(new Set(['gone', 'b']), ['a', 'b'])).toEqual(new Set(['a']))
  })

  it('ignores a hidden set made entirely of ids that no longer exist', () => {
    expect(reconcileTypeIds(new Set(['gone', 'also-gone']), ['a', 'b'])).toEqual(new Set(['a', 'b']))
  })

  // The new-type case: a type created since the last visit was never switched off, so it is on. An
  // admin who adds a type must not have it silently invisible to everyone who ever filtered.
  it('defaults a newly added type to on', () => {
    expect(reconcileTypeIds(new Set(['b']), ['a', 'b', 'new'])).toEqual(new Set(['a', 'new']))
  })

  // The empty case: every type that loaded is hidden. That is not a filter a member can recognise
  // or undo from the list, so all-on is the safer answer than an empty page.
  it('falls back to all-on when the hidden set covers every type that loaded', () => {
    expect(reconcileTypeIds(new Set(['a', 'b']), ['a', 'b'])).toEqual(new Set(['a', 'b']))
  })

  it('is empty while no types have loaded yet — there is nothing to derive', () => {
    expect(reconcileTypeIds(new Set(['a']), [])).toEqual(new Set())
  })
})

describe('hiddenTypeIdsOf', () => {
  it('is the inverse of the active set over the types that exist', () => {
    expect(hiddenTypeIdsOf(new Set(['a', 'c']), ['a', 'b', 'c'])).toEqual(new Set(['b']))
  })

  it('round-trips through reconcileTypeIds', () => {
    const all = ['a', 'b', 'c']
    const active = new Set(['b'])
    expect(reconcileTypeIds(hiddenTypeIdsOf(active, all), all)).toEqual(active)
  })
})

describe('restoreSelection', () => {
  it('keeps a stored subset', () => {
    expect(restoreSelection(['MAYBE'], ALL_ATTENDANCE_STATES)).toEqual(new Set(['MAYBE']))
  })

  it('drops values that are not part of the universe', () => {
    expect(restoreSelection(['MAYBE', 'PERHAPS'], ALL_ATTENDANCE_STATES)).toEqual(new Set(['MAYBE']))
  })

  // An empty selection is not reachable through the isolate-first toggler (ADR-0029 §3), so it can
  // only be stale or hand-edited — and showing an empty list because of it would be the worst
  // possible reading of "remember where I was".
  it('falls back to the whole universe on an empty selection', () => {
    expect(restoreSelection([], ALL_TURNOUT_BUCKETS)).toEqual(new Set(ALL_TURNOUT_BUCKETS))
  })

  it('falls back to the whole universe when every stored value is unknown', () => {
    expect(restoreSelection(['nonsense'], ALL_TURNOUT_BUCKETS)).toEqual(new Set(ALL_TURNOUT_BUCKETS))
  })
})

describe('parseStoredEventFilters', () => {
  it('reads back a complete value', () => {
    expect(
      parseStoredEventFilters({
        showPast: true,
        hiddenTypeIds: ['a'],
        states: ['MAYBE'],
        turnouts: ['covered'],
      }),
    ).toEqual({ showPast: true, hiddenTypeIds: ['a'], states: ['MAYBE'], turnouts: ['covered'] })
  })

  it('rejects anything that is not an object', () => {
    for (const raw of [null, 7, 'filters', ['a']]) {
      expect(parseStoredEventFilters(raw)).toBeNull()
    }
  })

  // Lenient per field: a value from an older or newer build should cost the fields that changed,
  // not the ones that did not.
  it('defaults the fields it cannot read, keeping the ones it can', () => {
    expect(parseStoredEventFilters({ showPast: 'yes', hiddenTypeIds: [1, 'a'], states: 'MAYBE' })).toEqual({
      showPast: false,
      hiddenTypeIds: ['a'],
      states: [],
      turnouts: [],
    })
  })
})

describe('readEventFilters / writeEventFilters', () => {
  it('round-trips all four dimensions', () => {
    const storage = fakeStorage()
    const written = filters({
      showPast: true,
      hiddenTypeIds: new Set(['et-2']),
      activeStates: new Set<AttendanceState>(['NOT_RESPONDED']),
      activeTurnouts: new Set<TurnoutBucket>(['spots-open']),
    })
    writeEventFilters(storage, 'setpoint-vt', written)

    expect(readEventFilters(storage, 'setpoint-vt')).toEqual(written)
  })

  // Per team, not per member: someone who plays in two teams must not carry one team's type filter
  // into the other.
  it('keeps each team separate', () => {
    const storage = fakeStorage()
    writeEventFilters(storage, 'setpoint-vt', filters({ showPast: true, hiddenTypeIds: new Set(['et-2']) }))

    expect(readEventFilters(storage, 'vc-zaanstad')).toEqual(filters())
    expect(readEventFilters(storage, 'setpoint-vt').showPast).toBe(true)
  })

  it('gives the unfiltered defaults when the team has nothing stored', () => {
    expect(readEventFilters(fakeStorage(), 'setpoint-vt')).toEqual(filters())
  })

  it('gives the unfiltered defaults for a malformed stored value', () => {
    const storage = fakeStorage({ 'tb.pref.setpoint-vt.event-filters': '{oops' })
    expect(readEventFilters(storage, 'setpoint-vt')).toEqual(filters())
  })

  // Private mode: storage that throws on every access. Neither direction may take the page down —
  // the member simply gets the unfiltered list they would have had before any of this existed.
  it('degrades to the defaults when storage throws, and never throws itself', () => {
    const throwing: PreferenceStorage = {
      getItem: () => {
        throw new Error('storage disabled')
      },
      setItem: () => {
        throw new Error('storage disabled')
      },
    }

    expect(readEventFilters(throwing, 'setpoint-vt')).toEqual(filters())
    expect(() => writeEventFilters(throwing, 'setpoint-vt', filters({ showPast: true }))).not.toThrow()
    expect(readEventFilters(null, 'setpoint-vt')).toEqual(filters())
    expect(() => writeEventFilters(null, 'setpoint-vt', filters())).not.toThrow()
  })
})
