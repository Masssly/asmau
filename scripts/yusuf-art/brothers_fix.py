#!/usr/bin/env python3
"""
Second pass for brothers.py: a try that is off by one or two brothers is mended by editing
brothers in or out, which the model does far more reliably than drawing the right number from
scratch. Also small fixes to kept pictures (for example the colour of the boy's tunic).

  PROJECT=asmau-assets MODEL=gemini-3-pro-image python3 scripts/yusuf-art/brothers_fix.py <brothers.py log>
  ... brothers_fix.py tunic KEY ...      make the boy's tunic teal, as in his portrait

Each mended picture is counted again (scripts/art/count.py) and kept only if the number is right.
Mend once only: editing an edited picture again fades the colours and changes the style a little
each time (tried: after three rounds the pictures no longer matched the rest, and one gained a
second mother). If one edit does not do it, draw the scene afresh.
A person still looks at every kept picture.
"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "art")); sys.path.insert(0, HERE)
import vertex, count, brothers  # noqa: E402

OUT, TRY = brothers.OUT, brothers.TRY
COLOURS = ["slate blue", "dark green", "terracotta", "maroon", "charcoal", "olive", "sand", "ochre"]
KEEP = ("Keep everything else exactly as it is: the place, the light, the camera angle, every other person, "
        "their faces, poses and clothes.")


def add(n):
    words = {1: "one", 2: "two", 3: "three"}
    return ("Edit this picture. Add exactly %s more grown bearded %s with deep dark brown skin, a short beard and a "
            "robe and turban in %s, standing or kneeling with the group of brothers in the same pose as them, fully "
            "visible and not hidden behind anyone. %s" % (words[n], "brother" if n == 1 else "brothers",
                                                        ", ".join(COLOURS[:n]), KEEP)) + vertex.END


def remove(n):
    words = {1: "one", 2: "two", 3: "three"}
    return ("Edit this picture. Remove exactly %s bearded %s from the group of brothers: the %s at the outer edge of "
            "the group. Fill the space with the background so nobody looks missing. %s"
            % (words[n], "brother" if n == 1 else "brothers", words[n], KEEP)) + vertex.END


TUNIC = ("Edit this picture. Change only the colour of the young boy's tunic: make it teal (blue-green) with cream trim, "
         "exactly like the boy's tunic in the second picture. " + KEEP + vertex.END)


def mend(log):
    # the latest try of each key that is still missing, with its count
    last = {}                            # the try closest to the right number (the later one if equal)
    for k, r, n in re.findall(r"^(\S+) try (\d+): (\d+) brothers", open(log).read(), re.M):
        r, n, t = int(r) - 1, int(n), brothers.PLAN[k][0]
        if k not in last or abs(n - t) <= abs(last[k][1] - t):
            last[k] = (r, n)
    jobs, want = [], {}
    for k, (r, n) in last.items():
        target = brothers.PLAN[k][0]
        if os.path.exists(os.path.join(OUT, k + ".png")) or not 1 <= abs(n - target) <= 3:
            continue
        src = os.path.join(TRY, "%s-%d.png" % (k, r))
        text = add(target - n) if n < target else remove(n - target)
        jobs.append((k, os.path.join(TRY, k + "-mend.png"), text, (src,)))
        want[k] = target
    vertex.run(jobs)
    for k, target in want.items():
        p = os.path.join(TRY, k + "-mend.png")
        got = count.count(p).get("brothers") if os.path.exists(p) else None
        if got == target:
            os.replace(p, os.path.join(OUT, k + ".png")); print("mended", k)
        else:
            print("%s: mended picture has %s brothers, want %d" % (k, got, target))


FIVE = brothers.TEN.replace("ten grown", "five grown").replace(", maroon, sand, slate blue, dark green, terracotta and charcoal", " and maroon")


def two_stage(keys, tries=3):
    """For scenes the model keeps getting wrong: draw them with five brothers on the left (a number it gets right),
    then one edit adds the rest as a second group on the right."""
    for k in keys:
        target = brothers.PLAN[k][0]
        scene = brothers.SHOTS[k][1].replace("{BR}", FIVE)
        people = [w for w in ("YQ", "YM", "BN", "YB") if "{%s}" % w in scene]
        first = (vertex.LOCK + vertex.STYLE + scene.format(**brothers.WHO) + " The five brothers stand together as one group on "
                 "the LEFT side of the picture; the right side of the picture has open space for more people to join later. "
                 "Count carefully: exactly five grown bearded brothers, each fully visible. Every brother has deep dark brown "
                 "skin." + vertex.END)
        refs = tuple([brothers.REF_BRO] + [brothers.REF[w] for w in people][:2])
        rest = target - 5
        second = ("Edit this picture. In the open space on the RIGHT side, add a second group of exactly %s more grown bearded "
                  "brothers with deep dark brown skin and short beards, in slate blue, dark green, terracotta, sand and charcoal "
                  "robes and turbans, doing the same as the first five brothers, each fully visible and not hidden behind anyone. "
                  "After this there are exactly %d brothers in all. %s" % ({4: "four", 5: "five"}[rest], target, KEEP)) + vertex.END
        for r in range(tries):
            a_ = os.path.join(TRY, "%s-five%d.png" % (k, r)); b_ = os.path.join(TRY, "%s-two%d.png" % (k, r))
            vertex.run([(k, a_, first, refs)], workers=1)
            n = count.count(a_).get("brothers") if os.path.exists(a_) else None
            if n != 5:
                print(k, "stage one has", n, "brothers", flush=True); continue
            vertex.run([(k, b_, second, (a_,))], workers=1)
            n = count.count(b_).get("brothers") if os.path.exists(b_) else None
            print(k, "stage two has", n, "brothers", flush=True)
            if n == target:
                os.replace(b_, os.path.join(OUT, k + ".png")); print("kept", k, flush=True); break


def tunic(keys):
    jobs = [(k, os.path.join(TRY, k + "-tunic.png"), TUNIC, (os.path.join(OUT, k + ".png"), brothers.REF["YB"])) for k in keys]
    vertex.run(jobs)
    for k in keys:
        p = os.path.join(TRY, k + "-tunic.png")
        got = count.count(p).get("brothers") if os.path.exists(p) else None
        print(k, "tunic redone;", got, "brothers")


EDITS = {
    "c9-c": ("Edit this picture. Change only the two women in the front filling the sacks: give both of them deep dark brown "
             "skin, Black African, with their hair fully covered by their headscarves. " + KEEP + vertex.END),
    "c10-c": ("Edit this picture. Change only one man: the bearded man in the dark brown robe and dark brown turban who stands "
              "on the LEFT of the open sack in the middle and holds up the golden cup. Turn him into a palace guard: a leather "
              "breastplate over a short white kilt, a plain dark head-cloth instead of a turban, deep dark brown skin; he still "
              "holds up the golden cup. Do not change the man in the white turban and long blue robe, the boy in the orange "
              "tunic, or any of the brothers. " + KEEP + vertex.END),
}


def edit(keys):
    jobs = [(k, os.path.join(TRY, k + "-edit.png"), EDITS[k], (os.path.join(OUT, k + ".png"),)) for k in keys]
    vertex.run(jobs)
    for k in keys:
        p = os.path.join(TRY, k + "-edit.png")
        print(k, "edited;", count.count(p).get("brothers") if os.path.exists(p) else None, "brothers")


if __name__ == "__main__":
    if sys.argv[1] == "two":
        two_stage(sys.argv[2:])
    elif sys.argv[1] == "edit":
        edit(sys.argv[2:])
    elif sys.argv[1] == "tunic":
        tunic(sys.argv[2:])
    else:
        mend(sys.argv[1])
