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
├── manifest.json           the list of game folder slugs, in display order
├── app.webmanifest         lets the site be installed on a phone or tablet
├── sw.js                   service worker: the whole site works offline (generated list)
├── fonts/                  Baloo 2 and Mada, self-hosted (SIL OFL 1.1)
├── icons/                  app icons
├── shared/
│   ├── style.css           tokens + components (buttons, cards, age badge)
│   ├── narration.js        narration lookup — see "Narration" below
│   ├── music.js            background music and sound effects — see "Music and sound effects"
│   └── pwa.js              registers the service worker
├── scripts/
│   ├── generate-placeholder-audio.sh   regenerates the flite placeholder clips
│   ├── build-offline.js                regenerates sw.js's file list and version
│   └── validate.js                     checks the whole site; run by CI
├── tools/
│   └── record-voice/       lets a parent record real narration, in the browser
└── games/
    └── <slug>/
        ├── index.html      the game itself — fully self-contained
        ├── game.json       title, icon, age range, tagline, source, depiction notes
        ├── narration.json  every spoken line in the game: {id, text, lang}
        └── assets/
            └── audio/      <id>.mp3 (flite placeholder) and/or <id>.webm (real voice)
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
4. Add the slug to `manifest.json`.
5. Run the checks (below).

## Narration

Every spoken line in a game is listed in that game's `narration.json` as
`{ "id": "...", "text": "...", "lang": "en" | "ar" }`. Games never call
`speechSynthesis` directly — they call `AsmauNarration.say(gameSlug, id,
text, { lang })`, which tries, in order:

1. **A clip recorded on this device**, via `tools/record-voice`, stored in
   the browser's IndexedDB. Immediate, personal, no commit needed.
2. **`assets/audio/<id>.webm`** committed in the repo — a real recording a
   parent chose to share with everyone who opens the game.
3. **`assets/audio/<id>.mp3`** committed in the repo — a placeholder
   generated offline with [flite](http://www.festvox.org/flite/) (BSD
   licensed, CMU Festival-Lite). Run
   `scripts/generate-placeholder-audio.sh games/<slug>` to (re)generate
   these after editing a game's `narration.json`. English only.
4. The device's own `speechSynthesis` voice, **for English only**, same
   placeholder caveat as always.

**Arabic is never synthesized**, by flite or by the device. A guessed
pronunciation presented to a child as a lesson is worse than silence, so an
Arabic line plays only from a real human recording (tiers 1 or 2) and is
otherwise silent, while its text still shows on screen.

**Recording real narration**: open `tools/record-voice/index.html`, pick a
game, and record each line from the microphone. Recordings save straight to
that browser's IndexedDB and are immediately preferred over the placeholder
— nothing to commit for personal use on your own devices. The same page can
save every recording on a device to one file and load it on another (record
on a phone, play on a tablet). To make a recording the default for *everyone*
who opens the game, download the clip and commit it to
`games/<slug>/assets/audio/<id>.webm`. Recording real Arabic pronunciation
this way is the main reason this tool exists.

Before committing a recording, remember the repo (and the published site)
are public: it's your voice, or your child's, on a page anyone can open.

## Music and sound effects

`shared/music.js` makes music and effects on the spot with the Web Audio API,
so there are no audio files to license or download. A game opts in by
including it:

- `AsmauMusic.mood("wonder" | "desert" | "tense" | "sad" | "regal" | "joy")`
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

## Offline

After the first visit the whole site works with no connection, which matters
on a tablet. `sw.js` caches every file in the repo on install. Fonts are
self-hosted in `fonts/`, so there is no request to Google either.

`sw.js` contains a generated block: a version and the list of files. Any
change to any file changes the version, which makes browsers install the
worker again and replace the old cache. **After changing anything, run
`node scripts/build-offline.js`** before committing; the checks fail if you
forget.

## Checking your work

```
node scripts/build-offline.js   # refresh sw.js after any change
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

- **Age rating is mandatory.** Every game states a `minAge`/`maxAge` so a
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
- **Nothing should depend on being fast.** No activity fails a child for being
  slow; anything timed has an untimed way through.

## Current games

| Game | Ages | Based on |
|---|---|---|
| Tap & Say | 1.5–4 | — |
| Count the Crescents | 2–5 | — |
| Yusuf | 5–9 | Surah Yusuf, 12:4–101 — the whole story in 13 chapters |
