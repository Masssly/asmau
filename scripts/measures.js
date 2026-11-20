#!/usr/bin/env node
// The numbers the income plan is judged on, week by week (see the plan's "What we measure").
//
//   CLOUDFLARE_API_TOKEN=... node scripts/measures.js [days]     default: the last 28 days
//
// Two counts, neither about any person:
//   visits      Cloudflare Web Analytics on asmau.org (cookieless; the setting leaves out visitors in the EU)
//   downloads   pictures and voices the sync Worker served from R2, per game and voice, with the country
//               (written in sync/worker.js to the Analytics Engine dataset "asmau_media")
// A device keeps what it downloaded, so "downloads" counts new devices and new games opened, not every play.
"use strict";

const ACCOUNT = "082ead1e5301afb699fa1feda4840d02";
const SITE_TAG = "408c9c67feab4337ba366c28411613bf"; // asmau.org in Web Analytics
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const days = Math.max(1, Math.min(90, +process.argv[2] || 28));
const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
const auth = { authorization: "Bearer " + TOKEN };

async function visits() {
  const query = `query{viewer{accounts(filter:{accountTag:"${ACCOUNT}"}){rumPageloadEventsAdaptiveGroups(limit:1000,
    filter:{date_geq:"${since}",siteTag:"${SITE_TAG}"},orderBy:[date_ASC]){count sum{visits} dimensions{date}}}}}`;
  const r = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST", headers: Object.assign({ "content-type": "application/json" }, auth), body: JSON.stringify({ query }) });
  const j = await r.json();
  if (j.errors && j.errors.length) throw new Error("Web Analytics: " + JSON.stringify(j.errors));
  return j.data.viewer.accounts[0].rumPageloadEventsAdaptiveGroups;
}

async function sql(q) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, { method: "POST", headers: auth, body: q });
  const t = await r.text();
  if (!r.ok) throw new Error("Analytics Engine: " + t.slice(0, 300));
  return JSON.parse(t).data;
}

// the week a date belongs to, starting on Monday
function week(d) {
  const t = new Date(d + "T00:00:00Z"), back = (t.getUTCDay() + 6) % 7;
  return new Date(t - back * 864e5).toISOString().slice(0, 10);
}

(async () => {
  console.log(`Asmau measures since ${since} (${days} days)\n`);
  try {
    const rows = await visits(), byWeek = {};
    rows.forEach((r) => { const w = week(r.dimensions.date); byWeek[w] = byWeek[w] || [0, 0]; byWeek[w][0] += r.sum.visits; byWeek[w][1] += r.count; });
    console.log("Visits to asmau.org (week from Monday: visits, page loads)");
    Object.keys(byWeek).sort().forEach((w) => console.log(`  ${w}  ${String(byWeek[w][0]).padStart(6)}  ${String(byWeek[w][1]).padStart(6)}`));
    if (!rows.length) console.log("  none yet");
  } catch (e) { console.log("Visits: " + e.message); }

  const where = `WHERE timestamp > toDateTime('${since} 00:00:00')`;
  try {
    console.log("\nDownloads by game and kind (pictures, voice-w, voice-m)");
    const g = await sql(`SELECT blob1 AS game, blob2 AS kind, SUM(_sample_interval) AS n FROM asmau_media ${where} GROUP BY game, kind ORDER BY game, kind FORMAT JSON`);
    g.forEach((r) => console.log(`  ${r.game.padEnd(22)} ${r.kind.padEnd(9)} ${String(r.n).padStart(8)}`));
    if (!g.length) console.log("  none yet");
    console.log("\nDownloads by country (top 15)");
    const c = await sql(`SELECT blob3 AS country, SUM(_sample_interval) AS n FROM asmau_media ${where} GROUP BY country ORDER BY n DESC LIMIT 15 FORMAT JSON`);
    c.forEach((r) => console.log(`  ${(r.country || "?").padEnd(4)} ${String(r.n).padStart(8)}`));
    if (!c.length) console.log("  none yet");
  } catch (e) { console.log("Downloads: " + e.message); }
})();
