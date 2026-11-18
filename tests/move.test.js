// The move to asmau.org (scripts/KEEPING.md): a page opened at the old address goes on to the same page at asmau.org,
// taking the family's things with it (code, voice, the child's place), without overwriting anything asmau.org already
// has; and the link that carried them is cleaned.
"use strict";
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");
const { checker } = require("./lib");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2" };

module.exports = async function () {
  const T = checker("moving to asmau.org"), repo = path.join(__dirname, "..");
  const browser = await chromium.launch(), ctx = await browser.newContext({ serviceWorkers: "block" });
  // both addresses are served from this checkout: the old one under /asmau/, the new one at its root
  const file = (p) => { let f = path.join(repo, decodeURIComponent(p)); if (f.endsWith("/")) f += "index.html"; return f; };
  const answer = (route, p) => {
    const f = file(p);
    if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: "not found" });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), contentType: TYPES[path.extname(f)] || "application/octet-stream" });
  };
  await ctx.route("https://masssly.github.io/**", (r) => answer(r, new URL(r.request().url()).pathname.replace(/^\/asmau/, "")));
  await ctx.route("https://asmau.org/**", (r) => answer(r, new URL(r.request().url()).pathname));
  await ctx.route(/^https:\/\/(?!asmau\.org|masssly\.github\.io)/, (r) => r.fulfill({ status: 404, body: "" }));

  // the family's things at the old address, as an old device has them
  const old = await ctx.newPage();
  await old.route("https://masssly.github.io/asmau/blank", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<p>old</p>" }));
  await old.goto("https://masssly.github.io/asmau/blank");
  await old.evaluate(() => { localStorage.setItem("asmau-sync-code", "ABCDEFGHJKLMNPQR"); localStorage.setItem("asmau-voice", "m"); localStorage.setItem("asmau-nuh", "{\"page\":5}"); localStorage.setItem("other-site", "x"); });
  // asmau.org already has a newer language choice: it must stay
  await old.goto("https://asmau.org/move.html"); await old.waitForURL("https://asmau.org/");
  await old.evaluate(() => localStorage.setItem("asmau-voice", "w"));

  await old.goto("https://masssly.github.io/asmau/games/nuh/index.html?skipms=300");
  await old.waitForURL(/^https:\/\/asmau\.org\/games\/nuh\/index\.html/, { timeout: 15000 }).catch(() => null);
  const at = old.url();
  T.check(/^https:\/\/asmau\.org\/games\/nuh\/index\.html\?skipms=300$/.test(at), "the old address opens the same page at asmau.org, with a clean link: " + at);
  const kept = await old.evaluate(() => ({ code: localStorage.getItem("asmau-sync-code"), voice: localStorage.getItem("asmau-voice"), nuh: localStorage.getItem("asmau-nuh"), other: localStorage.getItem("other-site") }));
  T.check(kept.code === "ABCDEFGHJKLMNPQR", "the family code came along");
  T.check(kept.nuh === "{\"page\":5}", "and the child's place in the story");
  T.check(kept.voice === "w", "a choice asmau.org already had is not overwritten");
  T.check(kept.other === null, "nothing but Asmau's own things is carried");

  // a link that tries to send people elsewhere after the move stays on asmau.org
  await old.goto("https://asmau.org/move.html#to=" + encodeURIComponent("//evil.example/") + "&keep=");
  await old.waitForLoadState("load"); await old.waitForTimeout(300);
  T.check(old.url() === "https://asmau.org/", "move.html only goes on to a page of asmau.org: " + old.url());

  await old.goto("https://asmau.org/move.html#to=" + encodeURIComponent("/\\evil.example/") + "&keep=");
  await old.waitForLoadState("load"); await old.waitForTimeout(300);
  T.check(old.url() === "https://asmau.org/", "and not by a back-slash either: " + old.url());

  await browser.close();
  return T.done();
};
