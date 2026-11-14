/*
  Asmau narration — one lookup, three sources, best one wins:

    1. A clip recorded on THIS device via tools/record-voice (or received by
       sync), stored in IndexedDB. Instant, personal, needs no commit.
    2. assets/audio/<id>.mp3 committed in the repo. For English this is a
       placeholder made with the open-source `flite` engine (see
       scripts/generate-placeholder-audio.sh) until someone replaces the file
       with a real recording of the same name. For Arabic a file only ever
       exists if a person recorded it.
    3. The device's own speechSynthesis voice, for ENGLISH only.

  Arabic is never synthesized, by flite or by the device: a guessed
  pronunciation presented to a child as a lesson is worse than silence. An
  Arabic line plays only from a real human recording and is otherwise
  silent, while its text still shows on screen.

  Only one line speaks at a time: say() and stop() both cut off whatever
  was playing, and the promise say() returns resolves when its own line
  has finished or been cut off, so lines can be chained with .then().
*/
window.AsmauNarration = (function () {
  var DB_NAME = "asmau-voice";
  var STORE = "clips";
  var dbPromise = null;
  var token = 0;
  var currentAudio = null;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve) {
      if (!("indexedDB" in window)) { resolve(null); return; }
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { resolve(null); };
    });
    return dbPromise;
  }

  function clipKey(game, id) { return game + ":" + id; }

  function getRecordedClip(game, id) {
    return openDb().then(function (db) {
      if (!db) return null;
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(STORE, "readonly");
          var req = tx.objectStore(STORE).get(clipKey(game, id));
          req.onsuccess = function () { resolve(req.result || null); };
          req.onerror = function () { resolve(null); };
        } catch (err) { resolve(null); }
      });
    });
  }

  var askedToKeep = false;
  function keepStorage() {
    if (askedToKeep) return;
    askedToKeep = true;
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (err) { /* not supported */ }
  }

  function saveRecordedClip(game, id, blob) {
    keepStorage();
    return openDb().then(function (db) {
      if (!db) throw new Error("IndexedDB unavailable");
      return new Promise(function (resolve, reject) {
        try {
          var tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).put(blob, clipKey(game, id));
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { reject(tx.error); };
        } catch (err) { reject(err); }
      });
    });
  }

  function deleteRecordedClip(game, id) {
    return openDb().then(function (db) {
      if (!db) return;
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).delete(clipKey(game, id));
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { resolve(); };
        } catch (err) { resolve(); }
      });
    });
  }

  function listRecordedIds(game) {
    return openDb().then(function (db) {
      if (!db) return [];
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(STORE, "readonly");
          var req = tx.objectStore(STORE).getAllKeys();
          req.onsuccess = function () {
            var prefix = game + ":";
            resolve(
              (req.result || [])
                .filter(function (k) { return k.indexOf(prefix) === 0; })
                .map(function (k) { return k.slice(prefix.length); })
            );
          };
          req.onerror = function () { resolve([]); };
        } catch (err) { resolve([]); }
      });
    });
  }

  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result).split(",")[1] || ""); };
      r.onerror = function () { reject(r.error); };
      r.readAsDataURL(blob);
    });
  }

  function base64ToBlob(b64, type) {
    var bin = atob(b64), n = bin.length, u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], { type: type });
  }

  // Everything recorded on this device, as one object that can be saved to a file.
  function exportAll() {
    return openDb().then(function (db) {
      if (!db) return [];
      return new Promise(function (resolve) {
        try {
          var out = [];
          var req = db.transaction(STORE, "readonly").objectStore(STORE).openCursor();
          req.onsuccess = function () {
            var c = req.result;
            if (c) { out.push({ key: c.key, blob: c.value }); c.continue(); } else resolve(out);
          };
          req.onerror = function () { resolve([]); };
        } catch (err) { resolve([]); }
      });
    }).then(function (rows) {
      return Promise.all(rows.map(function (r) {
        return blobToBase64(r.blob).then(function (b64) { return { key: r.key, type: r.blob.type || "audio/webm", data: b64 }; });
      }));
    }).then(function (clips) {
      return { app: "asmau-voice", version: 1, exported: new Date().toISOString(), clips: clips };
    });
  }

  // Load a file made by exportAll. Resolves with how many clips were restored.
  function importAll(bundle) {
    if (!bundle || bundle.app !== "asmau-voice" || !Array.isArray(bundle.clips)) {
      return Promise.reject(new Error("This is not an Asmau voice file."));
    }
    return openDb().then(function (db) {
      if (!db) throw new Error("This browser can't store recordings.");
      return new Promise(function (resolve, reject) {
        try {
          var tx = db.transaction(STORE, "readwrite"), store = tx.objectStore(STORE), n = 0;
          bundle.clips.forEach(function (c) {
            if (c && typeof c.key === "string" && typeof c.data === "string") {
              store.put(base64ToBlob(c.data, c.type || "audio/webm"), c.key);
              n += 1;
            }
          });
          tx.oncomplete = function () { resolve(n); };
          tx.onerror = function () { reject(tx.error); };
        } catch (err) { reject(err); }
      });
    });
  }

  /*
    One audio element plays every line. It is "unlocked" by the first touch,
    which is what lets an iPhone play later lines that start a moment after
    the tap (after a lookup), and it means an interrupted line is always
    cleaned up: there is never a second element still loading in the
    background that could start speaking late.
  */
  var player = null, finishCurrent = null, unlocked = false;
  // How loud the voice is: set by a parent (shared/sound-panel.js), stored by music.js for every game.
  // (An iPhone ignores this for recordings and clips: there only the device's own volume works.)
  function voiceLevel() {
    try { var v = (JSON.parse(localStorage.getItem("asmau-sound") || "{}") || {}).voice; return typeof v === "number" ? Math.max(0, Math.min(1, v)) : 1; } catch (err) { return 1; }
  }
  function setVolume(v) { if (player) { try { player.volume = v; } catch (err) { /* read-only on iPhone */ } } }
  var SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  function getPlayer() {
    if (!player) { player = new Audio(); player.preload = "auto"; }
    return player;
  }
  function unlock() {
    if (unlocked || finishCurrent) return;
    unlocked = true;
    try {
      var p = getPlayer();
      p.src = SILENCE;
      var r = p.play();
      if (r && r.catch) r.catch(function () { unlocked = false; });
    } catch (err) { unlocked = false; }
  }
  ["pointerdown", "touchend", "click", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, unlock, { capture: true, passive: true });
  });

  function stop() {
    token += 1;
    if (finishCurrent) {
      var f = finishCurrent;
      try { player.pause(); } catch (err) { /* already stopped */ }
      f(true);                       // a line that was cut off counts as handled
    }
    try {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch (err) { /* no speech engine */ }
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });

  // Plays one source on the shared player. Resolves true when it finished (or was
  // cut off), false if it could not be played, so the caller can try the next source.
  function playSrc(src, my, isBlobUrl) {
    return new Promise(function (resolve) {
      function release() { if (isBlobUrl) { try { URL.revokeObjectURL(src); } catch (err) { /* gone */ } } }
      if (my !== token) { release(); resolve(true); return; }
      var a = getPlayer(), done = false, started = false, timer = null;
      function finish(ok) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        a.onended = a.onerror = a.onplaying = null;
        if (finishCurrent === finish) finishCurrent = null;
        release();
        resolve(ok);
      }
      finishCurrent = finish;
      // only guards against a file that never arrives; once it is playing it runs to the end
      timer = setTimeout(function () {
        if (!started) { try { a.pause(); } catch (err) { /* not playing */ } finish(false); }
      }, 6000);
      a.onplaying = function () { started = true; clearTimeout(timer); };
      a.onended = function () { finish(true); };
      a.onerror = function () { finish(false); };
      try {
        a.src = src;
        try { a.volume = voiceLevel(); } catch (err) { /* read-only on iPhone */ }
        var p = a.play();
        if (p && p.catch) p.catch(function () { finish(false); });
      } catch (err) { finish(false); }
    });
  }

  function speakFallback(text, lang, my) {
    return new Promise(function (resolve) {
      try {
        if (lang === "ar") { resolve(); return; } // never synthesize Arabic — see the header
        if (my !== token || !("speechSynthesis" in window) || !text) { resolve(); return; }
        var u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 0.85;
        u.pitch = 1.1;
        u.volume = voiceLevel();
        u.onend = function () { resolve(); };
        u.onerror = function () { resolve(); };
        window.speechSynthesis.speak(u);
        setTimeout(resolve, 8000);
      } catch (err) { resolve(); }
    });
  }

  /**
   * Speak one narration line, cutting off any line already playing.
   * @param {string} game      game slug, e.g. "tap-and-say"
   * @param {string} id        stable id from that game's narration.json
   * @param {string} text      fallback text for on-device speech synthesis
   * @param {object} [opts]    { lang: "en"|"ar", audioBase: "assets/audio/" }
   */
  function say(game, id, text, opts) {
    opts = opts || {};
    var lang = opts.lang || "en";
    var base = opts.audioBase || "assets/audio/";

    stop();
    var my = token;

    var file = base + id + ".mp3";
    return getRecordedClip(game, id).then(function (blob) {
      if (!blob) return playSrc(file, my, false);
      // a recording this device cannot play (an old format) falls through to the committed file
      return playSrc(URL.createObjectURL(blob), my, true).then(function (ok) { return ok || playSrc(file, my, false); });
    }).then(function (played) {
      if (!played) return speakFallback(text, lang, my);   // (never for Arabic; see speakFallback)
    }).catch(function () {
      return speakFallback(text, lang, my);
    });
  }

  return {
    say: say,
    stop: stop,
    setVolume: setVolume,
    getRecordedClip: getRecordedClip,
    saveRecordedClip: saveRecordedClip,
    deleteRecordedClip: deleteRecordedClip,
    listRecordedIds: listRecordedIds,
    exportAll: exportAll,
    importAll: importAll,
    clipKey: clipKey
  };
})();
