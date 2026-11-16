/*
  Asmau service worker: the site works offline, and a device downloads only what it needs (scripts/SCALING.md).

  Everything the site serves belongs to a pack (scripts/build-offline.js writes packs/<pack>.json, and the index of
  packs below): "core" (home page, shared scripts, fonts, icons, covers) is saved at the first visit; a game's pack
  ("<slug>") when it is first opened, with the narration in the voice the family chose ("<slug>@w" or "<slug>@m").
  A release downloads, for each pack on this device, only the files whose fingerprint changed, and drops the rest.

  Pictures and sounds of the games live on R2 (MEDIA_BASE), at addresses that include their fingerprint and so never
  change meaning: they are served from the saved copy first. Pages, scripts, styles and data are fetched from the
  network first; the saved copy is used offline, or when the network takes more than a few seconds.

  The lines between the GENERATED markers are written by scripts/build-offline.js; do not edit them by hand.
*/

// BEGIN GENERATED
const RELEASE = "2026.11.34";
const BUILD = "4d10832398eb";
// pack: [fingerprint of packs/<pack>.json, bytes, files]
const PACKS = {
  "adam":["07d5abf508",2625591,53],
  "adam@m":["a617f3f408",4026446,147],
  "adam@w":["217fc43e27",4316508,147],
  "core":["508c836279",1518300,54],
  "count-the-crescents":["d595fc27a5",82485,4],
  "count-the-crescents@m":["76410cb722",587647,52],
  "count-the-crescents@w":["238f9dbdf7",584828,52],
  "ibn-battuta":["dc3c856547",3427506,52],
  "ibn-battuta@m":["0e8002f829",3511529,130],
  "ibn-battuta@w":["f0093c205e",3797936,130],
  "musa":["3f3688fc34",7975576,159],
  "musa@m":["82bed29f40",13950526,422],
  "musa@w":["5e7023ffde",15159879,422],
  "nana-asmau":["93cb1e0ed5",2430996,49],
  "nana-asmau@m":["f459229234",3366561,116],
  "nana-asmau@w":["e85f1693d8",3639073,116],
  "nuh":["fd9b96839f",3280948,53],
  "nuh@m":["8e929a1b1f",3882631,145],
  "nuh@w":["1168c320e1",4156508,145],
  "rahmah":["9b8433cc1d",2637216,43],
  "rahmah@m":["a4fe8c7289",2874273,114],
  "rahmah@w":["cf884129c1",3117733,114],
  "tap-and-say":["349d241cbd",21257,3],
  "tap-and-say@m":["71edb942d5",1501703,126],
  "tap-and-say@w":["d9e7f925b2",1472336,126],
  "umm-ayman":["e17a4c006d",3244643,54],
  "umm-ayman@m":["9a32095eea",3300105,116],
  "umm-ayman@w":["680686d2c0",3632276,116],
  "yusuf":["93af97ad20",5760019,91],
  "yusuf@m":["f057137d75",6578971,190],
  "yusuf@w":["60ff092efc",7039872,190]
};
const MEDIA_BASE = "https://asmau-sync.mohammed-sadat-abdulai.workers.dev/media/";
// END GENERATED

const FILES = "asmau-files";               // every saved file: pages by their path, media by its R2 address
const META = "asmau-meta";                 // the pack lists, and which packs this device keeps
const HASH = "x-asmau-hash";               // each saved file carries the fingerprint of the version it is
const SCOPE = self.registration.scope;
const SCOPE_PATH = new URL(SCOPE).pathname;
const FRESH = /\.(?:html|js|css|json|webmanifest|md)$|\/$/;
const R2 = /^games\/[^/]+\/assets\/.+\.(?:webp|mp3|webm|ogg|m4a)$/i;

function relOf(url) { return new URL(url).pathname.slice(SCOPE_PATH.length); }
function keyFor(f, h) { return R2.test(f) ? MEDIA_BASE + h + "/" + f : new URL(f, SCOPE).href; }
function stamp(res, h) {
  var hd = new Headers(res.headers); hd.set(HASH, h);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: hd });
}
function pool(jobs, n) {
  var queue = jobs.slice();
  function worker() { var j = queue.shift(); return j ? j().catch(function () { /* tolerated: saved when first used */ }).then(worker) : Promise.resolve(); }
  var ws = []; for (var i = 0; i < n; i++) ws.push(worker());
  return Promise.all(ws);
}

