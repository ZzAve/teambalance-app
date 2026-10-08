import type { Substitute } from '@entities/substitute/api/substitutes'

/**
 * The picker opened for one Position: the Substitutes who play it first, everyone else after
 * (#359 decision 9). Both groups keep the list's own order, which the server sorts by name.
 */
export function groupForPosition(substitutes: Substitute[], positionId: string) {
  return {
    plays: substitutes.filter((s) => s.position?.id === positionId),
    others: substitutes.filter((s) => s.position?.id !== positionId),
  }
}
