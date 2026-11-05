import { i18n } from '@shared/i18n/i18n'

/**
 * Validates a position label after trimming. Returns an error string to show inline, or null when
 * the trimmed value is acceptable. Pure — a taken label is a server concern (409), surfaced separately.
 */
export function validatePositionLabel(value: string): string | null {
  if (value.trim().length === 0) return i18n.t('managePositions.labelRequired')
  return null
}
