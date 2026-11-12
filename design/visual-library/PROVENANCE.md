# Provenance log

Follows the record fields required by `LICENSING.md`. One entry per image kept in the repository.

## Generation tool and its limits

- Tool: Google Gemini image generation, reached through the Composio automation connector (action
  `GEMINI_GENERATE_IMAGE`), managed connection, no custom API key.
- Which Gemini model version served the request: **unknown**, the connector did not report it.
- Prompt limit on this connection: 1000 characters. Output: JPEG, 1376 x 768 for the 16:9 setting.
- No reference images were supplied. Nothing was copied from a museum, photographer, artist, game or the
  ChatGPT concept sheet.
- The generated images are time-limited download links; the files below were saved immediately.

## Rights position (unresolved)

- Copyright status of AI-generated images differs by country and is unsettled. Conclusion: it is **uncertain**
  whether Asmau owns any copyright in these drafts, and uncertain what the generator's terms allow for
  commercial use. These images must be treated as **reference drafts** until the owner confirms the terms.
- Do not ship these images inside a game. Final shippable art should come from original modelling work
  (human, or AI-assisted with a recorded process) where the rights are clear.
- Status for all entries: `ai-generated-draft`, cultural review `pending`, licence review `pending`.

## Entries

### char-adult-001 / turnaround-v1-ai-draft.jpg
- Created: 2026-11-12. Generator: Gemini image model via Composio. Type: generated.
- Prompt: "Character model sheet, three full-body views of the same West African Muslim man in his 40s, side by
  side at equal scale: front view, right side profile, back view. Neutral relaxed standing pose, arms slightly
  away from body. Polished stylised 3D animated family-film look, soft studio lighting, plain warm cream
  background. Deep dark brown skin, kind dignified face, neatly trimmed short black beard, gentle smile.
  White brimmed cap with tonal geometric stitching. Ankle-length wide-sleeved robe (babban riga) of narrow
  vertical indigo-and-white striped hand-woven cotton strips, V neckline with rose facing, large embroidered
  chest pocket on wearer's left in green silk with geometric triangles, small roundel at back of neck. White
  tunic and trousers visible at collar and ankles, brown leather slippers. No text, no writing, no
  calligraphy, no logos, no watermark."
- Inspected: no script or pseudo-script visible; cap stitching is geometric.
- Known faults: see `REVIEW.md`.

### char-adult-001 / turnaround-v2-ai-draft.jpg
- Created: 2026-11-12. Same tool. Prompt: same as v1 except: "true right side profile (body turned exactly 90
  degrees, nose pointing sideways)"; the words "(babban riga)", "gentle smile" and "silk" were removed; the
  pocket reads "large embroidered chest pocket on wearer's left in green geometric triangles".
- Inspected: no script or pseudo-script visible. Known faults: see `REVIEW.md`.

### char-child-001 / turnaround-v1-ai-draft.jpg
- Created: 2026-11-12. Same tool. Prompt: "Character model sheet, three full-body views of the same West
  African Muslim girl about 8 years old, side by side at equal scale: front view, true right side profile
  (body turned exactly 90 degrees), back view. Relaxed standing pose, arms slightly away from body.
  Polished stylised 3D animated family-film look, soft studio lighting, plain warm cream background. Deep
  dark brown skin, bright kind eyes, warm gentle smile, round cheeks. Cream cotton head scarf draped neatly
  over head and shoulders, plain with no pattern. Long-sleeved teal cotton blouse to the hips, ankle-length
  wrapper skirt of indigo cloth with small white geometric dyed diamond motifs, simple brown leather
  sandals. No text, no writing, no calligraphy, no logos, no watermark."
- Inspected: no script or pseudo-script visible.

## Superseded work, deliberately not kept

An experimental procedural (code-drawn) turnaround generator was built and then deleted from this branch
before committing: the owner judged code-drawn art unacceptable ("not nice"), and so did I.

## Owner feedback round 2 (2026-11-12)

The owner judged adult v2 "excellent" but noted its hands hang closed and close to the body, unlike the open,
spread hands of the other sheets. The connector accepts text only (no reference image), so v2 could not be
edited; the same prompt was re-run with an explicit open-hand A-pose. The person differs from v2 (new face,
new pocket), so v2 and v3 are alternatives, not versions of one design.

### char-adult-001 / turnaround-v3a-ai-draft-rejected.jpg
- Prompt: v2 text with "A-pose: arms angled about 30 degrees away from the body, hands open with fingers gently
  spread, palms facing forward"; "hand-woven", "silk" omitted. Rejected: embroidery is an uneven green
  blob, not the specified geometric pocket.

### char-adult-001 / turnaround-v3b-ai-draft.jpg
- Prompt: v2 text with "Standing with arms held out slightly from the sides, open relaxed hands with separated
  fingers, palms toward the body". Kept as the current candidate: open hands, true profile, roundel at back of
  neck, no script. Faults: pocket is centred on the chest rather than on the wearer's left; fingers slightly
  long; face differs from v2.
