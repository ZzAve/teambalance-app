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
  { id: 'et-match', name: 'Match', color: '#225C9C', archived: false, rosterDefault: { trackRoster: true, totalTarget: 12, positionTargets: [] } },
  { id: 'et-training', name: 'Training', color: '#249E6C', archived: false, rosterDefault: { trackRoster: true, totalTarget: 8, positionTargets: [] } },
  { id: 'et-social', name: 'Social', color: '#F4B400', archived: false, rosterDefault: { trackRoster: false, totalTarget: undefined, positionTargets: [] } },
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
// `playingAttending` / `staffAttending` are DERIVED, never taken: the server splits `totalAttending`
// by the rows' kinds (#281) and the card's headcount fallback reads `playingAttending`, so a fixture
// that omits it renders a bare "going" with no number — which is what this helper used to do.
const roster = (state, { totalTarget, totalAttending = 0, positions = [], unassignedAttending = 0, openSlots = 0 } = {}) => {
  const rows = positions.map((p) => ({ kind: 'PLAYING', ...p }))
  const staff = rows.filter((p) => p.kind === 'STAFF').reduce((sum, p) => sum + p.attending, 0)
  return {
    trackRoster: state !== 'OFF' && state !== 'TALLY_ONLY',
    totalTarget,
    totalAttending,
    playingAttending: totalAttending - staff,
    staffAttending: staff,
    substituteAttending: 0,
    positions: rows,
    unassignedAttending,
    openSlots,
    state,
  }
}

