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
  // the little ones' games: a quick tap on the corner 🔊 opens nothing; pressing and holding unfolds the buttons
  for (const g of ["tap-and-say", "count-the-crescents"]) {
    const p = await browser.newPage({ viewport: { width: 390, height: 780 }, hasTouch: true });
    await p.goto(site.url + "games/" + g + "/index.html", { waitUntil: "networkidle" });
    const dockBtn = p.locator(".snd-dock-btn"), box = await dockBtn.boundingBox();
    T.check(!!box && await p.locator(".snd-tray").isHidden(), g + ": one small sound button in the corner, folded");
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.waitForTimeout(150); await p.mouse.up();
    await p.waitForTimeout(200);
    T.check(await p.locator(".snd-tray").isHidden() && /press and hold/.test(await p.textContent(".snd-toast")), g + ": a quick tap opens nothing, it says to press and hold");
    await p.mouse.down(); await p.waitForTimeout(900); await p.mouse.up();
    T.check(await p.locator(".snd-tray").isVisible() && await p.locator(".snd-tray [data-sound-btn]").count() === 3, g + ": pressing and holding unfolds the three sound buttons");
    const before = await p.evaluate(() => window.AsmauMusic.level("voice"));
    await p.click('.snd-tray [data-sound-btn="voice"]');
    T.check(await p.evaluate(() => window.AsmauMusic.level("voice")) !== before, g + ": the voice button there changes the voice");
    await p.waitForTimeout(5600);
    T.check(await p.locator(".snd-tray").isHidden(), g + ": it folds away again after a few quiet seconds");
    await p.close();
  }
  await browser.close(); await site.close();
  return T.done();
};
