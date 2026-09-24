# ADR-0033: The events page uses the width from `lg` — a left rail, not wider cards

- Status: Accepted
- Date: 2026-09-19
- Extends: [ADR-0032](0032-composite-snapshots-three-stories-per-view-and-a-viewport-axis.md)
  §3 (page composites own the pixels) and §4 (the viewport axis that made the desktop picture
  visible in the first place). Amends nothing in
  [ADR-0029](0029-event-list-filters-partition-and-everything-follows-them.md) or
  [ADR-0030](0030-list-page-clarity-persisted-view-preferences-and-an-over-fetched-list.md):
  what the page shows, and in what order, is unchanged.

## Context

Every in-shell page renders in one centred `max-w-2xl` column (`AppShellFrame`, 672px). That is the
right reading width for a card list, and it is why a component like `EventAnswerRow` plateaus at
~610px however wide the screen gets: the cap belongs to the layout, not to the component, which is
`w-full` and has no width of its own.

On a laptop the events page is therefore a phone column with ~300px of empty margin on either side.
ADR-0032 §4 added the viewport axis and captures the page composites at `xl` (1280px), so the
desktop picture is now guarded — but the picture it guards is "the phone, centred".

Widening the cards is the obvious move and the wrong one. The answer row's two pills (your answer
left, the roster verdict right) belong together by proximity and are already ~400px apart at 610px;
at 1200px the verdict reads as page furniture rather than as this event's verdict, and a 17px card
title on a 1200px card is the stretched-phone-app look.

## Decision

### 1. From `lg` (1024px) the events page is a left rail plus the list

Everything a member scans *before* acting moves into a sticky left rail — the page header with its
two popovers (`Filters`, `View options`) and the admin's create trigger, the Next Up hero, and the
bulk-attend bar. The chronological card list takes the right column.

Tracks are `22rem` (rail) and `minmax(0,1fr)` (list) with a `2rem` gap, inside a `66rem` cap. That
is 64rem of content beside the shell's 1rem edge padding, which leaves the list column **40rem —
the width a card already has on a laptop today**. The extra room pays for the rail and for nothing
else: no card gets a pixel wider at any width.

Below `lg` nothing changes. The two rail wrappers are `display: contents` there, so the single
column is the same box tree, in the same order, with the same margins, that it was before the rail
existed. The phone is the product; this is a laptop affordance bolted beside it.

### 2. Only the events page opts out, and it opts itself out

`AppShellFrame` keeps `max-w-2xl` as the rule. A page lifts the cap for itself by spreading
`WIDE_COLUMN` on its root, and the frame reads that marker with `lg:has-[[data-wide-column]]`.

It is an attribute rather than a prop because the frame is rendered **once**, by the root route,
around an `<Outlet/>`: it never learns which page is inside it, so a prop would have to be threaded
back out through the router and every page composite would have to declare a width it does not own.
`:has()` lets the page state the one thing it actually knows. The marker only lifts the cap — a page
that keeps a single column is still capped by its own content.

The detail, team and account pages read fine as a single column and stay as they are.

### 3. The header row does not stick; the hero and the bar do

A `position: sticky` box forms a stacking context. `EventFiltersView` and `PanelViewMenu` position
their overlay and panel inside their own subtree (they are not portalled), and `EventCard` is
`relative` for its stretched link — so a header row inside a sticky rail would paint both popovers
*under* the cards beside them. The sticky wrapper therefore starts below the header row. The rail
column stretches to the grid row's height, which is the travel the sticky has.

### 4. `xl` is the acceptance picture, and there is no new mode

`EventsPageView`'s `Data` story already carries `xs`, `xsDark` and `xl` under `withAppShell`
(ADR-0032 §5), and `xl` is where the rail is. No `lg` baseline is added: the tracks are
`22rem` fixed plus a shrinkable `minmax(0,1fr)`, so 1024px is the same layout with a 38rem list
rather than a different one, and ADR-0032's baseline budget is not spent on a width that cannot
reflow. The page/shell contract itself — the `data-wide-column` marker — is asserted in that story's
`play`, because losing it is invisible at phone width and would silently squeeze both columns into
40rem.

## Consequences

- **`events-wide.png` is re-captured.** The PWA install-dialog screenshot is taken at 1280×800
  (`scripts/capture-pwa-screenshots.mjs`), which is exactly where the rail appears, so the wide
  preview had to be regenerated and committed. The 390px `events-narrow.png` came back out of the
  same run box-for-box identical — only the hero's countdown digit had moved on, the seed being
  relative to the day it runs — so the committed one is kept. That identity is the check that §1's
  `display: contents` claim holds.
- **One `xl` baseline changes**, plus the cards' position within it. Their pixels do not change.
- **A second page wanting the width is now cheap** — spread `WIDE_COLUMN`, lay the page out — and
  deliberately not free: each page states its own intent, so widening one never widens another.
- **`:has()` is now load-bearing** for a layout rule. It is baseline in every browser the app
  supports; the fallback if it were ever unsupported is the centred column the page has today, which
  is a degradation and not a break.
