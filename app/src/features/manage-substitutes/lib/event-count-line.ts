/**
 * The remove dialog's line on how many Events a removal touches. `failed` covers a count that could
 * not be read (e.g. another Admin removed them first), so the dialog never says "Checking…" forever.
 */
export function eventCountLine(name: string, eventCount: number | undefined, failed: boolean): string {
  if (eventCount === undefined) return failed ? `Couldn't check which events ${name} is on.` : `Checking which events ${name} is on…`
  if (eventCount === 0) return `${name} is not on any event.`
  return `${name} is on ${eventCount} ${eventCount === 1 ? 'event' : 'events'}.`
}
