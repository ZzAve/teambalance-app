import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CalendarLink, CalendarLinkRequest } from '@shared/api/calendar-links'
import type { EventTypeItem } from '@shared/api/event-types'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { FormError } from '@shared/ui/FormError'
import { QueryErrorState } from '@shared/ui/QueryErrorState'
import { formatDate, linkDisplayLabel, toGoogleCalendarUrl, toWebcalUrl } from '../lib/calendar-urls'
import { optionsSummary } from '../model/options-summary'
import { optionsOf } from '../model/preset'
import { CalendarLinkForm } from './CalendarLinkForm'

/** The server's per-member cap, expired links included (ADR-0039). */
const MAX_LINKS = 3

interface CalendarLinksViewProps {
  /** The Active Team's name, which a link's calendar is named after. */
  teamName: string
  /** The member's links in this team, newest first, as the server returned them. */
  links?: CalendarLink[]
  /** The team's event types, archived ones included: a link may still list one. */
  eventTypes?: EventTypeItem[]
  isLoading?: boolean
  isError?: boolean
  /** A create, edit or delete is in flight. */
  isSaving?: boolean
  /** The last create, edit or delete failed. */
  actionError?: boolean
  /** The last edit failed. Shown in the row being edited. */
  updateError?: boolean
  /** The link whose URL was just copied, so its button can say so. */
  copiedId?: string | null
  /** The link whose clipboard write the browser refused, so its URL can be copied by hand. */
  copyFailedId?: string | null
  onGenerate: (request: CalendarLinkRequest) => void
  /** `onSaved` is called once the edit is stored; until then the row stays open with its edits. */
  onUpdate: (id: string, request: CalendarLinkRequest, onSaved: () => void) => void
  /** A row's edit opened or was cancelled, so an earlier edit's error no longer applies. */
  onEditOpenOrClose: () => void
  onDelete: (id: string) => void
  onCopy: (link: CalendarLink) => void
  onRetry: () => void
}

/**
 * The member's calendar links for this team: a short explainer, the list with its per-link actions
 * and in-place edit, and the generate form. Prop-only; the queries, the mutations, the clipboard
 * write and the copied flag live in the CalendarLinks container (ADR-0017). Owns only the create
 * form's reset key, which row is being edited, and the delete-confirm target.
 */
