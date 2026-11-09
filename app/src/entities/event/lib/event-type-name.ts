import { i18n } from '@shared/i18n/i18n'

// The three types seeded into every tenant by V002__seed_event_types.sql: fixed uuid -> seeded English name.
const SEEDED_DEFAULTS: Record<string, { name: string; key: 'eventType.defaults.training' | 'eventType.defaults.match' | 'eventType.defaults.other' }> = {
  'c0000000-0000-0000-0000-000000000001': { name: 'Training', key: 'eventType.defaults.training' },
  'c0000000-0000-0000-0000-000000000002': { name: 'Match', key: 'eventType.defaults.match' },
  'c0000000-0000-0000-0000-000000000003': { name: 'Other', key: 'eventType.defaults.other' },
}

/**
 * The name to show for an event type. The database stores the seeded defaults in English, so a seeded
 * type that still carries its seeded name is translated; a renamed type (or any other type) shows the
 * name the team gave it.
 */
export function eventTypeName(type: { id: string; name: string }, lng: string = i18n.language): string {
  const seeded = SEEDED_DEFAULTS[type.id]
  return seeded && seeded.name === type.name ? i18n.t(seeded.key, { lng }) : type.name
}
