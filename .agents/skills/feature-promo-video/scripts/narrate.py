# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["kokoro==0.9.4", "soundfile", "pip"]
# ///
"""Voice every spoken line of a narration file with Kokoro TTS.

  uv run narrate.py docs/demo/<feature>.narration.json <out-dir> [voice] [speed]

Writes <out-dir>/line-NN.wav and <out-dir>/clips.json ({caption: {file, seconds}}). Pass clips.json
to the take as NARRATION=… and to assemble.py. Keys whose value is not a string (the card texts)
are skipped.

Each sentence is its own part, joined by 350 ms of silence; a `|` in the spoken text splits a part
with a 300 ms pause (Kokoro barely pauses at a comma). Every part is trimmed to its sound, and a
trailing hiss Kokoro adds after the last word (bf_alice does this on every part) is cut.
"""
import json
import os
import re
import shutil
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline
from phonemizer.backend.espeak.wrapper import EspeakWrapper

# espeak-ng truncates its data path at about 160 characters, and phonemizer resolves symlinks,
# so a deep venv path fails with "Error processing file '.../phontab'". Use a short copy.
SHORT_ESPEAK = '/tmp/kokoro-espeak/espeak-ng-data'
if not os.path.isdir(SHORT_ESPEAK):
    import espeakng_loader
    shutil.copytree(espeakng_loader.get_data_path(), SHORT_ESPEAK)
EspeakWrapper.set_data_path(SHORT_ESPEAK)

RATE = 24000
narration_path, out_dir = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else 'bf_alice'
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.1

FRICATIVES = set('szʃʒfvθð')


def trim(audio, db=-45, keep=0.04):
    loud = np.flatnonzero(np.abs(audio) > 10 ** (db / 20))
    pad = int(keep * RATE)
    return audio[max(0, loud[0] - pad):loud[-1] + pad]


def drop_tail_hiss(audio, phonemes):
    """Cut the unvoiced noise after the last voiced 10 ms frame, unless the part really ends in a
    fricative ("the marks.")."""
    last = re.sub(r'[^\w]', '', phonemes)[-1:]
    if last in FRICATIVES:
        return audio
    n = RATE // 100
    frames = audio[:len(audio) // n * n].reshape(-1, n)
    spec = np.abs(np.fft.rfft(frames * np.hanning(n), axis=1)) ** 2
    high = spec[:, np.fft.rfftfreq(n, 1 / RATE) > 4000].sum(1) / (spec.sum(1) + 1e-12)
    level = 10 * np.log10(np.mean(frames ** 2, axis=1) + 1e-12)
    voiced = np.flatnonzero((high < 0.5) & (level > level.max() - 40))
    end = min(len(audio), (voiced[-1] + 2) * n)
    out = audio[:end].copy()
    fade = min(len(out), int(0.015 * RATE))
    out[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    return out


def part(text):
    chunks = list(pipe(text, voice=voice, speed=speed))
    audio = np.concatenate([a.numpy() if hasattr(a, 'numpy') else a for _, _, a in chunks])
    return drop_tail_hiss(trim(audio), chunks[-1][1])


lines = {k: v for k, v in json.load(open(narration_path)).items() if isinstance(v, str)}
os.makedirs(out_dir, exist_ok=True)
pipe = KPipeline(lang_code=voice[0])  # a = American, b = British
sentence_pause = np.zeros(int(0.35 * RATE), dtype=np.float32)
marker_pause = np.zeros(int(0.3 * RATE), dtype=np.float32)
clips = {}
for i, (caption, spoken) in enumerate(lines.items()):
    parts = []
    for sentence in re.split(r'(?<=[.!?])\s+', spoken.strip()):
        for j, piece in enumerate(p.strip() for p in sentence.split('|')):
            if parts:
                parts.append(marker_pause if j else sentence_pause)
            parts.append(part(piece))
    audio = np.concatenate(parts)
    wav = os.path.abspath(os.path.join(out_dir, f'line-{i:02d}.wav'))
    sf.write(wav, audio, RATE)
    clips[caption] = {'file': wav, 'seconds': round(len(audio) / RATE, 3)}
    print(f'{len(audio) / RATE:5.2f}s  {spoken[:70]}', flush=True)
json.dump(clips, open(os.path.join(out_dir, 'clips.json'), 'w'), indent=1, ensure_ascii=False)
