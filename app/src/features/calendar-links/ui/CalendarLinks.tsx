import { useCalendarLinks, useCreateCalendarLink, useDeleteCalendarLink } from '@entities/calendar-link/api/calendar-links'
import { useCopyToClipboard } from '@shared/lib/copy-to-clipboard'
import { CalendarLinksView } from './CalendarLinksView'

/**
 * Container for the member's calendar links: wires the list query, the create/delete mutations and
 * the clipboard write to CalendarLinksView. Pure wiring, covered by e2e (ADR-0017).
 */
export function CalendarLinks() {
  const { data: links, isLoading, isError, refetch } = useCalendarLinks()
  const createLink = useCreateCalendarLink()
  const deleteLink = useDeleteCalendarLink()
  const clipboard = useCopyToClipboard()

  return (
    <CalendarLinksView
      links={links}
      isLoading={isLoading}
      isError={isError}
      isSaving={createLink.isPending || deleteLink.isPending}
      actionError={createLink.isError || deleteLink.isError}
      copiedId={clipboard.copiedKey}
      copyFailedId={clipboard.failedKey}
      onGenerate={(label) => {
        deleteLink.reset()
        createLink.mutate({ label }, { onSuccess: clipboard.reset })
      }}
      onDelete={(id) => {
        createLink.reset()
        deleteLink.mutate({ id }, { onSuccess: clipboard.reset })
      }}
      onCopy={(link) => link.url && clipboard.copy(link.url, link.id)}
      onRetry={() => refetch()}
    />
  )
}
