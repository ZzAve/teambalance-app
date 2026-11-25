import { test } from 'node:test'
import assert from 'node:assert/strict'
import { plausibleConfig } from './analytics-config.mjs'

test('no domain: no config, so the tracker does not start', () => {
  assert.equal(plausibleConfig(undefined), null)
  assert.equal(plausibleConfig(''), null)
  assert.equal(plausibleConfig('  '), null)
})

test('the config sends to Plausible itself and captures only pageviews', () => {
  const config = plausibleConfig(' teambalance.nl ')
  assert.equal(config.domain, 'teambalance.nl')
  assert.equal(config.endpoint, 'https://plausible.io/api/event')
  assert.equal(config.autoCapturePageviews, true)
  assert.equal(config.outboundLinks, false)
  assert.equal(config.fileDownloads, false)
  assert.equal(config.formSubmissions, false)
  assert.equal(config.logging, false)
})

test('query strings, fragments and custom properties are removed from each request', () => {
  const { transformRequest } = plausibleConfig('teambalance.nl')
  const sent = transformRequest({
    n: 'pageview',
    u: 'https://teambalance.nl/en/?utm_source=x#features',
    r: 'https://example.com/search?q=team#top',
    d: 'teambalance.nl',
    p: { member: 'someone' },
  })
  assert.equal(sent.u, 'https://teambalance.nl/en/')
  assert.equal(sent.r, 'https://example.com/search')
  assert.equal(sent.p, undefined)
  assert.equal(sent.n, 'pageview')
})

test('a missing referrer stays missing', () => {
  const { transformRequest } = plausibleConfig('teambalance.nl')
  assert.equal(transformRequest({ n: 'pageview', u: 'https://teambalance.nl/', r: null }).r, null)
})
