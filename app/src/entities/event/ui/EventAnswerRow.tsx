import { useId, useState } from 'react'
import { Check, ChevronDown, HelpCircle, X } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
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
  /** Who set this answer, when that was not the viewer. Drives the marker dot and the line (⑪). */
  setBy?: string | null
  onRespond: (state: AttendanceState) => void
  /** Start the attendance panel expanded. Collapsed by default so a list of events stays a list. */
  defaultAttnOpen?: boolean
  /**
   * Start the roster panel expanded. Collapsed by default, and a *live* default: flipping the
   * preference re-opens or re-closes the panel on every card at once (ADR-0030 §6), which is what a
   * member toggling `Keep open` expects to happen — not something they only see on the next visit.
   */
  defaultRosterOpen?: boolean
  /**
   * What the roster disclosure opens onto, or `null` when there is nothing to open.
   *
   * Left out, it falls back to the position pips — and to no disclosure at all on an untracked
   * roster, which is exactly the old behaviour. The events list injects the whole panel instead (a
   * widget: it may render the member list), and that is what gives a social something to expand to.
   */
  rosterPanel?: ReactNode | null
}

// The answer pill's tone, keyed by `myAnswer`. The three settled answers are soft tints from the
// attendance palette — they report a fact. The unanswered `prompt` is deliberately NOT a tint: it is
// a loud, filled neutral (ink, so it reads as an action in both themes and never competes with the
// green/gold/red answers) with a marker dot, so "we still need your answer" stands out as the one
// thing to act on rather than a fourth colour.
const PILL_TONE: Record<MyAnswer['tone'], { className: string; Icon?: ComponentType<{ size?: number }> }> = {
  attending: { className: 'bg-green/10 text-green font-semibold', Icon: Check },
  maybe: { className: 'bg-gold/20 text-gold-dark font-semibold', Icon: HelpCircle },
  absent: { className: 'bg-red/10 text-red font-semibold', Icon: X },
  prompt: { className: 'bg-foreground text-background font-bold' },
}

const OPTIONS: { value: AttendanceState; label: string; active: string; inactive: string }[] = [
  { value: 'ATTENDING', label: 'Going', active: 'bg-green text-white border-green', inactive: 'border-green/30 text-green' },
  { value: 'MAYBE', label: 'Maybe', active: 'bg-gold text-white border-gold', inactive: 'border-gold/30 text-gold' },
  { value: 'ABSENT', label: "Can't", active: 'bg-red text-white border-red', inactive: 'border-red/30 text-red' },
]

// Shared trigger chrome: lifted above the card link's stretched overlay (relative z-10) so a tap opens
// its panel instead of navigating, and `min-h-11` gives it a real 44px thumb target (#324) — the
// height sits on the button, so the pill inside keeps its size and the padding above it is tappable.
const TRIGGER =
  'relative z-10 flex min-h-11 shrink-0 items-center gap-1.5 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

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
 * The right side is a disclosure whenever the caller hands it a panel. Left to its own default that is
 * the position pips, so an untracked social shows a plain `8 going` headcount with nothing to expand
 * (⑥) — but the events list injects a panel that always has content, which is how a social stopped
 * being the one card whose verdict silently navigates (#324 cause 3). Prop-only apart from the two
 * open states, which is exactly the local view state a story can drive; the mutation and the
 * optimistic hold live in the container.
 *
 * An answer a teammate set carries a marker dot on the trigger and a `set by …` line under the row
 * (⑪) — a list is scanned, so the dot is what carries at a glance and the line says who. The dot
 * never collides with the unanswered pill's own marker: that one is the `prompt` tone, which is
 * NOT_RESPONDED, and an answer nobody gave cannot have been given by someone else. Both clear the
 * moment you answer for yourself, which is the whole acknowledgement mechanism — there is no
 * separate read state.
 */
export function EventAnswerRow({
  roster,
  myState,
  pending = false,
  setBy = null,
  onRespond,
  defaultAttnOpen = false,
  defaultRosterOpen = false,
  rosterPanel,
}: EventAnswerRowProps) {
  const [attnOpen, setAttnOpen] = useState(defaultAttnOpen)
  const [rosterOpen, setRosterOpen] = useState(defaultRosterOpen)
  // `Keep open` is a preference, not merely an initial value: when it flips, follow it — a member
  // switching it on expects every card to open now, not on their next visit. Adjusted during render
  // rather than in an effect (the React-recommended shape for "reset state when a prop changes"), and
  // only on an actual change, so a panel this member collapsed by hand stays collapsed.
  const [appliedDefault, setAppliedDefault] = useState(defaultRosterOpen)
  if (appliedDefault !== defaultRosterOpen) {
    setAppliedDefault(defaultRosterOpen)
    setRosterOpen(defaultRosterOpen)
  }
  const attnId = useId()
  const rosterId = useId()
  const answer = myAnswer(myState)
  const { className: pillClass, Icon } = PILL_TONE[answer.tone]
  const panel = rosterPanel === undefined ? defaultRosterPanel(roster) : rosterPanel
  const rosterExpandable = panel !== null
  // The pips are a lineup; an untracked social has no positions at all, so its panel is its people.
  const panelNoun = roster.trackRoster ? 'lineup' : "who's coming"

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
          {/* The marker: ink, not an attendance colour — green/gold/red all mean an answer, and this
              means "not yours". The `set by …` line below carries the same fact in words. */}
          {setBy && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-foreground" />}
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${pillClass}`}>
            {answer.tone === 'prompt' ? (
              // A marker dot rather than a status icon: the prompt is a call to act, not an answer.
              <span aria-hidden className="size-1.5 rounded-full bg-background" />
            ) : (
              Icon && <Icon size={13} />
            )}
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
            <span className="sr-only">{rosterOpen ? `Hide ${panelNoun}` : `Show ${panelNoun}`}</span>
          </button>
        ) : (
          // Nothing to open, so nothing to tap: the verdict is a plain label. On the events list this
          // branch is now unreachable — every card is handed a panel — which is how #324 cause 3 was
          // closed. `min-h-11` keeps the row the same height as a card whose verdict is a trigger.
          <span className="relative z-10 ml-auto flex min-h-11 shrink-0 items-center">
            <ReadinessBadge roster={roster} pending={pending} />
          </span>
        )}
      </div>

      {/* Left-aligned under the answer it explains, and above both panels so opening one never
          pushes it out from under the pill. */}
      {setBy && <p className="mt-1.5 text-[11px] text-muted-foreground">set by {setBy}</p>}

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
          {panel}
        </div>
      )}
    </>
  )
}

/** The pips, for a caller that named no panel — and nothing at all for a roster that isn't tracked. */
function defaultRosterPanel(roster: EventRoster): ReactNode | null {
  return hasRosterPanel(roster) ? <RosterPips roster={roster} /> : null
}
