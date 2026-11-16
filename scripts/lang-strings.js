#!/usr/bin/env node
/*
  The words a game shows or says, for translating it (shared/lang.js):
    node scripts/lang-strings.js <slug> <code>          what games/<slug>/lang/<code>.json still lacks
    node scripts/lang-strings.js <slug> <code> --write  add the missing ones to the file (value "", to fill in)
    node scripts/lang-strings.js <slug> <code> --check  exit 1 if anything is missing or empty (the checker uses it)
  Lines are listed by their id (narration.json); everything else by its English text: chapter titles, labels in the
  activities, the "From ..." source lines, and the words of the game's own page (title, buttons, The End).
  Parents' text stays in English: the For parents box on the title page and the notes.
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");

function storyOf(dir) {
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
  const lines = JSON.parse(fs.readFileSync(path.join(dir, "narration.json"), "utf8")).filter((l) => l.lang !== "ar");
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
  pageText(fs.readFileSync(path.join(dir, "index.html"), "utf8")).forEach(add);
  // the game's card on the home page
  const g = JSON.parse(fs.readFileSync(path.join(dir, "game.json"), "utf8"));
  [g.title, g.tagline, g.coverAlt].forEach(add);
  return { lines: lines.map((l) => l.id), strings: [...strings] };
}

function main() {
  const [slug, code, flag] = process.argv.slice(2);
  if (!slug || !code) { console.error("usage: node scripts/lang-strings.js <slug> <code> [--write|--check]"); process.exit(2); }
  const file = path.join(ROOT, "games", slug, "lang", code + ".json");
  const have = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { status: "draft", lines: {}, strings: {} };
  have.lines = have.lines || {}; have.strings = have.strings || {};
  const n = needs(slug);
  const shared = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "shared", "i18n", code + ".json"), "utf8")); } catch (e) { return {}; } })();
  const missL = n.lines.filter((id) => !have.lines[id]);
  const pats = Object.keys(shared).filter((k) => k.startsWith("re:")).map((k) => new RegExp(k.slice(3)));
  const missS = n.strings.filter((s) => !have.strings[s] && !shared[s] && !pats.some((r) => r.test(s)));
  if (flag === "--write") {
    missL.forEach((id) => { have.lines[id] = ""; });
    missS.forEach((s) => { have.strings[s] = ""; });
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(have, null, 1) + "\n");
  }
  missL.forEach((id) => console.log("line   " + id));
  missS.forEach((s) => console.log("string " + JSON.stringify(s)));
  console.log(missL.length + missS.length ? (missL.length + " lines and " + missS.length + " strings to translate") : "nothing missing");
  if (flag === "--check" && missL.length + missS.length) process.exit(1);
}
if (require.main === module) main();
module.exports = { needs };
