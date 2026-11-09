// Server (`PaymentAlias.keyOf`): Kotlin `trim()` strips every whitespace char at the ends, NBSP included, which
// JS `\s` also matches; the inner Kotlin `Regex("\\s+")` is ASCII-only, so an inner NBSP stays.
const EDGES = /^\s+|\s+$/g
const ASCII_SPACE = /[ \t\n\v\f\r]+/g

/** Same rule as the server: capitals and extra spaces do not matter, every other character does. */
export function normaliseName(name: string): string {
  return name.replace(EDGES, '').replace(ASCII_SPACE, ' ').toLowerCase()
}
