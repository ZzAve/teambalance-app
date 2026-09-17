# Brag Plan: TeamBalance

## What is this app?

TeamBalance is a team-management app for amateur sports clubs that tracks event
attendance — and doesn't just count who said yes, it tells you whether the answers
you got actually add up to a team you can field.

## The angle

Every amateur team already has a way to ask "who's in on Tuesday?" — it's called the
group chat, and it's terrible. But the obvious pitch ("replace your WhatsApp poll")
is the boring half of what TeamBalance actually does.

The real angle is the thing a poll fundamentally cannot do: **a headcount is not a
lineup.** Six people saying yes means nothing if all six are setters. TeamBalance
resolves every response against the team's positions and gives you a one-glance
verdict — `Lineup set`, `2 spots open`, `Missing a position` — plus the line that
makes it feel like it was built by someone who's actually been the one sending the
reminders: *"Middle still has no one — the one to chase."*

That's specific, it's shipped, and no generic scheduling tool says it. The video is
built around that single realisation and nothing else.

## Hook (first 2-3 seconds)

Two lines of type on the app's own cream background. No UI yet.

> **Six said yes.**
> **You still don't have a team.**

The second line lands in the app's semantic red (`#D93025`). It's a contradiction the
viewer immediately recognises from their own team, and it sets up the reveal: the app
is about to explain *why*.

## Key moments (the middle)

- The real `EventCard` for `Setpoint VT — VC Zaanstad D2`, with the answer row showing
  the viewer already answered — pill reads `You're in` — while the readiness chip beside
  it reads `Missing a position` in red. The tension of the hook, now on a real screen.
- The chip expands into the roster panel: `Positions · 2 of 3 covered`, position rows
  with filled/open dot pips arriving one by one, then the nudge line
  *"Middle still has no one — the one to chase."*
- One tap fixes it: a teammate's `Awaiting` pill opens the three-way control, `Going`
  is chosen, and the card's red `Missing a position` chip flips to green `Lineup set`.
- Pull back to the real events list — the green `NEXT UP` hero with `I'm in` /
  `Can't make it`, then Match, Training and Team dinner cards arriving underneath.

## Outro / punchline

The wordmark, then the line the whole video earned:

> **Know your lineup before you get to the hall.**

## User flow worth showing

Entry → key action → result, all three shipped and all three in the video:

1. **Entry** — land on the Events tab, `NEXT UP` hero leading a flat chronological list.
2. **Key action** — tap an answer. Either the hero's `I'm in`, or a card's answer pill
   expanding to the inline `Going / Maybe / Can't` control. No navigation either way.
3. **Result** — the pill flips optimistically, the card tints, and the readiness chip
   recomputes from red to green. Scene 3 *is* this beat.

## Tone

- **Preset:** `default`
- **Creative direction:** built by someone who has been the one chasing the group chat
- **Interpretation:** Warm and unhurried, not a hype reel. The product is genuinely
  well-made and earnest, so the video earns its brag by showing one real problem being
  really solved rather than stacking feature claims. Comfortable 4-6 second scenes,
  clean crossfades, mixed case, no ALL CAPS, no exclamation marks. The only joke is the
  one the product already tells about itself ("the one to chase").

## Format: landscape — 1920x1080
## Duration: 21 seconds

## Visual identity (from the project)

Source: `design-tokens/tokens.css` (the unlayered file that wins at runtime).

- **Background:** `#F8F6F0` (warm off-white — not white)
- **Card:** `#FEFDFB`
- **Accent / primary:** `#225C9C` (blue)
- **Text:** `#1E293B` primary, `#64748B` secondary, `#94A3B8` muted
- **Semantic attendance:** `#249E6C` attending / `#F4B400` maybe / `#D93025` absent
  — fixed brand identity per CONTEXT.md, must not be recoloured
