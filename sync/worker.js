/*
  Optional sync for parents' recordings. Not used unless a parent turns it on.

  The browser encrypts every recording with a key made from the family code
  BEFORE sending it, so what is stored here is unreadable noise to us. The
  Worker only stores, lists and deletes opaque blobs under a family id.

    PUT    /v1/<family>/<name>   store a blob         (body: bytes, max 5 MB)
    GET    /v1/<family>/<name>   fetch a blob
    GET    /v1/<family>/         list names and sizes
    DELETE /v1/<family>/<name>   delete one blob
    DELETE /v1/<family>/         delete everything for the family

  <family> is a 64-character hex id the browser derives from the family code
  (a hash, so the code itself never leaves the device). Anyone who knows the
  id can read the (encrypted) blobs, so ids must stay secret like a password.
*/
const ORIGIN = "https://masssly.github.io";
const FAMILY = /^[0-9a-f]{64}$/;
const NAME = /^[A-Za-z0-9._:-]{1,120}$/;
const MAX = 5 * 1024 * 1024;

function cors(extra) {
  return Object.assign({
    "access-control-allow-origin": ORIGIN,
    "access-control-allow-methods": "GET,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type",
    "vary": "origin"
  }, extra || {});
}
const reply = (body, status, extra) => new Response(body, { status: status || 200, headers: cors(extra) });

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return reply(null, 204);
    const origin = req.headers.get("origin");
    if (origin && origin !== ORIGIN) return reply("forbidden", 403);

    const m = new URL(req.url).pathname.match(/^\/v1\/([0-9a-f]{64})\/(.*)$/);
    if (!m || !FAMILY.test(m[1])) return reply("not found", 404);
    const prefix = m[1] + "/", name = m[2];

    if (!name) {
      if (req.method === "GET") {
        const out = [];
        let cursor;
        do {
          const page = await env.CLIPS.list({ prefix, cursor });
          page.objects.forEach((o) => out.push({ name: o.key.slice(prefix.length), size: o.size, uploaded: o.uploaded }));
          cursor = page.truncated ? page.cursor : undefined;
        } while (cursor);
        return reply(JSON.stringify(out), 200, { "content-type": "application/json" });
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
      await env.CLIPS.put(prefix + name, req.body);
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
