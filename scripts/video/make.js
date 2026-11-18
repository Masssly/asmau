#!/usr/bin/env node
/*
  Trailers and Shorts from a game's own pictures, voice and music (for YouTube and the other accounts; brand/SOCIAL.md).
    NODE_PATH=$(npm root -g) node scripts/video/make.js <slug> [trailer|short]
  Writes scripts/video/out/<slug>-trailer.mp4 (1920x1080) and <slug>-short.mp4 (1080x1920). Needs the game's media
  (node scripts/fetch-media.js) and ffmpeg. Each scene: the picture whole (never cropped, so no one is cut off), its line
  as a caption, read by the default voice; the game's title music quietly underneath.
*/
"use strict";
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(__dirname, "out");
const plans = JSON.parse(fs.readFileSync(path.join(__dirname, "plans.json"), "utf8"));
const slug = process.argv[2], kinds = process.argv[3] ? [process.argv[3]] : ["trailer", "short"];
const plan = plans[slug]; if (!plan) { console.error("no plan for " + slug); process.exit(1); }
// the voice read a little faster than in the game (pitch kept), so a trailer stays short
const SPEED = plan.speed || plans._speed || 1.15;
const G = path.join(ROOT, "games", slug);
const lines = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(G, "narration.json"), "utf8")).map((l) => [l.id, l.text]));
const url = (p) => "file://" + p;
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const LOCKUP = "data:image/svg+xml;base64," + Buffer.from(fs.readFileSync(path.join(ROOT, "brand/kit/lockup/lockup-dark.svg"), "utf8")
  .replace('<rect width="1200" height="360" fill="#0c1530"/>', "")).toString("base64");
