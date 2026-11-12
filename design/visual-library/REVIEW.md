# Review of the visual library foundation, and first-pair status

Reviewer: Claude, working on branch `design/african-muslim-visual-library`.
Scope: this folder only. No game or application code was touched.

## 1. Verdict on the foundation package

The written direction (stylised realism, Hausa-Fulani as a main reference, restrained palette, no script on
fabric, provenance required per asset) is sound and was kept unchanged. Three things in it are weak:

1. **`concept-board.svg` is not art-direction-grade.** It is flat vector placeholder art: one figure has a green
   face, one roof is a European-style pitch, and a logo glyph reads as a cross. The owner's reaction to
   code-drawn art was "not nice"; that applies to this file too. It stays in the manifest as a historical
   mood reference only. Do not use it to judge appeal.
2. **The package says "3D asset library" but contains no 3D and no route to it.** What exists after this pass
   is *2D reference art* (AI-generated, see `PROVENANCE.md`). A game-ready GLB needs a modeller working in
   Blender (or an image-to-3D tool whose output is then cleaned and rigged). Neither is available in this
   environment. Turnarounds are a prerequisite for that work, not a substitute.
3. **The library docs ban depicting prophets; the shipped Yusuf game depicts Yusuf and Yaqub by the owner's
   decision.** The root `README.md` states this explicitly. `CLAUDE-HANDOFF.md` does not know about it. The
   owner needs to pick one policy: either the library follows the per-game rule in the root README, or the
   game changes. Until then, neither first-pair character is to be used as a prophet or a companion of a
   prophet.

## 2. The ChatGPT concept sheet the owner shared

What it gets right, and what the production pair should match: warm film-grade lighting, expressive eyes,
readable silhouettes by age and role, rich but legible fabric detail, dark skin rendered with warm highlights
rather than grey.

What it gets wrong against the library's own rules (the owner may still like these; they are flagged, not
vetoed):

- **Region mixing.** Moroccan/Gulf-style gate and a minaret with a domed mosque sit beside Sudano-Sahelian
  mud architecture and a thatched round hut. Style guide: "avoid fantasy mash-ups".
- **Colour saturation.** Purple, orange and turquoise robes with dense gold ornament contradict "colour with
  restraint".
- **Ornament density** reads as Gulf/Ottoman brocade more than Hausa-Fulani embroidery.
- **Rights.** It is AI output with unknown training sources; the library's licensing rules apply to it too.
  It is not in the repository.

## 3. First pair: what was produced

One adult and one child, each as a front / true-side / back sheet. All are **AI-generated drafts** (Gemini
image model via an automation connector). Prompts, dates, and the full list of rejected and kept images are in
`PROVENANCE.md`.

| Draft | File | Honest assessment |
|---|---|---|
| Adult v1 | `characters/char-adult-001/reference/turnaround-v1-ai-draft.jpg` | Best silhouette and best fabric: wide-sleeved, flowing robe reads correctly as a *babban riga*. Faults: left view is a three-quarter turn, not a profile; pocket sits on the wearer's right, not left; back view lacks the neck roundel. |
| Adult v2 | `characters/char-adult-001/reference/turnaround-v2-ai-draft.jpg` | True profile and consistent across views. Faults: robe is narrower and sleeves shorter than v1, so it reads more like a tunic; chest embroidery has become a large rectangular bib, which is not how the pocket is described in the wardrobe brief. |
| Child v1 | `characters/char-child-001/reference/turnaround-v1-ai-draft.jpg` | Appealing face, correct true profile, consistent across views. Faults: stiff A-pose; hands are small and doll-like; head scarf reads as a hood; outfit is plain next to the ChatGPT sheet's richness; the wrapper has pattern only as a sparse diamond grid. |

Not yet checked and **not** claimed: whether the child outfit is correct for a Hausa-Fulani girl (it is an
unverified design proposal, see `research/HAUSA-FULANI-WARDROBE.md`), and whether any element resembles a
specific copyrighted character or an existing artist's style. That check is part of review.

## 4. Recommendation (updated after owner feedback)

- Owner prefers adult **v2** (relaxed arms close to the body). Child candidate **v2b** matches that pose. The
  older recommendations below about v1 are superseded.

- Adult: take **v1** as the silhouette target, **v2** as the profile/back-view target, and regenerate once with
  the prompt in `characters/char-adult-001/SPEC.md` (three-quarter fixed, pocket side fixed, roundel visible).
- Child: regenerate once with a more dynamic, relaxed pose, larger hands, and the head scarf styled as
  worn by a child (pinned, a looser tail), using `characters/char-child-001/SPEC.md`.
- Do **not** start a batch (scholar, elder, environments) until the owner approves one adult and one child.

## 5. Questions for the owner

1. Hausa-Fulani first (best documented) with Dagbamba as a second wardrobe profile, or Dagbamba first? The
   Dagbamba profile is empty of verified detail, see `research/DAGBAMBA-PROFILE.md`.
2. Adult man in his 40s and a girl of about 8: acceptable as the first pair? (They were my proposal.)
3. Prophet-depiction policy: follow the per-game rule, or the library's blanket rule?
4. ~~Is AI-generated art acceptable as final art?~~ **Answered: yes** (owner, 2026-11-12). Remaining: record
   the generator's terms of use and confirm commercial use, see `PROVENANCE.md`.
5. Who can review for cultural accuracy? A named reviewer is needed before anything is marked "approved".
