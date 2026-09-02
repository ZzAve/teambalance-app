# ADR-0028: The Chromatic snapshot budget — what actually burns it, and the CI levers that hold it down

- Status: Accepted
- Date: 2026-09-02
- Amends: [ADR-0017](0017-visual-regression-gate-and-gated-renovate-automerge.md)
  (the "Snapshot budget" consequence) and extends
  [ADR-0027 snapshot policy](0027-snapshot-policy-disable-behavioral-only-stories-modes-for-theme.md)
  (which governs the per-story baseline count; this ADR governs how often those baselines are *captured*)

## Context

ADR-0017 stood up the Chromatic visual-regression gate and hand-waved the cost — "~22 → ~50
stories fit the free tier comfortably; TurboSnap keeps per-PR counts down. Revisit if the catalogue
outgrows the plan." ADR-0027 then grew the catalogue to ~216 deliberate baselines and declared the
budget "governed by policy, not story count." Neither said **how often** a baseline gets re-captured
— and re-captures, not the baseline count, are what spend the monthly quota. In early September the
account hit **"Monthly billed snapshot limit reached"**, which stalls the required `UI Tests` check
and therefore blocks merges. So we measured where the snapshots actually go.

**Measurement (120 builds, 2026-08-19 → 09-02, ~11,717 snapshots, from the Chromatic CLI counts in
each Actions job log):**

| Source | Builds | Snapshots | % | Avg/build |
|--------|-------:|----------:|--:|----------:|
| Feature branches (`claude/*`) | 79 | 8,043 | 68.6% | 102 |
| Renovate (`renovate/*`) | 15 | 2,113 | 18.0% | 141 |
| Push to `main` | 24 | 1,151 | 9.8% | 48 |
| Other | 2 | 410 | 3.5% | 205 |

Three mechanisms explain the burn, and they matter more than the category split:

1. **TurboSnap silently falls back to a full-catalogue build far too often.** A working narrow build
   costs ~14 ("Snapshots will be limited to N story files affected by recent changes"); a fallback
   costs ~271. The trigger, confirmed on build #464 (a Renovate PR that changed **only**
   `docker-compose.yml`, yet captured 271): *"A full build was triggered because `modes.ts` was
   modified."* Chromatic treats any `.storybook/**` file as **global** — a change to it can alter how
   every story renders — and it measures "changed since **either** merge ancestor". A branch forked
   before `modes.ts` landed (ADR-0027, 2026-08-31) drags `modes.ts` into its ancestor diff, so a
   change that touches zero stories still full-builds. This is a **false** full build from a stale
   branch, not a real global invalidation.

2. **Chromatic runs on every push.** Each push to an open PR re-snapshots that PR's changed set. A
   single feature branch (`events-roster`) shows 7+ builds at ~260 each — the same in-progress work
   re-captured on every push; only the final pre-merge state needed it.

3. **Renovate rebase churn.** Default `rebaseWhen` keeps open dependency PRs rebased onto `main`;
   during the Wednesday automerge train each rebase is a fresh push and a fresh build. One
   `vitest-monorepo` branch ran 5× in a day.

A large share of the measured 11,717 is **transient**: the ADR-0027 rollout itself (adding
`modes.ts`, `preview.ts`, and touching 46 story files in late August) put a global-invalidating
change on `main`, so nearly every branch alive in the window false-full-built. Steady state — once
every open branch is cut from a `main` that already contains those files — is materially lower.

## Decision

### 1. CI levers (implemented — `.github/workflows/chromatic.yml`, `renovate.json`)

- **Skip snapshots on draft PRs.** `skip: ${{ github.event.pull_request.draft }}`. A draft can't
  merge, so its WIP pushes shouldn't spend the budget. On a skip Chromatic uploads 0 snapshots yet
  posts a passing `UI Tests` status, so the required check keeps reporting (never hangs as
  "waiting"). `ready_for_review` is added to the PR trigger types so leaving draft re-runs the real
  gate before merge. **This only pays off if WIP PRs are kept as draft until reviewable** — make that
  the habit.
- **Collapse rapid pushes.** A `concurrency` group keyed on `github.ref` with `cancel-in-progress`,
  so a newer commit cancels an older in-flight run for the same PR before it reaches the Chromatic
  step. `main` is excluded from cancellation — every merge must complete to promote its baseline.
- **Stop Renovate rebase churn.** `rebaseWhen: "conflicted"` — open dependency PRs no longer rebase
  (and re-run Chromatic) each time `main` advances. `prConcurrentLimit: 3` caps how many dependency
  branches are open (and re-runnable) at once. The weekly `schedule` was already in place.

### 2. Branch freshness is the fix for the `modes.ts`-class full build (practice, not config)

The 271-snapshot false builds come from a **stale ancestor diff**, and there is no config knob that
should suppress them — a *genuine* `.storybook/**` / token / tailwind change *should* re-baseline the
whole catalogue. The fix is to keep the ancestor diff clean:

- After any change to `.storybook/**`, `design-tokens/**`, or the tailwind config merges to `main`,
  **rebase the open long-lived branches** so `modes.ts` (etc.) matches `main` on both ancestors and
  drops out of their diff.
- Prefer **rebase over merge commits** into feature branches — merge commits are what smear `main`'s
  global changes into a branch's ancestor diff (Chromatic's own troubleshooting note).

### 3. `main`'s cost is a necessary baseline tax, left alone

Every merge re-captures the merged change's stories on `main` to promote the new baseline, so each
change is billed roughly twice (PR accept + `main` baseline). It stays small because the `on: push`
trigger is path-filtered to `app/**` and `design-tokens/**` (backend/docs/CI merges cost nothing) and
TurboSnap narrows it to the delta. At ~10% it is not a cutting target; excluding `main` from
concurrency cancellation (§1) protects it deliberately.

## Consequences

- **Supersedes ADR-0017's budget line entirely.** The budget is a function of *capture frequency* —
  full-build fallbacks × pushes × open branches — not story count. This ADR names the levers that
  govern that frequency.
- **A real tension in `rebaseWhen: "conflicted"`, accepted knowingly.** Staler branches prolong the
  `modes.ts`-class false full build right after a global file lands on `main`. We keep it because
  `rebaseWhen` governs **only Renovate PRs**, which are short-lived (created and automerged the same
  Wednesday), so their staleness exposure is minimal while the churn it kills is a recurring cost.
  Feature branches (the 69%) are unaffected by this setting; their freshness is a dev habit (§2).
  **Caveat:** if branch protection ever enables "Require branches to be up to date before merging",
  `rebaseWhen: "conflicted"` will stall automerge (never up-to-date, never rebased) — keep that
  setting off, or revert to the default rebase behaviour.
- **The quota exhaustion is a plan question, not only a config one.** These levers cut *future* burn;
  they do not refill the current month. While the monthly limit is reached, `UI Tests` stays pending
  and app-touching PRs cannot pass the gate. Watch one clean billing cycle after this ADR before
  deciding whether the free tier fits the team's real merge velocity (ADR-0017's "revisit if the
  catalogue outgrows the plan").
- **No behavioural coverage changes.** Every `play` still runs under `make test-app`; this ADR only
  changes *when and how often* Chromatic captures pixels, never what a story asserts.
