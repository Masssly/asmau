#!/usr/bin/env node
/*
  Adds paragraphs to draft notes for parents (never to a note the owner has approved):
    node scripts/parent-seed-add.js additions.json
  additions.json: { "games/<slug>": { "1.2": "Paragraph to add." } }. A page that is not a draft is skipped and listed.
*/
"use strict";
const fs = require("fs"), path = require("path");
const PN = require("./parent-notes");
const add = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
for (const [dir, pages] of Object.entries(add)) {
  let done = 0; const skipped = [];
  for (const [key, txt] of Object.entries(pages)) {
    const f = path.join(__dirname, "..", dir, "parents", key.split(".")[0], key + ".md");
    const now = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
    if (!PN.isDraft(now)) { skipped.push(key); continue; }
    if (now.includes(txt.trim().slice(0, 60))) continue;          // already added
    fs.writeFileSync(f, now.trimEnd() + "\n\n" + txt.trim() + "\n");
    done++;
  }
  console.log(dir + ": " + done + " paragraphs added" + (skipped.length ? "; not drafts, left alone: " + skipped.join(" ") : ""));
}
