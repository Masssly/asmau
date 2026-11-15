#!/usr/bin/env python3
"""
Count the grown men in a picture with Gemini's text model, as a first check of how many
brothers a picture shows (a person still looks at every picture before it is used).

  PROJECT=<id> python3 scripts/art/count.py <picture> ...
"""
import base64, json, os, sys, time, urllib.error, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vertex

ASK = ("Look at this picture carefully. Count the brothers: the group of grown men with short beards in coloured robes and "
       "turbans who are together as one group. Do not count an old man with a white beard, a teenage boy, a man in a deep-blue "
       "robe with a white turban and gold band (the ruler), guards, servants, workers, or people far in the background. "
       "Also count teenage boys separately. Answer only with JSON: {\"brothers\": N, \"teen_boys\": M, \"notes\": \"...\"}")


def count(path, model="gemini-3-flash-preview", tries=6):
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
                return {"error": "%d %s" % (e.code, e.read().decode(errors="replace")[:200])}
        except Exception as e:
            err = str(e)
        time.sleep(15 * (attempt + 1))
    return {"error": "gave up"}


if __name__ == "__main__":
    for p in sys.argv[1:]:
        print(os.path.basename(p), json.dumps(count(p)), flush=True)
