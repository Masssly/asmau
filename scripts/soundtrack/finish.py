#!/usr/bin/env python3
"""
Finish the recorded Asmau soundtrack (scripts/soundtrack/record.js wrote the .wav files) and put it on R2.

  ADMIN_TOKEN=... python3 scripts/soundtrack/finish.py <plan.json> <folder with the .wav files>

Each track: a 2-second fade in and a 6-second fade out, levelled to -16 LUFS (true peak -1 dB), then
  <prefix><nn>-<name>.mp3           MP3, 320 kbit/s, tagged (title, album, track number), for listening and sharing
  <prefix>lossless/<nn>-<name>.ogg  FLAC in an Ogg file (lossless), for videos and editing
on R2 at <server>/media/<first 10 hex of SHA-1>/<path>; the plan's "prefix" (soundtrack/, soundtrack/games/<slug>/)
and "out" (the list of addresses written beside the plan, committed: tracks.json, games/<slug>.tracks.json).
"""
import hashlib, json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
BASE = subprocess.check_output(["node", "-e", "console.log(require('./scripts/build-offline.js').MEDIA_BASE)"], cwd=ROOT).decode().strip()
MAX = 5 * 1024 * 1024        # the server's limit today; 50 MiB once sync/worker.js with MEDIA_MAX is deployed


def ff(*a):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y"] + list(a), capture_output=True, text=True, check=True).stderr


def request(url, method="GET", body=None, token=None):
    h = {"user-agent": "asmau-soundtrack/1"}
    if token:
        h["authorization"] = "Bearer " + token
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=body, method=method, headers=h), timeout=300) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def put(path, data, token):
    h = hashlib.sha1(data).hexdigest()[:10]
    if request(BASE + h + "/" + path, "HEAD")[0] != 200:
        st, msg = request(BASE.replace("/media/", "/admin/media/") + h + "/" + path, "PUT", data, token)
        if st != 201:
            raise SystemExit("%s: %s %s" % (path, st, msg[:100]))
    st, back = request(BASE + h + "/" + path)
    if st != 200 or hashlib.sha1(back).hexdigest()[:10] != h:
        raise SystemExit(path + ": the copy on R2 does not match")
    return BASE + h + "/" + path


def main():
    token = os.environ.get("ADMIN_TOKEN")
    if len(sys.argv) < 3 or not token:
        raise SystemExit(__doc__)
    plan_path, src = sys.argv[1], sys.argv[2]
    plan = json.load(open(plan_path, encoding="utf-8"))
    prefix = plan.get("prefix", "soundtrack/")
    out_path = os.path.join(os.path.dirname(os.path.abspath(plan_path)), plan.get("out", "tracks.json"))
    out, n = [], len(plan["tracks"])
    for i, t in enumerate(plan["tracks"]):
        name = "%02d-%s" % (i + 1, t["file"])
        wav, secs = os.path.join(src, name + ".wav"), t["seconds"]
        fade = "afade=t=in:d=2,afade=t=out:st=%d:d=6" % (secs - 6)
        # two-pass loudness: measure, then apply exactly
        m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", ff("-i", wav, "-af", fade + ",loudnorm=I=-16:TP=-1:LRA=11:print_format=json", "-f", "null", "-")).group(0))
        norm = (fade + ",loudnorm=I=-16:TP=-1:LRA=11:linear=true:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s,aresample=48000"
                % (m["input_i"], m["input_tp"], m["input_lra"], m["input_thresh"], m["target_offset"]))
        tags = ["-metadata", "title=" + t["title"], "-metadata", "artist=" + plan["artist"], "-metadata", "album=" + plan["album"],
                "-metadata", "track=%d/%d" % (i + 1, n), "-metadata", "date=%d" % plan["year"],
                "-metadata", "comment=Heard in: " + ", ".join(t["heard"])]
        mp3, ogg = os.path.join(src, name + ".mp3"), os.path.join(src, name + ".ogg")
        # the server takes files up to 5 MiB (sync/worker.js MAX): a long track gets the best MP3 bitrate that fits
        rate = next(r for r in (320, 256, 192, 160, 128, 112, 96) if secs * r * 1000 / 8 + 65536 < MAX)
        ff("-i", wav, "-af", norm, "-ac", "2", "-c:a", "libmp3lame", "-b:a", "%dk" % rate, "-id3v2_version", "3", *tags, mp3)
        ff("-i", wav, "-af", norm, "-ac", "2", "-c:a", "flac", "-sample_fmt", "s16", *tags, "-f", "ogg", ogg)
        lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", ff("-i", mp3, "-af", "ebur128", "-f", "null", "-"))[-1]
        entry = {"n": i + 1, "title": t["title"], "mood": t["mood"], "seconds": secs, "heard": t["heard"], "lufs": float(lufs),
                 "kbps": rate, "mp3": put(prefix + name + ".mp3", open(mp3, "rb").read(), token)}
        if os.path.getsize(ogg) < MAX:
            entry["lossless"] = put(prefix + "lossless/" + name + ".ogg", open(ogg, "rb").read(), token)
        else:
            entry["lossless"] = None
            entry["note"] = "lossless copy too big for the server's 5 MiB limit; run this again once the limit is raised"
        out.append(entry)
        print("%s  %s  %s LUFS" % (name, t["title"], lufs), flush=True)
    json.dump({"album": plan["album"], "artist": plan["artist"], "year": plan["year"], "tracks": out},
              open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(out_path, "a").write("\n")


if __name__ == "__main__":
    main()
