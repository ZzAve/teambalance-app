import { describe, expect, it } from 'vitest'
import type { EventRoster, RosterPosition } from '@shared/api/events'
import { makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import {
  coveredSummary,
  hasRosterPanel,
  headcountLine,
  chaseNudge,
  rosterChip,
  rosterRows,
  unassignedNudge,
} from './roster-view'

const pos = (label: string, required: number | undefined, attending: number): RosterPosition => ({
  id: `pos-${label.toLowerCase()}`,
  label,
  required,
  attending,
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
  it('shows no chip for a tally, but still offers a panel', () => {
    const tally = roster({ state: 'TALLY_ONLY', openSlots: 0, positions: [pos('Setter', undefined, 2)] })
    expect(rosterChip(tally)).toBeNull()
    expect(hasRosterPanel(tally)).toBe(true)
    expect(hasRosterPanel(NO_ROSTER)).toBe(false)
  })

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

  // Same words, different tone. The count is the news; the colour is what separates "chase later"
  // from "chase now" — a position sitting at zero.
  it('keeps the wording but turns critical when a position has nobody', () => {
    // Libero at zero is what makes it critical; Setter's two missing bring the count to three.
    const criticalBy3 = [pos('Setter', 3, 1), pos('Libero', 1, 0)]
    expect(rosterChip(roster({ state: 'CRITICAL', openSlots: 3, positions: criticalBy3 }))).toEqual({
      text: '3 spots open',
      tone: 'critical',
    })
  })

  it('says "spot" not "spots" for a single one', () => {
    const shortBy1 = [pos('Setter', 2, 1)]
    const criticalBy1 = [pos('Setter', 1, 0)]
    expect(rosterChip(roster({ state: 'SPOTS_OPEN', openSlots: 1, positions: shortBy1 }))?.text).toBe('1 spot open')
    expect(rosterChip(roster({ state: 'CRITICAL', openSlots: 1, positions: criticalBy1 }))?.text).toBe('1 spot open')
  })

  it('reads as a headcount when only a total is set', () => {
    // No position carries a target, which is the only way the headcount can be the driving axis —
    // so openSlots here is the headcount shortfall, not a sum over rows.
    expect(rosterChip(roster({ state: 'HEADCOUNT_SHORT', openSlots: 2, positions: [] }))).toEqual({
      text: '2 more needed',
      tone: 'short',
    })
    expect(rosterChip(roster({ state: 'HEADCOUNT_FULL', openSlots: 0, positions: [] }))).toEqual({
      text: 'Full',
      tone: 'covered',
    })
  })
})

describe('coveredSummary', () => {
  it('counts covered targeted positions', () => {
    const r = roster({
      positions: [pos('Setter', 2, 2), pos('Libero', 1, 0), pos('Middle', 2, 1)],
    })
    expect(coveredSummary(r)).toBe('1 of 3 covered')
  })

  it('counts an over-filled position as covered', () => {
    expect(coveredSummary(roster({ positions: [pos('Setter', 2, 5)] }))).toBe('1 of 1 covered')
  })

  // A tally is not a fraction of anything.
  it('is absent when no position carries a target', () => {
    expect(coveredSummary(roster({ positions: [pos('Setter', undefined, 3)] }))).toBeNull()
    expect(coveredSummary(roster({ positions: [] }))).toBeNull()
  })

  it('ignores untargeted rows in the fraction', () => {
    const r = roster({ positions: [pos('Setter', 2, 2), pos('Middle', undefined, 4)] })
    expect(coveredSummary(r)).toBe('1 of 1 covered')
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

describe('chaseNudge', () => {
  it('names the single empty position and calls it the one to chase', () => {
    const r = roster({
      positions: [pos('Setter', 2, 1), pos('Libero', 1, 0), pos('Middle', 2, 1)],
    })
    expect(chaseNudge(r)).toEqual({ lead: 'Libero', rest: 'still has no one — the one to chase.' })
  })

  // Two is still a nudge, so both are named. "the one to chase" must not survive: it is a definite
  // article, and claiming uniqueness when two are empty says the other one is fine.
  it('names both when two are empty, and drops the uniqueness claim', () => {
    const r = roster({ positions: [pos('Libero', 1, 0), pos('Middle', 2, 0)] })
    expect(chaseNudge(r)).toEqual({ lead: 'Libero and Middle', rest: 'still have no one.' })
  })

  // Three names is an inventory, not a nudge, and the rows above already list them. The count is
  // the news: it says "this is not one gap" without reprinting the panel.
  it('counts them instead of listing once there are three or more', () => {
    const r = roster({
      positions: [pos('Libero', 1, 0), pos('Middle', 2, 0), pos('Setter', 2, 0)],
    })
    expect(chaseNudge(r)).toEqual({ lead: '3 positions', rest: 'still have no one.' })
  })

  // The reported case: nobody has answered at all, so every targeted position is empty. Singling
  // one out implied the other five were covered.
  it('counts them when nothing has been answered at all', () => {
    const r = roster({
      positions: [
        pos('Diagonaal', 2, 0),
        pos('Libero', 1, 0),
        pos('Midden', 3, 0),
        pos('Passer/Loper', 2, 0),
        pos('Spelverdeler', 2, 0),
        pos('Trainer/Coach', 1, 0),
      ],
    })
    expect(chaseNudge(r)).toEqual({ lead: '6 positions', rest: 'still have no one.' })
  })

  it('is absent when every targeted position has somebody', () => {
    expect(chaseNudge(roster({ positions: [pos('Setter', 3, 1)] }))).toBeNull()
  })

  it('never counts an untargeted position, however empty', () => {
    expect(chaseNudge(roster({ positions: [pos('Middle', undefined, 0)] }))).toBeNull()
  })
})

describe('unassignedNudge', () => {
  it('prompts when attendees have no position set', () => {
    expect(unassignedNudge(roster({ unassignedAttending: 3 }))).toBe("3 going haven't set a position")
  })

  it('reads singular for one', () => {
    expect(unassignedNudge(roster({ unassignedAttending: 1 }))).toBe("1 going hasn't set a position")
  })

  // A prompt, not a permanent label.
  it('is absent when everyone coming has a position', () => {
    expect(unassignedNudge(roster({ unassignedAttending: 0 }))).toBeNull()
  })
})

describe('headcountLine', () => {
  // The locked rule: a total set alongside position targets is secondary information in the panel,
  // never the chip. This is where it surfaces.
  it('shows the total as a secondary line when positions also carry targets', () => {
    const r = roster({ totalTarget: 12, totalAttending: 7, positions: [pos('Setter', 2, 2)] })
    expect(headcountLine(r)).toBe('7/12 going')
  })

  // Present with or without position targets — only *where* it renders differs (panel header when
  // it is the only target, a secondary line beneath the rows when positions are targeted too).
  it('is present when the total is the only target', () => {
    const r = roster({ totalTarget: 12, totalAttending: 7, positions: [] })
    expect(headcountLine(r)).toBe('7/12 going')
  })

  it('is absent when there is no total at all', () => {
    expect(headcountLine(roster({ totalTarget: undefined }))).toBeNull()
  })
})
