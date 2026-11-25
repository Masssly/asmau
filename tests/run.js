// Runs the tests. From the repository root:   cd tests && npm install && npx playwright install chromium && npm test
//
//   node run.js            everything (about 18 minutes); a pass is noted, so the day's quick checks can follow
//   node run.js quick      only what the change since the live site needs (plan.js); the full run instead when the change
//                          touches the engine, or when no full run has passed today (owner, 25 November 2026)
//   node run.js <group>    one group, e.g. node run.js landing
"use strict";
const { spawnSync } = require("child_process");
const path = require("path");
const { plan, changedFiles, fullDueToday, markFull } = require("./plan");

const ALL = ["landing", "narration", "offline", "sync", "update", "playthrough", "counting", "gate", "notes", "sound", "live", "migrate", "lang", "why", "voice", "keep", "move", "record"];
const arg = process.argv[2];
let groups, worker, full = false;
if (arg === "quick") {
  let p;
  try { p = fullDueToday() ? { full: true, why: "no full run has passed today" } : plan(changedFiles()); }
  catch (e) { p = { full: true, why: "the change could not be read (" + e.message + ")" }; }
  if (p.full) { console.log("quick check: the full run instead, because " + p.why); full = true; }
  else {
    groups = ALL.filter((n) => p.groups.includes(n));
    worker = p.groups.includes("worker");
    if (p.play.length) process.env.PLAY = p.play.join(",");
    console.log("quick check: " + groups.join(", ") + (worker ? ", worker" : "") + (p.play.length ? " (playing " + p.play.join(", ") + ")" : ""));
  }
} else if (!arg) full = true;
if (full) { groups = ALL; worker = true; }
else if (arg && arg !== "quick") { groups = ALL.filter((n) => n === arg); worker = arg === "worker"; }

(async () => {
  let failed = 0;
  if (worker) {
    console.log("\nworker clean-up");
    failed += spawnSync("node", [path.join(__dirname, "worker.test.mjs")], { stdio: "inherit" }).status ? 1 : 0;
  }
  for (const name of groups) {
    console.log("\n" + name);
    const t0 = Date.now();
    try { failed += (await require("./" + name + ".test.js")()) ? 1 : 0; }
    catch (e) { console.log("  FAIL " + name + " crashed: " + e.message); failed += 1; }
    console.log("  (" + Math.round((Date.now() - t0) / 1000) + " s)");
  }
  if (full && !failed && (!process.env.PLAY || process.env.PLAY === "all")) markFull();
  console.log(failed ? "\n" + failed + " test group(s) failed" : "\nall tests passed" + (full ? " (full run)" : " (quick check)"));
  process.exit(failed ? 1 : 0);
})();
