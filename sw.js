/*
  Asmau service worker. After the first visit the whole site works offline.

  Two kinds of saved files, kept apart on purpose:
  - SHELL: pages, scripts, styles and data. Small, and they change with every
    release. Always fetched from the network first; the saved copy is only used
    offline, or if the network takes more than a few seconds. A new release
    saves a fresh set.
  - MEDIA: pictures, sounds and fonts. Large, and they never change under the
    same name. Each has a fingerprint (the list below, made by
    scripts/build-offline.js). They live in one long-lived cache, and a release
    downloads only those whose fingerprint is new or changed, and drops the rest.
    They are served from the saved copy first, so they appear instantly.
  Installing never fails because one file would not download: the rest is
  kept, and the missing one is saved the first time it is used.

  The lists below are GENERATED; do not edit them by hand. RELEASE is the
  human version (see version.json).
*/

// BEGIN GENERATED
const RELEASE = "2026.11.4";
const BUILD = "a98f93b8fae8";
const SHELL = [
  "./",
  "app.webmanifest",
  "fonts/fonts.css",
  "games/adam/game.json",
  "games/count-the-crescents/game.json",
  "games/count-the-crescents/index.html",
  "games/count-the-crescents/",
  "games/count-the-crescents/narration.json",
  "games/musa/game.json",
  "games/tap-and-say/game.json",
  "games/tap-and-say/index.html",
  "games/tap-and-say/",
  "games/tap-and-say/narration.json",
  "games/yusuf/art.js",
  "games/yusuf/game.js",
  "games/yusuf/game.json",
  "games/yusuf/index.html",
  "games/yusuf/",
  "games/yusuf/narration.json",
  "games/yusuf/people.js",
  "games/yusuf/story.js",
  "games/yusuf/style.css",
  "index.html",
  "manifest.json",
  "privacy.html",
  "reset.html",
  "shared/mp3.js",
  "shared/music.js",
  "shared/narration.js",
  "shared/pwa.js",
  "shared/style.css",
  "shared/sync.js",
  "shared/vendor/LAME-LICENSE.txt",
  "shared/vendor/README.txt",
  "shared/vendor/lame.min.js",
  "tools/record-voice/index.html",
  "tools/record-voice/",
  "version.json"
];
const MEDIA = {
  "fonts/baloo2-latin.woff2": "ae196042c8",
  "fonts/mada-arabic.woff2": "5016ce2f7e",
  "fonts/mada-latin.woff2": "fd796dc139",
  "games/adam/cover.webp": "6629e7e344",
  "games/count-the-crescents/assets/audio/count-1.mp3": "0c658988b5",
  "games/count-the-crescents/assets/audio/count-2.mp3": "ab233f7b05",
  "games/count-the-crescents/assets/audio/count-3.mp3": "f571a79e3c",
  "games/count-the-crescents/assets/audio/count-4.mp3": "13fde7d5bc",
  "games/count-the-crescents/assets/audio/count-5.mp3": "5d861ad0ae",
  "games/count-the-crescents/assets/audio/mashallah.mp3": "e2ec6d44c2",
  "games/musa/cover.webp": "548a2e54d6",
  "games/tap-and-say/assets/audio/beads-en.mp3": "58c13a3981",
  "games/tap-and-say/assets/audio/kaaba-en.mp3": "d1a79c368a",
  "games/tap-and-say/assets/audio/lamp-en.mp3": "c958c25347",
  "games/tap-and-say/assets/audio/moon-en.mp3": "aa11a9512d",
  "games/tap-and-say/assets/audio/mosque-en.mp3": "26dffb3801",
  "games/tap-and-say/assets/audio/star-en.mp3": "5cc7da05e9",
  "games/yusuf/assets/audio/c1-a.mp3": "83f99d255d",
  "games/yusuf/assets/audio/c1-b.mp3": "aa6b42fc0c",
  "games/yusuf/assets/audio/c1-do.mp3": "7250663419",
  "games/yusuf/assets/audio/c1-q.mp3": "001dfdd3c9",
  "games/yusuf/assets/audio/c1-qwrong.mp3": "bb7f621a57",
  "games/yusuf/assets/audio/c10-a.mp3": "037bc2b094",
  "games/yusuf/assets/audio/c10-b.mp3": "36808ab0e6",
  "games/yusuf/assets/audio/c10-c.mp3": "ab0c8b98b7",
  "games/yusuf/assets/audio/c10-do.mp3": "e8f6034595",
  "games/yusuf/assets/audio/c10-g.mp3": "0d98144cfd",
  "games/yusuf/assets/audio/c10-gdo.mp3": "01cf3bec5e",
  "games/yusuf/assets/audio/c10-nope.mp3": "5806f52b00",
  "games/yusuf/assets/audio/c10-q.mp3": "6c0f42b7a2",
  "games/yusuf/assets/audio/c10-qwrong.mp3": "f8219a0cba",
  "games/yusuf/assets/audio/c11-a.mp3": "c016e500f9",
  "games/yusuf/assets/audio/c11-b.mp3": "57400b0125",
  "games/yusuf/assets/audio/c11-c.mp3": "c8ad86a246",
  "games/yusuf/assets/audio/c11-d.mp3": "c0ce8f07cd",
  "games/yusuf/assets/audio/c11-do.mp3": "fafc7fc265",
  "games/yusuf/assets/audio/c11-e.mp3": "dae15ec475",
  "games/yusuf/assets/audio/c11-o1.mp3": "42490b19e8",
  "games/yusuf/assets/audio/c11-o2.mp3": "29366772d7",
  "games/yusuf/assets/audio/c11-o3.mp3": "ceae5c1a65",
  "games/yusuf/assets/audio/c11-o4.mp3": "49d9022111",
  "games/yusuf/assets/audio/c11-wrong.mp3": "ada10bf704",
  "games/yusuf/assets/audio/c12-a.mp3": "1fcd61716b",
  "games/yusuf/assets/audio/c12-b.mp3": "2c27241d5f",
  "games/yusuf/assets/audio/c12-c.mp3": "257b9f04b8",
  "games/yusuf/assets/audio/c12-do.mp3": "d25f4e68e2",
  "games/yusuf/assets/audio/c12-q.mp3": "90b1a575a7",
  "games/yusuf/assets/audio/c12-qwrong.mp3": "5b8999aef8",
  "games/yusuf/assets/audio/c13-a.mp3": "e96911e249",
  "games/yusuf/assets/audio/c13-b.mp3": "216801387b",
  "games/yusuf/assets/audio/c13-b0.mp3": "7fd4e50f2f",
  "games/yusuf/assets/audio/c13-c.mp3": "17d087b980",
  "games/yusuf/assets/audio/c13-do.mp3": "993cb35cb1",
  "games/yusuf/assets/audio/c13-q.mp3": "d0b7cdbafd",
  "games/yusuf/assets/audio/c13-qwrong.mp3": "31fc9c4dce",
  "games/yusuf/assets/audio/c13-sort.mp3": "d9569d9736",
  "games/yusuf/assets/audio/c13-swrong.mp3": "442c805a63",
  "games/yusuf/assets/audio/c2-a.mp3": "ef62ed4a9c",
  "games/yusuf/assets/audio/c2-b.mp3": "8677eba3f0",
  "games/yusuf/assets/audio/c2-c.mp3": "a6c4590d13",
  "games/yusuf/assets/audio/c2-d.mp3": "d2308dac17",
  "games/yusuf/assets/audio/c2-do.mp3": "2ad056554e",
  "games/yusuf/assets/audio/c2-o1.mp3": "13cfbd7ba0",
  "games/yusuf/assets/audio/c2-o2.mp3": "ed35408d11",
  "games/yusuf/assets/audio/c2-o3.mp3": "b220867a25",
  "games/yusuf/assets/audio/c2-o4.mp3": "32328e01f0",
  "games/yusuf/assets/audio/c2-s.mp3": "4802c8ce38",
  "games/yusuf/assets/audio/c2-swrong.mp3": "437b0d220f",
  "games/yusuf/assets/audio/c2-w.mp3": "86f50e699d",
  "games/yusuf/assets/audio/c2-wrong.mp3": "e111f7dd70",
  "games/yusuf/assets/audio/c3-a.mp3": "33777ebaf1",
  "games/yusuf/assets/audio/c3-b.mp3": "7021f0672c",
  "games/yusuf/assets/audio/c3-do.mp3": "7105b2b6a0",
  "games/yusuf/assets/audio/c3-q.mp3": "ae9b12f5c5",
  "games/yusuf/assets/audio/c3-qwrong.mp3": "221e256e76",
  "games/yusuf/assets/audio/c4-a.mp3": "532762cb15",
  "games/yusuf/assets/audio/c4-b.mp3": "e74363a127",
  "games/yusuf/assets/audio/c4-c.mp3": "40d1cd1033",
  "games/yusuf/assets/audio/c4-count.mp3": "2dee673907",
  "games/yusuf/assets/audio/c4-counted.mp3": "9a360c6ec6",
  "games/yusuf/assets/audio/c4-do.mp3": "aac65a23e9",
  "games/yusuf/assets/audio/c4-q.mp3": "d9b8cf9f75",
  "games/yusuf/assets/audio/c4-qwrong.mp3": "d25d4ab4e8",
  "games/yusuf/assets/audio/c5-a.mp3": "7fe8993187",
  "games/yusuf/assets/audio/c5-b1.mp3": "8c9389af47",
  "games/yusuf/assets/audio/c5-b2.mp3": "94b4b37667",
  "games/yusuf/assets/audio/c5-b3.mp3": "db75d85e2a",
  "games/yusuf/assets/audio/c5-b4.mp3": "a3b9a260ac",
  "games/yusuf/assets/audio/c5-c.mp3": "e11f6d7ac0",
  "games/yusuf/assets/audio/c5-d.mp3": "400a35318f",
  "games/yusuf/assets/audio/c5-do.mp3": "ee426b4e5f",
  "games/yusuf/assets/audio/c5-do2.mp3": "49c0157568",
  "games/yusuf/assets/audio/c5-o1.mp3": "1378f93215",
  "games/yusuf/assets/audio/c5-o2.mp3": "d12a655c88",
  "games/yusuf/assets/audio/c5-o3.mp3": "d7fc0c9440",
  "games/yusuf/assets/audio/c5-o4.mp3": "36ee2eeea0",
  "games/yusuf/assets/audio/c5-wrong2.mp3": "7fe55cec3f",
  "games/yusuf/assets/audio/c6-a.mp3": "8e0c211ef6",
  "games/yusuf/assets/audio/c6-b.mp3": "5830440285",
  "games/yusuf/assets/audio/c6-c.mp3": "c8133aa6d1",
  "games/yusuf/assets/audio/c6-d1.mp3": "922def8f30",
  "games/yusuf/assets/audio/c6-d2.mp3": "d54998db49",
  "games/yusuf/assets/audio/c6-do.mp3": "54be6d8636",
  "games/yusuf/assets/audio/c6-m1.mp3": "7a142efd22",
  "games/yusuf/assets/audio/c6-m2.mp3": "85b30c9d1e",
  "games/yusuf/assets/audio/c6-q.mp3": "7bfcb3e0b0",
  "games/yusuf/assets/audio/c6-qwrong.mp3": "c85c976a97",
  "games/yusuf/assets/audio/c7-a.mp3": "6fae88efc7",
  "games/yusuf/assets/audio/c7-b.mp3": "fa09ee4990",
  "games/yusuf/assets/audio/c7-c.mp3": "6d6a6add06",
  "games/yusuf/assets/audio/c7-do.mp3": "61040bb25a",
  "games/yusuf/assets/audio/c7-good.mp3": "9c039c12e6",
  "games/yusuf/assets/audio/c7-hard.mp3": "a51810fa79",
  "games/yusuf/assets/audio/c7-pick.mp3": "adec0fa6e6",
  "games/yusuf/assets/audio/c7-sort.mp3": "6eb2af585f",
  "games/yusuf/assets/audio/c7-swrong.mp3": "c02534bde6",
  "games/yusuf/assets/audio/c8-a1.mp3": "737d4054eb",
  "games/yusuf/assets/audio/c8-a2.mp3": "89a203f99c",
  "games/yusuf/assets/audio/c8-b.mp3": "036b18c5cb",
  "games/yusuf/assets/audio/c8-c.mp3": "f4a37fe097",
  "games/yusuf/assets/audio/c8-do-o.mp3": "ce07fd3fca",
  "games/yusuf/assets/audio/c8-do.mp3": "2a18df65cc",
  "games/yusuf/assets/audio/c8-o1.mp3": "81f0400b3e",
  "games/yusuf/assets/audio/c8-o2.mp3": "923a85df2c",
  "games/yusuf/assets/audio/c8-o3.mp3": "c6a423642c",
  "games/yusuf/assets/audio/c8-o4.mp3": "e2c06f128a",
  "games/yusuf/assets/audio/c8-wrong-o.mp3": "27489a9768",
  "games/yusuf/assets/audio/c9-a.mp3": "39cf45c545",
  "games/yusuf/assets/audio/c9-b.mp3": "b829044ef9",
  "games/yusuf/assets/audio/c9-c.mp3": "35416b60c5",
  "games/yusuf/assets/audio/c9-do.mp3": "9a5906c413",
  "games/yusuf/assets/audio/c9-pick.mp3": "797ee8b473",
  "games/yusuf/assets/audio/c9-q.mp3": "4562127bde",
  "games/yusuf/assets/audio/c9-qwrong.mp3": "4c9d37113a",
  "games/yusuf/assets/audio/end-a.mp3": "fd51a58219",
  "games/yusuf/assets/audio/mem-do.mp3": "7a8c332758",
  "games/yusuf/assets/audio/pz-do.mp3": "b2802f97c0",
  "games/yusuf/assets/img/bg-desert.webp": "6369245ab7",
  "games/yusuf/assets/img/bg-egypt.webp": "a15c7dda93",
  "games/yusuf/assets/img/bg-field.webp": "07ca5d8c0d",
  "games/yusuf/assets/img/bg-market.webp": "eac1ea97ab",
  "games/yusuf/assets/img/bg-night.webp": "735fb64915",
  "games/yusuf/assets/img/bg-palace.webp": "cd0defe156",
  "games/yusuf/assets/img/bg-prison.webp": "7894bbffb8",
  "games/yusuf/assets/img/bg-wall.webp": "50fe0705c0",
  "games/yusuf/assets/img/bg-well.webp": "2a0e1684f9",
  "games/yusuf/assets/img/c1-a.webp": "496bd67a77",
  "games/yusuf/assets/img/c1-b.webp": "c88c95de7c",
  "games/yusuf/assets/img/c10-a.webp": "1417596b91",
  "games/yusuf/assets/img/c10-b.webp": "144c185d05",
  "games/yusuf/assets/img/c10-c.webp": "bae740daa0",
  "games/yusuf/assets/img/c10-g.webp": "d3d1107d0c",
  "games/yusuf/assets/img/c11-a.webp": "365fd5f102",
  "games/yusuf/assets/img/c11-b.webp": "5ac086a799",
  "games/yusuf/assets/img/c11-c.webp": "7eb6ed50d4",
  "games/yusuf/assets/img/c11-d.webp": "a507932342",
  "games/yusuf/assets/img/c11-e.webp": "0ba6ec7851",
  "games/yusuf/assets/img/c12-a.webp": "c72f78dbe8",
  "games/yusuf/assets/img/c12-b.webp": "748c832026",
  "games/yusuf/assets/img/c12-c.webp": "5e8b072059",
  "games/yusuf/assets/img/c13-a.webp": "b9e2a43e8e",
  "games/yusuf/assets/img/c13-b.webp": "b309474f15",
  "games/yusuf/assets/img/c13-b0.webp": "c876c37c7a",
  "games/yusuf/assets/img/c13-c.webp": "b810059cdf",
  "games/yusuf/assets/img/c2-a.webp": "6dbcd3e2e2",
  "games/yusuf/assets/img/c2-b.webp": "27fff5147b",
  "games/yusuf/assets/img/c2-c.webp": "3918d3a4e4",
  "games/yusuf/assets/img/c2-d.webp": "a8b70eb066",
  "games/yusuf/assets/img/c2-s.webp": "a796ff1ce3",
  "games/yusuf/assets/img/c2-w.webp": "6e95778f14",
  "games/yusuf/assets/img/c3-a.webp": "78f8f03eec",
  "games/yusuf/assets/img/c3-b.webp": "18b7f765b6",
  "games/yusuf/assets/img/c4-a.webp": "0ef68c6ff5",
  "games/yusuf/assets/img/c4-b.webp": "305b54ddad",
  "games/yusuf/assets/img/c4-c.webp": "0c91c200a5",
  "games/yusuf/assets/img/c5-a.webp": "4e95bff7a5",
  "games/yusuf/assets/img/c5-b1.webp": "cf7e6f1cbd",
  "games/yusuf/assets/img/c5-b2.webp": "e6e6377c89",
  "games/yusuf/assets/img/c5-b3.webp": "e6ca1e0e4a",
  "games/yusuf/assets/img/c5-b4.webp": "4123f55e59",
  "games/yusuf/assets/img/c5-c.webp": "b945935a01",
  "games/yusuf/assets/img/c5-d.webp": "4eec72b04b",
  "games/yusuf/assets/img/c6-a.webp": "98041fc07c",
  "games/yusuf/assets/img/c6-b.webp": "1dddf6e8e2",
  "games/yusuf/assets/img/c6-c.webp": "794619c16a",
  "games/yusuf/assets/img/c7-a.webp": "7a7d5887c9",
  "games/yusuf/assets/img/c7-b.webp": "1290efbd00",
  "games/yusuf/assets/img/c7-c.webp": "d8cd7a29ba",
  "games/yusuf/assets/img/c8-a1.webp": "def6e08e1f",
  "games/yusuf/assets/img/c8-a2.webp": "3e887afee0",
  "games/yusuf/assets/img/c8-b.webp": "f7c9b58ffd",
  "games/yusuf/assets/img/c8-c.webp": "ab5df9a7cc",
  "games/yusuf/assets/img/c9-a.webp": "18c7f01d26",
  "games/yusuf/assets/img/c9-b.webp": "2a51fef58c",
  "games/yusuf/assets/img/c9-c.webp": "aeb191b874",
  "games/yusuf/assets/img/p-b1.webp": "4ba1a67614",
  "games/yusuf/assets/img/p-b2.webp": "7f21d2ee64",
  "games/yusuf/assets/img/p-b3.webp": "0b5ef55af3",
  "games/yusuf/assets/img/p-b4.webp": "24e794512f",
  "games/yusuf/assets/img/p-benjamin.webp": "53740f460d",
  "games/yusuf/assets/img/p-yusuf.webp": "63969fa847",
  "games/yusuf/assets/img/p-yusufMan.webp": "17681278a3",
  "games/yusuf/cover.webp": "5fe8263068",
  "icons/icon-180.png": "ba6753408e",
  "icons/icon-192.png": "a9487de3cd",
  "icons/icon-512.png": "ba45dd16b8",
  "icons/icon-maskable-512.png": "d0cbcbf3ba"
};
const MEDIA_BASE = "https://asmau-sync.mohammed-sadat-abdulai.workers.dev/media/";
// END GENERATED

