/*
  Asmau service worker: the site works offline, and a device downloads only what it needs (scripts/SCALING.md).

  Everything the site serves belongs to a pack (scripts/build-offline.js writes packs/<pack>.json, and the index of
  packs below): "core" (home page, shared scripts, fonts, icons, covers) is saved at the first visit. A game is saved
  as it is played: each page, picture and sound is kept once shown, so what was played works again without internet.
  A parent can download a whole game ("<slug>" with the voice they chose, "<slug>@w" or "<slug>@m", or in another
  language "<slug>@id-w" or "<slug>@id-m") and delete it
  again to free space (owner's decision, 16 November 2026: data costs money, so downloading is the parent's choice).
  A release downloads, for each pack kept whole on this device, only the files whose fingerprint changed.

  Pictures and sounds of the games live on R2 (MEDIA_BASE), at addresses that include their fingerprint and so never
  change meaning: they are served from the saved copy first. Pages, scripts, styles and data are fetched from the
  network first; the saved copy is used offline, or when the network takes more than a few seconds.

  The lines between the GENERATED markers are written by scripts/build-offline.js; do not edit them by hand.
*/

// BEGIN GENERATED
const RELEASE = "2026.11.67";
const BUILD = "a67d7dd430e5";
// pack: [fingerprint of packs/<pack>.json, bytes, files]
const PACKS = {
  "abdullah-quilliam":["257759b2cf",442,1],
  "adam":["4f6ded53a9",2721610,55],
  "adam@m":["a617f3f408",4026446,147],
  "adam@w":["217fc43e27",4316508,147],
  "core":["df006ceab3",1054412,43],
  "count-the-crescents":["c58ffd2f9d",83016,5],
  "count-the-crescents@m":["76410cb722",587647,52],
  "count-the-crescents@w":["238f9dbdf7",584828,52],
  "edhi":["42f9542339",442,1],
  "fatima-al-fihri":["2c3eca2233",463,1],
  "gazi-husrev-beg":["a83800ba50",435,1],
  "ibn-al-nafis":["f8a52f29ab",449,1],
  "ibn-battuta":["6e7e76449b",3497890,54],
  "ibn-battuta@m":["fc1dc2b090",3523440,130],
  "ibn-battuta@w":["4418230851",3810161,130],
  "mariam-alolo":["a06c1449ec",422,1],
  "muhammad-asad":["e8b07f6b96",446,1],
  "musa":["e1ee2d4f89",8046171,161],
  "musa@m":["e8ae6e31ff",13995246,422],
  "musa@w":["5ac25136bc",15197808,422],
  "nana-asmau":["8699fc6e67",2470881,51],
  "nana-asmau@m":["0a028f5761",3395505,116],
  "nana-asmau@w":["a6c18e6bbe",3665928,116],
  "nuh":["6f4dbb18c5",3351667,55],
  "nuh@m":["1852874f1c",3888796,145],
  "nuh@w":["1c57f6027a",4165390,145],
  "rahmah":["4130bffb45",2725801,46],
  "rahmah@id-m":["ec329859ed",3172911,114],
  "rahmah@id-w":["dde118b888",3315323,114],
  "rahmah@m":["35a8bb21ae",2876572,114],
  "rahmah@w":["ef657c152b",3123167,114],
  "rumi":["96e3caea5b",409,1],
  "tap-and-say":["284f427c70",21717,4],
  "tap-and-say@m":["71edb942d5",1501703,126],
  "tap-and-say@w":["d9e7f925b2",1472336,126],
  "umm-ayman":["ee1ddb1e6c",3277562,56],
  "umm-ayman@m":["25ae6bd6a0",3369590,116],
  "umm-ayman@w":["aa2daf9273",3702494,116],
  "yunus-emre":["6881152c52",408,1],
  "yusuf":["e839f1f32f",5851790,94],
  "yusuf@m":["5f24cea0b0",6661953,191],
  "yusuf@w":["d0a6cc2e08",7128706,191]
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
// games played but not downloaded whole: their played pages, pictures and sounds are kept until the game is deleted
function played() { return metaGet("played").then(function (k) { return k || []; }); }
var playedNow = {}, playedTimer = null;
function notePlayed(p) {
  if (!p || playedNow[p]) return;
  playedNow[p] = 1;
  clearTimeout(playedTimer);
  playedTimer = setTimeout(function () {
    played().then(function (k) { var add = Object.keys(playedNow).filter(function (x) { return k.indexOf(x) < 0; }); if (add.length) return metaPut("played", k.concat(add)); });
  }, 1000);
}
function packFor(f) {
  var m = /^games\/([^/]+)\/(.*)$/.exec(f);
  if (!m) return "core";
  var v = /^assets\/audio(?:-([a-z]{2,3}))?(-m)?\//.exec(m[2]);
  return m[1] + (v ? "@" + (v[1] ? v[1] + "-" : "") + (v[2] ? "m" : "w") : "");
}

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
        // every game, each with the one narration this family chose ("w", "m", or a language's "id-w", "id-m");
        // a game not in that language comes with its English narration in the same voice
        voice = voice || "w";
        var plain = voice.slice(-1);
        packs = [];
        Object.keys(PACKS).forEach(function (p) {
          if (p.indexOf("@") >= 0) return;
          packs.push(p);
          if (PACKS[p + "@" + voice]) packs.push(p + "@" + voice); else if (PACKS[p + "@" + plain]) packs.push(p + "@" + plain);
        });
      }
      packs = packs.filter(function (p) { return PACKS[p]; });
      var next = k.concat(packs.filter(function (p) { return k.indexOf(p) < 0; }));
      return metaPut("kept", next).then(function () { return syncPacks(packs); });
    });
  }).catch(function () {});
  return queue;
}

