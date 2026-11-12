# Asmau African Muslim Visual Library

**Status:** Visual direction approved; first pair (one adult, one child) look approved by the owner; cultural review and terms check pending. See `REVIEW.md`.  
**Purpose:** A self-contained, reusable art-direction package for Asmau games.  
**Current branch:** `design/african-muslim-visual-library`

This folder is intentionally isolated. It does not modify game code, shared runtime code, the homepage, or existing game assets. It is designed to be shared with Claude for review and continued development.

## Creative direction

A warm, stylised-realism 3D world rooted in African Muslim visual cultures, with Hausa-Fulani and the historical Sokoto region as a major reference point. The world should feel welcoming, dignified, lived-in, adventurous and recognisably African.

The first visual concept board was approved by the project owner as a direction to develop. It is a mood/concept reference, **not** a production-ready character sheet or a claim of historical accuracy.

## Important historical distinction

The Yusuf game tells a Quranic story associated with ancient Egypt. The Sokoto Caliphate and Usman dan Fodio belong to a much later historical period. Hausa-Fulani clothing, architecture and material culture are therefore an intentional artistic inspiration for Asmau's broader visual identity, not a claim that Yusuf lived in a Sokoto-era setting.

For the Yusuf world, use an African-centred interpretation while researching ancient Egyptian/Nile Valley context separately. Do not indiscriminately transplant 18th–19th century Sokoto buildings, dress or objects into a setting presented as ancient Egypt. Where the game deliberately uses anachronistic visual inspiration, label it internally as artistic reinterpretation.

## Package contents

- `STYLE-GUIDE.md`: visual principles, palette, modelling and composition rules.
- `CHARACTER-CATALOG.md`: reusable character families and role guidance.
- `ENVIRONMENT-CATALOG.md`: architecture, settlements, landscapes and props.
- `ASSET-MANIFEST.json`: initial asset naming and production inventory.
- `CLAUDE-HANDOFF.md`: instructions for Claude and contributors.
- `LICENSING.md`: provenance and rights requirements.
- `concept-board.svg`: lightweight vector art-direction overview (historical mood reference only).
- `REVIEW.md`: review of the package, the first-pair drafts, and questions for the owner.
- `PROVENANCE.md`: tool, prompt, date and rights position for every generated image.
- `characters/char-adult-001/` and `characters/char-child-001/`: SPEC.md and reference drafts.
- `research/`: `SOURCES.md` (with confidence levels), `HAUSA-FULANI-WARDROBE.md`, `DAGBAMBA-PROFILE.md`.

## Production status

This is the **foundation package**. It does not yet contain rigged characters, 3D models, animations, game-ready textures, or a complete environment kit. Those should be produced in reviewable batches after the visual rules are agreed.

## Suggested next production batch

1. Create one child character in front, side and back views.
2. Create one adult Hausa-Fulani-inspired character in front, side and back views.
3. Create a small material and textile swatch sheet.
4. Build one modular compound entrance and one courtyard environment.
5. Review cultural accuracy and visual consistency before expanding the library.
