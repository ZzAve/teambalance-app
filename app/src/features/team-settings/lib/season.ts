// Pure season-form helpers — no rendering, no network. Boundary logic the View leans on, tested
// as Vitest units (see season.test.ts). The backend owns the authoritative event-write validation;
// these only shape the form (range sanity + dirty/warning state).

export interface SeasonBounds {
  start?: string
  end?: string
}

// Treat empty strings (cleared date inputs) as "unset" so '' and undefined compare equal.
function normalize(value?: string): string | undefined {
  return value ? value : undefined
}

/** True when either bound is set. An unset season imposes no constraint. */
export function isSeasonConfigured(bounds: SeasonBounds): boolean {
  return normalize(bounds.start) !== undefined || normalize(bounds.end) !== undefined
}

/** A human-readable error when the range is inverted (end before start), else null. */
export function validateSeasonRange(bounds: SeasonBounds): string | null {
  const start = normalize(bounds.start)
  const end = normalize(bounds.end)
  if (start && end && end < start) {
    return 'End date must be on or after the start date.'
  }
  return null
}

/** True when the draft differs from the saved season (ignoring '' vs undefined). */
export function seasonChanged(saved: SeasonBounds, draft: SeasonBounds): boolean {
  return normalize(saved.start) !== normalize(draft.start) || normalize(saved.end) !== normalize(draft.end)
}
