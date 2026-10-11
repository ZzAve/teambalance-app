import { useAuthMe } from '@shared/api/auth'
import {
  useCalendarLinks,
  useCreateCalendarLink,
  useDeleteCalendarLink,
  useUpdateCalendarLink,
} from '@shared/api/calendar-links'
import { useEventTypes } from '@shared/api/event-types'
import { useCopyToClipboard } from '@shared/lib/copy-to-clipboard'
import { CalendarLinksView } from './CalendarLinksView'

/**
 * Container for the member's calendar links: wires the list and event-type queries, the
 * create/edit/delete mutations and the clipboard write to CalendarLinksView. Pure wiring, covered by
 * e2e (ADR-0017).
 *
 * Event types are fetched with archived ones included: the View offers only active types for a new
 * link, but a link may already list an archived one, which its summary and its edit form still name.
 */
export function CalendarLinks() {
  const { data: links, isLoading, isError, refetch } = useCalendarLinks()
  const { data: eventTypes } = useEventTypes(true)
  const createLink = useCreateCalendarLink()
  const updateLink = useUpdateCalendarLink()
  const deleteLink = useDeleteCalendarLink()
  const clipboard = useCopyToClipboard()
  const teamName = useAuthMe().data?.activeTeam?.name ?? 'Your team'

  return (
    <CalendarLinksView
      teamName={teamName}
      links={links}
      eventTypes={eventTypes}
      isLoading={isLoading}
      isError={isError}
      isSaving={createLink.isPending || updateLink.isPending || deleteLink.isPending}
      actionError={createLink.isError || updateLink.isError || deleteLink.isError}
      updateError={updateLink.isError}
      copiedId={clipboard.copiedKey}
      copyFailedId={clipboard.failedKey}
      onGenerate={(request) => {
        updateLink.reset()
        deleteLink.reset()
        createLink.mutate(request, { onSuccess: clipboard.reset })
      }}
      onUpdate={(id, request, onSaved) => {
        createLink.reset()
        deleteLink.reset()
        updateLink.mutate({ id, request }, { onSuccess: onSaved })
      }}
      onEditOpenOrClose={() => updateLink.reset()}
      onDelete={(id) => {
        createLink.reset()
        updateLink.reset()
        deleteLink.mutate({ id }, { onSuccess: clipboard.reset })
      }}
      onCopy={(link) => link.url && clipboard.copy(link.url, link.id)}
      onRetry={() => refetch()}
    />
  )
}
