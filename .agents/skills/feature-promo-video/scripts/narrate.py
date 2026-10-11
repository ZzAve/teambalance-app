# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["kokoro==0.9.4", "soundfile", "pip"]
# ///
"""Voice every spoken line of a narration file with Kokoro TTS.

  uv run narrate.py docs/demo/<feature>.narration.json <out-dir> [voice] [speed]

Writes <out-dir>/line-NN.wav and <out-dir>/clips.json ({caption: {file, seconds}}). Pass clips.json
to the take as NARRATION=… and to assemble.py. Keys whose value is not a string (the card texts)
are skipped.
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

lines = {k: v for k, v in json.load(open(narration_path)).items() if isinstance(v, str)}
os.makedirs(out_dir, exist_ok=True)
pipe = KPipeline(lang_code=voice[0])  # a = American, b = British
pause = np.zeros(int(0.35 * RATE), dtype=np.float32)
clips = {}
for i, (caption, spoken) in enumerate(lines.items()):
    # One clip per sentence, joined with a pause: within one clip Kokoro barely pauses at a full stop.
    parts = []
    for sentence in re.split(r'(?<=[.!?])\s+', spoken.strip()):
        if parts:
            parts.append(pause)
        parts.append(np.concatenate([audio for _, _, audio in pipe(sentence, voice=voice, speed=speed)]))
    audio = np.concatenate(parts)
    wav = os.path.abspath(os.path.join(out_dir, f'line-{i:02d}.wav'))
    sf.write(wav, audio, RATE)
    clips[caption] = {'file': wav, 'seconds': round(len(audio) / RATE, 3)}
    print(f'{len(audio) / RATE:5.2f}s  {spoken[:70]}', flush=True)
json.dump(clips, open(os.path.join(out_dir, 'clips.json'), 'w'), indent=1, ensure_ascii=False)
