#!/usr/bin/env node
/*
  Writes what the service worker and the pages need to work offline and to find pictures and sounds, so that it stays
  small however many games there are (scripts/SCALING.md):

    packs/<pack>.json   one list per pack: { "files": { path: fingerprint }, "bytes": n }
                        core       home page, shared scripts and styles, fonts, icons, covers (saved at first visit)
                        <slug>     a game's pages, scripts, data, notes and pictures (saved when it is first opened)
                        <slug>@w   its narration in the woman's voice (assets/audio/)
                        <slug>@m   its narration in the man's voice (assets/audio-m/)
    sw.js               between its GENERATED markers: the release, a fingerprint of the whole site, and the index of
                        packs (name: fingerprint of its list, bytes, files). A few short lines per game.
    games/<slug>/parents/notes.json
                        the game's notes for parents, one bundle (the owner still edits one .md file per page)
    shared/config.js    the server address, for the pages

  A game's pictures and sounds (games/<slug>/assets/) are not in git: their home is R2 (scripts/publish-media.js) and
  packs/ is the record of which version the site uses. This script reads each file from disk; a file listed in packs/
  but missing on this computer stops it, unless it was deleted on purpose (--prune).

    node scripts/build-offline.js            write everything
    node scripts/build-offline.js --prune    the same, and drop media that is no longer on disk
    node scripts/build-offline.js --check    exit 1 if anything is out of date (scripts/validate.js runs this)
*/
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SKIP_DIRS = new Set([".git", ".github", "brand", "scripts", "sync", "tests", "node_modules", "packs"]);
const SKIP_FILES = new Set(["sw.js", "README.md", "CLAUDE.md", ".nojekyll", "package.json", "package-lock.json"]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (!SKIP_FILES.has(entry.name) && !entry.name.startsWith(".")) {
      out.push(path.relative(ROOT, path.join(dir, entry.name)).split(path.sep).join("/"));
    }
  }
  return out;
}

const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const SERVER = CONFIG.server.replace(/\/$/, "");
const MEDIA_BASE = SERVER + "/media/";
const CONFIG_JS = "/* Generated from config.json by scripts/build-offline.js; do not edit. */\nwindow.ASMAU_CONFIG = " +
  JSON.stringify({ server: SERVER, media: MEDIA_BASE }) + ";\n";

// pictures and sounds that live on R2 only (not in git): a game's assets
const ON_R2 = /\.(?:webp|mp3|webm|ogg|m4a)$/i;
const isR2 = (f) => /^games\/[^/]+\/assets\//.test(f) && ON_R2.test(f);

function packOf(f) {
  const m = /^games\/([^/]+)\/(.*)$/.exec(f);
  if (!m || m[1] === "index.json") return "core";          // games/index.json: the catalogue the home page reads
  if (m[2].startsWith("assets/audio-m/")) return m[1] + "@m";
  if (m[2].startsWith("assets/audio/")) return m[1] + "@w";
  return m[1];
}

const sha = (b) => crypto.createHash("sha1").update(b).digest("hex").slice(0, 10);
const isNote = (f) => /^games\/[^/]+\/parents\/.+\.md$/.test(f);
const isDraft = (txt) => /^\s*#\s*draft\b/i.test(txt);

// the notes of one game, bundled: { "1.5": "text", ... } (live notes only: drafts and empty files are left out)
function notesBundle(dir) {
  const out = {}, base = path.join(ROOT, dir, "parents");
  if (!fs.existsSync(base)) return null;
  for (const ch of fs.readdirSync(base, { withFileTypes: true })) {
    if (!ch.isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(base, ch.name))) {
      if (!/^\d+\.\d+\.md$/.test(f)) continue;
      const txt = fs.readFileSync(path.join(base, ch.name, f), "utf8");
      if (txt.trim() && !isDraft(txt)) out[f.slice(0, -3)] = txt.trim();
    }
  }
  const keys = Object.keys(out).sort((a, b) => { const [x1, y1] = a.split(".").map(Number), [x2, y2] = b.split(".").map(Number); return x1 - x2 || y1 - y2; });
  const sorted = {}; keys.forEach((k) => { sorted[k] = out[k]; });
  return JSON.stringify(sorted, null, 1) + "\n";
}

