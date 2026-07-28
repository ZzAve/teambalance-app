# ADR-0017: A Chromatic visual-regression gate to make Renovate automerge safe

- Status: Accepted
- Date: 2026-07-28

## Context

We want to **automerge Renovate updates** — let dependency bumps land unattended — without the
system silently degrading, either in behaviour or in UX. Two gaps blocked that.

1. **No visual coverage.** Our 22 Storybook stories already assert behaviour well (every one has a
   `play` function with real `expect()` on roles/text/attributes, run headless in Chromium via the
   Vitest browser addon under `make test-app`). But nothing looks at **pixels**. The most common
   breakage from a Tailwind / Radix / shadcn bump is *visual* — spacing collapses, a token stops
   resolving, a layout reflows — and none of that trips a `getByText`. A bump could stay green while
   the UI looked broken.

2. **Shallow interaction assertions.** Stories asserted *what was on screen*, not *what the
   component did*. A story could pass while a Radix bump severed the wiring so a click no longer
   fired the handler.

A green gate that misses either class is worse than no automerge: it trains us to trust merges that
haven't actually been vouched for.

## Decision

### 1. Visual regression via Chromatic, as a blocking gate

Adopt **Chromatic** (hosted) for visual regression. It renders every story on its own fixed infra,
so a developer's machine and CI agree by construction — determinism we would otherwise have to buy
by pinning a Docker render image and managing baseline PNGs in-repo. It ingests the Storybook build
we already produce.

**A visual delta blocks automerge; it is never auto-accepted.** The Chromatic job runs with
`--exit-zero-on-changes`, so a diff does not fail the Actions job; instead Chromatic's **"UI Tests"
commit status** stays unresolved until a human accepts or rejects the diff in the Chromatic UI.
Marking **"UI Tests" a required status check** in branch protection is what actually holds the merge
train. We deliberately do **not** set `autoAcceptChanges` on PR branches — auto-accepting whatever a
bump did would silently re-baseline the regression and defeat the entire gate. Accepted PR snapshots
are promoted to the baseline by Chromatic's git integration once the PR merges to `main`.

TurboSnap (`--only-changed`) limits each run to stories whose dependencies changed, keeping the
snapshot budget sane as the story count grows.

### 2. Prop-contract spies close the interaction gap

Interactive component stories pass `fn()` spies (from `storybook/test`) as their callback props,
drive a real interaction in `play`, and assert the callback fired with the right args
(`await expect(args.onX).toHaveBeenCalledWith(...)`). This proves the component→prop wiring survives
a dependency bump. We **hold the network line**: stories do not mount MSW or assert HTTP requests —
real API round-trips stay in the two Playwright e2e flows, per `docs/testing.md`. A spy proves the
component called its prop; it does not (and is not meant to) prove the mutation reached the server.

### 3. Container/View convention, with state shells in the View

Features follow a **Container/View split**: a `*View` is presentational and prop-only; a container
(`ManagePositions`, `EditEventDialog`, `CreateEventSheet`, …) wires the TanStack Query hooks and
mutations. **The View gets the story; the container is thin wiring covered by e2e**, the same seam
class as the query hooks `testing.md` already leaves to e2e.

To make this honest, **loading/error shells belong in the View, not the container** — as
props-driven states (`isLoading` / `isError`) — so all four data states (loading / error / empty /
data) render as stories with no network. A container that renders its own loading/error shell hides
those states from every story. This is a **convention, not a CI-enforced gate**: enforcing
"every component has a story" would need an escape-hatch annotation on every wiring container, more
friction than the one missing story it would catch at our scale.

### 4. Gated, conservative Renovate automerge

`renovate.json` automerges **patch + minor** (plus pin/digest) via `platformAutomerge` — GitHub's
native automerge, which merges only when the required checks (CI build + Chromatic "UI Tests") pass.
**Major updates always land by hand**: a green gate proves "still builds, behaves, looks identical",
which a major can satisfy while changing API/behaviour semantics no pixel diff reveals.
`minimumReleaseAge: 14 days` means we never automerge a release inside the window where it might be
yanked or a supply-chain compromise disclosed — a risk no test catches.

## Consequences

- **Reference exemplar:** `features/manage-positions` is taken all the way — loading/error shells
  pushed from `ManagePositions` into `ManagePositionsView`; Loading/ErrorState/Empty/WithItems
  stories; `onCreate`/`onRename`/`onDelete` proven with prop-contract spies. Copy this shape.
- **Rollout is incremental** (tracked as a GitHub issue): prop-contract spies for the other
  interactive stories, shells-down for the other six containers.
- **External dependency + one-time setup** (not in this repo): create the Chromatic project, add the
  `CHROMATIC_PROJECT_TOKEN` repo secret, mark **"UI Tests" a required status check** in branch
  protection, then enable Renovate automerge. Until "UI Tests" is required, a visual delta will
  *not* block a merge — the whole gate hinges on that branch-protection setting.
- **A visual delta costs a click.** Every intended UI change (ours or a bump's) now needs a human to
  accept the diff in Chromatic. That is the accepted price of catching the unintended ones.
- **Snapshot budget:** ~22 → ~50 stories fit the free tier comfortably; TurboSnap keeps per-PR
  snapshot counts down. Revisit if the catalogue outgrows the plan.
