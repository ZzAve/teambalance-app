import { useRef, useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import type { SubstituteEntry } from '@shared/api/events'
import { SubstituteError, type Substitute } from '@shared/api/substitutes'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/lib/utils'
import { SubstituteAvatar } from '@entities/event/ui/SubstituteAvatar'
import { findSomeone, type PositionRef } from '@entities/event/lib/lineup'
import { groupForPosition } from '../lib/picker-groups'
import { SUBSTITUTE_OPTIONS, SUBSTITUTE_PILL, type SubstituteState } from './SubstitutesBlock'

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
  /** The list could not be loaded: say so, with a retry, rather than claiming nobody is on it. */
  isError?: boolean
  onRetry?: () => void
  /** The Positions could not be loaded: the form says so, with a retry, instead of offering only None. */
  positionsError?: boolean
  onRetryPositions?: () => void
  /** A Substitute write is in flight; the state buttons are held. */
  pending?: boolean
  /** The Substitutes already on this event, with their state. */
  onEvent: SubstituteEntry[]
  onSetState: (substituteId: string, state: SubstituteState) => void
  /**
   * Creates a Substitute and adds them to the event as Asked. Resolves once they are on the list; a
   * rejection keeps the form open with the name, and a [SubstituteError]'s message is shown as is.
   */
  onCreate: (name: string, positionId: string | null) => Promise<unknown>
  onClose: () => void
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
  isError = false,
  onRetry,
  positionsError = false,
  onRetryPositions,
  pending = false,
  onEvent,
  onSetState,
  onCreate,
  onClose,
}: SubstitutePickerViewProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [positionId, setPositionId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  // Bumped whenever the form resets, so a request that settles after that no longer touches it.
  const submission = useRef(0)

  // The list is in memory, so a name already on it is caught here, before any request; the server's
  // own refusal stays the backstop for a race.
  const trimmed = name.trim()
  const alreadyListed = substitutes.find((sub) => sub.name.toLowerCase() === trimmed.toLowerCase())
  const fieldError = alreadyListed ? `${alreadyListed.name} is already on the list — find them above.` : createError

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
                SUBSTITUTE_PILL,
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

  const resetForm = () => {
    submission.current++
    setFormOpen(false)
    setName('')
    setCreateError(null)
    setCreating(false)
  }

  // Closing drops a half-typed name, so the next open starts fresh.
  const close = () => {
    resetForm()
    onClose()
  }

  // The form only clears once the person is on the list; a failure keeps the name to try again with.
  const submit = async () => {
    const mine = ++submission.current
    setCreating(true)
    setCreateError(null)
    try {
      await onCreate(trimmed, positionId)
      if (mine === submission.current) resetForm()
    } catch (error) {
      if (mine !== submission.current) return
      setCreateError(
        error instanceof SubstituteError ? error.message : "Couldn't add the substitute — please try again.",
      )
      setCreating(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && close()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{position ? findSomeone(position.label) : 'Call in substitutes'}</SheetTitle>
          <SheetDescription>{eventTitle}</SheetDescription>
        </SheetHeader>

        {substitutes.length === 0 ? (
          isError ? (
            <InlineError className="mb-3" message="Couldn't load the list." onRetry={onRetry} />
          ) : (
            <p className="mb-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-small text-muted-foreground">
              {isLoading ? 'Loading the list…' : 'Nobody on the list yet.'}
            </p>
          )
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
              onChange={(e) => {
                setName(e.target.value)
                setCreateError(null)
              }}
              aria-invalid={fieldError !== null}
            />
            {fieldError && (
              <p role="alert" className="text-small text-red">
                {fieldError}
              </p>
            )}
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
                    // A full-height chip rather than a band: these wrap, so a band would reach into the line above (F7).
                    'min-h-11 rounded-full border px-3 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    positionId === p.id ? 'border-purple bg-purple text-white' : 'border-border bg-background',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {positionsError && <InlineError message="Couldn't load the positions." onRetry={onRetryPositions} />}
            <Button type="button" disabled={!trimmed || alreadyListed !== undefined || creating} onClick={submit}>
              {creating ? 'Adding…' : 'Add as asked'}
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

/** A load failure, with its retry, where the data would have been — distinct from an empty state. */
function InlineError({ message, onRetry, className }: { message: string; onRetry?: () => void; className?: string }) {
  return (
    <p
      role="alert"
      className={cn('flex items-center justify-between gap-3 rounded-lg bg-red/10 px-3 py-2 text-small text-red', className)}
    >
      {message}
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </p>
  )
}

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
