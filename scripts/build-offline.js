#!/usr/bin/env node
/*
  Regenerates the lists inside sw.js, so the service worker saves exactly what
  is in the repo: SHELL (pages, scripts, styles, data: small, fetched fresh)
  and MEDIA (pictures, sounds, fonts, each with a fingerprint, so a release
  only downloads the ones that changed). BUILD is a fingerprint of everything.
  The human version (2026.11.1) lives in version.json; see scripts/release.js.

    node scripts/build-offline.js          rewrite sw.js
    node scripts/build-offline.js --check  exit 1 if sw.js is out of date

  Run it after any change to the site, before committing. scripts/validate.js
  runs the --check form, so a forgotten run is caught.
*/
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SKIP_DIRS = new Set([".git", ".github", "scripts", "sync", "node_modules"]);
const SKIP_FILES = new Set(["sw.js", "README.md", ".nojekyll", "package.json", "package-lock.json"]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (!SKIP_FILES.has(entry.name)) {
      out.push(path.relative(ROOT, path.join(dir, entry.name)).split(path.sep).join("/"));
    }
  }
  return out;
}

const MEDIA = /\.(?:webp|png|jpe?g|mp3|webm|ogg|m4a|woff2?)$/i;   // big, never change under the same name

function compute() {
  const files = walk(ROOT, []).sort();
  const hash = crypto.createHash("sha1");
  const shell = ["./"];
  const media = {};
  for (const f of files) {
    const bytes = fs.readFileSync(path.join(ROOT, f));
    if (f !== "version.json") {          // the release record must not change the thing it records
      hash.update(f + "\0");
      hash.update(bytes);
      hash.update("\0");
    }
    if (MEDIA.test(f)) media[f] = crypto.createHash("sha1").update(bytes).digest("hex").slice(0, 10);
    else {
      shell.push(f);
      // a folder URL (…/games/yusuf/) must be saved as well as …/games/yusuf/index.html
      if (f.endsWith("/index.html")) shell.push(f.slice(0, -"index.html".length));
    }
  }
  return { build: hash.digest("hex").slice(0, 12), shell, media };
}

function release() {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, "version.json"), "utf8")); } catch (e) { return null; }
}

function render(c) {
  const r = release();
  return "// BEGIN GENERATED\n" +
    "const RELEASE = " + JSON.stringify(r ? r.version : "0") + ";\n" +
    "const BUILD = " + JSON.stringify(c.build) + ";\n" +
    "const SHELL = " + JSON.stringify(c.shell, null, 2) + ";\n" +
    "const MEDIA = " + JSON.stringify(c.media, null, 2) + ";\n" +
    "// END GENERATED";
}

function currentBlock(src) {
  const a = src.indexOf("// BEGIN GENERATED");
  const b = src.indexOf("// END GENERATED");
  if (a < 0 || b < 0) throw new Error("sw.js is missing its GENERATED markers");
  return { a, b: b + "// END GENERATED".length };
}

function isCurrent() {
  const src = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  const { a, b } = currentBlock(src);
  const c = compute();
  return { current: src.slice(a, b) === render(c), build: c.build };
}

if (require.main === module) {
  const swPath = path.join(ROOT, "sw.js");
  if (process.argv.includes("--check")) {
    const r = isCurrent();
    if (!r.current) {
      console.error("sw.js is out of date. Run: node scripts/build-offline.js");
      process.exit(1);
    }
    console.log("sw.js is current (build " + r.build + ")");
  } else {
    const src = fs.readFileSync(swPath, "utf8");
    const { a, b } = currentBlock(src);
    const c = compute();
    fs.writeFileSync(swPath, src.slice(0, a) + render(c) + src.slice(b));
    console.log("sw.js updated: build " + c.build + ", " + c.shell.length + " pages/scripts, " + Object.keys(c.media).length + " pictures/sounds/fonts");
  }
}

module.exports = { compute, isCurrent };
