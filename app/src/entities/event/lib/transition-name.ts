/** The view-transition-name of an event's card: unique per event, and a valid CSS identifier. */
export function eventTransitionName(eventId: string): string {
  return `event-${eventId.replace(/[^a-zA-Z0-9_-]/g, '_')}`
}
