# ADR-0029: Event list filters partition their dimension, and everything on the page follows them

- Status: Accepted
- Date: 2026-09-07
- Restates: [ADR-0020](0020-bulk-attend-non-destructive-future-only-batch-create.md) decision 5 ("subset = currently shown")

## Context

The events list grew two filter dimensions beyond event type: **the viewer's own answer** and
**turnout** (whether the event is short of people). Both are derivable from the list payload already —
`myState` since #226, `roster.state` since #219.

Three filter groups in one popover is where a filter stops being obvious and starts needing rules.
Two questions had no settled answer and would each have made the filter feel broken:

- What does a chip group *mean* when every chip is on, and how do groups combine with each other?
- Which of the page's other elements — the Next Up hero, the Bulk Attend buttons — are subject to a
  filter, and which are not?

The second was nearly answered wrongly. Bulk Attend is internally scoped to `NOT_RESPONDED`
(`eligible-event-ids.ts`), so filtering to `Going` leaves it with nothing to act on. Exempting it from
the answer dimension was considered, on the reasoning that its label already states its own scope
("Attend 12 trainings", ADR-0021). That exemption produces a **dangling call to action**: a prominent
button offering to write to twelve events, none of which are on screen. ADR-0020 decision 5 already
said the right thing — the action covers what is *shown* — and needed restating, not amending.

## Decision

1. **Each dimension is a total partition of the list.** Every event falls in exactly one chip of
   every group, so "all chips on" means "no constraint" and can never hide anything. This is what
   makes the existing all-on default honest, and it is a real constraint on chip design: a dimension
   may not be a set of interesting cases with the remainder unaccounted for.

2. **OR within a dimension, AND across dimensions.** The conventional facet semantics. Combined with
   (1), a group with every chip on contributes nothing to the conjunction.

3. **Isolate-first toggling everywhere**, reusing `toggleTypeSelection`: tapping a chip while all are
   selected isolates it; tapping again toggles; deselecting the last restores all. With an all-on
   default this is what makes the common intent one tap — "show me only what needs my answer" —
   where a plain toggle would instead *remove* the one status the member wanted.

4. **Turnout buckets the seven `RosterState` values into four chips**: `Missing a position`
   (`CRITICAL`), `Spots open` (`SPOTS_OPEN`, `HEADCOUNT_SHORT`), `Covered` (`LINEUP_SET`,
   `HEADCOUNT_FULL`), `No target set` (`TALLY_ONLY`, `OFF`). The first three follow the existing
   `RosterTone` split, so the filter inherits the card's own reading of the states rather than
   inventing a second one. The fourth exists to satisfy (1): a tally has nothing to fall short of and
   a social has no roster at all, and neither may be presented as a verdict — the same reasoning that
   gives them no chip on the card.

5. **The Turnout group renders only when the list spans two or more of its buckets.** A team that
   sets no targets gets `TALLY_ONLY` on every event; for them the group is four chips that provably
   filter nothing. Groups come from the data, as they already do for Bulk Attend (ADR-0021 §2).

6. **Everything on the page follows the filter — views and actions alike.** The Next Up hero is the
   first list item promoted, so it must follow or it contradicts the list beneath it. Bulk Attend
   follows too: its buttons cover exactly the unanswered, future events currently visible, which is
   ADR-0020 decision 5 unchanged. A consequence worth stating plainly, because it looks like a bug
   otherwise: **filtering to any answered status leaves no Bulk Attend buttons at all.** That is the
   invariant holding, and the reason is on screen — the visible list contains nothing unanswered.
   The pleasant converse is that filtering to `Not responded` *is* Bulk Attend's preview: the list
   then shows exactly what the buttons would write to.

7. **Filtering stays client-side, and the list is not paginated.** Both fields are already on the
   payload and the list endpoint is batched, not N+1 (`AttendanceService.attendanceForAll`). At a
   realistic ceiling of a few hundred events a team the payload is tens of kilobytes gzipped, and
   `include-past=false` already bounds the default view. Moving filtering to the server would put a
   network round-trip and a loading state behind every chip tap, and would silently redefine what
   Bulk Attend covers.

8. **No dimension is pre-applied, and filter state does not persist.** A default filter would make
   the events page misreport the team's schedule on first open, which is the one thing the page
   exists to tell the truth about.

## Considered options

- **Exempt Bulk Attend from the answer dimension**, keeping its buttons stable — rejected: it
  produces the dangling CTA described above, and contradicts ADR-0020 decision 5.
- **Hide Bulk Attend whenever any filter is active** — rejected: strictly stronger than needed, and it
  would also remove the type-scoped tap ("Attend 12 trainings") that ADR-0021 deliberately preserved.
- **A "filter to these" action on the Bulk Attend button**, previewing the batch before acting —
  rejected: under decision 6 the `Not responded` chip already is that preview, in one tap, and the
  safety need is already met by Undo (ADR-0020). A second route to the same state would re-teach the
  filtering prerequisite ADR-0021 spent an ADR removing.
- **Server-side filter params** — rejected per decision 7; revisit only together with pagination, and
  with Bulk Attend's scoping as an explicit part of that migration.
- **Treating turnout as a yes/no "needs attention" flag** — rejected: it is not a partition, so the
  unflagged remainder becomes unaddressable and the all-on default stops meaning "everything".
- **Counting `TALLY_ONLY` as needing attention** so the filter is useful to target-less teams —
  rejected: it invents a judgement the team never asked for, which is the same reason it carries no
  chip on the card.