function readPacks() {
  const dir = path.join(ROOT, "packs"), out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".json") && f !== "index.json") out[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  return out;
}

// files whose content this script writes: given here so that --check sees what they would be
// the home page's catalogue: the sections of manifest.json with each game's game.json, in one file (one request, not
// one per game; covers load as they scroll into view)
function catalogue() {
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  const sections = (man.sections || [{ title: "Games", games: man.games || [] }]).map((s) => ({
    title: s.title, icon: s.icon, more: s.more,
    games: (s.games || []).map((slug) => {
      try { return JSON.parse(fs.readFileSync(path.join(ROOT, "games", slug, "game.json"), "utf8")); } catch (e) { return null; }
    }).filter(Boolean)
  }));
  return JSON.stringify({ sections }) + "\n";
}

function generated() {
  const g = { "shared/config.js": CONFIG_JS, "games/index.json": catalogue() };
  for (const d of fs.readdirSync(path.join(ROOT, "games"))) {
    const b = notesBundle("games/" + d);
    if (b !== null) g["games/" + d + "/parents/notes.json"] = b;
  }
  return g;
}

function compute({ prune = false } = {}) {
  const gen = generated();
  const onDisk = walk(ROOT, []);
  const files = [...new Set([...onDisk, ...Object.keys(gen)])].sort()
    .filter((f) => !isNote(f));                 // the notes travel in the game's notes.json bundle
  const packs = {}, all = {}, missing = [];
  const add = (f, h, bytes) => {
    const p = packOf(f), pk = packs[p] || (packs[p] = { files: {}, bytes: 0 });
    pk.files[f] = h; pk.bytes += bytes;
    if (f !== "version.json") all[f] = h;          // the release record must not change the thing it records
  };
  for (const f of files) {
    const b = gen[f] !== undefined ? Buffer.from(gen[f]) : fs.readFileSync(path.join(ROOT, f));
    add(f, sha(b), b.length);
  }
  // media listed before but not on this computer: kept (it is on R2), unless it was deleted on purpose
  const before = readPacks(), have = new Set(files);
  for (const [p, pk] of Object.entries(before)) for (const [f, h] of Object.entries(pk.files || {})) {
    if (have.has(f) || !isR2(f)) continue;
    if (!fs.existsSync(path.join(ROOT, f.split("/").slice(0, 2).join("/")))) continue;   // the whole game is gone
    if (prune) continue;
    missing.push(f);
    add(f, h, (pk.sizes && pk.sizes[f]) || 0);
  }
  // sizes of media kept from before are not known on disk: carry them over
  for (const [p, pk] of Object.entries(packs)) {
    const old = before[p];
    pk.sizes = {};
    for (const f of Object.keys(pk.files)) {
      if (!isR2(f)) continue;
      pk.sizes[f] = fs.existsSync(path.join(ROOT, f)) ? fs.statSync(path.join(ROOT, f)).size : ((old && old.sizes && old.sizes[f]) || 0);
    }
    pk.bytes = Object.keys(pk.files).reduce((n, f) => n + (isR2(f) ? pk.sizes[f] : (gen[f] !== undefined ? Buffer.byteLength(gen[f]) : (fs.existsSync(path.join(ROOT, f)) ? fs.statSync(path.join(ROOT, f)).size : 0))), 0);
  }
  const whole = crypto.createHash("sha1");
  for (const f of Object.keys(all).sort()) whole.update(f + "\0" + all[f] + "\0");
  return { build: whole.digest("hex").slice(0, 12), packs, missing, gen };
}

// sorted, so the lists are the same whether or not this computer has the media (missing files are added last)
const sorted = (o) => { const out = {}; Object.keys(o || {}).sort().forEach((k) => { out[k] = o[k]; }); return out; };
function packJson(pk) { return JSON.stringify({ bytes: pk.bytes, files: sorted(pk.files), sizes: sorted(pk.sizes) }, null, 0).replace(/,"/g, ',\n"') + "\n"; }

function release() {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, "version.json"), "utf8")); } catch (e) { return null; }
}

