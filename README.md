# Asmau

Islamic games for curious kids — a growing collection of small, self-contained
browser games. Named after Nana Asma'u bint Usman dan Fodio, a scholar, poet
and educator in the Sokoto Caliphate (present-day northern Nigeria) known for
building a network of women teachers.

No build step, no framework, no backend. It's plain HTML/CSS/JS served
directly by GitHub Pages — open any file and you're looking at exactly what
ships.

## Structure

```
asmau/
├── index.html              landing page — lists every game, reads its age badge
├── manifest.json           the list of game folder slugs, in display order
├── shared/
│   ├── style.css           tokens + components (buttons, cards, age badge)
│   ├── narration.js        narration lookup — see "Narration" below
│   └── music.js            background music and sound effects — see "Music and sound effects"
├── scripts/
│   └── generate-placeholder-audio.sh   regenerates the flite placeholder clips
├── tools/
│   └── record-voice/       lets a parent record real narration, in the browser
└── games/
    └── <slug>/
        ├── index.html      the game itself — fully self-contained
        ├── game.json        title, icon, age range, tagline, source, depiction notes
        ├── narration.json   every spoken line in the game: {id, text, lang}
        └── assets/
            └── audio/       <id>.mp3 (flite placeholder) and/or <id>.webm (real voice)
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
     "basedOn": "Surah X, verses Y-Z, or null if not scripture-based",
     "depictionNotes": "State plainly what is and isn't drawn, and why."
   }
   ```
3. Build `index.html` for the game. Link `../../shared/style.css` and
   `../../shared/speech.js` if useful — not required.
4. Add the slug to `manifest.json`.

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
   these after editing a game's `narration.json`. **English only** —
   `flite` and `espeak-ng` can technically attempt Arabic, but the output
   isn't something a child should learn pronunciation from, so the script
   skips every `lang: "ar"` entry on purpose.
4. The device's own `speechSynthesis` voice, same placeholder caveat as
   always, for whichever entries have no committed or recorded clip.

**Recording real narration**: open `tools/record-voice/index.html`, pick a
game, and record each line from the microphone. Recordings save straight to
that browser's IndexedDB and are immediately preferred over the placeholder
— nothing to commit for personal use on your own devices. To make a
recording the default for *everyone* who opens the game, download the clip
and commit it to `games/<slug>/assets/audio/<id>.webm`. Recording real
Arabic pronunciation this way is the main reason this tool exists — it's
exactly the gap a synthesized voice can't responsibly fill.

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
speaking and about 15 dB under it while a line speaks (the output
compressor adds make-up gain, so these are measured after it, not guessed). Listen on a real device and adjust
`MUSIC_LEVEL` in `shared/music.js` if it needs changing.

## Content conventions

- **Age rating is mandatory.** Every game states a `minAge`/`maxAge` so a
  parent can tell at a glance who it's for.
- **Quran- and Hadith-based content must be grounded, not recalled from
  memory.** When writing a game's story content, verify the text against a
  canonical source (quran.com references, or a cited tafsir) rather than
  paraphrasing from general knowledge. Cite the verse range in `basedOn` and
  link it from the game itself.
- **Depiction of prophets is decided per game, not by a blanket rule** — this
  is a real point of disagreement across Muslim practice and isn't ours to
  flatten into one policy. What each game actually does must be stated in
  its `depictionNotes`, not left implicit, and in the game's own parents'
  note. As a starting default: Prophet Muhammad ﷺ is never drawn as a figure
  (silhouette/glow/implied only); other prophets are decided case by case.
  The Yusuf game draws people, all with dark skin, including Prophet Yusuf
  and Prophet Yaqub, by the owner's decision for that game.
- **Don't extend a scripture-based story past what's been grounded.** It's
  fine to ship "Part 1" of a story and add later chapters once those verses
  have actually been checked, rather than inventing the next scene to
  finish a game in one sitting.

## Current games

| Game | Ages | Based on |
|---|---|---|
| Tap & Say | 1.5–4 | — |
| Count the Crescents | 2–5 | — |
| Yusuf | 5–9 | Surah Yusuf, 12:4–101 — the whole story in 13 chapters |
