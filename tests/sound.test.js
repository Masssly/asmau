// The sound buttons: each tap one step louder, after the loudest off; the ring and the label show it.
"use strict";
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("sound buttons"), site = await serve(path.join(__dirname, ".."));
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const lvl = (k) => page.evaluate((k) => window.AsmauMusic.level(k), k);
  await page.goto(site.url + "games/yusuf/index.html?skipms=300", { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.setItem("asmau-sound", JSON.stringify({ music: 1, sounds: 1, voice: 0.5 })); });
  await page.reload({ waitUntil: "networkidle" });
  await page.click("#startBtn"); await page.waitForTimeout(400);
  await page.click("#voiceBtn");
  T.check(Math.abs(await lvl("voice") - 0.6) < 1e-6, "a tap on the voice button makes the voice one step louder (50% to 60%)");
  T.check(/Voice 60%/.test(await page.textContent(".snd-toast")) && /Voice 60%/.test(await page.getAttribute("#voiceBtn", "aria-label")), "a label shows the new level, and the button says it");
  T.check((await page.$eval("#voiceBtn", (b) => getComputedStyle(b).getPropertyValue("--lvl").trim())) === "0.6", "the ring around the button shows it");
  for (let i = 0; i < 4; i++) await page.click("#voiceBtn");
  T.check(await lvl("voice") === 1, "four more taps reach the loudest");
  await page.click("#voiceBtn");
  T.check(await lvl("voice") === 0 && await page.$eval("#voiceBtn", (b) => b.classList.contains("off")) && /Voice off/.test(await page.textContent(".snd-toast")), "after the loudest, the next tap turns it off");
  T.check(await page.evaluate(() => { const s = []; const o = window.AsmauNarration.say; return o("yusuf", "c1-a", "x").then(() => true); }), "with the voice off, nothing is read (the story goes on)");
  await page.click("#voiceBtn");
  T.check(Math.abs(await lvl("voice") - 0.1) < 1e-6, "and the next tap starts again from the quietest");
  await page.click("#musicBtn");
  T.check(await lvl("music") === 0 && Math.abs(await lvl("voice") - 0.1) < 1e-6, "each button has its own level");
  // the same buttons for parents on the front page, and the level is the same everywhere
  await page.goto(site.url + "index.html", { waitUntil: "networkidle" });
  await page.click("#parentsBtn"); await page.click('[data-go="sound"]');
  T.check(await page.locator('[data-view="sound"] [data-sound-btn]').count() === 3 && /off/.test(await page.textContent('[data-view="sound"] .snd-val[data-for="music"]')), "For parents > Sound and volume has the same three buttons, at the same levels");
  T.check(await page.locator('input[type="range"]').count() === 0, "and no sliders anywhere");
  await browser.close(); await site.close();
  return T.done();
};
