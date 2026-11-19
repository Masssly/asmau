# The Asmau soundtrack

The music of the games as tracks of their own, for publicity (owner's idea, 17 November 2026). The games compose their
music live in the browser (`shared/music.js`); these tracks are that same music, recorded by the same engine, so they
sound exactly as in the games.

Two kinds of album:

- **Music from the Games** (`plan.json` → `tracks.json`): one track per mood (14), and The Asmau Suite through all of them.
- **One album per game** (`games/<slug>.json` → `games/<slug>.tracks.json`, written by `games.js`): the game's music in
  the order the game plays it: its title music, one track per chapter (the moods of its pages, one after another), and
  its end music. Tap & Say has no music, so no album.

| File | What it is |
|---|---|
| `plan.json`, `games/<slug>.json` | the tracks: moods, title, length, the games each is heard in |
| `games.js` | writes the per-game plans from each game's story (`node scripts/soundtrack/games.js`) |
| `record.js` | records each track of a plan with the music engine in an offline audio context (`node scripts/soundtrack/record.js <plan> <folder>`) |
| `finish.py` | fades, levels to −16 LUFS, encodes MP3 and lossless FLAC (in .ogg), puts them on R2 (`ADMIN_TOKEN=... python3 scripts/soundtrack/finish.py <plan> <folder>`) |
| `tracks.json`, `games/<slug>.tracks.json` | where each finished track is on R2 (written by finish.py) |

On R2: `soundtrack/<nn>-<name>.mp3` (320 kbit/s) and `soundtrack/lossless/<nn>-<name>.ogg` for the main album, and
`soundtrack/games/<slug>/...` the same way for each game, at `<server>/media/<hash>/<path>`; the addresses are in the
`.tracks.json` files. Nothing there is ever deleted.

The owner's uploads may be up to 50 MiB (`MEDIA_MAX` in sync/worker.js, deployed 19 November 2026), so every track,
the 6-minute suite included, is at 320 kbit/s with its lossless copy. To redo one track: `ONLY=<file>` before record.js
and finish.py. As YouTube videos: scripts/video/music.js and scripts/video/youtube-music.md.

If the music changes, record and finish again: changed tracks get new addresses, the old ones stay.
