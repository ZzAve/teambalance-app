import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { BulletinPostView } from '@entities/bulletin/ui/BulletinPostView'
import { Button } from '@shared/ui/button'
import { Markdown } from '@shared/ui/Markdown'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/lib/utils'

export interface BoardPost {
  id: string
  markdown: string
  authorName: string
  postedAt: string
}

interface BulletinBoardViewProps {
  posts: BoardPost[]
  /** Admins get "New post"; for a Member an empty board renders nothing. */
  isAdmin: boolean
  isLoading?: boolean
  isError?: boolean
  /** Resolves when the Post is saved; the sheet closes then, and stays open with an error on a reject. */
  onCreate: (markdown: string) => Promise<unknown> | void
}

/** The Team's Bulletin Board at the top of the Team page (ADR-0048). Prop-only. */
export function BulletinBoardView({ posts, isAdmin, isLoading, isError, onCreate }: BulletinBoardViewProps) {
  const { t } = useTranslation()
  const [composing, setComposing] = useState(false)

  if (!isAdmin && !isLoading && !isError && posts.length === 0) return null

  return (
    <section aria-labelledby="bulletin-board-heading" className="flex flex-col gap-3">
      <div className="flex min-h-11 items-center justify-between gap-2">
        <h2 id="bulletin-board-heading" className="font-display text-title font-bold">{t('bulletin.heading')}</h2>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={() => setComposing(true)}>
            <Plus size={16} />
            {t('bulletin.newPost')}
          </Button>
        )}
      </div>

      {isLoading && <p className="text-small text-muted-foreground">{t('account.loading')}</p>}
      {isError && <p className="text-small text-red-ink">{t('bulletin.loadFailed')}</p>}
      {!isLoading && !isError && posts.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-small text-muted-foreground">
          {t('bulletin.emptyAdmin')}
        </p>
      )}
      {!isLoading && !isError && posts.map((post) => (
        <BulletinPostView key={post.id} markdown={post.markdown} authorName={post.authorName} postedAt={post.postedAt} />
      ))}

      {isAdmin && <ComposeSheet open={composing} onOpenChange={setComposing} onCreate={onCreate} />}
    </section>
  )
}

interface ComposeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (markdown: string) => Promise<unknown> | void
}

function ComposeSheet({ open, onOpenChange, onCreate }: ComposeSheetProps) {
  const { t } = useTranslation()
  const [markdown, setMarkdown] = useState('')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const submit = async () => {
    setSaving(true)
    setFailed(false)
    try {
      await onCreate(markdown)
      setMarkdown('')
      setPreview(false)
      onOpenChange(false)
    } catch {
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('bulletin.newPost')}</SheetTitle>
          <SheetDescription>{t('bulletin.composeHint')}</SheetDescription>
        </SheetHeader>
        <div role="tablist" className="mb-2 flex gap-1 self-start rounded-md bg-muted p-1 text-small">
          {([false, true] as const).map((isPreview) => (
            <button
              key={String(isPreview)}
              type="button"
              role="tab"
              aria-selected={preview === isPreview}
              onClick={() => setPreview(isPreview)}
              className={cn('min-h-9 rounded px-3', preview === isPreview && 'bg-card font-semibold shadow-sm')}
            >
              {isPreview ? t('bulletin.preview') : t('bulletin.write')}
            </button>
          ))}
        </div>
        {preview ? (
          <div className="min-h-40 rounded-md border border-border/60 p-3">
            <Markdown source={markdown} />
          </div>
        ) : (
          <textarea
            aria-label={t('bulletin.markdownLabel')}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={8}
            maxLength={5000}
            className="min-h-40 w-full rounded-md border border-border/60 bg-card p-3 font-mono text-small"
          />
        )}
        {failed && <p role="alert" className="mt-2 text-small text-red-ink">{t('bulletin.postFailed')}</p>}
        <Button className="mt-6" disabled={saving || markdown.trim() === ''} onClick={submit}>
          {t('bulletin.post')}
        </Button>
      </SheetContent>
    </Sheet>
  )
}
