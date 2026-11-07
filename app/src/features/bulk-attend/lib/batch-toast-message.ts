import { i18n } from '@shared/i18n/i18n'
import { pluralizeType } from './attend-label'

/**
 * What the toast says after a batch lands.
 *
 * The server is free to create fewer rows than were asked for: the client's eligible set is a
 * snapshot from when the list loaded, and by the time the tap arrives an event may have gained a
 * response row (answered in another tab, or by a teammate) or simply started. Reporting only the
 * created count would quietly swallow that — you ask for six, four happen, and nothing on screen
 * explains the other two.
 *
 * So the message names the shortfall whenever there is one. It deliberately does NOT guess *why*:
 * the response carries only the ids created, and the two causes (a row appeared / the event
 * started) are indistinguishable from here. "Already changed" is true of both; naming a specific
 * cause would be a guess that is sometimes wrong.
 *
 * It echoes the type the button named (ADR-0021) so the confirmation matches what was tapped —
 * "12 trainings set to Attending", not a bare "12 events".
 *
 * Kept as a pure function so the wording is pinned by unit tests — the toast itself renders at the
 * app root via sonner, well outside this feature's component tree.
 */
export function batchToastMessage(created: number, requested: number, typeName: string): string {
  if (created === 0) return i18n.t('bulkToast.nothing')

  const words = { count: created, type: typeName.toLowerCase(), types: pluralizeType(typeName) }
  if (created === requested) return i18n.t('bulkToast.all', words)

  return i18n.t('bulkToast.partial', { ...words, requested, skipped: requested - created })
}
