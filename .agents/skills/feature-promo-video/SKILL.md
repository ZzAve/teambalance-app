---
name: feature-promo-video
description: Make a TeamBalance feature promo video, about 90 s of portrait phone recording of the real SPA with a British voice-over (Kokoro TTS), captions, branded intro and outro cards, and the TeamBalance theme song as a music bed. Use when the user wants a promo, launch or "what's new" video for a TeamBalance feature, new or old, in the style of the calendar-links video. Builds on the demo-video skill for recording and encoding.
---

# feature-promo-video: narrated portrait promo for one feature

The reference result is the calendar-links video. Examples in `docs/demo/`: `calendar-links.*` and `substitutes.*`. This skill adds the voice, the cards, the music and the assembly. Recording, the pointer helpers and the `-qp` encoding come from the `demo-video` skill. Read its SKILL.md first.

## Per-feature files (in `docs/demo/`)

- `<feature>.steps.mjs`: the take. Start from `substitutes.steps.mjs`. Call `narratedTake({ page, caption, sleep })` from `narrated-take.mjs` first; it gives `speak` / `say` / `untilLineEnds` / `captionAt` and the phone caption and touch dot. Drive the real SPA against `api-fixture.mjs`. Before you script a beat, check that the fixture serves every endpoint the feature calls, and add what is missing. Read `docs/demo/README.md` for the gotchas.
- `<feature>.narration.json`: maps each caption text, exactly as the steps module passes it, to the spoken line. Plus:
  - `__intro` / `__outro`: spoken over the intro and outro cards.
  - `__introCard`: `{ headline, accent, sub, pill }`. `accent` is the blue second line of the headline.
  - `__outroCard`: `{ steps, sub }`. `steps` is three chips, each `"Label"` or `{ "label", "icon" }`, where `icon` is a file name from `app/node_modules/lucide-react/dist/esm/icons/` without `.mjs` (for example `calendar-days`, `user-plus`). The headline is always "Try it today." and the footer is `teambalance.nl`.

## Script checklist (apply before recording)

Ask the user when feedback is ambiguous; do not guess. With no user available, choose, and list each choice in your report.

- [ ] About 60 to 90 s. A one-flow feature can be shorter; say so rather than pad.
- [ ] Film the places where the feature really shows. Grep where its components render before you write the script.
- [ ] Start with the problem the feature solves, then the fix, then the admin or settings side.
- [ ] No dead air: the action a line names starts while the line is spoken, at most about 500 ms after it starts. Use `speak()`, then act, then `untilLineEnds()`; never `say()` before an action it names. `assemble.py` fails on a silence over 3.5 s between lines and lists the ones over 2 s.
- [ ] One idea per caption. "X. To do Y, start with Z" becomes two captions with a short hold between them.
- [ ] Several buttons in one line: move the pointer to each button as the line names it.
- [ ] Combine related beats instead of adding new ones.
- [ ] Say "new" / "is live" / "live now" once at most. The intro card's pill already says it, so the voice does not read the pill.
- [ ] Spoken lines can be livelier and shorter than the captions. Spell out symbols ("the marks", not "tick, question mark and cross"). Put `|` where a comma needs a real pause ("Your team schedule, | in your own calendar.").
- [ ] The ending is the outro card. `__outro` is like "Try it today! … See you at TeamBalance dot N L!" Proper English, no "Live now".

## Pipeline

All scripts take absolute or relative paths and can run from any directory. `$OUT` is a scratch directory per feature.

1. **Voice.** Writes one wav per line and `$OUT/voice/clips.json`. Default voice `bf_alice`, speed 1.1. The user liked Alice; `bf_isabella` and `bm_george` were runners-up; they disliked Piper "Alan".
   ```bash
   uv run .agents/skills/feature-promo-video/scripts/narrate.py docs/demo/<feature>.narration.json $OUT/voice [voice] [speed]
   ```
