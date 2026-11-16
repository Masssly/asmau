# Asmau: standing rules

Free Islamic story games for children, named after Nana Asma'u bint Usman dan Fodio. Static site on
GitHub Pages; pictures and sounds also served from R2 through the sync Worker. README.md explains how
things work; this file holds the decisions that must not be lost between sessions.

## Order on the landing page (the checker enforces it)
- **Stories of the Prophets:** the prophet who came first at the top. Each game.json has `"prophet"`,
  one of the names in `PROPHETS` in scripts/validate.js (the usual order of the prophets' stories,
  Adam … Muhammad ﷺ; the place of a few, such as Ayyub, Dhul-Kifl and Yunus, is uncertain).
- **Great Muslims:** the person born first at the top: `"born"` (a year) in game.json.
- **For little ones:** the easiest game first: `"level"` in game.json (1 = easiest).
- Each section ends with a "more coming" line: `"more"` in manifest.json.

## Sources
- Qur'an first (verse references on every chapter). Then the commentaries and hadith.
- For the prophets, use **Shia sources as well as Sunni ones** (for example al-Tabatabai's al-Mizan,
  al-Tabrisi's Majma' al-Bayan, al-Kafi, the Qisas al-Anbiya), so the games are for all Muslims.
  Where the two differ on something a parent would notice (for example what a prophet's "slip"
  was), tell the story in words both accept and explain the difference in the parents' note.
- Where they truly conflict and no wording can fairly hold both, **the story follows the Sunni
  view**, and the parents' note gives the Shia view too, with its source, so parents can read and
  think about it.
- Never invent a source. Mark what comes from commentary ("It is told that…").

## Parents' notes
- They live in plain text files, **one per page**: `games/<slug>/parents/<chapter>/<chapter>.<page>.md`
  (page 1.5 is `parents/1/1.5.md`), shown only on that page. Paragraphs are separated by an empty line; an
  empty file means no note; a file starting with a `# draft` line is a suggestion the game does not show until the owner deletes that line. The owner edits them on GitHub (parents/README.md says how); edits go live with
  the next release. Write a note on the page it explains. When pages move, `scripts/build-offline.js` moves
  the files with them (parents/pages.json, never edited by hand). Never put notes back into story.js or the
  author files (the checker refuses).
- Every page shows its number on the folded parents' line ("For parents · page 2.3" = chapter 2, page 3);
  people use it to say which page they mean.
- Tell each fact once. The chapter header already shows the verses and the links under the notes list
  them, so do not open a note with "Verses x–y."; call the commentary "the commentary" (the game names
  it once). Check with `node scripts/parent-repeats.js` before release.

## Pictures
- Polished 3D family-film look. **Prophets' games:** everyone dark-skinned Black African. **Great Muslims:** people
  drawn as the people they really were (Umm Ayman Abyssinian, Ibn Battuta Moroccan, each land's people as themselves);
  decided by the owner on 16 November 2026. Faces shown (prophets included). Modest clothing; every woman's and
  girl's hair covered.
- **Never shown:** the Prophet Muhammad ﷺ at any age, not even as a baby or by his hands. Where he is present, the
  picture leaves him out and a soft breeze (the `breeze` living effect) passes over it. Everyone else may be shown with
  their face: Companions, his mother and family, Khadija, Fatima, 'Ali, Abu Bakr, Umar (owner's decision, 16 November
  2026: children need to see them to follow the story).
- **Every narrated page has its own picture**; an activity plays only over a picture from its own
  chapter. The checker and the writing tools refuse borrowing.
