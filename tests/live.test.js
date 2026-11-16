// Living scenes: the effects sit on the picture as shown, never take a tap, and stop when the device asks for less motion.
"use strict";
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("living scenes"), site = await serve(path.join(__dirname, "..")), browser = await chromium.launch();
  for (const [w, h] of [[390, 844], [360, 640], [1032, 1376]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } }), errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    await page.goto(site.url + "games/yusuf/index.html?skipms=300", { waitUntil: "networkidle" });
    await page.click("#startBtn"); await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const live = document.querySelector("#stage .live"), img = document.querySelector("#stage img.pic");
      if (!live || !img) return null;
      const l = live.getBoundingClientRect(), s = document.getElementById("stage").getBoundingClientRect();
      // the picture as shown: the whole picture, centred in the stage
      const ar = img.naturalWidth / img.naturalHeight, pw = Math.min(s.width, s.height * ar), ph = pw / ar;
      return { n: live.querySelectorAll(".live-fx").length, kinds: [...live.querySelectorAll(".live-fx")].map((e) => e.className.replace("live-fx live-", "")),
        dw: Math.abs(l.width - pw), dh: Math.abs(l.height - ph), dx: Math.abs(l.left - (s.left + (s.width - pw) / 2)), taps: getComputedStyle(live).pointerEvents };
    });
    T.check(!!m && m.n >= 1, `${w}x${h}: the first page of Yusuf has living effects (${m && m.kinds.join(", ")})`);
    T.check(!!m && m.dw < 30 && m.dh < 30 && m.dx < 30, `${w}x${h}: the effects cover the picture as shown (off by ${m && Math.round(Math.max(m.dw, m.dh, m.dx))}px, the slow zoom included)`);
    T.check(!!m && m.taps === "none", `${w}x${h}: the effects never take a tap`);
    T.check(errs.length === 0, `${w}x${h}: no page errors` + (errs[0] ? ": " + errs[0] : ""));
    await page.close();
  }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" }), p = await ctx.newPage();
  await p.goto(site.url + "games/yusuf/index.html?skipms=300", { waitUntil: "networkidle" });
  await p.click("#startBtn"); await p.waitForTimeout(1200);
  T.check(await p.evaluate(() => [...document.querySelectorAll("#stage .live, #stage .live-fx")].every((e) => getComputedStyle(e).animationName === "none")),
    "with reduced motion on the device, nothing in the living layer moves");
  await browser.close(); await site.close();
  return T.done();
};
