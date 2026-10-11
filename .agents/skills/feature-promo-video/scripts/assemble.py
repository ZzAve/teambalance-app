# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy"]
# ///
"""Join intro card + narrated take + outro card into one mp4 with the voice-over, and optionally the
theme song as a music bed.

  uv run assemble.py <take.webm | take-dir> <take.log> <clips.json> <cards-dir> <out.mp4> [--song <song.json>] [--cut <s>]

take.log is the harness output with `CAPTION_AT <ms> <caption>` lines; a caption's clip starts at
intro length + caption time + TAKE_OFFSET. __intro plays over the intro card, __outro over the outro.
Fails when a clip runs into the next one or a silence between lines is longer than MAX_GAP.

With --song, the song starts at 0 and its real ending lands on the last frame: whole bars are skipped
from the middle and the outro card is sized to fit. Without --cut it renders the three best cut
candidates as <out>-cut<s>.mp4 for a listening round; re-run with the chosen --cut.
"""
import argparse
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TO_MP4 = os.path.join(HERE, '..', '..', 'demo-video', 'scripts', 'to-mp4.sh')
FPS, FADE = 25, 0.4
INTRO_MIN, INTRO_VOICE_AT = 5.0, 1.5     # the song's opening plays before the voice starts
OUTRO_VOICE_AT, OUTRO_TAIL = 0.4, 1.3
TAKE_OFFSET = 0.2                        # the recording starts about this long before the steps module's clock
WARN_GAP, MAX_GAP = 2.0, 3.5             # silence between two lines in the take
VOICE_LUFS = -16
OPEN_DB, CARD_DB, APP_DB, RAMP = -3, -15, -21, 1.0   # music relative to the voice; no ducking under speech
XFADE = 0.3
X264 = ['-c:v', 'libx264', '-preset', 'slow', '-qp', '16', '-x264-params',
        'aq-mode=0:scenecut=0:keyint=600:no-mbtree=1', '-pix_fmt', 'yuv420p']
BT709 = 'setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709'


def run(*cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw).stdout


def duration(path):
    return float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path))


def card(png, seconds, width, height, out):
    fades = f'fade=in:d={FADE},fade=out:st={seconds - FADE:.3f}:d={FADE}'
    run('ffmpeg', '-y', '-loop', '1', '-framerate', str(FPS), '-t', f'{seconds:.3f}', '-i', png,
        '-vf', f'scale={width}:{height},setsar=1,{fades},{BT709}', *X264, out)


def mono(path, rate=22050):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(rate), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32), rate


class Song:
    def __init__(self, path):
        meta = json.load(open(path))
        self.file = os.path.join(os.path.dirname(os.path.abspath(path)), meta['file'])
        self.lufs, self.bar, self.first = meta['lufs'], 4 * 60 / meta['bpm'], meta['firstDownbeat']
        self.length = duration(self.file)
        x, rate = mono(self.file)
        n, hop = 2048, 512
        frames = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
        self.spec = np.log1p(np.abs(np.fft.rfft(frames, axis=1)))
        self.t = np.arange(len(self.spec)) * hop / rate

    def novelty(self, at):
        """How different the two bars after `at` sound from the two bars before: a section change."""
        a = self.spec[(self.t >= at - 2 * self.bar) & (self.t < at)].mean(0)
        b = self.spec[(self.t >= at) & (self.t < at + 2 * self.bar)].mean(0)
        return 1 - a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

    def strongest_late_onset(self, last=20):
        flux = np.maximum(np.diff(self.spec, axis=0), 0).sum(1)
        late = self.t[1:] > self.length - last
        return self.t[1:][late][np.argmax(flux[late])]

    def cuts(self, skip, earliest, latest):
        """Downbeats where a skip of `skip` bars can cut, best section change (head + tail) first."""
        downbeats = self.first + self.bar * np.arange(int(self.length / self.bar))
        ok = [d for d in downbeats if earliest <= d <= latest and d + skip * self.bar + 4 * self.bar < self.length]
        return sorted(ok, key=lambda d: -(self.novelty(d) + self.novelty(d + skip * self.bar)))