- **Display font:** Grandstander (wordmark, titles, stats only)
- **Body font:** DM Sans (everything else)
- **Radii:** 8 / 12 / 16 / 9999px · **Shadows:** warm-tinted `rgba(120, 80, 40, …)`, never neutral black
- **Spring easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — the app's own motion signature; use it for pill and chip flips
- **Strongest visual element:** the two-sided answer row on an `EventCard` — your own
  answer pill on the left, the computed readiness verdict on the right
- **Reference screenshots (real, in-repo):** `app/public/screenshots/events-wide.png`
  (2560x1600), `events-narrow.png` (780x1688)
- **Logo:** `app/public/tb-monogram.svg`. The wordmark itself is styled text, not an asset:
  `Team` in `#225C9C` + `Balance` in `#249E6C`.

## Share copy (draft)

Built TeamBalance, a team app for amateur clubs. It doesn't just count who said yes —
it tells you whether you can actually field a team.

## Audio direction

- **Role:** warm bed with sparse, motion-matched UI accents
- **Music:** `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` (114.84 BPM, 87.6s)
  — chosen over vol-10 because its strong cues are spread across the whole 0-25s window
  rather than bunched at the end
- **Music treatment:** in from 0.0s under the hook, held low beneath the UI scenes so the
  interface sounds lead, gentle lift into the outro, fade out over the final second
- **Music cue guidance:** preset read from
  `assets/music/cues/happy-beats-business-moves-vol-11-by-ende-dot-app.music-cues.json`.
  Target strong cues: **1.60s** (hook line 2), **3.70s** (cut to the card), **8.96s**
  (the nudge line), **12.65s** (the chip flips green), **17.91s** (wordmark).
  Beat-grid windows for sequential reveals: position rows **5.80 / 6.34 / 6.86**;
  event cards **14.76 / 15.28 / 15.81**.
- **Audio-reactive treatment:** none. The app's visual language is flat colour and warm
  shadow — no glows, no waveforms, nothing that breathes with the music.
- **SFX posture:** sparse and motion-matched. A soft tick per position row, one click on
  the simulated tap, one warmer confirm on the chip turning green. Nothing on text.
- **Audio-coupled moments:** position rows arriving one by one; the simulated tap on
  `Going`; the readiness chip flipping red → green.
- **Restraint rule:** no riser, no whoosh, no impact hit on the wordmark. The product is
  calm and so is the video. If a cue would make this feel like an ad, drop it.

## Storyboard

### Scene 1 — Six said yes — 4.0s (0.0 → 4.0)
Cream `#F8F6F0`, nothing else. Grandstander bold, `#1E293B`, centred, large.
`Six said yes.` fades up at 0.3s and settles. At **1.60s** (strong cue) the second line
arrives beneath it in `#D93025`: `You still don't have a team.` Both hold together to
the cut — this is the hook and it gets the longest read in the video.
Sequential/interaction: yes — two lines, second gated to the strong cue, both held.
Audio intent: music establishes alone, confident and unhurried. No SFX on text.
Audio-coupled idea: none — resist ticking the type.
Music: warm, mid-energy, already moving.
Transition mood: clean → Scene 2

### Scene 2 — The card already knew — 6.5s (4.0 → 10.5)
Cut on **3.70s**. A single `EventCard` on the cream background, recreated in the app's
real styling: blue date chit `VR / 18 / SEP`, `MATCH` badge, title
`Setpoint VT — VC Zaanstad D2`, meta line `19:00 · Sporthal De Vliet`.
The answer row resolves: left pill `You're in` in green, right chip `Missing a position`
in red. Hold the contradiction for a beat.
Then the chip expands into the roster panel: header `Positions` with `2 of 3 covered`,
and position rows arriving one at a time on **5.80 / 6.34 / 6.86** with filled and open
dot pips. At **8.96s** (strong cue) the nudge line settles beneath them:
`Middle still has no one — the one to chase.` It holds ~2.7s to the cut — it is the
longest line in the video and the one that has to land.
Sequential/interaction: yes — three position rows appear one by one on the beat grid;
the readiness chip expands the panel rather than the panel simply existing.
Audio intent: the interface takes over from the music; small, dry, precise.
Audio-coupled idea: one soft UI tick per position row. Nothing under the nudge line.
Music: drops in level under the UI, keeps the pulse.
Transition mood: clean → Scene 3

