// The team address (slug) is user-editable and validated to the same contract the backend enforces
// (#158): lowercase letters, numbers, and single hyphens, no leading/trailing/doubled hyphen, and at
// most 58 characters (so `team_` + slug stays within Postgres' 63-byte identifier limit). Kept in sync
// with the server's TeamNaming — a client mismatch would only ever surface as a 400 INVALID_SLUG.
export const MAX_SLUG_LENGTH = 58

const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/

/**
 * Validates a team slug verbatim (no trimming — the field is the address as typed). Returns an error
 * string to show inline, or null when the slug is acceptable. A taken slug is a server concern (409),
 * surfaced separately.
 */
export function validateSlug(value: string): string | null {
  if (value.length === 0) return 'Choose a team address.'
  if (value.length > MAX_SLUG_LENGTH) return `Use ${MAX_SLUG_LENGTH} characters or fewer.`
  if (!SLUG_FORMAT.test(value)) return 'Use lowercase letters, numbers, and hyphens.'
  return null
}
