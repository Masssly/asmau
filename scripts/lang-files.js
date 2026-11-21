/*
  Where the translations live (lang/README.md explains them for translators):

    lang/<code>/site.json     the words on every page (buttons, labels, the home page): { "<English>": "<translation>" }
    lang/<code>/<slug>.json   one game: { status, voices?, lines: { <id>: { en, t } }, strings: { "<English>": "<translation>" } }

  Every script reads and writes them through here, so the layout is in one place.
*/
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "lang");

const codes = () => (fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((c) => /^[a-z]{2,3}$/.test(c) && fs.statSync(path.join(DIR, c)).isDirectory()).sort() : []);
const gameFile = (code, slug) => path.join(DIR, code, slug + ".json");
const siteFile = (code) => path.join(DIR, code, "site.json");
const rel = (f) => path.relative(ROOT, f).split(path.sep).join("/");
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } };
// the games a language has a file for
const gamesIn = (code) => (fs.existsSync(path.join(DIR, code)) ? fs.readdirSync(path.join(DIR, code)).filter((f) => /\.json$/.test(f) && f !== "site.json").map((f) => f.slice(0, -5)).sort() : []);
// a line's translation: { en, t } (or a plain string, as files written by hand may have it)
const lineText = (v) => (v && typeof v === "object" ? v.t || "" : v || "");
// the languages a game has a file in
const langsOfGame = (slug) => codes().filter((c) => fs.existsSync(gameFile(c, slug)));

function write(f, data) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(data, null, 1) + "\n");
}

module.exports = { ROOT, DIR, codes, gameFile, siteFile, rel, read, gamesIn, lineText, langsOfGame, write };
