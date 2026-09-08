import { describe, expect, it } from 'vitest'
import { crossMemberToast } from './cross-member-toast'

describe('crossMemberToast', () => {
  it('names the member and the new answer', () => {
    expect(crossMemberToast('Sanne', 'ABSENT', 'ATTENDING').message).toBe("Set Sanne to Can't go")
    expect(crossMemberToast('Lars', 'MAYBE', 'ATTENDING').message).toBe('Set Lars to Maybe')
  })

  it('offers Undo back to a stored prior answer', () => {
    expect(crossMemberToast('Sanne', 'ABSENT', 'ATTENDING').undoState).toBe('ATTENDING')
    expect(crossMemberToast('Sanne', 'ATTENDING', 'MAYBE').undoState).toBe('MAYBE')
  })

  it('withholds Undo when the prior answer was Awaiting — there is no row to restore', () => {
    // Reverting to NOT_RESPONDED means deleting the row, which the write API can't express.
    expect(crossMemberToast('Sanne', 'ATTENDING', 'NOT_RESPONDED').undoState).toBeNull()
  })
})
