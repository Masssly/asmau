#!/usr/bin/env node
/*
  Regenerates the file list and version inside sw.js, so the service worker
  caches exactly what is in the repo.

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
const SKIP_DIRS = new Set([".git", ".github", "scripts", "node_modules"]);
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

function compute() {
  const files = walk(ROOT, []).sort();
  const hash = crypto.createHash("sha1");
  for (const f of files) {
    hash.update(f + "\0");
    hash.update(fs.readFileSync(path.join(ROOT, f)));
    hash.update("\0");
  }
  // a folder URL (…/games/yusuf/) must be cached as well as …/games/yusuf/index.html
  const urls = ["./"];
  for (const f of files) {
    urls.push(f);
    if (f.endsWith("/index.html")) urls.push(f.slice(0, -"index.html".length));
  }
  return { version: hash.digest("hex").slice(0, 12), files: urls };
}

function render(c) {
  return "// BEGIN GENERATED\n" +
    "const VERSION = " + JSON.stringify(c.version) + ";\n" +
    "const FILES = " + JSON.stringify(c.files, null, 2) + ";\n" +
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
  return { current: src.slice(a, b) === render(compute()), version: compute().version };
}

if (require.main === module) {
  const swPath = path.join(ROOT, "sw.js");
  if (process.argv.includes("--check")) {
    const r = isCurrent();
    if (!r.current) {
      console.error("sw.js is out of date. Run: node scripts/build-offline.js");
      process.exit(1);
    }
    console.log("sw.js is current (version " + r.version + ")");
  } else {
    const src = fs.readFileSync(swPath, "utf8");
    const { a, b } = currentBlock(src);
    const c = compute();
    fs.writeFileSync(swPath, src.slice(0, a) + render(c) + src.slice(b));
    console.log("sw.js updated: version " + c.version + ", " + c.files.length + " files");
  }
}

module.exports = { compute, isCurrent };
