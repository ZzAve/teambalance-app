# ADR-0030: List-page clarity — persisted view preferences, and an over-fetched list to find out what helps

- Status: Accepted
- Date: 2026-09-08
- Amends: [ADR-0029](0029-event-list-filters-partition-and-everything-follows-them.md) decisions 7 and 8

## Context

The two filter dimensions from ADR-0029 shipped (#315, #318). Field feedback arrived quickly, and
two pieces of it contradict decisions that ADR was confident about.

**Members mis-tap the card.** Reaching for a disclosure on the events list navigates to the event
instead. It is a hit-area defect, not a pattern failure: the disclosure triggers are about half the
usual thumb target, and the padding band above the answer row is not lifted above the card's
stretched-link overlay, so a thumb aiming slightly high hits the link. Fixed as a bug, separately.

That mis-tap is what makes ADR-0029 decision 8 wrong. It rejected persisting filter state on the
grounds that a restored filter makes the events page misreport the team's schedule. That reasoning
assumed navigation was *deliberate*. It isn't always, and losing your filter as the penalty for a
mis-tap is a worse failure than the one the decision was guarding against.

**The list is asked to say more.** The card answers "what did I say?" and "is this event OK?"
(#271 ①). Members want the option of more on the list itself, without a round trip to the detail
page — and want it to stay how they left it.

We do not yet know which of "pips" or "names" is the useful default, or whether either is worth the
weight. That uncertainty is the point of this ADR: it records a deliberately over-built middle step
taken to find out, rather than a settled end state.

## Decision

1. **Filter state persists locally** (reversing ADR-0029 decision 8), so it survives navigation and
   reopening.

2. **A restored filter is never invisible.** `Clear filters` is promoted out of the empty state and
   is visible whenever any filter is active. The dot badge on the popover trigger says *that*
   something is filtered; this says *undo it*, without spending the vertical space that put the
   filters in a popover in the first place (ADR-0029 decision 4, via #290).

3. **Filter state and display preferences are different things**, even though both persist. Filter
   state is "where was I"; a display preference is "how do I like this". Only the second is a
   setting, and only the second is remembered as an intention rather than a position.

4. **A shared local-preferences module**, modelled on the existing theme pattern (a pure read/write
   module over a `{getItem,setItem}` interface, try/catch for private mode, wired by hand into a
   plain zustand store — no `persist` middleware). Three new consumers land at once — filter state,
   default-expanded, and the panel choice — which is where "one more ad-hoc `tb-` key" stops being
   the cheaper option.

   **Amended (#326, from use).** The module offers two key scopes, not one. Filter state stays per
   team: it is a *position*, and someone who plays in two teams must not carry one team's event-type
   filter into the other. The two display preferences are **app-wide**, under a key with no team
   segment, following `tb-theme` — the app's other display preference — rather than the filters next
   door. They are a *taste*: nobody wants roster pips in one team and names in another, and being
   asked to set it again on entering a second team reads as the app having forgotten it. Shipping
   them team-scoped was a consequence of reusing the filter store's key builder, not a decision.

5. **The expanded panel offers two views — roster pips or the member list — and the member chooses**,
   as one global preference. Not per-card: which of the two you think in is a taste, not a per-event
   decision, and a per-card switch would persist a great deal of state for it.

   **Amended (#326, from use): the control moved out of the panel and into the page header**, its own
   trigger beside `Filters`. "Inside the panel, because a display switch belongs where its result is
   visible" was right about the principle and wrong about the consequence: a control drawn once per
   open card *reads* as a per-card control however the state is actually held, and that is how it was
   read. It also charged every open panel a row of chrome for a setting a member touches about once.
   The header states the scope correctly, at no vertical cost, and the result stays visible — the
   list re-renders live behind the popover, exactly as it already does for the filters.

   It keeps **its own trigger rather than a section inside `Filters`**, which is decision 3 applied
   to the chrome: a filter is "where was I" and this is "how do I like this", and one popover holding
   both would merge the two things that decision exists to separate. It carries no dot, unlike
   `Filters`: a dot there warns that the list may be hiding events, and a non-default view hides
   nothing.

   The cost accepted is discoverability — a member who never opens the header control never learns
   the member list exists. That is the trade this amendment makes, and the thing to watch.

6. **The panel may be open by default**, as a second preference. This is only affordable because of
   decision 7; with a per-card detail fetch it would have meant one request per visible card. It
   moved to the header alongside the view switch, for the reasons in decision 5, and it is a *live*
   default: flipping it opens or closes every card at once rather than only on the next visit.

7. **The member list in the panel is capped at 15**, with the rest behind the detail page. Uncapped,
   a single card on the member view is a screenful and the list stops being a list. Capping keeps
   both preferences freely combinable, which is better than forbidding the combination and making
   the member discover the rule by being refused.

8. **The events list payload carries full `attendances`** (amending ADR-0029 decision 7). This takes
   an event from roughly 1KB to roughly 8.8KB — about eight times — because every current member
   appears, non-responders included. Accepted **deliberately and provisionally**: reusing the
   existing `AttendanceEntry` costs no new types while we find out what members actually use, and a
   type we would design now would be designed before we know the answer.

   **The exit is named**: three fields are carried that nothing renders — `id` (derivable),
   `changedBy` and `updatedAt` (read by no component today). A list-specific type without them is
   roughly 120 bytes an entry rather than 260, better than halving this. Take that exit once the UI
   settles, or if the payload is felt before then.

   This does not disturb the rest of ADR-0029 decision 7: filtering stays client-side and the list
   stays unpaginated. It does spend most of the headroom that decision was relying on, which is why
   it is recorded rather than absorbed.

9. **The card's location stops being a link.** A maps link is a destination, and the card is a
   summary whose whole surface is a link to the event; an escape hatch to Google Maps competing with
   it is a tap you did not mean either way. The detail page keeps its identical link, so nothing is
   lost — it moves one tap away, behind the tap that was already the likely intent.

## Considered options

- **Session-scoped filter persistence** (surviving navigation, dying with the tab) — it solves the
  mis-tap complaint exactly and dodges the misreporting problem entirely, but not "the same after
  reopening", which is what was asked for. Decision 2 buys the difference.
- **A summary chip row naming the active filters** instead of decision 2 — rejected: variable height
  above a list on a phone, for information the member can get by opening the popover.
- **A slim list-only attendance type now** — rejected for this step per decision 8; it is the exit,
  not the entry.
- **Lazy-fetching event detail when a card expands** — attractive, and it was the recommendation
  until decision 6 arrived: expanded-by-default turns it into one request per visible card.
- **Forbidding default-expanded on the member view** — rejected in favour of the cap (decision 7).
- **A view-options row above the list** instead of the header trigger (decision 5, amended) —
  rejected for what ADR-0029 decision 4 rejected a filter row for: permanent vertical space above a
  list on a phone, here for a control set roughly once.
- **Folding the two display preferences into the filter popover** — rejected by decision 3: it is
  the one place the "position vs taste" split would stop being visible to anyone reading the UI.
- **Keeping the member list off the card entirely**, per #271 decision ⑨ ("who's coming" is answered
  on the detail page only) — knowingly overridden. ⑨ was a judgement about what the card is *for*,
  made before members asked for more on the list; the panel is a disclosure rather than card face,
  and the cap keeps the card's resting state unchanged.
