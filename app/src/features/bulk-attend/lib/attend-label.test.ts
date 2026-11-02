import { describe, expect, it } from 'vitest'
import { attendLabel } from './attend-label'

describe('attendLabel', () => {
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
  })
})