2. **Cards.** Needs `npm --prefix app ci`. Writes `$OUT/cards/intro.png` and `outro.png`. Look at both.
   ```bash
   node .agents/skills/feature-promo-video/scripts/cards.mjs docs/demo/<feature>.narration.json $OUT/cards
   ```
3. **Serve the SPA** with no API URL, on a free port (default 4173):
   ```bash
   VITE_API_URL= npm --prefix app run build
   app/node_modules/.bin/vite preview "$PWD/app" --port 4173 --strictPort   # in the background
   ```
4. **Probe, then record.** `PROBE=1` runs the steps fast with a screenshot per section in `$OUT/probe/`; look at them. Both modes exit non-zero when a section failed; fix the first `SECTION_FAIL`.
   ```bash
   PROBE=1 .agents/skills/feature-promo-video/scripts/record.sh docs/demo/<feature>.steps.mjs $OUT [port]
   .agents/skills/feature-promo-video/scripts/record.sh docs/demo/<feature>.steps.mjs $OUT [port]
   ```
   Every caption in `$OUT/take.log` needs a clip. Re-run step 1 after you change a caption's text.
5. **Assemble with music, in a listening round.** Without `--cut`, this writes three cut candidates as `<out>-cut<s>.mp4`. Send them to the user, ask which one flows best, then run again with `--cut <s>`. Delete the candidate files afterwards.
   ```bash
   uv run .agents/skills/feature-promo-video/scripts/assemble.py $OUT/take $OUT/take.log $OUT/voice/clips.json $OUT/cards <feature>-promo.mp4 \
     --song .agents/skills/feature-promo-video/music/teambalance-theme.json [--cut <s>]
   ```
   Leave out `--song` for a voice-only video.
6. **Verify.** Run `verify-frames.sh` from demo-video (`<mp4> <dir> 16`) and look at the frames. Check the duration with `ffprobe`. Put the mp4 and its `<name>.transcript.md` in the repo root (both are gitignored). Send the user the video and paste the transcript table in your reply. The table gives the time of each line, what is on screen and what the voice says, so the user can give feedback by time stamp.

## Music (approved on the calendar-links video)

`assemble.py` applies all of this; change it only after a listening round with the user.

- **Start and end.** The song starts at 0, so its strong opening plays first, and its real ending lands on the last frame. Whole bars are skipped from the middle; the outro card's length absorbs the remainder.
- **The cut.** It sits on a downbeat with a 0.3 s crossfade, at a section change on both sides (spectral novelty), within the first third of the video. A late cut "did not flow". An early cut went unnoticed, and one whose jump lands on a reveal felt good.
- **Hooks.** "Try it today!" starts just before the song's strongest late beat.
- **Levels.** Voice at -16 LUFS. The music is 21 dB under the voice in the app part, 15 dB under on the cards, with 1 s ramps at the card boundaries. The opening plays 3 dB under until halfway to the voice, then ramps down. The voice starts 1.5 s into a 5 s intro card. The music does not dip under speech; the user disliked that.
- **Listening rounds.** For any music or voice change, render short A/B variants, send them, and ask. Measure the music by rendering it without the voice; subtracting the voice from a mix gives a wrong reading.

## Gotchas

- Kokoro needs Python 3.10–3.12. `narrate.py` declares this inline, so `uv run` builds the environment. On its first run it downloads the spaCy English model with pip.
- `bf_alice` adds about 100 ms of hiss after the last word of every part, which sounds like an "s" ("calendars"). `narrate.py` cuts it, but not when the part really ends in a fricative ("the marks."). A voice change needs the same check: look at the share of energy above 4 kHz in each clip's last 150 ms.
- espeak-ng truncates its data path at about 160 characters ("Error processing file '.../phontab'"). `narrate.py` copies the data to `/tmp/kokoro-espeak/`. A symlink does not work, because phonemizer resolves it.
- A stale gitignored `app/src/shared/api/generated/` breaks `tsc` in the build. Delete it and run `./gradlew :api:wirespec-typescript`.
- Captions are logged relative to the steps module's start. The recording starts about 0.2 s earlier (`TAKE_OFFSET` in `assemble.py`).
