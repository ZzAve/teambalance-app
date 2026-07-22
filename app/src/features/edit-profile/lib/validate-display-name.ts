const MAX_LENGTH = 100

/**
 * Validates a display name after trimming. Returns an error string to show inline, or null when
 * the trimmed value is acceptable. Pure — no side effects, easily unit-tested.
 */
export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) return 'Display name is required.'
  if (trimmed.length > MAX_LENGTH) return `Display name must be ${MAX_LENGTH} characters or fewer.`
  return null
}