function render(c) {
  const r = release(), index = {};
  for (const p of Object.keys(c.packs).sort()) {
    const pk = c.packs[p];
    index[p] = [sha(Buffer.from(packJson(pk))), pk.bytes, Object.keys(pk.files).length];
  }
  return "// BEGIN GENERATED\n" +
    "const RELEASE = " + JSON.stringify(r ? r.version : "0") + ";\n" +
    "const BUILD = " + JSON.stringify(c.build) + ";\n" +
    "// pack: [fingerprint of packs/<pack>.json, bytes, files]\n" +
    "const PACKS = " + JSON.stringify(index).replace(/\],"/g, '],\n  "').replace(/^\{/, "{\n  ").replace(/\}$/, "\n}") + ";\n" +
    "const MEDIA_BASE = " + JSON.stringify(MEDIA_BASE) + ";\n" +
    "// END GENERATED";
}

function currentBlock(src) {
  const a = src.indexOf("// BEGIN GENERATED"), b = src.indexOf("// END GENERATED");
  if (a < 0 || b < 0) throw new Error("sw.js is missing its GENERATED markers");
  return { a, b: b + "// END GENERATED".length };
}

// every file this script would write, with its content
function outputs(c) {
  const out = Object.assign({}, c.gen);
  for (const [p, pk] of Object.entries(c.packs)) out["packs/" + p + ".json"] = packJson(pk);
  const swPath = path.join(ROOT, "sw.js"), src = fs.readFileSync(swPath, "utf8"), { a, b } = currentBlock(src);
  out["sw.js"] = src.slice(0, a) + render(c) + src.slice(b);
  return out;
}

function isCurrent() {
  const c = compute(), out = outputs(c), stale = [];
  for (const [f, txt] of Object.entries(out)) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== txt) stale.push(f);
  }
  const listed = new Set(Object.keys(c.packs).map((p) => p + ".json"));
  if (fs.existsSync(path.join(ROOT, "packs"))) for (const f of fs.readdirSync(path.join(ROOT, "packs"))) if (!listed.has(f)) stale.push("packs/" + f + " (no longer a pack)");
  return { current: stale.length === 0, stale, build: c.build, missing: c.missing };
}

if (require.main === module) {
  if (process.argv.includes("--check")) {
    const r = isCurrent();
    if (!r.current) { console.error("Out of date: " + r.stale.slice(0, 5).join(", ") + ". Run: node scripts/build-offline.js"); process.exit(1); }
    console.log("offline lists are current (build " + r.build + ")");
  } else {
    // the parents' note files follow their pages, and pages.json says which pages have a note
    const PN = require("./parent-notes");
    for (const dir of PN.games()) { const ch = PN.sync(dir, true); if (ch.length) console.log(dir + "/parents: " + ch.join("; ")); }
    const c = compute({ prune: process.argv.includes("--prune") });
    if (c.missing.length) {
      console.log(c.missing.length + " pictures and sounds are listed but not on this computer; kept as they are on R2. " +
        "To work on them run: node scripts/fetch-media.js. If you deleted them on purpose, run again with --prune.");
    }
    const out = outputs(c);
    fs.mkdirSync(path.join(ROOT, "packs"), { recursive: true });
    const listed = new Set(Object.keys(c.packs).map((p) => p + ".json"));
    for (const f of fs.readdirSync(path.join(ROOT, "packs"))) if (!listed.has(f)) fs.unlinkSync(path.join(ROOT, "packs", f));
    for (const [f, txt] of Object.entries(out)) fs.writeFileSync(path.join(ROOT, f), txt);
    const n = Object.values(c.packs).reduce((s, pk) => s + Object.keys(pk.files).length, 0);
    console.log("offline lists written: build " + c.build + ", " + Object.keys(c.packs).length + " packs, " + n + " files");
  }
}

module.exports = { compute, isCurrent, packOf, isR2, MEDIA_BASE, ON_R2, readPacks };
