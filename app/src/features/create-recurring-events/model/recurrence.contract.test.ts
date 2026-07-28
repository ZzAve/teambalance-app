import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { RecurrenceFrequency, Weekday } from '@shared/api/recurring-events'
import { generateOccurrences, MAX_OCCURRENCES } from './recurrence'

// CROSS-SEAM CONTRACT — the occurrence-generation rule lives in both this file's `recurrence.ts` and
// the backend's `Recurrence.occurrences()` and must stay in lockstep (ADR-0014). This spec and the
// Kotlin `RecurrenceContractTest` read the SAME golden fixture, so a change to either implementation
// that diverges from the pinned vectors fails its own suite in CI. See the fixture's `_doc`.

interface OccurrenceCase {
  name: string
  frequency: RecurrenceFrequency
  weekdays: Weekday[]
  startDate: string
  endDate: string
  expected: string[]
}
interface GoldenFixture {
  maxOccurrences: number
  occurrences: OccurrenceCase[]
}

// Walk up from this test file to the repo root to read the shared fixture — the exact same file the
// backend contract test loads, resolved cwd-independently.
function loadGoldenFixture(): GoldenFixture {
  let dir = dirname(fileURLToPath(import.meta.url))
  for (let i = 0; i < 12; i++) {
    const candidate = resolve(dir, 'contracts/recurrence-rules.golden.json')
    if (existsSync(candidate)) return JSON.parse(readFileSync(candidate, 'utf8')) as GoldenFixture
    dir = dirname(dir)
  }
  throw new Error('golden fixture contracts/recurrence-rules.golden.json not found')
}

const fixture = loadGoldenFixture()

describe('recurrence generation contract', () => {
  it('MAX_OCCURRENCES matches the shared contract cap', () => {
    expect(MAX_OCCURRENCES).toBe(fixture.maxOccurrences)
  })

  for (const c of fixture.occurrences) {
    it(c.name, () => {
      expect(
        generateOccurrences({
          frequency: c.frequency,
          weekdays: c.weekdays,
          startDate: c.startDate,
          endDate: c.endDate,
        }),
      ).toEqual(c.expected)
    })
  }
})
