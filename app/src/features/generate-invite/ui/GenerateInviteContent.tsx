import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'

interface GenerateInviteContentProps {
  isPending: boolean
  isError: boolean
  link: string | null
  copied: boolean
  onCopy: () => void
}

/**
 * Presentational body of the invite dialog. Renders exactly one of: generating / error / the
 * generated link with a copy button. The mutation, dialog open/close state, and the copied flag all
 * live in the GenerateInviteDialog container — so each state (pending, error, generated, copied) is
 * renderable in isolation as a story (see GenerateInviteContent.stories.tsx). The Dialog chrome
 * (trigger + header) stays in the container, so this stays free of Radix context.
 */
export function GenerateInviteContent({
  isPending,
  isError,
  link,
  copied,
  onCopy,
}: GenerateInviteContentProps) {
  if (isPending) return <p className="text-muted-foreground">Generating...</p>
  if (isError) return <p className="text-destructive">Failed to generate invite link.</p>
  if (!link) return null

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
    </div>
  )
}
