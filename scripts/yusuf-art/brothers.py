#!/usr/bin/env python3
"""
Redraw the Yusuf pictures that show the brothers until each shows the right number of them.

The image model cannot be trusted to draw ten people, and adding people to a finished picture
failed. So each scene is drawn afresh with the brothers placed in groups of five (which it handles
better), several times if needed; Gemini's text model counts the brothers in each try
(scripts/art/count.py) and the first try with the right number is kept. A person still looks at
every kept picture before it is imported.

  PROJECT=asmau-assets python3 scripts/yusuf-art/brothers.py [KEY ...]

Tries go to scripts/yusuf-art/bro/try/, kept pictures to scripts/yusuf-art/bro/<key>.png.
Then: python3 scripts/yusuf-art/build.py import scripts/yusuf-art/bro

How many, from the story (Surah Yusuf): ten older brothers; from the second journey on,
Benjamin is with them; when Benjamin is held in Egypt the eldest stays behind (12:80), so nine go
home; at the end the eleven brothers bow, as the eleven stars did in the dream (12:4, 12:100).
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "scripts", "art")); sys.path.insert(0, HERE)
import vertex, count            # noqa: E402
from shots import SHOTS, WHO  # noqa: E402

IMG = os.path.join(ROOT, "games", "yusuf", "assets", "img")
OUT = os.path.join(HERE, "bro"); TRY = os.path.join(OUT, "try")
REF_BRO = os.path.join(HERE, "refs", "brothers.png")         # ten brothers in two groups of five
REF = {"YQ": os.path.join(HERE, "fix", "c1-b.png"), "YM": os.path.join(IMG, "p-yusufMan.webp"),
       "BN": os.path.join(IMG, "p-benjamin.webp"), "YB": os.path.join(IMG, "p-yusuf.webp")}

TEN = "ten grown brothers, all with deep dark brown skin and short beards, in rust, ochre, olive, brown, maroon, sand, slate blue, dark green, terracotta and charcoal robes and turbans"
NINE = TEN.replace("ten grown", "nine grown").replace(", terracotta and charcoal", " and terracotta")

# key: (number of bearded brothers, how they are placed). The placing is added to the scene.
PLAN = {
    "c2-a0": (10, "Five brothers sit on the left side of the fire and five on the right side."),
    "c2-a":  (10, "The brothers stand in the front in two huddles of five."),
    "c2-0":  (10, "Further back, the ten older brothers stand apart in two groups of five, some with folded arms."),
    "c2-p1": (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c2-p3": (10, "Five brothers walk ahead of the boy and five walk behind him."),
    "c2-b":  (10, "Five brothers stand on the near side of the well and five on the far side."),
    "c2-c":  (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c9-a":  (10, "The brothers walk in a line, each leading a donkey, all of them clearly visible in the middle distance."),
    "c9-b":  (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c9-c":  (10, "Behind, in the middle distance and clearly visible, the ten brothers stand in two groups of five by their donkeys."),
    "c10-h0": (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c10-h": (10, "Five brothers kneel on the left of the sacks and five on the right."),
    "c10-g": (10, "The brothers stand in a row of five in front and a row of five behind; the teenage boy stands beside the father."),
    "c10-l1": (10, "The brothers stand in a row of five in front and a row of five behind; their youngest brother, a teenage boy in an orange-brown tunic, stands with them."),
    "c10-l2": (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c10-c": (10, "Five brothers stand on the left and five on the right."),
    "c11-v0": (10, "The brothers kneel in a row of five in front and a row of five behind."),
    "c11-v": (10, "One brother stands alone on the left; the other nine walk away on the right in a group of five and a group of four."),
    "c11-b": (9, "The nine brothers stand in a row of five in front and a row of four behind."),
    "c11-c0": (10, "The brothers kneel in a row of five in front and a row of five behind."),
    "c11-c": (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c11-e": (10, "The brothers stand in a row of five in front and a row of five behind."),
    "c11-d": (10, "Five brothers crowd in on his left and five on his right."),
    "c12-a": (10, "The brothers stand in a row of five in front and a row of five behind; their youngest brother, a teenage boy in an orange-brown tunic, stands with them."),
    "c12-c": (10, "Five brothers kneel on his left and five on his right; their youngest brother, a teenage boy in an orange-brown tunic, kneels with them."),
    "c13-b": (10, "The ten bearded brothers bow in a row of five in front and a row of five behind, and their youngest brother, a young man in an orange-brown tunic, bows with them: eleven brothers in all."),
}
NOTE = (" The attached pictures show how the people look: draw them with the same faces, clothes and skin tone; the first one shows "
        "the brothers. Count carefully: exactly %d grown bearded brothers, no more and no fewer, each one fully visible and not "
        "hidden behind another. Every brother has deep dark brown skin.")


def prompt(k):
    n, place = PLAN[k]
    scene = SHOTS[k][1].replace("{BR}", NINE if n == 9 else TEN)
    if k == "c11-v":
        scene = scene.replace("The eldest of " + TEN, "The eldest of ten grown brothers").replace("the other nine", "the other nine brothers")
    people = [w for w in ("YQ", "YM", "BN", "YB") if "{%s}" % w in scene]
    text = vertex.LOCK + vertex.STYLE + scene.format(**WHO) + " " + place + (NOTE % n) + vertex.END
    return text, tuple([REF_BRO] + [REF[w] for w in people][:2])


def main(keys, rounds=4):
    os.makedirs(TRY, exist_ok=True)
    keys = [k for k in (keys or PLAN) if not os.path.exists(os.path.join(OUT, k + ".png"))]
    log = {}
    for r in range(rounds):
        if not keys:
            break
        jobs = []
        for k in keys:
            text, refs = prompt(k)
            jobs.append((k, os.path.join(TRY, "%s-%d.png" % (k, r)), text, refs))
        vertex.run(jobs)
        left = []
        for k in keys:
            p = os.path.join(TRY, "%s-%d.png" % (k, r))
            got = count.count(p) if os.path.exists(p) else {"error": "not drawn"}
            log.setdefault(k, []).append(got.get("brothers"))
            if got.get("brothers") == PLAN[k][0]:
                os.replace(p, os.path.join(OUT, k + ".png")); print("kept %s (try %d)" % (k, r + 1), flush=True)
            else:
                left.append(k); print("%s try %d: %s brothers, want %d" % (k, r + 1, got.get("brothers"), PLAN[k][0]), flush=True)
        keys = left
    print("counts:", json.dumps(log)); print("still wrong:", keys or "none")


if __name__ == "__main__":
    main(sys.argv[1:])
