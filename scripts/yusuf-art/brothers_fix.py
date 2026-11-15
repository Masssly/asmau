#!/usr/bin/env python3
"""
Second pass for brothers.py: a try that is off by one or two brothers is mended by editing
brothers in or out, which the model does far more reliably than drawing the right number from
scratch. Also small fixes to kept pictures (for example the colour of the boy's tunic).

  PROJECT=asmau-assets MODEL=gemini-3-pro-image python3 scripts/yusuf-art/brothers_fix.py <brothers.py log>
  ... brothers_fix.py tunic KEY ...      make the boy's tunic teal, as in his portrait

Each mended picture is counted again (scripts/art/count.py) and kept only if the number is right.
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
    return ("Edit this picture. Add exactly %s more grown bearded %s with deep dark brown skin, a short beard and a "
            "robe and turban in %s, standing or kneeling with the group of brothers in the same pose as them, fully "
            "visible and not hidden behind anyone. %s" % ("one" if n == 1 else "two", "brother" if n == 1 else "brothers",
                                                        " and ".join(COLOURS[:n]), KEEP)) + vertex.END


def remove(n):
    return ("Edit this picture. Remove %s from the group of brothers: the %s at the outer edge of the group. Fill the "
            "space with the background so nobody looks missing. %s" % ("exactly one bearded brother" if n == 1 else
                                                                       "exactly two bearded brothers",
                                                                       "one" if n == 1 else "two", KEEP)) + vertex.END


TUNIC = ("Edit this picture. Change only the colour of the young boy's tunic: make it teal (blue-green) with cream trim, "
         "exactly like the boy's tunic in the second picture. " + KEEP + vertex.END)


def mend(log):
    # the latest try of each key that is still missing, with its count
    last = {}
    for k, r, n in re.findall(r"^(\S+) try (\d+): (\d+) brothers", open(log).read(), re.M):
        last[k] = (int(r) - 1, int(n))
    jobs, want = [], {}
    for k, (r, n) in last.items():
        target = brothers.PLAN[k][0]
        if os.path.exists(os.path.join(OUT, k + ".png")) or not 1 <= abs(n - target) <= 2:
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


def tunic(keys):
    jobs = [(k, os.path.join(TRY, k + "-tunic.png"), TUNIC, (os.path.join(OUT, k + ".png"), brothers.REF["YB"])) for k in keys]
    vertex.run(jobs)
    for k in keys:
        p = os.path.join(TRY, k + "-tunic.png")
        got = count.count(p).get("brothers") if os.path.exists(p) else None
        print(k, "tunic redone;", got, "brothers")


if __name__ == "__main__":
    if sys.argv[1] == "tunic":
        tunic(sys.argv[2:])
    else:
        mend(sys.argv[1])
