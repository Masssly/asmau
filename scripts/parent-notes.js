#!/usr/bin/env node
/*
  The "For parents" notes of each story game are plain text files, one per page, so they can be edited
  straight on GitHub:

    games/<slug>/parents/<chapter>/<chapter>.<page>.md     e.g. parents/1/1.5.md is page 1.5

  The number is the one the game shows on the folded line ("For parents · page 1.5"). Each paragraph
  (separated by an empty line) is shown as one paragraph; plain text, no formatting. An empty file means no
  note on that page; a file whose first line is "# draft" is a suggestion the game does not show until that
  line is deleted. games/<slug>/parents/README.md explains this for whoever edits them.

  parents/pages.json is written by this script (never by hand): which step each page number is, and which
  pages have text. When pages are added, removed or moved in a story, sync() renames the note files so each
  note stays with its page (a note whose page was removed is kept as removed-<step>.md and the checker says so).
  scripts/build-offline.js runs sync() on every release; scripts/validate.js fails if it is out of date.

    node scripts/parent-notes.js sync games/<slug>      (make the files and pages.json match the story)
    node scripts/parent-notes.js migrate games/<slug>   (once: from the old one-file-per-chapter layout)
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
// A file whose first line is "# draft" is a suggestion waiting for the owner: the game does not show it until
// that line is deleted.
const isDraft = (text) => /^\s*#\s*draft\b/i.test(text);
// every page of the story: its number ("1.5") and a name that stays the same when pages move (its line, and
// which time that line comes up in the chapter)
function pages(dir) {
  const out = {};
  story(dir).forEach((ch, ci) => {
    const seen = {};
    ch.steps.forEach((st, si) => {
      const line = st.say || st.line, nth = (seen[line] = (seen[line] || 0) + 1);
      out[(ci + 1) + "." + (si + 1)] = ch.id + ":" + line + (nth > 1 ? "#" + nth : "");
    });
  });
  return out;
}
const base = (dir) => path.join(ROOT, dir, "parents");
const fileOf = (dir, key) => path.join(base(dir), key.split(".")[0], key + ".md");
function text(f) { return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : ""; }
function readPage(dir, key) { return parse(text(fileOf(dir, key))); }
// all the notes of chapter n, page after page (for the checker and scripts/parent-repeats.js)
function read(dir, n) {
  const keys = Object.keys(pages(dir)).filter((k) => k.split(".")[0] === String(n) && !isDraft(text(fileOf(dir, k))));
  return [].concat(...keys.map((k) => readPage(dir, k)));
}
function drafts(dir) { return Object.keys(pages(dir)).filter((k) => isDraft(text(fileOf(dir, k)))); }
function index(dir) {
  try { return JSON.parse(fs.readFileSync(path.join(base(dir), "pages.json"), "utf8")); } catch (e) { return null; }
}

// Bring the files and pages.json in line with the story. With write=false only reports what it would change.
function sync(dir, write) {
  const cur = pages(dir), old = (index(dir) || {}).pages || cur, changes = [];
  const where = {}; Object.keys(cur).forEach((k) => { where[cur[k]] = k; });
  // notes whose page has moved or gone
  const moves = [];
  Object.keys(old).forEach((k) => {
    const f = fileOf(dir, k), t = text(f);
    if (!parse(t).length) return;
    const to = where[old[k]];
    if (to === k) return;
    if (to) moves.push([k, to, t]);
    else moves.push([k, null, t]);
  });
  moves.forEach(([k, to]) => changes.push(to ? "page " + k + " is now " + to + ": its note moves with it" : "page " + k + " (" + old[k] + ") is gone: its note is kept as removed-" + old[k].replace(/[^\w-]+/g, "_") + ".md"));
  if (write) {
    moves.forEach(([k]) => fs.writeFileSync(fileOf(dir, k), ""));
    moves.forEach(([k, to, t]) => {
      const f = to ? fileOf(dir, to) : path.join(base(dir), k.split(".")[0], "removed-" + old[k].replace(/[^\w-]+/g, "_") + ".md");
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, t);
    });
  }
  // an empty file for every page (so there is a place to write), none for pages that do not exist
  Object.keys(cur).forEach((k) => {
    if (!fs.existsSync(fileOf(dir, k))) { changes.push("new empty file " + k + ".md"); if (write) { fs.mkdirSync(path.dirname(fileOf(dir, k)), { recursive: true }); fs.writeFileSync(fileOf(dir, k), ""); } }
  });
  if (fs.existsSync(base(dir))) fs.readdirSync(base(dir), { withFileTypes: true }).filter((d) => d.isDirectory()).forEach((d) => {
    fs.readdirSync(path.join(base(dir), d.name)).forEach((f) => {
      const m = /^(\d+\.\d+)\.md$/.exec(f);
      if (m && !cur[m[1]] && !parse(text(path.join(base(dir), d.name, f))).length) { changes.push("remove empty " + f); if (write) fs.unlinkSync(path.join(base(dir), d.name, f)); }
    });
  });
  const want = { pages: cur, notes: Object.keys(cur).filter((k) => { const t = text(fileOf(dir, k)); return !isDraft(t) && parse(t).length; }) };
  const now = index(dir);
  if (JSON.stringify(now) !== JSON.stringify(want)) {
    if (!changes.length) changes.push("pages.json is out of date (a note was added or emptied)");
    if (write) fs.writeFileSync(path.join(base(dir), "pages.json"), JSON.stringify(want, null, 1) + "\n");
  }
  return changes;
}
// the story games with notes for parents
function games() {
  return fs.readdirSync(path.join(ROOT, "games")).filter((g) => fs.existsSync(path.join(ROOT, "games", g, "story.js")) && fs.existsSync(path.join(ROOT, "games", g, "parents"))).map((g) => "games/" + g);
}
function removed(dir) {
  const out = [];
  if (fs.existsSync(base(dir))) fs.readdirSync(base(dir), { withFileTypes: true }).filter((d) => d.isDirectory()).forEach((d) =>
    fs.readdirSync(path.join(base(dir), d.name)).filter((f) => /^removed-/.test(f)).forEach((f) => out.push(d.name + "/" + f)));
  return out;
}
module.exports = { story, parse, pages, read, readPage, sync, games, removed, drafts, isDraft };

if (require.main === module) {
  const [cmd, dir] = process.argv.slice(2);
  if (cmd === "sync") { const c = sync(dir, true); console.log(dir + ": " + (c.length ? c.join("; ") : "up to date")); }
  else if (cmd === "migrate") {
    // parents/<n>.md (one file per chapter, first line naming it) -> parents/<n>/<n>.1.md, the chapter's first page
    const keys = Object.keys(pages(dir));
    story(dir).forEach((ch, i) => {
      const n = i + 1, old = path.join(base(dir), n + ".md");
      if (!fs.existsSync(old)) return;
      const paras = parse(fs.readFileSync(old, "utf8"));
      fs.mkdirSync(path.join(base(dir), String(n)), { recursive: true });
      fs.writeFileSync(fileOf(dir, n + ".1"), paras.join("\n\n") + "\n");
      fs.unlinkSync(old);
    });
    fs.writeFileSync(path.join(base(dir), "pages.json"), JSON.stringify({ pages: pages(dir), notes: [] }) + "\n");
    console.log(dir + ": migrated; " + sync(dir, true).length + " files made");
    void keys;
  } else console.log("usage: node scripts/parent-notes.js sync|migrate games/<slug>");
}
