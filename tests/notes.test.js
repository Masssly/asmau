// The parents' notes: one file per page, shown only on that page, and kept with their page when pages move.
"use strict";
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");
const { chromium } = require("playwright");
const { serve, checker } = require("./lib");

module.exports = async function () {
  const T = checker("notes for parents"), repo = path.join(__dirname, "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asmau-notes-"));
  for (const d of ["games", "shared", "fonts", "icons", "tools", "scripts", "packs"]) fs.cpSync(path.join(repo, d), path.join(tmp, d), { recursive: true });
  for (const f of ["index.html", "manifest.json", "app.webmanifest", "sw.js", "version.json", "config.json"]) fs.copyFileSync(path.join(repo, f), path.join(tmp, f));
  const P = path.join(tmp, "games/adam/parents");

  // a parent writes a note on page 1.2 on GitHub; the next release picks it up
  fs.writeFileSync(path.join(P, "1/1.2.md"), "test text\n\nsecond paragraph\n");
  execSync("node scripts/build-offline.js", { cwd: tmp, stdio: "ignore" });
  T.check(JSON.parse(fs.readFileSync(path.join(P, "pages.json"), "utf8")).notes.includes("1.2"), "the release lists page 1.2 as having a note");

  const site = await serve(tmp), browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const notes = async () => { await page.waitForTimeout(500); return (await page.$$eval("#pnoteBody p", (ps) => ps.map((p) => p.textContent))); };
  await page.goto(site.url + "games/adam/index.html?skipms=300", { waitUntil: "networkidle" });
  await page.click("#startBtn");
  await page.click("#pnote summary");
  T.check(/page 1\.1/.test(await page.textContent("#pnoteSum")) && (await notes()).some((p) => /khalifa/.test(p)), "page 1.1 shows the chapter's notes");
  await page.click("#nextBtn");
  const n2 = await notes();
  T.check(/page 1\.2/.test(await page.textContent("#pnoteSum")) && n2[0] === "test text" && n2[1] === "second paragraph" && !n2.some((p) => /khalifa/.test(p)),
    "page 1.2 shows only its own note, paragraph by paragraph: " + JSON.stringify(n2));
  T.check(await page.locator("#pnote").evaluate((d) => d.open), "the notes stay open from page to page within a chapter");
  await page.click("#nextBtn");
  T.check((await notes()).length === 0 && await page.isVisible("#pnoteBody a.pnote-link"), "page 1.3 has no note, only the link to the verses");
  await browser.close(); await site.close();

  // a page is added at the start of chapter 1: every note moves with its page
  const sp = path.join(tmp, "games/adam/story.js");
  fs.writeFileSync(sp, fs.readFileSync(sp, "utf8").replace('steps: [\n      {"say":"d1-a"', 'steps: [\n      {"say":"d1-new","scene":"heaven"},\n      {"say":"d1-a"'));
  execSync("node scripts/build-offline.js", { cwd: tmp, stdio: "ignore" });
  const read = (k) => fs.existsSync(path.join(P, "1", k + ".md")) ? fs.readFileSync(path.join(P, "1", k + ".md"), "utf8") : "(none)";
  T.check(/khalifa/.test(read("1.2")) && /test text/.test(read("1.3")) && read("1.1") === "", "when a page is added before them, the notes move to 1.2 and 1.3 with their pages");
  fs.rmSync(tmp, { recursive: true, force: true });
  return T.done();
};
