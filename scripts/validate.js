#!/usr/bin/env node
/*
  Checks the whole site for the mistakes that are easy to make and hard to see.
  Plain Node, no dependencies:   node scripts/validate.js

  - every game in manifest.json has a folder, an index.html and valid game.json
  - narration ids are unique, every English line has audio, no audio is orphaned
  - every line a story points at exists, and every narration line is used
  - every person, activity and music mood a story names exists
  - every picture in art.js exists and is used, and no picture is unlisted
  - Qur'an references look like references
  - pages only load local files that exist, and nothing loads from Google
  - the README only names files that exist
  - sw.js lists exactly the files in the repo (scripts/build-offline.js)
  - version.json is well formed (warns when there are changes since the last release)
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
const SCENES = new Set(["night", "dusk", "desert", "well", "egypt", "palace", "prison", "field", "grey", "dawn", "river", "city", "fire", "mountain", "sea", "camp", "storm"]);

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
// manifest.json lists sections, each with a title and its games in display order
const sections = (manifest && manifest.sections) || [];
if (!Array.isArray(sections) || !sections.length) fail("manifest.json: needs 'sections', each with a title and a list of games");
for (const s of sections) {
  if (!s || typeof s.title !== "string" || !s.title.trim()) fail("manifest.json: every section needs a title");
  if (!s || !Array.isArray(s.games)) fail("manifest.json: section '" + (s && s.title) + "' needs a list of games");
}
const slugs = sections.reduce((all, s) => all.concat((s && s.games) || []), []);
if (!slugs.length) fail("manifest.json: no games listed");
if (new Set(slugs).size !== slugs.length) fail("manifest.json: a game is listed twice");

let musicMoods = [], ambNames = [], sfxNames = [];
try { const m = load(["shared/music.js"]).AsmauMusic; musicMoods = m.moodNames; ambNames = m.ambNames; sfxNames = m.sfxNames; } catch (e) { fail("shared/music.js: failed to load (" + e.message + ")"); }

for (const slug of slugs) {
  const dir = "games/" + slug;
  if (!fs.existsSync(path.join(ROOT, dir))) { fail(dir + ": listed in manifest.json but the folder is missing"); continue; }
  const g = json(dir + "/game.json");
  // a game that is only announced has a card on the landing page and nothing to open yet
  if (!exists(dir + "/index.html") && !(g && g.status === "coming-soon")) fail(dir + "/index.html: missing");
  if (g) {
    if (g.slug !== slug) fail(dir + "/game.json: slug is '" + g.slug + "', expected '" + slug + "'");
    for (const k of ["title", "icon", "tagline", "depictionNotes"]) {
      if (typeof g[k] !== "string" || !g[k].trim()) fail(dir + "/game.json: '" + k + "' is missing");
    }
    if (typeof g.minAge !== "number" || typeof g.maxAge !== "number") fail(dir + "/game.json: minAge and maxAge must be numbers (every game states its age range)");
    else if (g.minAge > g.maxAge) fail(dir + "/game.json: minAge is above maxAge");
    if (g.ageNote !== undefined && (typeof g.ageNote !== "string" || !g.ageNote.trim())) fail(dir + "/game.json: ageNote, if present, must be a short sentence");
    if (g.status !== undefined && g.status !== "coming-soon") fail(dir + "/game.json: status, if present, must be 'coming-soon'");
    if (g.cover !== undefined) {
      if (!exists(dir + "/" + g.cover)) fail(dir + "/game.json: cover '" + g.cover + "' does not exist");
      if (typeof g.coverAlt !== "string" || !g.coverAlt.trim()) fail(dir + "/game.json: a cover needs coverAlt, a description of the picture");
    }
    if (g.basedOn !== null && g.basedOn !== undefined && !/^Surah .+, \d+:\d+(?:-\d+)?(?:, with .+)?$/.test(g.basedOn)) {
      fail(dir + "/game.json: basedOn should be null or look like 'Surah Yusuf, 12:4-101' (then, if needed, ', with ...')");
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
    if (l.lang === "en" && !audio.includes(l.id + ".mp3")) {
      fail(audioDir + "/" + l.id + ".mp3: missing (run scripts/generate-placeholder-audio.sh " + dir + ")");
    }
  }
  for (const f of audio) {
    const id = f.replace(/\.(mp3|webm|ogg|m4a)$/, "");
    if (!ids.has(id)) fail(audioDir + "/" + f + ": no line '" + id + "' in narration.json (orphaned audio)");
  }

  /* ---------- a story, if the game has one ---------- */
  if (!exists(dir + "/story.js")) continue;
  const w = load([dir + "/game.js", "shared/people.js", dir + "/people.js", dir + "/story.js"].filter(exists));
  const story = w.STORY, moods = w.STORY_MOODS || {};
  const cfg = w.STORY_GAME || {};
  if (cfg.slug !== slug) fail(dir + "/game.js: STORY_GAME.slug must be '" + slug + "'");
  const people = new Set((w.STORY_PEOPLE && w.STORY_PEOPLE.names) || []);
  for (const k of ["heroChild", "heroAdult"]) if (cfg[k] && !people.has(cfg[k])) fail(dir + "/game.js: " + k + " '" + cfg[k] + "' is not in people.js");
  const gameSrc = read("shared/story-engine.js");
  const activities = new Set([...gameSrc.matchAll(/ACT(?:\.(\w+)|\["(\w+)"\])\s*=/g)].map((m) => m[1] || m[2]));
  const groups = new Set(Object.keys(cfg.groups || {}));
  for (const [g, members] of Object.entries(cfg.groups || {})) for (const n of members) if (!people.has(n)) fail(dir + "/game.js: group '" + g + "' names unknown person '" + n + "'");
  const used = new Set();
  const need = (id, where) => { used.add(id); if (!ids.has(id)) fail(dir + ": " + where + " uses line '" + id + "', which is not in narration.json"); };

  if (!Array.isArray(story) || !story.length) { fail(dir + "/story.js: no chapters"); continue; }
  const chapterIds = new Set();
  const puzzles = [];
  story.forEach((ch, ci) => {
    const here = "chapter " + (ci + 1) + " (" + ch.id + ")";
    if (chapterIds.has(ch.id)) fail(dir + ": duplicate chapter id " + ch.id);
    chapterIds.add(ch.id);
    if (!REF.test(ch.source || "")) fail(dir + ": " + here + " has a bad Qur'an reference '" + ch.source + "'");
    for (const r of ch.more || []) if (!REF.test(r)) fail(dir + ": " + here + " has a bad Qur'an reference '" + r + "' in 'more'");
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
      if (st.amb && st.amb !== "none" && !ambNames.includes(st.amb)) fail(dir + ": " + where + " uses unknown background sound '" + st.amb + "'");
      if (st.cue && !sfxNames.includes(st.cue)) fail(dir + ": " + where + " uses unknown sound effect '" + st.cue + "'");
      if (st.say) { need(st.say, where); artCheck(st.art, where); artCheck(st.over, where); if (st.pic && !ids.has(st.pic)) fail(dir + ": " + where + " borrows the picture of '" + st.pic + "', which is not a line"); return; }
      if (!st.play || !st.line) { fail(dir + ": " + where + " is neither narrated nor an activity"); return; }
      need(st.line, where);
      if (!activities.has(st.play)) fail(dir + ": " + where + " uses unknown activity '" + st.play + "'");
      const o = st.opts || {};
      if (o.wrong) need(o.wrong, where);
      if (o.nope) need(o.nope, where);
      if (o.after) need(o.after, where);
      artCheck(o.art, where);
      artCheck(st.over, where);
      for (const p of o.pairs || []) { need(p.a, where); need(p.b, where); }
      for (const i of o.items || []) if (st.play !== "pick") need(i.line, where);
      for (const c of o.cards || []) need(c.line, where);
      for (const s of o.states || []) if (s.line) need(s.line, where);
      if (st.play === "change" && (o.states || []).length < 2) fail(dir + ": " + where + " needs at least two states to change between");
      for (const n of o.owners || []) if (!people.has(n)) fail(dir + ": " + where + " uses unknown person '" + n + "'");
      if (st.play === "choice" && !(o.options || []).some((x) => x.ok)) fail(dir + ": " + where + " has no correct answer");
      // a child who cannot read must be able to hear every answer: each one has a spoken line
      if (st.play === "choice") (o.options || []).forEach((x, i) => need(st.line + "-opt" + (i + 1), where + " option " + (i + 1)));
      if (st.play === "sort") {
        (o.bins || []).forEach((x, i) => need(st.line + "-bin" + (i + 1), where + " bin " + (i + 1)));
        (o.things || []).forEach((x, i) => need(st.line + "-it" + (i + 1), where + " item " + (i + 1)));
      }
      if (st.play === "puzzle") puzzles.push([o.pic, where]);
      if (st.play === "memory" && (o.icons || []).length < 2) fail(dir + ": " + where + " needs at least two pairs");
      if (st.play === "pick" && !(o.items || []).some((x) => x.ok && x.n > 0)) fail(dir + ": " + where + " has nothing to find");
      if (st.play === "sort" && (!(o.things || []).length || (o.bins || []).length !== 2 || o.things.some((x) => x.bin !== 0 && x.bin !== 1))) fail(dir + ": " + where + " needs two bins and things that each belong to one");
      if (st.play === "order" && (o.cards || []).length < 2) fail(dir + ": " + where + " needs at least two cards to order");
    });
  });
  if (ids.has("end-a")) used.add("end-a");

  for (const [line, mood] of Object.entries(moods)) {
    if (!ids.has(line)) fail(dir + "/story.js: music mood for '" + line + "', which is not a line in narration.json");
    if (!musicMoods.includes(mood)) fail(dir + "/story.js: '" + line + "' uses unknown music mood '" + mood + "'");
  }
  for (const id of ids) if (!used.has(id)) fail(narrationFile + ": line '" + id + "' is never used by the story");

  /* ---------- pictures (art.js), if the game has them ---------- */
  if (exists(dir + "/art.js")) {
    let art = {};
    try { art = load([dir + "/art.js"]).STORY_ART || {}; } catch (e) { fail(dir + "/art.js: failed to load (" + e.message + ")"); }
    const imgDir = dir + "/assets/img";
    const files = fs.existsSync(path.join(ROOT, imgDir)) ? fs.readdirSync(path.join(ROOT, imgDir)) : [];
    const bgs = new Set();
    story.forEach((ch) => ch.steps.forEach((st) => {
      if (st.play) { bgs.add("bg-" + st.scene); if (st.opts && st.opts.bg) bgs.add(st.opts.bg); if (st.opts && st.opts.img) bgs.add(st.opts.img); }
    }));
    for (const [key, alt] of Object.entries(art)) {
      if (!files.includes(key + ".webp")) fail(imgDir + "/" + key + ".webp: listed in art.js but missing");
      if (typeof alt !== "string" || !alt.trim()) fail(dir + "/art.js: '" + key + "' needs a description (it is the picture's alt text)");
      const known = ids.has(key) || bgs.has(key) || (key.startsWith("p-") && people.has(key.slice(2)));
      if (!known) fail(dir + "/art.js: '" + key + "' is not a line id, a backdrop an activity uses, or a person");
    }
    for (const [pic, where] of puzzles) if (!art[pic]) fail(dir + ": " + where + " is a puzzle of '" + pic + "', which is not a picture in art.js");
    for (const f of files) {
      if (!art[f.replace(/\.webp$/, "")]) fail(imgDir + "/" + f + ": not listed in art.js (run the game's picture script, scripts/<game>-art/build.py)");
    }
  }
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
for (const page of pages().concat(exists("privacy.html") ? ["privacy.html"] : [])) {
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

/* ---------- versions ---------- */
if (exists("version.json")) {
  const ver = json("version.json");
  if (ver) {
    if (!/^\d{4}\.\d{2}\.\d+$/.test(ver.version || "")) fail("version.json: version must look like 2026.11.1");
    if (!Array.isArray(ver.notes) || !ver.notes.length) fail("version.json: the current release needs notes");
    if (!Array.isArray(ver.history) || !ver.history.length || ver.history[0].version !== ver.version) fail("version.json: history must start with the current version");
    const now = offline.compute().build;
    if (ver.buildId !== now) warn("version.json: the site has changed since release " + ver.version + ". Run: node scripts/release.js \"what changed\"");
  }
} else {
  fail("version.json: missing");
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
