# ADR-0047: Nevobo match feed: read once a day, findings computed when read

- Status: Accepted
- Date: 2026-11-11
- Relates to: [ADR-0006](0006-competition-cut-from-v1.md) (Competition cut from v1; this adds an optional,
  per-team integration as that ADR allows), [ADR-0016](0016-structured-event-references-over-rich-text.md)
  (References), [ADR-0043](0043-jooq-replaces-hibernate-tenant-schema-set-at-transaction-start.md) (tenant schema)

## Context

A volleyball team's matches are planned by Nevobo. When Nevobo moves a match, the team's event keeps the
old time or hall, and members respond for the wrong moment. Admins want to know when an event no longer
agrees with Nevobo, and which Nevobo matches have no event yet.

Nevobo publishes a programme feed per poule: `https://api.nevobo.nl/export/poule/{regio}/{poule}/programma.rss`.
It lists the upcoming matches of all teams in the poule. Each item has the start time, both team names, the
hall with its address, the match code (`EA`) and a permalink that redirects to the volleybal.nl match page
(`…/{poule}/wedstrijd/EA/1/1`).

## Decision

- **One feed per team, set by an admin**, with the team's name as the feed spells it, picked from the
  names in the feed. Only a URL of the form above is accepted: the server fetches it, so any other host or
  path is refused before a request is made. Redirects are not followed.
- **Stored in the tenant schema**: `match_feed` (one row: URL, team name, last check time, last check
  failed) and `match_feed_matches` (the matches the last successful check read).
- **Read once every 24 hours, only while the backend runs.** A scheduled job runs every hour and, per team,
  claims the check with one `UPDATE … WHERE last_checked_at < now - 24h`. Nothing wakes a stopped
  container; the first job after it starts catches up. Saving the feed reads it at once. A failed read keeps
  the stored matches and marks the check as failed.
- **Findings are computed when read**, not stored. A match is linked to an event by a Reference to its
  permalink or its volleybal.nl page (poule and code), else by the same local date and the opponent's name
  in the title. A linked event is compared on start time, location (must contain the hall name) and
  opponent (the title must name it). An upcoming match with no linked event is **missing**.
- **Admins see the findings** in the team settings and as a notice on the event page. The app changes an
  event only when an admin asks:
  - **Apply Nevobo values** gives a differing event the feed's start time (the event keeps its length), address
    and `Home - Away` title, for what differs, and a Reference to the match. It goes through the normal event
    edit. When the date moves, the admin can reset the responses in the same step.
  - **Create event** on a missing match opens the normal create form, filled in from the feed. The admin
    checks it and saves.

## Consequences

- Editing an event to agree with Nevobo clears its finding at once, because nothing is cached.
- A team in two poules (for example a cup) cannot have both feeds yet.
- Cancelled matches: the feed has a `nevobo:status`; it is read but not used yet.
- Matching by date and opponent depends on how admins write titles. A Reference to the match is exact.
