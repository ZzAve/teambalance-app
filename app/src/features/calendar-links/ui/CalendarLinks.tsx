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
  const [copyFailedId, setCopyFailedId] = useState<string | null>(null)

  const clearCopyFeedback = () => {
    setCopiedId(null)
    setCopyFailedId(null)
  }

  const handleCopy = async (link: CalendarLink) => {
    if (!link.url) return
    try {
      await navigator.clipboard.writeText(link.url)
      setCopiedId(link.id)
      setCopyFailedId(null)
    } catch {
      // Refused (permission denied, insecure context, some in-app browsers): the View shows the URL instead.
      setCopiedId(null)
      setCopyFailedId(link.id)
    }
  }

  return (
    <CalendarLinksView
      links={links}
      isLoading={isLoading}
      isError={isError}
      isSaving={createLink.isPending || deleteLink.isPending}
      actionError={createLink.isError || deleteLink.isError}
      copiedId={copiedId}
      copyFailedId={copyFailedId}
      onGenerate={(label) => {
        deleteLink.reset()
        createLink.mutate({ label }, { onSuccess: clearCopyFeedback })
      }}
      onDelete={(id) => {
        createLink.reset()
        deleteLink.mutate({ id }, { onSuccess: clearCopyFeedback })
      }}
      onCopy={handleCopy}
      onRetry={() => refetch()}
    />
  )
}
