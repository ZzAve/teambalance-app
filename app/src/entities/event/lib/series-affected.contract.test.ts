import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { Event, EventSeriesScope } from '@shared/api/events'
import { buildAffectedPreview } from './series-affected'

// CROSS-SEAM CONTRACT — the edit/delete split matrix lives in both this file's `series-affected.ts`
// and the backend's `SeriesModification.planEdit/planDelete` and must stay in lockstep (ADR-0014).
// This spec and the Kotlin `RecurrenceContractTest` read the SAME golden fixture, so a change to
// either implementation that diverges from the pinned vectors fails its own suite in CI.

interface SplitCase {
  name: string
  series: { id: string; startTime: string }[]
  currentId: string
  scope: EventSeriesScope
  affectedIds: string[]
}
interface GoldenFixture {
  splits: SplitCase[]
}

function loadGoldenFixture(): GoldenFixture {
  let dir = dirname(fileURLToPath(import.meta.url))
  for (let i = 0; i < 12; i++) {
    const candidate = resolve(dir, 'contracts/recurrence-rules.golden.json')
    if (existsSync(candidate)) return JSON.parse(readFileSync(candidate, 'utf8')) as GoldenFixture
    dir = dirname(dir)
  }
  throw new Error('golden fixture contracts/recurrence-rules.golden.json not found')
}

const event = (id: string, startTime: string): Event => ({
  id,
  eventType: { id: 'et-1', name: 'Training', color: '#225C9C' },
  title: 'Training',
  description: undefined,
  startTime,
  endTime: startTime,
  location: undefined,
  references: [],
  recurringGroup: 'group-1',
  attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
})

const fixture = loadGoldenFixture()

describe('series split-matrix contract', () => {
  for (const c of fixture.splits) {
    it(c.name, () => {
      const siblings = c.series.map((s) => event(s.id, s.startTime))
      const preview = buildAffectedPreview(siblings, c.currentId, c.scope)!
      expect(preview.nodes.filter((n) => n.affected).map((n) => n.id)).toEqual(c.affectedIds)
    })
  }
})
