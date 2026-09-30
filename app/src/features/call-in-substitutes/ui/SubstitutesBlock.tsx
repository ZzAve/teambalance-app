import { UserPlus } from 'lucide-react'
import type { SubstituteEntry } from '@shared/api/events'
import { avatarInitials } from '@shared/lib/avatar'
import { cn } from '@shared/lib/utils'

export type SubstituteState = SubstituteEntry['state']

// A Substitute is never Not Responded (ADR-0033), so these three are every state they can hold.
// "Asked" is Maybe: someone sent a message and is waiting to hear back.
const OPTIONS: { value: SubstituteState; label: string; active: string }[] = [
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
  onSetState: (substituteId: string, state: SubstituteState) => void
  onCallIn: () => void
  pending?: boolean
}

/**
 * Every Substitute on the Event, with their state changeable inline, and the way to call more in
 * (ADR-0033). Sits directly under the Position groups on the event page. Prop-only: the writes and
 * the picker live in the route.
 */
export function SubstitutesBlock({ substitutes, onSetState, onCallIn, pending = false }: SubstitutesBlockProps) {
  const tally = TALLY.map((t) => ({ ...t, count: substitutes.filter((s) => s.state === t.state).length })).filter(
    (t) => t.count > 0,
  )

  return (
    <section aria-label="Substitutes" className="mt-6 overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
      <div className="flex items-baseline justify-between gap-3 px-4 pb-2 pt-3">
        <h3 className="text-caption font-semibold text-purple">Substitutes</h3>
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
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-dashed border-purple text-caption font-bold text-purple"
          >
            {avatarInitials(sub.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-small font-medium">{sub.name}</span>
            <span className="block text-caption text-muted-foreground">{sub.position?.label ?? 'Unassigned'}</span>
          </span>
          <span className="flex shrink-0 gap-1">
            {OPTIONS.map((option) => {
              const on = sub.state === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={on}
                  disabled={pending}
                  onClick={() => onSetState(sub.substituteId, option.value)}
                  className={cn(
                    'rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60',
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
        className="flex w-full items-center justify-center gap-2 border-t border-border/40 py-3 text-small font-semibold text-purple hover:bg-purple/5"
      >
        <UserPlus size={18} />
        Call in substitutes
      </button>
    </section>
  )
}
