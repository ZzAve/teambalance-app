import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'

interface HandoverAdminViewProps {
  isGenerating: boolean
  isError: boolean
  /** The single-use admin handover link once minted, or null before the admin asks for one. */
  link: string | null
  copied: boolean
  onGenerate: () => void
  onCopy: () => void
}

/**
 * Presentational body of the admin handover control (ADR-0024 §5). Renders either the "generate" prompt
 * or the minted single-use link with a copy button. The mutation, the copied flag, and the built URL
 * live in the HandoverAdmin container, so each state renders from props as a no-network story (ADR-0017).
 *
 * Deliberately separate from the shareable invite link: this grants **Admin** and is spent on first
 * accept, so its copy has to say both — hand it to exactly one person, once.
 */
export function HandoverAdminView({
  isGenerating,
  isError,
  link,
  copied,
  onGenerate,
  onCopy,
}: HandoverAdminViewProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold">Hand over as admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a single-use link that makes the first person who opens it an admin of this team. Send
          it to one person — anyone who opens it becomes an admin, and it stops working once used.
        </p>
      </div>

      {!link ? (
        <Button type="button" onClick={onGenerate} disabled={isGenerating} className="self-start">
          {isGenerating ? 'Creating…' : 'Create admin handover link'}
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input aria-label="Admin handover link" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
            <Button type="button" onClick={onCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link grants admin and can be used once. If you need another, create a new one.
          </p>
        </div>
      )}

      {isError && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong creating the link. Please try again.
        </p>
      )}
    </div>
  )
}
