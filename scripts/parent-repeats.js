#!/usr/bin/env node
/*
  Finds facts told twice in a game's "For parents" notes: sentences in different chapters that say nearly the
  same thing (many shared words, or a long run of the same words). A parent reading chapter by chapter should
  not meet the same fact again as if it were new.

    node scripts/parent-repeats.js [games/<slug> ...]      (default: every story game)
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
// citation words appear in every note and say nothing about the fact itself
const CITE = "ibn kathir kathir's tafsir abridged english verse verses game reported reports report reporting commentary from not quoted hadith bukhari al-bukhari tafsir's explanation explains says said gives source chapter".split(" ");
const STOP = new Set(CITE.concat("the a an and or of to in on at is was were be it its this that for with as by from not but he she they his her their him them who which what when then so are has have had do did said says also there here one two only all any into out up about than more most no yes i you we our your".split(" ")));

function load(dir) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, dir, "story.js"), "utf8"), ctx);
  return ctx.window.STORY || [];
}
const strip = (s) => s.replace(/(from |in |as quoted in |quoted in )?(the hadith in al-Bukhari |a hadith of [A-Z][^ ]* bin [A-Z][^ ]* in al-Bukhari, )?(as quoted in )?Ibn Kathir's tafsir \(abridged English\)(, not (from )?the verses)?:?/gi, " ").replace(/^(Verses?|Verse) [\d:–\-, and]+\.?/i, " ");
const strip2 = (s) => strip(s).replace(/(Details from |From |from )?the commentary(,? not (from )?the verses)?:?/gi, " ").replace(/(reports|reported) from [A-Z][^ ,]*( [A-Z][^ ,]*)*/g, " ");
const words = (s) => s.toLowerCase().replace(/[’']/g, "'").match(/[a-z0-9']+/g) || [];
const keyw = (s) => new Set(words(s).filter((w) => !STOP.has(w) && w.length > 2));
function sentences(text) {
  return text.split(/(?<=[.!?])\s+(?=[A-Z‘"'(])/).map((s) => s.trim()).filter((s) => words(s).length >= 6);
}
function runShared(a, b, n) {
  const A = words(a), B = new Set();
  const bw = words(b);
  for (let i = 0; i + n <= bw.length; i++) B.add(bw.slice(i, i + n).join(" "));
  for (let i = 0; i + n <= A.length; i++) if (B.has(A.slice(i, i + n).join(" "))) return A.slice(i, i + n).join(" ");
  return null;
}
function check(dir) {
  const story = load(dir), items = [];
  story.forEach((ch, i) => (require("./parent-notes").read(dir, i + 1) || []).forEach((p) => sentences(p).forEach((s) => items.push({ ch: ch.id, s, k: keyw(s) }))));
  const found = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i], b = items[j];
    if (a.ch === b.ch) continue;
    const inter = [...a.k].filter((w) => b.k.has(w)).length, uni = new Set([...a.k, ...b.k]).size;
    const jac = uni ? inter / uni : 0, run = runShared(strip2(a.s), strip2(b.s), 6);
    if ((jac >= 0.4 && Math.min(a.k.size, b.k.size) >= 4) || run) found.push({ a, b, jac, run });
  }
  return found;
}
const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ["games/adam", "games/yusuf", "games/musa", "games/nana-asmau"];
let total = 0;
for (const dir of dirs) {
  const f = check(dir); total += f.length;
  console.log("\n## " + dir + ": " + f.length + " possible repeats");
  f.forEach((x) => console.log("- " + x.a.ch + " / " + x.b.ch + (x.run ? " (same words: \"" + x.run + "\")" : " (" + Math.round(x.jac * 100) + "% shared words)") +
    "\n    " + x.a.ch + ": " + x.a.s + "\n    " + x.b.ch + ": " + x.b.s));
}
process.exitCode = total ? 1 : 0;
