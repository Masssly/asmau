/*
  The social media kit: banners for each platform and launch posts, drawn from the brand (lockup, colours, fonts) and
  the games' own covers. Writes brand/kit/social/*.png. Never hand-edit the kit; change this file and run:
    NODE_PATH=$(npm root -g) node brand/src/social.js
  Sizes: YouTube 2560x1440 (text kept inside the 1546x423 middle that every device shows), Facebook 1640x624,
  X 1500x500, LinkedIn 1128x191, posts 1080x1350 (Instagram, Facebook, Threads, LinkedIn).
*/
"use strict";
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "brand", "kit", "social");
const url = (p) => "file://" + path.join(ROOT, p);
// the dark lockup without its own background box, so it sits on the gradient
const LOCKUP = "data:image/svg+xml;base64," + Buffer.from(fs.readFileSync(path.join(ROOT, "brand/kit/lockup/lockup-dark.svg"), "utf8")
  .replace('<rect width="1200" height="360" fill="#0c1530"/>', "")).toString("base64");
const COVERS = ["yusuf", "nana-asmau", "umm-ayman", "nuh", "ibn-battuta", "rahmah", "musa", "adam"];

const BASE = `
<style>
  @font-face { font-family: Baloo; src: url(${url("fonts/baloo2-latin.woff2")}); font-weight: 400 800; }
  @font-face { font-family: Mada; src: url(${url("fonts/mada-latin.woff2")}); font-weight: 200 900; }
  * { box-sizing: border-box; margin: 0; }
  body { width: var(--w); height: var(--h); overflow: hidden; color: #fdf6e8; font-family: Mada, sans-serif;
         background: linear-gradient(160deg, #1c2d5e 0%, #0c1530 70%); position: relative; }
  .gold { color: #f0b84b; } .cream { color: #fdf6e8; }
  h1, .disp { font-family: Baloo, sans-serif; font-weight: 700; line-height: 1.05; }
  .cov { border-radius: 18px; object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,.45); border: 3px solid rgba(253,246,232,.15); }
  .stars { position: absolute; inset: 0; background-image: radial-gradient(2px 2px at 20% 30%, #fdf6e855 50%, transparent 51%),
    radial-gradient(2px 2px at 70% 20%, #fdf6e844 50%, transparent 51%), radial-gradient(1.5px 1.5px at 40% 80%, #fdf6e833 50%, transparent 51%),
    radial-gradient(2px 2px at 85% 65%, #f0b84b44 50%, transparent 51%), radial-gradient(1.5px 1.5px at 10% 75%, #fdf6e833 50%, transparent 51%); }
</style>`;

function banner(w, h, opt) {
  // the lockup and words sit in the safe middle; covers fan out to both sides
  const s = opt.scale, safeW = opt.safeW || w, safeH = opt.safeH || h;
  const covW = opt.covW, covH = Math.round(covW * 625 / 1120);
  const side = (list, left) => list.map((g, i) => {
    const x = left ? (w - safeW) / 2 - covW - 30 - i * (covW * 0.62) : (w + safeW) / 2 + 30 + i * (covW * 0.62);
    const y = h / 2 - covH / 2 + (i % 2 ? covH * 0.35 : -covH * 0.35);
    return `<img class="cov" src="${url("games/" + g + "/cover.webp")}" style="position:absolute;left:${x}px;top:${y}px;width:${covW}px;height:${covH}px;transform:rotate(${left ? -4 + i * 3 : 4 - i * 3}deg);opacity:${1 - i * 0.12}">`;
  }).join("");
  return `${BASE}<body style="--w:${w}px;--h:${h}px"><div class="stars"></div>
  ${opt.covers ? side(COVERS.slice(0, opt.covers), true) + side(COVERS.slice(4, 4 + opt.covers), false) : ""}
  <div style="position:absolute;left:${(w - safeW) / 2}px;top:${(h - safeH) / 2}px;width:${safeW}px;height:${safeH}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${10 * s}px;text-align:center">
    <img src="${LOCKUP}" style="height:${opt.logo}px">
    ${opt.slogan === false ? "" : `<div class="disp gold" style="font-size:${30 * s}px">Free for ever · no adverts · no account</div>`}
    ${opt.site ? `<div style="font-size:${22 * s}px;opacity:.85">asmau.org</div>` : ""}
  </div></body>`;
}

