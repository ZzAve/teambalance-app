# ADR-0004: v1 value proposition is the at-a-glance overview; notifications deferred

- Status: Accepted
- Date: 2026-06-23

## Context

Attendance is the heart (ADR-0002), but the design doc never mentions notifications.
For an attendance app, the nudge loop ("respond to this event", "you haven't replied")
is what normally closes the loop. Without it, the question is sharp: if v1 has no
notifications, why would a teammate open a separate app instead of just replying in the
group chat they already live in?

## Decision

1. **Notifications (web/mobile push) are deferred — not in the first usable release.**
   They are acknowledged as needed; events are architected so push can hook in later.
   The existing group chat remains the nudge transport as a bridge in v1.

2. **v1's single compelling hook is the at-a-glance overview.** The thing the chat
   cannot do well: show *who's coming and whether the team is actually fielded* —
   attendees grouped by Role, live counts, and position gaps — instantly readable on a
   phone. v1 must be worth opening just to **look**, not only to respond.

## Consequences

- The **role-based attendee summary** is load-bearing v1 functionality, not decoration.
  "Done" for v1 is defined primarily by this view being clear and fast on mobile.
- v1 is honestly *not yet* a full replacement for the group chat; the chat still does
  the nudging. This is an accepted, explicit limitation.
- Open risk to validate with the owner's real teams: does the overview alone earn
  unprompted opens? If not, notifications move up the roadmap.
- Backend event model should leave a clean seam for a future notification/scheduling
  concept.
