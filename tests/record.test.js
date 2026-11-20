// Recording your voice says where each line stands (owner, 20 November 2026: "robust messages so people know if it's
// saving, saved or error"; on an iPhone a recording was never saved and nothing said so): recording with a timer,
// Saving…, Saved, too short, and saved even when the browser's decoder never answers (as on some iPhones).
"use strict";
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("recording messages"), repo = path.join(__dirname, "..");
  const site = await serve(repo);
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });

  async function page(hangDecoder) {
    const ctx = await browser.newContext({ permissions: ["microphone"], serviceWorkers: "block" });
    if (hangDecoder) await ctx.addInitScript(() => { AudioContext.prototype.decodeAudioData = function () { return new Promise(() => {}); }; });
    const p = await ctx.newPage();
    await p.goto(site.url + "tools/record-voice/index.html", { waitUntil: "load" });
    await p.waitForSelector(".card.row .mini-btn.record");
    const row = p.locator(".card.row").first();
    return { p, ctx, row, status: () => row.locator(".status").innerText(), rec: row.locator(".mini-btn.record") };
  }

  const a = await page(false);
  T.check(/Not recorded yet/.test(await a.status()), "a line with no recording says so");
  await a.rec.click(); await a.p.waitForTimeout(1600);
  T.check(/Recording… 0:0[1-9]/.test(await a.status()), "while recording, the line says Recording with a running timer");
  await a.rec.click();
  await a.p.waitForFunction(() => /Saved on this device/.test(document.querySelector(".card.row .status").textContent), null, { timeout: 15000 }).catch(() => {});
  T.check(/✓ Saved on this device/.test(await a.status()), "after Stop it says Saved on this device");
  T.check(/Play my recording/.test(await a.row.locator(".mini-btn").first().innerText()), "the play button then plays the recording, and says so");
  const second = a.p.locator(".card.row").nth(1);
  await second.locator(".mini-btn.record").click(); await a.p.waitForTimeout(250); await second.locator(".mini-btn.record").click();
  await a.p.waitForTimeout(800);
  T.check(/Too short/.test(await second.locator(".status").innerText()), "a recording stopped at once is not kept, and the line says why");
  await a.row.locator(".mini-btn.delete").click();
  await a.p.waitForFunction(() => /Removed/.test(document.querySelector(".card.row .status").textContent), null, { timeout: 5000 }).catch(() => {});
  T.check(/Removed/.test(await a.status()), "removing a recording says the computer voice reads the line again");
  await a.ctx.close();

  // an iPhone whose decoder never answers: Saving…, then saved as recorded (the 10 s give-up in shared/mp3.js)
  const b = await page(true);
  await b.rec.click(); await b.p.waitForTimeout(1500); await b.rec.click();
  await b.p.waitForTimeout(600);
  T.check(/Saving…/.test(await b.status()), "while it saves, the line says Saving…");
  await b.p.waitForFunction(() => /Saved on this device/.test(document.querySelector(".card.row .status").textContent), null, { timeout: 20000 }).catch(() => {});
  T.check(/✓ Saved on this device/.test(await b.status()), "it is saved even when the browser cannot convert the recording");
  await b.ctx.close();

  // the guided way (tools/record-voice/story.html): one page at a time, with its picture, progress kept
  const c = await browser.newContext({ permissions: ["microphone"], serviceWorkers: "block", viewport: { width: 390, height: 844 } });
  const g = await c.newPage(); const errs = []; g.on("pageerror", (e) => errs.push(e.message));
  await g.goto(site.url + "tools/record-voice/story.html", { waitUntil: "load" });
  await g.waitForSelector(".game", { timeout: 15000 });
  T.check(await g.locator(".game", { hasText: "Yusuf" }).count() === 1 && await g.locator(".game", { hasText: "Count" }).count() === 0, "the stories to record are listed (not the little ones' games)");
  await g.goto(site.url + "tools/record-voice/story.html?g=nuh", { waitUntil: "load" });
  await g.waitForSelector("#line:not(:empty)");
  T.check(/page 1\.1/.test(await g.textContent(".where")) && /0 of \d+ in your voice/.test(await g.textContent("#count")), "a story opens at its first page, with how much is in your voice");
  T.check(await g.locator("#rec").isVisible(), "the big record button is there");
  await g.click("#rec"); await g.waitForTimeout(1500); await g.click("#rec");
  await g.waitForFunction(() => /Saved/.test(document.getElementById("status").textContent), null, { timeout: 15000 }).catch(() => {});
  T.check(/Saved/.test(await g.textContent("#status")) && /^1 of/.test(await g.textContent("#count")), "a page recorded there is saved and counted");
  // a second page straight after: the microphone is asked for afresh each time (an iPhone mutes one kept open)
  await g.click("#next"); await g.waitForTimeout(400);
  await g.click("#rec"); await g.waitForTimeout(1500); await g.click("#rec");
  await g.waitForFunction(() => /^2 of/.test(document.getElementById("count").textContent), null, { timeout: 15000 }).catch(() => {});
  T.check(/^2 of/.test(await g.textContent("#count")), "the next page records too, one after another");
  await g.click("#prev"); await g.waitForTimeout(300);
  await g.click("#next"); await g.reload(); await g.waitForSelector("#line:not(:empty)");
  T.check(/page 1\.2/.test(await g.textContent(".where")), "it comes back to the page where the parent stopped");
  await g.goto(site.url + "tools/record-voice/story.html?g=nuh&at=n6-b&back=1", { waitUntil: "load" }); await g.waitForSelector("#line:not(:empty)");
  T.check(/page 6\.2/.test(await g.textContent(".where")) && /Back to the story/.test(await g.textContent("#back")), "opened from a story's page, it shows that page and leads back to the story");
  // the ways in from a story: its For parents box, and each page's note
  await g.goto(site.url + "games/nuh/index.html", { waitUntil: "load" });
  T.check(/record-voice\/story\.html\?g=nuh/.test(await g.getAttribute("a.voice-link", "href")), "a story's title page offers to record it in your voice, page by page");
  T.check(errs.length === 0, "no page errors" + (errs[0] ? ": " + errs[0] : ""));
  await c.close();

  await browser.close(); await site.close();
  return T.done();
};
