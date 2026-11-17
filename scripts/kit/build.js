#!/usr/bin/env node
/*
  Writes a story game's files from its chapter files (the story kit, scripts/kit/README.md):
    games/<game>/story.js         chapters, steps, music moods
    games/<game>/narration.json   every spoken line
    scripts/<art>/shots.json      one entry per picture: alt text, prompt, who is in it
    scripts/<art>/refs.json       the people who get a reference picture
    scripts/<art>/presence.json   pictures where the Prophet (peace be upon him) is present: the breeze, never a figure
  Usage:  node scripts/kit/build.js <folder in scripts/, e.g. rahmah>
*/
"use strict";
const fs = require("fs"), path = require("path");
const dir = process.argv[2];
if (!dir) { console.error("usage: node scripts/kit/build.js <story folder in scripts/>"); process.exit(2); }
const HERE = path.join(__dirname, "..", dir);
const lib = require(path.join(HERE, "author", "lib.js"));
const cfg = lib.cfg;
const chapters = cfg.chapters || fs.readdirSync(path.join(HERE, "author")).filter((f) => /^c\d+\.js$/.test(f))
  .map((f) => f.slice(0, -3)).sort((a, b) => +a.slice(1) - +b.slice(1));
chapters.forEach((f) => require(path.join(HERE, "author", f)));
const ROOT = path.join(__dirname, "..", ".."), GAME = path.join(ROOT, "games", cfg.game), ART = path.join(ROOT, "scripts", cfg.art);

// only the backdrops some activity actually stands in front of
const need = new Set();
lib.STORY.forEach((ch) => ch.steps.forEach((st) => { if (st.play && !(st.opts && st.opts.img)) need.add("bg-" + st.scene); }));
Object.keys(lib.SHOTS).forEach((k) => { if (k.startsWith("bg-") && !need.has(k)) delete lib.SHOTS[k]; });
need.forEach((k) => { if (!lib.SHOTS[k]) throw new Error("no backdrop written for " + k); });
// a picture borrowed from another line must exist
lib.STORY.forEach((ch) => ch.steps.forEach((st) => {
  const ref = st.pic || (st.opts && st.opts.img);
  if (ref && !lib.SHOTS[ref]) throw new Error((st.say || st.line) + " borrows the picture of '" + ref + "', which has none");
  if (st.opts && st.opts.pic && !lib.SHOTS[st.opts.pic]) throw new Error(st.line + ": puzzle of '" + st.opts.pic + "', which has no picture");
}));

// A picture puzzle needs its picture: until that picture has been made, the puzzle is left out.
// (Pictures live on R2: a checkout without them uses the pack list, packs/<game>.json, to know what exists.)
const packed = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "packs", cfg.game + ".json"), "utf8")).files || {}; } catch (e) { return {}; } })();
const hasPic = (k) => fs.existsSync(path.join(GAME, "assets", "img", k + ".webp")) || !!packed["games/" + cfg.game + "/assets/img/" + k + ".webp"];
lib.STORY.forEach((ch) => { ch.steps = ch.steps.filter((st) => {
  if (st.play !== "puzzle" || hasPic(st.opts.pic)) return true;
  const i = lib.LINES.findIndex((l) => l.id === st.line); if (i >= 0) lib.LINES.splice(i, 1);
  return false;
}); });

// Icons for scenes with no picture, with the story's skin tone on every emoji of a person or a hand
// (🤝 stays plain: older phones draw a toned handshake as two signs.)
// (cfg.tone: 1F3FF dark, 1F3FE medium-dark, 1F3FD medium; the people of each story as themselves).
const EM = require(path.join(HERE, "author", "em.js"));
const TONE = String.fromCodePoint(parseInt(cfg.tone || "1F3FF", 16));
const BASES = "👶 🤱 👸 🧕 👦 👧 🧑 🧔 👴 👵 🧙 🙇 🚶 🏃 🤲 ✋ 🙌 👉 ☝ ✊ 🙅 👍 👂 💪 🤴 👩 👨".split(" ");
function dark(s) {
  if (typeof s !== "string") return s;
  let out = "";
  const cs = Array.from(s);
  cs.forEach((ch, i) => {
    out += ch;
    if (BASES.includes(ch) && !/[\u{1F3FB}-\u{1F3FF}]/u.test(cs[i + 1] || "")) out += TONE;   // once only
  });
  return out.replace(/([\u{1F3FB}-\u{1F3FF}])\uFE0F/gu, "$1");
}
const ICON_KEYS = new Set(["icon", "aIcon", "bIcon", "walker", "from", "to", "got", "into", "under", "e", "mark"]);
function walk(o) {
  if (Array.isArray(o)) return o.forEach(walk);
  if (!o || typeof o !== "object") return;
  for (const k of Object.keys(o)) {
    if (ICON_KEYS.has(k)) o[k] = dark(o[k]);
    else if (k === "icons") o[k] = o[k].map(dark);
    else walk(o[k]);
  }
}
lib.STORY.forEach((ch) => {
  ch.steps.forEach((st) => { if (st.say) { if (!EM[st.say]) throw new Error("no icons for " + st.say + " in em.js"); st.e = EM[st.say]; } });
  walk(ch.steps);
});

