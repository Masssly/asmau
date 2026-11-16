# Asmau at 100 games: how the site is built to scale

Decided with the owner on 16 November 2026. At 10 games the site was 128 MB of pictures and sounds in git, a 232 KB
file list inside sw.js (3,622 entries) and 277 pages saved at first visit. At 100 games that becomes about 1.3 GB
(over GitHub Pages' 1 GB limit), a 2.3 MB sw.js downloaded by every device at every release, and thousands of files at
first visit. This is the design that keeps every one of those small, whatever the number of games.

## 1. Packs: what a device downloads, and when

Everything the site serves belongs to one pack:

| pack            | what                                                                 | saved when                  |
|-----------------|----------------------------------------------------------------------|-----------------------------|
| `core`          | home page, shared scripts and styles, fonts, icons, game covers      | the first visit             |
| `<slug>`        | a game's pages, scripts, data, notes for parents, and its pictures   | the game is first opened    |
| `<slug>@w`      | the game's narration in the woman's voice (`assets/audio/`)          | opened, if that voice chosen |
| `<slug>@m`      | the game's narration in the man's voice (`assets/audio-m/`)          | opened, if that voice chosen |
| `<slug>@id-w`, `<slug>@id-m` | its narration in another language (`assets/audio-id/`, `audio-id-m/`) | opened, in that language and voice |

`scripts/build-offline.js` writes one small list per pack, `packs/<pack>.json` (`{ "files": { path: fingerprint },
"bytes": n }`), and puts only the index of packs (name, fingerprint of its list, size) inside sw.js. That index grows by
three short lines per game. A release changes only the lists of packs that changed; a device fetches a pack's list
only when it has that pack.

## 2. Pictures and sounds live on R2 only

A game's pictures and voices (`games/<slug>/assets/**`) are not in git. Their single home is the R2 bucket behind the
sync Worker, addressed by fingerprint: `<server>/media/<fingerprint>/<path>` (immutable, cached for a year). The pack
lists in `packs/` are committed and are the record of which version of each file the site uses.

- Pages ask for media through `shared/media.js` (`AsmauMedia.url(path)`), which turns a game's relative path into
  its R2 address from the game's pack lists. Covers, icons and fonts stay in git (small, and link previews need them).
- `node scripts/fetch-media.js` downloads every file in `packs/` that is missing or different on this computer (needed
  before working on pictures or voices, or running the tests). `scripts/publish-media.js` uploads new versions.
- `build-offline.js` takes each media file's fingerprint from the file on disk when it is there, and otherwise from
  the committed list; a media file no game refers to any more is dropped.

## 3. The service worker

- Install: save the `core` pack. Opening a game saves `<slug>` and the chosen voice's pack.
- Update: for every pack on the device whose list changed, fetch the new list and only the changed files.
- Serving: media by its R2 address, cache first (addresses never change meaning); pages and scripts network first,
  falling back to the saved copy.
- Old devices: media saved by earlier releases under the old addresses is moved to the new ones on update, without
  downloading anything again.

## 4. The home page and "Without internet"

Covers load as they scroll into view; sections fold; a search box filters games by name. "Without internet" lists the
games, which are saved on this device and how big each is, with save and remove per game and an honest total for all.

## 5. Making a game

One shared story kit (`scripts/story-kit/`) with a small config per game (people, places, picture look, references);
one command each for references, scenes, voices (both) and checks, for any game.

## 6. Tests

Behaviour is tested on a small fixed set of games (Yusuf, a little ones' game, and the newest story game), not on all
of them, so the run time does not grow with the catalogue; fast static checks run on every game.
