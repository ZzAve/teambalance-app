// Every TanStack Query key the app uses, so a query and the mutations that invalidate it cannot drift.
// Invalidation matches by prefix: `all` refreshes every query under the entity.
export const queryKeys = {
  events: {
    all: ['events'],
    list: (includePast: boolean) => ['events', { includePast }],
    detail: (id: string) => ['events', id],
  },
  eventTypes: {
    all: ['event-types'],
    list: (includeArchived: boolean) => ['event-types', { includeArchived }],
  },
  positions: {
    all: ['positions'],
    usage: (id: string | null) => ['positions', id, 'usage'],
  },
  substitutes: {
    all: ['substitutes'],
    usage: (id: string | null) => ['substitutes', id, 'usage'],
  },
  members: {
    all: ['members'],
    me: ['members', 'me'],
  },
  calendarLinks: ['calendar-links'],
  activeInvitation: ['invitations', 'active'],
  // The admin handover link is its own credential: its own key keeps it from invalidating the shareable link (ADR-0024 §5).
  activeAdminInvitation: ['invitations', 'admin', 'active'],
  creationCodes: ['creation-codes'],
  platformTeams: ['platform', 'teams'],
  actAsRecords: ['act-as-records'],
  season: ['season'],
  authMe: ['auth', 'me'],
} as const
