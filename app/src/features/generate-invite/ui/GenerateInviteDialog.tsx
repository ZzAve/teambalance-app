import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { type Invitation, useCreateInvitation, useExpireInvitations, useRotateInvitation } from '@shared/api/invitations'
import { GenerateInviteContent } from './GenerateInviteContent'

/**
 * Container for the team invite link: owns the dialog open/close state, the copied/expired flags,
 * and the create/rotate/expire mutations, wiring them to the presentational GenerateInviteContent.
 * Opening the dialog kicks off generation once; closing resets the copied flag. The Dialog wrapper
 * stays here — Radix unmounts the content on close, so no extra reset is needed.
 */
export function GenerateInviteDialog() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [expired, setExpired] = useState(false)
  const createInvitation = useCreateInvitation()
  const rotateInvitation = useRotateInvitation()
  const expireInvitation = useExpireInvitations()

  const link = invitation ? `${window.location.origin}/invite/${invitation.token}` : null

  const generate = () => {
    createInvitation.mutate(undefined, {
      onSuccess: (inv) => {
        setInvitation(inv)
        setExpired(false)
      },
    })
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next && !invitation) {
      generate()
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

  const handleRotate = () => {
    setCopied(false)
    rotateInvitation.mutate(undefined, {
      onSuccess: (inv) => {
        setInvitation(inv)
        setExpired(false)
      },
    })
  }

  const handleExpire = () => {
    expireInvitation.mutate(undefined, {
      onSuccess: () => setExpired(true),
    })
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
          expired={expired}
          isRotating={rotateInvitation.isPending}
          isExpiring={expireInvitation.isPending}
          onCopy={handleCopy}
          onRotate={handleRotate}
          onExpire={handleExpire}
          onGenerateNew={generate}
        />
      </DialogContent>
    </Dialog>
  )
}
