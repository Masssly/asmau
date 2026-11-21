#!/usr/bin/env node
/*
  Start a new language: every file it needs, with the English filled in and the translations empty.
    node scripts/lang-new.js <code> "<the language's own name>"      e.g.  node scripts/lang-new.js fr "Français"
  Writes lang/<code>/site.json (the words on every page) and lang/<code>/<slug>.json for every game in manifest.json,
  all "draft", and adds the language to shared/lang.js (AsmauLang.names) so the site knows it. Running it again for a
  language that exists adds what is missing (new games, new lines) and changes nothing that is translated.
  Then translate (lang/README.md), run node scripts/build-offline.js, and look with ?lang=<code> in the address.
*/
"use strict";
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const L = require("./lang-files.js");
const [code, name] = process.argv.slice(2);
if (!/^[a-z]{2,3}$/.test(code || "") || !name) { console.error(fs.readFileSync(__filename, "utf8").split("*/")[0]); process.exit(2); }

// the site's words: every key of an existing language's site.json, with the English as the thing to translate
const model = L.codes().filter((c) => c !== code).map((c) => L.read(L.siteFile(c))).find(Boolean) || {};
const site = L.read(L.siteFile(code)) || { status: "draft", _note: name + ": the words shared by every page. To be checked by a native speaker." };
for (const k of Object.keys(model)) if (k !== "status" && k.charAt(0) !== "_" && site[k] === undefined) site[k] = "";
L.write(L.siteFile(code), site);

// every game: lines and labels, English beside each line
const man = JSON.parse(fs.readFileSync(path.join(L.ROOT, "manifest.json"), "utf8"));
const slugs = [].concat(...(man.sections || []).map((s) => s.games || []));
for (const slug of slugs) {
  const f = L.gameFile(code, slug);
  if (!fs.existsSync(f)) L.write(f, { status: "draft", _note: name + ". To be checked by a native speaker; seen only with ?lang=" + code + " until then.", lines: {}, strings: {} });
  spawnSync(process.execPath, [path.join(__dirname, "lang-strings.js"), slug, code, "--write"], { stdio: "ignore" });
}

// the site knows the language by its own name
const lj = path.join(L.ROOT, "shared", "lang.js");
let src = fs.readFileSync(lj, "utf8");
const m = /names:\s*\{([^}]*)\}/.exec(src);
if (m && !new RegExp("\\b" + code + ":").test(m[1])) {
  src = src.replace(m[0], "names: {" + m[1].replace(/\s*$/, "") + ", " + code + ": " + JSON.stringify(name) + " }");
  fs.writeFileSync(lj, src);
}
console.log("lang/" + code + "/: site.json and " + slugs.length + " games, ready to translate (lang/README.md). Then: node scripts/build-offline.js");
