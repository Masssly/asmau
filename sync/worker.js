/*
  Optional sync for parents' recordings. Not used unless a parent turns it on.

  The browser encrypts every recording with a key made from the family code
  BEFORE sending it, so what is stored here is unreadable noise to us. The
  Worker only stores, lists and deletes opaque blobs under a family id.

    PUT    /v1/<family>/<name>   store a blob, replacing any older one of that name
                                 (max 5 MB each, 25 MB per family; 413 when full)
    GET    /v1/<family>/<name>   fetch a blob
    GET    /v1/<family>/         list names and sizes
    DELETE /v1/<family>/<name>   delete one blob
    DELETE /v1/<family>/         delete everything for the family
    GET/PUT /admin/limit         owner only (bearer token): see or raise one family's limit

  Also: a daily job deletes a family's recordings when nobody has used its code for
  a year, and requests are rate-limited per code and per network address.

  <family> is a 64-character hex id the browser derives from the family code
  (a hash, so the code itself never leaves the device). Anyone who knows the
  id can read the (encrypted) blobs, so ids must stay secret like a password.
*/
const ORIGIN = "https://masssly.github.io";
const FAMILY = /^[0-9a-f]{64}$/;
const NAME = /^[A-Za-z0-9._:-]{1,120}$/;
const MAX = 5 * 1024 * 1024;          // one recording
const FREE_LIMIT = 25 * 1024 * 1024;  // all of one family's recordings: about 80 minutes of speech

// Everyone gets the free limit. The owner can raise one family's limit (after a
// donation, for example) with the admin call below; it is stored as a small
// object outside the family's folder: _limits/<family> holds the size in bytes.
async function limitFor(env, family) {
  try {
    const o = await env.CLIPS.get("_limits/" + family);
    const n = o ? parseInt(await o.text(), 10) : 0;
    if (n > FREE_LIMIT) return n;
  } catch (err) { /* fall back to the free limit */ }
  return FREE_LIMIT;
}

// A short reference a parent can safely share (it cannot be turned back into the
// family code or the folder name): the first 8 hex digits of SHA-256 of the folder name.
async function supportRef(family) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(family));
  return Array.prototype.map.call(new Uint8Array(h).slice(0, 4), (b) => ("0" + b.toString(16)).slice(-2)).join("").toUpperCase();
}

