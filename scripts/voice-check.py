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
    # STORY_LANG=id: the clips of a translation (assets/audio-id/, VOICE=m: audio-id-m/), against its words
    tongue, man = os.environ.get("STORY_LANG", "en"), os.environ.get("VOICE") == "m"
    folder = ("audio-m" if man else "audio") if tongue == "en" else "audio-" + tongue + ("-m" if man else "")
    all_lines = json.load(open(os.path.join(game, "narration.json"), encoding="utf-8"))
    if tongue != "en":
        tr = {k: (v.get("t", "") if isinstance(v, dict) else v) for k, v in json.load(open(os.path.join(os.path.dirname(os.path.abspath(game.rstrip("/"))), "..", "lang", tongue, os.path.basename(game.rstrip("/")) + ".json"), encoding="utf-8")).get("lines", {}).items()}
        all_lines = [dict(l, text=tr.get(l["id"]) or l["text"]) if l.get("lang") != "ar" else l for l in all_lines]
    lines = [l for l in all_lines if len(l["text"]) <= mx and (ids is None or l["id"] in ids)]

    def job(l):
        got = hear(os.path.join(game, "assets", folder, l["id"] + ".mp3"), l["text"])
        want, heard = words(l["text"]), words(got)
        extra = len(heard) - len(want)
        # in a translation, also a clip read in the wrong language (few of its words heard)
        same = len(set(want) & set(heard)) / max(1, len(set(want)))
        if tongue != "en" and l.get("lang") != "ar" and same < 0.6:
            print("SUSPECT %s %s | only %d%% of the words heard | want: %s | heard: %s" % (game, l["id"], same * 100, l["text"], got.strip()), flush=True)
        elif got.startswith("ERROR") or extra > 2 or any(w in heard for w in ("auntie", "accent", "bedtime", "text")) \
                and not any(w in want for w in ("auntie", "accent", "bedtime", "text")):
            print("SUSPECT %s %s | want: %s | heard: %s" % (game, l["id"], l["text"], got.strip()), flush=True)
    with ThreadPoolExecutor(8) as ex:
        list(ex.map(job, lines))
    print("checked %s: %d clips" % (game, len(lines)), flush=True)


if __name__ == "__main__":
    main()
