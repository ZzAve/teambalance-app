import { describe, expect, it } from 'vitest'
import { parseBunqResult } from './bunq-result'

describe('parseBunqResult', () => {
  it.each(['connected', 'declined', 'error'])('keeps %s', (value) => {
    expect(parseBunqResult(value)).toBe(value)
  })

  it.each([
    ['garbage', 'hacked'],
    ['wrong case', 'Connected'],
    ['empty', ''],
    ['absent', undefined],
    ['null', null],
    ['a number', 1],
    ['a repeated parameter', ['connected', 'declined']],
    ['an object', { connected: true }],
  ])('drops %s', (_name, value) => {
    expect(parseBunqResult(value)).toBeUndefined()
  })
})
