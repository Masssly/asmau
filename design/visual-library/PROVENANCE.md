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
- **Owner decision (2026-11-12): AI-generated art is acceptable as final art.** That settles the project's
  *preference*, not the legal question. Two items stay open and are tracked here: (1) the owner or a
  maintainer reads the generator's current terms of use for commercial use of outputs and records the
  result below (I have not verified them), (2) ownership/copyright in AI output is uncertain in many
  countries, so Asmau may not be able to exclude others from copying it. Repo and licence notes must say
  "AI-generated" for every such asset.
- Until item (1) is recorded, keep these images out of the shipped site; reference and review use only.
- Terms check result: _not yet recorded_.
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

## Owner feedback round 2 (2026-11-12), and a misreading corrected

The owner said adult v2 "looks excellent" and that "the hands are not widespread like the rest". I first read
that as a complaint and regenerated the adult with open, spread arms (two drafts, "v3a" and "v3b"). That was
the opposite of what the owner meant: the owner **prefers v2's relaxed arms hanging close to the body** and
wants the other sheets to match it. The v3 drafts were deleted from the repository (they remain in git
history, commit eddf832). Prompts for them, for the record: v2 text with "A-pose: arms angled about 30 degrees
away from the body, hands open ... fingers gently spread" (v3a) and "arms held out slightly from the sides,
open relaxed hands with separated fingers" (v3b).

Pose rule from now on: **arms hang naturally at the sides, close to the body, hands relaxed.** Note for the
future 3D modeller: riggers usually prefer an A-pose for the bind pose; a modeller can pose from the relaxed
sheet, and a separate A-pose reference can be made later if needed, only if the owner wants it.

The connector takes text only (no reference image), so a sheet cannot be edited; a re-run gives a new person.

### char-child-001 / turnaround-v2a-ai-draft-plain.jpg and turnaround-v2b-ai-draft.jpg
- Created: 2026-11-12. Same tool. Prompt (v2a): child v1 text with "arms hanging naturally at her sides close to
  the body, hands relaxed with fingers softly curled", "scarf pinned neatly at the chin with a soft tail over
  one shoulder". Prompt (v2b): "arms resting down at her sides touching the body, relaxed hands", "big bright
  kind eyes", white geometric trim at the cuffs, plain scarf over head and shoulders.
- v2a: plain, small diamond grid, profile faces left. v2b: richer cuff and hem trim, profile faces right as
  specified, current candidate. Both: no script or pseudo-script seen. Faults: v2b scarf is a smooth hood
  with no visible pinning; wrapper has a more saturated violet-blue than the style palette's indigo.

## Expression sheets (2026-11-12)

The connector cannot take the approved turnaround as a reference image, so these sheets were generated from
text descriptions of the approved characters. **They show similar people, not provably the same faces as the
approved turnarounds.** Owner must compare faces side by side before approving.

Two takes were generated for each character; one of each was kept, the other discarded (not stored).

### char-child-001 / expressions-v1-ai-draft.jpg
- Prompt: "Character expression sheet: six head-and-shoulders portraits of the same West African Muslim girl
  about 8 years old, in a 3 by 2 grid, front view, identical face in every panel. Expressions: calm neutral,
  joyful grin, amazed with open mouth, curious with one eyebrow raised, sad with trembling lip, giggling with
  squinted eyes. Polished stylised 3D animated family-film look, soft studio lighting, plain warm cream
  background. Deep dark brown skin, large bright eyes, round cheeks. Cream cotton head scarf worn neatly over
  the head and shoulders, hair fully covered, teal blouse collar visible. No text, no labels, no writing, no
  calligraphy, no logos, no watermark."
- Result: six panels. Neutral, smile, amazed, curious, sad, giggle (hands over mouth). Faults: "curious" and
  "neutral" are nearly identical; faces look rounder and heavier than the turnaround; teal collar only just
  visible. No script seen. Discarded take had eight panels and an older-looking face.

### char-adult-001 / expressions-v1-ai-draft.jpg
- Prompt: "Character expression sheet: six head-and-shoulders portraits of the same West African Muslim man in
  his 40s, in a 3 by 2 grid, front view, identical face in every panel. Expressions: dignified neutral, gentle
  smile, astonished, pondering, worried, joyful laughter. ... Deep dark brown skin, neatly trimmed short black
  beard, kind eyes. White brimmed cap with tonal geometric stitching, white collar and rose-coloured V-neck
  facing of an indigo-and-white striped robe. No text, no labels, no writing, no calligraphy, no logos, no
  watermark." (shared style/background wording as the turnaround prompt)
- Result: eight panels, not six: neutral, smile, astonished, concerned, pondering, two worried, laughter. Cap
  stitching is a zigzag, geometric. Rose facing is wider than on the approved robe. No script seen.
  Discarded take showed no white under-collar, which does not match the approved design.
