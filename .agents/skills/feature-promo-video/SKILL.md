---
name: feature-promo-video
description: Make a TeamBalance feature promo video, about 90 s of portrait phone recording of the real SPA with a British voice-over (Kokoro TTS), captions, and branded intro and outro cards. Use when the user wants a promo, launch or "what's new" video for a TeamBalance feature, new or old, in the style of the calendar-links video. Builds on the demo-video skill for recording and encoding.
---

# feature-promo-video: narrated portrait promo for one feature

Reference result: the calendar-links video (`docs/demo/calendar-links.*`). This skill adds the voice, the cards and the assembly. Recording, the pointer helpers and the `-qp` encoding come from the `demo-video` skill. Read its SKILL.md first.

## Per-feature files (in `docs/demo/`)

- `<feature>.steps.mjs`: the take. Copy `calendar-links.steps.mjs` and keep its `speak` / `untilLineEnds` / `say` helpers, the phone caption and the touch-dot styling. Drive the real SPA against `api-fixture.mjs` (add fixture endpoints there; see `docs/demo/README.md`).
- `<feature>.narration.json`: maps each caption text, exactly as the steps module passes it, to the spoken line. Plus:
  - `__intro` / `__outro`: spoken over the intro and outro cards.
  - `__introCard`: `{ headline, accent, sub, pill }`. `accent` is the blue second line of the headline.
  - `__outroCard`: `{ steps, sub }`. `steps` is three chips, each `"Label"` or `{ "label", "icon" }` with a lucide icon name (`calendar-days`). The headline is always "Try it today." and the footer `teambalance.nl`.

## Script checklist (apply before recording; ask the user when feedback is ambiguous, do not guess)

- [ ] About 90 s at most.
- [ ] No dead air: the action a line names starts while the line is spoken, at most about 500 ms after it starts. Use `speak()` then act then `untilLineEnds()`; never `say()` before an action it names.
- [ ] One idea per caption. "X. To do Y, start with Z" becomes two captions with a short hold between them.
- [ ] Several buttons in one line: move the pointer to each button as the line names it.
- [ ] Combine related beats instead of adding new ones.
- [ ] Say "new" / "is live" / "live now" once at most. The intro card's pill already says it, so the voice does not read the pill.
- [ ] Spoken lines can be livelier and shorter than the captions. Spell out symbols ("the marks", not "tick, question mark and cross").
- [ ] The ending is the outro card. `__outro` is like "Try it today! … See you at TeamBalance dot N L!" Proper English, no "Live now".

## Pipeline (from the repo root; `$OUT` is a scratch directory)

1. **Voice.** Writes one wav per line and `clips.json`. Default voice `bf_alice`, speed 1.1. The user liked Alice; `bf_isabella` and `bm_george` were runners-up; they disliked Piper "Alan".
   ```bash
   uv run .agents/skills/feature-promo-video/scripts/narrate.py docs/demo/<feature>.narration.json $OUT/voice [voice] [speed]
   ```
2. **Cards.** Needs `npm --prefix app ci`. Writes `$OUT/cards/intro.png` and `outro.png`. Look at both.
   ```bash
   node .agents/skills/feature-promo-video/scripts/cards.mjs docs/demo/<feature>.narration.json $OUT/cards
   ```
3. **Take.** Build and serve the SPA with no API URL (`VITE_API_URL= npm --prefix app run build`, then `npx vite preview --port 4173 --strictPort` with cwd `app/`). Record from cwd `app/` (the harness resolves Playwright from there) and keep the log:
   ```bash
   WIDTH=390 HEIGHT=844 DSF=3 STEPS=<abs>/docs/demo/<feature>.steps.mjs BASE_URL=http://localhost:4173 \
     VIDEO_DIR=$OUT/take NARRATION=$OUT/voice/clips.json \
     node <abs>/.agents/skills/demo-video/scripts/record-harness.mjs > $OUT/take.log
   ```
   Every caption in the log needs a clip. Re-run step 1 after you change a caption's text.
4. **Assemble.** Intro card (4 s, or longer for a long `__intro`), take, outro card (`__outro` + 1.3 s), 0.4 s fades, voice mixed with `loudnorm`, AAC. It fails if a clip would overlap the next one; lengthen the hold before that caption.
   ```bash
   python3 .agents/skills/feature-promo-video/scripts/assemble.py $OUT/take/<page>.webm $OUT/take.log $OUT/voice/clips.json $OUT/cards <feature>-promo.mp4
   ```
5. **Verify.** `verify-frames.sh` from demo-video, then look at the frames. Listen to the result, or at least compare voice start times with `ffmpeg -af silencedetect=n=-40dB:d=0.3`. Put the mp4 in the repo root (`*.mp4` is gitignored) and send it to the user.

## Gotchas

- Kokoro needs Python 3.10–3.12. `narrate.py` declares this inline, so `uv run` builds the environment. On its first run it downloads the spaCy English model with pip.
- espeak-ng truncates its data path at about 160 characters ("Error processing file '.../phontab'"). `narrate.py` copies the data to `/tmp/kokoro-espeak/`. A symlink does not work, because phonemizer resolves it.
- A stale gitignored `app/src/shared/api/generated/` breaks `tsc` in the build. Delete it and run `./gradlew :api:wirespec-typescript`.
- Captions are logged relative to the steps module's start. The recording starts about 0.2 s earlier (`TAKE_OFFSET` in `assemble.py`).
