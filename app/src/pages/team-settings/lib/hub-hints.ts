// The value line under each Team settings hub row. Pure: undefined while the query loads, so the
// row shows no hint rather than a wrong one.
import type { BunqConnectionStatus } from '@shared/api/bunq-connection'
import type { MatchFeedStatus } from '@shared/api/match-feed'
import type { MoneyPoolSettings } from '@shared/api/money-pool'
import type { Season } from '@shared/api/season'
import { formatEuro } from '@entities/payment/lib/format-euro'
import { formatLocale, i18n } from '@shared/i18n/i18n'

// Season dates are calendar days ("2026-09-01"); read and format them in UTC so no zone shifts the month.
const month = (day: string) =>
  new Intl.DateTimeFormat(formatLocale(), { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${day}T00:00:00Z`))
    .replace('.', '')

export function seasonHint(season: Season | undefined): string | undefined {
  if (!season) return undefined
  if (season.start && season.end) return `${month(season.start)} – ${month(season.end)}`
  if (season.start) return i18n.t('teamSettingsHub.seasonFrom', { month: month(season.start) })
  if (season.end) return i18n.t('teamSettingsHub.seasonUntil', { month: month(season.end) })
  return i18n.t('teamSettingsHub.notSet')
}

export function moneyPoolHint(settings: MoneyPoolSettings | undefined): string | undefined {
  if (!settings) return undefined
  if (!settings.enabled) return i18n.t('teamSettingsHub.off')
  return settings.beerPrice === undefined || settings.beerPrice === null
    ? i18n.t('teamSettingsHub.on')
    : i18n.t('teamSettingsHub.onWithBeer', { price: formatEuro(settings.beerPrice) })
}

export function bunqHint(status: BunqConnectionStatus | undefined): string | undefined {
  if (!status) return undefined
  return status.connected ? i18n.t('teamSettingsHub.connected') : i18n.t('teamSettingsHub.notConnected')
}

/** Null is "no feed set up"; undefined is still loading. */
export function matchFeedHint(status: Pick<MatchFeedStatus, 'teamName'> | null | undefined): string | undefined {
  if (status === undefined) return undefined
  return status === null ? i18n.t('teamSettingsHub.off') : status.teamName
}

export function actAsHint(visits: number | undefined): string | undefined {
  if (visits === undefined) return undefined
  return visits === 0 ? i18n.t('teamSettingsHub.none') : i18n.t('teamSettingsHub.visits', { count: visits })
}
