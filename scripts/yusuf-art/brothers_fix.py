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


def again(keys, rounds=3):
    """Keep mending the last mended picture of each key, recounting after every edit."""
    for k in keys:
        target, src = brothers.PLAN[k][0], os.path.join(TRY, k + "-mend.png")
        n = count.count(src).get("brothers")
        for r in range(rounds):
            if n == target:
                break
            if n is None or abs(n - target) > 3:
                print(k, "stopped at", n); break
            out = os.path.join(TRY, "%s-mend%d.png" % (k, r + 1))
            vertex.run([(k, out, add(target - n) if n < target else remove(n - target), (src,))], workers=1)
            if not os.path.exists(out):
                break
            src, n = out, count.count(out).get("brothers")
            print(k, "round", r + 1, "->", n, flush=True)
        if n == target:
            os.replace(src, os.path.join(OUT, k + ".png")); print("mended", k, flush=True)


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
    if sys.argv[1] == "again":
        again(sys.argv[2:])
    elif sys.argv[1] == "edit":
        edit(sys.argv[2:])
    elif sys.argv[1] == "tunic":
        tunic(sys.argv[2:])
    else:
        mend(sys.argv[1])
