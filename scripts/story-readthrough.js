#!/usr/bin/env node
/*
  Prints a story game straight through, as a child would hear it: every chapter's
  title, every narrated line in order, and each activity's question marked with ▶.

    node scripts/story-readthrough.js yusuf            the whole story
    node scripts/story-readthrough.js yusuf --story    narrated lines only

  Use it before releasing a story or a change to one, and read it from start to end
  asking one question at each line: would a child know how we got here from the line
  before? A scene that arrives without its cause (Yusuf in the well before anyone
  asked to take him out) is a gap to fix, whatever the activity count says.
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const slug = process.argv[2], storyOnly = process.argv.includes("--story");
if (!slug) { console.error("usage: node scripts/story-readthrough.js <game> [--story]"); process.exit(1); }
const dir = path.join(__dirname, "..", "games", slug);
const box = { window: {} }; box.window.window = box.window; vm.createContext(box);
vm.runInContext(fs.readFileSync(path.join(dir, "story.js"), "utf8"), box);
const lines = {};
JSON.parse(fs.readFileSync(path.join(dir, "narration.json"), "utf8")).forEach((l) => { lines[l.id] = l.text; });
box.window.STORY.forEach((ch, i) => {
  console.log("\n" + (i + 1) + ". " + ch.title.toUpperCase() + "  (" + ch.source + ")");
  ch.steps.forEach((st) => {
    if (st.say) console.log("   " + lines[st.say] + (st.src ? "   [" + st.src + "]" : ""));
    else if (!storyOnly) console.log("   ▶ " + st.play + ": " + (lines[st.line] || st.line));
  });
});
if (lines["end-a"]) console.log("\nEND. " + lines["end-a"]);
