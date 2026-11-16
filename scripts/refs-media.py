#!/usr/bin/env python3
"""
The character reference portraits (scripts/<story>-art/refs/): drawn once, approved, then shown to the picture tool
with every scene, so a person looks the same from scene to scene. Many are too big for git (.gitignore keeps them
out), so their home is R2, like the games' media, and scripts/art/refs-media.json (committed) lists them.

  ADMIN_TOKEN=... python3 scripts/refs-media.py publish   put every portrait not in git on R2, update the list
  python3 scripts/refs-media.py fetch                     bring back any listed portrait missing on this computer

R2 takes pictures only as WebP, so each is stored as lossless WebP (every pixel the same, checked before it is listed)
at <server>/media/<first 10 hex of SHA-1>/<path>.webp, and turned back into its own format (PNG, JPEG) when fetched.
Nothing is ever deleted there; a changed portrait gets a new address.
"""
import hashlib, io, json, os, subprocess, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIST = os.path.join(ROOT, "scripts", "art", "refs-media.json")
BASE = subprocess.check_output(["node", "-e", "console.log(require('./scripts/build-offline.js').MEDIA_BASE)"], cwd=ROOT).decode().strip()
IMG = (".png", ".jpg", ".jpeg", ".webp")


def portraits():
    tracked = set(subprocess.check_output(["git", "ls-files", "scripts"], cwd=ROOT).decode().split("\n"))
    out = []
    for d in sorted(os.listdir(os.path.join(ROOT, "scripts"))):
        top = os.path.join(ROOT, "scripts", d, "refs")
        if not d.endswith("-art") or not os.path.isdir(top):
            continue
        for dirpath, _, files in os.walk(top):
            for f in files:
                rel = os.path.relpath(os.path.join(dirpath, f), ROOT)
                if f.lower().endswith(IMG) and rel not in tracked:
                    out.append(rel)
    return sorted(out)


def sha(b):
    return hashlib.sha1(b).hexdigest()[:10]


def request(url, method="GET", body=None, token=None):
    req = urllib.request.Request(url, data=body, method=method, headers={"user-agent": "asmau-refs/1"})
    if token:
        req.add_header("authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def pixels(im):
    return im.convert("RGBA").tobytes(), im.size


def publish():
    token = os.environ.get("ADMIN_TOKEN")
    if not token:
        raise SystemExit("Set ADMIN_TOKEN (the Worker's admin secret).")
    lst = json.load(open(LIST)) if os.path.exists(LIST) else {}
    sent = had = failed = 0
    for f in portraits():
        src = Image.open(os.path.join(ROOT, f))
        buf = io.BytesIO()
        src.save(buf, "WEBP", lossless=True, quality=100, method=6, exact=True)
        data = buf.getvalue()
        if pixels(Image.open(io.BytesIO(data))) != pixels(src):
            failed += 1; print("  %s: the WebP copy is not pixel-identical; not uploaded" % f); continue
        h, key = sha(data), f + ".webp"
        if request(BASE + h + "/" + key, "HEAD")[0] == 200:
            had += 1
        else:
            st, msg = request(BASE.replace("/media/", "/admin/media/") + h + "/" + key, "PUT", data, token)
            if st != 201:
                failed += 1; print("  %s: %s %s" % (f, st, msg[:100])); continue
            sent += 1
        st, back = request(BASE + h + "/" + key)
        if st != 200 or sha(back) != h:
            failed += 1; print("  %s: the copy on R2 does not match" % f); continue
        lst[f] = {"hash": h, "stored": key, "format": (src.format or "PNG")}
    json.dump(dict(sorted(lst.items())), open(LIST, "w"), indent=1)
    open(LIST, "a").write("\n")
    print("%d portraits listed: %d uploaded, %d already there, %d failed" % (len(lst), sent, had, failed))
    if failed:
        sys.exit(1)


def fetch():
    lst = json.load(open(LIST)) if os.path.exists(LIST) else {}
    got = have = 0
    for f, e in lst.items():
        dest = os.path.join(ROOT, f)
        if os.path.exists(dest):
            have += 1; continue
        st, data = request(BASE + e["hash"] + "/" + e["stored"])
        if st != 200 or sha(data) != e["hash"]:
            print("  %s: could not download (%s)" % (f, st)); continue
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        im = Image.open(io.BytesIO(data))
        fmt = e.get("format", "PNG")
        (im.convert("RGB") if fmt == "JPEG" else im).save(dest, fmt, **({"quality": 95} if fmt == "JPEG" else {}))
        got += 1
    print("%d portraits downloaded, %d already here" % (got, have))


if __name__ == "__main__":
    {"publish": publish, "fetch": fetch}.get(sys.argv[1] if len(sys.argv) > 1 else "", lambda: sys.exit(__doc__))()