// plain drawings of a phone, a tablet and a laptop (no company logos: the store apps are not out yet)
const ICON = (d) => `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const DEVICES = ICON('<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>') + ICON('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M11 18h2"/>') +
  ICON('<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>');
const devices = (size) => `<div style="display:flex;align-items:center;gap:${size * 0.5}px;font-size:${size}px;opacity:.92"><span style="display:flex;gap:${size * 0.25}px;color:#f0b84b;font-size:${size * 1.25}px">${DEVICES}</span>Plays on iPhone, iPad, Android and computers</div>`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const CSS = `<style>
  @font-face { font-family: Baloo; src: url(${url(path.join(ROOT, "fonts/baloo2-latin.woff2"))}); font-weight: 400 800; }
  @font-face { font-family: Mada; src: url(${url(path.join(ROOT, "fonts/mada-latin.woff2"))}); font-weight: 200 900; }
  * { box-sizing: border-box; margin: 0; }
  body { width: var(--w); height: var(--h); overflow: hidden; color: #fdf6e8; font-family: Mada, sans-serif; position: relative;
         background: linear-gradient(160deg, #1c2d5e 0%, #0c1530 70%); }
  .blur { position: absolute; inset: -40px; background-size: cover; background-position: center; filter: blur(40px) brightness(.45); }
  .pic { position: absolute; border-radius: 22px; box-shadow: 0 18px 50px rgba(0,0,0,.55); }
  .cap { position: absolute; font-weight: 600; line-height: 1.32; text-shadow: 0 2px 8px rgba(0,0,0,.6); }
  .disp { font-family: Baloo, sans-serif; font-weight: 700; line-height: 1.05; }
  .gold { color: #f0b84b; }
</style>`;

function scene(kind, img, text) {
  const wide = kind === "trailer", W = wide ? 1920 : 1080, H = wide ? 1080 : 1920;
  const bg = `<div class="blur" style="background-image:url('${url(img)}')"></div>`;
  if (wide) return `${CSS}<body style="--w:${W}px;--h:${H}px">${bg}
    <img class="pic" src="${url(img)}" style="left:70px;top:70px;width:940px;height:940px">
    <div class="cap" style="left:1080px;top:0;bottom:0;width:770px;display:flex;align-items:center;font-size:${text.length > 130 ? 46 : 52}px">${esc(text)}</div>
    <div style="position:absolute;left:1080px;right:60px;bottom:44px;display:flex;align-items:center;justify-content:space-between">
      <img src="${LOCKUP}" style="height:80px"><div class="disp gold" style="font-size:52px">asmau.org</div></div></body>`;
  return `${CSS}<body style="--w:${W}px;--h:${H}px">${bg}
    <img src="${LOCKUP}" style="position:absolute;left:60px;top:110px;height:110px">
    <img class="pic" src="${url(img)}" style="left:40px;top:300px;width:1000px;height:1000px">
    <div class="cap" style="left:60px;right:60px;top:1350px;font-size:${text.length > 130 ? 48 : 54}px">${esc(text)}</div>
    <div class="disp gold" style="position:absolute;left:0;right:0;bottom:120px;text-align:center;font-size:72px">asmau.org</div></body>`;
}
function card(kind, end) {
  const wide = kind === "trailer", W = wide ? 1920 : 1080, H = wide ? 1080 : 1920;
  return `${CSS}<body style="--w:${W}px;--h:${H}px"><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;text-align:center;padding:60px">
    <img src="${LOCKUP}" style="height:${wide ? 200 : 220}px">
    ${end ? `<div class="disp" style="font-size:${wide ? 84 : 92}px">Play it free at<br><span class="gold">asmau.org</span></div>
             <div style="font-size:${wide ? 40 : 46}px;opacity:.9">No adverts · no account · nothing to buy. Ever.</div>
             ${devices(wide ? 38 : 40)}`
          : `<div class="gold" style="font-size:${wide ? 40 : 46}px;letter-spacing:.12em;text-transform:uppercase">${esc(plan.kicker)}</div>
             <div class="disp" style="font-size:${wide ? 150 : 160}px">${esc(plan.title)}</div>
             <div class="disp gold" style="font-size:${wide ? 56 : 64}px">Free at asmau.org</div>`}
  </div></body>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(OUT, "tmp-"));
  let music = path.join(OUT, slug + "-music.mp3");
  if (!fs.existsSync(music)) execFileSync("curl", ["-sSfL", "-A", "asmau-video", "-o", music, plan.music]);
  const b = await chromium.launch();
  for (const kind of kinds) {
    const wide = kind === "trailer", W = wide ? 1920 : 1080, H = wide ? 1080 : 1920;
    const page = await b.newPage({ viewport: { width: W, height: H } });
    const shot = async (html, f) => { const h = path.join(tmp, "s.html"); fs.writeFileSync(h, html); await page.goto(url(h)); await page.waitForTimeout(250); await page.screenshot({ path: f }); };
    // scenes: [png, seconds, voice or null, voice start]
    const parts = [];
    await shot(card(kind, false), path.join(tmp, kind + "-0.png")); parts.push([path.join(tmp, kind + "-0.png"), 3, null]);
    for (const id of plan[kind]) {
      const img = path.join(G, "assets/img", id + ".webp"), voice = path.join(G, "assets/audio", id + ".mp3");
      if (!fs.existsSync(img) || !fs.existsSync(voice)) throw new Error("missing picture or voice for " + id + " (run node scripts/fetch-media.js)");
      const f = path.join(tmp, kind + "-" + id + ".png"); await shot(scene(kind, img, lines[id]), f);
      parts.push([f, dur(voice) / SPEED + 1.0, voice]);
    }
    await shot(card(kind, true), path.join(tmp, kind + "-end.png")); parts.push([path.join(tmp, kind + "-end.png"), 4.5, null]);
    await page.close();

    // video: each picture held still (a slow zoom moved in whole pixels and looked shaky), joined with short cross-fades
    const X = 0.5, clips = [];
    parts.forEach(([png, sec], i) => {
      const c = path.join(tmp, `${kind}-c${i}.mp4`);
      ff(["-loop", "1", "-framerate", "30", "-i", png, "-t", (sec + X).toFixed(2), "-vf", "format=yuv420p", "-c:v", "libx264", "-preset", "medium",
          "-crf", "18", "-tune", "stillimage", c]);
      clips.push([c, sec + X]);
    });
    let filt = "", last = "[0:v]", t = clips[0][1] - X;
    for (let i = 1; i < clips.length; i++) {
      filt += `${last}[${i}:v]xfade=transition=fade:duration=${X}:offset=${t.toFixed(2)}[v${i}];`; last = `[v${i}]`; t += clips[i][1] - X;
    }
    const silent = path.join(tmp, kind + "-v.mp4");
    ff([...clips.flatMap(([c]) => ["-i", c]), "-filter_complex", filt.slice(0, -1), "-map", last, "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", silent]);

    // sound: each line starts 0.6 s into its scene; the music underneath, lower while the voice speaks, faded at the end
    const total = dur(silent); let at = 0; const voices = [];
    parts.forEach(([, sec, voice]) => { if (voice) voices.push([voice, at + 0.6]); at += sec; });
    const inputs = ["-i", silent, "-stream_loop", "-1", "-i", music, ...voices.flatMap(([v]) => ["-i", v])];
    const vparts = voices.map(([, s], i) => `[${i + 2}:a]atempo=${SPEED},adelay=${Math.round(s * 1000)}|${Math.round(s * 1000)},volume=1.0[a${i}]`).join(";");
    const mix = `[1:a]atrim=0:${total.toFixed(2)},volume=0.16,afade=t=in:d=1.5,afade=t=out:st=${(total - 2.5).toFixed(2)}:d=2.5[m];${vparts};[m]${voices.map((_, i) => `[a${i}]`).join("")}amix=inputs=${voices.length + 1}:normalize=0,loudnorm=I=-16:TP=-1.5[a]`;
    const out = path.join(OUT, `${slug}-${kind}.mp4`);
    ff([...inputs, "-filter_complex", mix, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", total.toFixed(2), "-movflags", "+faststart", out]);
    console.log(out, total.toFixed(1) + " s");
  }
  await b.close();
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch((e) => { console.error(e.message); process.exit(1); });
