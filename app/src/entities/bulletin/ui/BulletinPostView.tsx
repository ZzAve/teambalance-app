import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { formatLocale } from '@shared/i18n/i18n'
import { Markdown } from '@shared/ui/Markdown'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'

export interface PostEditEntry {
  editorName: string
  editedAt: string
}

interface BulletinPostViewProps {
  markdown: string
  /** The author's display name; the container resolves it from the Roster. */
  authorName: string
  postedAt: string
  /** Oldest first. A Post with edits shows "edited" and an info button with the full list. */
  edits?: PostEditEntry[]
  /** The Admin's actions (the ⋯ menu), on the header line. */
  actions?: ReactNode
}

/** One Post on the Bulletin Board (ADR-0048): who posted it and when, then the Markdown. */
export function BulletinPostView({ markdown, authorName, postedAt, edits = [], actions }: BulletinPostViewProps) {
  const { i18n } = useTranslation()
  const date = new Date(postedAt).toLocaleDateString(formatLocale(i18n.language), { day: 'numeric', month: 'short' })

  return (
    <article className="rounded-lg border border-border/40 bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="flex min-h-9 flex-wrap items-center gap-x-1 text-caption text-muted-foreground">
          <span className="font-semibold text-foreground/80">{authorName}</span> · <time dateTime={postedAt}>{date}</time>
          {edits.length > 0 && <EditHistory authorName={authorName} postedAt={postedAt} edits={edits} />}
        </p>
        {actions}
      </div>
      <Markdown source={markdown} />
    </article>
  )
}

function EditHistory({ authorName, postedAt, edits }: { authorName: string; postedAt: string; edits: PostEditEntry[] }) {
  const { t, i18n } = useTranslation()
  const when = (iso: string) =>
    new Date(iso).toLocaleString(formatLocale(i18n.language), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <>
      · {t('bulletin.edited')}
      <Popover>
        <PopoverTrigger
          aria-label={t('bulletin.editHistory')}
          // after:-inset-3 keeps a 44px touch target around the small icon (F7).
          className="relative flex h-5 w-5 items-center justify-center rounded-full after:absolute after:-inset-3 hover:text-foreground"
        >
          <Info size={14} />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <p className="mb-2 font-semibold">{t('bulletin.editHistory')}</p>
          <ol className="flex flex-col gap-1.5">
            {[...edits].reverse().map((edit) => (
              <li key={edit.editedAt + edit.editorName} className="flex justify-between gap-3">
                <span>{t('bulletin.editedBy', { name: edit.editorName })}</span>
                <time dateTime={edit.editedAt} className="shrink-0 tabular-nums text-muted-foreground">{when(edit.editedAt)}</time>
              </li>
            ))}
            <li className="flex justify-between gap-3 border-t border-border/40 pt-1.5">
              <span>{t('bulletin.postedBy', { name: authorName })}</span>
              <time dateTime={postedAt} className="shrink-0 tabular-nums text-muted-foreground">{when(postedAt)}</time>
            </li>
          </ol>
        </PopoverContent>
      </Popover>
    </>
  )
}
