/**
 * Fixture backend for the demo recording.
 *
 * Lets a demo run the **real SPA** against intercepted `/api/**` calls instead of a live backend —
 * needed when the recording box has no JDK 25 / Postgres, and worth having regardless because it
 * makes the take deterministic (fixed roster, fixed events, no seed drift between recordings).
 *
 * Shapes are the Wirespec-generated models verbatim (see app/src/shared/api/generated/model), so the
 * app's own mappers, guards and query cache do all the work they normally do — only the network is
 * faked. Keep them in step when the contract changes.
 *
 * Not shipped: nothing in app/ imports this.
 */

const iso = (daysFromNow, hour, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const TYPES = [
  { id: 'et-match', name: 'Match', color: '#225C9C' },
  { id: 'et-training', name: 'Training', color: '#249E6C' },
  { id: 'et-social', name: 'Social', color: '#F4B400' },
]

const summary = (attending, maybe, absent, notResponded, roleBreakdown = []) => ({
  attending,
  maybe,
  absent,
  notResponded,
  roleBreakdown,
})

/**
 * The backend-owned Roster verdict that rides on every event (contract: EventRoster). The client
 * never recomputes it — `features/filter-event-types/model/turnout.ts` only re-words the state into
 * one of four Turnout bands — so the fixture has to state it outright.
 *
 * The four events below deliberately land in four different bands: the Turnout chip group renders
 * only when the list spans two or more (ADR-0029 §5), and a demo of the filter popover that showed
 * the group collapsed would misrepresent the feature.
 */
const roster = (state, { totalTarget, totalAttending = 0, positions = [], unassignedAttending = 0, openSlots = 0 } = {}) => ({
  trackRoster: state !== 'OFF' && state !== 'TALLY_ONLY',
  totalTarget,
  totalAttending,
  positions,
  unassignedAttending,
  openSlots,
  state,
})

const EVENTS = [
  {
    id: 'evt-1',
    eventType: TYPES[0],
    title: 'League Match vs Smash United',
    description: undefined,
    startTime: iso(1, 14, 30),
    endTime: iso(1, 17, 0),
    location: 'Sportcentrum Noord',
    references: [],
    recurringGroup: undefined,
    attendanceSummary: summary(7, 1, 1, 3, [
      { role: 'Setter', attending: 2 },
      { role: 'Libero', attending: 1 },
      { role: 'Middle Blocker', attending: 2 },
    ]),
    roster: roster('CRITICAL', { totalTarget: 12, totalAttending: 7, openSlots: 5, positions: [
      { id: 'p1', label: 'Setter', required: 2, attending: 2 },
      { id: 'p2', label: 'Libero', required: 1, attending: 1 },
      { id: 'p3', label: 'Middle Blocker', required: 2, attending: 2 },
      { id: 'p4', label: 'Outside Hitter', required: 4, attending: 0 },
    ] }),
    myState: 'NOT_RESPONDED',
  },
  {
    id: 'evt-2',
    eventType: TYPES[1],
    title: 'Tuesday Training',
    description: undefined,
    startTime: iso(3, 20, 0),
    endTime: iso(3, 22, 0),
    location: 'Sporthal De Toekomst',
    references: [],
    recurringGroup: 'grp-training',
    attendanceSummary: summary(9, 2, 0, 1),
    roster: roster('SPOTS_OPEN', { totalTarget: 12, totalAttending: 9, openSlots: 3, unassignedAttending: 9 }),
    myState: 'ATTENDING',
  },
  {
    id: 'evt-3',
    eventType: TYPES[2],
    title: 'Season Drinks',
    description: undefined,
    startTime: iso(6, 21, 0),
    endTime: iso(6, 23, 30),
    location: 'Café De Zwaluw',
    references: [],
    recurringGroup: undefined,
    attendanceSummary: summary(5, 4, 2, 1),
    roster: roster('OFF', { totalAttending: 5 }),
    myState: 'MAYBE',
  },
  {
    id: 'evt-4',
    eventType: TYPES[1],
    title: 'Tuesday Training',
    description: undefined,
    startTime: iso(10, 20, 0),
    endTime: iso(10, 22, 0),
    location: 'Sporthal De Toekomst',
    references: [],
    recurringGroup: 'grp-training',
    attendanceSummary: summary(6, 1, 1, 4),
    roster: roster('HEADCOUNT_FULL', { totalTarget: 6, totalAttending: 6, unassignedAttending: 6 }),
    myState: 'NOT_RESPONDED',
  },
]

const ROSTER = [
  { userId: 'u-1', displayName: 'Julia Vermeer', role: 'ADMIN', position: { id: 'p1', label: 'Setter' }, onboarded: true },
  { userId: 'u-2', displayName: 'Sam de Vries', role: 'MEMBER', position: { id: 'p2', label: 'Libero' }, onboarded: true },
  { userId: 'u-3', displayName: 'Noor Bakker', role: 'MEMBER', position: { id: 'p3', label: 'Middle Blocker' }, onboarded: true },
  { userId: 'u-4', displayName: 'Tim Jansen', role: 'MEMBER', position: { id: 'p4', label: 'Outside Hitter' }, onboarded: true },
  { userId: 'u-5', displayName: 'Fleur Smit', role: 'MEMBER', position: { id: 'p1', label: 'Setter' }, onboarded: true },
  { userId: 'u-6', displayName: 'Daan Hofman', role: 'MEMBER', position: undefined, onboarded: true },
]

const TEAM = { id: 't-1', name: 'Heren 3', slug: 'heren-3' }

const ME = ROSTER[0]

const OTHERS_STATE = ['ATTENDING', 'ATTENDING', 'MAYBE', 'ATTENDING', 'ABSENT', 'NOT_RESPONDED']

// The hero, the detail page and now the list row all read attendance out of `attendances` (the list
// carries it since #326), not off the row's own counts — so the current user's entry has to mirror
// the row's `myState`, or the hero would claim "you're in" about an event the list shows unanswered.
const withAttendances = (event) => ({
  ...event,
  attendances: ROSTER.map((m, i) => ({
    id: `att-${event.id}-${m.userId}`,
    userId: m.userId,
    displayName: m.displayName,
    role: m.position?.label ?? 'MEMBER',
    state: m.userId === ME.userId ? event.myState : OTHERS_STATE[i],
  })),
})

/** Install the fixture on a Playwright page/context. Call before the first navigation. */
export async function installFixtureApi(page) {
  // Keep the service worker out of the recording entirely. Playwright's route interception does not
  // reach a page the SW controls, so the moment one takes over, every /api call sails past the
  // fixture and the app sits on the cold-start splash.
  //
  // Serving an empty sw.js is NOT enough, and the way it fails is nasty: the empty script still
  // *registers and activates*, so the first load (no controller yet) works, and only the second
  // navigation — the reload this demo is built around — comes up dead. Stop the registration from
  // happening at all. The promise is left pending rather than rejected: `registerAppServiceWorker()`
  // is fire-and-forget at bootstrap and never awaited before render, so nothing hangs on it and
  // there is no rejection to surface as an unhandled error mid-take.
  await page.addInitScript(() => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register = () => new Promise(() => {})
      navigator.serviceWorker.getRegistrations?.().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {})
    }
  })
  // Belt and braces: if a registration path is ever reached anyway, it gets an inert worker.
  await page.route(
    (url) => /\/(registerSW|sw)\.js$/.test(url.pathname),
    (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )

  // Matched on the pathname, not a `**/api/**` glob: under the dev server the app's own modules are
  // served from /src/shared/api/…, and a glob would intercept those too and hand the browser JSON
  // where it expected a module.
  await page.route(
    (url) => url.pathname === '/api' || url.pathname.startsWith('/api/'),
    async (route) => {
      const url = new URL(route.request().url())
      const path = url.pathname.replace(/\/$/, '')
      const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

      // A 200 with a body, not an empty 204: Playwright fulfilling a 204 surfaces in the page as
      // net::ERR_ABORTED, and the shell treats a failed probe as a backend that is still waking.
      if (path === '/api/ping' || path === '/api/health') return json({ status: 'ok' })

      if (path === '/api/auth/me')
        return json({
          id: 'u-1',
          email: 'julia@example.com',
          displayName: 'Julia Vermeer',
          role: 'ADMIN',
          // `teams` is an array and `activeTeam` a separate ref: the root guard gates on
          // `user.teams.length` and the /me query rejects outright unless `teams` is an array, so a
          // singular `team` here parks the whole app on the cold-start splash.
          teams: [TEAM],
          activeTeam: TEAM,
          isPlatformAdmin: false,
          actAs: undefined,
        })

      if (path === '/api/members/me') return json(ME)
      if (path === '/api/members') return json({ members: ROSTER })
      if (path === '/api/event-types') return json({ eventTypes: TYPES })
      if (path === '/api/positions')
        return json({ positions: [
          { id: 'p1', label: 'Setter' },
          { id: 'p2', label: 'Libero' },
          { id: 'p3', label: 'Middle Blocker' },
          { id: 'p4', label: 'Outside Hitter' },
        ] })
      if (path === '/api/events') return json({ events: EVENTS.map(withAttendances) })

      const detail = path.match(/^\/api\/events\/([^/]+)$/)
      if (detail) {
        const event = EVENTS.find((e) => e.id === detail[1]) ?? EVENTS[0]
        return json(withAttendances(event))
      }

      // Attendance writes: echo the new state back so the optimistic update settles cleanly.
      const attendance = path.match(/^\/api\/events\/([^/]+)\/attendances\/([^/]+)$/)
      if (attendance) {
        const body = route.request().postDataJSON?.() ?? {}
        const event = EVENTS.find((e) => e.id === attendance[1])
        if (event && body.state) event.myState = body.state
        return json({ id: `att-${attendance[1]}-${attendance[2]}`, userId: attendance[2], state: body.state ?? 'ATTENDING' })
      }

      return json({}, 200)
    },
  )
}
