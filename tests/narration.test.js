// The narration player: one shared player, no request for files that do not exist, cut-off lines
// resolve, a missing file falls back, Arabic is never spoken by a computer voice, recordings win.
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("narration"), site = await serve(path.join(__dirname, ".."));
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await browser.newContext({ serviceWorkers: "block" });
  const page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.addInitScript(() => {
    window.__els = new Set(); window.__spoken = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { window.__els.add(this); return play.apply(this, arguments); };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speak: (u) => { window.__spoken.push(u.lang + "|" + u.text); setTimeout(() => u.onend && u.onend(), 50); }, cancel() {}, getVoices: () => [] } });
  });
  await page.goto(site.url + "games/yusuf/index.html", { waitUntil: "networkidle" });
  const N = "window.AsmauNarration";

  site.log.length = 0;
  await page.evaluate(`${N}.say("yusuf", "c1-a", "text")`);
  T.check(!site.log.some((p) => p.endsWith(".webm")), "a line asks for its .mp3 only, never for a .webm that does not exist");
  T.check(site.log.filter((p) => p.endsWith("c1-a.mp3")).length === 1, "and asks for it once");

  const played = await page.evaluate(async () => {
    const a = window.AsmauNarration.say("yusuf", "c1-b", "x"), b = new Promise((r) => setTimeout(r, 150)).then(() => window.AsmauNarration.say("yusuf", "c2-a", "y"));
    const first = await Promise.race([a.then(() => "first resolved"), new Promise((r) => setTimeout(() => r("first still pending"), 2500))]);
    await b;
    return { first, players: window.__els.size };
  });
  T.check(played.first === "first resolved", "a line cut off by the next one resolves instead of hanging");
  T.check(played.players === 1, "every line used the one shared player (" + played.players + ")");

  await page.evaluate(() => { window.__spoken.length = 0; });
  const t0 = Date.now();
  await page.evaluate(`${N}.say("yusuf", "no-such-line", "Hello there")`);
  const spoken = await page.evaluate(() => window.__spoken);
  T.check(spoken.length === 1 && spoken[0].endsWith("Hello there"), "a missing file falls back to the device voice (English)");
  T.check(Date.now() - t0 < 9000, "and does so promptly (" + (Date.now() - t0) + " ms)");
  await page.evaluate(() => { window.__spoken.length = 0; });
  await page.evaluate(`${N}.say("yusuf", "no-such-arabic", "الله", { lang: "ar" })`);
  T.check((await page.evaluate(() => window.__spoken)).length === 0, "Arabic is never given to a computer voice");

  // a recording on this device takes priority, and an unplayable one falls through to the committed file
  site.log.length = 0;
  await page.evaluate(async () => { await window.AsmauNarration.saveRecordedClip("yusuf", "c3-a", new Blob([new Uint8Array(40)], { type: "audio/x-nonsense" })); });
  await page.evaluate(`${N}.say("yusuf", "c3-a", "text")`);
  T.check(site.log.some((p) => p.endsWith("c3-a.mp3")), "an unplayable recording falls through to the committed file");
  T.check(errs.length === 0, "no page errors" + (errs[0] ? ": " + errs[0] : ""));
  await browser.close(); await site.close();
  return T.done();
};
