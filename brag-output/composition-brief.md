# Hyperframes Composition Brief: TeamBalance

## Objective

Create a short launch-style brag video for TeamBalance — a team-management app for
amateur sports clubs whose distinguishing feature is that it resolves attendance answers
against team positions and tells you whether you can actually field a team.

## Output

- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21 seconds

## Source Material

- **Project root:** `/home/user/teambalance-app`
- **Primary files read:**
  - `design-tokens/tokens.css` — the unlayered token file, authoritative for light values
  - `www/index.html`, `www/style.css` — wordmark and tagline treatment
  - `CONTEXT.md` — domain vocabulary and the fixed semantic attendance colours
  - `app/src/entities/event/ui/EventCard.tsx`, `RosterPips.tsx`, `ReadinessBadge.tsx`
  - `app/src/widgets/next-event-hero/ui/NextEventHeroView.tsx`
  - `app/src/features/attendance-toggle/ui/AttendanceToggle.tsx`
  - `app/public/screenshots/events-wide.png` (2560x1600) — **real screenshot of the
    running app; the primary visual reference for Scenes 2-4**
  - `app/public/screenshots/events-narrow.png` (780x1688) — mobile reference
- **Product name:** TeamBalance
- **Strongest claim:** A headcount is not a lineup. TeamBalance knows the difference.
- **Key UI moment to recreate:** an `EventCard`'s two-sided answer row — the viewer's own
  answer pill on the left, the computed readiness verdict chip on the right — and that
  chip expanding into the positions panel.

### Copy that must appear verbatim

All strings below are real, shipped UI copy. Do not paraphrase, retitle, or "improve" them.

- `Six said yes.`
- `You still don't have a team.`
- `Setpoint VT — VC Zaanstad D2`  *(em dash, not hyphen)*
- `MATCH`
- `19:00 · Sporthal De Vliet`  *(middle dot separator)*
- `You're in`
- `Missing a position`
- `Positions`
- `3 of 5 covered`
- `Middle still has no one — the one to chase.`
- `Awaiting`
- `Going` / `Maybe` / `Can't go`
- `Lineup set`
- `Now you have a team.`
- `NEXT UP`
- `Training`
- `di 15 sep · 20:00`  *(lowercase Dutch date, as the app renders it)*
- `Sporthal De Vliet`
- `4 going · you're in`
- `1d` / `AWAY`
- `I'm in` / `Can't make it`
- `TRAINING` / `OTHER` / `Team dinner`
- `Every training, match and team dinner.`
- `Events` / `Team` / `Money` / `Profile`
- `Know your lineup before you get to the hall.`
- `teambalance.nl`

## Creative Direction

- **Tone preset:** `default`
- **Creative direction:** built by someone who has been the one chasing the group chat
- **Interpretation:** Warm and unhurried. Comfortable 3.5-6.0s scenes, clean crossfades,
  mixed case throughout, no ALL CAPS outside the app's own badge styling, no exclamation
  marks. The product is calm and well-made; the video brags by showing one real problem
  being really solved, not by stacking claims.
- **Angle:** Every amateur team already has a way to ask "who's in on Tuesday?" — the
  group chat. The interesting thing TeamBalance does is what a poll fundamentally cannot:
  it resolves the answers against the team's positions and gives a one-glance verdict.
  Six yeses mean nothing if all six are setters. The whole video is that one realisation.
- **Hook:** `Six said yes.` / `You still don't have a team.` — the second line in the
  app's semantic red, on the app's cream background, no UI on screen yet.
- **Outro / punchline:** the wordmark, then `Know your lineup before you get to the hall.`

### Avoid

- Generic SaaS language — no "streamline", "effortless", "all-in-one", "supercharge"
- Abstract filler — no gradient washes, particle fields, or generic motion graphics
- **Any depiction of a money pool, balance, top-up, or Bunq screen.** The Money tab is a
  coming-soon teaser in the shipped app; there is no balance feature. Showing one would
  invent a feature the product doesn't have. The bottom nav's `Money` label is fine —
  it exists — but never open that tab.
- Recolouring the semantic attendance colours. Green/gold/red are fixed brand identity.
- Neutral black shadows — this design system's shadows are warm-tinted.
- Pure white. The background is `#F8F6F0`, the cards are `#FEFDFB`.

## Visual Identity

- **Background:** `#F8F6F0`
- **Card:** `#FEFDFB` · card hover `#FDFCF8`
- **Text:** `#1E293B` primary · `#64748B` secondary · `#94A3B8` muted · `#FFFFFF` inverse
- **Accent / primary:** `#225C9C` (blue) · light `#2D6FB5` · dark `#1A4A7D`
- **Semantic:** attending `#249E6C` · maybe `#F4B400` · absent `#D93025` · no-response `#94A3B8`
- **Also in the palette:** purple `#7B5EA7`, orange `#E87C3E` (event-type chits)
- **Display font:** Grandstander — **wordmark, titles and stats only**, never body text
- **Body font:** DM Sans — everything else
- Both are available as variable fonts (`@fontsource-variable/grandstander`,
  `@fontsource-variable/dm-sans`, both v5.3.0) or from Google Fonts:
  `https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Grandstander:ital,wght@0,100..900;1,100..900&display=swap`
