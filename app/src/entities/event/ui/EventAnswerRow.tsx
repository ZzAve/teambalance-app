import { useId, useState } from 'react'
import { Check, ChevronDown, HelpCircle, X } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Event, EventRoster } from '@shared/api/events'
import { hasRosterPanel } from '../lib/roster-view'
import { myAnswer, type MyAnswer } from '../lib/my-answer'
import { ReadinessBadge } from './ReadinessBadge'
import { RosterPips } from './RosterPips'

type AttendanceState = Event['myState']

interface EventAnswerRowProps {
  roster: EventRoster
  /** The viewer's own answer — already carrying any optimistic pick from the container. */
  myState: AttendanceState
  /** An attendance write is in flight; the control is held and the badge shows a pending state. */
  pending?: boolean
  onRespond: (state: AttendanceState) => void
  /** Start the attendance panel expanded. Collapsed by default so a list of events stays a list. */
  defaultAttnOpen?: boolean
  /** Start the roster panel expanded. Collapsed by default. */
  defaultRosterOpen?: boolean
}

// The answer pill's tone, keyed by `myAnswer`. The three settled answers reuse the attendance
// palette; the unanswered prompt takes the blue accent because it is the one state that asks to be
// acted on, not merely reported.
const PILL_TONE: Record<MyAnswer['tone'], { className: string; Icon?: ComponentType<{ size?: number }> }> = {
  attending: { className: 'bg-green/10 text-green', Icon: Check },
  maybe: { className: 'bg-gold/20 text-gold-dark', Icon: HelpCircle },
  absent: { className: 'bg-red/10 text-red', Icon: X },
  prompt: { className: 'bg-blue/10 text-blue' },
}

const OPTIONS: { value: AttendanceState; label: string; active: string; inactive: string }[] = [
  { value: 'ATTENDING', label: 'Going', active: 'bg-green text-white border-green', inactive: 'border-green/30 text-green' },
  { value: 'MAYBE', label: 'Maybe', active: 'bg-gold text-white border-gold', inactive: 'border-gold/30 text-gold' },
  { value: 'ABSENT', label: "Can't", active: 'bg-red text-white border-red', inactive: 'border-red/30 text-red' },
]

// Shared trigger chrome: lifted above the card link's stretched overlay (relative z-10) so a tap opens
// its panel instead of navigating, with a comfortable hit area and a visible focus ring.
const TRIGGER =
  'relative z-10 flex shrink-0 items-center gap-1.5 rounded-full py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/**
 * The card's bottom row: two independent disclosures, not one (#273). The left trigger is the viewer's
 * own answer and opens the three-way answer control; the right trigger is the readiness verdict and
 * opens the position pips. Each tappable thing does exactly what it depicts — the control sits next to
 * the information it concerns.
 *
 * Both may be open at once, and the attendance panel is always rendered *first in the DOM* so it sits
 * above the roster panel whichever order they were opened in (①): the answer control has one stable
 * home, and DOM order == visual order == focus order keeps that accessible. Picking an answer collapses
 * the attendance panel (④) — its job is done — while the roster panel, if open, stays put.
 *
 * The right side is a disclosure only when there is a lineup to show (`hasRosterPanel`); a social with
 * tracking off shows a plain `8 going` headcount with nothing to expand (⑥). Prop-only apart from the
 * two open states, which is exactly the local view state a story can drive; the mutation and the
 * optimistic hold live in the container.
 */
export function EventAnswerRow({
  roster,
  myState,
  pending = false,
  onRespond,
  defaultAttnOpen = false,
  defaultRosterOpen = false,
}: EventAnswerRowProps) {
  const [attnOpen, setAttnOpen] = useState(defaultAttnOpen)
  const [rosterOpen, setRosterOpen] = useState(defaultRosterOpen)
  const attnId = useId()
  const rosterId = useId()
  const answer = myAnswer(myState)
  const { className: pillClass, Icon } = PILL_TONE[answer.tone]
  const rosterExpandable = hasRosterPanel(roster)

  const pick = (state: AttendanceState) => {
    onRespond(state)
    setAttnOpen(false)
  }

  return (
    <>
      <div className="relative z-10 flex w-full items-center gap-2">
        {/* Left: the viewer's own answer, opening the three-way control. */}
        <button
          type="button"
          aria-expanded={attnOpen}
          aria-controls={attnOpen ? attnId : undefined}
          onClick={() => setAttnOpen((o) => !o)}
          className={`${TRIGGER} pl-1 pr-1.5`}
        >
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${pillClass}`}>
            {Icon && <Icon size={13} />}
            {answer.label}
          </span>
          <ChevronDown
            size={14}
            aria-hidden
            className={`text-muted-foreground transition-transform duration-200 ${attnOpen ? 'rotate-180' : ''}`}
          />
          <span className="sr-only">{attnOpen ? 'Hide answer options' : 'Change your answer'}</span>
        </button>

        {/* Right: the readiness verdict. A disclosure when there is a lineup; otherwise a plain
            headcount with nothing to open. */}
        {rosterExpandable ? (
          <button
            type="button"
            aria-expanded={rosterOpen}
            aria-controls={rosterOpen ? rosterId : undefined}
            onClick={() => setRosterOpen((o) => !o)}
            className={`${TRIGGER} ml-auto pl-1.5 pr-1`}
          >
            <ReadinessBadge roster={roster} pending={pending} />
            <ChevronDown
              size={14}
              aria-hidden
              className={`text-muted-foreground transition-transform duration-200 ${rosterOpen ? 'rotate-180' : ''}`}
            />
            <span className="sr-only">{rosterOpen ? 'Hide lineup' : 'Show lineup'}</span>
          </button>
        ) : (
          <span className="relative z-10 ml-auto flex shrink-0 items-center">
            <ReadinessBadge roster={roster} pending={pending} />
          </span>
        )}
      </div>

      {/* Attendance panel — always FIRST in the DOM, so it sits above the roster panel when both are
          open (①). Picking an option collapses it (④). */}
      {attnOpen && (
        <div id={attnId} className="relative z-10 mt-3 flex w-full gap-2 border-t border-dashed border-border pt-3">
          {OPTIONS.map(({ value, label, active, inactive }) => {
            const isActive = myState === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                disabled={pending}
                onClick={() => pick(value)}
                className={`flex-1 rounded-xl border py-2 text-[13px] font-bold transition-colors ${isActive ? active : inactive} ${pending ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Roster panel — second in the DOM, so it stays below the attendance panel. */}
      {rosterExpandable && rosterOpen && (
        <div id={rosterId} className="relative z-10 mt-3 w-full border-t border-dashed border-border pt-3">
          <RosterPips roster={roster} />
        </div>
      )}
    </>
  )
}
