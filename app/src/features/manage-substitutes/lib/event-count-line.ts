import { i18n } from '@shared/i18n/i18n'

/**
 * The remove dialog's line on how many Events a removal touches. `failed` covers a count that could
 * not be read (e.g. another Admin removed them first), so the dialog never says "Checking…" forever.
 */
export function eventCountLine(name: string, eventCount: number | undefined, failed: boolean): string {
  if (eventCount === undefined)
    return failed ? i18n.t('manageSubstitutes.countFailed', { name }) : i18n.t('manageSubstitutes.countChecking', { name })
  if (eventCount === 0) return i18n.t('manageSubstitutes.countNone', { name })
  return i18n.t('manageSubstitutes.count', { name, count: eventCount })
}
