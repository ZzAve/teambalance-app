import { useState } from 'react'
import type { Event } from '@shared/api/events'
import { EventRosterPanel } from '../ui/EventRosterPanel'
import type { PanelView } from '@features/event-panel-view/model/panel-preferences'
import { VariantA } from './VariantA'
import { VariantB } from './VariantB'
import { VariantC } from './VariantC'
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
 * Three answers, deliberately far apart:
 *
 *   - **A Pips** — one line per position, members as initials pips in the answer colour. Densest;
 *     bets that initials are enough identity.
 *   - **B Pills** — a block per position, full names in tinted pills, requirement as a slot meter.
 *     Most legible; bets the list can afford the height.
 *   - **C Lineup sheet** — slot boxes with avatars, a quiet second lane for the noes, and an Open
 *     slot that opens a "who can fill this" sheet. Most structure; bets filling a hole is the task.
 *
 * All three read the same view model (`lineup-model.ts`) and share nothing else, on purpose.
 *
 * Writes are real (`onRespond` is the route's own `setAttendance`) unless `?demo=1`, which swaps in
 * an in-memory squad big enough to judge the layouts and keeps its edits local.
 */

export type PrototypeVariant = 'current' | 'A' | 'B' | 'C'

export const VARIANTS: { key: PrototypeVariant; name: string }[] = [
  { key: 'current', name: "Today's panel" },
  { key: 'A', name: 'Pips' },
  { key: 'B', name: 'Pills' },
  { key: 'C', name: 'Lineup sheet' },
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
  if (variant === 'B') return <VariantB {...props} />
  return <VariantC {...props} />
}
