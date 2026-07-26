import type { Reference } from '@shared/api/events'

/**
 * The label shown for a reference: the admin's title, or the URL host as a fallback when the title
 * is blank (host fallback is a render concern — the backend stores the title as null). The URL is
 * validated http/https server-side, so `new URL` parses; the try/catch is belt-and-suspenders.
 */
export function referenceLabel(ref: Reference): string {
  if (ref.title && ref.title.trim()) return ref.title
  try {
    return new URL(ref.url).host
  } catch {
    return ref.url
  }
}
