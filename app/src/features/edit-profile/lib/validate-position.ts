import type { Position } from '@shared/api/positions'
import { i18n } from '@shared/i18n/i18n'

/**
 * Required-when-available validation for the profile position picker: if the team defines any
 * positions the member must pick one; if it has none the picker is hidden and null is fine.
 * Pure — returns an inline error string, or null when the selection is acceptable.
 */
export function validatePosition(positions: Position[], positionId: string | null): string | null {
  if (positions.length === 0) return null
  if (!positionId) return i18n.t('profileForm.selectPosition')
  return null
}
