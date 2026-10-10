// A member's personal webcal subscription to their team's events (ADR-0039). `url` is the whole point of the type: the token is never served on its own, because there is nothing a client can do with it except build this URL. It is nullable for one case only - a link whose token cannot be decrypted, which an encryption-key rotation leaves behind: the row is still listed, because it still counts toward the maximum of three and the member has to be able to delete it, but there is no URL left to show. `expired` is the server's own verdict on `expiresAt` - a client computing it from a skewed clock would tell the member a working link is dead, or the reverse. An expired link is still listed: it counts toward the per-member maximum of three, so it has to be visible to be deleted.
type CalendarLink {
    id: String,
    label: String?,
    createdAt: String,
    expiresAt: String,
    expired: Boolean,
    url: String?,
    attendanceStates: AttendanceState[],
    showAttendancePrefix: Boolean,
    calendarNameSuffix: String?,
    eventTypeIds: String[]?
}

type CalendarLinkList {
    links: CalendarLink[]
}

// The label is optional and free text (at most 50 characters) - how a member tells three otherwise identical URLs apart when deciding which one to delete. The options personalise the feed (ADR-0040): only events whose subscriber's own answer is in attendanceStates (non-empty; absent means all four), the answer prefix on titles (absent means on), and an optional calendar-name suffix of at most 30 characters (blank means none), and only events of the types in eventTypeIds (absent means every type, including ones created later; present means a non-empty list of event type ids, types created later excluded).
type CalendarLinkRequest {
    label: String?,
    attendanceStates: AttendanceState[]?,
    showAttendancePrefix: Boolean?,
    calendarNameSuffix: String?,
    eventTypeIds: String[]?
}

// The caller's own links in their Active Team, newest first. There is no admin view: a calendar link is a personal credential, and an admin who could list one would be reading a teammate's private feed. 403 covers both "no team" and "acting as this team" (ADR-0024 blocks this surface entirely).
endpoint ListCalendarLinks GET /api/calendar-links -> {
    200 -> CalendarLinkList
    401 -> Unit
    403 -> Unit
}

// Mints a link, once - nothing creates one implicitly, so a member's exposure is exactly what they asked for. 400 for an empty attendanceStates, an empty eventTypeIds, an event type id this team does not have, or a suffix over 30 characters. 409 once three exist (expired ones counted); the caller resolves it by deleting one.
endpoint CreateCalendarLink POST CalendarLinkRequest /api/calendar-links -> {
    201 -> CalendarLink
    400 -> Unit
    401 -> Unit
    403 -> Unit
    409 -> Unit
}

// Replaces a link's label and options in full, with the same body and defaults as create (ADR-0040). The token, the URL, createdAt and expiresAt stay as they were, and the link keeps its slot under the cap. 400 for an empty attendanceStates, an empty eventTypeIds, an event type id this team does not have, or a suffix over 30 characters. A link that is not the caller's is a 404, as for delete.
endpoint UpdateCalendarLink PUT CalendarLinkRequest /api/calendar-links/{id: String} -> {
    200 -> CalendarLink
    400 -> Unit
    401 -> Unit
    403 -> Unit
    404 -> Unit
}

// The only revocation there is: links do not renew and nobody else can delete yours. A link that is not the caller's is a 404, indistinguishable from one that never existed, so ids cannot be probed.
endpoint DeleteCalendarLink DELETE /api/calendar-links/{id: String} -> {
    204 -> Unit
    401 -> Unit
    403 -> Unit
    404 -> Unit
}
