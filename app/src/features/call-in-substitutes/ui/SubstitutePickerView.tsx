import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/lib/utils'

interface PositionOption {
  id: string
  label: string
}

interface SubstitutePickerViewProps {
  open: boolean
  eventTitle: string
  positions: PositionOption[]
  /** Creates a Substitute and adds them to the event as Asked. */
  onCreate: (name: string, positionId: string | null) => void
  onClose: () => void
  creating?: boolean
}

/**
 * Calling Substitutes in for one event (ADR-0033). Any Member may add someone who is not on the
 * Team's list yet: a name and an optional Position, added as Asked (Maybe), since the person has
 * been asked and not yet answered. Prop-only; the writes live in the route.
 */
export function SubstitutePickerView({
  open,
  eventTitle,
  positions,
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

        {formOpen ? (
          <div className="flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3">
            <Label htmlFor="new-substitute-name">Name</Label>
            <Input
              id="new-substitute-name"
              value={name}
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
            className="flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple"
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
