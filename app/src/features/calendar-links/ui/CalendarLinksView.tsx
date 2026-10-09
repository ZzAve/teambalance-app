import { useState } from 'react'
import type { CalendarLink } from '@shared/api/calendar-links'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { FormError } from '@shared/ui/FormError'
import { QueryErrorState } from '@shared/ui/QueryErrorState'
import { formatDate, linkDisplayLabel, toGoogleCalendarUrl, toWebcalUrl } from '../lib/calendar-urls'

/** The server's per-member cap, expired links included (ADR-0039). */
const MAX_LINKS = 3
/** The server's label limit. */
const MAX_LABEL_LENGTH = 50

interface CalendarLinksViewProps {
  /** The member's links in this team, newest first, as the server returned them. */
  links?: CalendarLink[]
  isLoading?: boolean
  isError?: boolean
  /** A create or delete is in flight. */
  isSaving?: boolean
  /** The last create or delete failed. */
  actionError?: boolean
  /** The link whose URL was just copied, so its button can say so. */
  copiedId?: string | null
  /** The link whose clipboard write the browser refused, so its URL can be copied by hand. */
  copyFailedId?: string | null
  onGenerate: (label: string | undefined) => void
  onDelete: (id: string) => void
  onCopy: (link: CalendarLink) => void
  onRetry: () => void
}

/**
 * The member's calendar links for this team: a short explainer, the list with its per-link actions,
 * and the generate form. Prop-only; the query, the mutations, the clipboard write and the copied
 * flag live in the CalendarLinks container (ADR-0017). Owns only the label field and the
 * delete-confirm target.
 */
export function CalendarLinksView({
  links = [],
  isLoading,
  isError,
  isSaving,
  actionError,
  copiedId,
  copyFailedId,
  onGenerate,
  onDelete,
  onCopy,
  onRetry,
}: CalendarLinksViewProps) {
  const [label, setLabel] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<CalendarLink | null>(null)
  const atCap = links.length >= MAX_LINKS

  return (
    <div className="flex flex-col gap-6">
      <p className="text-small text-muted-foreground">
        Subscribe to your team's events once and your phone's calendar stays in sync. Changes can take
        up to a day to appear on Google Calendar.
      </p>

      {isLoading && <p className="text-small text-muted-foreground">Loading…</p>}
      {isError && (
        <QueryErrorState
          title="Couldn't load your calendar links"
          description="Check your connection and try again."
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && (
        <>
          {links.length === 0 ? (
            <p className="text-small text-muted-foreground">No calendar links yet.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {links.map((link) => (
                <CalendarLinkRow
                  key={link.id}
                  link={link}
                  copied={copiedId === link.id}
                  copyFailed={copyFailedId === link.id}
                  isSaving={isSaving}
                  onCopy={onCopy}
                  onRequestDelete={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              onGenerate(label.trim() || undefined)
              setLabel('')
            }}
          >
            <Label htmlFor="calendar-link-label">Label (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="calendar-link-label"
                value={label}
                maxLength={MAX_LABEL_LENGTH}
                placeholder="e.g. My phone"
                disabled={atCap}
                onChange={(e) => setLabel(e.target.value)}
              />
              <Button type="submit" disabled={atCap || isSaving}>
                Generate link
              </Button>
            </div>
            {atCap && (
              <p className="text-small text-muted-foreground">
                You have {MAX_LINKS} links, the maximum. Delete one to generate a new link.
              </p>
            )}
            {actionError && <FormError>Something went wrong. Please try again.</FormError>}
          </form>

          <ConfirmDialog
            open={confirmTarget !== null}
            title="Delete calendar link?"
            description="Every calendar subscribed with this link stops updating."
            confirmLabel="Delete link"
            onConfirm={() => {
              if (confirmTarget) onDelete(confirmTarget.id)
              setConfirmTarget(null)
            }}
            onCancel={() => setConfirmTarget(null)}
          />
        </>
      )}
    </div>
  )
}

interface CalendarLinkRowProps {
  link: CalendarLink
  copied: boolean
  copyFailed: boolean
  isSaving?: boolean
  onCopy: (link: CalendarLink) => void
  onRequestDelete: (link: CalendarLink) => void
}

function CalendarLinkRow({ link, copied, copyFailed, isSaving, onCopy, onRequestDelete }: CalendarLinkRowProps) {
  const name = linkDisplayLabel(link)

  return (
    <li aria-label={name} className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate font-medium" title={name}>
          {name}
        </span>
        {link.expired && (
          <span className="shrink-0 rounded-full bg-red/10 px-2 py-0.5 text-caption font-semibold text-red">
            Expired
          </span>
        )}
      </div>
      <p className="text-small text-muted-foreground">
        {link.expired ? 'Expired' : 'Expires'} {formatDate(link.expiresAt)}
      </p>
      <div className="flex flex-wrap gap-2">
        {link.url ? (
          <>
            <Button asChild size="sm" variant="outline">
              <a href={toWebcalUrl(link.url)}>Open in Calendar</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={toGoogleCalendarUrl(link.url)} target="_blank" rel="noopener noreferrer">
                Add to Google Calendar
              </a>
            </Button>
            <Button size="sm" variant="outline" onClick={() => onCopy(link)}>
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
          </>
        ) : (
          // A key rotation leaves a link whose token cannot be decrypted: it still counts toward the
          // cap, so it stays listed to be deleted, but there is no URL to offer.
          <p className="text-small text-muted-foreground">This link can no longer be shown.</p>
        )}
        <Button size="sm" variant="ghost" className="text-red" disabled={isSaving} onClick={() => onRequestDelete(link)}>
          Delete
        </Button>
      </div>
      {copyFailed && link.url && (
        <div className="flex flex-col gap-2">
          <FormError>Couldn't copy automatically. Copy the link below.</FormError>
          <Input
            readOnly
            aria-label={`Calendar link URL for ${name}`}
            value={link.url}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </li>
  )
}
