import { describe, expect, it } from 'vitest'
import type { CalendarLink } from '@shared/api/calendar-links'
import { linkDisplayLabel, toGoogleCalendarUrl, toWebcalUrl } from './calendar-urls'

const FEED = 'https://api.teambalance.nl/api/calendar/setpoint-vt/abc123.ics'

const link = (overrides: Partial<CalendarLink> = {}): CalendarLink => ({
  id: 'l1',
  label: undefined,
  createdAt: '2026-10-07T12:00:00Z',
  expiresAt: '2027-10-07T12:00:00Z',
  expired: false,
  url: FEED,
  ...overrides,
})

describe('toWebcalUrl', () => {
  it('swaps the https scheme for webcal and keeps the rest of the URL', () => {
    expect(toWebcalUrl(FEED)).toBe('webcal://api.teambalance.nl/api/calendar/setpoint-vt/abc123.ics')
  })

  it('swaps a plain http scheme too, which is what a local or e2e API serves', () => {
    expect(toWebcalUrl('http://localhost:8080/api/calendar/e2e/t.ics')).toBe(
      'webcal://localhost:8080/api/calendar/e2e/t.ics',
    )
  })
})

describe('toGoogleCalendarUrl', () => {
  it('passes the webcal URL as a fully encoded cid', () => {
    expect(toGoogleCalendarUrl(FEED)).toBe(
      'https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Fabc123.ics',
    )
  })
})

describe('linkDisplayLabel', () => {
  it('uses the label the member gave the link', () => {
    expect(linkDisplayLabel(link({ label: 'My phone' }))).toBe('My phone')
  })

  it('falls back to the creation date, formatted nl-NL', () => {
    expect(linkDisplayLabel(link())).toBe('Link from 7 okt 2026')
  })
})
