/* Splash screens: node brand/src/splash.js [kitdir]
   apple/splash-2732.png  : 2732 x 2732, the mark and the name in the middle of night blue. A native wrapper
                            (Capacitor and the like) crops it to each screen from the centre, so all of it sits
                            in the central 1200 px.
   android/splash-icon-1152.png : Android 12+ splash icon without a background: 288 dp at xxxhdpi (4x), the art
                            inside the central 192 dp circle (768 px). The background colour is set in the app: #0c1530. */
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const SRC = process.env.BRAND_SRC || __dirname;
const kit = path.resolve(process.argv[2] || path.join(SRC, "..", "kit"));
const src = fs.readFileSync(path.join(SRC, "mark-allo.svg"), "utf8");
const word = fs.readFileSync(path.join(SRC, "..", "preview", "wordmark-cream.svg"), "utf8");
const BG_RECT = '<rect width="512" height="512" fill="url(#bg)"/>';
const inner = s => s.replace(/^[\s\S]*?viewBox="0 0 512 512">/, "").replace(/<\/svg>\s*$/, "");
const b64 = s => "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  // Apple: night-blue square, the tile and the name centred
  await p.setViewportSize({ width: 2732, height: 2732 });
  await p.setContent(`<body style="margin:0;width:2732px;height:2732px;background:linear-gradient(180deg,#1c2d5e,#0c1530);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:70px">
    <img src="${b64(src)}" width="520" height="520" style="border-radius:116px;box-shadow:0 30px 80px rgba(0,0,0,.45)">
    <img src="${b64(word)}" width="560"></body>`);
  await p.waitForTimeout(300);
  fs.mkdirSync(path.join(kit, "apple"), { recursive: true });
  await p.screenshot({ path: path.join(kit, "apple", "splash-2732.png") });
  // Android 12+: the board alone, transparent, inside the 192/288 circle
  const fg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g transform="translate(256 256) scale(.62) translate(-256 -256)">' +
    inner(src.replace(BG_RECT, "")) + "</g></svg>";
  const defs = src.match(/<defs>[\s\S]*?<\/defs>/)[0];
  const fg2 = fg.replace('viewBox="0 0 512 512">', 'viewBox="0 0 512 512">' + defs);
  await p.setViewportSize({ width: 1152, height: 1152 });
  await p.setContent(`<body style="margin:0;background:transparent"><img src="${b64(fg2)}" width="1152" height="1152" style="display:block"></body>`);
  await p.waitForTimeout(200);
  fs.mkdirSync(path.join(kit, "android"), { recursive: true });
  await p.screenshot({ path: path.join(kit, "android", "splash-icon-1152.png"), omitBackground: true });
  await b.close(); console.log("splash written");
})();
