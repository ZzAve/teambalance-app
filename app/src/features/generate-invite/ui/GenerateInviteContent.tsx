import { useState } from 'react'
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

interface GenerateInviteContentProps {
  isLoading: boolean
  isError: boolean
  /** The team's current invite link, or null if it has none. */
  link: string | null
  copied: boolean
  /** Set only for the moment after an expire, to confirm the link is gone before offering a new one. */
  justExpired: boolean
  isGenerating: boolean
  isRotating: boolean
  isExpiring: boolean
  actionError: boolean
  onCopy: () => void
  onGenerate: () => void
  onRotate: () => void
  onExpire: () => void
}

/**
 * Presentational body of the invite dialog. Renders exactly one of: loading / error / just-expired /
 * no-link / the active link with copy+rotate+expire actions. The mutations, dialog open/close state,
 * and the copied flag all live in the GenerateInviteDialog container — so each state is renderable in
 * isolation as a story (see GenerateInviteContent.stories.tsx). The outer Dialog chrome (trigger +
 * header) stays in the container; this component owns only its own local confirm-revoke dialog.
 *
 * The no-link state is what the dialog shows instead of silently minting on open: generating is now
 * something the admin asks for, not a side effect of looking (ADR-0025).
 *
 * Revoking asks for confirmation first (issue #341): it is irreversible and offers no replacement,
 * unlike rotate which lands on a new link in the same click.
 */
export function GenerateInviteContent({
  isLoading,
  isError,
  link,
  copied,
  justExpired,
  isGenerating,
  isRotating,
  isExpiring,
  actionError,
  onCopy,
  onGenerate,
  onRotate,
  onExpire,
}: GenerateInviteContentProps) {
  const [confirmRevokeOpen, setConfirmRevokeOpen] = useState(false)
  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  if (isError) return <p className="text-destructive">Failed to load the invite link.</p>

  if (justExpired) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-small text-muted-foreground">
          The link has been revoked. New joiners can no longer use it.
        </p>
        <Button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate new link'}
        </Button>
        {actionError && (
          <p className="text-small text-destructive">Something went wrong. Please try again.</p>
        )}
      </div>
    )
  }

  if (!link) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-small text-muted-foreground">
          This team doesn't have an invite link yet.
        </p>
        <Button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate link'}
        </Button>
        {actionError && (
          <p className="text-small text-destructive">Something went wrong. Please try again.</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-small text-muted-foreground">
        Share this link with your team. Anyone with the link can join.
      </p>
      <div className="flex gap-2">
        <Input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
        <Button type="button" onClick={onCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onRotate} disabled={isRotating}>
          {isRotating ? 'Rotating...' : 'Rotate link'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirmRevokeOpen(true)}
          disabled={isExpiring}
        >
          {isExpiring ? 'Revoking...' : 'Revoke link'}
        </Button>
      </div>
      <p className="text-caption text-muted-foreground">
        Rotating replaces this link with a new one. Revoking removes it without a replacement. Either
        way the old link stops working.
      </p>
      {actionError && (
        <p className="text-small text-destructive">Something went wrong. Please try again.</p>
      )}

      <Dialog open={confirmRevokeOpen} onOpenChange={setConfirmRevokeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke the invite link?</DialogTitle>
            <DialogDescription>
              The old link stops working and no replacement is created. Anyone who hasn't already
              joined with it will need a new link.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRevokeOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmRevokeOpen(false)
                onExpire()
              }}
            >
              Revoke link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
