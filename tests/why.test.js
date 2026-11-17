// A wrong answer: the explanation stays on screen until the child answers again, and a tap says it again
// (owner's note, Umm Ayman 9.7: the joke about the baby camel vanished before it could be read).
"use strict";
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("wrong answers"), repo = path.join(__dirname, "..");
  const lines = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(repo, "games/umm-ayman/narration.json"), "utf8")).map((l) => [l.id, l.text]));
  const site = await serve(repo), browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const sounds = []; p.on("request", (r) => { if (/\.mp3(\?|$)/.test(r.url())) sounds.push(r.url()); });
  await p.goto(site.url + "games/umm-ayman/index.html?skipms=300", { waitUntil: "networkidle" });
  await p.click("#startBtn"); await p.waitForTimeout(600);
  await p.click("#mapBtn"); await p.locator(".chapter-tile").nth(8).click(); await p.waitForTimeout(700);
  for (let i = 0; i < 12 && !/9\.7/.test(await p.textContent("#pnoteSum")); i++) { await p.click("#nextBtn"); await p.waitForTimeout(500); }
  await p.waitForTimeout(500);
  T.check(/9\.7/.test(await p.textContent("#pnoteSum")) && (await p.textContent("#captionText")).trim() === lines["u9-q"], "page 9.7 asks about the baby camel");
  await p.locator("#stage button", { hasText: "A tiny baby camel" }).click();
  await p.waitForTimeout(12000);       // longer than the explanation and the old six-second limit
  const cap = (await p.textContent("#captionText")).trim();
  T.check(cap === lines["u9-q-no"], "after a wrong answer the explanation is still there: " + cap.slice(0, 60));
  T.check(await p.evaluate(() => document.getElementById("caption").classList.contains("why")), "and marked as the explanation");
  sounds.length = 0;
  await p.click("#caption"); await p.waitForTimeout(800);
  T.check(sounds.some((u) => /u9-q-no\.mp3/.test(u)), "a tap on it says it again");
  await p.locator("#stage button", { hasText: "A big grown-up camel" }).click(); await p.waitForTimeout(800);
  T.check(!(await p.evaluate(() => document.getElementById("caption").classList.contains("why"))), "the right answer moves on, and the mark goes");
  await browser.close(); await site.close();
  return T.done();
};
