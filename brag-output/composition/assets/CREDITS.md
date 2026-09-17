# Asset credits

Assets vendored into this composition so it renders reproducibly. None of them are
TeamBalance's own work.

| File | Source | Licence |
|---|---|---|
| `audio/music.mp3` | "Happy Beats / Business Moves" vol. 11 — [ende.app](https://ende.app/en), bundled with the [`/brag`](https://github.com/latent-spaces/brag) skill | **Unverified — see note below** |
| `sfx/tick.ogg` (`ui/rollover2`), `sfx/click.ogg` (`ui/click2`), `sfx/confirm.ogg` (`interface/bong_001`) | [Kenney](https://kenney.nl/) UI/interface packs, bundled with `/brag` | CC0 |
| `fonts/grandstander.woff2`, `fonts/dm-sans.woff2` | Google Fonts (latin subset, variable) | SIL Open Font License 1.1 |
| `js/gsap.min.js` | GSAP 3.14.2 | GreenSock standard "no charge" licence |

> **Note on the music.** The `/brag` skill's own `assets/music/README.md` says: *"Before
> publishing or redistributing the skill, verify and document the exact music license
> terms alongside these files."* Those terms were not verified here. Committing this repo
> redistributes the track, so confirm the ende.app licence before publishing the video
> commercially or making this repo public. Replacing `audio/music.mp3` with any other
> track and re-running `npx hyperframes check && npm run render` reproduces the video with
> different music — the beat-sync timings in `index.html` are hard-coded to 114.84 BPM, so
> a swap wants `npx hyperframes beats` to re-derive the cue times.
