import { useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import type { SubstituteEntry } from '@shared/api/events'
import type { Substitute } from '@entities/substitute/api/substitutes'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/lib/utils'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
import { findSomeone, type PositionRef } from '@entities/event/lib/lineup'
import { groupForPosition } from '../lib/picker-groups'
import { SUBSTITUTE_OPTIONS, type SubstituteState } from './SubstitutesBlock'

interface SubstitutePickerViewProps {
  open: boolean
  eventTitle: string
  /** Opened from one Position's open spot: who plays it comes first, and a new one plays it too. */
  position?: PositionRef | null
  positions: PositionRef[]
  /** The Team's list, ordered by name. */
  substitutes: Substitute[]
  /** The list is still loading: say so, rather than claiming nobody is on it. */
  isLoading?: boolean
  /** A Substitute write is in flight; the state buttons are held. */
  pending?: boolean
  /** The Substitutes already on this event, with their state. */
  onEvent: SubstituteEntry[]
  onSetState: (substituteId: string, state: SubstituteState) => void
  /** Creates a Substitute and adds them to the event as Asked. */
  onCreate: (name: string, positionId: string | null) => void
  onClose: () => void
  creating?: boolean
}

/**
 * Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
 * Going / Asked / Can't, so several can be called in, and a "no" recorded, before Done. Can't keeps
 * the person on the event as declined; taking them off the event is not offered here, only in their
 * Substitute sheet, so recording a "no" can never delete that they were asked.
 *
 * Any Member may also add someone who is not on the list yet: a name and an optional Position, added
 * as Asked (Maybe), since the person has been asked and not yet answered. Prop-only; the writes live
 * in [SubstitutePicker].
 */
export function SubstitutePickerView({
  open,
  eventTitle,
  position = null,
  positions,
  substitutes,
  isLoading = false,
  pending = false,
  onEvent,
  onSetState,
  onCreate,
  onClose,
  creating = false,
}: SubstitutePickerViewProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [positionId, setPositionId] = useState<string | null>(null)

  const renderRow = (sub: Substitute) => {
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
          {SUBSTITUTE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={state === option.value}
              disabled={pending}
              onClick={() => onSetState(sub.id, option.value)}
              className={cn(
                // The pill stays small; the invisible ::after stretches the tap target to 44px tall (F7).
                'relative rounded-full border-[1.5px] px-2 py-1 text-caption font-semibold transition-colors disabled:opacity-60 after:absolute after:-inset-y-2.5 after:inset-x-0',
                state === option.value ? option.active : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {option.label}
            </button>
          ))}
        </span>
      </div>
    )
  }

  // Closing drops a half-typed name, so the next open starts fresh.
  const close = () => {
    setFormOpen(false)
    setName('')
    onClose()
  }

  const submit = () => {
    onCreate(name.trim(), positionId)
    setFormOpen(false)
    setName('')
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && close()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{position ? findSomeone(position.label) : 'Call in substitutes'}</SheetTitle>
          <SheetDescription>{eventTitle}</SheetDescription>
        </SheetHeader>

        {substitutes.length === 0 ? (
          <p className="mb-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-small text-muted-foreground">
            {isLoading ? 'Loading the list…' : 'Nobody on the list yet.'}
          </p>
        ) : position ? (
          <PositionGroups position={position} substitutes={substitutes} renderRow={renderRow} />
        ) : (
          <div className={LIST}>{substitutes.map(renderRow)}</div>
        )}

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
            onClick={() => {
              setPositionId(position?.id ?? null)
              setFormOpen(true)
            }}
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

        <Button type="button" variant="outline" className="mt-4" onClick={close}>
          Done
        </Button>
      </SheetContent>
    </Sheet>
  )
}

const LIST = 'mb-3 overflow-hidden rounded-lg border border-border/60 bg-card'

function PositionGroups({
  position,
  substitutes,
  renderRow,
}: {
  position: PositionRef
  substitutes: Substitute[]
  renderRow: (sub: Substitute) => ReactNode
}) {
  const { plays, others } = groupForPosition(substitutes, position.id)
  const heading = `Plays ${position.label}`
  return (
    <>
      <div role="group" aria-label={heading}>
        <h3 className="mb-1.5 text-caption font-semibold text-muted-foreground">{heading}</h3>
        <div className={LIST}>
          {plays.length === 0 ? (
            <p className="px-3 py-2.5 text-small text-muted-foreground">Nobody on the list plays this yet.</p>
          ) : (
            plays.map(renderRow)
          )}
        </div>
      </div>
      {others.length > 0 && (
        <div role="group" aria-label="Others">
          <h3 className="mb-1.5 text-caption font-semibold text-muted-foreground">Others</h3>
          <div className={LIST}>{others.map(renderRow)}</div>
        </div>
      )}
    </>
  )
}
