// PROTOTYPE — throwaway (issue #341). Do not fold into main as-is.
// Variant B for the positions list: quiet row + one overflow (⋯) menu per row, same shape as
// MemberRosterVariantB — the point being that members/positions/event-types should read as one
// repeating row pattern. Reuses the real usePositions query (read-only); every mutation is a stub
// (console.log + toast).
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Position, PositionKind } from '@shared/api/positions'
import { usePositions } from '@shared/api/positions'
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
import { validatePositionLabel } from '../../lib/validate-position-label'

export function ManagePositionsVariantB() {
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
              <PositionRowB key={position.id} position={position} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PositionRowB({ position }: { position: Position }) {
  // Local-only overrides for visible feedback from the stubbed mutations — nothing reaches the
  // network.
  const [label, setLabel] = useState(position.label)
  const [kind, setKind] = useState<PositionKind>(position.kind)
  const [editing, setEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(label)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  if (editing) {
    return (
      <li className="flex items-center gap-2 p-3">
        <Input
          aria-label={`Label for ${label}`}
          value={draftLabel}
          autoFocus
          onChange={(e) => setDraftLabel(e.target.value)}
          className="min-w-0 flex-1"
        />
        <Button
          size="sm"
          onClick={() => {
            const next = draftLabel.trim()
            if (next.length === 0) return
            setLabel(next)
            console.log('[proto] would rename position', position.id, 'to', next)
            toast(`Would rename "${position.label}" to "${next}"`)
            setEditing(false)
          }}
        >
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setDraftLabel(label); setEditing(false) }}>
          Cancel
        </Button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2 p-3">
      <button
        type="button"
        onClick={() => {
          setDraftLabel(label)
          setEditing(true)
        }}
        className="min-w-0 flex-1 truncate text-left font-medium underline-offset-2 hover:underline"
        aria-label={`Edit label for ${label}`}
        title="Tap to rename"
      >
        {label}
      </button>

      {kind === 'STAFF' && (
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          Staff
        </span>
      )}

      <details ref={detailsRef} className="relative shrink-0">
        <summary
          className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md text-lg hover:bg-accent [&::-webkit-details-marker]:hidden"
          aria-label={`Actions for ${label}`}
        >
          ⋯
        </summary>
        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-border bg-background p-1 shadow-lg">
          <button
            type="button"
            className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
            onClick={() => {
              closeMenu()
              setDraftLabel(label)
              setEditing(true)
            }}
          >
            Rename
          </button>
          <button
            type="button"
            className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
            onClick={() => {
              closeMenu()
              const next: PositionKind = kind === 'STAFF' ? 'PLAYING' : 'STAFF'
              setKind(next)
              console.log('[proto] would set kind of', position.id, 'to', next)
              toast(`Would mark "${label}" as ${next === 'STAFF' ? 'staff' : 'playing'}`)
            }}
          >
            {kind === 'STAFF' ? 'Mark as playing' : 'Mark as staff'}
          </button>
          <button
            type="button"
            className="block w-full rounded px-3 py-2 text-left text-sm text-red hover:bg-red/10"
            onClick={() => {
              closeMenu()
              setConfirmOpen(true)
            }}
          >
            Delete…
          </button>
        </div>
      </details>

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
