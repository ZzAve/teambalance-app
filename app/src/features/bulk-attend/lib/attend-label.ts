/**
 * Naive English plural, deliberately so: event-type names are admin-configurable free text, so there
 * is no dictionary to consult. Covers the endings that actually occur in a team calendar
 * ("Match" -> "matches", "Training" -> "trainings"); an exotic name may pluralize awkwardly, which
 * is a cosmetic miss on a label, not a correctness problem.
 */
export function pluralizeType(noun: string): string {
  const lower = noun.toLowerCase()
  if (/(s|x|z|ch|sh)$/.test(lower)) return `${lower}es`
  if (/[^aeiou]y$/.test(lower)) return `${lower.slice(0, -1)}ies`
  return `${lower}s`
}

/**
 * The "Attend N <type>" button label. The count and the type together are the pre-tap confirmation
 * (ADR-0020, ADR-0021): each button covers exactly one event type, so its scope is named.
 */
export function attendLabel(count: number, typeName: string): string {
  const noun = count === 1 ? typeName.toLowerCase() : pluralizeType(typeName)
  return `Attend ${count} ${noun}`
}
