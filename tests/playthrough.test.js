// Plays the whole Yusuf story start to finish like a child would: every activity, wrong answers first.
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("playthrough"), site = await serve(path.join(__dirname, ".."));
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, serviceWorkers: "block" });
  const page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(site.url + "games/yusuf/index.html?skipms=300", { waitUntil: "networkidle" });
  const story = await page.evaluate(() => window.STORY);
  await page.click("#startBtn");
  const seen = new Set(); let steps = 0, optionsRead = 0;
  for (let ci = 0; ci < story.length; ci++) for (let si = 0; si < story[ci].steps.length; si++) {
    const st = story[ci].steps[si], o = st.opts || {}, where = `chapter ${ci + 1} step ${si + 1} (${st.play || "story"})`;
    steps++; seen.add(st.play || "story");
    await page.waitForTimeout(500);                                   // the double-tap guard
    try {
      if (st.say) { if (await page.locator(".stage.has-pic img.pic").count() !== 1) T.check(false, where + ": no picture"); }
      else if (st.play === "choice") {
        const bad = o.options.find((x) => !x.ok), ok = o.options.find((x) => x.ok);
        await page.waitForSelector(".choice.reading", { timeout: 6000 }).then(() => optionsRead++).catch(() => {});
        await page.locator(".choice", { hasText: bad.label }).click();
        await page.waitForTimeout(300);
        await page.locator(".choice", { hasText: ok.label }).click();
      } else if (st.play === "sky") { for (const b of await page.locator(".body").all()) await b.click(); }
      else if (st.play === "count") { for (const b of await page.locator(".coin").all()) await b.click(); }
      else if (st.play === "gates") { for (const b of await page.locator(".gate").all()) await b.click(); }
      else if (st.play === "order") { for (const c of o.cards) await page.locator(".ocard", { hasText: c.label }).click(); }
      else if (st.play === "puzzle") {
        for (let g = 0; g < 12; g++) {
          const order = await page.evaluate(() => Array.from(document.querySelectorAll(".ptile")).map((t) => { const [x, y] = t.style.backgroundPosition.split(" ").map(parseFloat); return Math.round(y / 100 * 2) * 3 + Math.round(x / 100 * 2); }));
          const i = order.findIndex((v, k) => v !== k); if (i < 0) break;
          await page.locator(".ptile").nth(i).click(); await page.locator(".ptile").nth(order.indexOf(i)).click();
        }
        if (await page.locator(".puzzle.whole").count() !== 1) T.check(false, where + ": puzzle not solved");
      } else if (st.play === "memory") {
        const faces = await page.evaluate(() => Array.from(document.querySelectorAll(".mem-face")).map((f) => f.textContent));
        const seenF = {}; faces.forEach((f, k) => (seenF[f] = seenF[f] || []).push(k));
        for (const f of Object.keys(seenF)) { await page.locator(".mem").nth(seenF[f][0]).click(); await page.locator(".mem").nth(seenF[f][1]).click(); }
      } else if (st.play === "pick") { for (const b of await page.locator(".pick:not(.thin)").all()) await b.click(); }
      else if (st.play === "sort") { for (const th of o.things) { await page.locator(".choice").nth(1 - th.bin).click(); await page.waitForTimeout(150); await page.locator(".choice").nth(th.bin).click(); } }
      else { await page.locator("#nextBtn.skip").waitFor({ state: "visible", timeout: 8000 }); }       // the older activities: Skip appears after a quiet moment
      await page.locator("#nextBtn").waitFor({ state: "visible", timeout: 9000 });
    } catch (e) { T.check(false, where + ": " + e.message.split("\n")[0]); await page.locator("#nextBtn").waitFor({ state: "visible", timeout: 9000 }).catch(() => {}); }
    await page.click("#nextBtn");
  }
  await page.waitForTimeout(500);
  T.check(await page.locator("#end").isVisible(), `reached the end after ${steps} steps (${[...seen].join(", ")})`);
  T.check(optionsRead > 0, `answers were read aloud (highlighted) in ${optionsRead} questions`);
  T.check(errs.length === 0, "no page errors" + (errs[0] ? ": " + errs[0] : ""));
  await browser.close(); await site.close();
  return T.done();
};
