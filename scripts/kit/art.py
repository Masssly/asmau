#!/usr/bin/env python3
"""
Pictures for a story made with the story kit (scripts/kit/README.md).

  python3 scripts/kit/art.py <story> prompts          print every prompt as JSON {key: prompt}
  python3 scripts/kit/art.py <story> import <folder>  take <folder>/<key>.(png|jpg|jpeg|webp), write
                                                     games/<game>/assets/img/<key>.webp and games/<game>/art.js

<story> is the story's folder in scripts/ (with kit.json). shots.json (alt text and scene description per picture) is
written by scripts/kit/build.js from the chapter files; change those, not it. The prompts are those
scripts/art/vertex.py draws with (the story's look). Only pictures that exist are listed in art.js, so the set can
grow a few at a time. After an import run:  node scripts/build-offline.js && node scripts/validate.js
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "scripts", "art"))

SIZE = {"bg-": 1024, "icon-": 256, "": 1024}
QUALITY = {"bg-": 66, "icon-": 80, "": 70}


def kind(key):
    return "bg-" if key.startswith("bg-") else ("icon-" if key.startswith("icon-") else "")


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    story, cmd = sys.argv[1], sys.argv[2]
    cfg = json.load(open(os.path.join(ROOT, "scripts", story, "kit.json"), encoding="utf-8"))
    art, game = os.path.join(ROOT, "scripts", cfg["art"]), os.path.join(ROOT, "games", cfg["game"])
    shots = json.load(open(os.path.join(art, "shots.json"), encoding="utf-8"))
    title = json.load(open(os.path.join(game, "game.json"), encoding="utf-8"))["title"]

    if cmd == "prompts":
        import vertex
        vertex.use(story)
        def prompt(k):
            s = shots[k]
            lead = vertex.PORTRAIT if s.get("portrait") else vertex.BACKDROP if kind(k) == "bg-" else vertex.STYLE
            return lead + s["scene"] + vertex.END
        print(json.dumps({k: prompt(k) for k in shots}, indent=1, ensure_ascii=False))
    elif cmd == "import" and len(sys.argv) == 4:
        from PIL import Image
        folder, out = sys.argv[3], os.path.join(game, "assets", "img")
        os.makedirs(out, exist_ok=True)
        for name in sorted(os.listdir(folder)):
            key, ext = os.path.splitext(name)
            if ext.lower() not in (".png", ".jpg", ".jpeg", ".webp") or key not in shots:
                continue
            im = Image.open(os.path.join(folder, name)).convert("RGB")
            k = kind(key)
            im.thumbnail((SIZE[k], SIZE[k]), Image.LANCZOS)
            im.save(os.path.join(out, key + ".webp"), "WEBP", quality=QUALITY[k], method=6)
        # what exists: on this machine, or (pictures live on R2) in the game's pack list
        try:
            packed = json.load(open(os.path.join(ROOT, "packs", cfg["game"] + ".json"), encoding="utf-8"))["files"]
        except Exception:
            packed = {}
        have = {f[:-5] for f in os.listdir(out) if f.endswith(".webp")}
        have |= {f.split("/")[-1][:-5] for f in packed if f.startswith("games/%s/assets/img/" % cfg["game"]) and f.endswith(".webp")}
        order = [k for k in shots if k in have]
        head = ("/*\n  The pictures the %s game has. Written by scripts/kit/art.py: do not\n  edit by hand. Each key is a file in "
                "assets/img/<key>.webp and its value is the\n  picture's description (used as alt text): a line id, or bg-<scene> for a "
                "backdrop.\n  A step with no picture here still plays, with a plain scene behind it.\n*/\n") % title
        body = "window.STORY_ART = {\n" + ",\n".join("  %s: %s" % (json.dumps(k), json.dumps(shots[k]["alt"], ensure_ascii=False)) for k in order) + "\n};\n"
        open(os.path.join(game, "art.js"), "w", encoding="utf-8").write(head + body)
        print("%d of %d pictures in place" % (len(order), len(shots)))
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
