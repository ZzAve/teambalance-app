import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, Pin, X } from 'lucide-react'
import { APP_COLUMN } from '@shared/ui/AppShellFrame'

// The strip is in the app shell, so a static import would put the Markdown parser in the entry bundle
// of every page. The closed strip shows only a title; the parser loads when a member opens it.
const Markdown = lazy(() => import('@shared/ui/Markdown').then((module) => ({ default: module.Markdown })))

export interface StripPost {
  id: string
  /** The Post's first line, shown while the strip is closed. */
  title: string
  markdown: string
}

interface PinnedPostsStripViewProps {
  /** Newest first; the strip renders nothing without any. */
  posts: StripPost[]
  onClose: () => void
}

/**
 * The pinned Bulletin Board Posts under the header on every team page (ADR-0050): one line with the
 * newest pin's title, opening to all of them. Prop-only; the container decides when it shows.
 */
export function PinnedPostsStripView({ posts, onClose }: PinnedPostsStripViewProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  if (posts.length === 0) return null

  return (
    <section aria-label={t('bulletin.pinnedStrip')} className="border-b border-gold/40 bg-gold/10">
      <div className={APP_COLUMN}>
        <div className="flex min-h-11 items-center gap-2 text-small">
          <Pin size={14} aria-hidden className="shrink-0 text-gold-ink" />
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={t('bulletin.openPinned')}
            onClick={() => setExpanded(!expanded)}
            className="flex min-h-11 min-w-0 flex-1 items-center gap-1 text-left"
          >
            <span className="truncate font-semibold">{posts[0].title}</span>
            {posts.length > 1 && (
              <span className="shrink-0 text-muted-foreground">{t('bulletin.morePinned', { count: posts.length - 1 })}</span>
            )}
            {expanded
              ? <ChevronUp size={16} aria-hidden className="ml-auto shrink-0" />
              : <ChevronDown size={16} aria-hidden className="ml-auto shrink-0" />}
          </button>
          <button
            type="button"
            aria-label={t('bulletin.closePinned')}
            onClick={onClose}
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
        {expanded && (
          <div className="flex flex-col gap-3 pb-4">
            <Suspense>
              {posts.map((post) => (
                <div key={post.id} className="rounded-md bg-card p-3">
                  <Markdown source={post.markdown} />
                </div>
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </section>
  )
}
