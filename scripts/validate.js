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
// A game's pictures and sounds are on R2, not in git (scripts/SCALING.md): a file counts as present when it is on this
// computer or listed in the game's pack lists (packs/), which is where the site gets it from.
const LISTED = {};
for (const pk of Object.values(offline.readPacks())) for (const f of Object.keys(pk.files || {})) LISTED[f] = 1;
function filesIn(dir) {
  const out = new Set(fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)) : []);
  for (const f of Object.keys(LISTED)) if (f.startsWith(dir + "/") && !f.slice(dir.length + 1).includes("/")) out.add(f.slice(dir.length + 1));
  return [...out];
}

const ROOT = path.join(__dirname, "..");
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const json = (f) => { try { return JSON.parse(read(f)); } catch (e) { fail(f + ": not valid JSON (" + e.message + ")"); return null; } };

const REF = /^\d+:\d+(?:-\d+)?$/;
const SCENES = new Set(["night", "dusk", "desert", "well", "egypt", "palace", "prison", "field", "grey", "dawn", "river", "city", "fire", "mountain", "sea", "camp", "storm", "heaven", "garden", "village"]);

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

// The order of games inside a section. Prophets: the one who came first at the top, in the order below (the
// usual order in Sunni and Shia books of the prophets' stories; the place of a few, such as Ayyub, Dhul-Kifl and
// Yunus, is uncertain). Great Muslims: the one born first at the top ("born" in game.json, a year). Little ones:
// the easiest first ("level" in game.json, 1 = easiest). Games that can be played come first, in that order; the
// coming-soon games follow them, in the same order. See CLAUDE.md.
const PROPHETS = ["Adam", "Idris", "Nuh", "Hud", "Salih", "Ibrahim", "Lut", "Ismail", "Ishaq", "Yaqub", "Yusuf", "Ayyub",
  "Shuayb", "Musa", "Harun", "Dhul-Kifl", "Dawud", "Sulayman", "Ilyas", "Al-Yasa", "Yunus", "Zakariyya", "Yahya", "Isa", "Muhammad"];
const ORDER = {
  prophet: (g) => PROPHETS.indexOf(g.prophet),
  born: (g) => (typeof g.born === "number" ? g.born : -1),
  level: (g) => (typeof g.level === "number" ? g.level : -1)
};
for (const s of sections) {
  if (!s.order) continue;
  if (!ORDER[s.order]) { fail("manifest.json: section '" + s.title + "' has unknown order '" + s.order + "' (prophet, born or level)"); continue; }
  if (s.more !== undefined && (typeof s.more !== "string" || !s.more.trim())) fail("manifest.json: section '" + s.title + "': 'more' must be a short sentence");
  // games that can be played first, in the section's order; then the coming-soon ones, in the same order
  let last = -Infinity, lastSlug = null, inSoon = false;
  for (const slug of s.games) {
    const g = json("games/" + slug + "/game.json");
    if (!g) continue;
    const soon = g.status === "coming-soon";
    if (!soon && inSoon) { fail("manifest.json: in '" + s.title + "', " + slug + " can be played, so it must come before the coming-soon games (" + lastSlug + ")"); continue; }
    if (soon && !inSoon) { inSoon = true; last = -Infinity; }
    const k = ORDER[s.order](g);
    if (k < 0) { fail("games/" + slug + "/game.json: the section '" + s.title + "' is ordered by '" + s.order + "', so this game needs " + (s.order === "prophet" ? "\"prophet\": one of " + PROPHETS.join(", ") : "a number in \"" + s.order + "\"")); continue; }
    if (k < last) fail("manifest.json: in '" + s.title + "', " + slug + " must come before " + lastSlug + " (" + (s.order === "prophet" ? "the prophet who came first goes at the top" : s.order === "born" ? "the person born first goes at the top" : "the easiest game goes at the top") + ")");
    last = k; lastSlug = slug;
  }
}

let musicMoods = [], ambNames = [], sfxNames = [];
let LANG_NAMES = {};
const LF = require("./lang-files.js"), { needs } = require("./lang-strings.js");
try { LANG_NAMES = /names:\s*(\{[^}]*\})/.exec(read("shared/lang.js"))[1].replace(/(\w+):/g, '"$1":'); LANG_NAMES = JSON.parse(LANG_NAMES); } catch (e) { fail("shared/lang.js: could not read AsmauLang.names"); }
try { const m = load(["shared/music.js"]).AsmauMusic; musicMoods = m.moodNames; ambNames = m.ambNames; sfxNames = m.sfxNames; } catch (e) { fail("shared/music.js: failed to load (" + e.message + ")"); }

