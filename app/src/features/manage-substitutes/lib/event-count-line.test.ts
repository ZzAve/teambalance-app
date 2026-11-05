import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { eventCountLine } from './event-count-line'

describe('eventCountLine', () => {
  it('says the count is still being checked', () => {
    expect(eventCountLine('Jan', undefined, false)).toBe('Checking which events Jan is on…')
  })

  it('says when the count could not be read, instead of checking forever', () => {
    expect(eventCountLine('Jan', undefined, true)).toBe("Couldn't check which events Jan is on.")
  })

  it('names the number of events, singular and plural', () => {
    expect(eventCountLine('Jan', 0, false)).toBe('Jan is not on any event.')
    expect(eventCountLine('Jan', 1, false)).toBe('Jan is on 1 event.')
    expect(eventCountLine('Jan', 4, false)).toBe('Jan is on 4 events.')
  })
})

describe('eventCountLine in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says the count, singular and plural, in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(eventCountLine('Jan', undefined, false)).toBe('Controleren bij welke events Jan staat…')
    expect(eventCountLine('Jan', undefined, true)).toBe('Controleren bij welke events Jan staat is mislukt.')
    expect(eventCountLine('Jan', 0, false)).toBe('Jan staat bij geen enkel event.')
    expect(eventCountLine('Jan', 1, false)).toBe('Jan staat bij 1 event.')
    expect(eventCountLine('Jan', 4, false)).toBe('Jan staat bij 4 events.')
  })
})
