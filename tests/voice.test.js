// The choice of computer voice is easy to find (owner, 17 November 2026: "I still can't find where to switch to the man's
// voice"): on the front of For parents, in Sound and volume, and in each story's own For parents box; it takes effect
// at once.
"use strict";
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("voice choice"), repo = path.join(__dirname, "..");
  const site = await serve(repo), browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(site.url + "index.html", { waitUntil: "networkidle" });
  await p.click("#parentsBtn"); await p.waitForTimeout(300);
  const front = p.locator('.p-view[data-view="home"] [data-voice-pick]');
  T.check(await front.isVisible(), "the front of For parents shows who reads the stories, with no tap needed");
  await front.locator('[data-voice="m"]').click();
  T.check(await p.evaluate(() => localStorage.getItem("asmau-voice")) === "m", "choosing the man's voice there is remembered");
  await p.click('.p-view[data-view="home"] [data-go="sound"]');
  T.check(await p.locator('.p-view[data-view="sound"] [data-voice="m"][aria-checked="true"]').isVisible(), "Sound and volume shows the same choice");

  // in a story: its own For parents box, and the next line is read in the chosen voice
  const sounds = []; p.on("request", (r) => { if (/\.mp3(\?|$)/.test(r.url())) sounds.push(r.url()); });
  await p.goto(site.url + "games/nuh/index.html?skipms=300", { waitUntil: "networkidle" });
  await p.click("details.parents summary");
  const inGame = p.locator("details.parents .voice-pick:has([data-voice])");
  T.check(await inGame.isVisible() && await inGame.locator('[data-voice="m"][aria-checked="true"]').count() === 1, "the story's For parents box offers the choice, showing the man's voice");
  await inGame.locator('[data-voice="w"]').click();
  await p.click("#startBtn"); await p.waitForTimeout(900);
  sounds.length = 0; await p.click("#caption"); await p.waitForTimeout(800);
  T.check(sounds.some((u) => /\/assets\/audio\/n1-a\.mp3/.test(u)) && !sounds.some((u) => /audio-m\//.test(u)), "switching back in the game: the woman reads: " + sounds.slice(-1));
  await browser.close(); await site.close();
  return T.done();
};
