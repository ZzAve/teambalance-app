import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { SubstituteEntry } from '@shared/api/events'
import type { Substitute } from '@shared/api/substitutes'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/lib/utils'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
import { SUBSTITUTE_OPTIONS, type SubstituteState } from './SubstitutesBlock'

interface PositionOption {
  id: string
  label: string
}

interface SubstitutePickerViewProps {
  open: boolean
  eventTitle: string
  positions: PositionOption[]
  /** The Team's list, ordered by name. */
  substitutes: Substitute[]
  /** The list is still loading: say so, rather than claiming nobody is on it. */
  isLoading?: boolean
  /** A Substitute write is in flight; the state buttons are held. */
  pending?: boolean
  /** The Substitutes already on this event, with their state. */
  onEvent: SubstituteEntry[]
  onSetState: (substituteId: string, state: SubstituteState) => void
  onTakeOff: (substituteId: string) => void
  /** Creates a Substitute and adds them to the event as Asked. */
  onCreate: (name: string, positionId: string | null) => void
  onClose: () => void
  creating?: boolean
}

// The picker offers the two ways a Substitute joins an event; "Can't" is set afterwards, on the
// event page, once someone has answered.
const OPTIONS = SUBSTITUTE_OPTIONS.filter((option) => option.value !== 'ABSENT')

/**
 * Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
 * Going / Asked, so several can be called in before Done. Any Member may also add someone who is not
 * on the list yet: a name and an optional Position, added as Asked (Maybe), since the person has
 * been asked and not yet answered. Prop-only; the writes live in the route.
 */
export function SubstitutePickerView({
  open,
  eventTitle,
  positions,
  substitutes,
  isLoading = false,
  pending = false,
  onEvent,
  onSetState,
  onTakeOff,
  onCreate,
  onClose,
  creating = false,
}: SubstitutePickerViewProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [positionId, setPositionId] = useState<string | null>(null)

  const submit = () => {
    onCreate(name.trim(), positionId)
    setFormOpen(false)
    setName('')
    setPositionId(null)
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Call in substitutes</SheetTitle>
          <SheetDescription>{eventTitle}</SheetDescription>
        </SheetHeader>

        <div className="mb-3 overflow-hidden rounded-lg border border-border/60 bg-card">
          {substitutes.length === 0 && (
            <p className="px-3 py-2.5 text-small text-muted-foreground">
              {isLoading ? 'Loading the list…' : 'Nobody on the list yet.'}
            </p>
          )}
          {substitutes.map((sub) => {
            const state = onEvent.find((e) => e.substituteId === sub.id)?.state
            return (
              <div
                key={sub.id}
                role="group"
                aria-label={sub.name}
                className="flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0"
              >
                <SubstituteAvatar name={sub.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-medium">{sub.name}</span>
                  <span className="block text-caption text-muted-foreground">{sub.position?.label ?? 'Unassigned'}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={state === option.value}
                      disabled={pending}
                      onClick={() => onSetState(sub.id, option.value)}
                      className={cn(
                        'rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60',
                        state === option.value ? option.active : 'border-border text-muted-foreground hover:bg-muted',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                  {state && (
                    <button
                      type="button"
                      aria-label="Take off"
                      disabled={pending}
                      onClick={() => onTakeOff(sub.id)}
                      className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              </div>
            )
          })}
        </div>

        {formOpen ? (
          <div className="flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3">
            <Label htmlFor="new-substitute-name">Name</Label>
            <Input
              id="new-substitute-name"
              value={name}
              maxLength={100}
              autoComplete="off"
              placeholder="e.g. Pieter Smit"
              onChange={(e) => setName(e.target.value)}
            />
            <span className="text-small font-medium">
              Position <span className="font-normal text-muted-foreground">(optional)</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[...positions, { id: null, label: 'None' }].map((p) => (
                <button
                  key={p.id ?? 'none'}
                  type="button"
                  aria-pressed={positionId === p.id}
                  onClick={() => setPositionId(p.id)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-small',
                    positionId === p.id ? 'border-purple bg-purple text-white' : 'border-border bg-background',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Button type="button" disabled={!name.trim() || creating} onClick={submit}>
              Add as asked
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink"
          >
            <span className="grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple">
              <Plus size={16} />
            </span>
            <span>
              New substitute
              <span className="block text-caption font-normal text-muted-foreground">
                Someone who isn't on the list yet
              </span>
            </span>
          </button>
        )}

        <Button type="button" variant="outline" className="mt-4" onClick={onClose}>
          Done
        </Button>
      </SheetContent>
    </Sheet>
  )
}
