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
- In every section the games that can be played come first, in that order; the coming-soon games follow, in the same
  order (owner, 17 November 2026).
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
- **The owner edits notes on the Parents' notes page** (https://claude.ai/artifact/8A5eHNzNpT5frdiDfRRUwZ, one database
  document per page, decided 19 November 2026). Before every release: ArtifactData query `notes` where `edited == true`
  (with `out_dir`), `python3 scripts/notes-apply.py <dir>`, name the pages in the release note; after the push, set
  `edited: false` on them (pinned). When notes change in the repository (new game, new page, a note I write), add or
  update their documents too, so the page never shows stale text.
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
- **Anyone seen in three or more pictures gets a reference picture** (owner, 17 November 2026), made from a picture the game
  already shows: `PROJECT=asmau-assets MODEL=gemini-3-pro-image python3 scripts/art/ref-from.py <art> <KEY> <picture> "<who>"`.
  Look at it, list it in `refs/approved.json`, use it for every later picture or edit of that person. The story kit warns
  about anyone missing one; places, crowds and those kept faceless on purpose are listed in `NOREF` in cast.js with why.
- The character reference portraits (`scripts/<story>-art/refs/`) live on R2 too, as lossless WebP, listed in
  `scripts/art/refs-media.json`: after cloning, `python3 scripts/refs-media.py fetch`; after approving a new one,
  `ADMIN_TOKEN=... python3 scripts/refs-media.py publish`, then commit the list.
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

## Music
- All the music is made by the games' own engine (shared/music.js): no recordings, samples or borrowed melodies, so
  nothing to license. Every new game uses the existing moods, so the whole platform sounds like one family (owner,
  19 November 2026); a new mood only with the owner's approval. The music as albums: scripts/soundtrack/README.md.

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
- **Families see them by name** (21 November 2026): Aoede is **Aunty Salma** ("warm and gentle"), Achird is **Uncle Sani**
  ("calm and steady"), in index.html (three places), shared/story-engine.js and lang/<code>/site.json. Not names of prophets or of
  people in the games.
- A parent's own recording always replaces it. The device's built-in voice never reads Arabic.
- Then listen back: `PROJECT=asmau-assets python3 scripts/voice-check.py games/<slug>` (Gemini hears each clip and
  flags extra or wrong words; it once caught a line read in Hausa and two said twice). Redo a flagged clip by
  deleting its id from scripts/voice/<slug>.json and voicing again. On one- or two-word clips the checker itself
  can make up words; trust the clip's length there (the voice script already redoes any clip far too long).
- Do not run the old Piper script (scripts/generate-voice.py); it would overwrite these clips.

## Languages (decided 16 November 2026; pilot: Bahasa Indonesia, Rahmah El Yunusiyyah)
- English stays the site's language and the default. A family chooses another in For parents → Language (shown only
  once a game is checked in it). The pictures, activities and page numbers never change; only words.
- **Everything for one language is in one folder, `lang/<code>/`** (owner, 21 November 2026; lang/README.md is for
  translators, other AIs and pull requests): `site.json` (the words on every page) and `<slug>.json` per game (`lines` by
  id, each `{ "en": English, "t": translation }`; `strings` by English text: titles, labels, its card). A new language:
  `node scripts/lang-new.js <code> "<its own name>"`. `node scripts/lang-strings.js <slug> <code>` lists what is missing
  and lines whose English changed. `lang/STATUS.md` (generated by the build) shows every language game by game. A game
  not translated plays in English and its card says so.
- **A device downloads only the language in use**: each language is one pack, `core@<code>`; English families download
  no translations. Never put translations back into a game's folder or the core pack.
- **A translation reaches families only when the owner says it is good enough** (a native speaker's reading, or the
  owner's own; owner, 21 November 2026): `"status": "checked"` (until then
  `"draft"`, seen only with `?lang=<code>` in the address). The checker then demands every line and label.
- **Voices are not required (owner, 21 November 2026).** A checked translation goes live as text; its computer voices follow
  later, only where Gemini sounds right in that language. `"voices": ["w", "m"]` in the file lists the ones it has (each must
  read every line). With none, the game reads nothing aloud in that language: never the English voice under translated
  words, and never the device's own voice (English only). Recordings still play.
- **Arabic is Modern Standard Arabic** (owner, 21 November 2026). Languages live for families (21 November 2026): German
  (a native speaker's sample), French (the owner's own reading), Indonesian and Malay (a first reading by the owner's
  native-speaker colleagues; families report what they find). Turkish is a complete draft (21 November 2026; verses in the notes quoted from the Diyanet translation), waiting for a native speaker. Still to do: Bengali; right to left: Arabic, Urdu, Persian. Languages AI
  does not know well wait for paid human translators.
