// The landing page: sections, coming-soon cards that cannot be opened, the parents panel, the version.
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("landing page"), root = path.join(__dirname, ".."), site = await serve(root);
  const browser = await chromium.launch();
  for (const [tag, vp] of [["phone", { width: 390, height: 844 }], ["tablet", { width: 1024, height: 768 }]]) {
    const ctx = await browser.newContext({ viewport: vp, serviceWorkers: "block" }), p = await ctx.newPage(), errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(site.url + "index.html", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
    T.check(await p.locator(".section").count() === 2, tag + ": two sections, both open");
    T.check(await p.locator("a.tile").count() === 1, tag + ": only Yusuf can be opened");
    T.check(await p.locator(".tile.soon").count() === 4 && await p.locator(".tile.soon a").count() === 0, tag + ": the four unfinished games say Coming soon and have no link");
    T.check((await p.textContent("#verNote")).includes("Version 20"), tag + ": the version is shown: " + (await p.textContent("#verNote")).trim());
    await p.click("#parentsBtn"); await p.waitForTimeout(200);
    T.check(await p.locator("#parents .sheet").isVisible() && (await p.textContent("#parents")).includes("What’s new"), tag + ": the parents panel opens, with what's new");
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
