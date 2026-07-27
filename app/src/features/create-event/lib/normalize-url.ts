/**
 * A pasted URL without a scheme (e.g. "volleybal.nl/x") gets `https://` prepended so it validates
 * server-side; anything that already carries a scheme is left untouched (the backend rejects any
 * non-http scheme). A blank input normalizes to "" so callers can drop the row.
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}
