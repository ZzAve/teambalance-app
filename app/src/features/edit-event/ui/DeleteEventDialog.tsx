import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useDeleteEvent } from '@shared/api/events'

interface DeleteEventDialogProps {
  eventId: string
  title: string
  /** True when the event is one occurrence of a series — clarifies that only this one is removed. */
  partOfSeries?: boolean
}

/**
 * Single-event delete (ADR-0014 Phase 2, "This event" scope only). A recurring occurrence is
 * deleted like any standalone event and never splits the series (Decision 4); bulk delete is Phase 3.
 * On success it navigates back to the event list, since the detail route no longer exists.
 */
export function DeleteEventDialog({ eventId, title, partOfSeries = false }: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteEvent = useDeleteEvent()

  const handleDelete = () => {
    deleteEvent.mutate(eventId, { onSuccess: () => navigate({ to: '/' }) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="flex-1 border-red-200 text-red-500 hover:bg-red-500/5 hover:text-red-500"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={15} />
        Delete
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this event?</DialogTitle>
          <DialogDescription>
            {title} will be removed for everyone, along with its attendance.
            {partOfSeries && ' Only this occurrence is deleted — the rest of the series stays.'}
          </DialogDescription>
        </DialogHeader>
        {deleteEvent.isError && (
          <p className="rounded-lg border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            Could not delete the event. Please try again.
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteEvent.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteEvent.isPending}
          >
            {deleteEvent.isPending ? 'Deleting…' : 'Delete event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