const EVENTS = [
  {
    id: 'evt-1',
    eventType: TYPES[0],
    title: 'League Match vs Smash United',
    description: 'Warm-up starts 13:45 — bring both shirts, the home side wears blue this round.',
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
    // The one event in the LIST with a real lineup (the match is the hero, which draws no panel), so
    // this is the card the roster panel is demonstrated on. Its numbers are kept consistent with the
    // six members below and their OTHERS_STATE answers, because the panel now shows both views of
    // the same event: three attending (Julia, Sam, Tim), one each at Setter, Libero and Outside
    // Hitter. Middle Blocker carries no target and nobody attending, so the server would omit it —
    // and Noor, who holds it and answered Maybe, falls to Unassigned exactly as she would live.
    attendanceSummary: summary(3, 1, 1, 1, [
      { role: 'Setter', attending: 1 },
      { role: 'Libero', attending: 1 },
      { role: 'Outside Hitter', attending: 1 },
    ]),
    roster: roster('SPOTS_OPEN', { totalTarget: 6, totalAttending: 3, openSlots: 2, positions: [
      { id: 'p1', label: 'Setter', required: 2, attending: 1 },
      { id: 'p2', label: 'Libero', required: 1, attending: 1 },
      { id: 'p4', label: 'Outside Hitter', required: 2, attending: 1 },
    ] }),
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

// Served only with `include-past=true`, so the "Show past events" switch visibly adds a row. It
// shares the match's `CRITICAL` band so it survives a Turnout filter the event-filters take sets first.
const PAST_EVENTS = [
  {
    id: 'evt-0',
    eventType: TYPES[0],
    title: 'Cup Match vs Volley Stars',
    description: undefined,
    startTime: iso(-6, 19, 30),
    endTime: iso(-6, 21, 30),
    location: 'Sporthal Zuid',
    references: [],
    recurringGroup: undefined,
    attendanceSummary: summary(5, 0, 1, 0, [
      { role: 'Setter', attending: 2 },
      { role: 'Libero', attending: 1 },
    ]),
    roster: roster('CRITICAL', { totalTarget: 12, totalAttending: 5, openSlots: 7, positions: [
      { id: 'p1', label: 'Setter', required: 2, attending: 2 },
      { id: 'p2', label: 'Libero', required: 1, attending: 1 },
      { id: 'p3', label: 'Middle Blocker', required: 2, attending: 1 },
      { id: 'p4', label: 'Outside Hitter', required: 4, attending: 1 },
    ] }),
    myState: 'ATTENDING',
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

const POSITIONS = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
  { id: 'p3', label: 'Middle Blocker' },
  { id: 'p4', label: 'Outside Hitter' },
]

// An attending Substitute fills a spot like a Member (ADR-0033). The server recomputes the Event
// Roster on every write; the fixture does the same for the one thing a call-in changes, so a spot
// closes on screen. `base` is the roster as seeded, before any Substitute went in.
const refreshRoster = (event) => {
  const r = event.roster
  const base = (event.rosterBase ??= JSON.parse(JSON.stringify(r)))
  const going = (ON_EVENT[event.id] ?? []).filter((s) => s.state === 'ATTENDING')
  r.positions = base.positions.map((p) => ({ ...p, attending: p.attending + going.filter((s) => s.position?.id === p.id).length }))
  r.substituteAttending = going.length
  r.totalAttending = base.totalAttending + going.length
  r.playingAttending = base.playingAttending + going.length
  r.openSlots = r.positions.reduce((n, p) => n + Math.max(0, p.required - p.attending), 0)
  if (base.positions.length)
    r.state = r.openSlots === 0 ? 'LINEUP_SET' : r.positions.some((p) => p.required > 0 && p.attending === 0) ? 'CRITICAL' : 'SPOTS_OPEN'
}

// The Team's Substitute list (ADR-0033): people without an account who can be called in. Mila is
// already on the training as Asked, so the Substitutes block has a row; Kees plays Setter, so the
// picker opened from the Setter's open spot lists him first.
const SUBSTITUTES = [
  { id: 's-1', name: 'Mila Jansen', position: undefined },
  { id: 's-2', name: 'Kees Bakker', position: { id: 'p1', label: 'Setter' } },
]

// Per event: who is called in, with their state. Keyed by event id; the rest have nobody.
const ON_EVENT = {
  'evt-2': [{ substituteId: 's-1', name: 'Mila Jansen', position: undefined, state: 'MAYBE', changedBy: 'u-2', updatedAt: iso(0, 9) }],
}

// The member's Calendar links (ADR-0039/0040), created during the take: the page starts empty so the
// demo shows the first link being made. A URL under the real API host, so the row reads as it would
// live; nothing in the recording fetches it.
const LINKS = []
const calendarLink = (id, body, createdAt) => ({
  id,
  label: body.label ?? undefined,
  createdAt,
  expiresAt: new Date(new Date(createdAt).getTime() + 365 * 864e5).toISOString(),
  expired: false,
  url: `https://api.teambalance.nl/api/calendar/${TEAM.slug}/${id.replace(/-/g, '')}k8f2q9z1m4c7v3b6n0x5.ics`,
  attendanceStates: body.attendanceStates ?? ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'],
  showAttendancePrefix: body.showAttendancePrefix ?? true,
  calendarNameSuffix: body.calendarNameSuffix ?? undefined,
  eventTypeIds: body.eventTypeIds ?? undefined,
})

const ME = ROSTER[0]

// Photos (ADR-0038) travel as image bytes outside the Wirespec client. The take starts with no photo
// anywhere; an upload stores the bytes here and bumps the version the JSON payloads carry, so the
// `<img>` reads it back through the same route as the real API.
const PHOTOS = { personal: undefined, team: {} }
const photoVersion = (photo) => photo?.version
const withPhoto = (member) => ({ ...member, photoVersion: photoVersion(PHOTOS.team[member.userId]) })
const storePhoto = (route) => ({
  version: String(Date.now()),
  bytes: route.request().postDataBuffer(),
  type: route.request().headers()['content-type'] ?? 'image/jpeg',
})

const OTHERS_STATE = ['ATTENDING', 'ATTENDING', 'MAYBE', 'ATTENDING', 'ABSENT', 'NOT_RESPONDED']

// The hero, the detail page and now the list row all read attendance out of `attendances` (the list
// carries it since #326), not off the row's own counts — so the current user's entry has to mirror
// the row's `myState`, or the hero would claim "you're in" about an event the list shows unanswered.
const withAttendances = (event) => ({
  ...event,
  // Contract fields the fixture does not vary: no Substitutes called in (ADR-0033), no per-event
  // roster override — but both must be present, or the generated guard rejects the payload.
  substitutes: [],
  rosterOverride: undefined,
  attendances: ROSTER.map((m, i) => ({
    id: `att-${event.id}-${m.userId}`,
    userId: m.userId,
    displayName: m.displayName,
    // `Unassigned`, not `MEMBER`: it is what the server sends for a member with no position, and
    // AttendeeList suppresses exactly that word as a row subtitle. `MEMBER` printed it.
    role: m.position?.label ?? 'Unassigned',
    state: m.userId === ME.userId ? event.myState : OTHERS_STATE[i],
  })),
  substitutes: ON_EVENT[event.id] ?? [],
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
      if (path === '/api/ping') return json({ status: 'ok' })

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
          personalPhotoVersion: photoVersion(PHOTOS.personal),
        })

      const method = route.request().method()
      const image = (photo) => (photo ? route.fulfill({ status: 200, contentType: photo.type, body: photo.bytes }) : json({}, 404))
      if (path === '/api/account/photo') {
        if (method === 'PUT') PHOTOS.personal = storePhoto(route)
        else if (method === 'DELETE') PHOTOS.personal = undefined
        else return image(PHOTOS.personal)
        return route.fulfill({ status: 204 })
      }
      if (path === '/api/members/me/photo/from-personal') {
        if (!PHOTOS.personal) return json({}, 404)
        PHOTOS.team[ME.userId] = { ...PHOTOS.personal, version: String(Date.now()) }
        return route.fulfill({ status: 204 })
      }
      const memberPhoto = path.match(/^\/api\/members\/([^/]+)\/photo$/)
      if (memberPhoto) {
        const userId = memberPhoto[1] === 'me' ? ME.userId : memberPhoto[1]
        if (method === 'PUT') PHOTOS.team[userId] = storePhoto(route)
        else if (method === 'DELETE') delete PHOTOS.team[userId]
        else return image(PHOTOS.team[userId])
        return route.fulfill({ status: 204 })
      }

      if (path === '/api/members/me') return json(withPhoto(ME))
      if (path === '/api/members') return json({ members: ROSTER.map(withPhoto) })
      if (path === '/api/event-types') return json({ eventTypes: TYPES })
      if (path === '/api/positions') return json({ positions: POSITIONS })
      if (path === '/api/events') {
        const includePast = url.searchParams.get('include-past') === 'true'
        return json({ events: [...(includePast ? PAST_EVENTS : []), ...EVENTS].map(withAttendances) })
      }
      if (path === '/api/substitutes' && route.request().method() === 'POST') {
        const body = route.request().postDataJSON?.() ?? {}
        const position = POSITIONS.find((p) => p.id === body.positionId)
        const sub = { id: `s-${SUBSTITUTES.length + 1}`, name: body.name ?? 'Substitute', position }
        SUBSTITUTES.push(sub)
        return json(sub, 201)
      }
      if (path === '/api/substitutes') return json({ substitutes: SUBSTITUTES })
      const subById = path.match(/^\/api\/substitutes\/([^/]+)(\/usage)?$/)
      if (subById) {
        const index = SUBSTITUTES.findIndex((s) => s.id === subById[1])
        if (subById[2]) return json({ eventCount: Object.values(ON_EVENT).filter((l) => l.some((s) => s.substituteId === subById[1])).length })
        if (route.request().method() === 'DELETE') {
          if (index >= 0) SUBSTITUTES.splice(index, 1)
          return route.fulfill({ status: 204 })
        }
        if (route.request().method() === 'PUT' && index >= 0) {
          const body = route.request().postDataJSON?.() ?? {}
          SUBSTITUTES[index] = { ...SUBSTITUTES[index], name: body.name, position: POSITIONS.find((p) => p.id === body.positionId), shirtNumber: body.shirtNumber }
          return json(SUBSTITUTES[index])
        }
        return json({}, 404)
      }

      // A Substitute's state on an event: record it so a re-read of the event shows it, and echo
      // the entry back as the server would.
      const subAttendance = path.match(/^\/api\/events\/([^/]+)\/substitutes\/([^/]+)$/)
      if (subAttendance) {
        const [, eventId, substituteId] = subAttendance
        const onEvent = (ON_EVENT[eventId] ??= [])
        const existing = onEvent.findIndex((s) => s.substituteId === substituteId)
        if (route.request().method() === 'DELETE') {
          if (existing >= 0) onEvent.splice(existing, 1)
          refreshRoster(EVENTS.find((e) => e.id === eventId))
          // The contract declares 204 only; a 200 would fail the generated client's status check.
          return route.fulfill({ status: 204 })
        }
        const sub = SUBSTITUTES.find((s) => s.id === substituteId) ?? { name: 'Substitute', position: undefined }
        const body = route.request().postDataJSON?.() ?? {}
        const entry = { substituteId, name: sub.name, position: sub.position, state: body.state ?? 'MAYBE', changedBy: ME.userId, updatedAt: new Date().toISOString() }
        if (existing >= 0) onEvent[existing] = entry
        else onEvent.push(entry)
        refreshRoster(EVENTS.find((e) => e.id === eventId))
        return json(entry)
      }
      if (path === '/api/team/season') return json({ start: undefined, end: undefined })
      if (path.startsWith('/api/invitations')) return json({ token: 'abc123', expiresAt: new Date(Date.now()+864e5*7).toISOString() })

      if (path === '/api/calendar-links') {
        if (route.request().method() === 'POST') {
          const link = calendarLink(`cl-${LINKS.length + 1}`, route.request().postDataJSON?.() ?? {}, new Date().toISOString())
          LINKS.unshift(link)
          return json(link, 201)
        }
        return json({ links: LINKS })
      }
      const linkById = path.match(/^\/api\/calendar-links\/([^/]+)$/)
      if (linkById) {
        const index = LINKS.findIndex((l) => l.id === linkById[1])
        if (route.request().method() === 'DELETE') {
          if (index >= 0) LINKS.splice(index, 1)
          return route.fulfill({ status: 204 })
        }
        if (route.request().method() === 'PUT' && index >= 0) {
          LINKS[index] = calendarLink(LINKS[index].id, route.request().postDataJSON?.() ?? {}, LINKS[index].createdAt)
          return json(LINKS[index])
        }
        return json({}, 404)
      }

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
