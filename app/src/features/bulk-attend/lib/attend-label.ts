import type { Event } from '@shared/api/events'

/**
 * The event-type name shared by every event in [events], or null when they span more than one type
 * (or there are none).
 *
 * Derived from the events the tap would actually fill, not from the active filter pills: a pill can
 * be on while contributing nothing eligible, and the label should describe what will happen rather
 * than what is merely on screen.
 */
export function sharedTypeName(events: Event[]): string | null {
  if (events.length === 0) return null
  const [first] = events
  return events.every((event) => event.eventType.id === first.eventType.id) ? first.eventType.name : null
}

/**
 * Naive English plural, deliberately so: event-type names are admin-configurable free text, so there
 * is no dictionary to consult. Covers the endings that actually occur in a team calendar
 * ("Match" -> "matches", "Training" -> "trainings"); an exotic name may pluralize awkwardly, which
 * is a cosmetic miss on a label, not a correctness problem.
 */
function pluralize(noun: string): string {
  const lower = noun.toLowerCase()
  if (/(s|x|z|ch|sh)$/.test(lower)) return `${lower}es`
  if (/[^aeiou]y$/.test(lower)) return `${lower.slice(0, -1)}ies`
  return `${lower}s`
}

/**
 * The "Attend N" button label, named by type when the batch is all one kind.
 *
 * The count alone is the pre-tap confirmation (ADR-0020) but not the whole story: with every filter
 * pill on, the batch spans types, and "Attend 6" gave no hint that a match was in there next to the
 * trainings. Naming the type when there is exactly one makes the scope legible before the tap, and
 * falls back to the neutral "events" the moment the batch is mixed — never claiming a narrower
 * scope than the action really has.
 */
export function attendLabel(count: number, typeName: string | null): string {
  const noun = typeName === null
    ? (count === 1 ? 'event' : 'events')
    : (count === 1 ? typeName.toLowerCase() : pluralize(typeName))
  return `Attend ${count} ${noun}`
}
