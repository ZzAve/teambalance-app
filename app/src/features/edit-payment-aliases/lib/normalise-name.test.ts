import { expect, it } from 'vitest'
import { normaliseName } from './normalise-name'

it('ignores capitals and extra spaces, keeps other characters', () => {
  expect(normaliseName('  I.M.   Visser ')).toBe('i.m. visser')
  expect(normaliseName('I.M. VISSER')).toBe(normaliseName('i.m. visser'))
  expect(normaliseName('IM Visser')).not.toBe(normaliseName('I.M. Visser'))
})

it('trims a non-breaking space at the edges, as the server does, but keeps one inside', () => {
  expect(normaliseName('\u00a0I.M. Visser\u00a0')).toBe('i.m. visser')
  expect(normaliseName('I.M.\u00a0Visser')).toBe('i.m.\u00a0visser')
  expect(normaliseName('I.M.\tVisser\n')).toBe('i.m. visser')
})
