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
    GET     /media/<key>         the site's pictures (public, cached for a year)
    PUT     /admin/media/<key>   owner only: upload one picture
    GET/PUT /admin/history       owner only: the log of every picture and sound ever published
                                 (history/index.json). Published files are never deleted, so
                                 every old version stays in the bucket at media/<hash>/<path>.

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

// Delete families whose last use is older than `days`. It works from the small "last used"
// markers (one per family, refreshed whenever a family uses its code), a page at a time, and
// remembers where it stopped, so a bucket with thousands of families is cleaned over several
// daily runs instead of one run that could run out of time. Returns how many were removed.
// Exported for testing.
export async function purgeInactive(env, now, days, budget) {
  const cutoff = now - (days || RETENTION_DAYS) * DAY;
  const stateKey = "_state/purge-cursor";
  let cursor;
  try { const c = await env.CLIPS.get(stateKey); cursor = c ? (await c.text()) || undefined : undefined; } catch (err) { cursor = undefined; }
  const page = await env.CLIPS.list({ prefix: "_active/", cursor, limit: budget || 500 });
  let removed = 0;
  for (const m of page.objects) {
    const id = m.key.slice("_active/".length);
    if (!FAMILY.test(id) || m.uploaded.getTime() >= cutoff) continue;
    let c2;
    do {
      const p = await env.CLIPS.list({ prefix: id + "/", cursor: c2, limit: 1000 });
      if (p.objects.length) await env.CLIPS.delete(p.objects.map((o) => o.key));
      c2 = p.truncated ? p.cursor : undefined;
    } while (c2);
    await env.CLIPS.delete(["_limits/" + id, m.key]);
    removed += 1;
  }
  if (page.truncated) await env.CLIPS.put(stateKey, page.cursor);
  else await env.CLIPS.delete(stateKey);
  return removed;
}

// Too many requests: per family code and per network address, so one runaway
// device or one scraper cannot run up the bill. The limits are set in wrangler.toml.
const MAX_FAMILIES = 1000;   // a ceiling on how many families can exist; raise it when it is reached

// Making a brand-new family is the one thing a stranger can do for free, so it has its own
// limits: a few per minute per network address, and a ceiling on how many exist in all.
// Returns a Response to refuse with, or null to carry on.
async function newFamilyGate(req, env) {
  const ip = req.headers.get("cf-connecting-ip") || "unknown";
  const r = await env.NEW_FAMILY.limit({ key: ip });
  if (!r.success) return reply("slow down", 429, { "retry-after": "60" });
  const page = await env.CLIPS.list({ prefix: "_active/", limit: MAX_FAMILIES });
  if (page.truncated || page.objects.length >= MAX_FAMILIES) return reply(JSON.stringify({ error: "not taking new families" }), 503, { "content-type": "application/json" });
  return null;
}

async function tooMany(req, env, family) {
  const ip = req.headers.get("cf-connecting-ip") || "unknown";
  const [a, b] = await Promise.all([env.PER_FAMILY.limit({ key: family }), env.PER_IP.limit({ key: ip })]);
  return !a.success || !b.success;
}

// Pictures and sounds for the site, served from R2 with a year-long cache. The key is
//   media/<10 hex digits: the start of the file's SHA-1>/<path in the repository>
// so a changed picture gets a new address and old addresses never go stale.
// Public on purpose (these are the game's own pictures); no rate limit, because
// the cache answers almost every request.
const TYPES = { webp: "image/webp", mp3: "audio/mpeg", webm: "audio/webm", ogg: "audio/ogg", m4a: "audio/mp4" };
const MEDIA_KEY = /^[0-9a-f]{10}\/[A-Za-z0-9_.\/-]{1,200}\.(webp|mp3|webm|ogg|m4a)$/;

async function sha1Prefix(bytes) {
  const h = await crypto.subtle.digest("SHA-1", bytes);
  return Array.prototype.map.call(new Uint8Array(h).slice(0, 5), (b) => ("0" + b.toString(16)).slice(-2)).join("");
}

