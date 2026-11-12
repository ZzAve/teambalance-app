# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["kokoro==0.9.4", "soundfile", "pip"]
# ///
"""Voice every spoken line of a narration file with Kokoro TTS.

  uv run narrate.py docs/demo/<feature>.narration.json <out-dir> [voice] [speed]

Writes <out-dir>/line-NN.wav and <out-dir>/clips.json ({caption: {file, seconds, spoken}}). Pass clips.json
to the take as NARRATION=… and to assemble.py. Keys whose value is not a string (the card texts)
are skipped.

Each line is one Kokoro call, so its sentences keep one pitch contour (one call per sentence sounded
like a string of separate utterances). Kokoro's own pauses stay; one shorter than SENTENCE_PAUSE after
.!, QUESTION_PAUSE after ? or MARKER_PAUSE at a `|` (spoken as ';', since Kokoro barely pauses at a comma) is lengthened with
silence. The line is trimmed to its sound, and a trailing hiss Kokoro adds after the last word
(bf_alice does this) is cut.
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
voice = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else 'af_bella,bf_emma'  # '' = default, to pass only a speed
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.1

FRICATIVES = set('szʃʒfvθð')
# Minimum pauses in seconds; env overrides are for listening rounds. The user preferred 0.7 / 0.4 over 0.5 / 0.3.
SENTENCE_PAUSE = float(os.environ.get('SENTENCE_PAUSE', 0.7))
MARKER_PAUSE = float(os.environ.get('MARKER_PAUSE', 0.4))
QUESTION_PAUSE = float(os.environ.get('QUESTION_PAUSE', 0.9))  # the user wanted a question to land before the answer
PAUSES = {'.': SENTENCE_PAUSE, '!': SENTENCE_PAUSE, '?': QUESTION_PAUSE, ';': MARKER_PAUSE}


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


def stretch_pauses(audio, tokens):
    """Insert silence where the pause after a sentence end or a `;` marker is shorter than its minimum.
    Kokoro puts a pause token between words; it is placed at the quietest 5 ms around that token."""
    inserts = []
    for punct, nxt in zip(tokens, tokens[1:]):
        need = PAUSES.get(punct.text)
        if need is None or not re.search(r'\w', nxt.text) or punct.start_ts is None or nxt.start_ts is None:
            continue
        have = nxt.start_ts - punct.start_ts
        if have >= need:
            continue
        n = RATE // 200
        lo, hi = int((punct.start_ts - 0.05) * RATE), int((nxt.start_ts + 0.05) * RATE)
        window = audio[max(0, lo):hi][:(hi - max(0, lo)) // n * n].reshape(-1, n)
        at = max(0, lo) + int(np.argmin((window ** 2).sum(1))) * n + n // 2
        inserts.append((at, int((need - have) * RATE)))
    for at, length in reversed(inserts):
        audio = np.concatenate([audio[:at], np.zeros(length, dtype=audio.dtype), audio[at:]])
    return audio


def line(text):
    results = list(pipe(re.sub(r'\s*\|\s*', '; ', text.strip()), voice=voice, speed=speed))
    audio = np.concatenate([stretch_pauses(r.audio.numpy(), r.tokens) for r in results])
    return drop_tail_hiss(trim(audio), results[-1].phonemes)


lines = {k: v for k, v in json.load(open(narration_path)).items() if isinstance(v, str)}
os.makedirs(out_dir, exist_ok=True)
# a = American, b = British pronunciation; defaults to the (first) voice's own. A blend "af_heart,bf_emma" averages the voices.
pipe = KPipeline(lang_code=os.environ.get('LANG_CODE', voice[0]))
clips = {}
for i, (caption, spoken) in enumerate(lines.items()):
    audio = line(spoken)
    wav = os.path.abspath(os.path.join(out_dir, f'line-{i:02d}.wav'))
    sf.write(wav, audio, RATE)
    clips[caption] = {'file': wav, 'seconds': round(len(audio) / RATE, 3), 'spoken': re.sub(r'\s*\|\s*', ' ', spoken)}
    print(f'{len(audio) / RATE:5.2f}s  {spoken[:70]}', flush=True)
json.dump(clips, open(os.path.join(out_dir, 'clips.json'), 'w'), indent=1, ensure_ascii=False)
