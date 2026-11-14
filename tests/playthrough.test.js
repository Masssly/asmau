// Plays every story game start to finish like a child would: every activity, wrong answers first.
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

const fs = require("fs");
module.exports = async function () {
  const T = checker("playthrough"), site = await serve(path.join(__dirname, ".."));
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  // every game that has a story
  const games = fs.readdirSync(path.join(__dirname, "..", "games")).filter((g) => fs.existsSync(path.join(__dirname, "..", "games", g, "story.js")));
  for (const game of games) await play(game);
  await browser.close(); await site.close();
  return T.done();

  async function play(game) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, serviceWorkers: "block" });
  const page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(site.url + "games/" + game + "/index.html?skipms=300", { waitUntil: "networkidle" });
  const story = await page.evaluate(() => window.STORY), art = await page.evaluate(() => window.STORY_ART || {});
  await page.click("#startBtn");
  const seen = new Set(); let steps = 0, optionsRead = 0;
  for (let ci = 0; ci < story.length; ci++) for (let si = 0; si < story[ci].steps.length; si++) {
    const st = story[ci].steps[si], o = st.opts || {}, where = `chapter ${ci + 1} step ${si + 1} (${st.play || "story"})`;
    steps++; seen.add(st.play || "story");
    await page.waitForTimeout(500);                                   // the double-tap guard
    try {
      if (st.say) {
        // a narrated scene shows its picture if it has one, and otherwise something drawn: never an empty stage
        if (art[st.pic || st.say]) { if (await page.locator(".stage.has-pic img.pic").count() !== 1) T.check(false, where + ": no picture"); }
        else if (await page.locator(".stage .sp").count() < 1) T.check(false, where + ": nothing drawn in the scene");
      }
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
        const faces = await page.evaluate(() => Array.from(document.querySelectorAll(".mem")).map((f) => f.dataset.icon));
        const seenF = {}; faces.forEach((f, k) => (seenF[f] = seenF[f] || []).push(k));
        for (const f of Object.keys(seenF)) { await page.locator(".mem").nth(seenF[f][0]).click(); await page.locator(".mem").nth(seenF[f][1]).click(); }
      } else if (st.play === "pick") { for (const b of await page.locator(".pick:not(.thin)").all()) await b.click(); }
      else if (st.play === "sort") { for (const th of o.things) { await page.locator(".choice").nth(1 - th.bin).click(); await page.waitForTimeout(150); await page.locator(".choice").nth(th.bin).click(); } }
      else if (st.play === "change") { for (let k = 1; k < o.states.length; k++) { await page.locator(".chg-btn").click(); await page.waitForTimeout(1300); } }
      else if (st.play === "build") { for (let k = 0; k < o.n; k++) await page.locator(".build-btn").click(); }
      else if (st.play === "trail") { for (let k = 0; k < o.n; k++) await page.locator(".trail-spot.next").click(); }
      else if (st.play === "seek") { await page.locator(".seek-target").click({ force: true }); }
      else if (st.play === "wipe") {
        const b = await page.locator(".wipe-cv").boundingBox();
        await page.mouse.move(b.x + 5, b.y + 5); await page.mouse.down();
        for (let r = 0; r < 7; r++) { const y = b.y + b.height * (r + 0.5) / 7; await page.mouse.move(r % 2 ? b.x + b.width - 4 : b.x + 4, y, { steps: 2 }); await page.mouse.move(r % 2 ? b.x + 4 : b.x + b.width - 4, y, { steps: 14 }); }
        await page.mouse.up();
      } else if (st.play === "part") {
        const b = await page.locator(".part-btn").boundingBox();
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout((o.ms || 3600) + 500); await page.mouse.up();
      }
      else { await page.locator("#nextBtn.skip").waitFor({ state: "visible", timeout: 8000 }); }       // the older activities: Skip appears after a quiet moment
      await page.locator("#nextBtn").waitFor({ state: "visible", timeout: 9000 });
    } catch (e) { T.check(false, where + ": " + e.message.split("\n")[0]); await page.locator("#nextBtn").waitFor({ state: "visible", timeout: 9000 }).catch(() => {}); }
    await page.click("#nextBtn");
  }
  await page.waitForTimeout(500);
  T.check(await page.locator("#end").isVisible(), `${game}: reached the end after ${steps} steps (${[...seen].join(", ")})`);
  T.check(optionsRead > 0, `${game}: answers were read aloud (highlighted) in ${optionsRead} questions`);
  T.check(errs.length === 0, game + ": no page errors" + (errs[0] ? ": " + errs[0] : ""));
  await ctx.close();
  }
};
