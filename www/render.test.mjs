import { test } from 'node:test'
import assert from 'node:assert/strict'
import { render } from './render.mjs'

const copyBlock = (body) => `<script type="application/json" id="copy">${body}</script>`
const parseCopy = (html) => JSON.parse(html.match(/id="copy">([\s\S]*?)<\/script>/)[1])

test('text and attributes are HTML-escaped', () => {
  const out = render('<p title="{{a}}">{{a}}</p>', { a: 'say "hi" <b> & go' })
  assert.equal(out, '<p title="say &quot;hi&quot; &lt;b&gt; &amp; go">say &quot;hi&quot; &lt;b&gt; &amp; go</p>')
})

test('the copy block stays valid JSON for quotes, backslashes and a closing script tag', () => {
  const nasty = 'a "quote" \\ back </script><b>'
  const out = render(copyBlock('{ "x": "{{a}}", "y": "{{b}}" }'), { a: nasty, b: 'plain' })
  assert.deepEqual(parseCopy(out), { x: nasty, y: 'plain' })
  assert.equal(out.match(/<\/script>/g).length, 1)
})

test('a value that looks like a placeholder is not substituted again', () => {
  assert.equal(render('{{a}}', { a: '{{b}}', b: 'x' }), '{{b}}')
})

test('a missing key throws', () => {
  assert.throws(() => render('{{nope}}', {}, 'en.json'), /en\.json has no "nope"/)
})
