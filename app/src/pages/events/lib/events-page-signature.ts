import type { ComponentProps } from 'react'
import type { EventListView } from '@entities/event/ui/EventListView'

/**
 * What the events page shows, as one string: the hero's event and the listed events in order.
 * A change of it is a card entering, leaving or moving; changes inside an event leave it alone.
 * Null while the list is a skeleton or an error, which no animation starts from or goes to.
 */
export function eventsPageSignature({
  heroEventId,
  list,
}: {
  heroEventId?: string
  list: Pick<ComponentProps<typeof EventListView>, 'events' | 'isLoading' | 'error'>
}): string | null {
  if (list.events.length === 0 && (list.isLoading || list.error)) return null
  return `${heroEventId ?? ''}|${list.events.map((e) => e.id).join(',')}`
}
