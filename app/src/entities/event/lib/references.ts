import type { EventReference } from '@shared/api/events'

// A single editable link row. Title is always a string here (controlled input); the stored contract
// type allows it to be absent, so cleanReferences maps a blank title back to undefined.
export interface ReferenceRow {
  title: string
  url: string
}

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

/** Stored references → editable rows (a missing title becomes an empty string for the input). */
export function toReferenceRows(refs: EventReference[] | undefined): ReferenceRow[] {
  return (refs ?? []).map((r) => ({ title: r.title ?? '', url: r.url }))
}

/**
 * Editable rows → the reference list to send: drop blank-URL rows, normalize each URL, and treat a
 * blank label as absent (the host is used as a fallback label on render). Pure.
 */
export function cleanReferences(rows: ReferenceRow[]): EventReference[] {
  return rows
    .map((r) => ({ title: r.title.trim(), url: normalizeUrl(r.url) }))
    .filter((r) => r.url !== '')
    .map((r) => ({ title: r.title || undefined, url: r.url }))
}
