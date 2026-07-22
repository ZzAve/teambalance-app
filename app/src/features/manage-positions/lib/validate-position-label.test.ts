import { describe, expect, it } from 'vitest'
import { validatePositionLabel } from './validate-position-label'

describe('validatePositionLabel', () => {
  it('rejects an empty string', () => {
    expect(validatePositionLabel('')).toMatch(/required/)
  })

  it('rejects a whitespace-only string', () => {
    expect(validatePositionLabel('   ')).toMatch(/required/)
  })

  it('accepts a valid label', () => {
    expect(validatePositionLabel('Setter')).toBeNull()
  })

  it('accepts a label that is valid only after trimming', () => {
    expect(validatePositionLabel('  Setter  ')).toBeNull()
  })
})
