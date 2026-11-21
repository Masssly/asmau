#!/usr/bin/env node
/*
  Every word on the site's pages that is still English in a language: opens each page in a browser with ?lang=<code>,
  unfolds every folded part, and asks shared/lang.js (AsmauLang.collect) what it could not translate.
    node scripts/lang-collect.js <code>            list it
    node scripts/lang-collect.js <code> --write    add it to lang/<code>/site.json (and each game's own For parents box
                                                   to lang/<code>/<slug>.json), with "" to fill in
  A sentence with a link or bold word inside it is listed whole, as HTML: translate it whole and keep its tags.
  Needs the browser the tests use (Playwright). The story lines and the activities' labels come from
  scripts/lang-strings.js; the notes for parents too.
*/
"use strict";
const fs = require("fs"), path = require("path"), http = require("http");
const L = require("./lang-files.js");
const [code, flag] = process.argv.slice(2);
if (!/^[a-z]{2,3}$/.test(code || "")) { console.error(fs.readFileSync(__filename, "utf8").split("*/")[0]); process.exit(2); }

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".mp3": "audio/mpeg" };
function serve() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      let f = path.join(L.ROOT, decodeURIComponent(req.url.split("?")[0]));
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
      if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
    }).listen(0, "127.0.0.1", () => ok(s));
  });
}

(async () => {
  const { chromium } = require("playwright");
  const man = JSON.parse(fs.readFileSync(path.join(L.ROOT, "manifest.json"), "utf8"));
  const slugs = [].concat(...(man.sections || []).map((s) => s.games || []));
  const playable = slugs.filter((g) => fs.existsSync(path.join(L.ROOT, "games", g, "index.html")));
  const pages = ["index.html", "privacy.html", "reset.html", "guide.html?g=yusuf",
    "tools/record-voice/index.html", "tools/record-voice/story.html?g=yusuf", "tools/record-voice/join.html"]
    .concat(playable.map((g) => "games/" + g + "/index.html"));
  const server = await serve(), base = "http://127.0.0.1:" + server.address().port + "/";
  const browser = await chromium.launch();
  const site = new Set(), games = {};
  for (const pg of pages) {
    const p = await (await browser.newContext({ serviceWorkers: "block" })).newPage();
    await p.goto(base + pg + (pg.includes("?") ? "&" : "?") + "lang=" + code, { waitUntil: "load" }).catch(() => {});
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      document.querySelectorAll("[hidden]").forEach((e) => { e.hidden = false; });
      document.querySelectorAll("details").forEach((d) => { d.open = true; });
      if (!window.AsmauLang || !window.AsmauLang.collect) return null;
      // a game's own For parents box is that game's words; everything else is the site's
      const own = document.querySelector("details.parents");
      const mine = own ? window.AsmauLang.collect(own) : { text: [], html: [], attr: [] };
      if (own) own.setAttribute("data-no-tr", "");
      const rest = window.AsmauLang.collect(document.body);
      return { mine: mine.text.concat(mine.html, mine.attr), rest: rest.text.concat(rest.html, rest.attr) };
    }).catch(() => null);
    if (!r) { console.log("(no lang.js on " + pg + ")"); continue; }
    const g = /^games\/([^/]+)\//.exec(pg);
    r.rest.forEach((x) => site.add(x));
    if (g) r.mine.forEach((x) => (games[g[1]] = games[g[1]] || new Set()).add(x));
    else r.mine.forEach((x) => site.add(x));
  }
  await browser.close(); server.close();
  // what is already in the language (cards, pattern results, language names) is not English left over
  const done = new Set(), donePats = [];
  for (const f of fs.readdirSync(path.join(L.DIR, code))) {
    const j = L.read(path.join(L.DIR, code, f)) || {};
    const vals = f === "site.json" ? Object.entries(j) : Object.entries(j.strings || {});
    vals.forEach(([k, v]) => {
      if (typeof v !== "string" || !v) return;
      if (k.startsWith("re:")) donePats.push(new RegExp("^" + v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\$t?\d/g, ".+") + "$"));
      else done.add(v.replace(/\s+/g, " ").trim());
    });
  }
  const langNames = new Set(Object.values((() => { try { return JSON.parse(/names:\s*(\{[^}]*\})/.exec(fs.readFileSync(path.join(L.ROOT, "shared/lang.js"), "utf8"))[1].replace(/(\w+):/g, '"$1":')); } catch (e) { return {}; } })()));
  const names = new Set(slugs.map((g) => { try { return JSON.parse(fs.readFileSync(path.join(L.ROOT, "games", g, "game.json"), "utf8")).title; } catch (e) { return ""; } }));
  const keep = (x) => !names.has(x) && !done.has(x) && !langNames.has(x) && !donePats.some((r) => r.test(x)) && !/^[\d\s.,:·–—()%+\-]+$/.test(x) && !/^(YouTube|LinkedIn|TikTok|Ko-fi|GitHub|Asmau|AGPL-3\.0|CC BY-NC-SA 4\.0)$/.test(x);
  const siteList = [...site].filter(keep);
  console.log("site: " + siteList.length + " to translate"); siteList.forEach((x) => console.log("  " + x.slice(0, 150)));
  for (const [g, set] of Object.entries(games)) { console.log(g + ": " + set.size); [...set].forEach((x) => console.log("  " + x.slice(0, 150))); }
  if (flag === "--write") {
    const sf = L.siteFile(code), sj = L.read(sf) || { status: "draft" };
    siteList.forEach((x) => { if (sj[x] === undefined) sj[x] = ""; });
    L.write(sf, sj);
    for (const [g, set] of Object.entries(games)) {
      const gf = L.gameFile(code, g), gj = L.read(gf); if (!gj) continue;
      gj.strings = gj.strings || {};
      [...set].filter(keep).forEach((x) => { if (gj.strings[x] === undefined && sj[x] === undefined) gj.strings[x] = ""; });
      L.write(gf, gj);
    }
    console.log("written: lang/" + code + "/site.json and the games' files");
  }
})();
