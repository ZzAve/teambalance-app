import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@shared/i18n/i18n'
import { actAsHint, bunqHint, matchFeedHint, moneyPoolHint, seasonHint } from './hub-hints'

describe('seasonHint', () => {
  afterEach(() => i18n.changeLanguage('en'))

  it('says nothing while the season is loading', () => {
    expect(seasonHint(undefined)).toBeUndefined()
  })

  it('shows the range as months', () => {
    expect(seasonHint({ start: '2026-09-01', end: '2027-05-31' })).toBe('Sept 2026 – May 2027')
  })

  it('shows an open end or an open start', () => {
    expect(seasonHint({ start: '2026-09-01', end: undefined })).toBe('From Sept 2026')
    expect(seasonHint({ start: undefined, end: '2027-05-31' })).toBe('Until May 2027')
  })

  it('says so when no season is set', () => {
    expect(seasonHint({ start: undefined, end: undefined })).toBe('Not set')
  })

  it('formats in the UI language', async () => {
    await i18n.changeLanguage('nl')
    expect(seasonHint({ start: '2026-09-01', end: '2027-05-31' })).toBe('sep 2026 – mei 2027')
  })
})

describe('moneyPoolHint', () => {
  it('shows Off, On, or On with the beer price', () => {
    expect(moneyPoolHint(undefined)).toBeUndefined()
    expect(moneyPoolHint({ enabled: false, beerPrice: 250, bunqMeLink: undefined })).toBe('Off')
    expect(moneyPoolHint({ enabled: true, beerPrice: undefined, bunqMeLink: undefined })).toBe('On')
    expect(moneyPoolHint({ enabled: true, beerPrice: 250, bunqMeLink: undefined })).toBe('On · beer €2.50')
  })
})

describe('bunqHint', () => {
  it('shows whether bunq is connected', () => {
    expect(bunqHint(undefined)).toBeUndefined()
    expect(bunqHint({ connectAvailable: true, connected: true, accountPicked: true })).toBe('Connected')
    expect(bunqHint({ connectAvailable: true, connected: false, accountPicked: false })).toBe('Not connected')
  })
})

describe('matchFeedHint', () => {
  it('shows the feed team, or Off without a feed', () => {
    expect(matchFeedHint(undefined)).toBeUndefined()
    expect(matchFeedHint(null)).toBe('Off')
    expect(matchFeedHint({ teamName: 'Setpoint H1' })).toBe('Setpoint H1')
  })
})

describe('actAsHint', () => {
  it('counts the platform visits', () => {
    expect(actAsHint(undefined)).toBeUndefined()
    expect(actAsHint(0)).toBe('None')
    expect(actAsHint(1)).toBe('1 visit')
    expect(actAsHint(3)).toBe('3 visits')
  })
})
