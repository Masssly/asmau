#!/usr/bin/env node
/* Writes games/musa/story.js, games/musa/narration.json and scripts/musa-art/shots.json from the chapter files. */
"use strict";
const fs = require("fs"), path = require("path");
const lib = require("./lib");
["./c0", "./c1", "./c2", "./c3"].forEach((f) => require(f));
const ROOT = path.join(__dirname, "..", "..", ".."), GAME = path.join(ROOT, "games", "musa");

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

const head = "/*\n  The Musa story: chapters -> steps. WRITTEN BY scripts/musa/author/build.js from the\n  chapter files beside it. Change those, not this file.\n\n  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or\n  { play, line, scene, opts } (something to do). See games/yusuf/story.js and\n  shared/story-engine.js for what each field means. `more` lists the other passages\n  a chapter draws on, beside its main `source`.\n*/\n";
const body = "window.STORY = [\n" + lib.STORY.map((ch) =>
  "  {\n    id: " + JSON.stringify(ch.id) + ", icon: " + JSON.stringify(ch.icon) + ", title: " + JSON.stringify(ch.title) + ", source: " + JSON.stringify(ch.source) + ", more: " + JSON.stringify(ch.more) + ",\n    parent: [\n" +
  ch.parent.map((x) => "      " + JSON.stringify(x)).join(",\n") + "\n    ],\n    steps: [\n" +
  ch.steps.map((st) => "      " + JSON.stringify(st)).join(",\n") + "\n    ]\n  }").join(",\n") + "\n];\n";
const moods = "\n/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */\nwindow.STORY_MOODS = " + JSON.stringify(lib.MOODS, null, 0).replace(/","/g, '", "') + ";\n";
fs.writeFileSync(path.join(GAME, "story.js"), head + body + moods);
fs.writeFileSync(path.join(GAME, "narration.json"), "[\n" + lib.LINES.map((l) => "  " + JSON.stringify(l)).join(",\n") + "\n]\n");
fs.mkdirSync(path.join(ROOT, "scripts", "musa-art"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "scripts", "musa-art", "shots.json"), JSON.stringify(lib.SHOTS, null, 1) + "\n");

const plays = {}; let says = 0;
lib.STORY.forEach((ch) => ch.steps.forEach((st) => { if (st.say) says++; else plays[st.play] = (plays[st.play] || 0) + 1; }));
const nPlays = Object.values(plays).reduce((a, b) => a + b, 0);
const longest = Math.max(...Object.values(lib.SHOTS).map((x) => x.scene.length));
console.log(lib.STORY.length + " chapters, " + says + " narrated scenes, " + nPlays + " activities, " + lib.LINES.length + " lines, " + Object.keys(lib.SHOTS).length + " pictures (longest description " + longest + " chars)");
console.log(Object.entries(plays).map((e) => e[0] + " " + e[1]).join(", "));