- **Radii:** `8px` / `12px` / `16px` / `9999px`
- **Shadows (warm-tinted, never neutral):**
  `sm 0 1px 2px rgba(120,80,40,.06)` · `md 0 4px 6px rgba(120,80,40,.08)` ·
  `lg 0 10px 15px rgba(120,80,40,.1)` · `card 0 2px 8px rgba(120,80,40,.06)`
- **Motion signature:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — the app's spring easing.
  Use it for the pill and chip flips; it is how the real app feels.
- **Durations:** fast `150ms` · normal `250ms` · slow `400ms`
- **No gradients exist in the token set** except the `NEXT UP` hero's green wash and the
  gold CTA on the money teaser. Don't introduce any others.
- **Visual references:** `app/public/screenshots/events-wide.png` is a real screenshot of
  this exact app — match its card proportions, chit sizing, and spacing rather than
  inventing a layout. `app/public/tb-monogram.svg` is the icon; the wordmark is styled
  text (`Team` blue + `Balance` green), not an asset.

## Storyboard

Use the storyboard in `brag-output/brag-plan.md` as the creative contract, including its
reading-time audit — every text line there has a verified settled-time floor.

Scene summary:

1. **Six said yes** — 4.0s — two lines of Grandstander on cream; second line red, gated to the 1.60s strong cue. No UI.
2. **The card already knew** — 6.0s — real `EventCard` with `You're in` beside `Missing a position`; chip expands to `Positions · 3 of 5 covered`, rows arrive on the beat grid, nudge line lands on 8.96s.
3. **One tap** — 4.0s — simulated tap: `Awaiting` → three-way control → `Going`; chip flips to `Lineup set` on 12.65s.
4. **The whole season** — 3.5s — the real events list: green `NEXT UP` hero, then Match/Training/Other cards on the beat grid, bottom nav visible.
5. **TeamBalance** — 3.5s — wordmark on 17.91s, then the closing line and URL.

## Audio

- **Audio role:** warm bed with sparse, motion-matched UI accents
- **Audio arc:** music carries Scene 1 alone → steps down under Scenes 2-3 so interface
  sounds lead → back up through Scene 4 → gentle lift and fade under the wordmark
- **Music:** `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` (114.84 BPM, 87.6s)
- **Music treatment:** in from 0.0s at full, duck under Scenes 2-3, restore in Scene 4,
  fade to silence across the final ~1.0s. No hard stop.
- **Music cue guidance:** preset at
  `skills/brag/assets/music/cues/happy-beats-business-moves-vol-11-by-ende-dot-app.music-cues.json`.
  Strong cues to target: **1.60** (hook line 2), **3.70** (cut to card), **8.96** (nudge
  line), **12.65** (chip flips green), **17.91** (wordmark).
  Beat grid for sequential reveals: position rows **5.80 / 6.34 / 6.86**; event cards
  **14.76 / 15.28 / 15.81**.
  Per the preset's use policy: major reveals may move within ~0.15s of a strong cue,
  smaller entrances within ~0.10s of a beat. **Readability wins over sync** — the nudge
  line in Scene 2 sits exactly at its reading floor; never shorten it to hit a beat.
- **Audio-reactive treatment:** none. Flat colour and warm shadow is the app's visual
  language; nothing should pulse, glow, or breathe with the music.
- **Audio-coupled moments:**
  - Scene 2, position rows arriving one by one — one soft tick each, three total
  - Scene 3, the simulated tap on `Going` — one clean click
  - Scene 3, the readiness chip turning green — one warmer confirm, the video's payoff
  - Scene 4, the three event cards — lightest possible accent, or none
- **SFX selection guidance:** the app is a calm, warm-shadowed interface, so favour dry,
  low-brightness UI sounds over bright clicky ones. The `switch*` and `rollover*` families
  suit the pill and chip flips better than the `click*` family. Three identical ticks in
  Scene 2 then three more in Scene 4 would read as mechanical — vary or drop the latter.
- **SFX analysis guidance:** use `skills/brag/references/sfx-analysis.md` (and its JSON if
  present) during composition; prefer lower high-frequency-risk sounds for the repeated
  position-row ticks and for the final confirm.
- **Exact SFX choice:** Hyperframes chooses filenames, timestamps, density, and volume
  based on the implemented animation.
- **Audio files:** copy the chosen music and all selected SFX into
  `brag-output/composition/assets/`.
- **Restraint rule:** no riser, no whoosh, no impact hit on the wordmark, nothing under
  any text line. If a cue would make this feel like an ad, drop it.

## Gates before render

- `npx hyperframes check` passes with zero errors inside `brag-output/composition/`,
  including the WCAG contrast pass. Two palette pairs need attention: `#94A3B8` muted
  text on `#F8F6F0` is borderline for small text, and white on `#F4B400` gold fails —
  the app itself uses `#C89200` (gold-dark) for text on gold tints, so use that.
- Scene durations sum to 21.0s.
- Every line in the plan's reading-time audit still meets its settled-time floor in the
  implemented composition, not just on paper.
