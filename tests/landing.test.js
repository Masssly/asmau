// The landing page: sections, coming-soon cards that cannot be opened, the parents panel, the version.
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("landing page"), root = path.join(__dirname, ".."), site = await serve(root);
  const browser = await chromium.launch();
  const fs = require("fs"), repo = path.join(__dirname, "..");
  const games = JSON.parse(fs.readFileSync(path.join(repo, "manifest.json"), "utf8")).sections.reduce((a, s) => a.concat(s.games), [])
    .map((g) => JSON.parse(fs.readFileSync(path.join(repo, "games", g, "game.json"), "utf8")));
  const soon = games.filter((g) => g.status === "coming-soon").length, ready = games.length - soon;
  for (const [tag, vp] of [["phone", { width: 390, height: 844 }], ["tablet", { width: 1024, height: 768 }]]) {
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: "block" }), p = await ctx.newPage(), errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(site.url + "index.html", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
    T.check(await p.locator(".section").count() === 2, tag + ": two sections, both open");
    // which games are ready is read from the games themselves, so this does not go stale when one is finished
    T.check(await p.locator("a.tile").count() === ready, tag + ": the " + ready + " finished games can be opened");
    T.check(await p.locator(".tile.soon").count() === soon && await p.locator(".tile.soon a").count() === 0, tag + ": the " + soon + " unfinished games say Coming soon and have no link");
    T.check((await p.textContent("#verNote")).includes("Version 20"), tag + ": the version is shown: " + (await p.textContent("#verNote")).trim());
    await p.click("#parentsBtn"); await p.waitForTimeout(200);
    T.check(await p.locator("#parents .sheet").isVisible() && (await p.textContent("#parents")).includes("What’s new"), tag + ": the parents panel opens, with what's new");
    // the panel opens on a short home: recording first, then privacy and support, every other topic one tap away
    T.check(await p.locator('#parents [data-view="home"] .p-feature[data-go="record"]').isVisible() && await p.locator('#parents [data-go="privacy"]').isVisible() && await p.locator('#parents [data-go="support"]').isVisible(), tag + ": the panel's home leads with recording, privacy and support");
    await p.click('#parents [data-go="record"]');
    T.check(await p.locator('[data-view="record"] a[href="tools/record-voice/index.html"]').isVisible() && !(await p.locator('[data-view="home"]').isVisible()), tag + ": the recording topic opens on its own page, with the way to the recorder");
    await p.click("#pBack");
    T.check(await p.locator('[data-view="home"]').isVisible(), tag + ": “All topics” goes back");
    T.check(await p.locator("#voiceStrip").isVisible(), tag + ": the page itself shows the way to record your voice");
    await p.keyboard.press("Escape");
    T.check(!(await p.locator("#parents").isVisible()), tag + ": Escape closes it");
    await p.click("a.tile"); await p.waitForLoadState("networkidle");
    T.check((await p.title()).startsWith("Yusuf"), tag + ": the Yusuf card opens the game");
    T.check(errs.length === 0, tag + ": no page errors" + (errs[0] ? ": " + errs[0] : ""));
    await ctx.close();
  }
  await browser.close(); await site.close();
  return T.done();
};
