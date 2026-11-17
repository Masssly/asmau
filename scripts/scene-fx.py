#!/usr/bin/env python3
"""
Living scenes: Gemini looks at each story picture and says which gentle effects fit and where (stars in its sky,
a flicker on its lamp, leaves under its trees). Writes games/<slug>/scene-fx.json, read by shared/story-engine.js.

  PROJECT=asmau-assets python3 scripts/scene-fx.py games/<slug> [--redo] [--only id,id]

Pictures already in the file are kept unless --redo (so hand corrections survive). Then look at the result:
  python3 scripts/scene-fx.py games/<slug> --sheet out.png    (thumbnails with the boxes drawn on them)
"""
import base64, json, os, re, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "art"))
import vertex  # noqa: E402

MODEL = os.environ.get("FX_MODEL", "gemini-3-flash-preview")
EFFECTS = {
    "stars": "a visible night sky with stars (box: the night sky only)",
    "water": "a visible surface of a river, sea, pool or well water (box: the water surface only)",
    "rain": "rain that is falling in the picture (box: where it rains)",
    "lamp": "a small flame: an oil lamp, candle or lantern (at: the flame itself)",
    "fire": "a campfire, a burning bush or a large fire (at: the centre of the flames)",
    "embers": "sparks rising from a fire (box: a narrow area just above the flames)",
    "motes": "a glow of holy, heavenly or magical light, or bright light pouring in (box: the glowing area)",
    "leaves": "trees or bushes with leaves, outdoors (box: under the leafy branches, where leaves would fall)",
    "birds": "a large open daytime sky (box: the open sky, away from people)",
    "dust": "a sunny desert or dusty, sandy ground outdoors (box: the lower part where dust would drift)",
    "mist": "mountains, valleys or early morning haze (box: the hazy distance)",
    "rays": "strong beams of sunlight from above (box: where the beams fall)",
}
PROMPT = """You are placing gentle, slow animated effects on a picture from a children's story game, so the still
picture feels alive. Choose ONLY effects that match what is clearly visible in the picture. Choose at most 3, and
choose none if nothing fits (many pictures need none). Never put an effect over a person's or animal's face.

Effects you may use:
%s

Positions are fractions of the picture: x from 0 (left) to 1 (right), y from 0 (top) to 1 (bottom).
Answer with JSON only, a list, for example:
[{"e": "stars", "box": [0.45, 0.15, 0.85, 0.5]}, {"e": "lamp", "at": [0.12, 0.84]}]
Use "at" for lamp and fire, and "box" [x0, y0, x1, y1] for the others. Answer [] if no effect fits."""


def pictures(game):
    js = subprocess.run(["node", "-e", """
const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1]+'/story.js','utf8'),c);const s=new Set();
c.window.STORY.forEach(ch=>ch.steps.forEach(st=>{const o=st.opts||{};const id=st.pic||st.say||o.img;if(id)s.add(id);}));
console.log(JSON.stringify([...s]));""", game], capture_output=True, text=True, check=True).stdout
    return [i for i in json.loads(js) if os.path.exists(os.path.join(game, "assets", "img", i + ".webp"))]


def ask(path):
    body = json.dumps({"contents": [{"role": "user", "parts": [
        {"inlineData": {"mimeType": "image/webp", "data": base64.b64encode(open(path, "rb").read()).decode()}},
        {"text": PROMPT % "\n".join("- %s: %s" % kv for kv in EFFECTS.items())}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}}).encode()
    url = vertex.endpoint().replace(vertex.MODEL, MODEL)
    last = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, data=body, method="POST", headers={"content-type": "application/json", "x-goog-api-key": vertex.KEY})
            res = json.load(urllib.request.urlopen(req, timeout=120))
            txt = "".join(p.get("text", "") for p in res["candidates"][0]["content"]["parts"] if not p.get("thought"))
            return clean(json.loads(re.sub(r"^```(json)?|```$", "", txt.strip())))
        except Exception as e:
            last = e; time.sleep(4 * (attempt + 1))
    raise RuntimeError(str(last))


def clean(lst):
    out = []
    for fx in lst if isinstance(lst, list) else []:
        e = fx.get("e")
        if e not in EFFECTS:
            continue
        if e in ("lamp", "fire"):
            at = fx.get("at")
            if isinstance(at, list) and len(at) == 2 and all(0 <= v <= 1 for v in at):
                out.append({"e": e, "at": [round(v, 3) for v in at]})
        else:
            b = fx.get("box")
            if isinstance(b, list) and len(b) == 4 and all(0 <= v <= 1 for v in b) and b[2] > b[0] and b[3] > b[1]:
                out.append({"e": e, "box": [round(v, 3) for v in b]})
    return out[:3]


def sheet(game, path):
    from PIL import Image, ImageDraw
    fx = json.load(open(os.path.join(game, "scene-fx.json")))
    ids = [i for i in fx if fx[i]]
    cols, size = 6, 260
    rows = (len(ids) + cols - 1) // cols
    out = Image.new("RGB", (cols * size, rows * (size + 18)), "white")
    for n, i in enumerate(ids):
        im = Image.open(os.path.join(game, "assets", "img", i + ".webp")).convert("RGB").resize((size, size))
        d = ImageDraw.Draw(im)
        for f in fx[i]:
            b = f.get("box") or [f["at"][0] - .06, f["at"][1] - .06, f["at"][0] + .06, f["at"][1] + .06]
            d.rectangle([b[0] * size, b[1] * size, b[2] * size, b[3] * size], outline=(255, 0, 160), width=3)
            d.text((b[0] * size + 4, b[1] * size + 3), f["e"], fill=(255, 255, 0))
        x, y = (n % cols) * size, (n // cols) * (size + 18)
        out.paste(im, (x, y))
        ImageDraw.Draw(out).text((x + 4, y + size + 3), i, fill=(0, 0, 0))
    out.save(path)
    print("sheet:", path, len(ids), "pictures with effects")


def main():
    game = sys.argv[1]
    if "--sheet" in sys.argv:
        return sheet(game, sys.argv[sys.argv.index("--sheet") + 1])
    path = os.path.join(game, "scene-fx.json")
    only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
    # --redo starts afresh, but with --only it redoes just those pictures and keeps every other one
    # (once, "--redo --only c2-a" threw away the effects of 65 other pictures)
    fx = json.load(open(path)) if os.path.exists(path) and ("--redo" not in sys.argv or only) else {}
    todo = [i for i in pictures(game) if (only and i in only) or (not only and i not in fx)]
    def job(i):
        try:
            fx[i] = ask(os.path.join(game, "assets", "img", i + ".webp"))
        except Exception as e:
            print("  failed", i, str(e)[:100], flush=True)
    with ThreadPoolExecutor(6) as ex:
        list(ex.map(job, todo))
    # The Prophet (peace be upon him) is never drawn: the pictures where he is present (listed by the game's
    # author tools in scripts/<slug>-art/presence.json) get a soft breeze across them instead.
    pres = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.path.basename(game.rstrip("/")) + "-art", "presence.json")
    for i in (json.load(open(pres)) if os.path.exists(pres) else []):
        if i in fx and not any(e.get("e") == "breeze" for e in fx[i]):
            fx[i].append({"e": "breeze", "box": [0.0, 0.25, 1.0, 0.85]})
    json.dump(dict(sorted(fx.items())), open(path, "w"), indent=0)
    used = sum(1 for v in fx.values() if v)
    print("%s: %d pictures looked at, %d with effects, %d without" % (game, len(todo), used, len(fx) - used))


if __name__ == "__main__":
    main()
