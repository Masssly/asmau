/* Makes every icon and banner from one mark: node brand/src/kit.js <mark> [outdir]
   <mark> is allo, monogram or crescent (brand/src/mark-<mark>.svg). Writes to outdir (default brand/kit):
   site: icon-180/192/512.png, icon-maskable-512.png, favicon.svg, favicon-16/32/48.png
   apple: app-store-1024.png (no transparency, square corners)
   android: play-512.png, adaptive/{foreground,background,monochrome}-432.png (108 dp at xxxhdpi), feature-1024x500.png
   huawei: appgallery-216.png
   share: og-1200x630.png, avatar-800.png (profile picture, safe for round crops)
   lockup: lockup-dark/light.svg/png, wordmark-cream/navy.svg
   Then brand/src/mono.py makes android/adaptive/monochrome-432.png from the foreground. */
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const mark = process.argv[2] || "allo";
const out = path.resolve(process.argv[3] || path.join(__dirname, "..", "kit"));
const src = fs.readFileSync(path.join(__dirname, "mark-" + mark + ".svg"), "utf8");
const BG_RECT = '<rect width="512" height="512" fill="url(#bg)"/>';
if (!src.includes(BG_RECT)) throw new Error("mark has no background rect");
const fg = src.replace(BG_RECT, "");                         // the mark alone, transparent around it
const inner = s => s.replace(/^[\s\S]*?viewBox="0 0 512 512">/, "").replace(/<\/svg>\s*$/, "");
const lock = fs.readFileSync(path.join(__dirname, "..", "preview", "lockup-" + mark + ".svg"), "utf8");
const feat = fs.readFileSync(path.join(__dirname, "..", "preview", "feature-" + mark + ".svg"), "utf8");

// scale the foreground about the centre: k = share of the full size the 512 mark's art keeps
const scaled = (k, withBg) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
  (withBg ? src.match(/<defs>[\s\S]*?<\/defs>/)[0] + BG_RECT : "") +
  '<g transform="translate(256 256) scale(' + k + ') translate(-256 -256)">' + inner(fg) + "</g></svg>";
const bgOnly = src.replace(/(<rect width="512" height="512" fill="url\(#bg\)"\/>)[\s\S]*<\/svg>/, "$1</svg>");

async function shot(page, svg, w, h, file, transparent) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent('<html><body style="margin:0;background:transparent"><img style="display:block" width="' + w + '" height="' + h +
    '" src="data:image/svg+xml;base64,' + Buffer.from(svg).toString("base64") + '"></body></html>');
  await page.waitForLoadState("load");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, omitBackground: !!transparent });
}

(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const full = src, mask = scaled(0.8, true);                // maskable: the art inside the central 80 % circle
  for (const s of [16, 32, 48]) await shot(p, full, s, s, path.join(out, "site", "favicon-" + s + ".png"));
  for (const s of [180, 192, 512]) await shot(p, full, s, s, path.join(out, "site", "icon-" + s + ".png"));
  await shot(p, mask, 512, 512, path.join(out, "site", "icon-maskable-512.png"));
  fs.writeFileSync(path.join(out, "site", "favicon.svg"), full);
  await shot(p, full, 1024, 1024, path.join(out, "apple", "app-store-1024.png"));
  await shot(p, full, 512, 512, path.join(out, "android", "play-512.png"));
  // adaptive icon: 108 dp layers, the art kept within the 66 dp safe circle (66/108 = .61)
  await shot(p, scaled(0.66, false), 432, 432, path.join(out, "android", "adaptive", "foreground-432.png"), true);
  await shot(p, bgOnly, 432, 432, path.join(out, "android", "adaptive", "background-432.png"));
  await shot(p, feat, 1024, 500, path.join(out, "android", "feature-1024x500.png"));
  await shot(p, full, 216, 216, path.join(out, "huawei", "appgallery-216.png"));
  const og = feat.replace('viewBox="0 0 1024 500"', 'viewBox="-88 -65 1200 630" preserveAspectRatio="xMidYMid slice"')
    .replace('<rect width="1024" height="500" fill="url(#fbg)"/>', '<rect x="-88" y="-65" width="1200" height="630" fill="url(#fbg)"/>');
  await shot(p, og, 1200, 630, path.join(out, "share", "og-1200x630.png"));
  fs.mkdirSync(path.join(out, "lockup"), { recursive: true });
  fs.writeFileSync(path.join(out, "lockup", "lockup-dark.svg"), lock);
  await shot(p, lock, 1200, 360, path.join(out, "lockup", "lockup-dark.png"));
  const pv = f => fs.readFileSync(path.join(__dirname, "..", "preview", f), "utf8");
  const light = pv("lockup-" + mark + "-light.svg");
  fs.writeFileSync(path.join(out, "lockup", "lockup-light.svg"), light);
  await shot(p, light, 1200, 360, path.join(out, "lockup", "lockup-light.png"), true);
  for (const c of ["cream", "navy"]) fs.writeFileSync(path.join(out, "lockup", "wordmark-" + c + ".svg"), pv("wordmark-" + c + ".svg"));
  await shot(p, scaled(0.78, true), 800, 800, path.join(out, "share", "avatar-800.png"));   // safe for round crops
  await b.close();
  console.log("kit written to", out);
})();