export function CalendarLinksView({
  teamName,
  links = [],
  eventTypes = [],
  isLoading,
  isError,
  isSaving,
  actionError,
  updateError,
  copiedId,
  copyFailedId,
  onGenerate,
  onUpdate,
  onEditOpenOrClose,
  onDelete,
  onCopy,
  onRetry,
}: CalendarLinksViewProps) {
  const { t } = useTranslation()
  // A new link is offered the active types only; archived ones exist to keep naming what a link lists.
  const activeTypes = eventTypes.filter((type) => !type.archived)
  const [editingId, setEditingId] = useState<string | null>(null)
  // Bumped on every submit, so the create form starts over at Me.
  const [createFormKey, setCreateFormKey] = useState(0)
  const [confirmTarget, setConfirmTarget] = useState<CalendarLink | null>(null)
  const atCap = links.length >= MAX_LINKS

  return (
    <div className="flex flex-col gap-6">
      <p className="text-small text-muted-foreground">
        {t('calendarLinks.intro')}
      </p>

      {isLoading && <p className="text-small text-muted-foreground">{t('calendarLinks.loading')}</p>}
      {isError && (
        <QueryErrorState
          title={t('calendarLinks.loadFailed')}
          description={t('calendarLinks.loadFailedHint')}
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && (
        <>
          {links.length === 0 ? (
            <p className="text-small text-muted-foreground">{t('calendarLinks.empty')}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {links.map((link) => (
                <CalendarLinkRow
                  key={link.id}
                  link={link}
                  teamName={teamName}
                  copied={copiedId === link.id}
                  copyFailed={copyFailedId === link.id}
                  eventTypes={eventTypes}
                  editing={editingId === link.id}
                  isSaving={isSaving}
                  updateError={updateError}
                  onCopy={onCopy}
                  onEdit={() => {
                    onEditOpenOrClose()
                    setEditingId(link.id)
                  }}
                  onCancelEdit={() => {
                    onEditOpenOrClose()
                    setEditingId(null)
                  }}
                  onUpdate={(request) =>
                    // Closes only this row: another may have been opened while the save was in flight.
                    onUpdate(link.id, request, () => setEditingId((open) => (open === link.id ? null : open)))
                  }
                  onRequestDelete={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-4">
            <CalendarLinkForm
              key={createFormKey}
              teamName={teamName}
              eventTypes={activeTypes}
              disabled={atCap}
              isSaving={isSaving}
              submitLabel={t('calendarLinks.generate')}
              onSubmit={(request) => {
                onGenerate(request)
                setCreateFormKey((key) => key + 1)
              }}
            />
            {atCap && (
              <p className="text-small text-muted-foreground">
                {t('calendarLinks.atCap', { max: MAX_LINKS })}
              </p>
            )}
            {/* While a row is being edited the error belongs to that row, next to the edits. */}
            {actionError && editingId === null && <FormError>{t('calendarLinks.actionFailed')}</FormError>}
          </div>

          <ConfirmDialog
            open={confirmTarget !== null}
            title={t('calendarLinks.deleteTitle')}
            description={t('calendarLinks.deleteDescription')}
            confirmLabel={t('calendarLinks.deleteConfirm')}
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
  teamName: string
  eventTypes: EventTypeItem[]
  editing: boolean
  copied: boolean
  copyFailed: boolean
  isSaving?: boolean
  updateError?: boolean
  onCopy: (link: CalendarLink) => void
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (request: CalendarLinkRequest) => void
  onRequestDelete: (link: CalendarLink) => void
}

function CalendarLinkRow({
  link,
  teamName,
  eventTypes,
  editing,
  copied,
  copyFailed,
  isSaving,
  updateError,
  onCopy,
  onEdit,
  onCancelEdit,
  onUpdate,
  onRequestDelete,
}: CalendarLinkRowProps) {
  const { t } = useTranslation()
  const name = linkDisplayLabel(link)
  const options = optionsOf(link)
  const summary = optionsSummary(options, teamName, eventTypes)
  // The active types, plus the archived ones this link already lists so an edit can keep them.
  const pickable = eventTypes.filter((type) => !type.archived || link.eventTypeIds?.includes(type.id))

  return (
    <li aria-label={name} className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate font-medium" title={name}>
          {name}
        </span>
        {link.expired && (
          <span className="shrink-0 rounded-full bg-red/10 px-2 py-0.5 text-caption font-semibold text-red-ink">
            {t('calendarLinks.expired')}
          </span>
        )}
      </div>
      <p className="text-small text-muted-foreground">
        {t(link.expired ? 'calendarLinks.expiredOn' : 'calendarLinks.expiresOn', { date: formatDate(link.expiresAt) })}
      </p>
      {editing ? (
        <>
          <CalendarLinkForm
            initial={{ label: link.label ?? undefined, ...options }}
            teamName={teamName}
            eventTypes={pickable}
            isSaving={isSaving}
            submitLabel={t('calendarLinks.save')}
            onSubmit={onUpdate}
            onCancel={onCancelEdit}
          />
          {updateError && <FormError>{t('calendarLinks.actionFailed')}</FormError>}
        </>
      ) : (
        <>
          {summary && <p className="text-small text-muted-foreground">{summary}</p>}
          <div className="flex flex-wrap gap-2">
            {link.url ? (
              <>
                <Button asChild size="sm" variant="outline">
                  <a href={toWebcalUrl(link.url)}>{t('calendarLinks.openInCalendar')}</a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={toGoogleCalendarUrl(link.url)} target="_blank" rel="noopener noreferrer">
                    {t('calendarLinks.addToGoogle')}
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => onCopy(link)}>
                  {copied ? t('calendarLinks.copied') : t('calendarLinks.copyLink')}
                </Button>
              </>
            ) : (
              // A key rotation leaves a link whose token cannot be decrypted: it still counts toward the
              // cap, so it stays listed to be deleted, but there is no URL to offer.
              <p className="text-small text-muted-foreground">{t('calendarLinks.unavailable')}</p>
            )}
            {!link.expired && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                {t('calendarLinks.edit')}
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-red-ink hover:bg-red/5 hover:text-red-ink" disabled={isSaving} onClick={() => onRequestDelete(link)}>
              {t('calendarLinks.delete')}
            </Button>
          </div>
        </>
      )}
      {copyFailed && link.url && (
        <div className="flex flex-col gap-2">
          <FormError>{t('calendarLinks.copyFailed')}</FormError>
          <Input
            readOnly
            aria-label={t('calendarLinks.urlLabel', { name })}
            value={link.url}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </li>
  )
}
