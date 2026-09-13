import { useState } from 'react'
import type { Position, PositionKind, PositionUsage } from '@shared/api/positions'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { validatePositionLabel } from '../lib/validate-position-label'

interface ManagePositionsViewProps {
  positions?: Position[]
  /**
   * What deleting `confirmTarget` would touch, once the container has fetched it. Undefined while
   * it is still loading — the dialog says so rather than implying "nothing".
   */
  usage?: PositionUsage
  /** Told which position the delete dialog is asking about, so the container can fetch its usage. */
  onConfirmTargetChange?: (position: Position | null) => void
  /** The positions query is in flight — render the loading shell instead of the form. */
  isLoading?: boolean
  /** The positions query failed — render the error shell instead of the form. */
  isError?: boolean
  isSaving?: boolean
  /** Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline. */
  errorCode?: string | null
  onCreate: (label: string) => void
  onRename: (id: string, label: string) => void
  /** Reclassifies a position as played or staffed (#281). Applies at once — no Save to press. */
  onSetKind: (id: string, kind: PositionKind) => void
  onDelete: (position: Position) => void
}

/**
 * Presentational positions-management UI — the complete section, heading and all. Owns only local
 * view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
 * the create/rename/set-kind/delete mutations live in the ManagePositions container.
 *
 * The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
 * container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
 * renders purely from props as a story, with no network. See ADR-0017.
 */
export function ManagePositionsView({
  positions = [],
  usage,
  onConfirmTargetChange,
  isLoading,
  isError,
  isSaving,
  errorCode,
  onCreate,
  onRename,
  onSetKind,
  onDelete,
}: ManagePositionsViewProps) {
  const [newLabel, setNewLabel] = useState('')
  const [confirmTarget, setConfirmTargetState] = useState<Position | null>(null)
  const setConfirmTarget = (position: Position | null) => {
    setConfirmTargetState(position)
    onConfirmTargetChange?.(position)
  }

  const newLabelError = validatePositionLabel(newLabel)

  const handleCreate = () => {
    if (newLabelError) return
    onCreate(newLabel.trim())
    setNewLabel('')
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Positions</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="mt-4 text-sm text-red">Couldn't load positions. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              aria-label="New position label"
              value={newLabel}
              placeholder="e.g. Setter"
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCreate()
                }
              }}
            />
            <Button disabled={isSaving || !!newLabelError} onClick={handleCreate}>
              Add
            </Button>
          </div>
          {errorCode === 'POSITION_LABEL_TAKEN' && (
            <p className="mt-1 text-sm text-red">That position already exists.</p>
          )}

          {positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No positions yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {positions.map((position) => (
                <PositionRow
                  key={position.id}
                  position={position}
                  isSaving={isSaving}
                  onRename={onRename}
                  onSetKind={onSetKind}
                  onRequestDelete={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <Dialog
            open={confirmTarget !== null}
            onOpenChange={(open) => {
              if (!open) setConfirmTarget(null)
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete position</DialogTitle>
                <DialogDescription>
                  Delete "{confirmTarget?.label}"? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {/* Names what the delete will actually touch. A warning, not a veto — the delete
                  proceeds either way, but an admin should not have to guess the blast radius. */}
              <p className="text-sm text-muted-foreground">
                {usage ? deleteImpact(usage) : 'Checking what uses this position…'}
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmTarget(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirmTarget) onDelete(confirmTarget)
                    setConfirmTarget(null)
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

interface PositionRowProps {
  position: Position
  isSaving?: boolean
  onRename: (id: string, label: string) => void
  onSetKind: (id: string, kind: PositionKind) => void
  onRequestDelete: (position: Position) => void
}

function PositionRow({ position, isSaving, onRename, onSetKind, onRequestDelete }: PositionRowProps) {
  const [label, setLabel] = useState(position.label)
  const dirty = label.trim().length > 0 && label.trim() !== position.label

  return (
    <li className="flex flex-wrap items-center gap-2 p-3">
      <Input
        aria-label={`Label for ${position.label}`}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-48"
      />
      {dirty && (
        <Button size="sm" disabled={isSaving} onClick={() => onRename(position.id, label.trim())}>
          Save
        </Button>
      )}
      {/* No local state and no Save: the checkbox reflects the server's kind and the flip is the
          whole gesture. Unchecked is PLAYING, which is what every position was before this existed. */}
      <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          // Named per row, because "Staff" alone repeats down the list and says nothing about which
          // position it belongs to — the same reason the label field is "Label for Setter".
          aria-label={`${position.label} is staff`}
          className="size-4 accent-green"
          checked={position.kind === 'STAFF'}
          disabled={isSaving}
          onChange={(e) => onSetKind(position.id, e.target.checked ? 'STAFF' : 'PLAYING')}
        />
        Staff
      </label>
      <Button
        variant="destructive"
        size="sm"
        className="ml-auto"
        disabled={isSaving}
        onClick={() => onRequestDelete(position)}
      >
        Delete
      </Button>
    </li>
  )
}

/**
 * Plain-language blast radius for a position delete. Only the non-zero parts are named, so a
 * position nothing uses reads as a clean removal rather than a list of three zeroes.
 */
function deleteImpact(usage: PositionUsage): string {
  const parts: string[] = []
  if (usage.memberCount > 0) {
    parts.push(`${usage.memberCount} ${usage.memberCount === 1 ? 'member becomes' : 'members become'} Unassigned`)
  }
  if (usage.eventTypeCount > 0) {
    parts.push(`it is dropped from ${usage.eventTypeCount} event ${usage.eventTypeCount === 1 ? 'type' : 'types'}`)
  }
  if (usage.eventCount > 0) {
    parts.push(`and from ${usage.eventCount} ${usage.eventCount === 1 ? 'event' : 'events'} with their own roster`)
  }
  return parts.length === 0 ? 'Nothing currently uses this position.' : `${parts.join(', ')}.`
}
