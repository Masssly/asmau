# Asmau

Islamic games for curious kids — a growing collection of small, self-contained
browser games. Named after Nana Asma'u bint Usman dan Fodio, a scholar, poet
and educator in the Sokoto Caliphate (present-day northern Nigeria) known for
building a network of women teachers.

No build step for the games, no framework, no backend. It's plain HTML/CSS/JS
served directly by GitHub Pages — open any file and you're looking at exactly
what ships. (One small script keeps the offline file list current; see
"Checking your work".)

## Structure

```
asmau/
├── index.html              landing page — lists every game, reads its age badge
├── config.json             the sync/media Worker's address, written down once
├── manifest.json           the landing page's sections, each with its games in display order
├── app.webmanifest         lets the site be installed on a phone or tablet
├── sw.js                   service worker: the whole site works offline (generated lists)
├── version.json            the release number, date and notes (see scripts/release.js)
├── reset.html              clears a device's saved copy of the site
├── fonts/                  Baloo 2 and Mada, self-hosted (SIL OFL 1.1)
├── icons/                  app icons
├── shared/
│   ├── style.css           tokens + components (buttons, cards, age badge)
│   ├── narration.js        narration lookup — see "Narration" below
│   ├── story-engine.js     the story player shared by every story game (activities, saving, pages)
│   ├── story.css           its styles
│   ├── people.js           draws the people of a story; each game supplies its own cast
│   ├── sync.js, mp3.js     optional recording sync and MP3 conversion (the recording tool)
│   ├── config.js           generated from config.json: the sync/media Worker's address
│   ├── music.js            background music and sound effects — see "Music and sound effects"
│   └── pwa.js              registers the service worker
├── scripts/
│   ├── generate-placeholder-audio.sh   regenerates the flite placeholder clips
│   ├── build-offline.js                regenerates sw.js's lists
│   ├── release.js                      numbers a release and refreshes sw.js
│   ├── publish-media.js                puts pictures and sounds on R2 (see "Offline and updates")
│   └── validate.js                     checks the whole site; run by CI
├── tools/
│   └── record-voice/       lets a parent record real narration, in the browser
└── games/
    └── <slug>/
        ├── index.html      the game itself — fully self-contained
        ├── game.json       title, icon, age range, tagline, source, depiction notes
        ├── narration.json  every spoken line in the game: {id, text, lang}
        └── assets/
            └── audio/      <id>.mp3 (flite placeholder, or a real voice saved under the same name)
```

**The rule that matters**: a game only touches its own folder. Editing
`games/yusuf/` never risks breaking `games/tap-and-say/`, and
neither ever needs changes to `index.html` at the root — that page just
reads `manifest.json` and each game's `game.json`.

## Adding a new game

1. Copy an existing game folder as a starting point.
2. Write `game.json`:
   ```json
   {
     "slug": "your-game-slug",
     "title": "Display Title",
     "icon": "🌙",
     "minAge": 3,
     "maxAge": 6,
     "tagline": "One short line for the landing page card.",
     "basedOn": "Surah X, 1:2-3, or null if not scripture-based",
     "depictionNotes": "State plainly what is and isn't drawn, and why."
   }
   ```
3. Build `index.html` for the game. Link `../../fonts/fonts.css`,
   `../../shared/style.css`, `../../shared/narration.js` (and `music.js` if
   you want sound) as needed, and `../../shared/pwa.js` so it works offline.
4. Add the slug to a section's `games` in `manifest.json`, or add a new
   section `{ "id", "title", "icon", "games": [...] }`. Sections are always
   shown open on the landing page, one under the other.

Two optional fields in `game.json` change the game's card on the landing page:
`"status": "coming-soon"` shows the card greyed with a "Coming soon" label and
no link, for a game that is not ready to share; `"cover"` (with `"coverAlt"`)
names a picture in the game's folder to show, moving gently, instead of the
emoji icon, so a child who cannot read can choose by the picture.
5. Run the checks (below).

