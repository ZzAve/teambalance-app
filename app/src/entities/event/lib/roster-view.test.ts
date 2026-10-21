import { describe, expect, it } from 'vitest'
import type { EventRoster, RosterPosition } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import {
  rosterChip,
  rosterRows,
  whoIsComing,
} from './roster-view'

const pos = (
  label: string,
  required: number | undefined,
  attending: number,
  kind: RosterPosition['kind'] = 'PLAYING',
): RosterPosition => ({
  id: `pos-${label.toLowerCase()}`,
  label,
  required,
  attending,
  kind,
})

const roster = (overrides: Partial<EventRoster>) => makeRoster(overrides)

// These are the numbers→words/pips rules and nothing else. The *status* (state, openSlots) is the
// server's, computed and tested in RosterFillTest — nothing here re-derives it.
describe('rosterChip', () => {
  it('shows no chip when the roster is not tracked', () => {
    expect(rosterChip(NO_ROSTER)).toBeNull()
  })

  // A tally has nothing to fall short of, so a chip would invent a judgement nobody asked for. It
  // still differs from "off": the panel opens.

  it('reads "Lineup set" when every targeted position is covered', () => {
    const covered = [pos('Setter', 2, 2), pos('Libero', 1, 1)]
    expect(rosterChip(roster({ state: 'LINEUP_SET', openSlots: 0, positions: covered }))).toEqual({
      text: 'Lineup set',
      tone: 'covered',
    })
  })

  it('counts the open spots when the lineup is short', () => {
    const shortBy3 = [pos('Setter', 3, 1), pos('Libero', 2, 1)]
    expect(rosterChip(roster({ state: 'SPOTS_OPEN', openSlots: 3, positions: shortBy3 }))).toEqual({
      text: '3 spots open',
      tone: 'short',
    })
  })

  // Critical is not "more of the same shortfall": a position has nobody, and that is what the chip
  // says. The count of open slots is the wrong news here — Setter being two short is not why this
  // event needs chasing now.
  it('names the missing position rather than the open-slot count when a position has nobody', () => {
    // Libero at zero is what makes it critical; Setter's two missing bring openSlots to three.
    const criticalBy3 = [pos('Setter', 3, 1), pos('Libero', 1, 0)]
    expect(rosterChip(roster({ state: 'CRITICAL', openSlots: 3, positions: criticalBy3 }))).toEqual({
      text: 'Missing a position',
      tone: 'critical',
    })
  })

  it('counts the empty positions once more than one has nobody', () => {
    const criticalBy4 = [pos('Setter', 3, 0), pos('Libero', 1, 0)]
    expect(rosterChip(roster({ state: 'CRITICAL', openSlots: 4, positions: criticalBy4 }))?.text).toBe(
      'Missing 2 positions',
    )
  })

  // WCAG 1.4.1 (#313). Before this, both states read "3 spots open" and only gold-vs-red told them
  // apart — unavailable to anyone who cannot distinguish the two, and absent from the accessible
  // name entirely. The words, not the tone, must carry the difference.
  it('distinguishes critical from merely short by text, not only by tone', () => {
    const short = rosterChip(roster({ state: 'SPOTS_OPEN', openSlots: 3, positions: [pos('Setter', 3, 0)] }))
    const critical = rosterChip(roster({ state: 'CRITICAL', openSlots: 3, positions: [pos('Setter', 3, 0)] }))
    expect(critical?.text).not.toBe(short?.text)
  })

  it('says "spot" not "spots" for a single open one', () => {
    const shortBy1 = [pos('Setter', 2, 1)]
    expect(rosterChip(roster({ state: 'SPOTS_OPEN', openSlots: 1, positions: shortBy1 }))?.text).toBe('1 spot open')
  })

  it('reads as a headcount when only a total is set', () => {
    // No position carries a target, which is the only way the headcount can be the driving axis —
    // so openSlots here is the headcount shortfall, not a sum over rows.
    const counts = { positions: [], totalAttending: 10, totalTarget: 12 }
    expect(rosterChip(roster({ state: 'HEADCOUNT_SHORT', openSlots: 2, ...counts }))).toEqual({
      text: '2 more needed · 10/12',
      tone: 'short',
    })
    expect(rosterChip(roster({ state: 'HEADCOUNT_FULL', openSlots: 0, ...counts, totalAttending: 13 }))).toEqual({
      text: 'Full · 13/12',
      tone: 'covered',
    })
  })
})


describe('rosterRows', () => {
  it('draws one pip per required slot, filled left to right', () => {
    const [row] = rosterRows(roster({ positions: [pos('Setter', 3, 2)] }))
    expect(row.pips).toEqual(['filled', 'filled', 'open'])
    expect(row.countLabel).toBe('2/3')
    expect(row.tone).toBe('short')
  })

  // Every pip empty AND nobody attending is the alarm case, distinct from merely short.
  it('marks every pip missing when the position has nobody', () => {
    const [row] = rosterRows(roster({ positions: [pos('Libero', 2, 0)] }))
    expect(row.pips).toEqual(['missing', 'missing'])
    expect(row.countLabel).toBe('0/2')
    expect(row.tone).toBe('critical')
  })

  it('fills every pip and reports the surplus when over-filled', () => {
    const [row] = rosterRows(roster({ positions: [pos('Setter', 2, 5)] }))
    // The surplus gets no pips of its own — it is the "+N", not extra slots the team asked for.
    expect(row.pips).toEqual(['filled', 'filled'])
    expect(row.surplus).toBe(3)
    expect(row.tone).toBe('covered')
  })

  it('gives an untargeted position a plain count and no pips', () => {
    const [row] = rosterRows(roster({ positions: [pos('Middle', undefined, 4)] }))
    expect(row.pips).toEqual([])
    expect(row.countLabel).toBe('4')
    expect(row.surplus).toBe(0)
    expect(row.tone).toBeNull()
  })

  // The server already ordered and filtered them; the panel must not reshuffle.
  it('keeps the order the server sent', () => {
    const r = roster({ positions: [pos('Zeta', 1, 1), pos('Alpha', 1, 1)] })
    expect(rosterRows(r).map((row) => row.label)).toEqual(['Zeta', 'Alpha'])
  })
})



describe('whoIsComing', () => {
  it('splits the people going into members playing, substitutes and each staff role', () => {
    const roster = makeRoster({
      positions: [pos('Setter', 2, 2), pos('Trainer', undefined, 1, 'STAFF'), pos('Physio', undefined, 2, 'STAFF')],
      totalAttending: 12,
      playingAttending: 9,
      staffAttending: 3,
      substituteAttending: 2,
    })
    expect(whoIsComing(roster)).toEqual({
      total: 12,
      players: 7,
      substitutes: 2,
      staff: [
        { id: 'pos-trainer', label: 'Trainer', count: 1 },
        { id: 'pos-physio', label: 'Physio', count: 2 },
      ],
    })
  })

  it('shows every staff role of the team, 0 for one the roster dropped because nobody is going', () => {
    const roster = makeRoster({
      positions: [pos('Setter', 2, 2), pos('Trainer', undefined, 1, 'STAFF')],
      totalAttending: 3,
      playingAttending: 2,
      staffAttending: 1,
    })
    const roles = [
      { id: 'pos-trainer', label: 'Trainer' },
      { id: 'pos-physio', label: 'Physio' },
    ]
    expect(whoIsComing(roster, roles).staff).toEqual([
      { id: 'pos-trainer', label: 'Trainer', count: 1 },
      { id: 'pos-physio', label: 'Physio', count: 0 },
    ])
  })
})
