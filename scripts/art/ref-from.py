#!/usr/bin/env python3
"""
A reference picture for a recurring character, made from a picture the game already shows, so the reference matches what
children have seen (owner, 17 November 2026: recurring characters we kept fixing get a fixed reference, like the main ones).

  PROJECT=asmau-assets MODEL=gemini-3-pro-image python3 scripts/art/ref-from.py <art folder> <KEY> <picture> "<who in it>" [look]

  e.g. ... scripts/yusuf-art KG games/yusuf/assets/img/c8-a2.webp "the king on the throne, in a gold crown and purple robe"

Writes <art folder>/refs/<KEY>.png (the person twice, full body, front and three-quarter view, plain background).
Look at it; if it is right, add KEY to <art folder>/refs/approved.json, then
ADMIN_TOKEN=... python3 scripts/refs-media.py publish  (refs live on R2) and commit the list.
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import vertex  # noqa: E402

if len(sys.argv) < 5:
    raise SystemExit(__doc__)
art, key, pic, who = sys.argv[1:5]
look = sys.argv[5] if len(sys.argv) > 5 else "africa"
REF = vertex.LOOKS[look][3]
prompt = (REF + "Draw exactly this person from the attached picture: " + who + ". The same face, age, skin tone, beard and hair, "
          "the same clothes, headwear and colours as in the picture; nothing added, nothing changed." + vertex.END)
out = os.path.join(art, "refs", key + ".png")
if os.path.exists(out):
    raise SystemExit(out + " exists; move it away first to redraw it")
os.makedirs(os.path.dirname(out), exist_ok=True)
failed = vertex.run([(key, out, prompt, (pic,))])
print("wrote " + out if not failed else "failed: %s" % failed)
