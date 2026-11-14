// Count with Me (games/count-the-crescents): played by touch like a toddler would, sloppy fingers included.
"use strict";
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

const GAME = "games/count-the-crescents/";
const ARABIC = /[؀-ۿ]/;

module.exports = async function () {
  const T = checker("counting game"), root = path.join(__dirname, ".."), site = await serve(root);
  const narration = JSON.parse(fs.readFileSync(path.join(root, GAME, "narration.json"), "utf8"));
  const langOf = Object.fromEntries(narration.map((l) => [l.id, l.lang]));
  const browser = await chromium.launch();

  // A page on a touch screen. Everything it asks the network for, everything handed to the
  // device's speech engine, and every line the game asks the narrator for is written down.
  async function open(viewport, { routes } = {}) {
    const ctx = await browser.newContext({ viewport, hasTouch: true, deviceScaleFactor: 1, serviceWorkers: "block" });
    await ctx.addInitScript(() => {
      window.__spoken = [];
      const note = (u) => { window.__spoken.push(String(u && u.text)); if (u && u.onend) setTimeout(() => u.onend(), 30); };
      try { window.speechSynthesis.speak = note; } catch (e) { /* no speech engine */ }
      try { Object.getPrototypeOf(window.speechSynthesis).speak = note; } catch (e) { /* no speech engine */ }
    });
    if (routes) await routes(ctx);
    const page = await ctx.newPage(), errs = [], asked = [];
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("request", (r) => asked.push(r.url()));
    await page.goto(site.url + GAME + "index.html", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      window.__said = [];
      const say = window.AsmauNarration.say;
      window.AsmauNarration.say = function (game, id, text, opts) { window.__said.push({ id, text, lang: (opts && opts.lang) || "en" }); return say.apply(this, arguments); };
    });
    return { ctx, page, errs, asked, cdp: await ctx.newCDPSession(page) };
  }

  const state = (page) => page.evaluate(() => window.AsmauCounting.state());
  const shown = (page) => page.evaluate(() => document.getElementById("numeral").textContent.trim());
  const lit = (page) => page.locator(".item.counted").count();
  const mid = async (loc) => { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  // a real finger: straight to the middle of the thing, whether or not it is wobbling
  const tap = async (page, sel) => { const p = await mid(typeof sel === "string" ? page.locator(sel).first() : sel); await page.touchscreen.tap(p.x, p.y); };
  // several fingers landing at the same moment
  const fingers = async (cdp, points) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: points.map((p, id) => ({ x: p.x, y: p.y, id })) });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  const hold = async (page, cdp, sel, ms) => {
    const p = await mid(page.locator(sel));
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y, id: 0 }] });
    await page.waitForTimeout(ms);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  const still = (page) => page.evaluate(() => {
    const d = document.scrollingElement || document.documentElement;
    return window.scrollX === 0 && window.scrollY === 0 && d.scrollTop === 0 && d.scrollHeight <= window.innerHeight && d.scrollWidth <= window.innerWidth &&
      (!window.visualViewport || Math.abs(window.visualViewport.scale - 1) < 0.001);
  });
  // every thing to count is a big target, on the screen, and not on top of another one
  const targets = (page) => page.evaluate(() => {
    // where each one is laid out, whatever its arriving animation is doing at this instant
    const st = document.getElementById("stage").getBoundingClientRect();
    const r = Array.from(document.querySelectorAll(".item")).map((e) => ({ left: st.left + e.offsetLeft, top: st.top + e.offsetTop, right: st.left + e.offsetLeft + e.offsetWidth, bottom: st.top + e.offsetTop + e.offsetHeight, width: e.offsetWidth, height: e.offsetHeight }));
    let small = 0, off = 0, over = 0;
    r.forEach((a, i) => {
      if (a.width < 72 || a.height < 72) small++;
      if (a.left < 0 || a.top < 0 || a.right > window.innerWidth || a.bottom > window.innerHeight) off++;
      r.slice(i + 1).forEach((b) => { if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) over++; });
    });
    return { n: r.length, small, off, over };
  });
  const uncounted = async (page) => (await page.evaluate(() => Array.from(document.querySelectorAll(".item:not(.counted)")).map((e) => e.getAttribute("data-i"))))
    .map((i) => page.locator('.item[data-i="' + i + '"]'));
  const ready = async (page, round) => {
    await page.waitForFunction((r) => window.AsmauCounting.state().round === r, round, { timeout: 15000 });
    await page.waitForTimeout(520);                                    // the new round ignores a hand that is still hammering
    return state(page);
  };
  // Taps everything that is left, one by one. Returns the taps after which the number shown was not the number of taps.
  const countAll = async (page) => {
    let wrong = 0;
    for (const it of await uncounted(page)) {
      const before = (await state(page)).count;
      await tap(page, it);
      await page.waitForTimeout(90);
      const s = await state(page);
      if (s.count !== before + 1 || await shown(page) !== String(before + 1) || await lit(page) !== before + 1) wrong++;
    }
    return wrong;
  };
  const cheered = async (page) => { await page.locator("#nextBtn").waitFor({ state: "visible", timeout: 12000 }); await page.waitForTimeout(760); };

  /* ---------- a phone held upright, counting to five ---------- */
  {
    const { ctx, page, errs, asked, cdp } = await open({ width: 390, height: 844 });
    const tag = "phone";
    T.check((await page.title()).startsWith("Count with Me"), tag + ": the page opens: " + await page.title());
    T.check(await page.locator("#startLittle").isVisible() && await page.locator("#startBig").isVisible(), tag + ": two big buttons to start");
    T.check(await page.evaluate(() => getComputedStyle(document.getElementById("stage")).touchAction === "none" && getComputedStyle(document.body).touchAction === "none" &&
      getComputedStyle(document.body).userSelect === "none" && /user-scalable=no/.test(document.querySelector("meta[name=viewport]").content)), tag + ": the page is told not to pan, zoom or select");

    await tap(page, "#startLittle");
    let s = await ready(page, 1);
    T.check(s.screen === "play" && s.level === 5 && s.count === 0 && s.target >= 1, tag + ": a tap on the big button starts a round (" + s.activity + ", " + s.target + ")");
    T.check((await page.evaluate(() => window.AsmauMusic.state().mood)) === "wonder", tag + ": the music starts with the first tap");

    // round 1 is left alone at the end: the game moves on by itself
    let slips = await countAll(page), box = await targets(page);
    await cheered(page);
    s = await state(page);
    T.check(slips === 0 && s.count === s.target && await shown(page) === String(s.target), tag + ": round 1: every tap counted one, and the big number is " + s.target);
    T.check(await page.locator("#cheerWord").isVisible() && s.trophies === 1, tag + ": the round ends with a cheer and a star");
    T.check(ARABIC.test(await page.textContent("#arabic")), tag + ": the Arabic numeral and word are shown as text: " + (await page.textContent("#arabic")).trim());
    await page.waitForFunction(() => window.AsmauCounting.state().round === 2, null, { timeout: 15000 }).catch(() => {});
    T.check((await state(page)).round === 2, tag + ": the next round starts by itself");

    const seen = new Set([s.activity]);
    let most = s.target, bad = box.small + box.off + box.over, total = slips;
    for (let round = 2; round <= 8; round++) {
      s = await ready(page, round);
      seen.add(s.activity); most = Math.max(most, s.target);
      box = await targets(page); bad += box.small + box.off + box.over;
      if (box.n !== s.target) T.check(false, tag + ": round " + round + " shows " + box.n + " things for " + s.target);

      if (round === 4 && s.target >= 4) {
        // sloppy and impatient fingers
        const its = await uncounted(page), a = await mid(its[0]), b = await mid(its[1]), c = await mid(its[2]), d = await mid(its[3]);
        await page.touchscreen.tap(a.x, a.y); await page.touchscreen.tap(a.x, a.y); await page.touchscreen.tap(a.x + 6, a.y - 5);
        await page.waitForTimeout(80);
        T.check((await state(page)).count === 1 && await shown(page) === "1" && await lit(page) === 1, tag + ": three quick taps on one thing count it once");
        await fingers(cdp, [b, c]);
        await page.waitForTimeout(80);
        T.check((await state(page)).count === 3 && await shown(page) === "3" && await lit(page) === 3, tag + ": two fingers on two things count two");
        await fingers(cdp, [a, { x: b.x + 4, y: b.y + 4 }, c]);
        await page.waitForTimeout(80);
        T.check((await state(page)).count === 3 && await shown(page) === "3", tag + ": fingers on things already counted change nothing");
        const empty = await page.evaluate(() => {
          const st = document.getElementById("stage").getBoundingClientRect(), r = Array.from(document.querySelectorAll(".item")).map((e) => e.getBoundingClientRect());
          for (let y = st.top + 30; y < st.bottom - 30; y += 12) for (let x = st.left + 30; x < st.right - 30; x += 12) {
            if (r.every((q) => x < q.left - 50 || x > q.right + 50 || y < q.top - 50 || y > q.bottom + 50)) return { x, y };
          }
          return null;
        });
        if (empty) {
          await page.touchscreen.tap(empty.x, empty.y);
          T.check(await page.locator("#fxLayer .puff, #fxLayer .spark").count() > 0 && (await state(page)).count === 3, tag + ": a tap on nothing sparkles and counts nothing");
        }
        await fingers(cdp, [{ x: d.x - 9, y: d.y + 7 }, { x: d.x + 10, y: d.y - 6 }]);
        await page.waitForTimeout(80);
        T.check((await state(page)).count === 4 && await shown(page) === "4" && await lit(page) === 4, tag + ": two fingers on one thing count it once");
        await countAll(page);
      } else if (round === 5) {
        // a whole hand, again and again, anywhere
        const st = await page.locator("#stage").boundingBox(), rnd = (a, b) => a + Math.random() * (b - a);
        for (let k = 0; k < 14; k++) await fingers(cdp, [0, 1, 2].map(() => ({ x: rnd(st.x + 8, st.x + st.width - 8), y: rnd(st.y + 8, st.y + st.height - 8) })));
        await page.waitForTimeout(120);
        const m = await state(page);
        T.check(m.count <= m.target && await lit(page) === m.count && (m.count === 0 || await shown(page) === String(m.count)), tag + ": 42 fingers anywhere on the picture: " + m.count + " of " + m.target + " counted, none twice");
        total += await countAll(page);
      } else {
        total += await countAll(page);
      }

      await cheered(page);
      s = await state(page);
      if (!(s.done && s.count === s.target && await shown(page) === String(s.target))) T.check(false, tag + ": round " + round + " (" + s.activity + ") did not end on " + s.target);
      if (round === 6) {
        const p = await mid(page.locator("#nextBtn"));
        await fingers(cdp, [p, { x: p.x + 5, y: p.y + 5 }]); await page.touchscreen.tap(p.x, p.y);
        await page.waitForTimeout(250);
        T.check((await state(page)).round === 7, tag + ": hammering the big Next button moves on once");
      } else if (round < 8) await tap(page, "#nextBtn");
    }
    T.check(total === 0, tag + ": in 8 rounds the number shown always matched the taps" + (total ? " (" + total + " did not)" : ""));
    T.check(seen.size === 7, tag + ": all seven activities came up: " + [...seen].join(", "));
    T.check(most === 5, tag + ": counting went up to 5 and no further (highest " + most + ")");
    T.check(bad === 0, tag + ": every thing to tap is at least 72px, on the screen and clear of the others");

    // nothing a child does moves the page
    const st = await page.locator("#stage").boundingBox(), cx = st.x + st.width / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cx, y: st.y + st.height - 40, id: 0 }] });
    for (let y = st.y + st.height - 40; y > st.y + 40; y -= 40) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: cx, y, id: 0 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cx - 30, y: st.y + 200, id: 0 }, { x: cx + 30, y: st.y + 200, id: 1 }] });
    for (let k = 1; k <= 5; k++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: cx - 30 - 25 * k, y: st.y + 200, id: 0 }, { x: cx + 30 + 25 * k, y: st.y + 200, id: 1 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.mouse.wheel(0, 600);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);
    T.check(await still(page), tag + ": the page did not scroll or zoom, during play or when dragged, pinched and wheeled");

    // the way out is small and needs a long press
    await tap(page, "#homeBtn");
    await page.waitForTimeout(300);
    T.check(page.url().includes(GAME) && await page.locator("#tip").isVisible(), tag + ": a tap on the corner button does not leave the game, it says to press and hold");
    await tap(page, "#parentsBtn");
    await page.waitForTimeout(200);
    T.check(!(await page.locator("#parents").isVisible()), tag + ": a tap does not open the parents' note either");
    await hold(page, cdp, "#parentsBtn", 1100);
    T.check(await page.locator("#parents .sheet").isVisible() && (await page.textContent("#parents")).includes("No people are drawn"), tag + ": a long press opens the note for parents");
    await page.click("#swMusic");
    T.check((await state(page)).settings.music === false && (await state(page)).settings.voice === true && (await page.evaluate(() => window.AsmauMusic.state().mood)) === "none",
      tag + ": the music can be turned off on its own, the voice stays");
    await page.click("#parentsClose");
    T.check(!(await page.locator("#parents").isVisible()), tag + ": Close closes it");
    const said = await page.evaluate(() => window.__said), mine = asked.slice();   // before leaving: the landing page is not this test's business
    await hold(page, cdp, "#homeBtn", 1700);
    await page.waitForLoadState("load");
    T.check(!page.url().includes("/games/"), tag + ": a long press on the corner button goes back to all the games");

    T.check(errs.length === 0, tag + ": no page errors" + (errs[0] ? ": " + errs[0] : ""));
    const away = mine.filter((u) => !u.startsWith(site.url) && !/^(data|blob):/.test(u));
    T.check(mine.length > 10 && away.length === 0, tag + ": none of " + mine.length + " requests left the site" + (away[0] ? ": " + away[0] : ""));
    T.check(said.every((l) => langOf[l.id] === l.lang), tag + ": every line spoken is in narration.json with its language");
    await ctx.close();
  }

  /* ---------- a tablet on its side, counting to ten, with "How many?" ---------- */
  {
    const { ctx, page, errs, asked } = await open({ width: 1024, height: 768 });
    const tag = "tablet";
    T.check(await page.locator("#startBig").isVisible() && await still(page), tag + ": the page opens and fits the screen");
    await tap(page, "#startBig");
    let most = 0, quizzes = 0, slips = 0, bad = 0, said = [];
    for (let round = 1; round <= 7; round++) {
      let s = await ready(page, round);
      const box = await targets(page); bad += box.small + box.off + box.over;
      if (s.quiz) {
        quizzes++;
        const answers = await page.locator(".answer").count();
        if (quizzes === 1) {
          // a wrong answer is not a failure: the game counts along, then the child answers
          await tap(page, page.locator('.answer:not([data-n="' + s.target + '"])').first());
          await page.waitForTimeout(200);
          const w = await state(page);
          T.check(!w.done && !w.locked && w.hinting && answers >= 2, tag + ": \"How many?\" has " + answers + " big answers, and a wrong one ends nothing");
          await page.waitForFunction(() => !window.AsmauCounting.state().hinting, null, { timeout: 25000 });
          const h = await state(page);
          T.check(h.count === h.target && await shown(page) === String(h.target) && await page.locator(".answer.pulse").getAttribute("data-n") === String(h.target),
            tag + ": the game counted along to " + h.target + " and showed which answer that is");
        } else {
          slips += await countAll(page);                               // touching each one to count it works here too
          T.check(!(await state(page)).done && await page.locator(".answer.pulse").count() === 1, tag + ": counting them by touch does not end the question, it points at the answer");
        }
        const p = await mid(page.locator('.answer[data-n="' + s.target + '"]'));
        await page.touchscreen.tap(p.x, p.y); await page.touchscreen.tap(p.x, p.y);
      } else if (round === 2) {
        // a mouse and a keyboard work too, and a click is not counted twice
        const its = await uncounted(page), a = await mid(its[0]);
        await page.mouse.click(a.x, a.y); await page.mouse.dblclick(a.x, a.y);
        await its[1].focus(); await page.keyboard.press("Enter");
        await page.waitForTimeout(100);
        T.check((await state(page)).count === 2 && await shown(page) === "2", tag + ": mouse clicks and the Enter key each count one thing once");
        slips += await countAll(page);
      } else {
        slips += await countAll(page);
      }
      await cheered(page);
      s = await state(page);
      most = Math.max(most, s.target);
      if (!(s.done && s.count === s.target && await shown(page) === String(s.target))) T.check(false, tag + ": round " + round + " (" + s.activity + ") did not end on " + s.target);
      said = await page.evaluate(() => window.__said);
      if (round < 7) await tap(page, "#nextBtn");
    }
    T.check(slips === 0 && most >= 8, tag + ": 7 rounds finished by tapping, counting as far as " + most + ", the number always matching the taps");
    T.check(quizzes === 2, tag + ": \"How many?\" came up twice in 7 rounds");
    T.check(bad === 0, tag + ": every thing to tap is at least 72px, on the screen and clear of the others");
    T.check(await still(page), tag + ": the page did not scroll or zoom");
    T.check(said.some((l) => l.id === "how-many") && said.every((l) => langOf[l.id] === l.lang), tag + ": every line spoken is in narration.json with its language");
    T.check(errs.length === 0, tag + ": no page errors" + (errs[0] ? ": " + errs[0] : ""));
    T.check(asked.every((u) => u.startsWith(site.url) || /^(data|blob):/.test(u)), tag + ": none of " + asked.length + " requests left the site");
    await ctx.close();
  }

  /* ---------- Arabic is never handed to the device's voice ---------- */
  {
    // The worst case: no English clip can be loaded (so the device's voice has to speak), and an
    // Arabic clip exists for every number but cannot be played. Arabic must still stay silent.
    const { ctx, page, errs } = await open({ width: 390, height: 844 }, {
      routes: async (c) => {
        await c.route("**/assets/audio/ar-*.mp3", (r) => r.fulfill({ status: 200, contentType: "audio/mpeg", body: Buffer.from("this is not a sound") }));
        await c.route(/\/assets\/audio\/(?!ar-)[^/]+\.mp3$/, (r) => r.abort());
      }
    });
    await tap(page, "#startLittle");
    for (let round = 1; round <= 2; round++) {
      await ready(page, round);
      for (const it of await uncounted(page)) { await tap(page, it); await page.waitForTimeout(900); }   // slowly, so every word is said to the end
      await cheered(page);
      await page.waitForTimeout(1200);
      if (round < 2) await tap(page, "#nextBtn");
    }
    const spoken = await page.evaluate(() => window.__spoken), said = await page.evaluate(() => window.__said);
    const arabicLines = said.filter((l) => l.lang === "ar");
    T.check(spoken.length >= 4 && spoken.some((t) => /^(one|two|three)$/i.test(t)), "speech: with no clips, the device's voice says the English words: " + spoken.slice(0, 5).join(", "));
    T.check(arabicLines.length >= 2 && arabicLines.every((l) => ARABIC.test(l.text)), "speech: the game asked for " + arabicLines.length + " Arabic number words, each marked as Arabic");
    T.check(spoken.every((t) => !ARABIC.test(t)), "speech: no Arabic text was ever sent to speechSynthesis");
    T.check(said.every((l) => ARABIC.test(l.text) === (l.lang === "ar")), "speech: nothing with Arabic letters is ever passed off as English");
    T.check(errs.length === 0, "speech: no page errors" + (errs[0] ? ": " + errs[0] : ""));
    await ctx.close();
  }

  await browser.close(); await site.close();
  return T.done();
};
