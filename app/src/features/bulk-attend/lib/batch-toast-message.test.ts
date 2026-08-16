import { describe, expect, it } from 'vitest'
import { batchToastMessage } from './batch-toast-message'

describe('batchToastMessage', () => {
  it('reports the plain count when everything asked for was created', () => {
    expect(batchToastMessage(6, 6)).toBe('6 events set to Attending')
  })

  it('uses the singular noun for one event', () => {
    expect(batchToastMessage(1, 1)).toBe('1 event set to Attending')
  })

  it('names the shortfall when the server created fewer than requested', () => {
    // The whole point: asking for 6 and getting 4 must not look like asking for 4.
    expect(batchToastMessage(4, 6)).toBe('4 of 6 set to Attending — 2 already changed')
  })

  it('names a shortfall of one', () => {
    expect(batchToastMessage(5, 6)).toBe('5 of 6 set to Attending — 1 already changed')
  })

  it('reports nothing created without pretending a batch happened', () => {
    expect(batchToastMessage(0, 3)).toBe('Nothing to set — those events already changed')
  })
})