function post(o) {
  const img = o.cover ? `<img class="cov" src="${url("games/" + o.cover + "/cover.webp")}" style="width:960px;height:536px;margin:0 auto;display:block">` :
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;width:960px;margin:0 auto">${COVERS.slice(0, 4).map((g) =>
      `<img class="cov" src="${url("games/" + g + "/cover.webp")}" style="width:469px;height:262px">`).join("")}</div>`;
  return `${BASE}<body style="--w:1080px;--h:1350px"><div class="stars"></div>
  <div style="position:absolute;inset:0;padding:70px 60px;display:flex;flex-direction:column;gap:38px">
    <div style="font-size:30px;letter-spacing:.12em;text-transform:uppercase" class="gold">${o.kicker}</div>
    <h1 style="font-size:${o.big || 84}px">${o.title}</h1>
    ${img}
    <p style="font-size:42px;line-height:1.35;opacity:.92">${o.text}</p>
    <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between">
      <img src="${LOCKUP}" style="height:120px">
      <div class="disp gold" style="font-size:46px">asmau.org</div>
    </div>
  </div></body>`;
}

const POSTS = [
  ["01-welcome", { kicker: "Free for ever", title: "Islamic story games for curious kids", text: "The prophets and great Muslims, told whole, chapter by chapter. No adverts, no account, nothing to buy. Ever." }],
  ["02-your-voice", { kicker: "Only on Asmau", title: "Read the stories in your own voice", text: "Record each page once, in any language. Your child hears you, on every phone and tablet in the family.", cover: "nuh" }],
  ["03-sources", { kicker: "For parents", title: "Every chapter tied to its verses", text: "Commentary and hadith named on every page, Sunni and Shia sources side by side, and a note for you on each page.", cover: "musa" }],
  ["04-yusuf", { kicker: "Stories of the prophets", title: "Yusuf", big: 110, text: "His whole story in thirteen chapters: the dream, the well, the prison, the king, and a family together again.", cover: "yusuf" }],
  ["05-nana-asmau", { kicker: "Great Muslims", title: "Nana Asma'u", big: 110, text: "The girl from Degel, in today's Nigeria, who learned the Qur'an by heart and grew up to teach a whole land. Asmau is named after her.", cover: "nana-asmau" }],
  ["06-umm-ayman", { kicker: "Great Muslims", title: "Umm Ayman", big: 110, text: "Barakah from Abyssinia cared for the Prophet ﷺ from the day he was born, and he called her: O mother.", cover: "umm-ayman" }],
  ["07-ibn-battuta", { kicker: "Great Muslims", title: "Ibn Battuta", big: 110, text: "He left Tangier at twenty-one to go on Hajj, and kept travelling for nearly thirty years.", cover: "ibn-battuta" }],
  ["08-rahmah", { kicker: "Great Muslims", title: "Rahmah El Yunusiyyah", big: 96, text: "The girl from the mountains of Sumatra who opened a school for girls in 1923, and never gave up.", cover: "rahmah" }],
  ["09-offline", { kicker: "Low data, works offline", title: "Download a game once, play it anywhere", text: "Choose what to keep on the phone. The games work without internet: on a journey, in the village, on the plane." }]
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const shot = async (name, html, w, h) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const f = path.join(OUT, "_" + name + ".html"); fs.writeFileSync(f, html);
    await p.goto("file://" + f); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, name + ".png") }); fs.unlinkSync(f); await p.close();
  };
  await shot("youtube-banner-2560x1440", banner(2560, 1440, { safeW: 1546, safeH: 423, scale: 2.2, logo: 220, covW: 420, covers: 3, site: true }), 2560, 1440);
  await shot("facebook-cover-1640x624", banner(1640, 624, { safeW: 900, safeH: 420, scale: 1.6, logo: 170, covW: 300, covers: 3, site: true }), 1640, 624);
  await shot("x-header-1500x500", banner(1500, 500, { safeW: 760, safeH: 330, scale: 1.3, logo: 140, covW: 260, covers: 3, site: true }), 1500, 500);
  await shot("linkedin-cover-1128x191", banner(1128, 191, { safeW: 560, safeH: 181, scale: 0.75, logo: 110, covW: 150, covers: 2, slogan: false }), 1128, 191);
  for (const [n, o] of POSTS) await shot("post-" + n, post(o), 1080, 1350);
  await b.close();
  fs.copyFileSync(path.join(ROOT, "brand/kit/share/avatar-800.png"), path.join(OUT, "profile-800.png"));
  console.log(fs.readdirSync(OUT).join("\n"));
})();
