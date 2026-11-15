/* Store screenshots: real game screens under a short caption.
   Serve the site first (python3 -m http.server 8799 in the repo), then: node brand/src/screens.js [outdir]
   Writes <outdir>/<size>/<n>-<name>.jpg for: apple iPhone 6.9" (1320x2868), apple iPad 13" (2064x2752),
   Google Play phone (1080x1920) and tablet (1440x2560), Huawei (720x1280 and 450x800: the first five Play phone ones, resized by brand/src/huawei-screens.py). */
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const BASE = "http://localhost:8799/";
const out = path.resolve(process.argv[2] || path.join(__dirname, "..", "kit", "screens"));
// W x H: the store's image; cssW x cssH: a real device's screen, captured as it is and fitted under the caption
const SIZES = [
  { name: "apple-iphone-6.9", W: 1320, H: 2868, cssW: 440, cssH: 956 },     // iPhone Pro Max
  { name: "apple-ipad-13", W: 2064, H: 2752, cssW: 1032, cssH: 1376 },      // iPad Pro 13"
  { name: "play-phone", W: 1080, H: 1920, cssW: 412, cssH: 870 },           // a common Android phone
  { name: "play-tablet", W: 1440, H: 2560, cssW: 800, cssH: 1280 },         // a 10" Android tablet
];
async function story(p, game, nexts) {
  await p.goto(BASE + "games/" + game + "/index.html?skipms=300"); await p.waitForTimeout(1200);
  await p.click("#startBtn");
  for (let i = 0; i < nexts; i++) { await p.waitForTimeout(1300); await p.click("#nextBtn", { timeout: 6000 }); }
  await p.waitForTimeout(1800);
}
const SHOTS = [
  { id: "stories", cap: "Stories of the prophets, from the Qur'an", go: async p => { await p.goto(BASE + "index.html"); await p.waitForTimeout(1800); } },
  { id: "read-aloud", cap: "Every page is read aloud", go: p => story(p, "yusuf", 0) },
  { id: "games", cap: "Little games inside every story", go: p => story(p, "yusuf", 1) },
  { id: "your-voice", cap: "Record the stories in your own voice", go: async p => { await p.goto(BASE + "index.html#parents-record"); await p.waitForTimeout(1800); } },
  { id: "first-words", cap: "First words in English and Arabic", go: async p => {
      await p.goto(BASE + "games/tap-and-say/index.html"); await p.waitForTimeout(1000);
      await p.click("#pages button:nth-child(3)"); await p.waitForTimeout(500); await p.click(".tile:nth-child(1)"); await p.waitForTimeout(900); } },
  { id: "great-muslims", cap: "Great Muslims, like Nana Asma'u", go: p => story(p, "nana-asmau", 1) },
  { id: "pictures", cap: "A picture for every page", go: p => story(p, "adam", 8) },
];
const TOP = 0.18, SHOT = 0.79;          // caption band, then the screen
(async () => {
  const b = await chromium.launch();
  for (const s of SIZES) {
    const { cssW, cssH } = s, boxH = SHOT * s.H, boxW = boxH * cssW / cssH, scale = boxH / cssH;
    fs.mkdirSync(path.join(out, s.name), { recursive: true });
    for (let i = 0; i < SHOTS.length; i++) {
      const sh = SHOTS[i];
      const ctx = await b.newContext({ viewport: { width: cssW, height: cssH }, deviceScaleFactor: scale });
      const p = await ctx.newPage();
      await sh.go(p);
      const png = await p.screenshot();
      await ctx.close();
      const c = await b.newPage({ viewport: { width: s.W, height: s.H } });
      const fsz = Math.round(s.W * (s.W > s.H * 0.6 ? 0.055 : 0.072));
      await c.setContent(`<html><head><style>
        @font-face { font-family: B; font-weight: 800; src: url(${BASE}fonts/baloo2-latin.woff2) format('woff2'); }
        html,body { margin:0; width:${s.W}px; height:${s.H}px; overflow:hidden; background: linear-gradient(180deg,#1c2d5e,#0c1530); }
        h1 { position:absolute; left:6%; right:6%; top:0; height:${TOP * s.H}px; margin:0; display:flex; align-items:center; justify-content:center;
             text-align:center; font: 800 ${fsz}px/1.12 B, sans-serif; color:#fdf6e8; text-wrap:balance; }
        img { position:absolute; left:${(s.W - boxW) / 2}px; top:${TOP * s.H}px; width:${boxW}px; height:${boxH}px; border-radius:${Math.round(boxW * 0.06)}px;
              box-shadow: 0 ${s.W * 0.02}px ${s.W * 0.05}px rgba(0,0,0,.5); outline: ${Math.max(2, s.W * 0.004)}px solid rgba(240,184,75,.55); }
      </style></head><body><h1>${sh.cap}</h1><img src="data:image/png;base64,${png.toString("base64")}"></body></html>`);
      await c.evaluate(() => document.fonts.ready); await c.waitForTimeout(200);
      await c.screenshot({ path: path.join(out, s.name, (i + 1) + "-" + sh.id + ".jpg"), type: "jpeg", quality: 90 });   // all stores take JPEG
      await c.close();
      console.log(s.name, i + 1, sh.id);
    }
  }
  await b.close();
})();
