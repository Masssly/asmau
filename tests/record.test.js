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

  await browser.close(); await site.close();
  return T.done();
};
