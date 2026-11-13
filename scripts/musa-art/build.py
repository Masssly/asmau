#!/usr/bin/env python3
"""
Pictures for the Musa game.

  python3 scripts/musa-art/build.py prompts          print every prompt as JSON {key: prompt}
  python3 scripts/musa-art/build.py import <folder>   take <folder>/<key>.(png|jpg|jpeg|webp), write
                                                     games/musa/assets/img/<key>.webp and games/musa/art.js

shots.json (alt text and scene description per picture) is written by
scripts/musa/author/build.js from the chapter files; change those, not it.
Only pictures that exist are listed in art.js, so the set can grow a few at a
time. After an import run:  node scripts/build-offline.js && node scripts/validate.js
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
GAME = os.path.join(ROOT, "games", "musa")
SHOTS = json.load(open(os.path.join(HERE, "shots.json"), encoding="utf-8"))

STYLE = ("Polished stylised 3D animated family-film still, warm cinematic lighting, rich detail, square picture, "
         "main figures in the middle. Everyone is Black African with deep dark brown skin and modest long clothing. ")
BACKDROP = ("Polished stylised 3D animated family-film background painting, warm cinematic lighting, rich detail, square, "
            "filling the whole frame edge to edge with no border. A place, with no main characters and nobody in the foreground. ")
END = " No text, no writing, no letters, no logos, no watermark."
SIZE = {"bg-": 1024, "": 1024}
QUALITY = {"bg-": 66, "": 70}
HEAD = """/*
  The pictures the Musa game has. Written by scripts/musa-art/build.py: do not
  edit by hand. Each key is a file in assets/img/<key>.webp and its value is the
  picture's description (used as alt text): a line id, or bg-<scene> for a backdrop.
  A step with no picture here still plays, with a plain scene behind it.
*/
"""


def kind(key):
    return "bg-" if key.startswith("bg-") else ""


def prompt(key):
    text = (BACKDROP if kind(key) else STYLE) + SHOTS[key]["scene"] + END
    if len(text) > 1000:
        raise SystemExit("%s: prompt is %d characters; the generator allows 1000" % (key, len(text)))
    return text


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
        im.thumbnail((SIZE[k], SIZE[k]), Image.LANCZOS)
        im.save(os.path.join(out, key + ".webp"), "WEBP", quality=QUALITY[k], method=6)
    have = sorted(f[:-5] for f in os.listdir(out) if f.endswith(".webp"))
    order = [k for k in SHOTS if k in have]
    body = "window.STORY_ART = {\n" + ",\n".join("  %s: %s" % (json.dumps(k), json.dumps(SHOTS[k]["alt"], ensure_ascii=False)) for k in order) + "\n};\n"
    open(os.path.join(GAME, "art.js"), "w", encoding="utf-8").write(HEAD + body)
    total = sum(os.path.getsize(os.path.join(out, k + ".webp")) for k in order)
    print("%d of %d pictures in place, %.1f MB" % (len(order), len(SHOTS), total / 1e6))


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "prompts":
        print(json.dumps({k: prompt(k) for k in SHOTS}, indent=1, ensure_ascii=False))
    elif len(sys.argv) == 3 and sys.argv[1] == "import":
        do_import(sys.argv[2])
    else:
        raise SystemExit(__doc__)
