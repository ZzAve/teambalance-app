import { describe, expect, it } from 'vitest'
import { cn } from './utils'

// The six named type steps (#338) are font sizes, not colours: a colour class after them must not
// swallow them, and a later size must still replace an earlier one.
describe('cn', () => {
  it('keeps a named type step next to a text colour', () => {
    expect(cn('text-caption text-muted-foreground')).toBe('text-caption text-muted-foreground')
  })

  it('lets a later named step override an earlier one', () => {
    expect(cn('text-caption font-semibold', 'text-small')).toBe('font-semibold text-small')
  })

  it('still resolves stock sizes against named steps', () => {
    expect(cn('text-caption', 'text-sm')).toBe('text-sm')
  })
})
