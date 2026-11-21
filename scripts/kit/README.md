# The story kit

Every story game made since Adam is written the same way. The kit holds that way once, so a new game is a small
config, its chapter files, and one command per step.

## What a story has

| File | What it is |
|---|---|
| `scripts/<story>/kit.json` | the game's folder (`game`), its picture folder (`art`), the letter its line ids start with (`prefix`), `name` (for story.js), the picture `look`, the emoji skin `tone` |
| `scripts/<story>/author/cast.js` | the people and places in its pictures (`WHO`), who gets a reference picture (`REFS`), its source lines (`SOURCES`) |
| `scripts/<story>/author/c1.js …` | the chapters: words, pictures and activities side by side |
| `scripts/<story>/author/em.js` | icons shown on a page whose picture is missing |
| `scripts/<story>/RESEARCH.md`, `OUTLINE.md` | the facts with their sources, and the outline the owner approved |

`author/lib.js`, `author/build.js` and `scripts/<art>/build.py` are one-line hand-offs to the kit, so the old commands
still work.

## The kit

| File | Does |
|---|---|
| `scripts/kit/author.js` | the helpers the chapter files call: `chapter`, `s` (a page), `q` (a question), `srt`, `ord`, `mat`, `chg`, `p`, `portrait`, `backdrop` |
| `scripts/kit/build.js <story>` | writes `games/<game>/story.js`, `narration.json`, and `scripts/<art>/shots.json`, `refs.json`, `presence.json` |
| `scripts/kit/art.py <story> prompts\|import <folder>` | prints the picture prompts; takes drawn pictures into the game (`art.js`) |
| `scripts/art/vertex.py refs\|scenes <story>` | draws the reference pictures and the scenes, in the story's look (`LOOKS` there) |
| `scripts/kit/make.js <story> <steps…>` | runs the steps below |
| `scripts/kit/new.js` | starts a new story (folders, config, a first chapter, the game's page with TODOs) |

## Making a game

1. `node scripts/kit/new.js <story> <slug> "<Title>" <letter> <look>`; then research and an outline for the owner.
2. Write `cast.js` and the chapters. `node scripts/kit/make.js <story> story` after each change.
3. `PROJECT=asmau-assets node scripts/kit/make.js <story> refs`, look at each reference picture, list the good ones in
   `scripts/<art>/refs/approved.json`, and put them on R2: `ADMIN_TOKEN=... python3 scripts/refs-media.py publish`.
   Anyone else who turns up in three or more pictures gets a reference too, made from a picture the game already shows
   (`scripts/art/ref-from.py`); the kit warns about anyone missing one.
4. `... make.js <story> scenes`, **look at every picture** (skin, covered hair, count, no text, matches the story, the
   Prophet ﷺ never shown), redraw what is wrong, then `... make.js <story> import fx`.
5. `... make.js <story> voice listen`: both voices, and every translation in `lang/<code>/<slug>.json`. Redo flagged clips.
6. Notes for parents, one file per page (`games/<slug>/parents/`); the cover; the game in `manifest.json`.
7. `node scripts/kit/make.js <story> check`, then the release steps in CLAUDE.md.
