import { describe, expect, it } from 'vitest'
import { eventTransitionName } from './transition-name'

describe('eventTransitionName', () => {
  it('is one name per event', () => {
    expect(eventTransitionName('3f2a-91')).toBe('event-3f2a-91')
    expect(eventTransitionName('a')).not.toBe(eventTransitionName('b'))
  })

  it('is a valid CSS identifier whatever the id holds', () => {
    expect(eventTransitionName('7 a/b.c')).toMatch(/^[a-zA-Z][\w-]*$/)
  })
})
