#!/usr/bin/env node
/*
  One command for each step of making a story game with the story kit (scripts/kit/README.md):

    node scripts/kit/make.js <story> story      write story.js, narration.json, shots.json from the chapter files
    node scripts/kit/make.js <story> refs       draw the reference pictures (then a person approves them)
    node scripts/kit/make.js <story> scenes     draw every picture not drawn yet (scripts/<art>/out/)
    node scripts/kit/make.js <story> import     take the drawn pictures into the game (look at each first!)
    node scripts/kit/make.js <story> fx         place the living effects on new pictures
    node scripts/kit/make.js <story> voice      voice new or changed lines: both voices, and every translation
    node scripts/kit/make.js <story> listen     have every clip listened back (both voices, every translation)
    node scripts/kit/make.js <story> check      offline lists, the checker, the read-through, repeated facts in notes

  <story> is the folder in scripts/ with kit.json. Steps can be given together: make.js rahmah story voice check.
  Drawing and voicing need PROJECT=asmau-assets (the key is added by the network proxy).
*/
"use strict";
const { spawnSync } = require("child_process"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const [story, ...steps] = process.argv.slice(2);
if (!story || !steps.length) { console.error(fs.readFileSync(__filename, "utf8").split("*/")[0]); process.exit(2); }
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", story, "kit.json"), "utf8"));
const G = "games/" + cfg.game;
const langs = () => require("../lang-files.js").langsOfGame(cfg.game);          // lang/<code>/<game>.json

function run(cmd, args, env) {
  console.log("\n$ " + Object.entries(env || {}).map(([k, v]) => k + "=" + v + " ").join("") + cmd + " " + args.join(" "));
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", env: Object.assign({}, process.env, env || {}) });
  if (r.status !== 0) { console.error("stopped: that step failed"); process.exit(r.status || 1); }
}
const voices = () => [{}, { VOICE: "m" }].flatMap((v) => [v].concat(langs().map((l) => Object.assign({ STORY_LANG: l }, v))));

const STEPS = {
  story: () => run("node", ["scripts/kit/build.js", story]),
  refs: () => run("python3", ["scripts/art/vertex.py", "refs", story]),
  scenes: () => run("python3", ["scripts/art/vertex.py", "scenes", story]),
  import: () => run("python3", ["scripts/kit/art.py", story, "import", "scripts/" + cfg.art + "/out"]),
  fx: () => run("python3", ["scripts/scene-fx.py", G]),
  voice: () => voices().forEach((env) => run("python3", ["scripts/generate-voice-gemini.py", G], env)),
  listen: () => voices().forEach((env) => run("python3", ["scripts/voice-check.py", G], env)),
  check: () => {
    run("node", ["scripts/build-offline.js"]);
    run("node", ["scripts/validate.js"]);
    run("node", ["scripts/story-readthrough.js", cfg.game, "--story"]);
    run("node", ["scripts/parent-repeats.js", G]);
  }
};
for (const s of steps) {
  if (!STEPS[s]) { console.error("unknown step '" + s + "': " + Object.keys(STEPS).join(", ")); process.exit(2); }
  STEPS[s]();
}
