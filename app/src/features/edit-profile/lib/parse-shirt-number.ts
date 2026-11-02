const MAX = 999

/**
 * Reads the Shirt Number field (ADR-0038): empty means no number; otherwise a whole number 0–999,
 * where "07" is 7. Returns the parsed value or the error to show inline.
 */
export function parseShirtNumber(raw: string): { value: number | null; error: string | null } {
  const trimmed = raw.trim()
  if (trimmed === '') return { value: null, error: null }
  if (!/^\d+$/.test(trimmed) || Number(trimmed) > MAX) {
    return { value: null, error: `Use a whole number from 0 to ${MAX}.` }
  }
  return { value: Number(trimmed), error: null }
}
