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
│   └── speech.js           tiny speech-synthesis helper, used as a narration placeholder
└── games/
    └── <slug>/
        ├── index.html      the game itself — fully self-contained
        ├── game.json        title, icon, age range, tagline, source, depiction notes
        └── assets/          anything the game needs that isn't inline
```

**The rule that matters**: a game only touches its own folder. Editing
`games/yusuf-and-the-well/` never risks breaking `games/tap-and-say/`, and
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
  its `depictionNotes`, not left implicit. As a starting default: Prophet
  Muhammad ﷺ is never drawn as a figure (silhouette/glow/implied only); other
  prophets are decided case by case.
- **Don't extend a scripture-based story past what's been grounded.** It's
  fine to ship "Part 1" of a story and add later chapters once those verses
  have actually been checked, rather than inventing the next scene to
  finish a game in one sitting.

## Current games

| Game | Ages | Based on |
|---|---|---|
| Tap & Say | 1.5–4 | — |
| Count the Crescents | 2–5 | — |
| Yusuf and the Well | 4–8 | Surah Yusuf, 12:8–20 |
