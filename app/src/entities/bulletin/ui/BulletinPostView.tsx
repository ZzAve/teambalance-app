import { useTranslation } from 'react-i18next'
import { formatLocale } from '@shared/i18n/i18n'
import { Markdown } from '@shared/ui/Markdown'

interface BulletinPostViewProps {
  markdown: string
  /** The author's display name; the container resolves it from the Roster. */
  authorName: string
  postedAt: string
}

/** One Post on the Bulletin Board (ADR-0048): who posted it and when, then the Markdown. */
export function BulletinPostView({ markdown, authorName, postedAt }: BulletinPostViewProps) {
  const { i18n } = useTranslation()
  const date = new Date(postedAt).toLocaleDateString(formatLocale(i18n.language), { day: 'numeric', month: 'short' })

  return (
    <article className="rounded-lg border border-border/40 bg-card p-4 shadow-sm">
      <p className="mb-2 text-caption text-muted-foreground">
        <span className="font-semibold text-foreground/80">{authorName}</span> · <time dateTime={postedAt}>{date}</time>
      </p>
      <Markdown source={markdown} />
    </article>
  )
}
