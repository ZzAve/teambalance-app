import { describe, expect, it } from 'vitest'
import { heroInk } from './hero-ink'

describe('heroInk', () => {
  it.each([
    ['blue', '#225C9C'],
    ['green', '#249E6C'],
    ['purple', '#7B5EA7'],
    ['red', '#D93025'],
  ])('keeps white on %s', (_name, color) => {
    expect(heroInk(color)).toBe('light')
  })

  it.each([
    ['gold', '#F4B400'],
    ['orange', '#E87C3E'],
    ['white', '#FFFFFF'],
  ])('switches to dark on %s', (_name, color) => {
    expect(heroInk(color)).toBe('dark')
  })

  it('keeps white when the type has no colour, since the ground is then the brand green', () => {
    expect(heroInk(undefined)).toBe('light')
  })

  it('reads the hex case-insensitively', () => {
    expect(heroInk('#f4b400')).toBe('dark')
  })
})