## Narration

Every spoken line in a game is listed in that game's `narration.json` as
`{ "id": "...", "text": "...", "lang": "en" | "ar" }`. Games never call
`speechSynthesis` directly — they call `AsmauNarration.say(gameSlug, id,
text, { lang })`, which tries, in order:

1. **A clip recorded on this device** (or received by sync), via
   `tools/record-voice`, stored in the browser's IndexedDB. Immediate,
   personal, no commit needed.
2. **`assets/audio/<id>.mp3`** committed in the repo. For English this is a
   placeholder generated offline with [flite](http://www.festvox.org/flite/)
   (BSD licensed, CMU Festival-Lite): run
   `scripts/generate-placeholder-audio.sh games/<slug>` to (re)generate
   these after editing a game's `narration.json`. A real recording saved
   under the same name replaces the placeholder for everyone.
3. The device's own `speechSynthesis` voice, **for English only**, same
   placeholder caveat as always.

One shared audio element plays every line (so an iPhone, which only lets a
page play sound after a touch, is unlocked by the first tap and stays
unlocked), and a line that is cut off is always cleaned up.

**Arabic is never synthesized**, by flite or by the device. A guessed
pronunciation presented to a child as a lesson is worse than silence, so an
Arabic line plays only from a real human recording (tiers 1 or 2, never a placeholder) and is
otherwise silent, while its text still shows on screen.

Recordings are saved as MP3, converted in the browser by lamejs (LGPL-3.0, in
`shared/vendor/`, loaded only by the recording tool), because browsers record in
different formats (Firefox WebM/Ogg, Safari MP4) and not every device plays every
one; MP3 plays on all of them. Turning on sync converts older recordings too.

**Recording real narration**: open `tools/record-voice/index.html`, pick a
game, and record each line from the microphone. Recordings save straight to
that browser's IndexedDB and are immediately preferred over the placeholder
— nothing to commit for personal use on your own devices. The same page can
save every recording on a device to one file and load it on another (record
on a phone, play on a tablet). To make a recording the default for *everyone*
who opens the game, download the clip and commit it to
`games/<slug>/assets/audio/<id>.mp3`. Recording real Arabic pronunciation
this way is the main reason this tool exists.

Before committing a recording, remember the repo (and the published site)
are public: it's your voice, or your child's, on a page anyone can open.

## Music and sound effects

`shared/music.js` makes music and effects on the spot with the Web Audio API,
so there are no audio files to license or download. A game opts in by
including it:

- `AsmauMusic.mood("wonder" | "desert" | "tense" | "sad" | "regal" | "joy")`, and a second
  family written for Musa so that each story has its own sound: `nile`, `court`, `dread`,
  `trek`, `awe`, `triumph`, `longing`, `pastoral`
- `AsmauMusic.amb("river" | "wind" | "night" | "fire" | "crowd" | "sea" | "rain" | "birds" | "camp" | "none")`:
  the sound of the place, under the music. It follows the effects switch, not the music switch.
  crossfades to a new background mood and never restarts the one already
  playing.
- `AsmauMusic.tension(0..1)` makes the current mood faster, brighter and
  more urgent (a heartbeat, hi-hats, a rising drone). Activities drive it
  from their own progress and clear it when they finish.
- `AsmauMusic.fx("tap" | "boing" | "wrong" | "win" | "heave" | "whoosh" |
  "swish" | "coin" | "wilt" | "tick" | "clink" | "sparkle" | "pour", a, b)`
  plays a one-shot effect.
- `AsmauMusic.duck(true | false)` lowers the music while a line of narration
  is speaking.
- `AsmauMusic.setMusic(on)` and `AsmauMusic.setSfx(on)` are separate
  switches. Muslim families differ on music in children's media, so a game
  that uses music should always offer a way to turn it off on its own while
  keeping the narration.

The levels were set by measurement, not by ear: offline renders in a headless
browser check every mood and effect for clipping, silence and DC offset, and
the music is set about 6 dB under the placeholder narration when nothing is
speaking and about 15 dB under it while a line speaks (the output compressor
adds make-up gain, so these are measured after it, not guessed). Listen on a
real device and adjust `MUSIC_LEVEL` in `shared/music.js` if it needs
changing.

## Pictures (Yusuf)

The Yusuf game can show a full picture for every narrated step and a backdrop
for every activity. `games/yusuf/art.js` lists the pictures that exist; the
files are `games/yusuf/assets/img/<key>.webp`, where the key is the step's
line id (`c1-a`), `bg-<name>` for a backdrop, or `p-<name>` for a round
portrait of a person. A step with no picture falls back to its drawn sprites,
and so does a picture that fails to load, so the set can grow a few at a time.

The shot list (one description per picture, people described by clothes and
age, never by name) is `scripts/yusuf-art/shots.py`. To add pictures:

```
python3 scripts/yusuf-art/build.py prompts            # the prompt for every picture
python3 scripts/yusuf-art/build.py import <folder>    # <folder>/<key>.png -> assets/img + art.js
```

The 65 pictures in the game were generated on 2026-11-12 with Google's Gemini
image model ("Nano Banana 2 Lite", through the Composio connector), from the
prompts that `build.py prompts` prints; a few were redone after review, and
`shots.py` holds the final wording. No reference images were supplied and
nothing was copied from another artist, game or museum. Google's Gemini API
terms (read 2026-11-12 at ai.google.dev/gemini-api/terms) say Google does not
claim ownership of generated content and may generate similar content for
others. Composio's own terms were not checked, and whether AI-generated
pictures can be copyrighted at all differs by country, so treat the pictures
as usable but not exclusively ours.

Pictures are AI-generated: say so wherever they are credited. The clothes and
buildings are an artistic interpretation in a West African style, not a
reconstruction of ancient Egypt, and the game's note for parents says so.

## Offline and updates

After the first visit the whole site works with no connection, which matters
on a tablet. `sw.js` keeps two kinds of saved files apart:

- **Pages, scripts, styles and data** are fetched from the network first and
  only fall back to the saved copy offline (or after 4 seconds), so a new
  release shows up on the next visit and nobody is stuck on an old copy.
- **Pictures, sounds and fonts** live in one long-lived cache with a
  fingerprint for each file. A release downloads only the files whose
  fingerprint is new or changed (a release that touches one picture downloads
  one picture) and drops the ones that were removed. They are served from the
  saved copy first, so they appear instantly.

Pictures and sounds (`.webp`, `.mp3`, `.webm`, `.ogg`, `.m4a`) are also kept on
Cloudflare R2, and the service worker downloads them from there first (fast,
cached at the edge for a year, addressed by a fingerprint so a changed file gets
a new address). If R2 cannot be reached it falls back to the copy in this
repository, so nothing breaks. After adding or changing pictures or sounds,
before pushing:

```
ADMIN_TOKEN=... node scripts/publish-media.js
```

(Files already on R2 are skipped. The music and sound effects in the games are
made by the browser as you play and are not files.)

**Nothing published is ever deleted.** Every version of every picture and sound
stays in the bucket at `media/<first 10 hex of its SHA-1>/<path>`, and each run
logs it in `history/index.json` in the bucket (`{ "<path>": [{ hash, from, release }] }`,
oldest first; every rewrite of the log keeps the previous log beside it). To get an
old picture back, read the log (owner only:
`curl -H "authorization: Bearer $ADMIN_TOKEN" <server>/admin/history`) and download
`<server>/media/<hash>/<path>`. `--backfill` also publishes and logs every older
version still in git history. The yearly clean-up only touches family recordings.

If a device ever looks old, `reset.html` clears its saved copy and loads the
newest one (recordings and progress are not touched). The landing page footer
has a "Refresh" link to it.

`sw.js` contains a generated block: `node scripts/build-offline.js` rewrites it.

## Versions

Releases are numbered `YEAR.MONTH.NUMBER`, like `2026.11.1`: the first release
of a month is `.1`, the next `.2`, and a new month starts again at `.1`. The
number, the date and plain-words notes for parents live in `version.json`, and
show on the landing page, in the Yusuf title screen and in the "What's new"
list in the parents panel.

After a batch of changes, cut a release before committing:

```
node scripts/release.js "Yusuf: a new activity in chapter 5" "Fixed a stuck picture"
```

That bumps the number, records the notes and refreshes `sw.js`. `validate.js`
warns when the site has changed since the last release.

## Story games

A story game (like Yusuf) is a folder of data plus the shared player in
`shared/story-engine.js`. Its page loads, in this order: `game.js` (name, hero,
groups), `art.js` (which pictures exist), `shared/people.js` then `people.js`
(the cast), `story.js` (chapters and steps), then the engine. A second story
game is a new folder with its own `game.js`, `art.js`, `people.js`, `story.js`
and `narration.json`; the engine, its styles and the checks are shared. Progress
is saved by a chapter's id and a step's line (not by position), so adding or
moving steps later never sends a child to the wrong place.

**The Musa game** (25 chapters, about a hundred activities) is the second story game
and is written a little differently, because it is long: its words, activities and
picture descriptions are kept side by side in `scripts/musa/author/` (one file per
group of chapters), and `node scripts/musa/author/build.js` writes `games/musa/story.js`,
`games/musa/narration.json` and the picture list from them. Change the chapter files,
not the generated ones. `scripts/musa/RESEARCH.md` holds the notes from the translation
and the commentary that every line was checked against.

What a story game can use from the player:

- **Activities**: `choice`, `order`, `match`, `sort`, `memory`, `pick`, `count`, `puzzle`,
  `journey`, `hold`, `pull`, `catch`, `fill`, `gates`, `search`, `sky`, and (first written
  for Musa) `change` (tap a thing and it becomes another), `part` (hold, and the sea
  opens), `trail` (tap the glowing spot to walk a path), `seek` (a finger of light in the
  dark), `wipe` (rub the scene clear) and `build` (lay it brick by brick).
- **Icons** can be an emoji or the name of a drawn piece (`STAFF`, `ROCK`, `ROPE`,
  `CHEST`, `PLANK` ...), because older tablets lack the newer emoji.
- **A scene's own life**: every scene has a default background sound (`amb`), a moving
  overlay (`fx`: water, dust, embers, stars, rain, mist, rays) and music, set per scene and
  overridable per step or, for a whole game, in its `game.js` (`sceneMood`, `sceneAmb`,
  `sceneFx`). A step can also fire one effect as it opens (`cue`).
- **A narrated step with no picture** is drawn from the scene's own decor plus two or
  three icons (`e`), so a game is playable before its pictures exist. A step can borrow
  another line's picture with `pic`.

The stand-in English voice for Yusuf, Musa and Count with Me is made with the open-source
Piper engine and a public-domain voice (`python3 scripts/generate-voice.py games/<slug>
<voice.onnx>`); it only re-makes lines whose words changed, and never touches Arabic.
(`scripts/generate-placeholder-audio.sh` is the older flite voice, kept for a machine
that cannot run Piper.)

Every answer in a choice or sorting activity has its own spoken line
(`<line>-opt1`, `-bin1`, `-it1`, in `narration.json`), so a child who cannot
read hears each one; the checker requires them.

## Tests

`tests/` plays the game and exercises the offline copy, narration, sync (against
a fake of the Worker), updates and the Worker's clean-up in a real browser:

```
cd tests && npm install && npx playwright install chromium && npm test
```

GitHub runs them on every push (`.github/workflows/validate.yml`). `node tests/run.js sync`
runs just one group (`landing`, `narration`, `offline`, `sync`, `update`, `playthrough`, `worker`).
Add `?skipms=300` to a game's address to make the "Skip" button appear after 0.3 s instead of 22 s.

## Checking your work

```
node scripts/release.js "notes"      # number the release and refresh sw.js
node scripts/validate.js        # check everything
```

`validate.js` (also run by GitHub Actions on every push) checks that every
game in `manifest.json` exists and has a valid `game.json` with an age range;
that narration ids are unique, every English line has audio and no audio is
orphaned; that every line, person, activity and music mood a story names
exists and every narration line is used; that Qur'an references are
well-formed; that pages only load local files that exist and nothing from
Google; that this README only names files that exist; and that `sw.js` is up
to date.

## Content conventions

- **Age rating is mandatory.** `ageNote` in `game.json` adds a short honest caveat next to the
  badge (Yusuf: "Under 5: with a grown-up"). Every game states a `minAge`/`maxAge` so a
  parent can tell at a glance who it's for.
- **Quran- and Hadith-based content must be grounded, not recalled from
  memory.** Verify the text against a canonical source (quran.com
  references, or a cited tafsir) rather than paraphrasing from general
  knowledge. Cite the verse range in `basedOn` and link it from the game.
- **Where scholars differ, say so.** Don't narrate one reading as fact. The
  Yusuf game leaves out 12:52–53 entirely because commentators differ on who
  is speaking; its note for parents says so and names who holds which view.
- **Notes for parents are paraphrase plus a link, not a reproduced
  translation.** A published translation is someone's copyright; quran.com
  already has the licensed text. Attribute any explanation to the
  commentary it came from.
- **Depiction of prophets is decided per game, not by a blanket rule** — this
  is a real point of disagreement across Muslim practice and isn't ours to
  flatten into one policy. What each game actually does must be stated in
  its `depictionNotes`, not left implicit, and in the game's own parents'
  note. As a starting default: Prophet Muhammad ﷺ is never drawn as a figure
  (silhouette/glow/implied only); other prophets are decided case by case.
  The Yusuf game shows people, all with dark skin, including Prophet Yusuf
  and Prophet Yaqub, by the owner's decision for that game.
- **A detail from a commentary is labelled as one.** The Yusuf game takes a
  few details from Ibn Kathir's tafsir (abridged English, fetched from
  quran.com, not recalled): the stone Yusuf stood on in the well, the shirt
  the brothers forgot to tear, the twenty coins, the wind that carried the
  scent. Each such step carries a small label on the scene (`src` in
  `story.js`), and the chapter's note for parents names the tafsir, who the
  report is attributed to, and says plainly that it is not from the verse.
- **Don't extend a scripture-based story past what's been grounded.** It's
  fine to ship "Part 1" of a story and add later chapters once those verses
  have actually been checked, rather than inventing the next scene to
  finish a game in one sitting.
- **Several things to do per chapter.** The Yusuf game has 44 activities
  across its 13 chapters (three or four each): questions, putting events in
  order, picture puzzles, finding pairs, counting, sorting and more. Every
  one is tied to something in that chapter, and every one can be skipped.
- **Nothing should depend on being fast.** No activity fails a child for being
  slow; anything timed has an untimed way through.

## Current games

| Game | Ages | Based on |
|---|---|---|
| Tap & Say | 1.5–4 | — |
| Count with Me (folder `count-the-crescents`) | 1½–5 | — (four levels: count to 5, 10, 15 or 20) |
| Yusuf | 3–9 (under 5 with a grown-up) | Surah Yusuf, 12:4–101 — the whole story in 13 chapters |
| Musa | 3–10 (under 5 with a grown-up) | Surah Al-Qasas 28:3–43 and Ta-Ha 20:9–98, with passages from surahs 2, 5, 7, 10, 18, 26, 40 and 66 — 25 chapters |
