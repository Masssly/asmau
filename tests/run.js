// Runs every test. From the repository root:   cd tests && npm install && npx playwright install chromium && npm test
"use strict";
const { spawnSync } = require("child_process");
const path = require("path");

const only = process.argv[2];
const browserTests = ["landing", "narration", "offline", "sync", "update", "playthrough"].filter((n) => !only || n === only);
(async () => {
  let failed = 0;
  if (!only || only === "worker") {
    console.log("\nworker clean-up");
    failed += spawnSync("node", [path.join(__dirname, "worker.test.mjs")], { stdio: "inherit" }).status ? 1 : 0;
  }
  for (const name of browserTests) {
    console.log("\n" + name);
    const t0 = Date.now();
    try { failed += (await require("./" + name + ".test.js")()) ? 1 : 0; }
    catch (e) { console.log("  FAIL " + name + " crashed: " + e.message); failed += 1; }
    console.log("  (" + Math.round((Date.now() - t0) / 1000) + " s)");
  }
  console.log(failed ? "\n" + failed + " test group(s) failed" : "\nall tests passed");
  process.exit(failed ? 1 : 0);
})();
