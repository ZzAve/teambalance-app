import { useState } from 'react'
import type { Event } from '@shared/api/events'
import { EventRosterPanel } from '../ui/EventRosterPanel'
import type { PanelView } from '@features/event-panel-view/model/panel-preferences'
import { VariantA } from './VariantA'
import { VariantD } from './VariantD'
import { VariantE } from './VariantE'
import { VariantF } from './VariantF'
import { demoAttendances, demoRoster, DEMO_SELF_ID } from './demo-squad'
import type { LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway, delete with the branch. Mounted only from the events route, only when
 * `?variant=` names one of the variants; `current` (the default) renders the real panel untouched.
 *
 * **The question.** Today a card's roster disclosure opens onto *either* anonymous slot pips *or* a
 * flat member list, a global either/or the member picks in the header menu. Neither answers the
 * question a captain actually has — "which position is short, and who do I chase for it" — because
 * one knows the targets and the other knows the people. Can one panel be a row per position whose
 * slots are the members themselves, coloured by answer, ordered by answer, with the requirement
 * still legible, and every answer editable for anyone (ADR-0003) straight from the list?
 *
 * **Round one** put three drawings of that idea side by side (A Pips, B Pills, C Lineup sheet) and
 * got a clear verdict: they read as a table rather than a team, you still had to *read* them before
 * "we're short a libero" landed, and pips and pills are generic UI with no personality. B and C are
 * gone from the rotation; they live in the commit that introduced them. **A stays as the contrast
 * case** — the most conservative rendering of the idea, and the thing round two has to beat.
 *
 * **Round two** answers that verdict three ways:
 *
 *   - **D Huddle** — the going players overlap into one mass of faces, and the row's headline is a
 *     word ("nobody yet", "1 spare") with the fraction demoted. Faces keep their identity colour
 *     and wear the answer as a ring, so a teammate looks like themselves.
 *   - **E Court** — stops treating a lineup as a list at all: draws the six rotation zones and puts
 *     each position where it stands. A hole gets a location. Exposes a real question — positions
 *     are free text, so the label→zone mapping has to become something a team can set.
 *   - **F Triage** — refuses to give every position equal space. Opens with a sentence naming what
 *     is wrong, spends the panel on the positions that are short with the people worth asking one
 *     tap from Going, and collapses everything that is fine to one quiet line.
 *
 * Every variant reads the same view model (`lineup-model.ts`) and shares nothing else, on purpose —
 * except the round-two face chip (`Face.tsx`), which is a primitive, not a layout.
 *
 * Writes are real (`onRespond` is the route's own `setAttendance`) unless `?demo=1`, which swaps in
 * an in-memory squad big enough to judge the layouts and keeps its edits local.
 */

export type PrototypeVariant = 'current' | 'A' | 'D' | 'E' | 'F'

export const VARIANTS: { key: PrototypeVariant; name: string }[] = [
  { key: 'current', name: "Today's panel" },
  { key: 'A', name: 'Pips' },
  { key: 'D', name: 'Huddle' },
  { key: 'E', name: 'Court' },
  { key: 'F', name: 'Triage' },
]

interface PrototypeLineupPanelProps {
  event: Event
  variant: PrototypeVariant
  /** Ignore the event's real squad and use the in-memory demo squad instead. */
  demo: boolean
  currentUserId?: string | null
  /** Fires with the *target* member's id — trust-based editing (ADR-0003). */
  onRespond: (userId: string, state: LineupState) => void
  /** Props the untouched production panel needs when `variant` is `current`. */
  view: PanelView
  detailHref: string
}

export function PrototypeLineupPanel({
  event,
  variant,
  demo,
  currentUserId,
  onRespond,
  view,
  detailHref,
}: PrototypeLineupPanelProps) {
  // Per card, which means each card gets its own copy of the demo squad. Fine: the question is what
  // one card looks like, and independent cards make it obvious an edit is going nowhere real.
  const [demoState, setDemoState] = useState(demoAttendances)

  if (variant === 'current') {
    return <EventRosterPanel event={event} view={view} currentUserId={currentUserId} detailHref={detailHref} />
  }

  const attendances = demo ? demoState : event.attendances
  const roster = demo ? demoRoster(demoState) : event.roster
  const self = demo ? DEMO_SELF_ID : currentUserId
  const respond = demo
    ? (userId: string, state: LineupState) =>
        setDemoState((rows) => rows.map((r) => (r.userId === userId ? { ...r, state } : r)))
    : onRespond

  const props = { attendances, roster, currentUserId: self, onRespond: respond }

  if (variant === 'A') return <VariantA {...props} />
  if (variant === 'D') return <VariantD {...props} />
  if (variant === 'E') return <VariantE {...props} />
  return <VariantF {...props} />
}
