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
  /** Start expanded. Collapsed by default so a list of events stays a list. */
  defaultOpen?: boolean
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

/**
 * The card's bottom row: the viewer's own answer on the left, the readiness verdict on the right, the
 * whole row one tap target (③, #271). Tapping opens a single panel holding the three-way answer
 * control above the position pips — the two things that belong together, visible at once.
 *
 * Prop-only apart from the open state, which is exactly the local view state a story can drive. The
 * mutation, the current user and the optimistic hold live in the container (`EventCard`); this only
 * renders `myState` (already optimistic) and calls `onRespond`. Picking an answer collapses the panel
 * (④): the settled row is the calm resting state, the panel is only for acting.
 */
export function EventAnswerRow({ roster, myState, pending = false, onRespond, defaultOpen = false }: EventAnswerRowProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const answer = myAnswer(myState)
  const { className: pillClass, Icon } = PILL_TONE[answer.tone]

  const pick = (state: AttendanceState) => {
    onRespond(state)
    setOpen(false)
  }

  return (
    <>
      {/* relative z-10 lifts the trigger above the card link's stretched overlay, so tapping the row
          opens the panel instead of navigating to the event. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 flex w-full items-center gap-2 rounded-lg py-0.5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${pillClass}`}>
          {Icon && <Icon size={13} />}
          {answer.label}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <ReadinessBadge roster={roster} pending={pending} />
          <ChevronDown
            size={15}
            aria-hidden
            className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </span>
        <span className="sr-only">{open ? 'Hide answer options' : 'Change your answer'}</span>
      </button>

      {open && (
        <div id={panelId} className="relative z-10 mt-3 w-full border-t border-dashed border-border pt-3">
          <div className="flex gap-2">
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

          {hasRosterPanel(roster) && (
            <div className="mt-3 border-t border-dashed border-border pt-3">
              <RosterPips roster={roster} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
