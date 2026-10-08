import { UserPlus } from 'lucide-react'
import type { AttendanceEntry, SubstituteEntry } from '@entities/event/api/events'
import { cn } from '@shared/lib/utils'
import { setByName } from '@entities/event/lib/attribution'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'

export type SubstituteState = SubstituteEntry['state']

// A Substitute is never Not Responded (ADR-0033), so these three are every state they can hold.
// "Asked" is Maybe: someone sent a message and is waiting to hear back.
export const SUBSTITUTE_OPTIONS: { value: SubstituteState; label: string; active: string }[] = [
  { value: 'ATTENDING', label: 'Going', active: 'border-green bg-green text-white' },
  { value: 'MAYBE', label: 'Asked', active: 'border-gold bg-gold text-white' },
  { value: 'ABSENT', label: "Can't", active: 'border-red bg-red text-white' },
]

const TALLY: { state: SubstituteState; word: string; tone: string }[] = [
  { state: 'ATTENDING', word: 'going', tone: 'text-green-dark' },
  { state: 'MAYBE', word: 'asked', tone: 'text-gold-ink' },
  { state: 'ABSENT', word: "can't", tone: 'text-red' },
]

interface SubstitutesBlockProps {
  substitutes: SubstituteEntry[]
  /** The event's Members, to name who set each Substitute's state. */
  members: AttendanceEntry[]
  onSetState: (substituteId: string, state: SubstituteState) => void
  /** Opens the Substitute's sheet, which can also take them off the event. */
  onOpen: (substituteId: string) => void
  onCallIn: () => void
  pending?: boolean
}

/**
 * Every Substitute on the Event, with their state changeable inline, and the way to call more in
 * (ADR-0033). Sits directly under the Position groups on the event page. Prop-only: the writes and
 * the picker live in the route.
 */
export function SubstitutesBlock({
  substitutes,
  members,
  onSetState,
  onOpen,
  onCallIn,
  pending = false,
}: SubstitutesBlockProps) {
  const tally = TALLY.map((t) => ({ ...t, count: substitutes.filter((s) => s.state === t.state).length })).filter(
    (t) => t.count > 0,
  )

  return (
    <section aria-label="Substitutes" className="mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
      <div className="flex items-baseline justify-between gap-3 px-4 pb-2 pt-3">
        <h3 className="text-caption font-semibold text-purple-ink">Substitutes</h3>
        <span className="text-caption font-semibold">
          {tally.length === 0 ? (
            <span className="text-muted-foreground">none yet</span>
          ) : (
            tally.map((t, i) => (
              <span key={t.state}>
                {i > 0 && ' · '}
                <span className={t.tone}>
                  {t.count} {t.word}
                </span>
              </span>
            ))
          )}
        </span>
      </div>

      {substitutes.length === 0 && <p className="px-4 pb-3 text-small text-muted-foreground">Nobody called in yet.</p>}

      {substitutes.map((sub) => (
        <div key={sub.substituteId} role="group" aria-label={sub.name} className="flex items-center gap-3 px-4 py-2">
          <SubstituteAvatar name={sub.name} />
          <button type="button" onClick={() => onOpen(sub.substituteId)} className="min-w-0 flex-1 text-left">
            <span className="block truncate text-small font-medium">{sub.name}</span>
            <span className="block text-caption text-muted-foreground">
              {sub.position?.label ?? 'Unassigned'} · set by {setByName(sub.changedBy, members)}
            </span>
          </button>
          <span className="flex shrink-0 gap-1">
            {SUBSTITUTE_OPTIONS.map((option) => {
              const on = sub.state === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={on}
                  disabled={pending}
                  onClick={() => onSetState(sub.substituteId, option.value)}
                  className={cn(
                    // The pill stays small; the invisible ::after stretches the tap target to 44px tall (F7).
                    'relative rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60 after:absolute after:-inset-y-2.5 after:inset-x-0',
                    on ? option.active : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </span>
        </div>
      ))}

      <button
        type="button"
        onClick={onCallIn}
        className="flex w-full items-center justify-center gap-2 border-t border-border/40 py-3 text-small font-semibold text-purple-ink hover:bg-purple/5"
      >
        <UserPlus size={18} />
        Call in substitutes
      </button>
    </section>
  )
}
