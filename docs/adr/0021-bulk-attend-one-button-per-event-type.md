# ADR-0021: Bulk Attend offers one button per event type

- Status: Accepted
- Date: 2026-08-16
- Amends: [ADR-0020](0020-bulk-attend-non-destructive-future-only-batch-create.md) (decision 5, "subset = currently shown")

## Context

ADR-0020 shipped Bulk Attend as a **single** action over the events the client currently lists, with
the **Event Type** filter as the subset selector: "filter to Training, Bulk Attend the trainings".

In use that inverted the intended ergonomics. Every filter pill is on by default, so the button
spans types and reads **"Attend 6 events"** — a headline action that offers to answer a match and a
training in one indiscriminate tap. Expressing the very commitment the ADR set out to serve ("I'm at
every training this season") first required opening the filter popover and isolating Training. The
scoping existed, but behind a prerequisite interaction that nothing on screen advertised.

Naming the type in the label (shipped in #218) made the scope legible *once narrowed*, but did not
remove the prerequisite: unfiltered, it still says "events".

The mismatch traces back to ADR-0020 itself, whose motivating scenario is training-shaped while its
mechanism generalised to "whatever is shown". The generalisation was sound about *ownership* — the
filter is a client notion and the server should stay a dumb applicator — but wrong about *shape*: a
standing commitment is per **type**, not per screenful.

## Decision

1. **One button per event type** that currently has fillable events: "Attend 12 trainings",
   "Attend 3 matches", side by side. Each states its own scope, so no filtering is needed to make a
   safe, legible tap, and a team that only ever trains sees exactly one button.

2. **Groups come from the data, never a privileged name.** Event types are admin-configurable per
   team, so nothing may hardcode "Training" — a team may call it "Practice", or not have one. The
   buttons are whatever types the team uses and currently has blanks in.

3. **Ordered by size, then name.** The biggest commitment is the one most worth a single tap; the
   name tie-break stops the row reshuffling between two equally-sized types as counts change.

4. **Wraps, never scrolls.** A team with several types gets a second line rather than buttons
   sliding off the edge — on a phone that is the difference between an action you can see and one
   you cannot.

5. **The toast echoes the type** it was tapped for ("12 trainings set to Attending"), so the
   confirmation matches the button, including in the shortfall form.

Unchanged from ADR-0020: non-destructive create-only, future-only, Attending-only, reversible via
Undo, and the wire contract — the client simply sends one type's ids per request. The Event Type
filter still narrows what is on screen, and therefore what the buttons cover; it is just no longer
the *only* way to scope the action.

## Considered options

- **Default the filter to Training** — rejected: there is no guaranteed "Training" type to default
  to, and it would hide every other type's blanks behind a filter the member never chose.
- **A split button** (primary "Attend 6 events" + per-type dropdown) — rejected: it keeps the
  per-type scope behind a menu, which is precisely the complaint. One control, but the useful part
  still hidden.
- **Keep one button, rely on the type-aware label** — rejected: the label is honest but the
  prerequisite remains; unfiltered it still offers to answer everything at once.

## Consequences

- **"Answer everything in one tap" is gone.** A member with blanks across three types now taps three
  times. Accepted deliberately: each tap is a claim about a different commitment, and conflating
  them is what made the single button feel indiscriminate.
- Each tap is its own batch with its own Undo toast, so a mistaken "Attend 3 matches" is reversed
  without touching the trainings already filled.
- The row grows with the number of event types a team defines. Bounded in practice (teams use a
  handful) and handled by wrapping; a team with many types would want a different affordance, which
  can be revisited when one exists.
