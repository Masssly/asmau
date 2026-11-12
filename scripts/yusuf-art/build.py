#!/usr/bin/env python3
"""
Pictures for the Yusuf game.

  python3 scripts/yusuf-art/build.py prompts          print every prompt as JSON {key: prompt}
  python3 scripts/yusuf-art/build.py import <folder>   take <folder>/<key>.(png|jpg|jpeg|webp), write
                                                      games/yusuf/assets/img/<key>.webp and games/yusuf/art.js

Only pictures that exist are listed in art.js, so the set can grow a few at a
time. After an import run:  node scripts/build-offline.js && node scripts/validate.js
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
GAME = os.path.join(ROOT, "games", "yusuf")
sys.path.insert(0, HERE)
from shots import STYLE, PORTRAIT, BACKDROP, END, WHO, SHOTS  # noqa: E402

SIZE = {"p-": 256, "bg-": 1024, "": 1024}   # longest side in pixels
QUALITY = {"p-": 80, "bg-": 68, "": 72}


def prompt(key):
    scene = SHOTS[key][1]
    lead = BACKDROP if key.startswith("bg-") else STYLE
    if scene.startswith("PORTRAIT:"):
        lead, scene = PORTRAIT, scene[len("PORTRAIT:"):]
        scene = scene[0].upper() + scene[1:]
    text = lead + scene.format(**WHO) + END
    if len(text) > 1000:
        raise SystemExit("%s: prompt is %d characters; the generator allows 1000" % (key, len(text)))
    return text


def kind(key):
    return "p-" if key.startswith("p-") else ("bg-" if key.startswith("bg-") else "")


def do_import(folder):
    from PIL import Image
    out = os.path.join(GAME, "assets", "img")
    os.makedirs(out, exist_ok=True)
    for name in sorted(os.listdir(folder)):
        key, ext = os.path.splitext(name)
        if ext.lower() not in (".png", ".jpg", ".jpeg", ".webp") or key not in SHOTS:
            continue
        im = Image.open(os.path.join(folder, name)).convert("RGB")
        k = kind(key)
        if k == "p-":                         # portraits: a centred square
            side = min(im.size)
            left, top = (im.width - side) // 2, (im.height - side) // 2
            im = im.crop((left, top, left + side, top + side))
        im.thumbnail((SIZE[k], SIZE[k]), Image.LANCZOS)
        im.save(os.path.join(out, key + ".webp"), "WEBP", quality=QUALITY[k], method=6)
    have = sorted(f[:-5] for f in os.listdir(out) if f.endswith(".webp"))
    order = [k for k in SHOTS if k in have]
    head = open(os.path.join(GAME, "art.js"), encoding="utf-8").read().split("window.YUSUF_ART")[0]
    body = "window.YUSUF_ART = {\n" + ",\n".join("  %s: %s" % (json.dumps(k), json.dumps(SHOTS[k][0], ensure_ascii=False)) for k in order) + "\n};\n"
    if not order:
        body = "window.YUSUF_ART = {};\n"
    open(os.path.join(GAME, "art.js"), "w", encoding="utf-8").write(head + body)
    total = sum(os.path.getsize(os.path.join(out, k + ".webp")) for k in order)
    print("%d of %d pictures in place, %.1f MB" % (len(order), len(SHOTS), total / 1e6))


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "prompts":
        print(json.dumps({k: prompt(k) for k in SHOTS}, indent=1, ensure_ascii=False))
    elif len(sys.argv) == 3 and sys.argv[1] == "import":
        do_import(sys.argv[2])
    else:
        raise SystemExit(__doc__)
