# Prototype: the Next Up hero's lineup (#386)

Throwaway. Three treatments of the hero's lineup on `/t/$slug`, switchable via `?variant=`
(`current`, `A`, `B`) with the floating `PrototypeSwitcher` (dev builds only).

Screenshots: production build, same-origin, against `docs/demo/api-fixture.mjs`, 390×844
(`node shoot-hero.mjs <app-dir> <out-dir>` with `vite preview --port 4173` running).

| Variant | Hero bottom (px) | Bulk bar top | Verdict |
|---|---|---|---|
| current — lineup always open | 869 | 881 | below the fold |
| A — disclosure like the cards | 477 | 489 | **picked** |
| B — only short positions open, covered folded into one line | 803 | 815 | under the bottom nav |

Why A: B's saving depends on how many positions are short, and on a critical event — the one
whose roster matters most — it saves almost nothing (three of four fixture positions are short).
A clears the fold whatever the roster state, reuses the disclosure the cards already have, and
honours the member's "Keep panels open" preference, so a captain who wants the lineup open gets it.
