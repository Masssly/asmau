#!/usr/bin/env node
/*
  The "For parents" notes of each story game live in plain text files, one per chapter, so they can be
  edited straight on GitHub:

    games/<slug>/parents/<chapter number>.md

  The first line ("# 2. The Jealous Brothers ...") only says which chapter it is; the game skips it. After
  that, each paragraph (separated by an empty line) is shown as one paragraph. Plain text: no formatting.

  This module reads them (for the checker and scripts/parent-repeats.js). Run it as a script to (re)write
  the files from the notes still inside a story.js (used once, when the notes moved out):
    node scripts/parent-notes.js export games/<slug>
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");

function story(dir) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, dir, "story.js"), "utf8"), ctx);
  return ctx.window.STORY || [];
}
function parse(text) {
  return text.split(/\r?\n\s*\r?\n/).map((p) => p.split(/\r?\n/).filter((l) => !/^#/.test(l.trim())).join(" ").trim()).filter(Boolean);
}
function read(dir, n) {
  const f = path.join(ROOT, dir, "parents", n + ".md");
  return fs.existsSync(f) ? parse(fs.readFileSync(f, "utf8")) : null;
}
function header(n, ch) {
  return "# " + n + ". " + ch.title + " (" + (ch.source ? "Qur'an " + ch.source : "Source: " + ch.cite) + ")";
}
module.exports = { story, parse, read, header };

if (require.main === module && process.argv[2] === "export") {
  const dir = process.argv[3];
  fs.mkdirSync(path.join(ROOT, dir, "parents"), { recursive: true });
  story(dir).forEach((ch, i) => {
    const n = i + 1;
    fs.writeFileSync(path.join(ROOT, dir, "parents", n + ".md"), header(n, ch) + "\n\n" + (ch.parent || []).join("\n\n") + "\n");
  });
  console.log(dir + ": wrote " + story(dir).length + " files");
}
