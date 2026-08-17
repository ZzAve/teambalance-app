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

const ME = ROSTER[0]

const OTHERS_STATE = ['ATTENDING', 'ATTENDING', 'MAYBE', 'ATTENDING', 'ABSENT', 'NOT_RESPONDED']

// The hero and the detail page read the viewer's own response out of `attendances`, not off the
// list row — so the current user's entry has to mirror the row's `myState`, or the hero would claim
// "you're in" about an event the list shows as unanswered.
const detailOf = (event) => ({
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
  // Neutralise the service worker for the recording. Playwright's route interception does not reach
  // requests the *worker* makes, so once the SW is controlling the page its NetworkOnly /api handler
  // fetches straight past the fixture and every call fails. Serving an empty registerSW.js means no
  // worker ever takes control; the precached shell isn't what this demo is about.
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

      if (path === '/api/ping' || path === '/api/health') return route.fulfill({ status: 204, body: '' })

      if (path === '/api/auth/me')
        return json({
          id: 'u-1',
          email: 'julia@example.com',
          displayName: 'Julia Vermeer',
          role: 'ADMIN',
          team: { id: 't-1', name: 'Heren 3', slug: 'heren-3' },
          isPlatformAdmin: false,
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
      if (path === '/api/events') return json({ events: EVENTS })

      const detail = path.match(/^\/api\/events\/([^/]+)$/)
      if (detail) {
        const event = EVENTS.find((e) => e.id === detail[1]) ?? EVENTS[0]
        return json(detailOf(event))
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
