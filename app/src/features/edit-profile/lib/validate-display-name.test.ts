import { describe, expect, it, afterEach } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
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

describe('validateDisplayName in Dutch', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says its errors in Dutch', async () => {
    await i18n.changeLanguage('nl')
    expect(validateDisplayName('')).toBe('Weergavenaam is verplicht.')
    expect(validateDisplayName('a'.repeat(101))).toBe('Weergavenaam mag maximaal 100 tekens zijn.')
  })
})
