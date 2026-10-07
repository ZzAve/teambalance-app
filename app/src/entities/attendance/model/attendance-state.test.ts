import { describe, expect, it } from 'vitest'
import { ALL_ATTENDANCE_STATES, myAnswerOf } from './attendance-state'

describe('myAnswerOf', () => {
  const attendances = [
    { userId: 'user-1', state: 'MAYBE' as const },
    { userId: 'user-2', state: 'ATTENDING' as const },
  ]

  it('returns the state of the entry belonging to the user', () => {
    expect(myAnswerOf(attendances, 'user-2')).toBe('ATTENDING')
  })

  it('is NOT_RESPONDED when the user has no entry', () => {
    expect(myAnswerOf(attendances, 'user-3')).toBe('NOT_RESPONDED')
  })

  it('is NOT_RESPONDED when nobody is signed in', () => {
    expect(myAnswerOf(attendances, null)).toBe('NOT_RESPONDED')
  })
})

describe('ALL_ATTENDANCE_STATES', () => {
  it('lists the four states in the order the answer control offers them', () => {
    expect(ALL_ATTENDANCE_STATES).toEqual(['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'])
  })
})
