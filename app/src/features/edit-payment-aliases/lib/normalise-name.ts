// The server splits on Java's `\s`: ASCII whitespace only. JS `\s` also matches NBSP and the like, which
// would make the preview count a payment the server does not match.
const ASCII_SPACE = /[ \t\n\v\f\r]+/g
const EDGES = /^[ \t\n\v\f\r]+|[ \t\n\v\f\r]+$/g

/** Same rule as the server: capitals and extra spaces do not matter, every other character does. */
export function normaliseName(name: string): string {
  return name.replace(EDGES, '').replace(ASCII_SPACE, ' ').toLowerCase()
}
