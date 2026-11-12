#!/usr/bin/env node
/*
  Puts the site's pictures and sounds (.webp, .mp3, .webm, .ogg, .m4a) on R2, where the service worker downloads them
  first (faster than GitHub Pages). Safe to run again: pictures already there are skipped.

    ADMIN_TOKEN=... node scripts/publish-media.js

  Run it before pushing a release that adds or changes pictures. If you forget, nothing
  breaks: the service worker falls back to the copy in the repository.
*/
"use strict";
const fs = require("fs");
const path = require("path");
const build = require("./build-offline.js");

const BASE = build.MEDIA_BASE;
const token = process.env.ADMIN_TOKEN;
if (!token) { console.error("Set ADMIN_TOKEN (the Worker's admin secret)."); process.exit(1); }

(async () => {
  const { media } = build.compute();
  const jobs = Object.keys(media).filter((f) => build.ON_R2.test(f)).map((f) => [f, media[f] + "/" + f]);
  let sent = 0, had = 0, failed = 0, i = 0;
  async function worker() {
    for (let j = i++; j < jobs.length; j = i++) {
      const [f, key] = jobs[j];
      try {
        const head = await fetch(BASE + key, { method: "HEAD" });
        if (head.ok) { had++; continue; }
        const r = await fetch(BASE.replace("/media/", "/admin/media/") + key, { method: "PUT", headers: { authorization: "Bearer " + token }, body: fs.readFileSync(path.join(__dirname, "..", f)) });
        if (r.status === 201) sent++; else { failed++; console.error("  " + f + ": " + r.status + " " + (await r.text())); }
      } catch (e) { failed++; console.error("  " + f + ": " + e.message); }
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(jobs.length + " pictures: " + sent + " uploaded, " + had + " already there, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
