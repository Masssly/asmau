/*
  Optional: keep a parent's recordings on all their devices.

  Nothing here runs unless a parent turns it on in the recording tool. It never
  touches the narration or the games.

  A family code (16 characters, written XXXX-XXXX-XXXX-XXXX) is the only
  "account". From it the browser derives, with PBKDF2:
    - a family id (a hash; this is the folder name on the server), and
    - an encryption key (AES-GCM) that never leaves the device.
  Every recording is encrypted on the device before it is uploaded, so the
  server holds only unreadable bytes. The code itself is never sent. There is
  no way to recover a lost code, by design: without it the stored recordings
  cannot be read by anyone.

  AsmauSync.newCode()            make a fresh code
  AsmauSync.connect(code)        remember the code on this device (checks its shape)
  AsmauSync.disconnect()         forget the code on this device (server data stays)
  AsmauSync.code()               the remembered code, or null
  AsmauSync.sync()               upload what is only here, download what is only there
  AsmauSync.pushOne(key, blob)   upload one recording (after recording it); it replaces the older
                                 online copy only once the new one is stored
  AsmauSync.dropOne(key)         remove one recording's online copy
  AsmauSync.usage()              { used, limit } in bytes, from the last listing
  AsmauSync.removeAll()          delete everything stored on the server for this family
*/
window.AsmauSync = (function () {
  "use strict";

  var SERVER = "https://asmau-sync.mohammed-sadat-abdulai.workers.dev";
  var LS = "asmau-sync-code";
  var LS_STATE = "asmau-sync-state";   // { dirty: {key:1}, gone: {key:1}, seen: {key: remote upload time} }
  var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  var enc = new TextEncoder();
  var keyCache = null;

  function ls(op, v) {
    try { return op === "get" ? localStorage.getItem(LS) : (op === "set" ? localStorage.setItem(LS, v) : localStorage.removeItem(LS)); } catch (e) { return null; }
  }

  function state() {
    try { var s = JSON.parse(localStorage.getItem(LS_STATE) || "{}"); return { dirty: s.dirty || {}, gone: s.gone || {}, seen: s.seen || {} }; } catch (e) { return { dirty: {}, gone: {}, seen: {} }; }
  }
  function saveState(st) { try { localStorage.setItem(LS_STATE, JSON.stringify(st)); } catch (e) { /* private mode */ } }

  function normalise(code) { return String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }
  function valid(code) { var c = normalise(code); return c.length === 16 && c.split("").every(function (ch) { return ALPHABET.indexOf(ch) >= 0; }); }
  function pretty(c) { return c.match(/.{4}/g).join("-"); }

  function newCode() {
    var bytes = crypto.getRandomValues(new Uint8Array(16)), out = "";
    for (var i = 0; i < 16; i++) out += ALPHABET[bytes[i] % 32];  // 32 symbols, so no bias
    return pretty(out);
  }

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }

  function derive() {
    var raw = normalise(ls("get"));
    if (!raw) return Promise.reject(new Error("Sync is not turned on."));
    if (keyCache && keyCache.raw === raw) return Promise.resolve(keyCache);
    return crypto.subtle.importKey("raw", enc.encode(raw), "PBKDF2", false, ["deriveBits"]).then(function (base) {
      return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", iterations: 200000, salt: enc.encode("asmau-sync-v1") }, base, 512);
    }).then(function (bits) {
      var id = hex(bits.slice(0, 32));
      return crypto.subtle.importKey("raw", bits.slice(32, 64), "AES-GCM", false, ["encrypt", "decrypt"]).then(function (key) {
        keyCache = { raw: raw, id: id, key: key };
        return keyCache;
      });
    });
  }

  function url(k, name) { return SERVER + "/v1/" + k.id + "/" + (name || ""); }
  function ok(r) { if (!r.ok) throw new Error("The sync server said " + r.status + "."); return r; }

  function seal(k, blob) {
    return blob.arrayBuffer().then(function (data) {
      var head = enc.encode(JSON.stringify({ type: blob.type || "audio/webm" }));
      var plain = new Uint8Array(4 + head.length + data.byteLength);
      new DataView(plain.buffer).setUint32(0, head.length);
      plain.set(head, 4);
      plain.set(new Uint8Array(data), 4 + head.length);
      var iv = crypto.getRandomValues(new Uint8Array(12));
      return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k.key, plain).then(function (ct) {
        var out = new Uint8Array(12 + ct.byteLength);
        out.set(iv, 0); out.set(new Uint8Array(ct), 12);
        return out;
      });
    });
  }

  function open(k, bytes) {
    var u = new Uint8Array(bytes);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, k.key, u.slice(12)).then(function (plain) {
      var p = new Uint8Array(plain), n = new DataView(plain).getUint32(0);
      var head = JSON.parse(new TextDecoder().decode(p.slice(4, 4 + n)));
      return new Blob([p.slice(4 + n)], { type: head.type || "audio/webm" });
    });
  }

  // The number of bytes kept online, and the limit, from the last listing.
  var lastUsage = null;
  function listing(k) {
    return fetch(url(k)).then(ok).then(function (res) {
      var limit = parseInt(res.headers.get("x-asmau-limit") || "0", 10) || null;
      return res.json().then(function (list) {
        lastUsage = { used: list.reduce(function (n, o) { return n + o.size; }, 0), limit: limit };
        return list;
      });
    });
  }
  function noteSeen(list) {
    var st = state();
    list.forEach(function (o) { st.seen[o.name] = o.uploaded; });
    Object.keys(st.seen).forEach(function (n) { if (!list.some(function (o) { return o.name === n; })) delete st.seen[n]; });
    saveState(st);
  }
  function fullError(res) {
    return res.json().catch(function () { return {}; }).then(function (j) {
      var e = new Error("Your online space is full" + (j.limit ? " (" + Math.round(j.limit / 1048576) + " MB)" : "") + ". Remove a recording you no longer need, then sync again.");
      e.full = true;
      throw e;
    });
  }
  function put(k, key, blob) {
    return seal(k, blob).then(function (bytes) {
      return fetch(url(k, key), { method: "PUT", body: bytes }).then(function (r) { return r.status === 413 ? fullError(r) : ok(r); });
    });
  }

  // A recording was made (or made again) on this device. It is marked as waiting
  // until the upload is confirmed; the older online copy is replaced only then.
  function pushOne(key, blob) {
    if (!ls("get")) return Promise.resolve(false);
    var st = state(); st.dirty[key] = 1; delete st.gone[key]; saveState(st);
    return derive().then(function (k) {
      return put(k, key, blob).then(function () {
        var st2 = state(); delete st2.dirty[key]; saveState(st2);
        return listing(k).then(noteSeen);
      });
    }).then(function () { return true; });
  }

  // A recording was removed on this device: remove its online copy too.
  function dropOne(key) {
    if (!ls("get")) return Promise.resolve(false);
    var st = state(); st.gone[key] = 1; delete st.dirty[key]; saveState(st);
    return derive().then(function (k) {
      return fetch(url(k, key), { method: "DELETE" }).then(ok).then(function () {
        var st2 = state(); delete st2.gone[key]; delete st2.seen[key]; saveState(st2);
        return true;
      });
    });
  }

  // Both ways. Removals first, then what is waiting, then new things in either direction;
  // a recording made again on another device replaces the older one here.
  function sync() {
    var N = window.AsmauNarration, counts = { up: 0, down: 0, removed: 0 };
    return Promise.all([derive(), N.exportAll()]).then(function (r) {
      var k = r[0], local = r[1].clips, have = {};
      local.forEach(function (c) { have[c.key] = c; });
      var st = state();
      var removals = Object.keys(st.gone).map(function (key) {
        return fetch(url(k, key), { method: "DELETE" }).then(ok).then(function () { delete st.gone[key]; delete st.seen[key]; counts.removed += 1; });
      });
      return Promise.all(removals).then(function () { saveState(st); return listing(k); }).then(function (remote) {
        var there = {};
        remote.forEach(function (o) { there[o.name] = o; });
        st = state();
        var jobs = [];
        local.forEach(function (c) {
          var o = there[c.key];
          if (o && !st.dirty[c.key]) return;                 // same on both sides, or the remote is handled below
          jobs.push((function () {
            var bin = atob(c.data), u = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
            return put(k, c.key, new Blob([u], { type: c.type })).then(function () { counts.up += 1; var s2 = state(); delete s2.dirty[c.key]; saveState(s2); });
          })());
        });
        remote.forEach(function (o) {
          if (st.gone[o.name]) return;
          var mine = have[o.name];
          var isNew = !mine, changed = mine && st.seen[o.name] && st.seen[o.name] !== o.uploaded && !st.dirty[o.name];
          if (!isNew && !changed) return;
          jobs.push(fetch(url(k, o.name)).then(ok).then(function (r2) { return r2.arrayBuffer(); }).then(function (bytes) { return open(k, bytes); }).then(function (blob) {
            var i = o.name.indexOf(":");
            if (i < 1) return;
            return N.saveRecordedClip(o.name.slice(0, i), o.name.slice(i + 1), blob).then(function () { counts.down += 1; });
          }));
        });
        return Promise.all(jobs);
      }).then(function () { return listing(k); }).then(noteSeen);
    }).then(function () { return counts; });
  }

  function removeAll() {
    return derive().then(function (k) {
      return fetch(url(k), { method: "DELETE" }).then(ok).then(function (r) { return r.json(); }).then(function (j) {
        saveState({ dirty: {}, gone: {}, seen: {} }); lastUsage = { used: 0, limit: lastUsage && lastUsage.limit };
        return j;
      });
    });
  }

  return {
    newCode: newCode,
    valid: valid,
    pretty: function (c) { return pretty(normalise(c)); },
    code: function () { var c = ls("get"); return c ? pretty(normalise(c)) : null; },
    connect: function (code) {
      if (!valid(code)) throw new Error("That does not look like a family code. It has 16 letters and numbers.");
      keyCache = null;
      ls("set", normalise(code));
    },
    disconnect: function () { keyCache = null; ls("del"); saveState({ dirty: {}, gone: {}, seen: {} }); },
    sync: sync,
    pushOne: pushOne,
    dropOne: dropOne,
    usage: function () { return lastUsage; },
    removeAll: removeAll
  };
})();
