import { describe, expect, it } from 'vitest'
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
