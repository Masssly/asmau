#!/usr/bin/env node
/*
  The Asmau soundtrack as videos for YouTube: each track of scripts/soundtrack/tracks.json under one still picture
  (a picture from a game it is heard in, its title, the album, the logo and asmau.org).
    NODE_PATH=$(npm root -g) node scripts/video/music.js
  Writes scripts/video/out/music/<nn>-<name>.mp4 (1920x1080, the 320 kbit/s MP3 as it is on R2).
*/
"use strict";
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(__dirname, "out", "music");
const album = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/soundtrack/tracks.json"), "utf8"));
// the picture for each mood: a moment of the games where that music plays
const PIC = {
  wonder: "yusuf/cover.webp", pastoral: "rahmah/cover.webp", nile: "musa/cover.webp", desert: "yusuf/assets/img/c4-a.webp",
  court: "musa/assets/img/m12-c.webp", regal: "yusuf/assets/img/c8-a3.webp", trek: "ibn-battuta/cover.webp",
  tense: "nuh/assets/img/n7-c.webp", dread: "nuh/assets/img/n10-a.webp", sad: "yusuf/assets/img/c2-c.webp",
  longing: "umm-ayman/cover.webp", awe: "musa/assets/img/m17-b.webp", joy: "yusuf/assets/img/c11-d.webp",
  triumph: "musa/assets/img/m17-g.webp"
};
const SUITE = ["yusuf/cover.webp", "nana-asmau/cover.webp", "musa/cover.webp", "umm-ayman/cover.webp"];
const url = (p) => "file://" + p;
const g = (p) => path.join(ROOT, "games", p);
const LOCKUP = "data:image/svg+xml;base64," + Buffer.from(fs.readFileSync(path.join(ROOT, "brand/kit/lockup/lockup-dark.svg"), "utf8")
  .replace('<rect width="1200" height="360" fill="#0c1530"/>', "")).toString("base64");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const mmss = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

function card(t) {
  const pics = t.mood === "all" ? SUITE : [PIC[t.mood]];
  const art = pics.length > 1
    ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:860px">${pics.map((p) => `<img src="${url(g(p))}" style="width:422px;height:236px;object-fit:cover;border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,.5)">`).join("")}</div>`
    : `<img src="${url(g(pics[0]))}" style="width:860px;height:${/cover/.test(pics[0]) ? 480 : 860}px;max-height:860px;object-fit:cover;border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.55)">`;
  return `<style>
    @font-face { font-family: Baloo; src: url(${url(path.join(ROOT, "fonts/baloo2-latin.woff2"))}); font-weight: 400 800; }
    @font-face { font-family: Mada; src: url(${url(path.join(ROOT, "fonts/mada-latin.woff2"))}); font-weight: 200 900; }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1920px; height: 1080px; overflow: hidden; color: #fdf6e8; font-family: Mada, sans-serif;
           background: linear-gradient(160deg, #1c2d5e 0%, #0c1530 70%); display: flex; align-items: center; gap: 80px; padding: 0 100px; }
    .disp { font-family: Baloo, sans-serif; font-weight: 700; line-height: 1.05; }
  </style><body>
    <div style="flex:none;display:flex;align-items:center;justify-content:center;width:860px;height:880px">${art}</div>
    <div style="display:flex;flex-direction:column;gap:26px">
      <div style="font-size:34px;letter-spacing:.12em;text-transform:uppercase;color:#f0b84b">${esc(album.album)} · ${t.n}</div>
      <div class="disp" style="font-size:${t.title.length > 14 ? 110 : 130}px">${esc(t.title)}</div>
      <div style="font-size:38px;opacity:.9">Heard in ${esc(t.heard.join(", "))} · ${mmss(t.seconds)}</div>
      <div style="margin-top:50px;display:flex;align-items:center;gap:40px"><img src="${LOCKUP}" style="height:110px">
        <div class="disp" style="font-size:56px;color:#f0b84b">asmau.org</div></div>
    </div></body>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const t of album.tracks) {
    const name = path.basename(new URL(t.mp3).pathname, ".mp3"), mp3 = path.join(OUT, name + ".mp3"), png = path.join(OUT, name + ".png");
    if (!fs.existsSync(mp3)) execFileSync("curl", ["-sSfL", "-A", "asmau-video", "-o", mp3, t.mp3]);
    const h = path.join(OUT, "card.html"); fs.writeFileSync(h, card(t)); await page.goto(url(h)); await page.waitForTimeout(300);
    await page.screenshot({ path: png });
    const mp4 = path.join(OUT, name + ".mp4");
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-framerate", "1", "-i", png, "-i", mp3, "-c:v", "libx264", "-tune", "stillimage",
      "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "1", "-c:a", "copy", "-shortest", "-movflags", "+faststart", mp4]);
    console.log(name, (fs.statSync(mp4).size / 1048576).toFixed(1) + " MB");
  }
  fs.unlinkSync(path.join(OUT, "card.html"));
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
