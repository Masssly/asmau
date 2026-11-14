#!/usr/bin/env node
/*
  Puts the site's pictures and sounds (.webp, .mp3, .webm, .ogg, .m4a) on R2, where the service worker downloads them
  first (faster than GitHub Pages). Safe to run again: pictures already there are skipped.

    ADMIN_TOKEN=... node scripts/publish-media.js              publish, and log what changed
    ADMIN_TOKEN=... node scripts/publish-media.js --backfill   also publish and log every older
                                                               version found in git history

  Run it before pushing a release that adds or changes pictures. If you forget, nothing
  breaks: the service worker falls back to the copy in the repository.

  History: nothing published is ever deleted. Every version of a file stays in the bucket at
  media/<first 10 hex of its SHA-1>/<path>, and history/index.json in the bucket logs them all:
    { "<path>": [ { "hash": "...", "from": "2026-11-14", "release": "2026.11.9" }, ... ] }
  oldest first. To get an old picture back: look up its hash in the log and download
  <server>/media/<hash>/<path>. Each write of the log also keeps the previous log beside it.
*/
"use strict";
const fs = require("fs");
const path = require("path");
const build = require("./build-offline.js");

const BASE = build.MEDIA_BASE;
const ROOT = path.join(__dirname, "..");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const git = (...a) => execFileSync("git", a, { cwd: ROOT, maxBuffer: 512 * 1024 * 1024 });
const HISTORY = BASE.replace("/media/", "/admin/history");
const token = process.env.ADMIN_TOKEN;
if (!token) { console.error("Set ADMIN_TOKEN (the Worker's admin secret)."); process.exit(1); }

(async () => {
  const { media } = build.compute();
  const auth = { authorization: "Bearer " + token };
  // [file, key, bytes-getter]: today's files, and with --backfill every older version in git
  const jobs = Object.keys(media).filter((f) => build.ON_R2.test(f)).map((f) => [f, media[f] + "/" + f, () => fs.readFileSync(path.join(ROOT, f))]);
  const seen = [];   // [file, hash, date] of older versions, for the log
  if (process.argv.includes("--backfill")) {
    const log = git("log", "--all", "--format=@%H %cs", "--name-only", "--diff-filter=AM", "--", "games", "tools").toString().split("\n");
    let commit = null, date = null;
    for (const line of log) {
      if (line.startsWith("@")) { [commit, date] = line.slice(1).split(" "); continue; }
      if (!line || !build.ON_R2.test(line) || line.split("/").some((s) => s.startsWith("."))) continue;
      let bytes;
      try { bytes = git("show", commit + ":" + line); } catch (e) { continue; }
      const h = crypto.createHash("sha1").update(bytes).digest("hex").slice(0, 10);
      seen.push([line, h, date]);
      if (!jobs.some((j) => j[1] === h + "/" + line)) jobs.push([line, h + "/" + line, () => bytes]);
    }
  }
  let sent = 0, had = 0, failed = 0, i = 0;
  async function worker() {
    for (let j = i++; j < jobs.length; j = i++) {
      const [f, key] = jobs[j];
      try {
        const head = await fetch(BASE + key, { method: "HEAD" });
        if (head.ok) { had++; continue; }
        const r = await fetch(BASE.replace("/media/", "/admin/media/") + key, { method: "PUT", headers: auth, body: jobs[j][2]() });
        if (r.status === 201) sent++; else { failed++; console.error("  " + f + ": " + r.status + " " + (await r.text())); }
      } catch (e) { failed++; console.error("  " + f + ": " + e.message); }
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(jobs.length + " pictures: " + sent + " uploaded, " + had + " already there, " + failed + " failed");

  // the history log: add every version not logged yet, oldest first
  const release = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "version.json"), "utf8")).version; } catch (e) { return null; } })();
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(HISTORY, { headers: auth });
  if (!res.ok) { console.error("history: could not read the log (" + res.status + "); nothing was written"); process.exit(1); }
  const index = await res.json();
  let added = 0;
  const note = (f, hash, from, rel) => {
    const list = index[f] || (index[f] = []);
    if (list.some((e) => e.hash === hash)) return;
    list.push({ hash, from, release: rel });
    list.sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
    added++;
  };
  seen.forEach(([f, h, d]) => note(f, h, d, null));
  Object.keys(media).filter((f) => build.ON_R2.test(f)).forEach((f) => note(f, media[f], today, release));
  if (added) {
    const w = await fetch(HISTORY, { method: "PUT", headers: Object.assign({ "content-type": "application/json" }, auth), body: JSON.stringify(index, null, 1) });
    if (w.status !== 201) { console.error("history: could not write the log (" + w.status + ")"); process.exit(1); }
  }
  const replaced = Object.values(index).filter((l) => l.length > 1).length;
  console.log("history: " + added + " versions added to the log; " + Object.keys(index).length + " files logged, " + replaced + " of them with older versions kept");
  process.exit(failed ? 1 : 0);
})();
