import { useState } from 'react'
import type { CalendarLink } from '@shared/api/calendar-links'
import { useCalendarLinks, useCreateCalendarLink, useDeleteCalendarLink } from '@shared/api/calendar-links'
import { CalendarLinksView } from './CalendarLinksView'

/**
 * Container for the member's calendar links: wires the list query, the create/delete mutations and
 * the clipboard write to CalendarLinksView. Pure wiring, covered by e2e (ADR-0017).
 */
export function CalendarLinks() {
  const { data: links, isLoading, isError, refetch } = useCalendarLinks()
  const createLink = useCreateCalendarLink()
  const deleteLink = useDeleteCalendarLink()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (link: CalendarLink) => {
    if (!link.url) return
    await navigator.clipboard.writeText(link.url)
    setCopiedId(link.id)
  }

  return (
    <CalendarLinksView
      links={links}
      isLoading={isLoading}
      isError={isError}
      isSaving={createLink.isPending || deleteLink.isPending}
      actionError={createLink.isError || deleteLink.isError}
      copiedId={copiedId}
      onGenerate={(label) => createLink.mutate({ label })}
      onDelete={(id) => deleteLink.mutate({ id })}
      onCopy={handleCopy}
      onRetry={() => refetch()}
    />
  )
}