// Owner only: PUT /admin/limit  {"ref":"3F9A12C0","mb":100}   (Authorization: Bearer <ADMIN_TOKEN>)
//             GET /admin/limit?ref=3F9A12C0                   shows used space and the limit
async function admin(req, env, url) {
  const auth = req.headers.get("authorization") || "";
  const want = env.ADMIN_TOKEN || "";
  if (!want || auth.length !== ("Bearer " + want).length || auth !== "Bearer " + want) return new Response("forbidden", { status: 403 });
  const body = req.method === "PUT" ? await req.json().catch(() => ({})) : {};
  const ref = String(body.ref || url.searchParams.get("ref") || "").toUpperCase().replace(/[^0-9A-F]/g, "");
  if (ref.length !== 8) return new Response("ref must be 8 hex digits", { status: 400 });
  const found = [];
  let cursor;
  do {
    const page = await env.CLIPS.list({ prefix: "_active/", cursor });
    for (const o of page.objects) { const id = o.key.slice(8); if (FAMILY.test(id) && (await supportRef(id)) === ref) found.push(id); }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  if (found.length !== 1) return new Response(JSON.stringify({ error: found.length ? "ambiguous" : "no such reference" }), { status: 404, headers: { "content-type": "application/json" } });
  const id = found[0];
  if (req.method === "PUT") {
    const mb = Number(body.mb);
    if (!(mb >= 25 && mb <= 5000)) return new Response("mb must be between 25 and 5000", { status: 400 });
    await env.CLIPS.put("_limits/" + id, String(Math.round(mb * 1048576)));
  }
  const used = await usage(env, id + "/", null);
  return new Response(JSON.stringify({ ref, usedMB: +(used / 1048576).toFixed(2), limitMB: +((await limitFor(env, id)) / 1048576).toFixed(1) }), { headers: { "content-type": "application/json" } });
}

async function usage(env, prefix, except) {
  let used = 0, cursor;
  do {
    const page = await env.CLIPS.list({ prefix, cursor });
    page.objects.forEach((o) => { if (o.key !== except) used += o.size; });
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return used;
}

function cors(extra) {
  return Object.assign({
    "access-control-allow-origin": ORIGIN,
    "access-control-allow-methods": "GET,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-expose-headers": "x-asmau-limit, x-asmau-ref",
    "vary": "origin"
  }, extra || {});
}
const reply = (body, status, extra) => new Response(body, { status: status || 200, headers: cors(extra) });

// Recordings of a family code nobody has used for a year are deleted.
const RETENTION_DAYS = 365;
const DAY = 86400000;

// "Used" means any request with the code (syncing, recording, removing). A small
// marker object records the last day of use; it lives outside the family's folder
// so it never shows up as a recording or counts toward the space.
async function touch(env, family) {
  // Never lets a failure here (for example two requests writing the marker at the same moment)
  // break the request itself.
  try {
    const key = "_active/" + family;
    const head = await env.CLIPS.head(key);
    if (!head || Date.now() - head.uploaded.getTime() > DAY) await env.CLIPS.put(key, "1");
  } catch (err) { /* the next request will try again */ }
}

// Delete every family whose last use (marker, or newest recording) is older than `days`.
// Returns how many families were removed. Exported for testing.
export async function purgeInactive(env, now, days) {
  const cutoff = now - (days || RETENTION_DAYS) * DAY;
  const fam = {};
  let cursor;
  do {
    const page = await env.CLIPS.list({ cursor });
    page.objects.forEach((o) => {
      const m = o.key.match(/^(?:_active\/|_limits\/)?([0-9a-f]{64})(?:\/|$)/);
      if (!m) return;                                  // not ours; never touch it
      const f = fam[m[1]] || (fam[m[1]] = { newest: 0, keys: [] });
      if (!o.key.startsWith("_limits/")) f.newest = Math.max(f.newest, o.uploaded.getTime());
      f.keys.push(o.key);
    });
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  let removed = 0;
  for (const id of Object.keys(fam)) {
    if (fam[id].newest >= cutoff) continue;
    for (let i = 0; i < fam[id].keys.length; i += 1000) await env.CLIPS.delete(fam[id].keys.slice(i, i + 1000));
    removed += 1;
  }
  return removed;
}

// Too many requests: per family code and per network address, so one runaway
// device or one scraper cannot run up the bill. The limits are set in wrangler.toml.
async function tooMany(req, env, family) {
  const ip = req.headers.get("cf-connecting-ip") || "unknown";
  const [a, b] = await Promise.all([env.PER_FAMILY.limit({ key: family }), env.PER_IP.limit({ key: ip })]);
  return !a.success || !b.success;
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(purgeInactive(env, Date.now(), RETENTION_DAYS));
  },

  async fetch(req, env) {
    if (req.method === "OPTIONS") return reply(null, 204);
    const origin = req.headers.get("origin");
    if (origin && origin !== ORIGIN) return reply("forbidden", 403);

    const u = new URL(req.url);
    if (u.pathname === "/admin/limit") return admin(req, env, u);
    const m = u.pathname.match(/^\/v1\/([0-9a-f]{64})\/(.*)$/);
    if (!m || !FAMILY.test(m[1])) return reply("not found", 404);
    const prefix = m[1] + "/", name = m[2];
    if (await tooMany(req, env, m[1])) return reply("slow down", 429, { "retry-after": "60" });
    await touch(env, m[1]);

    if (!name) {
      if (req.method === "GET") {
        const limit = await limitFor(env, m[1]);
        const out = [];
        let cursor;
        do {
          const page = await env.CLIPS.list({ prefix, cursor });
          page.objects.forEach((o) => out.push({ name: o.key.slice(prefix.length), size: o.size, uploaded: o.uploaded }));
          cursor = page.truncated ? page.cursor : undefined;
        } while (cursor);
        return reply(JSON.stringify(out), 200, { "content-type": "application/json", "x-asmau-limit": String(limit), "x-asmau-ref": await supportRef(m[1]) });
      }
      if (req.method === "DELETE") {
        let cursor, n = 0;
        do {
          const page = await env.CLIPS.list({ prefix, cursor });
          if (page.objects.length) { await env.CLIPS.delete(page.objects.map((o) => o.key)); n += page.objects.length; }
          cursor = page.truncated ? page.cursor : undefined;
        } while (cursor);
        return reply(JSON.stringify({ deleted: n }), 200, { "content-type": "application/json" });
      }
      return reply("method not allowed", 405);
    }
    if (!NAME.test(name)) return reply("bad name", 400);

    if (req.method === "PUT") {
      const len = parseInt(req.headers.get("content-length") || "0", 10);
      if (!len || len > MAX) return reply("too large or empty", 413);
      // replacing a recording only counts the difference, so redoing one never fills the space
      const limit = await limitFor(env, m[1]);
      const used = await usage(env, prefix, prefix + name);
      if (used + len > limit) return reply(JSON.stringify({ error: "full", used, limit }), 413, { "content-type": "application/json", "x-asmau-limit": String(limit) });
      await env.CLIPS.put(prefix + name, req.body);   // the old copy is replaced only once this one is stored
      return reply("ok", 201);
    }
    if (req.method === "GET") {
      const obj = await env.CLIPS.get(prefix + name);
      return obj ? reply(obj.body, 200, { "content-type": "application/octet-stream", "cache-control": "no-store" }) : reply("not found", 404);
    }
    if (req.method === "DELETE") { await env.CLIPS.delete(prefix + name); return reply("ok"); }
    return reply("method not allowed", 405);
  }
};
