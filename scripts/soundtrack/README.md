# The Asmau soundtrack

The music of the games as tracks of their own, for publicity (owner's idea, 17 November 2026). The games compose their
music live in the browser (`shared/music.js`); these tracks are that same music, recorded by the same engine, so they
sound exactly as in the games.

| File | What it is |
|---|---|
| `plan.json` | the tracks: mood, title, length, the games each is heard in; the suite moves through every mood |
| `record.js` | records each track with the music engine in an offline audio context (`node scripts/soundtrack/record.js <folder>`) |
| `finish.py` | fades, levels to −16 LUFS, encodes MP3 and lossless FLAC (in .ogg), puts them on R2 (`ADMIN_TOKEN=... python3 scripts/soundtrack/finish.py <folder>`) |
| `tracks.json` | where each finished track is on R2 (written by finish.py) |

On R2: `soundtrack/<nn>-<name>.mp3` (320 kbit/s) and `soundtrack/lossless/<nn>-<name>.ogg`, at
`<server>/media/<hash>/<path>`; the addresses are in `tracks.json`. Nothing there is ever deleted.

The 6-minute suite is over the server's 5 MiB limit at full quality, so it is on R2 at 112 kbit/s and without its
lossless copy. `sync/worker.js` allows the owner's own uploads up to 50 MiB (`MEDIA_MAX`); once that is deployed
(`cd sync && npx wrangler deploy`), raise `MAX` in finish.py and run it again.

If the music changes, record and finish again: changed tracks get new addresses, the old ones stay.
