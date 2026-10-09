import type { CalendarLink } from '@entities/calendar-link/api/calendar-links'

/** The same feed URL under the webcal scheme, which the OS hands to its calendar app as a subscription. */
export function toWebcalUrl(feedUrl: string): string {
  return feedUrl.replace(/^https?:\/\//, 'webcal://')
}

/** Google Calendar's "add by URL" entry point, with the subscription as its `cid`. */
export function toGoogleCalendarUrl(feedUrl: string): string {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(toWebcalUrl(feedUrl))}`
}

export function linkDisplayLabel(link: CalendarLink): string {
  return link.label ?? `Link from ${formatDate(link.createdAt)}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}
