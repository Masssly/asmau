// Shared helpers for the browser tests: a static server, a fake of the sync Worker, a tiny checker.
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".png": "image/png", ".webmanifest": "application/manifest+json" };

// Serves a folder over http. `log` collects every path asked for. `delayMs` simulates a slow network.
function serve(root, { delayMs = 0 } = {}) {
  const log = [];
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    log.push(p);
    const f = path.join(root, p);
    if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
    setTimeout(() => fs.readFile(f, (e, b) => {
      if (e) { res.writeHead(404); return res.end("not found"); }
      res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": "max-age=600", "content-length": b.length });
      res.end(b);
    }), delayMs);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ url: "http://127.0.0.1:" + server.address().port + "/", log, close: () => new Promise((r) => { server.closeAllConnections && server.closeAllConnections(); server.close(r); }) })));
}

// A stand-in for sync/worker.js: store, fetch, list and delete blobs under a family, 25 MB limit.
function fakeWorker({ limit = 25 * 1024 * 1024 } = {}) {
  const store = new Map();
  const server = http.createServer((req, res) => {
    const cors = { "access-control-allow-origin": "*", "access-control-allow-methods": "*", "access-control-allow-headers": "*", "access-control-expose-headers": "x-asmau-limit, x-asmau-ref" };
    if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
    const m = req.url.match(/^\/v1\/([0-9a-f]{64})\/(.*)$/);
    if (!m) { res.writeHead(404, cors); return res.end(); }
    const [, fam, name] = m, prefix = fam + "/";
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      if (!name && req.method === "GET") {
        const list = [...store].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ name: k.slice(prefix.length), size: v.bytes.length, uploaded: v.at }));
        res.writeHead(200, { ...cors, "content-type": "application/json", "x-asmau-limit": String(limit), "x-asmau-ref": "ABCD1234" });
        return res.end(JSON.stringify(list));
      }
      if (!name && req.method === "DELETE") {
        let n = 0; for (const k of [...store.keys()]) if (k.startsWith(prefix)) { store.delete(k); n++; }
        res.writeHead(200, { ...cors, "content-type": "application/json" }); return res.end(JSON.stringify({ deleted: n }));
      }
      if (req.method === "PUT") {
        const used = [...store].filter(([k]) => k.startsWith(prefix) && k !== prefix + name).reduce((n, [, v]) => n + v.bytes.length, 0);
        if (used + body.length > limit) { res.writeHead(413, { ...cors, "content-type": "application/json" }); return res.end(JSON.stringify({ error: "full", used, limit })); }
        store.set(prefix + name, { bytes: body, at: new Date(Date.now() + store.size).toISOString() });
        res.writeHead(201, cors); return res.end("ok");
      }
      if (req.method === "GET") { const v = store.get(prefix + name); if (!v) { res.writeHead(404, cors); return res.end(); } res.writeHead(200, cors); return res.end(v.bytes); }
      if (req.method === "DELETE") { store.delete(prefix + name); res.writeHead(200, cors); return res.end("ok"); }
      res.writeHead(405, cors); res.end();
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ url: "http://127.0.0.1:" + server.address().port, store, close: () => new Promise((r) => { server.closeAllConnections && server.closeAllConnections(); server.close(r); }) })));
}

// Sends the page's calls to the real Worker's address to the fake instead.
async function useFakeWorker(context, realUrl, fakeUrl) {
  await context.route(realUrl + "/**", async (route) => {
    const r = route.request();
    const res = await fetch(fakeUrl + r.url().slice(realUrl.length), { method: r.method(), body: r.postDataBuffer() || undefined });
    const headers = {}; res.headers.forEach((v, k) => { headers[k] = v; });
    headers["access-control-allow-origin"] = "*"; headers["access-control-expose-headers"] = "x-asmau-limit, x-asmau-ref";
    route.fulfill({ status: res.status, body: Buffer.from(await res.arrayBuffer()), headers });
  });
}

function checker(name) {
  const problems = [];
  const check = (ok, msg) => { console.log("  " + (ok ? "ok  " : "FAIL") + " " + msg); if (!ok) problems.push(msg); };
  const done = () => { console.log(problems.length ? "  → " + name + ": " + problems.length + " failed" : "  → " + name + ": all passed"); return problems.length; };
  return { check, done, problems };
}

module.exports = { serve, fakeWorker, useFakeWorker, checker };