### Scene 3 — One tap — 3.7s (10.5 → 14.2)
Same card, now showing an attendee row. A teammate's pill reads `Awaiting`. A simulated
tap opens the three-way control `Going / Maybe / Can't go`; a second tap selects
`Going` and the pill flips green with the app's spring easing.
At **12.65s** (strong cue) the card's readiness chip flips from red `Missing a position`
to green `Lineup set`. No caption — the flip from red to green is the payoff, and a
line explaining it would only restate what the chip already says.
Sequential/interaction: yes — a simulated two-step tap (open the control, choose Going),
then the chip flip as its consequence. The causation must read clearly.
Audio intent: one clean click, then a warmer confirm. The payoff of the hook.
Audio-coupled idea: click on the tap; softer confirm tone on the chip turning green.
Music: lifts slightly as the chip goes green.
Transition mood: soft → Scene 4

### Scene 4 — The whole season — 3.0s (14.2 → 17.2)
Pull back to the real events list, recreated from `events-wide.png`. The green `NEXT UP`
hero leads: `Training`, `di 15 sep · 20:00`, `Sporthal De Vliet`, `4 going · you're in`,
`1d AWAY`, with `I'm in` and `Can't make it` as full-width pills. Beneath it the cards
arrive on **14.76 / 15.28 / 15.81**: blue `MATCH`, green `TRAINING`, gold `OTHER —
Team dinner`. The bottom nav sits at the base: `Events · Team · Money · Profile`.
Caption, quiet, in DM Sans: `Every training, match and team dinner.`
Sequential/interaction: yes — three event cards arrive one by one on the beat grid.
Audio intent: breathe out. The problem is solved; this is the scope.
Audio-coupled idea: the three card arrivals may take the lightest possible accent, or
none. Do not stack three identical ticks here after Scene 2 already used them.
Music: back up to full, opening toward the outro.
Transition mood: soft → Scene 5

### Scene 5 — TeamBalance — 3.8s (17.2 → 21.0)
Cream. At **17.91s** (strong cue) the wordmark scales in with the spring easing:
`Team` in `#225C9C` + `Balance` in `#249E6C`, Grandstander bold, large.
Beneath it in DM Sans `#64748B`: `Know your lineup before you get to the hall.`
Then, smaller and muted: `teambalance.nl`
Everything holds to the end. Music fades over the final second.
Sequential/interaction: none — wordmark, line, URL, each settling in turn.
Audio intent: warm close. No impact hit, no riser — the restraint rule applies hardest here.
Audio-coupled idea: none.
Music: gentle lift, then fade to silence on the last frame.
Transition mood: hold to end

**Music mood for this video:** upbeat but warm — confident, not hyped.
**Audio summary:** Music carries the hook alone, steps back so the interface sounds can
do the middle three scenes, then lifts and fades under the wordmark.

---

## Deviations from the skill's defaults, and why

**1. The Money pool is deliberately absent from the video.**
`www/index.html` positions the product as *"Event attendance and shared money pool for
sports teams."* and `CONTEXT.md` documents a full money-pool vocabulary — Beer Counter,
Top-up, Hall of Fame / Hall of Shame. The Beer Counter in particular is the single
funniest thing in the domain model and would make excellent video.

None of it is built. `app/src/routes/t/$slug/money/index.tsx` renders only
`MoneyTeaser` — a coming-soon card reading *"A shared team pot is on its way"* with an
`I want this` button. There is no balance, no Bunq integration, no top-up flow.

Showing a balance screen would be inventing a feature. That's also against the grain of
the codebase itself: `MoneyTeaserView.tsx` carries the comment *"a headline number with
no backend behind it is not [honest]"* and the most recent commit on `main` is
`fix(app): the money teaser no longer invents an interest count`. A launch video that
invents the whole feature would contradict the product's own standard.

