#!/usr/bin/env python3
"""
Pictures from Google's Gemini image model on Vertex AI, with reference pictures,
so that a person looks the same from scene to scene.

  PROJECT=<google cloud project id> python3 scripts/art/vertex.py <command> ...

  musa-refs [KEY ...]       draw the reference pictures (scripts/musa-art/refs.json)
                            into scripts/musa-art/refs/<KEY>.png, for a person to approve
  musa-scenes [KEY ...]     draw the Musa scenes (scripts/musa-art/shots.json) into
                            scripts/musa-art/out/<key>.png, each shown the approved
                            reference pictures of the people in it. Already drawn: skipped.
  yusuf-fix                 redraw the Yusuf pictures listed in FIXES below, each from the
                            picture itself plus the picture it must match
  try                       one tiny request, to check the key and the project

Then: python3 scripts/musa-art/build.py import scripts/musa-art/out (and the Yusuf
equivalent), look at every picture, node scripts/build-offline.js, publish-media.js.

Authentication: the API key is never in this file or in the repository. In the cloud
session it is added to requests by the network proxy (a saved network secret for
aiplatform.googleapis.com, header x-goog-api-key); elsewhere set GOOGLE_API_KEY.

Everyone is drawn in the same polished 3D family-film look as the Yusuf pictures.
"""
import base64, json, os, random, sys, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
MODEL = os.environ.get("MODEL", "gemini-2.5-flash-image")
LOCATION = os.environ.get("LOCATION", "global")
PROJECT = os.environ.get("PROJECT", "")
KEY = os.environ.get("GOOGLE_API_KEY", "set-by-the-proxy")

STYLE = ("Polished stylised 3D animated family-film still, warm cinematic lighting, rich detail, square picture, "
         "main figures in the middle. Everyone is Black African with deep dark brown skin and modest long clothing. ")
BACKDROP = ("Polished stylised 3D animated family-film background painting, warm cinematic lighting, rich detail, square, "
            "filling the whole frame edge to edge with no border. A place, with no main characters and nobody in the foreground. ")
REF = ("Character reference picture for an animated family film: the same person shown twice side by side, full body, "
       "front view and three-quarter view, standing relaxed with arms hanging naturally at the sides, plain warm cream "
       "background, soft studio lighting, polished stylised 3D animated family-film look. Deep dark brown skin, Black African. ")
END = " No text, no writing, no letters, no logos, no watermark."
LOCK = ("The attached pictures show how these people look. Draw each of them with exactly the same face, hair, skin tone, "
        "clothes and 3D style as in their picture. Do not copy the pictures' backgrounds or poses. ")


def endpoint():
    if not PROJECT:
        raise SystemExit("Set PROJECT to the Google Cloud project id.")
    host = "aiplatform.googleapis.com" if LOCATION == "global" else LOCATION + "-aiplatform.googleapis.com"
    return "https://%s/v1/projects/%s/locations/%s/publishers/google/models/%s:generateContent" % (host, PROJECT, LOCATION, MODEL)


def mime(path):
    return "image/png" if path.endswith(".png") else "image/webp" if path.endswith(".webp") else "image/jpeg"


def draw(prompt, refs=(), aspect="1:1", tries=10):
    """One picture: returns PNG/JPEG bytes. refs are paths of pictures to show the model first."""
    parts = [{"inlineData": {"mimeType": mime(r), "data": base64.b64encode(open(r, "rb").read()).decode()}} for r in refs]
    parts.append({"text": prompt})
    body = json.dumps({
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}},
    }).encode()
    last = None
    for attempt in range(tries):
        req = urllib.request.Request(endpoint(), data=body, method="POST",
                                     headers={"content-type": "application/json", "x-goog-api-key": KEY, "user-agent": "asmau-art/1"})
        try:
            res = json.load(urllib.request.urlopen(req, timeout=180))
            for cand in res.get("candidates", []):
                for part in cand.get("content", {}).get("parts", []):
                    if "inlineData" in part:
                        return base64.b64decode(part["inlineData"]["data"])
            last = "no picture in the answer: " + json.dumps(res)[:400]
        except urllib.error.HTTPError as e:
            last = "%d %s" % (e.code, e.read().decode(errors="replace")[:400])
            if e.code in (400, 401, 403, 404):
                break                                   # will not get better by trying again
            if e.code == 429:                           # Google is busy: wait longer each time, up to 3 minutes
                time.sleep(min(180, 30 * (attempt + 1)) + random.random() * 10)
                continue
        except Exception as e:                          # network trouble: wait and try again
            last = str(e)
        time.sleep(5 * (attempt + 1))
    raise RuntimeError(last)


