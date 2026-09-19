# ADR-0032: Composite snapshots, at most three stories per View, and a viewport axis

- Status: Accepted
- Date: 2026-09-14
- Supersedes: [ADR-0027](0027-snapshot-policy-disable-behavioral-only-stories-modes-for-theme.md)
  §1 (a story per behavioural branch), §3 (theme modes on token-sensitive components) and §5
  (no controls, no interactivity). ADR-0027 §2 (`disableSnapshot` names its sibling) and §4 (snapshot
  intent is co-located with the story) stand unchanged.
- Extends: [ADR-0017](0017-visual-regression-gate-and-gated-renovate-automerge.md) (the gate) and
  [ADR-0028](0028-chromatic-snapshot-budget-turbosnap-full-builds-and-ci-levers.md) (capture
  frequency — untouched here; this ADR governs the baseline *count*).

## Context

ADR-0027 kept "one story per behavioural branch" and only decoupled the pixel from the test with
`disableSnapshot`. Two weeks after its rollout the catalogue stood at **411 story exports across 61
files** with **63** `disableSnapshot`s and dark modes on 8 files: a projected Chromatic baseline of
**~401 snapshots** (348 light + 53 dark). The rollout cut 31 pictures; the catalogue then grew by 160
exports. Four things were wrong with the shape, not the tooling:

1. **One physical feature has five to eight stories** that each show one branch. `EventFiltersView`
   has 19, `NextEventHeroView` 16, `ManagePositionsView` 15. Read as a test corpus that is fine; read
   as a catalogue it is noise, and every kept baseline is a human accept on every intended change.
2. **Every low-level component is snapshotted on its own.** Six `EventTypeIcon` pictures, fourteen
   `RosterPips`, eighteen `EventAnswerRow`. A dependency bump that breaks a token would show up in
   *all* of them and in the card that contains them — the leaf baselines add accept-clicks, not
   detection. Drift is caught at least as well by a handful of **composite** pictures that show the
   leaves in context.
3. **The catalogue is not usable by a person.** Views are controlled, so clicking a filter chip or an
   RSVP button in Storybook does nothing. The composites are exactly where a human would want to
   poke, and there is no harness for it.
4. **There is no viewport axis.** Chromatic captured everything at its 1200px default for a
   mobile-first app whose main column is `max-w-2xl`, and nothing let a viewer flip a story between
   breakpoints.

## Decision

### 1. At most three stories per View: `Data`, `Shells`, `Interactions`

> **A feature or widget View gets at most three stories.** `Data` is one live instance in its
> primary populated state and carries the snapshot. `Shells` stacks the non-data states — loading,
> error, empty, the error-banner and disabled variants — as several labelled instances in **one**
> frame, one snapshot. `Interactions` is `disableSnapshot`; its `play` walks every interaction in
> sequence and keeps **every** `toHaveBeenCalledWith` / `not.toHaveBeenCalled` assertion the old
> per-branch stories made.

Behavioural coverage is preserved by construction: merging stories moves assertions into a
multi-step `play`, it never drops them. The `Stack` helper (`shared/testing/stack.tsx`) renders each
instance in a labelled `region` so a `play` can scope with `within(getByRole('region', { name }))`.
A state that only an interaction can reach and that is visually new (a dialog or popover open, an
inline rename affordance revealed) may be a fourth, snapshotted story when no composite shows it.

### 2. Primitives become galleries

A leaf component with a variant fan-out (icons, badges, pips, answer rows, chips, the attendance
toggle) gets **one** `Gallery` story that renders every variant side by side, one snapshot, plus its
`play` assertions folded into that story. Per-variant baselines are gone; per-variant assertions stay.

### 3. Composites own the pixels

The `pages/` layer gains prop-only page Views — `EventsPageView`, `EventDetailView`, `TeamPageView`
(the account page already had `AccountView`). Each is the route's JSX lifted out with **`ReactNode`
slots** for the nested containers (hero, bulk-attend bar, create sheet, edit/delete dialogs, invite
dialog): the route fills a slot with the container, the story fills it with the sibling `*View`. No
feature's own container/View split moves.

Page stories render under `withAppShell` (`.storybook/app-shell-decorator.tsx`): the real
`AppShellFrame` (header, centred column, bottom nav) extracted from the root route, so a page snapshot
is the phone's actual screen and the chrome cannot drift out of step with the app.

**Ownership rule.** A View that is rendered inside a page composite keeps its own snapshot **only
for states the composite cannot show in its default frame** — a popover or dialog open, a loading or
error shell, an error banner. Everything else in that file is an `Interactions` story with
`disableSnapshot`. `BottomNav`, `TeamHeader` and `PageHeader` are covered entirely by the composites.

### 4. A viewport axis, captured at one width by default

`.storybook/modes.ts` defines `VIEWPORTS` (xs 360 / sm 640 / md 768 / lg 1024 / xl 1280, Tailwind's
breakpoints plus a phone) and derives both the Storybook toolbar switcher and the Chromatic modes
from it. `preview.ts` applies the **`xs` mode globally**, so every baseline is a phone-width picture
and the toolbar defaults to the same width. A story declares a different width only when the layout
actually changes with it: page composites add `xl` via `pageModes`. Choosing which width a story is
captured at is a judgment made per story, in the tree, never a blanket matrix.

### 5. Theme coverage rides the composites

Dark baselines (`xsDark`) apply to the page composites' `Data` stories and to the token-sensitive
galleries (attendance toggle, event card). Dark modes come off every other file: those components are
rendered in a composite that already carries a dark picture.

### 6. Composites are interactive; controls stay out

Page composite `Data` stories wrap the View in a small `useState` harness so filters, the view menu,
RSVP and open/close actually flip when a person clicks in Storybook. `play` still asserts the spies.
This is a harness in the story, not `argTypes`: ADR-0027's reasons for keeping controls out hold.

## Consequences

- **Baseline target ≤ 120 snapshots** (from ~401): 4 page composites × ~4 (xs, xsDark, xl, shells),
  ~40 feature/widget files × ≤ 2, ~15 galleries × 1.
- **One full re-baseline.** The global `xs` mode changes the capture width of every story, so the
  first build after this lands captures the whole catalogue once and every picture needs an accept.
  Land it in one PR, kept as draft until complete (ADR-0028 §1).
- **Every `play` assertion survives** in a multi-step `Interactions` story or a gallery. What is lost
  is only pictures, and the pictures that remain show the same pixels in context.
- **A `disableSnapshot` is still a claim** (ADR-0027 §2 and the "stays true" consequence): each one
  names the story whose picture covers it.
- **Snapshotting a multi-step story captures its last frame.** That is why `Interactions` stories are
  `disableSnapshot` and why a visually new end state gets its own short story instead.
- **Routes get thinner**, the `pages/` layer is populated, and `AppShellFrame` is shared between the
  root route and Storybook. A visible change to the shell or the events overview still requires the
  PWA screenshots to be regenerated (CLAUDE.md PR gate).
