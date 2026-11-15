/* Checks brand/store/listing.md against each store's length limits: node brand/src/store-check.js */
"use strict";
const fs = require("fs"), path = require("path");
const md = fs.readFileSync(path.join(__dirname, "..", "store", "listing.md"), "utf8");
function field(title) {                     // the paragraph after a **Title (...)** line
  const i = md.indexOf("**" + title); if (i < 0) throw new Error("missing: " + title);
  return md.slice(md.indexOf("\n", i) + 1).split(/\n\s*\n/)[0].trim();
}
const full = md.slice(md.indexOf("## Full description")).split("\n").slice(1).join("\n").split("## Notes")[0].trim();
const rows = [
  ["Name", field("Name"), 30], ["Subtitle", field("Subtitle"), 30], ["Short description", field("Short description"), 80],
  ["Promotional text", field("Promotional text"), 170], ["Keywords", field("Keywords"), 100], ["Full description", full, 4000],
];
let bad = 0;
for (const [n, t, max] of rows) {
  const len = [...t].length, ok = len <= max; if (!ok) bad++;
  console.log((ok ? "ok  " : "TOO LONG ") + n.padEnd(18) + String(len).padStart(5) + " / " + max);
}
if (/\s/.test(field("Keywords"))) { console.log("TOO LONG? Keywords must have no spaces"); bad++; }
process.exit(bad ? 1 : 0);
