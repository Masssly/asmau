#!/usr/bin/env node
/*
  Checks the whole site for the mistakes that are easy to make and hard to see.
  Plain Node, no dependencies:   node scripts/validate.js

  - every game in manifest.json has a folder, an index.html and valid game.json
  - narration ids are unique, every English line has audio, no audio is orphaned
  - every line a story points at exists, and every narration line is used
  - every person, activity and music mood a story names exists
  - Qur'an references look like references
  - pages only load local files that exist, and nothing loads from Google
  - the README only names files that exist
  - sw.js lists exactly the files in the repo (scripts/build-offline.js)
*/
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const offline = require("./build-offline.js");

const ROOT = path.join(__dirname, "..");
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const json = (f) => { try { return JSON.parse(read(f)); } catch (e) { fail(f + ": not valid JSON (" + e.message + ")"); return null; } };

const REF = /^\d+:\d+(?:-\d+)?$/;
const SCENES = new Set(["night", "dusk", "desert", "well", "egypt", "palace", "prison", "field", "grey", "dawn"]);

// load a browser script in an empty sandbox and hand back its globals
function load(files) {
  const sandbox = { window: {}, console };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of files) vm.runInContext(read(f), sandbox, { filename: f });
  return sandbox.window;
}

/* ---------- games ---------- */
const manifest = json("manifest.json");
const slugs = (manifest && manifest.games) || [];
if (!Array.isArray(slugs) || !slugs.length) fail("manifest.json: no games listed");
if (new Set(slugs).size !== slugs.length) fail("manifest.json: a game is listed twice");

let musicMoods = [];
try { musicMoods = load(["shared/music.js"]).AsmauMusic.moodNames; } catch (e) { fail("shared/music.js: failed to load (" + e.message + ")"); }

for (const slug of slugs) {
  const dir = "games/" + slug;
  if (!fs.existsSync(path.join(ROOT, dir))) { fail(dir + ": listed in manifest.json but the folder is missing"); continue; }
  if (!exists(dir + "/index.html")) fail(dir + "/index.html: missing");

  const g = json(dir + "/game.json");
  if (g) {
    if (g.slug !== slug) fail(dir + "/game.json: slug is '" + g.slug + "', expected '" + slug + "'");
    for (const k of ["title", "icon", "tagline", "depictionNotes"]) {
      if (typeof g[k] !== "string" || !g[k].trim()) fail(dir + "/game.json: '" + k + "' is missing");
    }
    if (typeof g.minAge !== "number" || typeof g.maxAge !== "number") fail(dir + "/game.json: minAge and maxAge must be numbers (every game states its age range)");
    else if (g.minAge > g.maxAge) fail(dir + "/game.json: minAge is above maxAge");
    if (g.basedOn !== null && g.basedOn !== undefined && !/^Surah .+, \d+:\d+(?:-\d+)?$/.test(g.basedOn)) {
      fail(dir + "/game.json: basedOn should be null or look like 'Surah Yusuf, 12:4-101'");
    }
  }

  /* ---------- narration ---------- */
  const narrationFile = dir + "/narration.json";
  if (!exists(narrationFile)) { warn(narrationFile + ": none (the game is silent)"); continue; }
  const lines = json(narrationFile) || [];
  const ids = new Set();
  const audioDir = dir + "/assets/audio";
  const audio = fs.existsSync(path.join(ROOT, audioDir)) ? fs.readdirSync(path.join(ROOT, audioDir)) : [];
  for (const l of lines) {
    if (!l || typeof l.id !== "string" || !/^[a-z0-9-]+$/.test(l.id)) { fail(narrationFile + ": bad id " + JSON.stringify(l && l.id)); continue; }
    if (ids.has(l.id)) fail(narrationFile + ": duplicate id '" + l.id + "'");
    ids.add(l.id);
    if (typeof l.text !== "string" || !l.text.trim()) fail(narrationFile + ": '" + l.id + "' has no text");
    if (l.lang !== "en" && l.lang !== "ar") fail(narrationFile + ": '" + l.id + "' lang must be 'en' or 'ar'");
    if (l.lang === "en" && !audio.includes(l.id + ".mp3") && !audio.includes(l.id + ".webm")) {
      fail(audioDir + "/" + l.id + ".mp3: missing (run scripts/generate-placeholder-audio.sh " + dir + ")");
    }
  }
  for (const f of audio) {
    const id = f.replace(/\.(mp3|webm|ogg|m4a)$/, "");
    if (!ids.has(id)) fail(audioDir + "/" + f + ": no line '" + id + "' in narration.json (orphaned audio)");
  }

  /* ---------- a story, if the game has one ---------- */
  if (!exists(dir + "/story.js")) continue;
  const w = load([dir + "/people.js", dir + "/story.js"].filter(exists));
  const story = w.YUSUF_STORY, moods = w.YUSUF_MOODS || {};
  const people = new Set((w.YusufPeople && w.YusufPeople.names) || []);
  const gameSrc = exists(dir + "/game.js") ? read(dir + "/game.js") : "";
  const activities = new Set([...gameSrc.matchAll(/ACT(?:\.(\w+)|\["(\w+)"\])\s*=/g)].map((m) => m[1] || m[2]));
  const groupDefs = (gameSrc.match(/GROUPS\s*=\s*\{([^}]*)\}/) || [, ""])[1];
  const groups = new Set([...groupDefs.matchAll(/(\w+)\s*:/g)].map((m) => m[1]));
  const used = new Set();
  const need = (id, where) => { used.add(id); if (!ids.has(id)) fail(dir + ": " + where + " uses line '" + id + "', which is not in narration.json"); };

  if (!Array.isArray(story) || !story.length) { fail(dir + "/story.js: no chapters"); continue; }
  const chapterIds = new Set();
  story.forEach((ch, ci) => {
    const here = "chapter " + (ci + 1) + " (" + ch.id + ")";
    if (chapterIds.has(ch.id)) fail(dir + ": duplicate chapter id " + ch.id);
    chapterIds.add(ch.id);
    if (!REF.test(ch.source || "")) fail(dir + ": " + here + " has a bad Qur'an reference '" + ch.source + "'");
    if (!Array.isArray(ch.parent) || !ch.parent.length || ch.parent.some((p) => typeof p !== "string" || !p.trim())) fail(dir + ": " + here + " needs notes for parents");
    if (!Array.isArray(ch.steps) || !ch.steps.length) { fail(dir + ": " + here + " has no steps"); return; }

    const artCheck = (art, where) => {
      for (const s of art || []) {
        if (!Array.isArray(s) || typeof s[0] !== "string") { fail(dir + ": " + where + " has a malformed sprite"); continue; }
        if (s[0] !== "BARS" && s.slice(1, 4).some((n) => typeof n !== "number")) fail(dir + ": " + where + " sprite '" + s[0] + "' needs numeric x, y and size");
        if (s[0].startsWith("P:") && !people.has(s[0].slice(2))) fail(dir + ": " + where + " uses unknown person '" + s[0] + "'");
        if (s[0].startsWith("G:") && !groups.has(s[0].slice(2))) fail(dir + ": " + where + " uses unknown group '" + s[0] + "'");
      }
    };

    ch.steps.forEach((st, si) => {
      const where = here + " step " + (si + 1);
      if (!SCENES.has(st.scene)) fail(dir + ": " + where + " has unknown scene '" + st.scene + "'");
      if (st.say) { need(st.say, where); artCheck(st.art, where); return; }
      if (!st.play || !st.line) { fail(dir + ": " + where + " is neither narrated nor an activity"); return; }
      need(st.line, where);
      if (!activities.has(st.play)) fail(dir + ": " + where + " uses unknown activity '" + st.play + "'");
      const o = st.opts || {};
      if (o.wrong) need(o.wrong, where);
      if (o.nope) need(o.nope, where);
      artCheck(o.art, where);
      for (const p of o.pairs || []) { need(p.a, where); need(p.b, where); }
      for (const i of o.items || []) need(i.line, where);
      for (const c of o.cards || []) need(c.line, where);
      for (const n of o.owners || []) if (!people.has(n)) fail(dir + ": " + where + " uses unknown person '" + n + "'");
      if (st.play === "choice" && !(o.options || []).some((x) => x.ok)) fail(dir + ": " + where + " has no correct answer");
      if (st.play === "order" && (o.cards || []).length < 2) fail(dir + ": " + where + " needs at least two cards to order");
    });
  });
  if (ids.has("end-a")) used.add("end-a");

  for (const [line, mood] of Object.entries(moods)) {
    if (!ids.has(line)) fail(dir + "/story.js: music mood for '" + line + "', which is not a line in narration.json");
    if (!musicMoods.includes(mood)) fail(dir + "/story.js: '" + line + "' uses unknown music mood '" + mood + "'");
  }
  for (const id of ids) if (!used.has(id)) fail(narrationFile + ": line '" + id + "' is never used by the story");
}

