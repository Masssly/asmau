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
- Tell each fact once. The chapter header already shows the verses and the links under the notes list
  them, so do not open a note with "Verses x–y."; call the commentary "the commentary" (the game names
  it once). Check with `node scripts/parent-repeats.js` before release.

## Pictures
- Polished 3D family-film look. Everyone dark-skinned Black African. Faces shown (prophets included).
  Modest clothing; every woman's and girl's hair covered.
- **Every narrated page has its own picture**; an activity plays only over a picture from its own
  chapter. The checker and the writing tools refuse borrowing.
- Groups of a set size (Yusuf's brothers): use scripts/yusuf-art/brothers.py and brothers_fix.py with
  `MODEL=gemini-3-pro-image`; count every kept picture by eye. Stand the group in a line or in rows of
  five with nobody in front of them; mend a picture with one edit at most (chained edits fade it).
- Look at every picture before it goes in (skin, covered hair, count, no text, matching the story).

## Story
- Read the story straight through before release (scripts/story-readthrough.js): no gaps, no jumps.
- Prefer more pages and activities over long pages of text.

## Releasing
- `node scripts/release.js "note"` → `node scripts/validate.js` → full tests (tests/run.js) →
  commit → `scripts/publish-media.js` (needs ADMIN_TOKEN, never committed) → push main → check
  version.json live.
