import { useState } from 'react'
import type { Position } from '@shared/api/positions'
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
  /** The positions query is in flight — render the loading shell instead of the form. */
  isLoading?: boolean
  /** The positions query failed — render the error shell instead of the form. */
  isError?: boolean
  isSaving?: boolean
  /** Backend error discriminator from the container (e.g. POSITION_LABEL_TAKEN), shown inline. */
  errorCode?: string | null
  onCreate: (label: string) => void
  onRename: (id: string, label: string) => void
  onDelete: (position: Position) => void
}

/**
 * Presentational positions-management UI — the complete section, heading and all. Owns only local
 * view state (the new-label field, per-row edits, the delete-confirm dialog target); the query and
 * the create/rename/delete mutations live in the ManagePositions container.
 *
 * The load/error/data shells are props-driven (isLoading / isError) rather than lived in the
 * container, so every state — loading / error / empty / with items / delete-confirm / label-taken —
 * renders purely from props as a story, with no network. See ADR-0017.
 */
export function ManagePositionsView({
  positions = [],
  isLoading,
  isError,
  isSaving,
  errorCode,
  onCreate,
  onRename,
  onDelete,
}: ManagePositionsViewProps) {
  const [newLabel, setNewLabel] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<Position | null>(null)

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
        <p className="mt-4 text-sm text-red-500">Couldn't load positions. Please try again.</p>
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
            <p className="mt-1 text-sm text-red-500">That position already exists.</p>
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
                  Delete "{confirmTarget?.label}"? Members with this position will become Unassigned.
                </DialogDescription>
              </DialogHeader>
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
  onRequestDelete: (position: Position) => void
}

function PositionRow({ position, isSaving, onRename, onRequestDelete }: PositionRowProps) {
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
