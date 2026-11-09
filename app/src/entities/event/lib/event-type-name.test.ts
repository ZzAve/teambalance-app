import { describe, expect, it } from 'vitest'
import { eventTypeName } from './event-type-name'

const TRAINING_ID = 'c0000000-0000-0000-0000-000000000001'
const MATCH_ID = 'c0000000-0000-0000-0000-000000000002'
const OTHER_ID = 'c0000000-0000-0000-0000-000000000003'

describe('eventTypeName', () => {
  it('translates an untouched seeded default per language', () => {
    expect(eventTypeName({ id: MATCH_ID, name: 'Match' }, 'nl')).toBe('Wedstrijd')
    expect(eventTypeName({ id: OTHER_ID, name: 'Other' }, 'nl')).toBe('Overig')
    expect(eventTypeName({ id: TRAINING_ID, name: 'Training' }, 'nl')).toBe('Training')
    expect(eventTypeName({ id: MATCH_ID, name: 'Match' }, 'en')).toBe('Match')
    expect(eventTypeName({ id: OTHER_ID, name: 'Other' }, 'en')).toBe('Other')
  })

  it('keeps the name of a seeded type the team renamed', () => {
    expect(eventTypeName({ id: MATCH_ID, name: 'Competitie' }, 'nl')).toBe('Competitie')
    expect(eventTypeName({ id: MATCH_ID, name: 'Competitie' }, 'en')).toBe('Competitie')
  })

  it('keeps the name of a type that is not a seeded default, even when it is called Match', () => {
    expect(eventTypeName({ id: 'some-other-uuid', name: 'Match' }, 'nl')).toBe('Match')
  })
})