const SHELL_CACHE = "asmau-shell-" + BUILD;
const MEDIA_CACHE = "asmau-media";
const INDEX_URL = new URL("media-index.json", self.registration.scope).href;
const SCOPE_PATH = new URL(self.registration.scope).pathname;
const FRESH = /\.(?:html|js|css|json|webmanifest)$|\/$/;

function pool(jobs, n) {
  var queue = jobs.slice();
  function worker() {
    var j = queue.shift();
    return j ? j().catch(function () { /* tolerated */ }).then(worker) : Promise.resolve();
  }
  var ws = [];
  for (var i = 0; i < n; i++) ws.push(worker());
  return Promise.all(ws);
}

function saveShell() {
  return caches.open(SHELL_CACHE).then(function (cache) {
    return pool(SHELL.map(function (f) {
      return function () {
        return fetch(new Request(f, { cache: "reload" })).then(function (res) { if (res && res.ok) return cache.put(f, res); });
      };
    }), 6);
  });
}

// Download only what is new or changed since the last release, and forget what was removed.
function syncMedia() {
  return caches.open(MEDIA_CACHE).then(function (cache) {
    return cache.match(INDEX_URL).then(function (r) { return r ? r.json() : {}; }).catch(function () { return {}; }).then(function (have) {
      var next = {};
      // pictures first (the game waits for those), then fonts, then sounds
      var order = Object.keys(MEDIA).sort(function (x, y) {
        var rank = function (f) { return /\.(?:webp|png|jpe?g)$/i.test(f) ? 0 : (/\.woff2?$/i.test(f) ? 1 : 2); };
        return rank(x) - rank(y);
      });
      var jobs = order.map(function (f) {
        return function () {
          if (have[f] === MEDIA[f]) { next[f] = MEDIA[f]; return Promise.resolve(); }
          function keep(res) { if (res && res.ok) { next[f] = MEDIA[f]; return cache.put(f, res); } }
          var local = function () { return fetch(new Request(f, { cache: "reload" })).then(keep); };
          // pictures and sounds come from R2 first (fast, cached at the edge); anything wrong falls back to GitHub Pages
          if (!/\.(?:webp|mp3|webm|ogg|m4a)$/i.test(f)) return local();
          return fetch(MEDIA_BASE + MEDIA[f] + "/" + f, { mode: "cors" }).then(function (res) { return res.ok ? keep(res) : local(); }).catch(local);
        };
      });
      return pool(jobs, 6).then(function () {
        return cache.keys().then(function (reqs) {
          return Promise.all(reqs.map(function (rq) {
            var rel = new URL(rq.url).pathname.slice(SCOPE_PATH.length);
            if (rq.url !== INDEX_URL && !MEDIA[rel]) return cache.delete(rq);
          }));
        });
      }).then(function () {
        return cache.put(INDEX_URL, new Response(JSON.stringify(next), { headers: { "content-type": "application/json" } }));
      });
    });
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(Promise.all([saveShell(), syncMedia()]).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        // this release's shell and the long-lived media cache stay; every older shape goes
        return Promise.all(keys.filter(function (k) { return k.indexOf("asmau-") === 0 && k !== SHELL_CACHE && k !== MEDIA_CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

function remember(cacheName, req, res) {
  if (res && res.ok) {
    var copy = res.clone();
    caches.open(cacheName).then(function (c) { c.put(req, copy); });
  }
  return res;
}

function fromAnyCache(req) { return caches.match(req, { ignoreSearch: true }); }

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  var rel = url.pathname.slice(SCOPE_PATH.length);

  if (MEDIA[rel]) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(function (c) { return c.match(req, { ignoreSearch: true }); }).then(function (hit) {
        return hit || fetch(req).then(function (res) { return remember(MEDIA_CACHE, req, res); });
      })
    );
    return;
  }

  if (req.mode === "navigate" || FRESH.test(url.pathname)) {
    event.respondWith(
      new Promise(function (resolve) {
        var settled = false;
        var timer = setTimeout(function () {
          fromAnyCache(req).then(function (hit) { if (hit && !settled) { settled = true; resolve(hit); } });
        }, 4000);
        fetch(req, { cache: "no-cache" }).then(function (res) {
          clearTimeout(timer);
          if (!settled) { settled = true; resolve(remember(SHELL_CACHE, req, res)); } else remember(SHELL_CACHE, req, res);
        }).catch(function () {
          clearTimeout(timer);
          fromAnyCache(req).then(function (hit) { if (!settled) { settled = true; resolve(hit || Response.error()); } });
        });
      })
    );
    return;
  }

  event.respondWith(fromAnyCache(req).then(function (hit) { return hit || fetch(req); }));
});