// delete games from this device (For parents > Delete): their pages, pictures and sounds; progress and recordings stay
function drop(packs) {
  // "<slug>@*" stands for every narration of the game (both voices, every language)
  packs = [].concat.apply([], packs.map(function (p) {
    return /@\*$/.test(p) ? Object.keys(PACKS).filter(function (k) { return k.indexOf(p.slice(0, -1)) === 0; }) : [p];
  }));
  queue = queue.then(function () {
    return Promise.all([kept(), played()]).then(function (r) {
      var out = function (p) { return p === "core" || packs.indexOf(p) < 0; };
      packs.forEach(function (p) { delete playedNow[p]; });
      return Promise.all([metaPut("kept", r[0].filter(out)), metaPut("played", r[1].filter(out))]).then(clean);
    });
  }).catch(function () {});
  return queue;
}

// forget files that no kept or played pack has any more (old versions after a release, deleted games)
function clean() {
  return Promise.all([kept(), played()]).then(function (r) {
    var packs = r[0].concat(r[1].filter(function (p) { return r[0].indexOf(p) < 0; }));
    return Promise.all(packs.map(function (p) { return list(p).catch(function () { return null; }); })).then(function (ls) {
      var keep = {};
      ls.forEach(function (l) { if (l) Object.keys(l.files).forEach(function (f) { keep[keyFor(f, l.files[f])] = 1; }); });
      return caches.open(FILES).then(function (cache) {
        return cache.keys().then(function (reqs) { return Promise.all(reqs.map(function (rq) { if (!keep[rq.url.split("?")[0]]) return cache.delete(rq); })); });
      });
    });
  });
}

// For parents > Without internet: how much of each pack is on this device
// files: in the pack; saved: of them on this device; bytes: the whole pack; here: bytes of it on this device
function status(only) {
  return Promise.all([kept(), played(), caches.open(FILES)]).then(function (r) {
    var k = r[0], pl = r[1], cache = r[2], out = {};
    Object.keys(PACKS).forEach(function (p) { out[p] = { files: PACKS[p][2], saved: 0, bytes: PACKS[p][1], here: 0, kept: k.indexOf(p) >= 0, played: pl.indexOf(p) >= 0 }; });
    var look = k.concat(pl).filter(function (p, i, a) { return a.indexOf(p) === i && PACKS[p] && (!only || only.indexOf(p) >= 0); });
    return Promise.all(look.map(function (p) {
      return list(p).then(function (l) {
        if (!l) return;
        return Promise.all(Object.keys(l.files).map(function (f) {
          return cache.match(keyFor(f, l.files[f])).then(function (hit) {
            if (!hit) return;
            out[p].saved += 1;
            out[p].here += (l.sizes && l.sizes[f]) || Number(hit.headers.get("content-length")) || 0;
          });
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
          var f = relOf(rq.url), m = /^games\/[^/]+\/assets\//.exec(f);
          return old.match(rq).then(function (res) {
            var h = res && res.headers.get(HASH);
            if (!res || !h) return;
            if (m) games[packFor(f)] = 1;                  // the game, and the voice it was saved in
            return cache.put(keyFor(f, h), res);
          });
        })).then(function () {
          var add = Object.keys(games);                     // saved whole by the old release: kept whole
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
    event.waitUntil(status(d.packs).then(function (s) { event.ports[0].postMessage(s); }));
  }
});

// a page asking for a game's picture or sound by its path (pages of older releases): find its R2 address
function mediaKey(f) {
  if (!/^games\/[^/]+\//.test(f)) return Promise.resolve(null);
  var p = packFor(f);
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
    var rest = req.url.slice(MEDIA_BASE.length).split("/").slice(1).join("/");
    event.respondWith(fromCache(req.url).then(function (hit) {
      return hit || fetch(req).then(function (res) { if (res && res.ok) notePlayed(packFor(rest)); return save(req.url, res, h); });
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
        // a game's own pages and data are kept as it is played, so it opens again without internet
        var g = /^games\/([^/]+)\//.exec(rel);
        if (g && res && res.ok && url.search === "") { save(key, res); notePlayed(g[1]); }
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
