// The grown-up check before any link that leaves Asmau, and the app mode without donation links.
"use strict";
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("grown-up check"), site = await serve(path.join(__dirname, "..")), U = site.url;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  // no page of another site may open unchecked (pictures from the media server are fine, and blocked here too)
  const outside = [];
  await ctx.route((url) => !url.href.startsWith(U), (r) => { if (r.request().isNavigationRequest()) outside.push(r.request().url()); r.abort(); });
  const page = await ctx.newPage();
  const solve = () => page.evaluate(() => {
    const W = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const m = /What is (\w+) times (\w+)\?/.exec(document.getElementById("agate-q").textContent);
    return W.indexOf(m[1]) * W.indexOf(m[2]);
  });

  // a verse link in a story (written by the story code)
  await page.goto(U + "games/yusuf/index.html?skipms=300", { waitUntil: "networkidle" });
  await page.click("#startBtn"); await page.waitForTimeout(600);
  await page.click("#chSource");
  T.check(await page.isVisible(".agate-box"), "a verse link asks a grown-up first");
  T.check(/What is \w+ times \w+\?/.test(await page.textContent("#agate-q")), "with a sum written in words: " + await page.textContent("#agate-q"));
  await page.fill("#agate-a", "1"); await page.click("#agate-go");
  T.check(await page.isVisible(".agate-box") && /not it/.test(await page.textContent("#agate-err")), "a wrong answer gives a new sum and opens nothing");
  T.check(outside.length === 0 && ctx.pages().length === 1, "nothing was opened");
  await page.click("#agate-no");
  T.check(!(await page.isVisible(".agate-back")) && ctx.pages().length === 1, "Cancel closes it and opens nothing");
  await page.click("#chSource");
  await page.fill("#agate-a", String(await solve()));
  const [popup] = await Promise.all([ctx.waitForEvent("page", { timeout: 5000 }).catch(() => null), page.click("#agate-go")]);
  await page.waitForTimeout(800);
  T.check(!!popup && outside.some((u) => /quran\.com\/12/.test(u)), "the right answer opens the verse in a new tab: " + outside.join());
  outside.length = 0;
  T.check(page.url().startsWith(U + "games/yusuf/"), "and the game stays where it was");
  if (popup) await popup.close();
  // keys held down or the middle button do not skip it
  await page.click("#chSource", { modifiers: ["Control"] });
  T.check(await page.isVisible(".agate-box") && ctx.pages().length === 1, "a click with Ctrl held is checked too");
  await page.keyboard.press("Escape");
  T.check(!(await page.isVisible(".agate-back")), "Escape closes it");
  await page.click("#chSource", { button: "middle" });
  T.check(ctx.pages().length === 1, "the middle button opens nothing");
  if (await page.isVisible(".agate-back")) await page.keyboard.press("Escape");

  // a link inside the site is never checked
  await page.goto(U + "index.html", { waitUntil: "networkidle" });
  await page.click("#parentsBtn"); await page.click('[data-go="support"]'); await page.waitForTimeout(300);
  T.check(await page.isVisible('a[href*="ko-fi.com"]'), "the website shows the donation link");
  await page.click('a[href*="ko-fi.com"]');
  T.check(await page.isVisible(".agate-box"), "and checks for a grown-up before it");
  await page.keyboard.press("Escape");
  await page.goto(U + "privacy.html", { waitUntil: "networkidle" });
  await page.click('a[href="index.html"], a.btn-back');
  T.check(!page.url().includes("privacy") && !(await page.isVisible(".agate-back")), "a link within Asmau is not checked");

  // app mode
  await page.goto(U + "index.html?app=ios", { waitUntil: "networkidle" });
  await page.click("#parentsBtn"); await page.click('[data-go="support"]'); await page.waitForTimeout(300);
  T.check(!(await page.isVisible('a[href*="ko-fi.com"]')) && !/Donate/.test(await page.innerText(".sheet")), "in the app there is no donation link or wording");
  await page.click("#pBack");
  T.check(/Share it, or tell us a mistake/.test(await page.innerText(".sheet")), "the support card reads without donating");
  await page.goto(U + "tools/record-voice/index.html", { waitUntil: "networkidle" });
  T.check(await page.evaluate(() => document.documentElement.getAttribute("data-asmau-app")) === "ios", "the app mode is remembered on other pages");
  await page.evaluate(() => { const s = document.getElementById("syncSupport"); s.hidden = false; });
  T.check(!(await page.isVisible("#syncSupport")), "the recorder's donation note stays hidden in the app");
  await page.goto(U + "index.html?app=web", { waitUntil: "networkidle" });
  T.check(await page.evaluate(() => !document.documentElement.hasAttribute("data-asmau-app")), "?app=web goes back to the website");
  T.check(outside.length === 0, "no other site was opened unchecked" + (outside.length ? ": " + outside.join() : ""));

  await browser.close(); await site.close();
  return T.done();
};
