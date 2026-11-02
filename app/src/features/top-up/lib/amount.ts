export const MIN_TOP_UP_EUROS = 1
export const MAX_TOP_UP_EUROS = 500
export const TOP_UP_PRESETS = [10, 20, 50]

const WHOLE_NUMBER = /^\d+$/

/** The whole-euro amount typed into the custom field, or null when it is empty, fractional or out of range. */
export function parseTopUpAmount(text: string): number | null {
  const trimmed = text.trim()
  if (!WHOLE_NUMBER.test(trimmed)) return null
  const euros = Number(trimmed)
  return euros >= MIN_TOP_UP_EUROS && euros <= MAX_TOP_UP_EUROS ? euros : null
}
