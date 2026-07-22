import { describe, expect, it } from 'vitest'
import { validateDisplayName } from './validate-display-name'

describe('validateDisplayName', () => {
  it('rejects an empty string', () => {
    expect(validateDisplayName('')).toMatch(/required/)
  })

  it('rejects a whitespace-only string', () => {
    expect(validateDisplayName('   ')).toMatch(/required/)
  })

  it('rejects a name longer than 100 characters', () => {
    expect(validateDisplayName('a'.repeat(101))).toMatch(/100 characters/)
  })

  it('accepts a valid name', () => {
    expect(validateDisplayName('Ada Lovelace')).toBeNull()
  })

  it('accepts a name that is valid only after trimming', () => {
    expect(validateDisplayName('  Ada  ')).toBeNull()
  })
})
