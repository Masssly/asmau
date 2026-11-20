# The weekly social posts

Every Friday evening a scheduled Claude task makes the next week's three posts from the games and puts them in the
**Asmau social queue** (https://claude.ai/artifact/AXbK2FN6eWeqBtxUN84ddu). The owner approves them on his phone and puts
Approve, and the page has Metricool (free plan) schedule it for TikTok and YouTube. LinkedIn (not on Metricool's free
plan) the owner posts by hand with the page's copy button. Claude schedules only what the owner approved, and never a
draft. Decided by the owner on 20 November 2026.

Metricool's free plan publishes 20 posts a month, and a post sent to two networks counts twice. So: the Short goes to
TikTok and YouTube (2), the picture and the note to TikTok only (1 each): 4 a week, about 17 a month. Never more.

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
4. Upload each file twice:
   - to the queue, for the owner to see: the Artifact tool (`url` of the queue, `asset: true`, `file_paths`); keep the
     `/_blob/...` url it returns;
   - to a public address, for Metricool: `curl -sS -X PUT --data-binary @<file> https://asmau-sync.mohammed-sadat-abdulai.workers.dev/social/<file name>`
     (the environment adds the X-Social-Token header; names are lower-case letters, digits and hyphens, `.mp4` or
     `.jpg`). It answers `{"url": ...}`. A 403 means the key is missing from the environment: stop and say so.
5. Write each post with ArtifactData into the collection `posts`, doc id `<date>-<slug>-<topic>`:

   | Field | |
   |---|---|
   | `n` | a number that sorts newest first: `YYYYMMDD` and the post's place in the week, e.g. `2026113001` |
   | `week` | "30 November 2026" (the Sunday the week starts) |
   | `kind`, `game`, `title` | `short` / `picture` / `note`; the game's title; a short title for the owner |
   | `pages` | the game's page numbers used, e.g. `["6.2","6.3"]` |
   | `clip`, `image` | the `/_blob/` urls (`""` when none) |
   | `publicClip`, `publicImage` | the public urls from the upload |
   | `metricool` | `{date, info}`: what the page sends to Metricool when the owner approves (below) |
   | `why` | the day to post it, which pages, anything the owner must set (YouTube: made for kids for a children's clip) |
   | `captions` | `tiktok`, `youtube` (Shorts only), `linkedin` |
   | `status` | `draft` |
   | `comment`, `at` | `""`; the time written |

## The `metricool` field

`date` is the post's time with its offset, 17:00 Europe/Berlin on its day (`2026-11-30T17:00:00+01:00`; +02:00 in summer
time). `info` is Metricool's createScheduledPost post object, exactly:

```json
{"autoPublish": true, "draft": false, "descendants": [], "firstCommentText": "", "hasNotReadNotes": false,
 "media": ["<public url>"], "mediaAltText": [], "providers": [{"network": "tiktok"}, {"network": "youtube"}],
 "publicationDate": {"dateTime": "2026-11-30T17:00:00", "timezone": "Europe/Berlin"}, "shortener": false,
 "smartLinkData": {"ids": []}, "text": "<the TikTok caption>",
 "tiktokData": {"disableComment": false, "disableDuet": false, "disableStitch": false, "privacyOption": "PUBLIC_TO_EVERYONE",
   "commercialContentThirdParty": false, "commercialContentOwnBrand": false, "title": "<the title>", "autoAddMusic": false,
   "photoCoverIndex": 0, "isAigc": true},
 "youtubeData": {"title": "<the YouTube title line>", "type": "short", "privacy": "public", "tags": ["<2 or 3>"],
   "category": "EDUCATION", "madeForKids": true, "isAiGeneratedContent": false}}
```

`providers` is TikTok and YouTube for a Short, TikTok alone for a picture or a note (then no `youtubeData`, and
`isAigc` false: TikTok ignores it on photos). `isAigc` true on every clip: the pictures and voices are made by AI.
`madeForKids` true: the clips are cartoon stories for children. The brand is 8248331 (the page knows it).

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
