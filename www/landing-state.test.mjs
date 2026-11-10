import { test } from 'node:test'
import assert from 'node:assert/strict'
import { answer, initialState, showOldWay, statusText } from './landing-state.mjs'

const copy = {
  idle: 'idle',
  oldBack: 'old back',
  training_going: 'training going',
  match_cant: 'match cant',
}

test('first answer moves one count out of none', () => {
  const s = answer(initialState(), 'training', 'going')
  assert.deepEqual(s.counts.training, { going: 9, maybe: 2, cant: 1, none: 2 })
  assert.equal(s.answers.training, 'going')
  assert.equal(s.quiet, true)
})

test('changing an answer moves the count from the previous answer, not from none', () => {
  const s = answer(answer(initialState(), 'training', 'going'), 'training', 'cant')
  assert.deepEqual(s.counts.training, { going: 8, maybe: 2, cant: 2, none: 2 })
})

test('the same answer twice is a no-op', () => {
  const once = answer(initialState(), 'match', 'maybe')
  assert.equal(answer(once, 'match', 'maybe'), once)
})

test('answering one event never changes the other', () => {
  const s = answer(initialState(), 'training', 'maybe')
  assert.deepEqual(s.counts.match, initialState().counts.match)
  assert.equal(s.answers.match, null)
})

test('showOldWay keeps counts and answers, only unquiets', () => {
  const s = showOldWay(answer(initialState(), 'match', 'going'))
  assert.equal(s.quiet, false)
  assert.equal(s.answers.match, 'going')
  assert.equal(s.counts.match.going, 6)
})

test('statusText picks idle, answer sentence, or old-way sentence', () => {
  assert.equal(statusText(initialState(), copy), 'idle')
  const s = answer(initialState(), 'training', 'going')
  assert.equal(statusText(s, copy), 'training going')
  assert.equal(statusText(showOldWay(s), copy), 'old back')
  assert.equal(statusText(showOldWay(initialState()), copy), 'idle')
})

test('the state is never mutated', () => {
  const s0 = initialState()
  answer(s0, 'training', 'going')
  assert.equal(s0.counts.training.going, 8)
})