So the outro uses `Know your lineup before you get to the hall.` rather than the www
tagline. If the money pool ships, that scene is the natural place to restore the
official line.

**2. Tone is `default`, not `polished`.**
`polished` is the preset for "projects that are not jokes", which TeamBalance isn't. But
the product's own voice — *"the one to chase"*, *"Nothing needs your answer."* — is warm
and wry rather than premium, and `default` ("the product gets to be funny on its own
terms") matches it. Scene count and pacing follow `default`: 5 scenes, 3.5-6.0s each.

**3. Five scenes rather than the pattern's four.**
Hook → Reveal → Highlight → Highlight → Outro. Scenes 2 and 3 are a single argument
split across a cut — the problem, then the fix — and merging them would either rush the
nudge line below its reading floor or bury the chip flip that pays off the hook.

## Reading-time audit

Every line, against the skill's floor (short label ~0.8s settled, sentence ~0.3s/word,
minimum 1.2s):

| Line | Words | Floor | Settled | OK |
|---|---|---|---|---|
| `Six said yes.` | 3 | 1.2s | 1.3s | ✓ |
| `You still don't have a team.` | 6 | 1.8s | 2.1s | ✓ |
| `Missing a position` | 3 | 0.9s | 1.8s | ✓ |
| `2 of 3 covered` | 4 | 1.2s | 4.9s | ✓ |
| `Middle still has no one — the one to chase.` | 9 | 2.7s | 2.72s | ✓ |
| `Lineup set` | 2 | 0.8s | 1.2s | ✓ |
| `Every training, match and team dinner.` | 6 | 1.8s | 1.95s | ✓ |
| `Know your lineup before you get to the hall.` | 8 | 2.4s | 2.45s | ✓ |

The nudge line in Scene 2 is the tightest at exactly its floor. If the composition needs
slack, take it from the pre-expansion hold at the top of Scene 2, not from the line.

## Scene duration check

4.0 + 6.5 + 3.7 + 3.0 + 3.8 = **21.0s** — inside 15-25, inside the 18-22 sweet spot.

The split moved during composition. The first draft gave Scene 2 6.0s, which left the
nudge line only 1.04s of settled time against a 2.7s floor — the draft's own audit table
was wrong about it. Scene 2 took 0.5s and Scene 5 took 0.3s from Scenes 3 and 4, which
had slack. Total is unchanged.


---

## What shipped

Rendered to `brag.mp4` — 1920x1080, 21.0s, 630 frames, H.264 + AAC, 1.7 MB.
Poster `brag.jpg` pulled from **9.5s** (the card with the panel open and the nudge line
settled) and baked as frame 0, so every player's idle thumbnail is that frame.

`npx hyperframes check`: **0 errors, 49/49 WCAG AA text checks pass.**

Three deviations from this plan, made while composing and verified in the frames:

1. **Roster numbers changed to `2 of 3 covered`.** The brief said `3 of 5 covered` but
   only three position rows fit the scene's reading budget, so the header contradicted
   what was on screen. Three rows — Setter 2/2, Outside 2/2, Middle 0/1 — make the
   header, the `Missing a position` chip and the nudge line all agree, and the Scene 3
   fix then genuinely completes the set.
2. **Scene 3's caption was cut.** The chip flipping red → green says it; a caption
   restating it was noise, and dropping it bought the scene the hold it needed.
3. **The hero's secondary button was darkened** to `rgba(20, 90, 60, 0.5)`. White on the
   app's own translucent-white treatment measured 2.76:1 against the green gradient and
   failed the WCAG gate at 3:1. It still reads as the quieter of the two buttons.

Two `check` findings are left standing deliberately:

- **`composition_file_too_large` (325 lines).** Splitting five scenes into
  sub-compositions would add indirection to a one-off file with no reuse. Warning, not an
  error.
- **7 `content_overlap` infos.** All land at t=4.25 / 10.75 / 14.38 — the three 0.35s
  crossfade windows, where two scenes are briefly co-visible by design. Suppressing them
  on the scene roots would hide genuine overlaps later.
