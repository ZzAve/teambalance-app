import { describe, expect, it } from 'vitest'
import en from './locales/en.json'
import nl from './locales/nl.json'

/** Every leaf key as a dotted path, plural suffixes included ("hero.going_one"). */
function keys(catalogue: object, prefix = ''): string[] {
  return Object.entries(catalogue).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  )
}

// A missing Dutch key falls back to English at runtime, silently; this is what fails CI instead
// (ADR-0043 §2). English is the source catalogue, so an unknown key in code already fails `tsc`.
describe('the nl and en catalogues', () => {
  it('have exactly the same keys', () => {
    expect(keys(nl).sort()).toEqual(keys(en).sort())
  })

  it('have no empty message', () => {
    for (const catalogue of [en, nl]) {
      const leaves = keys(catalogue).map((path) => path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], catalogue))
      expect(leaves.filter((message) => typeof message !== 'string' || message.trim() === '')).toEqual([])
    }
  })
})
