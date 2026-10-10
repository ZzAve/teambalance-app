import type { RosterTone } from '../lib/roster-view'

/**
 * The verdict word ("needs 1 more", "2 spots open") painted straight on the card, by tone. One table
 * for the roster bar, the lineup panel and the attendee list, so the three cannot drift apart (#387).
 * Ink tokens only: gold-dark is a chip-ground ink at 2.7:1 on the light card, and gold-ink carries the
 * per-theme lift (app/src/app/styles/global.css, `--color-gold-ink`).
 */
export const VERDICT_TONE: Record<RosterTone, string> = {
  covered: 'text-green-dark',
  short: 'text-gold-ink',
  critical: 'text-red',
}