async function media(req, env, ctx, key) {
  const pub = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,HEAD", "vary": "accept-encoding" };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: pub });
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("method not allowed", { status: 405, headers: pub });
  if (!MEDIA_KEY.test(key) || key.includes("..")) return new Response("not found", { status: 404, headers: pub });
  const cache = caches.default, cacheKey = new Request(new URL(req.url).origin + "/media/" + key);
  const hit = await cache.match(cacheKey);
  if (hit) return req.method === "HEAD" ? new Response(null, hit) : hit;
  const obj = await env.CLIPS.get("media/" + key);
  if (!obj) return new Response("not found", { status: 404, headers: pub });
  const res = new Response(obj.body, { headers: Object.assign({ "content-type": TYPES[key.slice(key.lastIndexOf(".") + 1)] || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable", "etag": obj.httpEtag }, pub) });
  if (req.method === "GET") ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return req.method === "HEAD" ? new Response(null, res) : res;
}

// Owner only: PUT /admin/media/<key> with the picture's bytes. The address must match the bytes
// (the first 10 hex digits of the SHA-1), so a wrong or half-sent upload is refused.
async function adminMedia(req, env, key) {
  const auth = req.headers.get("authorization") || "", want = env.ADMIN_TOKEN || "";
  if (!want || auth !== "Bearer " + want) return new Response("forbidden", { status: 403 });
  if (req.method !== "PUT" || !MEDIA_KEY.test(key) || key.includes("..")) return new Response("bad request", { status: 400 });
  const bytes = await req.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > MAX) return new Response("too large or empty", { status: 413 });
  if ((await sha1Prefix(bytes)) !== key.slice(0, 10)) return new Response("the bytes do not match the address", { status: 400 });
  await env.CLIPS.put("media/" + key, bytes);
  return new Response("ok", { status: 201 });
}

// Owner only: the history log. GET returns it (or {} before the first publish); PUT replaces it.
async function adminHistory(req, env) {
  const auth = req.headers.get("authorization") || "", want = env.ADMIN_TOKEN || "";
  if (!want || auth !== "Bearer " + want) return new Response("forbidden", { status: 403 });
  if (req.method === "GET") {
    const obj = await env.CLIPS.get("history/index.json");
    return new Response(obj ? obj.body : "{}", { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  if (req.method !== "PUT") return new Response("method not allowed", { status: 405 });
  const text = await req.text();
  if (text.length > 4 * 1024 * 1024) return new Response("too large", { status: 413 });
  try { JSON.parse(text); } catch (e) { return new Response("not JSON", { status: 400 }); }
  // the previous log is kept too, so a bad write can never lose the history
  const old = await env.CLIPS.get("history/index.json");
  if (old) await env.CLIPS.put("history/index-" + new Date().toISOString().replace(/[:.]/g, "-") + ".json", await old.text());
  await env.CLIPS.put("history/index.json", text);
  return new Response("ok", { status: 201 });
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(purgeInactive(env, Date.now(), RETENTION_DAYS));
  },

  async fetch(req, env, ctx) {
    const mu = new URL(req.url);
    if (mu.pathname.startsWith("/media/")) return media(req, env, ctx, mu.pathname.slice(7));
    if (mu.pathname.startsWith("/admin/media/")) return adminMedia(req, env, mu.pathname.slice(13));
    if (mu.pathname === "/admin/history") return adminHistory(req, env);
    if (req.method === "OPTIONS") return reply(null, 204);
    const origin = req.headers.get("origin");
    if (origin && origin !== ORIGIN) return reply("forbidden", 403);

    const u = new URL(req.url);
    if (u.pathname === "/admin/limit") return admin(req, env, u);
    const m = u.pathname.match(/^\/v1\/([0-9a-f]{64})\/(.*)$/);
    if (!m || !FAMILY.test(m[1])) return reply("not found", 404);
    const prefix = m[1] + "/", name = m[2];
    if (await tooMany(req, env, m[1])) return reply("slow down", 429, { "retry-after": "60" });
    if (req.method === "PUT" && !(await env.CLIPS.head("_active/" + m[1]))) {
      const refuse = await newFamilyGate(req, env);
      if (refuse) return refuse;
    }
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
