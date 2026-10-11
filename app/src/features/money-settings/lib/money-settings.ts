// Pure money-settings form helpers — no rendering, no network. The backend owns the authoritative
// validation; these only shape the form (euro text <-> cents, link pre-check, dirty state).
import type { MoneyPoolSettings } from '@shared/api/money-pool'

const MAX_BEER_PRICE_CENTS = 10_000
const PRICE_TEXT = /^\d+(?:[.,]\d{1,2})?$/
const BUNQ_ME_LINK = /^(?:https?:\/\/)?bunq\.me\/[A-Za-z0-9_-]+\/?$/i

/** Euro text such as "2,70" to cents. Undefined for blank (no price), NaN for an invalid price. */
export function euroTextToCents(text: string): number | undefined {
  const trimmed = text.trim()
  if (trimmed === '') return undefined
  if (!PRICE_TEXT.test(trimmed)) return NaN
  const cents = Math.round(Number(trimmed.replace(',', '.')) * 100)
  return cents >= 1 && cents <= MAX_BEER_PRICE_CENTS ? cents : NaN
}

export function centsToEuroText(cents: number | undefined): string {
  return cents === undefined ? '' : (cents / 100).toFixed(2).replace('.', ',')
}

/** An explanation when a non-blank link is not a bunq.me page, else null. */
export function bunqMeLinkError(link: string): string | null {
  const trimmed = link.trim()
  return trimmed === '' || BUNQ_ME_LINK.test(trimmed) ? null : 'Use a link like https://bunq.me/yourteam.'
}

function canonicalLink(link: string | undefined): string | undefined {
  const trimmed = link?.trim()
  if (!trimmed) return undefined
  return `https://bunq.me/${trimmed.replace(/^(?:https?:\/\/)?bunq\.me\//i, '').replace(/\/$/, '')}`
}

export function settingsChanged(saved: MoneyPoolSettings, draft: MoneyPoolSettings): boolean {
  return (
    saved.enabled !== draft.enabled ||
    saved.beerPrice !== draft.beerPrice ||
    canonicalLink(saved.bunqMeLink) !== canonicalLink(draft.bunqMeLink)
  )
}