/* ---------- pages ---------- */
function pages() {
  const out = ["index.html"];
  for (const d of ["games", "tools"]) {
    const base = path.join(ROOT, d);
    if (!fs.existsSync(base)) continue;
    for (const e of fs.readdirSync(base, { withFileTypes: true })) {
      if (e.isDirectory() && exists(d + "/" + e.name + "/index.html")) out.push(d + "/" + e.name + "/index.html");
    }
  }
  return out;
}
for (const page of pages()) {
  const html = read(page);
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) fail(page + ": loads fonts from Google (self-host them in fonts/ instead)");
  const base = path.dirname(page);
  for (const m of html.matchAll(/\b(?:src|href)="([^"#?]+)(?:[#?][^"]*)?"/g)) {
    const ref = m[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
    if (!fs.existsSync(path.join(ROOT, base, ref))) fail(page + ": links to '" + ref + "', which does not exist");
  }
}

/* ---------- the README must not point at things that are gone ---------- */
if (exists("README.md")) {
  const readme = read("README.md");
  for (const m of readme.matchAll(/\b((?:shared|scripts|fonts|icons)\/[A-Za-z0-9_.-]+\.(?:js|css|sh|json|woff2|png))\b/g)) {
    if (!exists(m[1])) fail("README.md: mentions '" + m[1] + "', which does not exist");
  }
}

/* ---------- offline ---------- */
if (exists("sw.js")) {
  const r = offline.isCurrent();
  if (!r.current) fail("sw.js: out of date. Run: node scripts/build-offline.js");
} else {
  fail("sw.js: missing");
}
for (const f of ["app.webmanifest", "shared/pwa.js", "fonts/fonts.css"]) if (!exists(f)) fail(f + ": missing");

/* ---------- report ---------- */
for (const w of warnings) console.warn("warning: " + w);
if (errors.length) {
  console.error("\n" + errors.length + " problem" + (errors.length === 1 ? "" : "s") + ":");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("✓ all checks passed (" + slugs.length + " games, " + warnings.length + " warnings)");
