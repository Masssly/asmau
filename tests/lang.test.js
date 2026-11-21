// Languages (shared/lang.js): a game in another language shows and says its translated words, keeps its pictures,
// activities and page numbers; a draft is seen only with ?lang=; a game without the language stays in English.
"use strict";
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("languages"), repo = path.join(__dirname, "..");
  const tr = JSON.parse(fs.readFileSync(path.join(repo, "games/rahmah/lang/id.json"), "utf8"));
  const site = await serve(repo), browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("asmau-lang", "id"); } catch (e) { /* */ } });
  const p = await ctx.newPage();
  const sounds = [];
  p.on("request", (r) => { if (/\.mp3(\?|$)/.test(r.url())) sounds.push(r.url()); });
  const G = site.url + "games/rahmah/index.html?skipms=300";

  // 1. a family that chose Indonesian: a draft is not shown to them; a checked translation is
  await p.goto(G, { waitUntil: "networkidle" }); await p.waitForTimeout(400);
  if (tr.status !== "checked") T.check((await p.textContent("#startBtn")).trim() === "Start the story", "a draft translation is not shown to families");
  else T.check((await p.textContent("#startBtn")).trim() === "Mulai cerita", "a family that chose Indonesian plays Rahmah in Indonesian");

  // 2. the person checking it opens it with ?lang=id
  await p.goto(G + "&lang=id", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
  T.check((await p.textContent("#startBtn")).trim() === "Mulai cerita", "the start button is in Indonesian: " + (await p.textContent("#startBtn")));
  T.check((await p.textContent("#title h2")).trim() === "Kisah Rahmah El Yunusiyyah", "the title is in Indonesian");
  T.check(/Rahmah El Yunusiyyah \(1900/.test(await p.textContent("details.parents")), "the For parents box stays in English");
  await p.click("#startBtn"); await p.waitForTimeout(900);
  T.check((await p.textContent("#captionText")).trim() === tr.lines["r1-a"], "the first page reads in Indonesian");
  T.check((await p.textContent("#chTitle")).trim() === "Gadis dari Pegunungan" && /^Bab 1 dari 11$/.test((await p.textContent("#chNum")).trim()), "the chapter heading is in Indonesian: " + (await p.textContent("#chNum")));
  T.check(/halaman 1\.1/.test(await p.textContent("#pnoteSum")), "the page number is kept: " + (await p.textContent("#pnoteSum")));
  T.check(await p.evaluate(() => { const i = document.querySelector("#stage img.pic"); return !!i && i.complete && i.naturalWidth > 0; }), "the picture is the same");
  sounds.length = 0;
  await p.click("#caption"); await p.waitForTimeout(800);
  T.check(sounds.some((u) => /\/assets\/audio-id\/r1-a\.mp3/.test(u)), "it plays the Indonesian clip: " + sounds.slice(-2).join(" "));
  // a choice: its options in Indonesian
  for (let i = 0; i < 4; i++) { await p.click("#nextBtn"); await p.waitForTimeout(500); }
  const opts = await p.$$eval("#stage button", (bs) => bs.map((b) => b.textContent.trim()).filter(Boolean));
  T.check(opts.some((o) => o.includes("Di pegunungan Sumatra")), "the answers of a question are in Indonesian: " + JSON.stringify(opts));

  // 3. a game with no Indonesian stays English, even when asked for it (every game has a draft now, so Yusuf's is
  // taken away for this check: its file is not found, and the home page's list does not know it)
  // (in a context without the service worker, so that every request passes these routes)
  const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
  await ctx3.addInitScript(() => { try { localStorage.setItem("asmau-lang", "id"); } catch (e) { /* */ } });
  const p3 = await ctx3.newPage();
  await p3.route(/yusuf\/lang\/id\.json|lang\/id\/yusuf\.json/, (r) => r.fulfill({ status: 404, body: "" }));
  await p3.route(/games\/index\.json/, async (r) => {
    const res = await r.fetch(), j = await res.json();
    (j.sections || []).forEach((s) => (s.games || []).forEach((g) => { if (g.slug === "yusuf" && g.tr) delete g.tr.id; }));
    await r.fulfill({ response: res, json: j });
  });
  await p3.goto(site.url + "games/yusuf/index.html?lang=id", { waitUntil: "networkidle" }); await p3.waitForTimeout(400);
  T.check((await p3.textContent("#startBtn")).trim() === "Start the story", "a game not translated stays wholly English");

  // 4. the home page: the language choice, the card in Indonesian, the others marked as English for now
  await p3.goto(site.url + "index.html?lang=id", { waitUntil: "networkidle" }); await p3.waitForTimeout(600);
  const card = await p3.textContent("a.tile[data-slug=rahmah]");
  T.check(card.includes("Gadis dari pegunungan Sumatra"), "Rahmah's card is in Indonesian");
  T.check((await p3.textContent("a.tile[data-slug=yusuf]")).includes("Untuk sementara dalam bahasa Inggris"), "a game not translated says it is in English for now");
  T.check(await p3.isVisible("text=Kisah Para Nabi"), "the section titles are in Indonesian");
  T.check(!(await p3.$("#langItem[hidden]")), "For parents offers the language choice");
  await browser.close();

  // 5. a family in English (nothing chosen): English everywhere; the language choice only once a translation is checked
  {
    const b2 = await chromium.launch(), p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
    await p2.goto(site.url + "index.html", { waitUntil: "networkidle" }); await p2.waitForTimeout(500);
    T.check((await p2.textContent("a.tile[data-slug=rahmah]")).includes("The girl from the mountains"), "an English family sees Rahmah's card in English");
    if (tr.status !== "checked") T.check(!!(await p2.$("#langItem[hidden]")), "until a translation is checked, families see no language choice");
    else {
      T.check(!(await p2.$("#langItem[hidden]")), "with a checked translation, For parents offers the language choice");
      // they choose Bahasa Indonesia in For parents: the page comes back in Indonesian, and so does the game
      await p2.click("#parentsBtn"); await p2.click("[data-go=language]");
      await Promise.all([p2.waitForNavigation({ waitUntil: "networkidle" }), p2.click("#langPick [data-lang=id]")]);
      await p2.waitForTimeout(600);
      T.check(await p2.isVisible("text=Kisah Para Nabi") && (await p2.textContent("a.tile[data-slug=rahmah]")).includes("Gadis dari pegunungan"), "choosing Bahasa Indonesia turns the home page and Rahmah's card Indonesian");
      await p2.goto(G, { waitUntil: "networkidle" }); await p2.waitForTimeout(400);
      T.check((await p2.textContent("#startBtn")).trim() === "Mulai cerita", "and Rahmah opens in Indonesian");
      // the game's own For parents box: the language, and back to English from there
      await p2.click("details.parents summary");
      const row = p2.locator("details.parents .voice-pick[aria-label='Language'], details.parents .voice-pick[aria-label='Bahasa']");
      T.check(await row.locator("[lang=id][aria-checked=true]").count() === 1, "Rahmah's For parents box shows the language, Indonesian chosen");
      await Promise.all([p2.waitForNavigation({ waitUntil: "networkidle" }), row.locator("[lang=en]").click()]);
      await p2.waitForTimeout(500);
      T.check((await p2.textContent("#startBtn")).trim() === "Start the story", "choosing English there brings the game back in English");
      // the home page: a language button at the top, and the choice on the front of For parents
      await p2.goto(site.url + "index.html", { waitUntil: "networkidle" }); await p2.waitForTimeout(600);
      T.check(await p2.isVisible("#langBtn") && (await p2.textContent("#langNow")).trim() === "English", "the home page has a language button at the top, showing English");
      await p2.click("#langBtn"); await p2.waitForTimeout(300);
      T.check(await p2.isVisible('.p-view[data-view="language"] [data-lang=id]'), "it opens the language choice");
      await p2.click("#parentsClose"); await p2.click("#parentsBtn"); await p2.waitForTimeout(300);
      T.check(await p2.isVisible("#langFront [data-lang=id]"), "the front of For parents shows the language choice too");
    }
    await b2.close();
  }
  await site.close();
  return T.done();
};
