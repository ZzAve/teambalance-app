import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { crossMemberToast } from './cross-member-toast'

describe('crossMemberToast', () => {
  it('names the member and the new answer', () => {
    expect(crossMemberToast('Sanne', 'ABSENT', 'ATTENDING').message).toBe("Set Sanne to Can't")
    expect(crossMemberToast('Lars', 'MAYBE', 'ATTENDING').message).toBe('Set Lars to Maybe')
  })

  it('offers Undo back to a stored prior answer', () => {
    expect(crossMemberToast('Sanne', 'ABSENT', 'ATTENDING').undoState).toBe('ATTENDING')
    expect(crossMemberToast('Sanne', 'ATTENDING', 'MAYBE').undoState).toBe('MAYBE')
  })

  it('withholds Undo when the prior answer was Not responded — there is no row to restore', () => {
    // Reverting to NOT_RESPONDED means deleting the row, which the write API can't express.
    expect(crossMemberToast('Sanne', 'ATTENDING', 'NOT_RESPONDED').undoState).toBeNull()
  })
})

describe('crossMemberToast in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('names the member and the new answer in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(crossMemberToast('Sanne', 'ABSENT', 'ATTENDING').message).toBe('Sanne staat nu op Afwezig')
  })
})
