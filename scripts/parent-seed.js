#!/usr/bin/env node
/*
  Seeds the empty "For parents" pages of a game with draft notes, for the owner to read, edit or delete:
    node scripts/parent-seed.js games/<slug> notes.json
  notes.json maps a page number to its text ({"1.2": "First paragraph.\n\nSecond paragraph."}).
  Only empty files are written, never a page that already has text. Each gets "# draft" as its first line:
  the game does not show it until that line is deleted (see scripts/parent-notes.js).
*/
"use strict";
const fs = require("fs"), path = require("path");
const PN = require("./parent-notes");
const [dir, file] = process.argv.slice(2);
const notes = JSON.parse(fs.readFileSync(file, "utf8")), pages = PN.pages(dir);
let wrote = 0, kept = 0;
for (const [key, txt] of Object.entries(notes)) {
  if (!pages[key]) { console.log("no page " + key + " in " + dir); continue; }
  const f = path.join(__dirname, "..", dir, "parents", key.split(".")[0], key + ".md");
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8").trim()) { kept++; continue; }
  fs.writeFileSync(f, "# draft (delete this line to show the note in the game)\n\n" + txt.trim() + "\n");
  wrote++;
}
const empty = Object.keys(pages).filter((k) => { const f = path.join(__dirname, "..", dir, "parents", k.split(".")[0], k + ".md"); return !fs.existsSync(f) || !fs.readFileSync(f, "utf8").trim(); });
console.log(dir + ": " + wrote + " drafts written, " + kept + " pages already had text; still empty: " + (empty.join(" ") || "none"));
