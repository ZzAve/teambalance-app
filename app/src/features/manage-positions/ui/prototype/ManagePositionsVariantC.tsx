// PROTOTYPE — throwaway (issue #341). Do not fold into main as-is.
// Variant C for the positions list: the whole row is one tap target that opens a bottom Sheet with
// every edit for that position — mirrors MemberRosterVariantC. Reuses the real usePositions query
// (read-only); every mutation is a stub (console.log + toast).
import { useState } from 'react'
import { toast } from 'sonner'
import type { Position, PositionKind } from '@shared/api/positions'
import { usePositions } from '@shared/api/positions'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { validatePositionLabel } from '../../lib/validate-position-label'

export function ManagePositionsVariantC() {
  const { data: positions, isLoading, error } = usePositions()
  const [newLabel, setNewLabel] = useState('')
  const newLabelError = validatePositionLabel(newLabel)

  const handleCreate = () => {
    if (newLabelError) return
    const label = newLabel.trim()
    console.log('[proto] would create position', label)
    toast(`Would add position "${label}"`)
    setNewLabel('')
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Positions</h2>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red">Couldn't load positions. Please try again.</p>}

      {!isLoading && !error && (
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
            <Button disabled={!!newLabelError} onClick={handleCreate}>
              Add
            </Button>
          </div>

          <ul className="divide-y divide-border rounded-lg border border-border">
            {(positions ?? []).map((position) => (
              <PositionRowC key={position.id} position={position} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PositionRowC({ position }: { position: Position }) {
  // Local-only overrides for visible feedback from the stubbed mutations — nothing reaches the
  // network.
  const [label, setLabel] = useState(position.label)
  const [kind, setKind] = useState<PositionKind>(position.kind)
  const [open, setOpen] = useState(false)
  const [draftLabel, setDraftLabel] = useState(label)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const dirty = draftLabel.trim().length > 0 && draftLabel.trim() !== label

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setDraftLabel(label)
          setOpen(true)
        }}
        className="flex h-14 w-full items-center gap-3 p-3 text-left hover:bg-accent/50"
        aria-label={`Edit ${label}`}
      >
        <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
        {kind === 'STAFF' && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Staff
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{label}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Label
              <Input
                aria-label={`Label for ${label}`}
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
              />
            </label>
            {dirty && (
              <Button
                size="sm"
                className="self-start"
                onClick={() => {
                  const next = draftLabel.trim()
                  setLabel(next)
                  console.log('[proto] would rename position', position.id, 'to', next)
                  toast(`Would rename "${position.label}" to "${next}"`)
                }}
              >
                Save label
              </Button>
            )}

            <label className="flex items-center justify-between gap-2 text-sm font-medium">
              Staff (doesn't count toward headcount)
              <input
                type="checkbox"
                aria-label={`${label} is staff`}
                className="size-5 accent-green"
                checked={kind === 'STAFF'}
                onChange={() => {
                  const next: PositionKind = kind === 'STAFF' ? 'PLAYING' : 'STAFF'
                  setKind(next)
                  console.log('[proto] would set kind of', position.id, 'to', next)
                  toast(`Would mark "${label}" as ${next === 'STAFF' ? 'staff' : 'playing'}`)
                }}
              />
            </label>

            <Button variant="outline" className="mt-4 w-full" onClick={() => setConfirmOpen(true)}>
              Delete position…
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete position</DialogTitle>
            <DialogDescription>Delete "{label}"? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log('[proto] would delete position', position.id)
                toast(`Would delete "${label}"`)
                setConfirmOpen(false)
                setOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  )
}
