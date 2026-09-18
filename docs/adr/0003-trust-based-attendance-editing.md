# ADR-0003: Trust-based attendance editing — convenience now, tighten later

- Status: Accepted
- Date: 2026-06-23

## Context

The design doc says "any team member can update anyone's attendance (trust-based, like
the money pool)." This is unusual — most apps let you edit only your own RSVP. It is
lovely and low-friction for a tight-knit team, but it conflicts with the "built to grow"
posture (ADR-0001): open/larger teams won't all trust each other.

## Decision

Keep **anyone-edits-anyone** as the **default behaviour for now**, but treat it as a
**convenience, not a sacred product principle**. Specifically:

- Model an Attendance change with an explicit **actor** ("changed by") from day one, so
  a permission layer and audit can be added later without reworking the data model.
- When teams get bigger or the app opens to strangers, introduce "edit own only" +
  admin override without a migration of intent.

## Consequences

- Near term: no per-field ownership or locking; friction stays minimal for known teams.
- The data model records who changed an attendance, even though nothing restricts it yet.
- Trust is a **default**, not a guarantee — explicitly distinct from the money pool,
  where trust is more load-bearing.
- Avoids over-investing in a permission system before there's a team that needs it.

## Amendment (2026-09-18): one answer control, reachable from every surface that lists people

For a while the trust-based edit was deliberately *hard to reach*: #271 ⑫ confined changing a
teammate's answer to the event-detail page's rows, and the events-list card rendered the same list
read-only (#326) so the card could not extend that reach by accident. The friction was the safeguard.

That restriction is gone, and it went quietly rather than by decision, so it is recorded here.

The event card's lineup panel shows the people in each position and lets any of their answers be set
from the card itself — which is most of the point of the panel: seeing that a position is short is
only half of "which position is short, and who do I chase for it". Once the card could do it, the
detail page's exclusivity was a fiction, and keeping two different gestures for the same act (a
bottom sheet on the card, an inline expander on the page) cost more than it protected.

So:

- **Every surface that lists people opens the same control** — `features/attendance-toggle/AnswerSheet`
  — and there is exactly one of it. A reader who has learned the card has nothing new to learn on the
  detail page.
- **The safeguard is now awareness, not friction.** The sheet names the person, their position and
  their current answer, and says "you are answering for them" whenever the target is not the viewer.
  The detail page additionally raises an Undo toast on a cross-member write.
- **Read-only remains a real mode.** `AttendeeList` without `onRespond` renders every row as a fact
  with nothing to open, so a future surface that should not edit still has a way to say so.

None of this changes the decision above: anyone-edits-anyone stays the default, `changedBy` is still
recorded on every write, and a permission layer can still be added without reworking the data model.
What changed is only how many places the convenience is reachable from — which was never the thing
holding the line.
