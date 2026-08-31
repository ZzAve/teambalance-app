# ADR-0027: A snapshot policy — render-similarity never merges a story; `disableSnapshot` for behavioural-only stories; `modes` for the theme axis

- Status: Proposed
- Date: 2026-08-30
- Amends: [ADR-0017](0017-visual-regression-gate-and-gated-renovate-automerge.md)
  (§1 "Visual regression via Chromatic" and the "Snapshot budget" consequence)
- Rollout worklist: [#259](https://github.com/ZzAve/teambalance-app/issues/259) — the per-story
  `keep-baseline` / `disableSnapshot` / `modes-candidate` classification and rollout checklist

## Context

ADR-0017 made every story do three jobs at once, and never said what to do when they pull apart.
A single `*.stories.tsx` export is read by **three** consumers:

1. the **Vitest browser addon** (`make test-app`) — runs the `play` function headless and asserts
   behaviour;
2. **Chromatic** — takes one pixel snapshot per story (after `play` settles) and diffs it against a
   baseline;
3. a **human browsing Storybook** — reads the catalogue as documentation.

The catalogue has since grown to **247 story exports across 46 files**, all CSF3, **every one with a
`play` function**, and **zero `argTypes`/controls**. That growth exposed a tension ADR-0017 left
implicit: many stories are **distinct as tests but near-identical as pictures**, and the three
consumers want opposite things from them.

**Render-similarity has been misread as redundancy.** The recurring worry — "these sub-stories look
almost the same, should I collapse them?" — conflates the pixel job with the behaviour job. Two
stories that render the same picture can still exercise different branches: `RsvpIn` and `RsvpOut`
on `NextEventHeroView` click different buttons and assert different callbacks, but because the View
is controlled (state arrives as props, a click does not re-render it), their **snapshots are
identical to the `HaventReplied` baseline**. They are not redundant tests; they are redundant
*pictures*. We had no word for that, so the instinct was either to keep a useless third baseline or
to delete a useful behavioural test.

**The reflex fix — a `select` control — optimises the consumer we use least.** Collapsing an
event-type fan-out into one story with a dropdown serves the human browser (consumer 3, which we
barely use — we have no docs addon and no `argTypes` anywhere) at the direct cost of consumers 1 and
2: Chromatic snapshots a control-driven story **once**, at its declared args, and the Vitest addon
runs **one** `play`. A dropdown does not give five toggleable snapshots; it gives one snapshot and
drops the other four branches from both layers. So the intuitive move is backwards for our pipeline.

**The theme axis is snapshotted at half coverage.** `preview.ts` fixes `initialGlobals:
{ theme: 'light' }`, and only a handful of stories opt into dark. For an app whose identity is
token-driven — semantic attendance colours (green/gold/red), surfaces, the money teaser — a Tailwind
or token bump can break **dark** while **light** stays green. We built the light/dark decorator and
then guarded only one side of it.

Chromatic ships the two levers this needs, and we use **neither**: `disableSnapshot` (keep the story,
drop the picture) and **modes** (one story, N snapshots across saved globals). No story in the repo
sets `parameters.chromatic` at all — the "which of these 247 is visually load-bearing" judgment lives
only in a maintainer's head, nowhere in the tree.

## Decision

### 1. The rule: a story earns its keep by a branch or a baseline, never by looking different

> **Render-similarity is never a reason to merge or delete a story. The only reasons a story exists
> are: it exercises a behavioural branch (`play` + spies) that no sibling does, *or* it is a visual
> state that deserves its own regression baseline. A story may earn its place on either ground alone.**

Corollary: **do not reach for a control to deduplicate.** `argTypes`/controls are a *documentation*
feature; `disableSnapshot` and `modes` are the *testing* features, and this is a testing pipeline.
Collapsing stories into a control trades two heavily-used consumers for one we don't use. We keep the
"one story per branch" shape ADR-0017 established and reach for the Chromatic parameters below to fix
the *picture* count without touching the *behaviour* count.

### 2. `disableSnapshot` decouples the pixel baseline from the behavioural test

When a story exists **only** to prove wiring — its post-`play` render is pixel-identical to a sibling
baseline — keep the story (the Vitest addon still runs its `play` and spies) and exclude it from
Chromatic:

```tsx
export const RsvpIn: Story = {
  parameters: { chromatic: { disableSnapshot: true } }, // behavioural twin of HaventReplied
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /I'm in/ }))
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING')
  },
}
```

The signature of a `disableSnapshot` story: a `play` that clicks/types and asserts a **callback**
(`toHaveBeenCalledWith` / `not.toHaveBeenCalled`) while **nothing visible changes** — no dialog or
menu opens, no text or state flips. If the interaction reveals a confirm dialog, opens a menu, or
toggles visible state, the post-`play` picture is genuinely new and the story **keeps** its baseline.
When in doubt, keep the baseline; `disableSnapshot` is for provable twins only, and the disabling
comment must name the sibling it duplicates.

This is the honest answer to "too many near-identical stories": most of them are near-identical
*pictures* of distinct *tests*, and this is exactly the parameter that says so.

### 3. `modes` cover the theme axis — one story, two baselines, no duplicate file

Theme (and, where it matters, viewport) is a **global**, so it belongs in modes, not in a
hand-written `*Dark` twin story. Define modes once:

```ts
// app/.storybook/modes.ts
export const allModes = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
} as const
```

and apply them to the components where the theme axis carries real regression value — semantic
attendance colours, the next-event hero, bottom nav, the money surfaces — at the **meta** level so
every state inherits both baselines:

```tsx
const meta = {
  component: NextEventHeroView,
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof NextEventHeroView>
```

Each applied mode is one snapshot with its **own** baseline and its **own** human accept, so modes
are additive to the budget — apply them deliberately to the token-sensitive components, not blanket
across all 247. This replaces the fixed `theme: 'light'` half-coverage with real two-theme coverage
on the surfaces that can actually drift, and it is the mechanism the "one story, many renders"
instinct was really reaching for.

**Rejected: hand-written `FooDark` twin stories.** They double the file, drift out of sync with their
light sibling, and still carry a `play` we would have to keep aligned. Modes derive the second
render from the first — same args, same `play`, a global flipped — which is the whole point.

**Rejected: a `select`/`radio` control to fold a variant fan-out into one story.** As §1 says, it
serves the consumer we use least and silently drops branches from the two we use most. A variant that
deserves a per-value baseline (each event-type icon, each attendance colour) stays a story; a variant
that does *not* deserve one gets `disableSnapshot`, not a control.

### 4. Snapshot intent lives in the tree, co-located with the story

Every `disableSnapshot` and every `modes` application is a `parameters.chromatic` block on the story
or its meta, next to the code it judges — never a central ignore-list. The *why* travels with the
component, survives a file move, and shows up in the diff when someone changes it. `.storybook/modes.ts`
is the one shared definition; everything else is local.

### 5. `argTypes`/controls stay out — deliberately, and now on the record

We continue to write **no** `argTypes` and mount **no** controls/docs addon. The catalogue is a
headless test corpus, not a component playground; controls would add per-prop annotation weight for a
browsing consumer we do not serve, and (per §1) invite the wrong deduplication. This is a standing
choice, not an oversight — revisit only if we adopt Storybook as living documentation for people
outside the codebase, and even then via a separate *playground* story, never by folding test stories
into a control.

## Consequences

- **Behavioural coverage is unchanged; the pixel budget drops.** No `play` is deleted — every one of
  the 247 stories still runs under `make test-app`. `disableSnapshot` only removes redundant
  *pictures*. The audit ([#259](https://github.com/ZzAve/teambalance-app/issues/259)) classifies
  **205 keep-baseline, 42 disableSnapshot**, and **+11 deliberate dark-mode snapshots**, for a
  projected baseline of
  **247 − 42 + 11 = 216** (net **−31**). The single biggest harvest is `NextEventHeroView` (−5:
  `RsvpIn`/`RsvpOut`/`WholeCardIsClickable`/`ControlsStayAboveTheOverlay` all render pixel-identically
  to the default state); confirm-dialog spies that close on confirm (`MemberRoster.RemoveMember`,
  `ManagePositions.DeleteConfirm`, `ManageCreationCodes.RevokeConfirm`) settle back to the data-state
  frame; menu-close spies settle back to a closed-state sibling.
- **ADR-0017's "Snapshot budget: ~22 → ~50" line is superseded.** The catalogue outgrew that envelope
  (247 exports); the budget is now governed by this policy — baselines track *visually distinct
  states plus deliberate theme modes*, not story count — with TurboSnap (`--only-changed`) still
  holding per-PR counts down.
- **A `disableSnapshot` is a claim that must stay true.** It asserts "this render equals sibling X".
  If a later change makes the disabled story render something new, the claim is stale and the picture
  silently goes ungarded. The naming comment is the guard-rail; a periodic re-audit (tracked in
  [#259](https://github.com/ZzAve/teambalance-app/issues/259)) is the backstop.
- **Dark-theme regressions become catchable.** Modes add real dark baselines on the token-sensitive
  surfaces, each with its own accept — the cost is one extra human click per intended change on those
  components, the same trade ADR-0017 already accepted for light.
- **Rollout is incremental**, piggy-backing on ADR-0017's existing "prop-contract spies for the other
  interactive stories" rollout: apply `disableSnapshot` as each behavioural-only story is touched, and
  add modes to the token-sensitive components. No big-bang sweep required.
- **The audit is a living document, not a one-off.** Issue
  [#259](https://github.com/ZzAve/teambalance-app/issues/259) classifies each story `keep-baseline` /
  `disableSnapshot` / `modes-candidate`; it is the worklist for the rollout and the reference for the
  next person who asks "why do we have so many similar stories?"