const note = cfg.headNote || "`more` lists the other passages\n  a chapter draws on, beside its main `source`.";
const head = "/*\n  " + cfg.name + ": chapters -> steps. WRITTEN BY scripts/" + dir + "/author/build.js from the\n  chapter files beside it. Change those, not this file.\n\n  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or\n  { play, line, scene, opts } (something to do). See games/yusuf/story.js and\n  shared/story-engine.js for what each field means. " + note + "\n*/\n";
const body = "window.STORY = [\n" + lib.STORY.map((ch) =>
  "  {\n    id: " + JSON.stringify(ch.id) + ", icon: " + JSON.stringify(ch.icon) + ", title: " + JSON.stringify(ch.title) +
  (cfg.sourceIsCite ? ", cite: " + JSON.stringify(ch.cite) :
    (ch.source || cfg.alwaysSource ? ", source: " + JSON.stringify(ch.source) : "") + ", more: " + JSON.stringify(ch.more) + (ch.cite ? ", cite: " + JSON.stringify(ch.cite) : "")) + ",\n    steps: [\n" +
  ch.steps.map((st) => "      " + JSON.stringify(st)).join(",\n") + "\n    ]\n  }").join(",\n") + "\n];\n";
const moods = "\n/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */\nwindow.STORY_MOODS = " + JSON.stringify(lib.MOODS, null, 0).replace(/","/g, '", "') + ";\n";
fs.writeFileSync(path.join(GAME, "story.js"), head + body + moods);
fs.writeFileSync(path.join(GAME, "narration.json"), "[\n" + lib.LINES.map((l) => "  " + JSON.stringify(l)).join(",\n") + "\n]\n");
fs.mkdirSync(ART, { recursive: true });
const presence = Object.keys(lib.SHOTS).filter((k) => lib.SHOTS[k].presence), pf = path.join(ART, "presence.json");
if (presence.length || fs.existsSync(pf)) fs.writeFileSync(pf, JSON.stringify(presence) + "\n");
fs.writeFileSync(path.join(ART, "shots.json"), JSON.stringify(lib.SHOTS, null, 1) + "\n");
const refs = {};
lib.REFS.forEach((k) => { refs[k] = { name: lib.WHO[k][0], look: lib.WHO[k][1] }; });
fs.writeFileSync(path.join(ART, "refs.json"), JSON.stringify(refs, null, 1) + "\n");

// a person in three or more pictures needs a reference picture, so they look the same everywhere (owner, 17 November 2026)
const seen = {};
Object.values(lib.SHOTS).forEach((x) => (x.who || []).forEach((w) => { seen[w] = (seen[w] || 0) + 1; }));
const noRef = Object.keys(seen).filter((w) => seen[w] >= 3 && !lib.REFS.includes(w) && !lib.NOREF.includes(w));
if (noRef.length) console.warn("warning: in 3 or more pictures without a reference: " + noRef.map((w) => w + " (" + seen[w] + ")").join(", ") +
  ". Make one from a picture the game shows (scripts/art/ref-from.py) and add it to REFS, or list it in NOREF in cast.js with the reason.");

const plays = {}; let says = 0;
lib.STORY.forEach((ch) => ch.steps.forEach((st) => { if (st.say) says++; else plays[st.play] = (plays[st.play] || 0) + 1; }));
const nPlays = Object.values(plays).reduce((a, b) => a + b, 0);
const longest = Math.max(...Object.values(lib.SHOTS).map((x) => x.scene.length));
console.log(cfg.game + ": " + lib.STORY.length + " chapters, " + says + " narrated scenes, " + nPlays + " activities, " + lib.LINES.length + " lines, " + Object.keys(lib.SHOTS).length + " pictures (longest description " + longest + " chars)");
console.log(Object.entries(plays).map((e) => e[0] + " " + e[1]).join(", "));