def run(jobs, workers=int(os.environ.get("WORKERS", "2"))):
    """jobs: [(name, out_path, prompt, refs)]. Draws what is not drawn yet; returns the failures."""
    todo = [j for j in jobs if not os.path.exists(j[1])]
    print("%d to draw, %d already drawn" % (len(todo), len(jobs) - len(todo)), flush=True)
    failed = {}

    def one(job):
        name, out, prompt, refs = job
        try:
            data = draw(prompt, refs)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "wb").write(data)
            print("  drew " + name, flush=True)
        except Exception as e:
            failed[name] = str(e)
            print("  FAILED " + name + ": " + str(e)[:300], flush=True)

    with ThreadPoolExecutor(workers) as ex:
        list(ex.map(one, todo))
    return failed


# ---------- Musa ----------
ART = os.path.join(ROOT, "scripts", "musa-art")


def musa_refs(keys):
    refs = json.load(open(os.path.join(ART, "refs.json"), encoding="utf-8"))
    keys = keys or list(refs)
    return run([(k, os.path.join(ART, "refs", k + ".png"), REF + refs[k]["look"] + "." + END, ()) for k in keys])


def approved_ref(k):
    for ext in (".png", ".webp", ".jpg"):
        p = os.path.join(ART, "refs", k + ext)
        if os.path.exists(p) and os.path.exists(os.path.join(ART, "refs", "approved.json")) and \
                k in json.load(open(os.path.join(ART, "refs", "approved.json"))):
            return p
    return None


def musa_scenes(keys):
    shots = json.load(open(os.path.join(ART, "shots.json"), encoding="utf-8"))
    keys = keys or list(shots)
    jobs = []
    for k in keys:
        s = shots[k]
        refs = [r for r in (approved_ref(w) for w in s.get("who", [])) if r][:3]
        lead = BACKDROP if k.startswith("bg-") else STYLE
        jobs.append((k, os.path.join(ART, "out", k + ".png"), (LOCK if refs else "") + lead + s["scene"] + END, refs))
    return run(jobs)


# ---------- Yusuf: make his hair and the torn shirt the same everywhere ----------
YIMG = os.path.join(ROOT, "games", "yusuf", "assets", "img")
YOUT = os.path.join(ROOT, "scripts", "yusuf-art", "fix")
HAIR_BOY = ("Edit the first picture. Keep everything exactly as it is: the scene, the light, the pose, the clothes and the face. "
            "Change only the boy's hair, so it is exactly like the boy's hair in the second picture: short, neat, close-cropped "
            "black hair. No twists, no knots, no locks, no tall curls.")
HAIR_MAN = ("Edit the first picture. Keep everything exactly as it is: the scene, the light, the pose, the clothes and the face. "
            "Change only the young man's hair, so it is exactly like his hair in the second picture: short, neat, close-cropped "
            "black hair. No twists, no knots, no locks, no tall curls.")
TEAR = ("Edit the first picture. Keep everything exactly as it is. Change only the back of the young man's long teal tunic: "
        "it is torn exactly as in the second picture, one long vertical rip down the middle of the back showing the cream "
        "lining. Also make his hair short, neat and close-cropped like in the second picture.")
