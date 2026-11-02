import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import {
  useActiveInvitation,
  useCreateInvitation,
  useExpireInvitations,
  useRotateInvitation,
} from '@shared/api/invitations'
import { useCopyToClipboard } from '@shared/lib/copy-to-clipboard'
import { GenerateInviteContent } from './GenerateInviteContent'

/**
 * Container for the team invite link: owns the dialog open/close state and the copied/just-expired
 * flags, and wires the create/rotate/expire mutations to the presentational GenerateInviteContent.
 *
 * Opening the dialog *reads* the team's current link and never writes. It used to mint one whenever
 * it had no link in memory — which, after a page refresh, was always — so every reopen left another
 * live link behind that no screen could show or revoke (ADR-0025). Minting is now an explicit click.
 *
 * The Dialog wrapper stays here: Radix unmounts the content on close, so no extra reset is needed.
 */
export function GenerateInviteDialog() {
  const [open, setOpen] = useState(false)
  const clipboard = useCopyToClipboard()
  const [justExpired, setJustExpired] = useState(false)
  const activeInvitation = useActiveInvitation({ enabled: open })
  const createInvitation = useCreateInvitation()
  const rotateInvitation = useRotateInvitation()
  const expireInvitation = useExpireInvitations()

  const invitation = activeInvitation.data
  const link = invitation ? `${window.location.origin}/invite/${invitation.token}` : null

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      clipboard.reset()
      setJustExpired(false)
    }
  }

  // Both a fresh generate and a rotate land on a new link; drop the flags from whatever state we
  // were in and let the invalidated query supply it.
  const adoptNewLink = () => {
    setJustExpired(false)
    clipboard.reset()
  }

  const handleGenerate = () => createInvitation.mutate(undefined, { onSuccess: adoptNewLink })

  const handleRotate = () => rotateInvitation.mutate(undefined, { onSuccess: adoptNewLink })

  const handleExpire = () => {
    expireInvitation.mutate(undefined, {
      onSuccess: () => {
        setJustExpired(true)
        clipboard.reset()
      },
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
          isLoading={activeInvitation.isPending}
          isError={activeInvitation.isError}
          link={link}
          copied={clipboard.copiedKey !== null}
          copyFailed={clipboard.failedKey !== null}
          justExpired={justExpired}
          isGenerating={createInvitation.isPending}
          isRotating={rotateInvitation.isPending}
          isExpiring={expireInvitation.isPending}
          actionError={
            createInvitation.isError || rotateInvitation.isError || expireInvitation.isError
          }
          onCopy={() => link && clipboard.copy(link)}
          onGenerate={handleGenerate}
          onRotate={handleRotate}
          onExpire={handleExpire}
        />
      </DialogContent>
    </Dialog>
  )
}
