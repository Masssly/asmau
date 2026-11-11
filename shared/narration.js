/*
  Asmau narration — one lookup, four fallback tiers, best source wins:

    1. A clip recorded on THIS device via tools/record-voice, stored in
       IndexedDB. Instant, personal, needs no commit.
    2. assets/audio/<id>.webm committed in the repo — a real human
       recording a parent chose to share with everyone who opens the game.
    3. assets/audio/<id>.mp3 committed in the repo — a pre-rendered
       placeholder made with the open-source `flite` engine. Only ever
       generated for English text (see scripts/generate-placeholder-audio.sh);
       there is deliberately no synthesized Arabic tier, because a robotic
       guess at Arabic pronunciation is worse than no audio at all.
    4. The device's own speechSynthesis voice, same placeholder-quality
       caveat as always.

  Every game includes this file and calls AsmauNarration.say(...). The
  recording tool (tools/record-voice) reads each game's narration.json
  and writes into the same IndexedDB store this file reads from.

  Only one line speaks at a time: say() and stop() both cut off whatever
  was playing, and the promise say() returns resolves when its own line
  has finished, so lines can be chained with .then().
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

  function saveRecordedClip(game, id, blob) {
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

  function stop() {
    token += 1;
    if (currentAudio) {
      try { currentAudio.pause(); } catch (err) { /* already stopped */ }
      currentAudio = null;
    }
    try {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch (err) { /* no speech engine */ }
  }

  // A line that was superseded before it could start counts as handled
  // (resolves true) so nothing further down the chain tries to speak it.
  function playBlob(blob, my) {
    return new Promise(function (resolve) {
      if (my !== token) { resolve(true); return; }
      try {
        var url = URL.createObjectURL(blob);
        var a = new Audio(url);
        currentAudio = a;
        a.onended = function () { URL.revokeObjectURL(url); resolve(true); };
        a.onerror = function () { URL.revokeObjectURL(url); resolve(false); };
        a.play().catch(function () { resolve(false); });
      } catch (err) { resolve(false); }
    });
  }

  function tryPlayUrl(url, my) {
    return new Promise(function (resolve) {
      if (my !== token) { resolve(true); return; }
      var a = new Audio();
      var done = false;
      var finish = function (ok) { if (done) return; done = true; resolve(ok); };
      // The load timeout only guards against a missing file — once the clip
      // can play we wait for it to actually finish, however long it runs.
      var loadTimeout = setTimeout(function () { finish(false); }, 1500);
      a.oncanplaythrough = function () {
        a.oncanplaythrough = null;
        clearTimeout(loadTimeout);
        if (my !== token) { finish(true); return; }
        currentAudio = a;
        a.onended = function () { finish(true); };
        a.play().catch(function () { finish(false); });
      };
      a.onerror = function () { clearTimeout(loadTimeout); finish(false); };
      a.src = url;
      a.load();
    });
  }

  function speakFallback(text, lang, my) {
    return new Promise(function (resolve) {
      try {
        if (my !== token || !("speechSynthesis" in window) || !text) { resolve(); return; }
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang === "ar" ? "ar" : "en-US";
        u.rate = 0.85;
        u.pitch = 1.1;
        u.onend = function () { resolve(); };
        u.onerror = function () { resolve(); };
        window.speechSynthesis.speak(u);
        setTimeout(resolve, 20000);
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

    return getRecordedClip(game, id).then(function (blob) {
      if (blob) return playBlob(blob, my);
      return tryPlayUrl(base + id + ".webm", my).then(function (ok) {
        if (ok) return true;
        if (lang === "ar") return false; // no synthesized Arabic tier — see file header
        return tryPlayUrl(base + id + ".mp3", my);
      });
    }).then(function (played) {
      if (!played) return speakFallback(text, lang, my);
    }).catch(function () {
      return speakFallback(text, lang, my);
    });
  }

  return {
    say: say,
    stop: stop,
    getRecordedClip: getRecordedClip,
    saveRecordedClip: saveRecordedClip,
    deleteRecordedClip: deleteRecordedClip,
    listRecordedIds: listRecordedIds,
    clipKey: clipKey
  };
})();