// ---------- which packs this device keeps ----------
function metaGet(name) {
  return caches.open(META).then(function (c) { return c.match(new URL("__asmau/" + name, SCOPE).href); })
    .then(function (r) { return r ? r.json() : null; }).catch(function () { return null; });
}
function metaPut(name, value) {
  return caches.open(META).then(function (c) {
    return c.put(new URL("__asmau/" + name, SCOPE).href, new Response(JSON.stringify(value), { headers: { "content-type": "application/json" } }));
  });
}
function kept() { return metaGet("kept").then(function (k) { return k || ["core"]; }); }

// the list of one pack, as this release has it (fetched once per change, then kept)
var lists = {};
function list(p) {
  if (!PACKS[p]) return Promise.resolve(null);
  var want = PACKS[p][0];
  if (lists[p] && lists[p].v === want) return Promise.resolve(lists[p].l);
  return metaGet("list-" + p).then(function (m) {
    if (m && m.v === want) return m.l;
    return fetch(new URL("packs/" + p + ".json?v=" + want, SCOPE).href, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("no list for " + p);
      return r.json();
    }).then(function (l) { metaPut("list-" + p, { v: want, l: l }); return l; });
  }).then(function (l) { lists[p] = { v: want, l: l }; return l; });
}

// bring packs up to this release: download what is new or changed
function syncPacks(packs) {
  return caches.open(FILES).then(function (cache) {
    return Promise.all(packs.map(list)).then(function (ls) {
      var jobs = [];
      ls.forEach(function (l) {
        if (!l) return;
        Object.keys(l.files).forEach(function (f) {
          var h = l.files[f], key = keyFor(f, h);
          jobs.push(function () {
            return cache.match(key).then(function (hit) {
              if (hit && hit.headers.get(HASH) === h) return;
              var src = R2.test(f) ? key : new URL(f, SCOPE).href;
              return fetch(new Request(src, R2.test(f) ? { mode: "cors" } : { cache: "reload" })).then(function (res) {
                if (res && res.ok) return cache.put(key, stamp(res, h));
              });
            });
          });
        });
      });
      // pictures first (a game waits for them), then the rest
      jobs.sort(function (x, y) { return 0; });
      return pool(jobs, 6);
    });
  });
}

// one download job at a time, so two requests never fetch the same files side by side
var queue = Promise.resolve();
function want(packs, voice) {
  queue = queue.then(function () {
    return kept().then(function (k) {
      if (packs === "all") {
        var skip = voice === "m" ? "@w" : "@m";
        packs = Object.keys(PACKS).filter(function (p) { return p.slice(-2) !== skip; });
      }
      packs = packs.filter(function (p) { return PACKS[p]; });
      var next = k.concat(packs.filter(function (p) { return k.indexOf(p) < 0; }));
      return metaPut("kept", next).then(function () { return syncPacks(packs); });
    });
  }).catch(function () {});
  return queue;
}

// drop packs from this device (For parents > Without internet > Remove)
function drop(packs) {
  queue = queue.then(function () {
    return kept().then(function (k) {
      var next = k.filter(function (p) { return p === "core" || packs.indexOf(p) < 0; });
      return metaPut("kept", next).then(clean);
    });
  }).catch(function () {});
  return queue;
}

// forget files that no kept pack has any more
function clean() {
  return kept().then(function (k) {
    return Promise.all(k.map(list)).then(function (ls) {
      var keep = {};
      ls.forEach(function (l) { if (l) Object.keys(l.files).forEach(function (f) { keep[keyFor(f, l.files[f])] = 1; }); });
      return caches.open(FILES).then(function (cache) {
        return cache.keys().then(function (reqs) { return Promise.all(reqs.map(function (rq) { if (!keep[rq.url]) return cache.delete(rq); })); });
      });
    });
  });
}

// For parents > Without internet: how much of each pack is on this device
function status() {
  return Promise.all([kept(), caches.open(FILES)]).then(function (r) {
    var k = r[0], cache = r[1], out = {};
    Object.keys(PACKS).forEach(function (p) { out[p] = { files: PACKS[p][2], saved: 0, bytes: PACKS[p][1], kept: k.indexOf(p) >= 0 }; });
    return Promise.all(k.map(function (p) {
      return list(p).then(function (l) {
        if (!l) return;
        return Promise.all(Object.keys(l.files).map(function (f) {
          return cache.match(keyFor(f, l.files[f])).then(function (hit) { if (hit && hit.headers.get(HASH) === l.files[f]) out[p].saved += 1; });
        }));
      }).catch(function () {});
    })).then(function () { return { type: "asmau-status", packs: out }; });
  });
}

