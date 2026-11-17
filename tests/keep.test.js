// What a family has on a device survives an update (owner, 17 November 2026: "updates need to be clever enough to not
// wipe the code"): the family code, the child's place, the voice and language chosen. And an update that arrives while
// a story is being played brings the child back to the same page, with one tap.
"use strict";
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("keeping a family's things"), repo = path.join(__dirname, "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asmau-keep-"));
  for (const d of ["games", "shared", "fonts", "icons", "tools", "scripts", "packs"]) fs.cpSync(path.join(repo, d), path.join(tmp, d), { recursive: true });
  for (const f of ["index.html", "manifest.json", "app.webmanifest", "sw.js", "version.json", "config.json", "reset.html", "privacy.html"]) fs.copyFileSync(path.join(repo, f), path.join(tmp, f));
  const site = await serve(tmp), browser = await chromium.launch();
  const ctx = await browser.newContext({ serviceWorkers: "allow", viewport: { width: 390, height: 780 } }), p = await ctx.newPage();
  const CODE = "ABCDEFGHJKLMNPQR";
  const U = site.url + "games/nuh/index.html?skipms=300&updatems=600000";
  await p.goto(U, { waitUntil: "networkidle" }); await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(1000);
  // a family's things on this device: a family code, the man's voice, a place in the story
  await p.evaluate((c) => { localStorage.setItem("asmau-sync-code", c); localStorage.setItem("asmau-voice", "m"); }, CODE);
  await p.goto(U, { waitUntil: "networkidle" }); await p.waitForTimeout(500);
  await p.click("#startBtn"); await p.waitForTimeout(600);
  for (let i = 0; i < 2; i++) { await p.click("#nextBtn"); await p.waitForTimeout(500); }
  const page = (await p.textContent("#pnoteSum")).trim(), line = (await p.textContent("#captionText")).trim();
  T.check(/1\.3/.test(page), "the child is on page 1.3: " + page);

  // a new release arrives while the story is being played
  fs.appendFileSync(path.join(tmp, "games/nuh/story.js"), "\n// release 2\n");
  fs.appendFileSync(path.join(tmp, "shared/story-engine.js"), "\n// release 2\n");
  execSync("node scripts/build-offline.js", { cwd: tmp, stdio: "ignore" });
  const nav = p.waitForNavigation({ timeout: 60000 }).catch(() => null);
  await p.evaluate(() => navigator.serviceWorker.getRegistration().then((r) => r.update()));
  T.check(!!(await nav), "the update took over and the page reloaded itself");
  await p.waitForLoadState("networkidle"); await p.waitForTimeout(800);
  const kept = await p.evaluate(() => ({ code: localStorage.getItem("asmau-sync-code"), voice: localStorage.getItem("asmau-voice"), place: localStorage.getItem("asmau-nuh") }));
  T.check(kept.code === CODE, "the family code is still there after the update");
  T.check(kept.voice === "m" && !!kept.place, "and so are the chosen voice and the child's place");
  T.check(await p.isVisible(".updated-card"), "the page says Asmau was updated, tap to carry on");
  await p.click(".updated-card"); await p.waitForTimeout(800);
  T.check((await p.textContent("#pnoteSum")).trim() === page && (await p.textContent("#captionText")).trim() === line, "one tap: back on the same page, " + (await p.textContent("#pnoteSum")).trim());
  T.check((await p.evaluate(() => fetch("story.js").then((r) => r.text()))).includes("// release 2"), "and it is the new release");

  // the recorder: an update never reloads it in the middle of a recording
  const r = await ctx.newPage();
  await r.goto(site.url + "tools/record-voice/index.html?updatems=600000", { waitUntil: "networkidle" }); await r.waitForTimeout(500);
  T.check(await r.evaluate(() => typeof window.AsmauBusy === "function"), "the recorder tells updates when it is busy");
  await browser.close(); await site.close(); fs.rmSync(tmp, { recursive: true, force: true });
  return T.done();
};
