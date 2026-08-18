import { describe, expect, it } from 'vitest'
import { batchToastMessage } from './batch-toast-message'

describe('batchToastMessage', () => {
  it('echoes the type the button named when everything asked for was created', () => {
    expect(batchToastMessage(12, 12, 'Training')).toBe('12 trainings set to Attending')
  })

  it('uses the singular noun for one event', () => {
    expect(batchToastMessage(1, 1, 'Training')).toBe('1 training set to Attending')
  })

  it('pluralizes an -ch type correctly', () => {
    expect(batchToastMessage(3, 3, 'Match')).toBe('3 matches set to Attending')
  })

  it('names the shortfall when the server created fewer than requested', () => {
    // The whole point: asking for 6 and getting 4 must not look like asking for 4.
    expect(batchToastMessage(4, 6, 'Training')).toBe('4 of 6 trainings set to Attending — 2 already changed')
  })

  it('names a shortfall of one', () => {
    expect(batchToastMessage(5, 6, 'Training')).toBe('5 of 6 trainings set to Attending — 1 already changed')
  })

  it('reports nothing created without pretending a batch happened', () => {
    expect(batchToastMessage(0, 3, 'Training')).toBe('Nothing to set — those events already changed')
  })
})
