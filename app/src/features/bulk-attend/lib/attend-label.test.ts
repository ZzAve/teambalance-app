import { describe, expect, it } from 'vitest'
import { makeEvent } from '@shared/testing/event-fixtures'
import { attendLabel, sharedTypeName } from './attend-label'

const TRAINING = { id: 'et-training', name: 'Training', color: '#22c55e' }
const MATCH = { id: 'et-match', name: 'Match', color: '#3b82f6' }

describe('sharedTypeName', () => {
  it('returns null for an empty batch', () => {
    expect(sharedTypeName([])).toBeNull()
  })

  it('names the type when every event is the same kind', () => {
    const events = [makeEvent({ id: 'a', eventType: TRAINING }), makeEvent({ id: 'b', eventType: TRAINING })]
    expect(sharedTypeName(events)).toBe('Training')
  })

  it('returns null when the batch spans types', () => {
    const events = [makeEvent({ id: 'a', eventType: TRAINING }), makeEvent({ id: 'b', eventType: MATCH })]
    expect(sharedTypeName(events)).toBeNull()
  })

  it('names the type for a single event', () => {
    expect(sharedTypeName([makeEvent({ eventType: MATCH })])).toBe('Match')
  })
})

describe('attendLabel', () => {
  it('falls back to the neutral noun for a mixed batch', () => {
    expect(attendLabel(6, null)).toBe('Attend 6 events')
  })

  it('names the type when the batch is all one kind', () => {
    expect(attendLabel(4, 'Training')).toBe('Attend 4 trainings')
  })

  it('pluralizes an -ch ending correctly', () => {
    // The reason a naive `+ "s"` is not good enough: "Attend 3 matchs" would ship.
    expect(attendLabel(3, 'Match')).toBe('Attend 3 matches')
  })

  it('pluralizes a consonant + y ending correctly', () => {
    expect(attendLabel(2, 'Friendly')).toBe('Attend 2 friendlies')
  })

  it('uses the singular noun for a single event', () => {
    expect(attendLabel(1, 'Training')).toBe('Attend 1 training')
    expect(attendLabel(1, null)).toBe('Attend 1 event')
  })
})
