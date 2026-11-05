import { describe, expect, it, afterEach } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
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

// The type name is the team's own text, so Dutch does not try to pluralize it (ADR-0043 §7).
describe('attendLabel in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('counts with the type name as the team wrote it, lowercased', async () => {
    await i18n.changeLanguage('nl')
    expect(attendLabel(1, 'Training')).toBe('Aanwezig bij 1 training')
    expect(attendLabel(3, 'Wedstrijd')).toBe('Aanwezig bij 3× wedstrijd')
  })
})
