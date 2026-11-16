#!/usr/bin/env python3
"""
Listen to the voice clips with Gemini and flag any whose words are not the line's text (for example when the
voice also read out the style instruction). Usage:
  PROJECT=asmau-assets python3 scripts/voice-check.py games/<slug> [--max-chars N] [--ids a,b]
Prints one line per suspect clip; redo them by deleting their entry in scripts/voice/<slug>.json and running
scripts/generate-voice-gemini.py again.
"""
import base64, json, os, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "art"))
import vertex  # noqa: E402

CHECKER = "gemini-3-flash-preview"


def hear(mp3, text):
    body = json.dumps({"contents": [{"role": "user", "parts": [
        {"inlineData": {"mimeType": "audio/mpeg", "data": base64.b64encode(open(mp3, "rb").read()).decode()}},
        {"text": "This clip is meant to say exactly: \u00ab" + text + "\u00bb. Listen carefully and write down exactly "
                 "what is actually spoken, every word, in the script of the language spoken (nothing if it is silent). "
                 "Answer with the spoken words only."}]}]}).encode()
    url = vertex.endpoint().replace(vertex.MODEL, CHECKER)
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, data=body, method="POST",
                                         headers={"content-type": "application/json", "x-goog-api-key": vertex.KEY})
            res = json.load(urllib.request.urlopen(req, timeout=120))
            return "".join(p.get("text", "") for p in res["candidates"][0]["content"]["parts"] if not p.get("thought"))
        except Exception as e:
            last = e; time.sleep(5 * (attempt + 1))
    return "ERROR %s" % last


def words(s):
    s = re.sub(r"[ً-ْٰـ]", "", s.lower())          # drop Arabic vowel marks
    return re.findall(r"[\w']+", s)


def main():
    game = sys.argv[1]
    mx = int(sys.argv[sys.argv.index("--max-chars") + 1]) if "--max-chars" in sys.argv else 10 ** 6
    ids = sys.argv[sys.argv.index("--ids") + 1].split(",") if "--ids" in sys.argv else None
    lines = [l for l in json.load(open(os.path.join(game, "narration.json"), encoding="utf-8"))
             if len(l["text"]) <= mx and (ids is None or l["id"] in ids)]

    def job(l):
        got = hear(os.path.join(game, "assets", "audio-m" if os.environ.get("VOICE") == "m" else "audio", l["id"] + ".mp3"), l["text"])
        want, heard = words(l["text"]), words(got)
        extra = len(heard) - len(want)
        if got.startswith("ERROR") or extra > 2 or any(w in heard for w in ("auntie", "accent", "bedtime", "text")) \
                and not any(w in want for w in ("auntie", "accent", "bedtime", "text")):
            print("SUSPECT %s %s | want: %s | heard: %s" % (game, l["id"], l["text"], got.strip()), flush=True)
    with ThreadPoolExecutor(8) as ex:
        list(ex.map(job, lines))
    print("checked %s: %d clips" % (game, len(lines)), flush=True)


if __name__ == "__main__":
    main()