def music_filter(song, cut, skip, length, intro_end, outro_start):
    """Song from 0, `skip` bars cut out at `cut` with a short crossfade, levels per part of the video.
    Inputs: 1 and 2 are the song (head and tail), 3 is the voice track."""
    g = lambda db: 10 ** (db / 20) * 10 ** ((VOICE_LUFS - song.lufs) / 20)
    op, card_, app = g(OPEN_DB), g(CARD_DB), g(APP_DB)
    hold = INTRO_VOICE_AT / 2
    ramp = lambda t0, a, b, rest: (f"if(lt(t,{t0 - RAMP / 2}),{a},if(lt(t,{t0 + RAMP / 2}),"
                                   f"{a}+({b}-{a})*(t-{t0 - RAMP / 2})/{RAMP},{rest}))")
    volume = (f"if(lt(t,{hold}),{op},if(lt(t,{INTRO_VOICE_AT}),{op}+({card_}-{op})*(t-{hold})/{INTRO_VOICE_AT - hold},"
              + ramp(intro_end, card_, app, ramp(outro_start, app, card_, card_)) + '))')
    resume = cut + skip * song.bar
    return (f"[1:a]atrim=0:{cut + XFADE / 2},asetpts=PTS-STARTPTS[h];"
            f"[2:a]atrim={resume - XFADE / 2}:{song.length},asetpts=PTS-STARTPTS[tl];"
            f"[h][tl]acrossfade=d={XFADE}:c1=tri:c2=tri,afade=t=in:d=0.02,aresample=48000,"
            f"volume='{volume}':eval=frame,apad,atrim=0:{length}[m];"
            f"[3:a]aresample=48000[v];[v][m]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    for name in ('take', 'log', 'clips', 'cards', 'out'):
        p.add_argument(name)
    p.add_argument('--song', help='song json (bpm, firstDownbeat, lufs, file)')
    p.add_argument('--cut', type=float, help='song time to cut at, from a previous candidate round')
    a = p.parse_args()

    take = a.take if a.take.endswith('.webm') else max(glob.glob(os.path.join(a.take, '*.webm')), key=os.path.getmtime)
    clips = json.load(open(a.clips))
    captions = [(int(ms) / 1000, text) for ms, text in re.findall(r'^CAPTION_AT (\d+) (.*)$', open(a.log).read(), re.M)]
    missing = [text for _, text in captions if text not in clips]
    if missing:
        sys.exit(f'no clip for captions (re-run narrate.py?): {missing}')

    tmp = tempfile.mkdtemp(prefix='promo-')
    take_mp4 = os.path.join(tmp, 'take.mp4')
    width, height = run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                        '-of', 'default=nw=1:nk=1', take).split()
    subprocess.run([TO_MP4, take_mp4, take], check=True, capture_output=True,
                   env={**os.environ, 'W': width, 'H': height, 'FPS': str(FPS)})
    take_len = duration(take_mp4)
    intro_len = max(INTRO_MIN, INTRO_VOICE_AT + clips['__intro']['seconds'] + 0.4)
    outro_len = OUTRO_VOICE_AT + clips['__outro']['seconds'] + OUTRO_TAIL

    song = Song(a.song) if a.song else None
    outro_voice_at = OUTRO_VOICE_AT
    if song:
        # Skip as many whole bars as still leave room for the outro; the outro card absorbs the rest.
        skip = int((song.length - intro_len - take_len - outro_len) / song.bar)
        outro_len = song.length - skip * song.bar - intro_len - take_len
        # The song's end is on the last frame, so its strongest late beat has a fixed video time.
        # Start "Try it today!" just before it, as far as the outro card allows.
        hook = song.strongest_late_onset() - song.length + intro_len + take_len + outro_len
        latest = outro_len - clips['__outro']['seconds'] - 0.5
        outro_voice_at = min(max(hook - intro_len - take_len - 0.2, OUTRO_VOICE_AT), latest)
    total = intro_len + take_len + outro_len

    placed = [(INTRO_VOICE_AT, '__intro')]
    placed += [(intro_len + t + TAKE_OFFSET, text) for t, text in captions]
    placed += [(intro_len + take_len + outro_voice_at, '__outro')]
    gaps = []
    for (start, text), (next_start, next_text) in zip(placed, placed[1:]):
        end = start + clips[text]['seconds']
        assert end <= next_start, f'"{text}" ends at {end:.2f}s, after "{next_text}" starts at {next_start:.2f}s'
        if text != '__intro' and next_text != '__outro' and next_start - end > WARN_GAP:
            gaps.append((next_start - end, start, text))
    for gap, start, text in gaps:
        print(f'silence {gap:.1f}s at {start:.1f}s after "{text}"')
    if any(gap > MAX_GAP for gap, _, _ in gaps):
        sys.exit(f'silence over {MAX_GAP}s: shorten the hold or start the next line sooner (dead air)')

    card(os.path.join(a.cards, 'intro.png'), intro_len, width, height, os.path.join(tmp, 'intro.mp4'))
    card(os.path.join(a.cards, 'outro.png'), outro_len, width, height, os.path.join(tmp, 'outro.mp4'))
    concat = os.path.join(tmp, 'concat.txt')
    open(concat, 'w').write(''.join(f"file '{tmp}/{s}.mp4'\n" for s in ('intro', 'take', 'outro')))
    video = os.path.join(tmp, 'video.mp4')
    run('ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', concat, '-c', 'copy', video)

    inputs, chains = [], []
    for i, (start, text) in enumerate(placed):
        inputs += ['-i', clips[text]['file']]
        chains.append(f'[{i}:a]adelay={round(start * 1000)}:all=1[c{i}]')
    voice = os.path.join(tmp, 'voice.wav')
    run('ffmpeg', '-y', *inputs, '-filter_complex',
        ';'.join(chains) + ';' + ''.join(f'[c{i}]' for i in range(len(placed)))
        + f'amix=inputs={len(placed)}:normalize=0,apad,atrim=0:{total},loudnorm=I={VOICE_LUFS}:TP=-1.5:LRA=11,aresample=48000[a]',
        '-map', '[a]', voice)

    def mux(audio_args, graph, out):
        run('ffmpeg', '-y', '-i', video, *audio_args, '-filter_complex', graph, '-map', '0:v', '-map', '[a]',
            '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{total:.3f}', '-movflags', '+faststart', out)

    summary = f'{total:.1f}s ({intro_len:.1f} intro + {take_len:.1f} take + {outro_len:.1f} outro), {len(placed)} clips'
    if not song:
        mux(['-i', voice], '[1:a]anull[a]', a.out)
        print(f'wrote {a.out}: {summary}')
        return

    outro_start = intro_len + take_len
    print(f'music: song from 0, {skip} bars skipped; strongest late beat at {hook:.1f}s, outro voice at {outro_start + outro_voice_at:.1f}s')
    song_inputs = ['-i', song.file, '-i', song.file, '-i', voice]
    graph = lambda cut: music_filter(song, cut, skip, total, intro_len, outro_start)
    if a.cut is not None:
        mux(song_inputs, graph(a.cut), a.out)
        print(f'wrote {a.out}: {summary}; cut {a.cut:.2f}s -> {a.cut + skip * song.bar:.2f}s')
        return
    print('cut candidates (song time = video time, since the song starts at 0):')
    base, ext = os.path.splitext(a.out)
    # A late cut "did not flow" in review; an early one went unnoticed. Keep it in the first third.
    for cut in song.cuts(skip, earliest=intro_len + 1, latest=total / 3)[:3]:
        out = f'{base}-cut{cut:.2f}{ext}'
        mux(song_inputs, graph(cut), out)
        print(f'  {cut:6.2f}s -> {cut + skip * song.bar:6.2f}s  novelty {song.novelty(cut):.3f} + '
              f'{song.novelty(cut + skip * song.bar):.3f}  {out}')
    print('Listen, pick one, and re-run with --cut <s>.')


if __name__ == '__main__':
    main()
