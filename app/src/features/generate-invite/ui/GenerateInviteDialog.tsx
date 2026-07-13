import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { useCreateInvitation } from '@shared/api/invitations'
import { GenerateInviteContent } from './GenerateInviteContent'

/**
 * Container for the team invite link: owns the dialog open/close state, the copied flag, and the
 * create-invitation mutation, wiring them to the presentational GenerateInviteContent. Opening the
 * dialog kicks off generation once; closing resets the copied flag. The Dialog wrapper stays here —
 * Radix unmounts the content on close, so no extra reset is needed.
 */
export function GenerateInviteDialog() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const createInvitation = useCreateInvitation()

  const link = createInvitation.data
    ? `${window.location.origin}/invite/${createInvitation.data.token}`
    : null

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next && !createInvitation.data) {
      createInvitation.mutate()
    }
    if (!next) {
      setCopied(false)
    }
  }

  const handleCopy = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team invite link</DialogTitle>
        </DialogHeader>
        <GenerateInviteContent
          isPending={createInvitation.isPending}
          isError={createInvitation.isError}
          link={link}
          copied={copied}
          onCopy={handleCopy}
        />
      </DialogContent>
    </Dialog>
  )
}
