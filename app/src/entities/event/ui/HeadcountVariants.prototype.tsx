/**
 * PROTOTYPE — throwaway. Do not ship. (#271 gap, follow-up to #275)
 *
 * Question: an event with a total target but NO position targets (HEADCOUNT_FULL / HEADCOUNT_SHORT)
 * loses its target on the detail page. `RosterBar` is gated on position targets and independently
 * returns null (it filters to rows with pips), so `RoleBreakdown` renders instead and the fact the
 * card advertised — "4 more needed" — is nowhere on the page you tapped through to.
 *
 * Three structurally different answers, switchable with ?variant= on the real detail route.
 * Read-only: no mutations, no tests, no error handling. The winner gets rewritten properly.
 */
import type { EventRoster } from '@shared/api/events'
import { headcountLine, rosterChip, type RosterTone } from '../lib/roster-view'

const TONE_TEXT: Record<RosterTone, string> = {
  covered: 'text-green-dark',
  short: 'text-gold-dark',
  critical: 'text-red',
}

const TONE_FILL: Record<RosterTone, string> = {
  covered: 'bg-green',
  short: 'bg-gold',
  critical: 'bg-red',
}

/** Shared by the variants: the numbers the server already computed for a headcount-only roster. */
function headcount(roster: EventRoster) {
  const target = roster.totalTarget ?? 0
  const going = roster.totalAttending
  return {
    going,
    target,
    pct: target === 0 ? 0 : Math.min(100, Math.round((going / target) * 100)),
    chip: rosterChip(roster),
    line: headcountLine(roster),
  }
}

/**
 * A — Headcount bar. The same pinned slot the position case uses, in its headcount form: one sticky
 * strip with the fraction, a progress track and the verdict. Structurally identical to what a team
 * with positions already gets, so the page has one roster surface whatever the configuration.
 */
export function VariantA({ roster }: { roster: EventRoster }) {
  const { going, target, pct, chip } = headcount(roster)
  // Decision ⑥, the half the detail page never got: with a target this is a fraction against it;
  // without one it is a plain tally, which is still the team information the page otherwise omits.
  // No track in the tally case — a progress bar with no denominator is a lie.
  if (roster.totalTarget == null) {
    return (
      <div className="border-b border-border/40 bg-gradient-to-b from-card to-background px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Squad</span>
          <span className="font-display text-sm font-bold tabular-nums">{going} going</span>
        </div>
      </div>
    )
  }
  return (
    <div className="border-b border-border/40 bg-gradient-to-b from-card to-background px-4 py-3">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Squad</span>
        <span className="flex items-baseline gap-1.5">
          <span
            className={`font-display text-sm font-bold tabular-nums ${going >= target ? 'text-green-dark' : 'text-foreground'}`}
          >
            {going}/{target} going
          </span>
          {chip && <span className={`text-xs font-semibold ${TONE_TEXT[chip.tone]}`}>· {chip.text}</span>}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ease-out ${chip ? TONE_FILL[chip.tone] : 'bg-green'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/**
 * B — List header. Nothing pinned. The fraction becomes the attendee list's own header, sitting
 * directly above the names it counts, with the role chips kept beneath it. The claim and its
 * evidence are one block; nothing follows you down the page.
 */
export function VariantB({ roster }: { roster: EventRoster }) {
  const { going, target, chip } = headcount(roster)
  return (
    <div className="border-b border-border/40 px-4 py-3">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-lg font-extrabold tabular-nums">
          {going}
          <span className="text-muted-foreground">/{target}</span>
        </span>
        <span className="text-sm text-muted-foreground">going</span>
        {chip && (
          <span className={`ml-auto text-xs font-bold ${TONE_TEXT[chip.tone]}`}>{chip.text}</span>
        )}
      </div>
    </div>
  )
}

/**
 * C — Header stat. Completeness is treated as a headline fact about the event, not a property of the
 * list: a ring beside the event title, up with the date and location. The attendee list is left
 * exactly as it is today (RoleBreakdown included) — the fix lands entirely above the fold.
 */
export function VariantC({ roster }: { roster: EventRoster }) {
  const { going, target, pct, chip } = headcount(roster)
  const R = 26
  const C = 2 * Math.PI * R
  const stroke = chip?.tone === 'critical' ? 'var(--color-red)' : chip?.tone === 'short' ? 'var(--color-gold)' : 'var(--color-green)'
  return (
    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
      <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90">
        <circle cx="32" cy="32" r={R} fill="none" strokeWidth="6" className="stroke-muted" />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          stroke={stroke}
          strokeDasharray={`${(pct / 100) * C} ${C}`}
        />
      </svg>
      <div className="min-w-0">
        <p className="font-display text-xl font-extrabold leading-none tabular-nums">
          {going} <span className="text-muted-foreground">of {target}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">going</p>
        {chip && <p className={`mt-1 text-xs font-bold ${TONE_TEXT[chip.tone]}`}>{chip.text}</p>}
      </div>
    </div>
  )
}
