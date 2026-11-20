# The weekly social posts

Every Friday evening a scheduled Claude task makes the next week's three posts from the games and puts them in the
**Asmau social queue** (https://claude.ai/artifact/AXbK2FN6eWeqBtxUN84ddu). The owner approves them on his phone and puts
the approved ones into Buffer, which publishes them to TikTok, YouTube Shorts and LinkedIn. Claude never posts anything
itself. Decided by the owner on 20 November 2026.

Read brand/SOCIAL.md (who we talk to, voice, British spelling) and CLAUDE.md (pictures, sources) first. They win over this file.

## The week

| Day | Kind | What |
|---|---|---|
| Sunday | `short` | A vertical clip, 35 to 58 seconds, of 4 to 6 pages that tell one moment of a story |
| Tuesday | `picture` | One picture from a game, with what happens in it |
| Thursday | `note` | One picture plus what its page's note for parents says: the verse, the commentary, where they differ |

Rotate the games: no game twice in one week, and every playable story game (not coming soon, not the little ones' games)
before any comes back. Read the queue's existing posts (`game`, `pages`) so a page is never used twice.

## Making a post

1. `node scripts/fetch-media.js <slug>` for the games you use.
2. **Short:** pick consecutive narrated pages that read as one moment (no activities). Check each line's picture with your
   own eyes first. Then
   `NODE_PATH=$(npm root -g) node scripts/video/make.js <slug> short --scenes <id>,<id>,... --name <slug>-<topic>-<date>`
   (out in scripts/video/out/, not in git). It must stay under 60 seconds: drop a page if it does not. Look at four
   frames of the result before uploading.
3. **Picture and note:** `ffmpeg -i games/<slug>/assets/img/<id>.webp -q:v 2 scripts/social/out/<slug>-<topic>-<date>.jpg`
   (not in git).
4. Upload the files with the Artifact tool (`url` of the queue, `asset: true`, `file_paths`), and use the `/_blob/...`
   urls it returns.
5. Write each post with ArtifactData into the collection `posts`, doc id `<date>-<slug>-<topic>`:

   | Field | |
   |---|---|
   | `n` | a number that sorts newest first: `YYYYMMDD` and the post's place in the week, e.g. `2026113001` |
   | `week` | "30 November 2026" (the Sunday the week starts) |
   | `kind`, `game`, `title` | `short` / `picture` / `note`; the game's title; a short title for the owner |
   | `pages` | the game's page numbers used, e.g. `["6.2","6.3"]` |
   | `clip`, `image` | the `/_blob/` urls (`""` when none) |
   | `why` | the day to post it, which pages, anything the owner must set (YouTube: made for kids for a children's clip) |
   | `captions` | `tiktok`, `youtube` (Shorts only), `linkedin` |
   | `status` | `draft` |
   | `comment`, `at` | `""`; the time written |

## The captions

- For grown-ups, not children (TikTok is 13+; YouTube clips made for children are marked made for kids).
- Facts only from the game's own lines, its chapter's verses and its notes for parents. Give the verse reference. Mark
  commentary as commentary ("It is told that…", "The commentary reports…"). Never add a fact from memory.
- TikTok: up to about 60 words, then `asmau.org`, then at most four hashtags. YouTube: a title line
  ("<moment> | Stories of the Prophets for children" or "| Great Muslims for children"), two or three sentences, the
  free line. LinkedIn: a short paragraph on the moment, one on Asmau, `asmau.org`; no hashtags.
- Always "free: no adverts, no account, nothing to buy" in some form. Never ask for money in a post (that is the
  Ramadan campaign's job).

## Never

- Anything that shows the Prophet Muhammad ﷺ, or a picture of a page where he is present (those pages show a breeze).
- Iblis, the snake or anything frightening in a clip a child might see.
- New pictures or voices made for social media: only what the games already show and say.
- A child's real photo, a person's name who is not in the games, or anything about a family who plays.

## Each run

1. Query `posts` where `status == "change"`: redo each as its `comment` asks (new files if needed), set `status: "draft"`,
   `comment: ""`, keeping its doc id. A change asked twice, or one you cannot do, gets a line in `why` saying so.
2. Make the three posts for the first week (starting on a Sunday, from the coming Sunday on) that has no posts in the
   queue yet. A week that already has its three posts is done: go on to the next one.
3. Reply with one short line: what was made, what was redone.
