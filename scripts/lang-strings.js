#!/usr/bin/env node
/*
  The words a game shows or says, for translating it (shared/lang.js):
    node scripts/lang-strings.js <slug> <code>          what lang/<code>/<slug>.json still lacks (and lines whose English changed)
    node scripts/lang-strings.js <slug> <code> --write  add the missing ones to the file, English filled in, translation "" to fill
    node scripts/lang-strings.js <slug> <code> --check  exit 1 if anything is missing or empty (the checker uses it)
  Lines are listed by their id (narration.json); everything else by its English text: chapter titles, labels in the
  activities, the "From ..." source lines, and the words of the game's own page (title, buttons, The End).
  Parents' text stays in English: the For parents box on the title page and the notes.
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");

const L = require("./lang-files.js");

function storyOf(dir) {
  if (!fs.existsSync(path.join(dir, "story.js"))) return [];          // a game without a story: only its card and page
  const box = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(dir, "story.js"), "utf8"), box);
  return box.window.STORY || [];
}
// visible English on the game's page, outside the For parents box and scripts
function pageText(html) {
  html = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<details class="parents">[\s\S]*?<\/details>/g, "").replace(/<a class="voice-link"[\s\S]*?<\/a>/g, "")
    .replace(/<head>[\s\S]*?<\/head>/, "");
  const out = new Set();
  html.split(/<[^>]+>/).forEach((t) => { t = t.replace(/\s+/g, " ").trim(); if (/[A-Za-z]{2}/.test(t)) out.add(decode(t)); });
  (html.match(/aria-label="([^"]+)"/g) || []).forEach((a) => out.add(decode(a.slice(12, -1))));
  return [...out];
}
function decode(t) { return t.replace(/&amp;/g, "&").replace(/&rsquo;/g, "’").replace(/&nbsp;/g, " "); }

function needs(slug) {
  const dir = path.join(ROOT, "games", slug);
  const nf = path.join(dir, "narration.json");
  const lines = fs.existsSync(nf) && fs.existsSync(path.join(dir, "story.js")) ? JSON.parse(fs.readFileSync(nf, "utf8")).filter((l) => l.lang !== "ar") : [];
  const lineText = new Set(lines.map((l) => l.text.replace(/\s+/g, " ").trim()));
  const strings = new Set();
  const add = (s) => { if (typeof s === "string" && /[A-Za-z]{2}/.test(s) && !lineText.has(s.trim())) strings.add(s.trim()); };
  storyOf(dir).forEach((ch) => {
    add(ch.title); add(ch.cite);
    (ch.steps || []).forEach((st) => {
      add(st.src);
      const o = st.opts || {};
      ["hint", "done", "label", "title", "say"].forEach((k) => add(o[k]));
      (o.options || o.items || o.cards || []).forEach((x) => { if (x && typeof x === "object") { add(x.label); add(x.name); add(x.text); } else add(x); });
    });
  });
  if (fs.existsSync(path.join(dir, "story.js"))) pageText(fs.readFileSync(path.join(dir, "index.html"), "utf8")).forEach(add);
  // the game's card on the home page
  const g = JSON.parse(fs.readFileSync(path.join(dir, "game.json"), "utf8"));
  [g.title, g.tagline, g.coverAlt].forEach(add);
  return { lines: lines.map((l) => l.id), text: Object.fromEntries(lines.map((l) => [l.id, l.text])), strings: [...strings] };
}

function main() {
  const [slug, code, flag] = process.argv.slice(2);
  if (!slug || !code) { console.error("usage: node scripts/lang-strings.js <slug> <code> [--write|--check]"); process.exit(2); }
  const file = L.gameFile(code, slug);
  const have = L.read(file) || { status: "draft", lines: {}, strings: {} };
  have.lines = have.lines || {}; have.strings = have.strings || {};
  const n = needs(slug);
  const shared = L.read(L.siteFile(code)) || {};
  const missL = n.lines.filter((id) => !L.lineText(have.lines[id]));
  // a line translated from English that has since changed: the translation needs a look
  const stale = n.lines.filter((id) => have.lines[id] && typeof have.lines[id] === "object" && have.lines[id].en && have.lines[id].en !== n.text[id]);
  const pats = Object.keys(shared).filter((k) => k.startsWith("re:")).map((k) => new RegExp(k.slice(3)));
  const missS = n.strings.filter((s) => !have.strings[s] && !shared[s] && !pats.some((r) => r.test(s)));
  if (flag === "--write") {
    // every line with its English beside it, in the story's order
    const lines = {};
    // (a line whose English changed keeps the English it was translated from, so it stays listed until someone looks)
    n.lines.forEach((id) => { const v = have.lines[id]; lines[id] = v && typeof v === "object" && v.en ? v : { en: n.text[id], t: L.lineText(v) }; });
    Object.keys(have.lines).forEach((id) => { if (!lines[id]) lines[id] = have.lines[id]; });
    have.lines = lines;
    missS.forEach((s) => { have.strings[s] = ""; });
    L.write(file, have);
  }
  missL.forEach((id) => console.log("line   " + id));
  stale.forEach((id) => console.log("stale  " + id + " (the English changed: " + JSON.stringify(n.text[id]) + ")"));
  missS.forEach((s) => console.log("string " + JSON.stringify(s)));
  console.log(missL.length + missS.length ? (missL.length + " lines and " + missS.length + " strings to translate") : "nothing missing");
  if (stale.length) console.log(stale.length + " lines to look at again: their English changed. Compare \"en\" with narration.json, fix \"t\", then copy the new English into \"en\".");
  if (flag === "--check" && missL.length + missS.length) process.exit(1);
}
if (require.main === module) main();
module.exports = { needs };
