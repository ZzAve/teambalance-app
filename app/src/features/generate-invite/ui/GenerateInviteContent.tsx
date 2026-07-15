import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'

interface GenerateInviteContentProps {
  isPending: boolean
  isError: boolean
  link: string | null
  copied: boolean
  expired: boolean
  isRotating: boolean
  isExpiring: boolean
  actionError: boolean
  onCopy: () => void
  onRotate: () => void
  onExpire: () => void
  onGenerateNew: () => void
}

/**
 * Presentational body of the invite dialog. Renders exactly one of: generating / error / expired /
 * the active link with copy+rotate+expire actions. The mutations, dialog open/close state, and the
 * copied flag all live in the GenerateInviteDialog container — so each state is renderable in
 * isolation as a story (see GenerateInviteContent.stories.tsx). The Dialog chrome (trigger + header)
 * stays in the container, so this stays free of Radix context.
 */
export function GenerateInviteContent({
  isPending,
  isError,
  link,
  copied,
  expired,
  isRotating,
  isExpiring,
  actionError,
  onCopy,
  onRotate,
  onExpire,
  onGenerateNew,
}: GenerateInviteContentProps) {
  if (isPending) return <p className="text-muted-foreground">Generating...</p>
  if (isError) return <p className="text-destructive">Failed to generate invite link.</p>
  if (!link) return null

  if (expired) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          This link has expired. New joiners can no longer use it.
        </p>
        <Button type="button" onClick={onGenerateNew}>
          Generate new link
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
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
        <Button type="button" variant="destructive" onClick={onExpire} disabled={isExpiring}>
          {isExpiring ? 'Expiring...' : 'Expire link'}
        </Button>
      </div>
      {actionError && (
        <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
