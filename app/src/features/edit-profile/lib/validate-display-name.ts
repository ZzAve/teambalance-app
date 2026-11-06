import { i18n } from '@shared/i18n/i18n'

const MAX_LENGTH = 100

/**
 * Validates a display name after trimming. Returns an error string to show inline, or null when
 * the trimmed value is acceptable. Pure — no side effects, easily unit-tested.
 */
export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) return i18n.t('profileForm.nameRequired')
  if (trimmed.length > MAX_LENGTH) return i18n.t('profileForm.nameTooLong', { max: MAX_LENGTH })
  return null
}
