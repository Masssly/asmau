#!/usr/bin/env node
/*
  One soundtrack album per game: its music in the order the game plays it (owner, 17 November 2026: "all the games'
  soundtracks"). Every game's music comes from the moods in shared/music.js; a game's own soundtrack is those moods in
  the order its story plays them: the title, one track per chapter (the moods of its pages one after another, each as
  long as its pages take), and the end.

    node scripts/soundtrack/games.js        write scripts/soundtrack/games/<slug>.json for every game with music

  Then record and finish each (scripts/soundtrack/README.md).
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..", ".."), OUT = path.join(__dirname, "games");
const PAGE = 15, MIN = 60, MAX = 120, EDGE = 60;            // seconds: per page, per chapter track, title and end
const engine = fs.readFileSync(path.join(ROOT, "shared", "story-engine.js"), "utf8");
const SCENE_MOOD = vm.runInNewContext("(" + /var SCENE_MOOD = merge\((\{[^}]*\})/.exec(engine)[1] + ")");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const slugs = manifest.sections.flatMap((s) => s.games);
fs.mkdirSync(OUT, { recursive: true });

const fileOf = (s) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
for (const slug of slugs) {
  const dir = path.join(ROOT, "games", slug), game = JSON.parse(fs.readFileSync(path.join(dir, "game.json"), "utf8"));
  const box = { window: {} }; vm.createContext(box);
  // a story game's data files only (other games' code needs a page to run in: they are read as text below)
  if (fs.existsSync(path.join(dir, "story.js"))) for (const f of ["game.js", "story.js"]) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), box);
  const G = box.window.STORY_GAME, S = box.window.STORY, MO = box.window.STORY_MOODS || {};
  const tracks = [];
  if (G && S) {
    const sceneMood = Object.assign({}, SCENE_MOOD, G.sceneMood || {});
    const moodOf = (st) => MO[st.say || st.line] || sceneMood[st.scene] || "wonder";
    tracks.push({ file: "title", mood: G.titleMood || "wonder", title: game.title + ": Title", seconds: EDGE, parts: [[G.titleMood || "wonder", 0]] });
    S.forEach((ch, ci) => {
      // runs of the same mood, page by page, each as long as its pages; then stretched or squeezed to fit the track
      const runs = [];
      ch.steps.forEach((st) => { const m = moodOf(st); if (runs.length && runs[runs.length - 1][0] === m) runs[runs.length - 1][1] += PAGE; else runs.push([m, PAGE]); });
      const total = runs.reduce((a, r) => a + r[1], 0), secs = Math.max(MIN, Math.min(MAX, total)), k = secs / total;
      let t = 0; const parts = runs.map(([m, d]) => { const p = [m, Math.round(t)]; t += d * k; return p; });
      tracks.push({ file: "chapter-" + (ci + 1) + "-" + fileOf(ch.title), mood: [...new Set(runs.map((r) => r[0]))].join(" "),
        title: "Chapter " + (ci + 1) + ": " + ch.title, seconds: secs, parts });
    });
    tracks.push({ file: "the-end", mood: G.endMood || "joy", title: game.title + ": The End", seconds: EDGE, parts: [[G.endMood || "joy", 0]] });
  } else {
    // a game without a story: the moods its code asks for
    const src = ["game.js", "index.html"].map((f) => fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), "utf8") : "").join("\n");
    const moods = [...new Set((src.match(/mood\(\s*"([a-z]+)"/g) || []).map((m) => /"([a-z]+)"/.exec(m)[1]))];
    moods.forEach((m) => tracks.push({ file: m, mood: m, title: game.title, seconds: 90, parts: [[m, 0]] }));
  }
  if (!tracks.length) { console.log(slug + ": no music, no album"); continue; }
  tracks.forEach((t) => { t.heard = [game.title]; });
  const plan = { album: game.title + ": Music from the Game", artist: "Asmau", year: 2026, prefix: "soundtrack/games/" + slug + "/", out: slug + ".tracks.json", tracks };
  fs.writeFileSync(path.join(OUT, slug + ".json"), JSON.stringify(plan, null, 1) + "\n");
  console.log(slug + ": " + tracks.length + " tracks, " + Math.round(tracks.reduce((a, t) => a + t.seconds, 0) / 60) + " min");
}