- Voices: the same Aoede and Achird, asked to speak as native speakers of the language:
  `STORY_LANG=id [VOICE=m] PROJECT=asmau-assets python3 scripts/generate-voice-gemini.py games/<slug>` (clips in
  `assets/audio-id/`, `audio-id-m/`; packs `<slug>@id-w`, `@id-m`), then the same with `scripts/voice-check.py`.
- **A language is whole (owner, 21 November 2026): everything families can read is translated**, the For parents texts,
  each game's About box, the notes for parents (`notes` in each game's file, page by page), the recorder, privacy and
  refresh pages, the little ones' games and every message the scripts write. No English left in places. Check a language
  with `node scripts/lang-collect.js <code>` (every page in a browser; `--write` adds what is missing) and
  `node scripts/lang-strings.js <slug> <code>`; the checker refuses a checked game whose lines, labels or notes are missing.
  A release note that families see in What's new needs its translation in each live language's site.json too.
  A language without a computer voice is silent by default; a family can choose the English voice instead (For parents).
  Arabic words and prayers stay Arabic, and Arabic lines keep their Arabic clip in every language.

## Brand
- Mark: the West African writing board (allo) with أ ب ت, chosen by the owner on 15 November 2026. Name
  "Asmau", tagline "Islamic games for curious kids". Rules, colours and how to remake every icon:
  brand/README.md. Never hand-edit brand/kit; remake it.
- **Social media** (owner, 20 November 2026): a weekly scheduled Claude task fills the Asmau social queue
  (https://claude.ai/artifact/AXbK2FN6eWeqBtxUN84ddu) with three posts made only from the games; the owner approves each,
  and only then does Metricool (free plan: TikTok, YouTube; at most 20 network posts a month) schedule it. LinkedIn by hand.
  Claude never schedules a draft. The routine: scripts/social/README.md.

## Free for ever (owner, 17 November 2026)
- The games are always free, with no paid tier, no account and no adverts: we never charge for the knowledge. Money comes
  from donations, grants and later a merchandise shop on the website (web-only, never in the store apps). How we talk
  about Asmau, and what sets it apart: brand/PITCH.md.

## Measuring (owner, 20 November 2026)
- Nothing that counts runs on a child's device: no analytics script, so Cloudflare Web Analytics stays off. The only count is
  the sync Worker's anonymous one (game, voice, country per picture or voice served), read with `node scripts/measures.js`.
  The privacy texts (index.html, privacy.html) say exactly this; change them with any change to what is counted.

## Links, donations and the apps
- Every link that leaves Asmau goes through the grown-up check (shared/gate.js) automatically; never open an
  outside page another way (no window.open of an outside address from game code).
- **Our email address on a page stays inside `<!--email_off-->` … `<!--/email_off-->`** (21 November 2026): Cloudflare's
  Email Address Obfuscation otherwise rewrites it with its own script and splits the words around it, so they are no longer
  translated. The checker refuses a page without it.
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

## Keeping a family's things (scripts/KEEPING.md, owner's rule 17 November 2026)
- An update never wipes what a family has on a device: the family code, recordings, the child's place, voice and
  language. Never rename those keys or databases without moving the old values; never clear localStorage or IndexedDB.
  `tests/keep.test.js` checks it on every release.
- The site's address is **https://asmau.org** (Cloudflare Pages, deployed from main on every push; bought 18 November 2026).
  The old address masssly.github.io/asmau hands families over to it (scripts/KEEPING.md); never put a custom domain
  on the GitHub Pages site. Before shipping store apps, follow scripts/KEEPING.md: a new address is a new, empty
  storage on every device.

## Releasing
- `node scripts/release.js "note"` → `node scripts/validate.js` → tests: `node tests/run.js quick` →
  commit → `scripts/publish-media.js` (needs ADMIN_TOKEN, never committed; **required** whenever pictures or sounds
  changed, since R2 is their only home) → push main → check https://asmau.org/version.json live.
- **Two levels of tests** (owner, 25 November 2026): `node tests/run.js quick` runs only what the change since the live site
  needs (tests/plan.js maps files to test groups; one story game's change plays that game only). It runs everything
  instead when the change touches the engine (story engine, styles, music, narration, loaders, the build, the test
  runner), when a file is not in the plan, or when no full run has passed on this machine today. `node tests/run.js`
  is the full run (about 18 minutes). A new kind of file gets a rule in tests/plan.js, never a way round it.
