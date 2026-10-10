import {describe, expect, it} from 'vitest'
import {VERDICT_TONE} from './verdict-tone'

// Gold-dark at 2.7:1 on the light card fails as bare ink (#336, #387) and a visual diff does not fail
// on contrast. Pinned at the class-table level, like EventFiltersView.chips.test.ts, so a tone added
// straight to the table is covered without a render.
describe('verdict tone classes never use gold-dark as bare ink', () => {
  const NOT_INK_SAFE = /\btext-gold(?!-ink\b)/

  it.each(Object.entries(VERDICT_TONE))('%s: %s', (_tone, className) => {
    expect(className).not.toMatch(NOT_INK_SAFE)
  })
})
