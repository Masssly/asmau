#!/usr/bin/env python3
"""
Find pictures in the prophets' games where someone came out light-skinned (CLAUDE.md: in the prophets' games everyone
is dark-skinned Black African). Gemini's text model looks at each picture; the ones it flags go on a contact sheet for a
person to look at. It is a first check only: a person still decides.

  PROJECT=asmau-assets python3 scripts/art/skin-check.py [slug ...] [--sheet out.jpg]

Without slugs it checks every game whose game.json names a prophet. Results: scripts/art/skin-check.json.
"""
import base64, json, os, sys, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import vertex

ASK = ("Look at every clearly visible person in this picture (ignore tiny far-away figures and statues). In this art "
       "style everyone should have dark brown skin, as Black African people. List any person whose skin is clearly light "
       "instead: white, pale, pinkish, olive or light tan. Shadow or warm lamplight on dark skin does not count. Answer only "
       "with JSON: {\"people\": N, \"light\": M, \"who\": \"short description of each light-skinned person and where\"}")


def ask(path, model="gemini-3-flash-preview", tries=6):
    url = vertex.endpoint().replace(vertex.MODEL, model)
    body = json.dumps({"contents": [{"role": "user", "parts": [
        {"inlineData": {"mimeType": vertex.mime(path), "data": base64.b64encode(open(path, "rb").read()).decode()}},
        {"text": ASK}]}], "generationConfig": {"temperature": 0}}).encode()
    for attempt in range(tries):
        req = urllib.request.Request(url, data=body, method="POST",
                                     headers={"content-type": "application/json", "x-goog-api-key": vertex.KEY})
        try:
            res = json.load(urllib.request.urlopen(req, timeout=120))
            text = "".join(p.get("text", "") for p in res["candidates"][0]["content"]["parts"])
            return json.loads(text[text.index("{"):text.rindex("}") + 1])
        except urllib.error.HTTPError as e:
            if e.code != 429 and e.code < 500:
                return {"error": "%d" % e.code}
        except Exception:
            pass
        time.sleep(10 * (attempt + 1))
    return {"error": "gave up"}


def main():
    args = sys.argv[1:]; sheet = None
    if "--sheet" in args:
        i = args.index("--sheet"); sheet = args[i + 1]; del args[i:i + 2]
    slugs = args or [s for s in sorted(os.listdir(os.path.join(ROOT, "games")))
                     if os.path.exists(os.path.join(ROOT, "games", s, "game.json"))
                     and json.load(open(os.path.join(ROOT, "games", s, "game.json"))).get("prophet")]
    jobs = []
    for s in slugs:
        d = os.path.join(ROOT, "games", s, "assets", "img")
        if os.path.isdir(d):
            jobs += [(s, f[:-5], os.path.join(d, f)) for f in sorted(os.listdir(d)) if f.endswith(".webp")]
    print(len(jobs), "pictures in", ", ".join(slugs), flush=True)
    with ThreadPoolExecutor(8) as ex:
        res = list(ex.map(lambda j: (j, ask(j[2])), jobs))
    out = {"%s/%s" % (s, k): r for (s, k, _), r in res}
    json.dump(out, open(os.path.join(HERE, "skin-check.json"), "w"), indent=1)
    flagged = [(s, k, p, r) for (s, k, p), r in res if r.get("light")]
    errors = [k for (s, k, p), r in res if "error" in r]
    for s, k, p, r in flagged:
        print("%s/%s: %s light of %s: %s" % (s, k, r.get("light"), r.get("people"), r.get("who")), flush=True)
    print("flagged:", len(flagged), "errors:", errors or "none")
    if sheet and flagged:
        from PIL import Image, ImageDraw
        W = 360; cols = 4; rows = (len(flagged) + cols - 1) // cols
        im = Image.new("RGB", (W * cols, (W + 26) * rows), "white"); dr = ImageDraw.Draw(im)
        for i, (s, k, p, r) in enumerate(flagged):
            x, y = (i % cols) * W, (i // cols) * (W + 26)
            im.paste(Image.open(p).convert("RGB").resize((W, W)), (x, y + 26)); dr.text((x + 5, y + 6), "%s/%s" % (s, k), fill="black")
        im.save(sheet, quality=85)


if __name__ == "__main__":
    main()
