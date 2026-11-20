#!/usr/bin/env node
// The numbers the income plan is judged on, week by week (see the plan's "What we measure").
//
//   CLOUDFLARE_API_TOKEN=... node scripts/measures.js [days]     default: the last 28 days
//
// One count, about no person: the pictures and voices the sync Worker served from R2, per game and voice, with
// the country (written in sync/worker.js to the Analytics Engine dataset "asmau_media"). Nothing runs on a
// child's device for it (owner's choice, 20 November 2026: no analytics script, so no Web Analytics).
// A device keeps what it downloaded, so this counts new devices and new games opened, not every play.
// Node's fetch needs NODE_USE_ENV_PROXY=1 behind a proxy.
"use strict";

const ACCOUNT = "082ead1e5301afb699fa1feda4840d02";
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const days = Math.max(1, Math.min(90, +process.argv[2] || 28));
const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
const auth = { authorization: "Bearer " + TOKEN };

async function sql(q) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, { method: "POST", headers: auth, body: q });
  const t = await r.text();
  if (!r.ok) throw new Error("Analytics Engine: " + t.slice(0, 300));
  return JSON.parse(t).data;
}

(async () => {
  console.log(`Asmau measures since ${since} (${days} days)\n`);
  const where = `WHERE timestamp > toDateTime('${since} 00:00:00')`;
  try {
    console.log("Downloads by game and kind (pictures, voice-w, voice-m)");
    const g = await sql(`SELECT blob1 AS game, blob2 AS kind, SUM(_sample_interval) AS n FROM asmau_media ${where} GROUP BY game, kind ORDER BY game, kind FORMAT JSON`);
    g.forEach((r) => console.log(`  ${r.game.padEnd(22)} ${r.kind.padEnd(9)} ${String(r.n).padStart(8)}`));
    if (!g.length) console.log("  none yet");
    console.log("\nDownloads by country (top 15)");
    const c = await sql(`SELECT blob3 AS country, SUM(_sample_interval) AS n FROM asmau_media ${where} GROUP BY country ORDER BY n DESC LIMIT 15 FORMAT JSON`);
    c.forEach((r) => console.log(`  ${(r.country || "?").padEnd(4)} ${String(r.n).padStart(8)}`));
    if (!c.length) console.log("  none yet");
  } catch (e) { console.log("Downloads: " + e.message); }
})();