// Releases before 2026.11.35 kept pages in "asmau-shell-<build>" and pictures and sounds in "asmau-media" under their
// paths. Move what is still current to the new addresses, so nothing is downloaded twice, and note which games were kept.
function migrate() {
  return caches.keys().then(function (names) {
    if (names.indexOf("asmau-media") < 0) return;
    return caches.open("asmau-media").then(function (old) {
      return Promise.all([old.keys(), caches.open(FILES)]).then(function (r) {
        var reqs = r[0], cache = r[1], games = {};
        return Promise.all(reqs.map(function (rq) {
          var f = relOf(rq.url), m = /^games\/([^/]+)\//.exec(f);
          return old.match(rq).then(function (res) {
            var h = res && res.headers.get(HASH);
            if (!res || !h) return;
            if (m) games[m[1]] = 1;
            return cache.put(keyFor(f, h), res);
          });
        })).then(function () {
          var add = [];
          Object.keys(games).forEach(function (g) { add.push(g, g + "@w"); });
          return kept().then(function (k) { return metaPut("kept", k.concat(add.filter(function (p) { return k.indexOf(p) < 0; }))); });
        });
      });
    }).then(function () { return caches.delete("asmau-media"); });
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(syncPacks(["core"]).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    migrate()
      .then(function () { return caches.keys(); })
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k.indexOf("asmau-") === 0 && k !== FILES && k !== META; }).map(function (k) { return caches.delete(k); })); })
      .then(kept).then(function (k) { return want(k.filter(function (p) { return p !== "core"; })).then(clean); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (event) {
  var d = event.data || {};
  if (d.type === "asmau-want") {
    event.waitUntil(want(d.packs === "all" ? "all" : [].concat(d.packs || []), d.voice).then(function () {
      if (event.source) event.source.postMessage({ type: "asmau-saved", packs: d.packs });
    }));
  } else if (d.type === "asmau-drop") {
    event.waitUntil(drop([].concat(d.packs || [])));
  } else if (d.type === "asmau-status" && event.ports && event.ports[0]) {
    event.waitUntil(status().then(function (s) { event.ports[0].postMessage(s); }));
  }
});

// a page asking for a game's picture or sound by its path (pages of older releases): find its R2 address
function mediaKey(f) {
  var m = /^games\/([^/]+)\/(?:assets\/(audio-m|audio)\/)?/.exec(f);
  if (!m) return Promise.resolve(null);
  var p = m[1] + (m[2] === "audio-m" ? "@m" : m[2] === "audio" ? "@w" : "");
  return list(p).then(function (l) { return l && l.files[f] ? keyFor(f, l.files[f]) : null; }).catch(function () { return null; });
}

function fromCache(key) { return caches.open(FILES).then(function (c) { return c.match(key, { ignoreSearch: true }); }); }
function save(key, res, h) {
  if (res && res.ok) { var copy = res.clone(); caches.open(FILES).then(function (c) { c.put(key, h ? stamp(copy, h) : copy); }); }
  return res;
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // a picture or sound by its R2 address: saved copy first, the address never changes meaning
  if (req.url.indexOf(MEDIA_BASE) === 0) {
    var h = req.url.slice(MEDIA_BASE.length).split("/")[0];
    event.respondWith(fromCache(req.url).then(function (hit) {
      return hit || fetch(req).then(function (res) { return save(req.url, res, h); });
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  var rel = url.pathname.slice(SCOPE_PATH.length);
  if (rel === "" || rel.slice(-1) === "/") rel += "index.html";

  if (R2.test(rel)) {
    event.respondWith(mediaKey(rel).then(function (key) {
      if (!key) return fetch(req);
      return fromCache(key).then(function (hit) {
        return hit || fetch(key, { mode: "cors" }).then(function (res) { return save(key, res, key.slice(MEDIA_BASE.length).split("/")[0]); })
          .catch(function () { return fetch(req); });
      });
    }));
    return;
  }

  var key = new URL(rel, SCOPE).href;
  if (req.mode === "navigate" || FRESH.test(url.pathname)) {
    event.respondWith(new Promise(function (resolve) {
      var settled = false;
      var timer = setTimeout(function () { fromCache(key).then(function (hit) { if (hit && !settled) { settled = true; resolve(hit); } }); }, 4000);
      fetch(req, { cache: "no-cache" }).then(function (res) {
        clearTimeout(timer);
        if (!settled) { settled = true; resolve(res); }
      }).catch(function () {
        clearTimeout(timer);
        fromCache(key).then(function (hit) { if (!settled) { settled = true; resolve(hit || Response.error()); } });
      });
    }));
    return;
  }
  event.respondWith(fromCache(key).then(function (hit) { return hit || fetch(req); }));
});