FIXES = {
    "c1-a": (HAIR_BOY, "p-yusuf"), "c1-b": (HAIR_BOY, "p-yusuf"), "c2-w": (HAIR_BOY, "p-yusuf"),
    "c5-a": (HAIR_MAN, "c4-c"), "c5-c": (HAIR_MAN, "c4-c"), "c5-b4": (HAIR_MAN, "c4-c"),
    "c5-b3": (HAIR_MAN, "c4-c"),           # the long tear here is the one to keep
    "c5-b1": (TEAR, "c5-b3"),              # the small tear here becomes the same long tear
}


# The brothers: ten older brothers, plus Benjamin where he is there, all with dark skin (the first
# pictures had some light-skinned and a different number each time). After the youngest is held in
# Egypt the eldest stays behind (12:80), so nine go home.
BRO_REF = os.path.join(ROOT, "scripts", "yusuf-art", "refs", "brothers.png")
BEN = " and their youngest brother, a teenage boy in an orange-brown tunic, standing with them"
BRO = {
    "c2-a": (10, "", "the boy playing with the lamb"), "c2-b": (10, "", ""), "c2-c": (10, "", "the father and the shirt"),
    "c9-a": (10, "", ""), "c9-b": (10, "", "the man on the raised seat"),
    "c10-g": (10, BEN, "the father"), "c10-c": (10, BEN, "the guard, the cup and the man in the blue robe"),
    "c11-b": (9, "", "the father"), "c11-c": (10, BEN, "the man in the blue robe with open arms"),
    "c11-e": (10, "", "the man in the blue robe"), "c11-d": (10, BEN, "the man in the blue robe at the centre of the embrace"),
    "c12-a": (10, BEN, "the man in the blue robe and the camels"), "c12-c": (10, BEN, "the father holding the shirt"),
    "c13-b": (10, BEN, "the elderly father, the elderly mother and the man in the blue robe by the throne"),
}


def brothers(keys):
    keys = keys or list(BRO)
    jobs = []
    for k in keys:
        n, ben, keep = BRO[k]
        prompt = ("Edit the first picture. Keep the place, the light, the camera angle%s exactly as they are. Change only the group of "
                  "brothers: there must be exactly %d grown brothers%s. The brothers look like the men in the second picture, with "
                  "the same faces, robes and turbans, and every one of them has deep dark brown skin, none light-skinned. Count them: "
                  "exactly %d grown brothers." % ((", and " + keep) if keep else "", n, ben, n)) + END
        jobs.append((k, os.path.join(YOUT, "bro-" + k + ".png"), prompt, (os.path.join(YIMG, k + ".webp"), BRO_REF)))
    return run(jobs)


def yusuf_fix(keys):
    keys = keys or list(FIXES)

    def match(k):                       # the redrawn version of the picture to match, once there is one
        new = os.path.join(YOUT, FIXES[k][1] + ".png")
        return new if os.path.exists(new) else os.path.join(YIMG, FIXES[k][1] + ".webp")
    jobs = lambda ks: [(k, os.path.join(YOUT, k + ".png"), FIXES[k][0] + END, (os.path.join(YIMG, k + ".webp"), match(k))) for k in ks]
    # the shirt is matched to the redrawn c5-b3, so that one is drawn first
    failed = run(jobs([k for k in keys if k != "c5-b1"]))
    if "c5-b1" in keys:
        failed.update(run(jobs(["c5-b1"])))
    return failed


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "try":
        data = draw("A small golden crescent moon on a plain dark blue background." + END)
        print("ok: a picture of %d bytes came back" % len(data))
        sys.exit(0)
    failed = {"musa-refs": musa_refs, "musa-scenes": musa_scenes, "yusuf-fix": yusuf_fix, "yusuf-brothers": brothers}[cmd](args)
    if failed:
        print("%d failed: %s" % (len(failed), ", ".join(failed)))
        sys.exit(1)
