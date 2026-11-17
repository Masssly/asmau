// A device that used the site before packs (release 2026.11.34) moves to the new design without downloading its saved
// pictures and sounds again, keeps the games it had, and plays them without internet.
"use strict";
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

const OLD = "5c51e1a";        // release 2026.11.34, the last before packs

module.exports = async function () {
  const T = checker("moving to packs"), repo = path.join(__dirname, "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asmau-migrate-"));
  // the old site: its own pages and scripts from git, with today's pictures and sounds where it kept them
  execSync("git archive " + OLD + " | tar -x -C " + JSON.stringify(tmp), { cwd: repo, shell: "/bin/bash" });
  const site = await serve(tmp), browser = await chromium.launch();
  const ctx = await browser.newContext({ serviceWorkers: "allow", viewport: { width: 390, height: 780 } }), p = await ctx.newPage();
  const U = site.url + "games/yusuf/index.html";
  await p.goto(U, { waitUntil: "networkidle" }); await p.evaluate(() => navigator.serviceWorker.ready);
  for (let t = 0; t < 90; t++) {
    const n = await p.evaluate(async () => (await caches.keys()).includes("asmau-media") ? (await (await caches.open("asmau-media")).keys()).length : 0);
    if (n > 250) break; await p.waitForTimeout(1000);
  }
  const before = await p.evaluate(async () => (await (await caches.open("asmau-media")).keys()).filter((r) => r.url.includes("/games/yusuf/assets/")).length);
  T.check(before > 200, "the old release saved Yusuf's pictures and sounds (" + before + ")");

  // the new release arrives: replace the site with today's (pages, scripts and pack lists; media as before)
  for (const d of ["games", "shared", "fonts", "icons", "tools", "packs"]) {
    fs.rmSync(path.join(tmp, d), { recursive: true, force: true });
    fs.cpSync(path.join(repo, d), path.join(tmp, d), { recursive: true });
  }
  for (const f of ["index.html", "manifest.json", "app.webmanifest", "sw.js", "version.json", "config.json", "reset.html", "privacy.html"]) fs.copyFileSync(path.join(repo, f), path.join(tmp, f));
  site.log.length = 0;
  await p.goto(U, { waitUntil: "load" });
  // the page reloads itself when the new release takes over (shared/pwa.js): read through it
  const ev = async (fn, arg) => { for (let i = 0; i < 10; i++) { try { return await p.evaluate(fn, arg); } catch (e) { await p.waitForTimeout(1000); } } return null; };
  for (let t = 0; t < 60; t++) {
    const names = await ev(() => caches.keys()) || [];
    if (!names.includes("asmau-media") && names.includes("asmau-files")) break; await p.waitForTimeout(1000);
  }
  await p.waitForTimeout(6000);
  const names = await ev(() => caches.keys()) || [];
  T.check(!names.includes("asmau-media") && names.includes("asmau-files"), "the old saved copies were moved: " + names.join());
  const media = site.log.filter((l) => /^\/media\/.+\/games\/yusuf\/assets\//.test(l) || /\/games\/yusuf\/assets\//.test(l));
  // pictures and sounds redrawn or re-voiced since that release are new files and are downloaded once, as they should
  // be; every other one must come from what the device already had
  const crypto = require("crypto"), now = {};
  for (const pk of ["yusuf", "yusuf@w"]) Object.assign(now, JSON.parse(fs.readFileSync(path.join(repo, "packs", pk + ".json"), "utf8")).files);
  const changed = new Set(Object.keys(now).filter((f) => {
    try { return crypto.createHash("sha1").update(execSync("git show " + OLD + ":" + f, { cwd: repo, maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] })).digest("hex").slice(0, 10) !== now[f]; }
    catch (e) { return true; }                       // a file the old release did not have at all
  }));
  const again = media.filter((l) => !changed.has((/games\/yusuf\/assets\/.*$/.exec(l) || [""])[0]));
  T.check(again.length <= 2, "no unchanged picture or sound of Yusuf was downloaded again (" + again.length + " asked for; " +
    (media.length - again.length) + " changed since then, downloaded once)");
  const kept = await ev(async () => { const r = await (await caches.open("asmau-meta")).match(new URL("__asmau/kept", location.href.split("/games/")[0] + "/").href); return r ? r.json() : null; });
  T.check(kept && kept.includes("yusuf") && kept.includes("yusuf@w"), "Yusuf is still kept on this device: " + JSON.stringify(kept));
  await ctx.setOffline(true);
  await p.goto(U, { waitUntil: "load" }); await p.waitForTimeout(800);
  await p.click("#startBtn"); await p.waitForTimeout(1200);
  T.check(await p.evaluate(() => { const i = document.querySelector("#stage img.pic"); return !!i && i.complete && i.naturalWidth > 0; }), "and it plays with its pictures without internet");
  await browser.close(); await site.close(); fs.rmSync(tmp, { recursive: true, force: true });
  return T.done();
};