- Groups of a set size (Yusuf's brothers): use scripts/yusuf-art/brothers.py and brothers_fix.py with
  `MODEL=gemini-3-pro-image`; count every kept picture by eye. Stand the group in a line or in rows of
  five with nobody in front of them; mend a picture with one edit at most (chained edits fade it).
- Look at every picture before it goes in (skin, covered hair, count, no text, matching the story).
- **Living scenes:** each story picture gets gentle effects placed on it (stars in its sky, a flicker on its lamp,
  leaves, birds, water shimmer) in games/<slug>/scene-fx.json. For new pictures run `PROJECT=asmau-assets python3
  scripts/scene-fx.py games/<slug>`, then look at the sheet (`--sheet out.png`). Never put fire or embers on Iblis or
  anything frightening; no animation of the snake. Real video clips only for a few chosen key moments, if ever.

## Story
- Every story game is made with the story kit (scripts/kit/README.md): a game is `scripts/<story>/kit.json`, its cast and
  chapter files, and `node scripts/kit/make.js <story> story|refs|scenes|import|fx|voice|listen|check`. A new one starts
  with `node scripts/kit/new.js`. Change the kit, not a copy of it.
- Read the story straight through before release (scripts/story-readthrough.js): no gaps, no jumps.
- Prefer more pages and activities over long pages of text.

## Voice
- The games' default voice is Google's Gemini text-to-speech on Vertex AI: model `gemini-2.5-flash-tts`,
  voice **Aoede**, asked to speak as a kind West African woman (the exact words are STYLE and STYLE_AR in
  scripts/generate-voice-gemini.py). Chosen by the owner on 15 November 2026 from four samples. It reads
  English and Arabic. Use it for any new line or game: `PROJECT=asmau-assets python3
  scripts/generate-voice-gemini.py games/<slug>` (only new or changed lines are voiced).
- **A second voice, a man's:** Gemini voice **Achird**, a natural, calm reading voice (STYLE/STYLE_AR under `SET == "m"` in
  the same script), chosen by the owner on 16 November 2026 from four samples. Families choose it in For parents ("Your
  voice is the best voice" → which computer voice); a device downloads only the chosen voice. Its clips are in
  `assets/audio-m/` and every line needs one (the checker refuses a game without): `VOICE=m PROJECT=asmau-assets python3
  scripts/generate-voice-gemini.py games/<slug>`, then `VOICE=m ... scripts/voice-check.py games/<slug>`. Achird tends to
  repeat the end of a line; the check catches it.
- A parent's own recording always replaces it. The device's built-in voice never reads Arabic.
- Then listen back: `PROJECT=asmau-assets python3 scripts/voice-check.py games/<slug>` (Gemini hears each clip and
  flags extra or wrong words; it once caught a line read in Hausa and two said twice). Redo a flagged clip by
  deleting its id from scripts/voice/<slug>.json and voicing again. On one- or two-word clips the checker itself
  can make up words; trust the clip's length there (the voice script already redoes any clip far too long).
- Do not run the old Piper script (scripts/generate-voice.py); it would overwrite these clips.

## Languages (decided 16 November 2026; pilot: Bahasa Indonesia, Rahmah El Yunusiyyah)
- English stays the site's language and the default. A family chooses another in For parents → Language (shown only
  once a game is checked in it). The pictures, activities and page numbers never change; only words.
- A game's translation: `games/<slug>/lang/<code>.json` (`lines` by id, `strings` by English text: titles, labels, its
  card). Buttons shared by every page: `shared/i18n/<code>.json`. `node scripts/lang-strings.js <slug> <code>` lists what
  is missing. A game not translated plays in English and its card says so.
- **A translation reaches families only when a native speaker has checked it**: `"status": "checked"` (until then
  `"draft"`, seen only with `?lang=<code>` in the address). The checker then demands every line and label and both voices.
- Voices: the same Aoede and Achird, asked to speak as native speakers of the language:
  `STORY_LANG=id [VOICE=m] PROJECT=asmau-assets python3 scripts/generate-voice-gemini.py games/<slug>` (clips in
  `assets/audio-id/`, `audio-id-m/`; packs `<slug>@id-w`, `@id-m`), then the same with `scripts/voice-check.py`.
- Parents' notes and the For parents texts stay in English for now. Arabic words and prayers stay Arabic.

## Brand
- Mark: the West African writing board (allo) with أ ب ت, chosen by the owner on 15 November 2026. Name
  "Asmau", tagline "Islamic games for curious kids". Rules, colours and how to remake every icon:
  brand/README.md. Never hand-edit brand/kit; remake it.

## Links, donations and the apps
- Every link that leaves Asmau goes through the grown-up check (shared/gate.js) automatically; never open an
  outside page another way (no window.open of an outside address from game code).
- Anything about donations or other website-only things gets `class="web-only"`: the store apps (opened as
  `?app=ios|android|huawei`) must show no donation link or wording. Apple Kids category, age band 6–8.

## Built for 100 games (scripts/SCALING.md, decided 16 November 2026)
- **A game's pictures and sounds (`games/<slug>/assets/`) are not in git.** Their home is R2; `packs/<pack>.json`
  (committed, written by `scripts/build-offline.js`) is the record of which version the site uses. After cloning, or
  before working on pictures or voices or running the tests: `node scripts/fetch-media.js`. Deleting media on purpose:
  `node scripts/build-offline.js --prune`.
- Pages ask for a game's media through `shared/media.js` (`AsmauMedia.url(path)`): never hard-code `assets/...` URLs.
- Packs: `core` at the first visit, a game's pack when it is opened, one voice pack (`@w` or `@m`). Covers, icons and
  fonts stay in git. The home page reads `games/index.json` (generated from manifest.json and each game.json).
- Notes for parents are still one `.md` per page; the build bundles each game's live notes into `parents/notes.json`.
- Tests play Yusuf, Musa and every game changed since origin/main (`PLAY=all` for every game).

## Releasing
- `node scripts/release.js "note"` → `node scripts/validate.js` → full tests (tests/run.js) →
  commit → `scripts/publish-media.js` (needs ADMIN_TOKEN, never committed; **required** whenever pictures or sounds
  changed, since R2 is their only home) → push main → check version.json live.
