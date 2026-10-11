"""Join intro card + narrated take + outro card into one mp4 with the voice-over mixed in.

  python3 assemble.py <take.webm> <take.log> <clips.json> <cards-dir> <out.mp4>

take.log is the harness output with the steps module's `CAPTION_AT <ms> <caption>` lines. Each
caption's clip starts at intro length + caption time + TAKE_OFFSET; __intro plays over the intro
card, __outro over the outro card. Fails if a clip would still be playing when the next one starts.
Needs only ffmpeg; the video encoding is demo-video's to-mp4.sh.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
TO_MP4 = os.path.join(HERE, '..', '..', 'demo-video', 'scripts', 'to-mp4.sh')
INTRO_MIN, INTRO_LEAD, OUTRO_TAIL, FADE = 4.0, 0.5, 1.3, 0.4
TAKE_OFFSET = 0.2  # the recording starts about this long before the steps module's clock does
FPS = 25
X264 = ['-c:v', 'libx264', '-preset', 'slow', '-qp', '16', '-x264-params',
        'aq-mode=0:scenecut=0:keyint=600:no-mbtree=1', '-pix_fmt', 'yuv420p']
BT709 = 'setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709'


def run(*cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw).stdout


def probe(path, entry):
    return run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', entry,
               '-of', 'default=nw=1:nk=1', path).split()


def card(png, seconds, width, height, out):
    fades = f'fade=in:d={FADE},fade=out:st={seconds - FADE:.3f}:d={FADE}'
    run('ffmpeg', '-y', '-loop', '1', '-framerate', str(FPS), '-t', f'{seconds:.3f}', '-i', png,
        '-vf', f'scale={width}:{height},setsar=1,{fades},{BT709}', *X264, out)


def main(take, log, clips_path, cards, out):
    clips = json.load(open(clips_path))
    captions = [(int(ms) / 1000, text) for ms, text in re.findall(r'^CAPTION_AT (\d+) (.*)$', open(log).read(), re.M)]
    missing = [text for _, text in captions if text not in clips]
    if missing:
        sys.exit(f'no clip for captions (re-run narrate.py?): {missing}')

    tmp = tempfile.mkdtemp(prefix='promo-')
    take_mp4 = os.path.join(tmp, 'take.mp4')
    width, height = probe(take, 'stream=width,height')
    subprocess.run([TO_MP4, take_mp4, take], check=True, capture_output=True,
                   env={**os.environ, 'W': width, 'H': height, 'FPS': str(FPS)})
    take_len = float(probe(take_mp4, 'format=duration')[0])
    intro_len = max(INTRO_MIN, INTRO_LEAD + clips['__intro']['seconds'] + 0.5)
    outro_len = clips['__outro']['seconds'] + OUTRO_TAIL
    card(os.path.join(cards, 'intro.png'), intro_len, width, height, os.path.join(tmp, 'intro.mp4'))
    card(os.path.join(cards, 'outro.png'), outro_len, width, height, os.path.join(tmp, 'outro.mp4'))

    placed = [(INTRO_LEAD, '__intro')]
    placed += [(intro_len + t + TAKE_OFFSET, text) for t, text in captions]
    placed += [(intro_len + take_len, '__outro')]
    for (start, text), (next_start, next_text) in zip(placed, placed[1:]):
        end = start + clips[text]['seconds']
        assert end <= next_start, f'"{text}" ends at {end:.2f}s, after "{next_text}" starts at {next_start:.2f}s'

    concat = os.path.join(tmp, 'concat.txt')
    open(concat, 'w').write(''.join(f"file '{tmp}/{s}.mp4'\n" for s in ('intro', 'take', 'outro')))
    video = os.path.join(tmp, 'video.mp4')
    run('ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', concat, '-c', 'copy', video)

    inputs, chains = [], []
    for i, (start, text) in enumerate(placed):
        inputs += ['-i', clips[text]['file']]
        ms = round(start * 1000)
        chains.append(f'[{i + 1}:a]adelay={ms}|{ms}[a{i}]')
    mix = (';'.join(chains) + ';' + ''.join(f'[a{i}]' for i in range(len(placed)))
           + f'amix=inputs={len(placed)}:normalize=0,loudnorm=I=-16:TP=-1.5,aresample=48000,apad[a]')
    total = intro_len + take_len + outro_len
    run('ffmpeg', '-y', '-i', video, *inputs, '-filter_complex', mix, '-map', '0:v', '-map', '[a]',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-t', f'{total:.3f}', '-movflags', '+faststart', out)
    print(f'wrote {out}: {total:.1f}s ({intro_len:.1f} intro + {take_len:.1f} take + {outro_len:.1f} outro), {len(placed)} clips')


if __name__ == '__main__':
    if len(sys.argv) != 6:
        sys.exit(__doc__)
    main(*sys.argv[1:])
