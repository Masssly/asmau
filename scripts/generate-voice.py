#!/usr/bin/env python3
"""
Stand-in English narration for one game, made with the open-source Piper
speech engine and a freely usable voice. It reads far better than the old
flite voice, and it is still only a stand-in until a parent records the lines
(tools/record-voice).

  python3 scripts/generate-voice.py games/<slug> <voice.onnx> [--all]

Writes games/<slug>/assets/audio/<id>.mp3 for every English line, skipping
lines whose words have not changed since last time (it remembers them in
scripts/voice/<slug>.json), and removes clips whose line is gone. Arabic lines
are never synthesized.

Needs: pip install piper-tts, ffmpeg, and a voice model, for example
  https://huggingface.co/rhasspy/piper-voices  en/en_GB/cori/high
(model card: trained on LibriVox recordings, public domain).
"""
import hashlib, json, os, subprocess, sys, tempfile, wave

def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    game, model, redo = sys.argv[1], sys.argv[2], "--all" in sys.argv
    from piper import PiperVoice, SynthesisConfig
    voice = PiperVoice.load(model)
    cfg = SynthesisConfig(length_scale=1.12)          # a little slower, for small listeners
    lines = json.load(open(os.path.join(game, "narration.json"), encoding="utf-8"))
    out = os.path.join(game, "assets", "audio")
    os.makedirs(out, exist_ok=True)
    memo_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice", os.path.basename(os.path.normpath(game)) + ".json")
    memo = json.load(open(memo_path)) if os.path.exists(memo_path) and not redo else {}
    name = os.path.basename(model)
    made = 0
    keep = set()
    for l in lines:
        keep.add(l["id"] + ".mp3")                      # a recorded Arabic clip is kept, never made here
        if l.get("lang") != "en":
            continue
        sig = hashlib.sha1((name + "|" + l["text"]).encode()).hexdigest()[:12]
        mp3 = os.path.join(out, l["id"] + ".mp3")
        if memo.get(l["id"]) == sig and os.path.exists(mp3):
            continue
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav = tmp.name
        with wave.open(wav, "wb") as w:
            voice.synthesize_wav(l["text"], w, syn_config=cfg)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "apad=pad_dur=0.25", "-ac", "1", "-ar", "22050",
                        "-codec:a", "libmp3lame", "-b:a", "32k", mp3], check=True)
        os.unlink(wav)
        memo[l["id"]] = sig
        made += 1
    for f in os.listdir(out):
        if f.endswith(".mp3") and f not in keep:
            os.unlink(os.path.join(out, f))
            memo.pop(f[:-4], None)
    json.dump(memo, open(memo_path, "w"), indent=0, sort_keys=True)
    total = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out))
    print("%d clips made, %d in place, %.1f MB" % (made, len(keep), total / 1e6))

if __name__ == "__main__":
    main()
