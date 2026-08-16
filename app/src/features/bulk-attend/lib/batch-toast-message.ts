/**
 * What the toast says after a batch lands.
 *
 * The server is free to create fewer rows than were asked for: the client's eligible set is a
 * snapshot from when the list loaded, and by the time the tap arrives an event may have gained a
 * response row (answered in another tab, or by a teammate) or simply started. Reporting only the
 * created count would quietly swallow that — you ask for six, four happen, and nothing on screen
 * explains the other two.
 *
 * So the message names the shortfall whenever there is one. It deliberately does NOT guess *why*:
 * the response carries only the ids created, and the two causes (a row appeared / the event
 * started) are indistinguishable from here. "Already changed" is true of both; naming a specific
 * cause would be a guess that is sometimes wrong.
 *
 * Kept as a pure function so the wording is pinned by unit tests — the toast itself renders at the
 * app root via sonner, well outside this feature's component tree.
 */
export function batchToastMessage(created: number, requested: number): string {
  if (created === 0) return 'Nothing to set — those events already changed'

  const attending = `${created} ${created === 1 ? 'event' : 'events'} set to Attending`
  if (created === requested) return attending

  const skipped = requested - created
  return `${created} of ${requested} set to Attending — ${skipped} already changed`
}
