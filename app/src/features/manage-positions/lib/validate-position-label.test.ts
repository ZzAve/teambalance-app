import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
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

describe('validatePositionLabel in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says a label is required in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(validatePositionLabel(' ')).toBe('Een naam is verplicht.')
  })
})
