// Offline use, resume by name, no Arabic from a computer voice, grain that waits, moving recordings by file.
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("offline and saved progress"), root = path.join(__dirname, ".."), site = await serve(root);
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required", "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] });
  const U = site.url;

  { // offline
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, serviceWorkers: "allow" });
    const page = await ctx.newPage(), errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    await page.goto(U + "index.html", { waitUntil: "networkidle" });
    await page.evaluate(() => navigator.serviceWorker.ready); await page.waitForTimeout(3000);
    // what each pack holds (scripts/build-offline.js writes packs/<pack>.json); the saved copies are in "asmau-files"
    const PK = {}; for (const f of fs.readdirSync(path.join(root, "packs"))) PK[f.slice(0, -5)] = Object.keys(JSON.parse(fs.readFileSync(path.join(root, "packs", f), "utf8")).files).length;
    const core = PK.core, yusuf = PK.yusuf + PK["yusuf@w"], yusufMan = PK["yusuf@m"];
    // an English-speaking family with the woman's voice: each game and its @w narration (not @m, not another language)
    const allOneVoice = Object.keys(PK).filter((p) => !p.includes("@") || p.endsWith("@w")).reduce((n, p) => n + PK[p], 0);
    const count = (re) => page.evaluate(async (src) => { const re = new RegExp(src);
      return (await (await caches.open("asmau-files")).keys()).filter((r) => re.test(new URL(r.url).pathname)).length; }, re.source);
    T.check(await count(/./) === core, `the first visit saves the ${core} files of the home page only (found ${await count(/./)})`);
    T.check(await count(/\/games\/[^/]+\/assets\//) === 0, "no game's pictures or sounds are downloaded before the game is opened");
    // opening a game downloads only what is shown (data costs money); the whole game is the parent's choice
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "networkidle" }); await page.waitForTimeout(2500);
    const opened = await count(/\/games\/yusuf\/assets\//);
    T.check(opened <= 3, `opening Yusuf does not download the whole game (${opened} of its pictures and sounds saved)`);
    await page.click("details.parents summary"); await page.waitForTimeout(800);
    const offer = await page.textContent(".offline-ctl");
    T.check(/Download the whole game · \d+ MB/.test(offer), "its For parents box offers to download the whole game, with its size: " + offer.replace(/\s+/g, " ").slice(0, 90));
    await page.click(".offline-ctl button");
    for (let t = 0; t < 90 && await count(/./) < core + yusuf; t++) await page.waitForTimeout(1000);
    T.check(await count(/./) >= core + yusuf, `Download saves its ${yusuf} pages, pictures and sounds, in the woman's voice (found ${await count(/./) - core})`);
    for (let t = 0; t < 10 && !/whole game is on this device/.test(await page.textContent(".offline-ctl")); t++) await page.waitForTimeout(1000);
    T.check(/whole game is on this device \(\d+ MB\)/.test(await page.textContent(".offline-ctl")) && /Delete from this device/.test(await page.textContent(".offline-ctl")),
      "then it says the whole game is on this device, with its size, and offers to delete it");
    T.check(await count(/\/games\/yusuf\/assets\/audio-m\//) === 0, "and not the man's voice, which this family has not chosen");
    T.check(await count(/\/games\/musa\/(?!cover\.webp|game\.json)/) === 0, "and nothing of the other games");
    await ctx.setOffline(true);
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "load" }); await page.waitForTimeout(600);
    T.check((await page.title()).startsWith("Yusuf"), "the Yusuf game opens with no network");
    await page.click("#startBtn"); await page.waitForTimeout(400);
    T.check((await page.textContent("#captionText")).includes("wonderful dream"), "the story runs with no network");
    await page.waitForTimeout(800);
    T.check(await page.evaluate(() => { const i = document.querySelector("#stage img.pic"); return !!i && i.complete && i.naturalWidth > 0; }), "its pictures show with no network");
    T.check(await page.evaluate(() => document.fonts.ready.then(() => document.fonts.check('16px "Baloo 2"'))), "fonts load from the local copies");
    const outside = await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => !r.name.startsWith(location.origin)).map((r) => r.name));
    T.check(outside.length === 0, "no request leaves the site" + (outside.length ? ": " + outside.join() : ""));
    T.check(errs.length === 0, "no page errors offline" + (errs[0] ? ": " + errs[0] : ""));
    // For parents > Without internet > Save every game
    await ctx.setOffline(false);
    await page.goto(U + "index.html", { waitUntil: "networkidle" });
    await page.click("#parentsBtn"); await page.click('[data-go="offline"]'); await page.waitForTimeout(800);
    T.check(/Save every game \(about \d+ MB\)/.test(await page.textContent("#saveAllBtn")), "Without internet offers to save every game, with its size: " + await page.textContent("#saveAllBtn"));
    // game by game: what is on this device, its size, and Delete to free the space
    const row = await page.$eval("#offlineList", (ul) => [...ul.querySelectorAll("li")].map((li) => li.textContent).find((x) => x.startsWith("Yusuf")) || "");
    T.check(/Downloaded · \d+ MB/.test(row) && /Delete/.test(row), "the list shows Yusuf downloaded, with its size, and a Delete button: " + row);
    T.check(/Asmau uses \d+ MB on this device · 1 game downloaded/.test(await page.textContent("#offlineSum")), "and how much Asmau uses on this device: " + await page.textContent("#offlineSum"));
    page.once("dialog", (d) => d.accept());
    await page.click('#offlineList button[aria-label^="Delete Yusuf"]');
    for (let t = 0; t < 20 && await count(/\/games\/yusuf\/assets\//) > 0; t++) await page.waitForTimeout(500);
    T.check(await count(/\/games\/yusuf\/assets\//) === 0, "Delete removes all of Yusuf's pictures and sounds from this device");
    T.check(await page.evaluate(() => !!localStorage.getItem("asmau-yusuf")), "and keeps the child's progress");
    await page.click("#saveAllBtn");
    // the whole site is over 2,000 files: allow up to five minutes on a slow test machine
    for (let t = 0; t < 300 && !/Every game is saved/.test(await page.textContent("#saveAllStatus")); t++) await page.waitForTimeout(1000);
    const savedAll = await count(/./), statusText = await page.textContent("#saveAllStatus");
    T.check(/Every game is saved/.test(statusText) && savedAll === allOneVoice, `Save every game saves all ${allOneVoice} files, in the chosen voice only (saved ${savedAll}; status: ${statusText.slice(0, 60)})`);
    // For parents > Your voice: choosing the man's voice fetches it for the games already on this device
    await page.click('#parentsBack, .sheet-backbtn').catch(() => {});
    await page.evaluate(() => { const b = document.querySelector('[data-voice="m"]'); b.click(); });
    // every game is on this device, so the switch fetches the man's clips for all of them (Yusuf comes last)
    for (let t = 0; t < 240 && await count(/\/games\/yusuf\/assets\/audio-m\//) < yusufMan; t++) await page.waitForTimeout(1000);
    const gotMan = await count(/\/games\/yusuf\/assets\/audio-m\//);
    T.check(gotMan === yusufMan && await page.evaluate(() => localStorage.getItem("asmau-voice")) === "m",
      `choosing the man's voice saves his ${yusufMan} clips for Yusuf too (${gotMan} saved)`);
    await ctx.close();
  }
  { // resume by name
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "networkidle" });
    await page.click("#startBtn"); await page.waitForTimeout(600);
    await page.click("#mapBtn"); await page.locator(".chapter-tile").nth(4).click(); await page.waitForTimeout(700); await page.click("#nextBtn");
    await page.waitForTimeout(600);
    const here = await page.textContent("#captionText"), title = await page.textContent("#chTitle");
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("asmau-yusuf")));
    T.check(saved.chapter === "c5" && typeof saved.line === "string", "progress is saved by name: " + JSON.stringify({ chapter: saved.chapter, line: saved.line, nth: saved.nth }));
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "networkidle" });
    T.check(/Continue/.test(await page.textContent("#startBtn")), "the title offers to continue");
    await page.click("#startBtn"); await page.waitForTimeout(500);
    T.check((await page.textContent("#chTitle")) === title && (await page.textContent("#captionText")) === here, "it resumes on the same step");
    // a save made by the older, position-based version still works, and a vanished step falls back to its chapter
    await page.evaluate(() => localStorage.setItem("asmau-yusuf", JSON.stringify({ at: 3, step: 1 })));
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "networkidle" });
    T.check(/Chapter 4/.test(await page.textContent("#startBtn")), "an older numeric save is still understood");
    await page.evaluate(() => localStorage.setItem("asmau-yusuf", JSON.stringify({ chapter: "c6", line: "a-line-that-was-removed", nth: 0 })));
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "networkidle" });
    await page.click("#startBtn"); await page.waitForTimeout(500);
    T.check((await page.textContent("#chTitle")).includes("Two Dreams"), "a step that no longer exists falls back to the start of its chapter");
    await page.evaluate(() => localStorage.setItem("asmau-yusuf", JSON.stringify({ chapter: "c99", line: "x", nth: 0 })));
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "networkidle" });
    T.check(/Start the story/.test(await page.textContent("#startBtn")), "a chapter that no longer exists means starting afresh");
    await ctx.close();
  }
  { // the grain waits
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(U + "games/yusuf/index.html?skipms=300", { waitUntil: "networkidle" });
    await page.click("#mapBtn"); await page.locator(".chapter-tile").nth(7).click(); await page.waitForTimeout(600);
    for (let i = 0; i < 12; i++) { if (await page.locator(".wheat").count()) break; await page.waitForTimeout(500); await page.click("#nextBtn").catch(() => {}); }
    await page.waitForTimeout(800);
    const first = await page.locator(".wheat").count();
    await page.waitForTimeout(6000);
    T.check(first >= 1 && (await page.locator(".wheat").count()) >= 1 && (await page.locator(".wheat.wilt").count()) === 0, "grain is still there after 6 s: nothing is timed");
    await ctx.close();
  }
  { // recordings move by file
    const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, permissions: ["microphone"], acceptDownloads: true, serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(U + "tools/record-voice/index.html", { waitUntil: "networkidle" });
    await page.selectOption("#gameSelect", "yusuf"); await page.waitForTimeout(300);
    const rec = page.locator(".row").first().locator("button.record");
    await rec.click(); await page.waitForTimeout(900); await rec.click(); await page.waitForTimeout(1500);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#exportBtn")]);
    const file = path.join(require("os").tmpdir(), "asmau-test-voice.json"); await dl.saveAs(file);
    const bundle = JSON.parse(fs.readFileSync(file, "utf8"));
    T.check(bundle.app === "asmau-voice" && bundle.clips.length === 1, "the export file holds the recording");
    const ctx2 = await browser.newContext({ serviceWorkers: "block" }), p2 = await ctx2.newPage();
    await p2.goto(U + "tools/record-voice/index.html", { waitUntil: "networkidle" });
    await p2.setInputFiles("#importFile", file); await p2.waitForTimeout(800);
    const key = bundle.clips[0].key.split(":");
    T.check(await p2.evaluate(([g, i]) => window.AsmauNarration.getRecordedClip(g, i).then((b) => !!b && b.size > 0), key), "a second device restores it from the file");
    await p2.setInputFiles("#importFile", { name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"hello":1}') }); await p2.waitForTimeout(400);
    T.check(/not an Asmau voice file/i.test(await p2.textContent("#transferStatus")), "a wrong file is refused with a clear message");
    await ctx2.close(); await ctx.close();
  }
  await browser.close(); await site.close();
  return T.done();
};
