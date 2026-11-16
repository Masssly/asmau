# For parents: the notes in Nuh

Every page of the game has its own note, in its own file. The game shows the page's number on the
folded line under the story: **"For parents · page 1.5"** is chapter 1, page 5.

That page's note is the file **`1/1.5.md`**: open the folder `1`, then the file `1.5.md`.
(Chapter 2's pages are in folder `2`, and so on, up to chapter 11.)

## To add or change a note

1. Open the chapter's folder, then the page's file (for example `1` → `1.5.md`).
2. Click the pencil (✏️ "Edit this file") at the top right.
3. Type. To start a new paragraph, leave one empty line between them. Plain text only.
4. Click **Commit changes…**, then **Commit changes** again.

The change appears in the game with the next release (tell Claude, or wait for the next one).

- **Drafts:** a file whose first line is `# draft …` is a suggestion from Claude, not shown in the game. Read it,
  change or delete what you don't like, then delete that first line to put it in the game.
- An empty file means that page has no note. Most pages start empty; each chapter's notes from before are on
  its first page (`1.1.md`, `2.1.md`, …), ready to be moved to the pages they belong to.
- A note stays with its page: if pages are added or removed later, the files are renamed to match.
- Do not edit `pages.json`; it is written automatically.
