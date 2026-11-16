/*
  Where a game's pictures and sounds are. They live on R2 (not in git), at addresses that include each file's
  fingerprint (scripts/SCALING.md); the game's pack lists (packs/<slug>.json, <slug>@w, <slug>@m) say which.

    AsmauMedia.ready(slug)  load the game's lists (call once, before the game shows a picture or plays a sound)
    AsmauMedia.url(path)    the address to use for a path relative to the page ("assets/img/c1-a.webp") or to the
                            site ("games/yusuf/assets/img/c1-a.webp"); a path no list knows is returned unchanged
    AsmauMedia.has(path)    whether the game has that file at all

  Reads shared/config.js (window.ASMAU_CONFIG.media) for the R2 address.
*/
window.AsmauMedia = (function () {
  "use strict";
  var me = document.currentScript ? document.currentScript.src : location.href;
  var root = new URL("../", me);                         // the site's root (this file is in shared/)
  var base = (window.ASMAU_CONFIG && window.ASMAU_CONFIG.media) || "";
  var files = {}, loaded = {};

  function load(pack) {
    if (!loaded[pack]) {
      loaded[pack] = fetch(new URL("packs/" + pack + ".json", root).href).then(function (r) { return r.ok ? r.json() : { files: {} }; })
        .then(function (l) { Object.keys(l.files || {}).forEach(function (f) { files[f] = l.files[f]; }); })
        .catch(function () { /* offline with nothing saved: paths are used as they are */ });
    }
    return loaded[pack];
  }
  function ready(slug) {
    var l = [load(slug), load(slug + "@w"), load(slug + "@m")];
    // another language (shared/lang.js): its narration too, where the game has it
    var code = window.AsmauLang && window.AsmauLang.code();
    if (code && code !== "en") l.push(load(slug + "@" + code + "-w"), load(slug + "@" + code + "-m"));
    return Promise.all(l);
  }

  // the path from the site's root, for a path relative to this page
  function sitePath(p) {
    var u = new URL(p, location.href);
    return u.href.indexOf(root.href) === 0 ? decodeURIComponent(u.href.slice(root.href.length).split(/[?#]/)[0]) : null;
  }
  function url(p) {
    var f = sitePath(p), h = f && files[f];
    return h && base ? base + h + "/" + f : p;
  }
  function has(p) { var f = sitePath(p); return !!(f && files[f]); }

  // on a game's own page, start loading its lists at once
  var here = sitePath(location.href), g = here && /^games\/([^/]+)\//.exec(here);
  if (g) ready(g[1]);

  return { ready: ready, url: url, has: has };
})();
