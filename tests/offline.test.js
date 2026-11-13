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
    const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
    const listed = JSON.parse(sw.match(/const SHELL = (\[[\s\S]*?\]);/)[1]).length + Object.keys(JSON.parse(sw.match(/const MEDIA = (\{[\s\S]*?\});/)[1])).length;
    const saved = await page.evaluate(async () => { let n = 0; for (const k of (await caches.keys()).filter((x) => x.startsWith("asmau-"))) n += (await (await caches.open(k)).keys()).filter((r) => !r.url.endsWith("media-index.json")).length; return n; });
    T.check(saved === listed, `the saved copy holds all ${listed} files (found ${saved})`);
    await ctx.setOffline(true);
    await page.goto(U + "games/yusuf/index.html", { waitUntil: "load" }); await page.waitForTimeout(600);
    T.check((await page.title()).startsWith("Yusuf"), "the Yusuf game opens with no network");
    await page.click("#startBtn"); await page.waitForTimeout(400);
    T.check((await page.textContent("#captionText")).includes("wonderful dream"), "the story runs with no network");
    T.check(await page.evaluate(() => document.fonts.ready.then(() => document.fonts.check('16px "Baloo 2"'))), "fonts load from the local copies");
    const outside = await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => !r.name.startsWith(location.origin)).map((r) => r.name));
    T.check(outside.length === 0, "no request leaves the site" + (outside.length ? ": " + outside.join() : ""));
    T.check(errs.length === 0, "no page errors offline" + (errs[0] ? ": " + errs[0] : ""));
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