// the translations' folders (lang/README.md): one per language in shared/lang.js, its site.json, and a file per game
for (const code of LF.codes()) {
  const d = "lang/" + code;
  if (!LANG_NAMES[code]) fail(d + ": '" + code + "' is not in the languages of shared/lang.js (AsmauLang.names)");
  const site = json(d + "/site.json");
  if (!site) fail(d + "/site.json: missing (the words on every page)");
  else if (site.status !== "draft" && site.status !== "checked") fail(d + "/site.json: status must be \"draft\" or \"checked\"");
  for (const f of fs.readdirSync(path.join(ROOT, d))) {
    if (f === "site.json" || f === "README.md") continue;
    if (!/\.json$/.test(f)) { fail(d + "/" + f + ": only <game>.json files and site.json belong here"); continue; }
    if (!slugs.includes(f.slice(0, -5))) fail(d + "/" + f + ": no game called '" + f.slice(0, -5) + "' in manifest.json");
    else { const t = json(d + "/" + f); if (t && t.status === "checked" && site && site.status !== "checked") fail(d + "/" + f + ": checked, but " + d + "/site.json is still a draft"); }
  }
}

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
  const byId = Object.fromEntries(lines.filter((l) => l && l.id).map((l) => [l.id, l]));
  const audioDir = dir + "/assets/audio";
  const audio = filesIn(audioDir);
  for (const l of lines) {
    if (!l || typeof l.id !== "string" || !/^[a-z0-9-]+$/.test(l.id)) { fail(narrationFile + ": bad id " + JSON.stringify(l && l.id)); continue; }
    if (ids.has(l.id)) fail(narrationFile + ": duplicate id '" + l.id + "'");
    ids.add(l.id);
    if (typeof l.text !== "string" || !l.text.trim()) fail(narrationFile + ": '" + l.id + "' has no text");
    // one page, one idea: a long line is better as two pages, or a page and an activity
    else if (l.text.length > 230) warn(narrationFile + ": '" + l.id + "' is " + l.text.length + " characters; split it into two pages (or a page and an activity)");
    if (l.lang !== "en" && l.lang !== "ar") fail(narrationFile + ": '" + l.id + "' lang must be 'en' or 'ar'");
    if (l.lang === "en" && !audio.includes(l.id + ".mp3")) {
      fail(audioDir + "/" + l.id + ".mp3: missing (run scripts/generate-placeholder-audio.sh " + dir + ")");
    }
  }
  for (const f of audio) {
    const id = f.replace(/\.(mp3|webm|ogg|m4a)$/, "");
    if (!ids.has(id)) fail(audioDir + "/" + f + ": no line '" + id + "' in narration.json (orphaned audio)");
  }
  // the man's voice (assets/audio-m, chosen by families in For parents > Your voice): every line a man's clip too
  const manDir = dir + "/assets/audio-m";
  const man = filesIn(manDir);
  const noMan = lines.filter((l) => l && l.id && !man.includes(l.id + ".mp3")).map((l) => l.id);
  if (noMan.length) fail(manDir + ": " + noMan.length + " lines have no clip in the man's voice (VOICE=m PROJECT=asmau-assets python3 scripts/generate-voice-gemini.py " + dir + "), e.g. " + noMan.slice(0, 3).join(", "));
  for (const f of man) if (!ids.has(f.replace(/\.mp3$/, ""))) fail(manDir + "/" + f + ": no line in narration.json (orphaned audio)");

  // translations (shared/lang.js, lang/README.md): lang/<code>/<slug>.json. A draft may be incomplete; a "checked" one
  // (shown to families) must have every line, label and title; its voices are optional.
  for (const code of LF.langsOfGame(slug)) {
    const lf = LF.rel(LF.gameFile(code, slug)), t = json(lf); if (!t) continue;
    if (t.status !== "draft" && t.status !== "checked") fail(lf + ": status must be \"draft\" or \"checked\" (checked by a native speaker)");
    for (const [id, v] of Object.entries(t.lines || {})) {
      if (!ids.has(id)) { fail(lf + ": line '" + id + "' is not in narration.json"); continue; }
      if (v !== null && typeof v === "object" && typeof v.t !== "string") fail(lf + ": line '" + id + "' needs \"t\", its translation (\"\" until it is written)");
    }
    // a line translated from English that has changed since: it may need a new translation
    const stale = Object.entries(t.lines || {}).filter(([id, v]) => v && typeof v === "object" && v.en && byId[id] && v.en !== byId[id].text).map(([id]) => id);
    if (stale.length) warn(lf + ": the English of " + stale.length + " lines changed since they were translated (node scripts/lang-strings.js " + slug + " " + code + "), e.g. " + stale.slice(0, 3).join(", "));
    // its computer voices ("voices": ["w", "m"], one of them, or none): a translation may go live without any
    // (owner, 21 November 2026); a voice it lists must read every line
    if (t.voices !== undefined && (!Array.isArray(t.voices) || t.voices.some((v) => v !== "w" && v !== "m"))) fail(lf + ": voices must be a list of \"w\" (Aunty Salma) and/or \"m\" (Uncle Sani)");
    for (const v of Array.isArray(t.voices) ? t.voices : []) {
      const ad = dir + "/assets/audio-" + code + (v === "m" ? "-m" : ""), have = filesIn(ad);
      const miss = lines.filter((l) => l && l.id && l.lang !== "ar" && !have.includes(l.id + ".mp3")).map((l) => l.id);
      if (miss.length) fail(ad + ": " + lf + " lists the voice \"" + v + "\", but " + miss.length + " lines have no clip (STORY_LANG=" + code + (v === "m" ? " VOICE=m" : "") + " PROJECT=asmau-assets python3 scripts/generate-voice-gemini.py " + dir + ")");
    }
    if (t.status !== "checked") continue;
    const n = needs(slug), shared = json(LF.rel(LF.siteFile(code))) || {};
    const pats = Object.keys(shared).filter((k) => k.startsWith("re:")).map((k) => new RegExp(k.slice(3)));
    const noLine = n.lines.filter((id) => !LF.lineText((t.lines || {})[id]));
    const noStr = n.strings.filter((x) => !(t.strings || {})[x] && !shared[x] && !pats.some((r) => r.test(x)));
    if (noLine.length + noStr.length) fail(lf + ": checked, but " + noLine.length + " lines and " + noStr.length + " labels are not translated (node scripts/lang-strings.js " + slug + " " + code + ")");
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
    // a chapter is either from the Qur'an (source: "12:4-6") or from history (cite: where its facts come from)
    if (ch.source === undefined && typeof ch.cite === "string" && ch.cite.trim()) { /* a history chapter */ }
    else if (!REF.test(ch.source || "")) fail(dir + ": " + here + " has a bad Qur'an reference '" + ch.source + "' (or give a 'cite' for a chapter from history)");
    for (const r of ch.more || []) if (!REF.test(r)) fail(dir + ": " + here + " has a bad Qur'an reference '" + r + "' in 'more'");
    // the parents' notes are plain text files, one per page (games/<slug>/parents/<n>/<n>.<page>.md), editable on GitHub
    if (ch.parent !== undefined) fail(dir + ": " + here + " still has its notes inside story.js; they belong in parents/" + (ci + 1) + "/");
    const notes = require("./parent-notes").read(dir, ci + 1);
    if (!notes || !notes.length) fail(dir + "/parents/" + (ci + 1) + "/: no notes for parents on any page of this chapter");
    if (!Array.isArray(ch.steps) || !ch.steps.length) { fail(dir + ": " + here + " has no steps"); return; }

    const artCheck = (art, where) => {
      for (const s of art || []) {
        if (!Array.isArray(s) || typeof s[0] !== "string") { fail(dir + ": " + where + " has a malformed sprite"); continue; }
        if (s[0] !== "BARS" && s.slice(1, 4).some((n) => typeof n !== "number")) fail(dir + ": " + where + " sprite '" + s[0] + "' needs numeric x, y and size");
        if (s[0].startsWith("P:") && !people.has(s[0].slice(2))) fail(dir + ": " + where + " uses unknown person '" + s[0] + "'");
        if (s[0].startsWith("G:") && !groups.has(s[0].slice(2))) fail(dir + ": " + where + " uses unknown group '" + s[0] + "'");
      }
    };

    // a page that opens with "he" or "she" where the child cannot know who that is: the first page of a chapter, or the
    // page after an activity (owner's note, Umm Ayman 10.2: "she" could be Umm Ayman or Fatimah). Name the person.
    const lineText = (id) => { const l = lines.find((x) => x.id === id); return l ? l.text : ""; };
    ch.steps.forEach((st, si) => {
      if (!st.say || (si > 0 && ch.steps[si - 1].say)) return;
      const m = /^(He|She|They|His|Her|Him|Their)\b/.exec(lineText(st.say));
      if (m) warn(dir + ": " + here + " page " + (ci + 1) + "." + (si + 1) + " ('" + st.say + "') starts with '" + m[1] + "' " +
        (si ? "right after an activity" : "at the start of a chapter") + ": say who it is");
    });

    ch.steps.forEach((st, si) => {
      const where = here + " step " + (si + 1);
      if (!SCENES.has(st.scene)) fail(dir + ": " + where + " has unknown scene '" + st.scene + "'");
      if (st.amb && st.amb !== "none" && !ambNames.includes(st.amb)) fail(dir + ": " + where + " uses unknown background sound '" + st.amb + "'");
      if (st.cue && !sfxNames.includes(st.cue)) fail(dir + ": " + where + " uses unknown sound effect '" + st.cue + "'");
      // every narrated page has a picture of its own: showing another page's picture makes the story feel
      // stuck or confusing (a page about the brothers showing the dream). Draw the page its own picture.
      if (st.say) { need(st.say, where); artCheck(st.art, where); artCheck(st.over, where); if (st.pic) fail(dir + ": " + where + " ('" + st.say + "') shows the picture of '" + st.pic + "'; every page needs its own picture"); return; }
      if (!st.play || !st.line) { fail(dir + ": " + where + " is neither narrated nor an activity"); return; }
      need(st.line, where);
      if (!activities.has(st.play)) fail(dir + ": " + where + " uses unknown activity '" + st.play + "'");
      // an activity may play over a picture from its own chapter, not one from another part of the story
      if (st.opts && st.opts.img && !st.opts.img.startsWith(ch.id + "-")) fail(dir + ": " + where + " plays over '" + st.opts.img + "', a picture from another chapter");
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
    const files = filesIn(imgDir);
    const bgs = new Set();
    // pictures used as icons ("img:<key>") anywhere in the story's activities
    const imgIcons = new Set((JSON.stringify(story).match(/"img:[A-Za-z0-9_-]+"/g) || []).map((s) => s.slice(5, -1)));
    for (const k of imgIcons) if (!art[k]) fail(dir + ": an activity uses the picture 'img:" + k + "', which is not in art.js");
    story.forEach((ch) => ch.steps.forEach((st) => {
      if (st.play) { bgs.add("bg-" + st.scene); if (st.opts && st.opts.bg) bgs.add(st.opts.bg); if (st.opts && st.opts.img) bgs.add(st.opts.img); }
    }));
    for (const [key, alt] of Object.entries(art)) {
      if (!files.includes(key + ".webp")) fail(imgDir + "/" + key + ".webp: listed in art.js but missing");
      if (typeof alt !== "string" || !alt.trim()) fail(dir + "/art.js: '" + key + "' needs a description (it is the picture's alt text)");
      const known = ids.has(key) || bgs.has(key) || (key.startsWith("p-") && people.has(key.slice(2))) || imgIcons.has(key);
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

/* ---------- parents' notes: one file per page, kept with its page ---------- */
{
  const PN = require("./parent-notes");
  for (const dir of PN.games()) {
    const c = PN.sync(dir, false);
    if (c.length) fail(dir + "/parents: out of step with the story (" + c.slice(0, 3).join("; ") + "). Run: node scripts/build-offline.js");
    for (const r of PN.removed(dir)) warn(dir + "/parents/" + r + ": a note whose page was removed; move its text to another page or delete it");
    const d = PN.drafts(dir); if (d.length) console.log("note: " + dir + "/parents: " + d.length + " draft notes waiting to be read (not shown in the game)");
  }
}

/* ---------- offline ---------- */
if (exists("sw.js")) {
  const r = offline.isCurrent();
  // a pull request (--pull-request) is not asked to rebuild the offline lists: the next release does (lang/README.md)
  if (!r.current) (process.argv.includes("--pull-request") ? warn : fail)("sw.js: out of date. Run: node scripts/build-offline.js");
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
