#!/usr/bin/env python3
"""
The games' default narration voice: Google's Gemini text-to-speech on Vertex AI, the voice "Aoede" asked to
speak as a kind West African woman (chosen by the owner on 15 November 2026 from four samples). A parent's own
recording always replaces it.

  PROJECT=asmau-assets python3 scripts/generate-voice-gemini.py games/<slug> [--all]
  VOICE=m PROJECT=asmau-assets python3 scripts/generate-voice-gemini.py games/<slug>    (the man's voice, Achird)

Writes games/<slug>/assets/audio/<id>.mp3 for every line in narration.json, English and Arabic, skipping lines
whose words have not changed since last time (remembered in scripts/voice/<slug>.json), and removes clips whose
line is gone. The key is added by the network proxy (see scripts/art/vertex.py); never put it in this file.

To find this voice again for anything else, use exactly:
  model  gemini-2.5-flash-tts   (Vertex AI, project asmau-assets, location global)
  voice  Aoede                  (speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName)
  style  the STYLE text below, put before the words as: STYLE + " Text: " + words
         (for a line of four words or fewer: STYLE + " " + SHORT + " Text: " + words)
  output 24 kHz 16-bit mono PCM, made into mp3 (mono, 22 050 Hz, 32 kbit/s) with ffmpeg
"""
import base64, hashlib, json, os, random, subprocess, sys, tempfile, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "art"))
import vertex  # noqa: E402  (endpoint and key handling shared with the picture tool)

MODEL = "gemini-2.5-flash-tts"
VOICE = "Aoede"
STYLE = ("Read this aloud as a kind West African woman from Ghana or Nigeria, with a soft, warm West African English "
         "accent, gently, like an auntie telling a bedtime story to young children.")
STYLE_AR = ("Say this Arabic word or phrase clearly, with correct Arabic pronunciation, gently and warmly, as a kind "
            "West African woman would say it to a young child.")
# The man's voice, which parents can choose instead on the home page (owner's choice, 16 November 2026, from four
# samples): voice "Achird", a natural, calm reading voice. Made with VOICE=m; its clips go to assets/audio-m/ and
# what was voiced is remembered in scripts/voice/<slug>.m.json.
SET = os.environ.get("VOICE", "w")
if SET == "m":
    VOICE = "Achird"
    STYLE = ("Read this aloud as a kind West African man from Ghana or Nigeria, with a warm West African English accent, "
             "in a natural, clear storytelling voice at a calm, steady pace, like a good teacher reading a story to children.")
    STYLE_AR = ("Say this Arabic word or phrase clearly, with correct Arabic pronunciation, warmly and calmly, as a kind "
                "West African man would say it to a child.")
AUDIO = "audio-m" if SET == "m" else "audio"
MEMO = ".m.json" if SET == "m" else ".json"
SIG = MODEL + "|" + VOICE + "|" + STYLE + "|" + STYLE_AR
# A line of one to four words is easily "continued" by the voice (it once made up a whole story after "Four"),
# so short lines also get this, and every clip far longer than its words allow is made again (see too_long).
SHORT = "Say only these words, exactly once, and then stop."
SHORT_WORDS = 4


def short(text):
    return len(text.split()) <= SHORT_WORDS


def too_long(seconds, text, arabic):
    """True when a clip is much longer than its words could take at a slow storytelling pace."""
    return seconds > (0.3 * len(text) + 3.0 if arabic else 0.14 * len(text) + 3.0)


def seconds(pcm):
    return len(pcm) / 48000.0                          # 24 kHz, 16-bit, mono


def speak(text, arabic):
    """The voice for one line; tried again (up to four times) while the clip is too long, keeping the shortest."""
    best = None
    for _ in range(4):
        pcm = speak_once(text, arabic)
        if best is None or len(pcm) < len(best):
            best = pcm
        if not too_long(seconds(best), text, arabic):
            return best
    raise RuntimeError("still too long after 4 tries (%.1f s)" % seconds(best))


def speak_once(text, arabic):
    style = (STYLE_AR if arabic else STYLE) + (" " + SHORT if short(text) else "")
    body = json.dumps({"contents": [{"role": "user", "parts": [{"text": style + " Text: " + text}]}],
                       "generationConfig": {"responseModalities": ["AUDIO"],
                                            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}).encode()
    url = vertex.endpoint().replace(vertex.MODEL, MODEL)
    last = None
    for attempt in range(8):
        try:
            req = urllib.request.Request(url, data=body, method="POST",
                                         headers={"content-type": "application/json", "x-goog-api-key": vertex.KEY})
            res = json.load(urllib.request.urlopen(req, timeout=180))
            return base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        except urllib.error.HTTPError as e:
            last = "%d %s" % (e.code, e.read().decode(errors="replace")[:200])
            if e.code in (400, 401, 403, 404):
                break
            time.sleep(min(120, 15 * (attempt + 1)) + random.random() * 5)
        except Exception as e:                       # network trouble, or an answer without audio: try again
            last = str(e)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(last)


def to_mp3(pcm, mp3):
    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as f:
        f.write(pcm)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", f.name,
                    "-af", "apad=pad_dur=0.25", "-ac", "1", "-ar", "22050", "-codec:a", "libmp3lame", "-b:a", "32k", mp3], check=True)
    os.unlink(f.name)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    game, redo = sys.argv[1], "--all" in sys.argv
    lines = json.load(open(os.path.join(game, "narration.json"), encoding="utf-8"))
    out = os.path.join(game, "assets", AUDIO)
    os.makedirs(out, exist_ok=True)
    memo_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice", os.path.basename(os.path.normpath(game)) + MEMO)
    memo = json.load(open(memo_path)) if os.path.exists(memo_path) and not redo else {}
    todo = []
    for l in lines:
        sig = hashlib.sha1((SIG + ("|" + SHORT if short(l["text"]) else "") + "|" + l["text"]).encode()).hexdigest()[:12]
        mp3 = os.path.join(out, l["id"] + ".mp3")
        if memo.get(l["id"]) != sig or not os.path.exists(mp3) or \
                too_long(os.path.getsize(mp3) * 8 / 32000.0 - 0.25, l["text"], l.get("lang") == "ar"):   # 32 kbit/s
            todo.append((l, sig, mp3))
    failed = []

    def job(item):
        l, sig, mp3 = item
        try:
            to_mp3(speak(l["text"], l.get("lang") == "ar"), mp3)
            memo[l["id"]] = sig
        except Exception as e:
            failed.append(l["id"]); print("  failed", l["id"], str(e)[:120], flush=True)

    with ThreadPoolExecutor(int(os.environ.get("WORKERS", "4"))) as ex:
        list(ex.map(job, todo))
    keep = {l["id"] + ".mp3" for l in lines}
    for f in os.listdir(out):
        if f.endswith(".mp3") and f not in keep:
            os.remove(os.path.join(out, f)); memo.pop(f[:-4], None)
    json.dump(memo, open(memo_path, "w"), indent=0, sort_keys=True)
    size = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out) if f.endswith(".mp3"))
    print("%s: %d clips made, %d failed, %d lines, %.1f MB" % (game, len(todo) - len(failed), len(failed), len(lines), size / 1e6), flush=True)


if __name__ == "__main__":
    main()
