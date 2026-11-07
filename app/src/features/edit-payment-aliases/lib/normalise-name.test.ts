import { expect, it } from 'vitest'
import { normaliseName } from './normalise-name'

it('ignores capitals and extra spaces, keeps other characters', () => {
  expect(normaliseName('  I.M.   Visser ')).toBe('i.m. visser')
  expect(normaliseName('I.M. VISSER')).toBe(normaliseName('i.m. visser'))
  expect(normaliseName('IM Visser')).not.toBe(normaliseName('I.M. Visser'))
})

it('does not treat a non-breaking space as a space, as the server does not', () => {
  expect(normaliseName('I.M. Visser')).not.toBe(normaliseName('I.M. Visser'))
  expect(normaliseName('I.M.\tVisser\n')).toBe('i.m. visser')
})
