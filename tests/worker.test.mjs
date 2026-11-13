// The Worker's clean-up of families unused for a year, against a fake bucket. (Run by run.js.)
import { purgeInactive } from "../sync/worker.js";

const DAY = 86400000, now = Date.UTC(2027, 10, 12), id = (c) => c.repeat(64);
const store = new Map();
const put = (key, ageDays) => store.set(key, { key, size: 1, uploaded: new Date(now - ageDays * DAY), text: "" });
put("_active/" + id("a"), 400); put(id("a") + "/yusuf:c1-a", 400); put("_limits/" + id("a"), 400);   // idle 400 days: all goes
put("_active/" + id("b"), 10);  put(id("b") + "/yusuf:c1-a", 500);                                    // used 10 days ago: stays
put("_active/" + id("c"), 364); put(id("c") + "/yusuf:c1-a", 364);                                    // just inside the year: stays
put("_active/" + id("d"), 366); put(id("d") + "/yusuf:c1-a", 366);                                    // just outside: goes
put("media/abc/def.webp", 9999);                                                                       // not a family: never touched
const env = { CLIPS: {
  async list({ prefix = "", cursor, limit = 1000 }) {
    const all = [...store.values()].filter((o) => o.key.startsWith(prefix)).sort((x, y) => (x.key < y.key ? -1 : 1));
    const from = cursor ? all.findIndex((o) => o.key > cursor) : 0;
    const objs = from < 0 ? [] : all.slice(from, from + limit);
    const truncated = from >= 0 && from + limit < all.length;
    return { objects: objs, truncated, cursor: truncated ? objs[objs.length - 1].key : undefined };
  },
  async get(key) { const o = store.get(key); return o ? { text: async () => o.text } : null; },
  async put(key, value) { store.set(key, { key, size: 1, uploaded: new Date(now), text: String(value) }); },
  async delete(keys) { (Array.isArray(keys) ? keys : [keys]).forEach((k) => store.delete(k)); },
} };

let bad = 0;
const check = (ok, m) => { console.log("  " + (ok ? "ok  " : "FAIL") + " " + m); if (!ok) bad++; };
const removed = await purgeInactive(env, now, 365, 2);          // a tiny page size: it must remember where it stopped
check(removed + (await purgeInactive(env, now, 365, 2)) + (await purgeInactive(env, now, 365, 2)) === 2, "two idle families are removed, over several small runs");
const left = [...store.keys()].map((k) => k.replace(/[0-9a-f]{64}/, (m) => m[0] + "…"));
check(!left.some((k) => k.includes("a…") || k.includes("d…")), "everything of the idle families is gone (recordings, marker, raised limit)");
check(left.includes("b…/yusuf:c1-a") && left.includes("c…/yusuf:c1-a"), "families used within the year are kept, even with old files");
check(left.includes("media/abc/def.webp"), "files that are not a family's are never touched");
check(!store.has("_state/purge-cursor"), "the saved place is cleared once a pass is finished");
console.log(bad ? "  → worker clean-up: " + bad + " failed" : "  → worker clean-up: all passed");
process.exit(bad ? 1 : 0);
