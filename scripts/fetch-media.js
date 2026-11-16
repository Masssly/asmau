#!/usr/bin/env node
/*
  Downloads the games' pictures and sounds from R2 onto this computer. They are not in git (scripts/SCALING.md):
  packs/<pack>.json lists every file and its fingerprint, and R2 keeps every version at
  <server>/media/<fingerprint>/<path>. Run it after cloning, before working on pictures or voices or running the tests.

    node scripts/fetch-media.js              fetch what is missing or different
    node scripts/fetch-media.js yusuf adam   only these games

  Safe to run again: files already here with the right fingerprint are skipped.
*/
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const build = require("./build-offline.js");

const ROOT = path.join(__dirname, "..");
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const sha = (b) => crypto.createHash("sha1").update(b).digest("hex").slice(0, 10);

const jobs = [];
for (const [pack, pk] of Object.entries(build.readPacks())) {
  if (only.length && !only.includes(pack.split("@")[0])) continue;
  for (const [f, h] of Object.entries(pk.files || {})) {
    if (!build.isR2(f)) continue;
    const local = path.join(ROOT, f);
    if (fs.existsSync(local) && sha(fs.readFileSync(local)) === h) continue;
    jobs.push([f, h]);
  }
}

(async () => {
  let got = 0, failed = 0, i = 0;
  async function worker() {
    for (let j = i++; j < jobs.length; j = i++) {
      const [f, h] = jobs[j];
      try {
        const r = await fetch(build.MEDIA_BASE + h + "/" + f);
        if (!r.ok) throw new Error(String(r.status));
        const b = Buffer.from(await r.arrayBuffer());
        if (sha(b) !== h) throw new Error("fingerprint does not match");
        fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
        fs.writeFileSync(path.join(ROOT, f), b);
        got++;
      } catch (e) { failed++; console.error("  " + f + ": " + e.message); }
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log(got + " pictures and sounds fetched, " + failed + " failed, " + (jobs.length ? "" : "all were already here"));
  if (failed) process.exit(1);
})();
