// A release downloads only what changed, and an open page shows new code without a hard refresh.
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("updates"), repo = path.join(__dirname, "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asmau-site-"));
  for (const d of ["games", "shared", "fonts", "icons", "tools", "scripts", "packs"]) fs.cpSync(path.join(repo, d), path.join(tmp, d), { recursive: true });
  for (const f of ["index.html", "manifest.json", "app.webmanifest", "sw.js", "version.json", "config.json", "reset.html", "privacy.html"]) fs.copyFileSync(path.join(repo, f), path.join(tmp, f));
  const site = await serve(tmp), browser = await chromium.launch();
  const ctx = await browser.newContext({ serviceWorkers: "allow", viewport: { width: 390, height: 780 } }), p = await ctx.newPage();
  const U = site.url + "games/yusuf/index.html";
  await p.goto(U, { waitUntil: "networkidle" }); await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(1500);
  // a parent downloads the whole game (games are otherwise kept only as they are played)
  await p.evaluate(() => navigator.serviceWorker.ready.then((r) => r.active.postMessage({ type: "asmau-want", packs: ["yusuf", "yusuf@w"], voice: "w" })));
  for (let t = 0; t < 60; t++) {
    const n = await p.evaluate(async () => (await (await caches.open("asmau-files")).keys()).filter((r) => r.url.includes("/games/yusuf/assets/")).length);
    if (n > 250) break; await p.waitForTimeout(1000);
  }
  const names = await p.evaluate(() => caches.keys());
  T.check(names.length === 2 && names.includes("asmau-files") && names.includes("asmau-meta"), "two caches: the saved files and the pack lists: " + names.join());

  // release 2: one picture and one script change
  fs.copyFileSync(path.join(tmp, "games/yusuf/assets/img/c3-b.webp"), path.join(tmp, "games/yusuf/assets/img/c1-b.webp"));
  fs.appendFileSync(path.join(tmp, "games/yusuf/story.js"), "\n// release 2\n");
  execSync("node scripts/build-offline.js", { cwd: tmp, stdio: "ignore" });
  site.log.length = 0;
  await p.goto(U, { waitUntil: "load" }); await p.waitForTimeout(7000);
  const media = site.log.filter((l) => /\.(webp|mp3|woff2|png)$/.test(l));
  T.check(media.length <= 3 && media.some((l) => l.endsWith("c1-b.webp")), "the release downloaded only the changed picture (" + media.length + " of ~240 media files asked for)");
  T.check((await p.evaluate(() => fetch("story.js").then((r) => r.text()))).includes("// release 2"), "the changed script is the new one at once");
  const h2 = JSON.parse(fs.readFileSync(path.join(tmp, "packs/yusuf.json"), "utf8")).files["games/yusuf/assets/img/c1-b.webp"];
  const len = await p.evaluate(async (h) => { const c = await caches.open("asmau-files");
    const k = (await c.keys()).find((r) => r.url.endsWith("/" + h + "/games/yusuf/assets/img/c1-b.webp")); return k ? (await c.match(k)).headers.get("content-length") : null; }, h2);
  T.check(Number(len) === fs.statSync(path.join(tmp, "games/yusuf/assets/img/c1-b.webp")).size, "the changed picture itself was replaced");
  // release 3: only a page changes; no media at all. First let the downloads of the earlier releases finish (the
  // first visit saves the game's whole pack in the background), so that only this release's requests are counted.
  for (let quiet = 0, last = -1, t = 0; quiet < 3 && t < 120; t++) {
    await p.waitForTimeout(1000);
    const n = site.log.length; quiet = n === last ? quiet + 1 : 0; last = n;
  }
  fs.appendFileSync(path.join(tmp, "games/yusuf/story.js"), "// release 3\n");
  execSync("node scripts/build-offline.js", { cwd: tmp, stdio: "ignore" });
  site.log.length = 0;
  await p.goto(U, { waitUntil: "load" }); await p.waitForTimeout(5000);
  T.check(!site.log.some((l) => /\.(webp|mp3|woff2|png)$/.test(l)), "a release that changes no pictures or sounds downloads none");
  // the version label
  T.check(/Version 20\d\d\.\d\d\.\d+/.test(await p.textContent("[data-asmau-version]")), "the game shows its version");
  await browser.close(); await site.close(); fs.rmSync(tmp, { recursive: true, force: true });
  return T.done();
};
