import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { useCreateInvitation } from '@shared/api/invitations'

export function GenerateInviteDialog() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const createInvitation = useCreateInvitation()

  const inviteUrl = createInvitation.data
    ? `${window.location.origin}/invite/${createInvitation.data.token}`
    : ''

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
    await navigator.clipboard.writeText(inviteUrl)
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
        {createInvitation.isPending && <p className="text-muted-foreground">Generating...</p>}
        {createInvitation.isError && <p className="text-destructive">Failed to generate invite link.</p>}
        {createInvitation.data && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Share this link with your team. Anyone with the link can join.
            </p>
            <div className="flex gap-2">
              <Input readOnly value={inviteUrl} onFocus={(e) => e.currentTarget.select()} />
              <Button type="button" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
