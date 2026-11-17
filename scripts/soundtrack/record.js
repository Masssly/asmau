#!/usr/bin/env node
/*
  The Asmau soundtrack: the games' music, recorded as tracks of their own (owner's idea, 17 November 2026: like the
  theme music of games that becomes a soundtrack). The games compose their music live (shared/music.js); this records
  each mood with that same engine in an offline audio context, so the tracks are exactly the music of the games.

    node scripts/soundtrack/record.js <plan.json> <out-folder>   record every track of a plan
  Plans: scripts/soundtrack/plan.json (Music from the Games: one track per mood, and the suite) and
  scripts/soundtrack/games/<slug>.json (one album per game: its music in the order the game plays it; written by
  scripts/soundtrack/games.js). Writes <n>-<name>.wav (48 kHz). Then scripts/soundtrack/finish.py fades, levels and
  encodes them, and publishes them to R2 (scripts/soundtrack/README.md).
*/
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const { serve } = require("../../tests/lib");
const ROOT = path.join(__dirname, "..", "..");
if (process.argv.length < 4) { console.error("usage: node scripts/soundtrack/record.js <plan.json> <out-folder>"); process.exit(2); }
const plan = JSON.parse(fs.readFileSync(path.resolve(process.argv[2]), "utf8"));
const OUT = path.resolve(process.argv[3]);
const SR = 48000;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const site = await serve(ROOT), browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(site.url + "privacy.html");
  await page.addScriptTag({ url: site.url + "shared/music.js" });
  for (const [i, t] of plan.tracks.entries()) {
    const file = String(i + 1).padStart(2, "0") + "-" + t.file;
    // render in the page: a list of [mood, from-second] (one for a single mood, several for the suite)
    const b64 = await page.evaluate(async ({ parts, seconds, SR }) => {
      const oc = new OfflineAudioContext(1, Math.ceil(SR * seconds), SR);
      const out = oc.createGain(); out.connect(oc.destination);
      let clock = 0;
      // the engine tidies a finished mood away after 1.5 s of real time; an offline render runs faster than real
      // time, so hold that tidying until the track is rendered (the old mood has faded to nothing by then anyway)
      const realTimeout = window.setTimeout;
      window.setTimeout = () => 0;
      const eng = window.AsmauMusic._engine(oc, out, () => clock);
      parts.forEach(([mood, from], k) => {
        clock = from; eng.setMood(mood); eng.setTension(0);
        const until = k + 1 < parts.length ? parts[k + 1][1] : seconds;
        // the engine schedules at most 400 steps a call (it is meant to run a little ahead of the clock): go in steps
        for (let t = from + 2; ; t += 2) { clock = Math.min(t, until) - 2; eng.scheduleUntil(Math.min(t, until)); if (t >= until) break; }
      });
      const d = (await oc.startRendering()).getChannelData(0);
      window.setTimeout = realTimeout;
      const pcm = new Int16Array(d.length);
      for (let i = 0; i < d.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(d[i] * 32767)));
      // to base64 in chunks (a long track does not fit in one string call)
      const bytes = new Uint8Array(pcm.buffer); let s = "";
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(s);
    }, { parts: t.parts, seconds: t.seconds, SR });
    const pcm = Buffer.from(b64, "base64");
    const head = Buffer.alloc(44);
    head.write("RIFF", 0); head.writeUInt32LE(36 + pcm.length, 4); head.write("WAVE", 8); head.write("fmt ", 12);
    head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20); head.writeUInt16LE(1, 22); head.writeUInt32LE(SR, 24);
    head.writeUInt32LE(SR * 2, 28); head.writeUInt16LE(2, 32); head.writeUInt16LE(16, 34); head.write("data", 36); head.writeUInt32LE(pcm.length, 40);
    fs.writeFileSync(path.join(OUT, file + ".wav"), Buffer.concat([head, pcm]));
    console.log(file + ": " + t.seconds + " s");
  }
  await browser.close(); await site.close();
})();
