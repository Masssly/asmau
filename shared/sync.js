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
  AsmauSync.pushOne(key, blob)   upload one recording (after recording it)
  AsmauSync.removeAll()          delete everything stored on the server for this family
*/
window.AsmauSync = (function () {
  "use strict";

  var SERVER = "https://asmau-sync.mohammed-sadat-abdulai.workers.dev";
  var LS = "asmau-sync-code";
  var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  var enc = new TextEncoder();
  var keyCache = null;

  function ls(op, v) {
    try { return op === "get" ? localStorage.getItem(LS) : (op === "set" ? localStorage.setItem(LS, v) : localStorage.removeItem(LS)); } catch (e) { return null; }
  }

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

  function pushOne(key, blob) {
    if (!ls("get")) return Promise.resolve(false);
    return derive().then(function (k) {
      return seal(k, blob).then(function (bytes) {
        return fetch(url(k, key), { method: "PUT", body: bytes }).then(ok);
      });
    }).then(function () { return true; });
  }

  function b64(blob) {
    return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(",")[1]); }; r.readAsDataURL(blob); });
  }

  // Both ways: what is only on this device goes up, what is only on the server comes down.
  // A recording that exists on both sides is left alone.
  function sync() {
    var N = window.AsmauNarration, counts = { up: 0, down: 0 };
    return Promise.all([derive(), N.exportAll()]).then(function (r) {
      var k = r[0], local = r[1].clips, have = {};
      local.forEach(function (c) { have[c.key] = c; });
      return fetch(url(k), { method: "GET" }).then(ok).then(function (res) { return res.json(); }).then(function (remote) {
        var there = {};
        remote.forEach(function (o) { there[o.name] = true; });
        var ups = local.filter(function (c) { return !there[c.key]; });
        var downs = remote.filter(function (o) { return !have[o.name]; });
        var upJobs = ups.map(function (c) {
          var bin = atob(c.data), u = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
          return seal(k, new Blob([u], { type: c.type })).then(function (bytes) {
            return fetch(url(k, c.key), { method: "PUT", body: bytes }).then(ok);
          }).then(function () { counts.up += 1; });
        });
        var downJobs = downs.map(function (o) {
          return fetch(url(k, o.name)).then(ok).then(function (r2) { return r2.arrayBuffer(); }).then(function (bytes) { return open(k, bytes); }).then(function (blob) {
            var i = o.name.indexOf(":");
            if (i < 1) return;
            return N.saveRecordedClip(o.name.slice(0, i), o.name.slice(i + 1), blob).then(function () { counts.down += 1; });
          });
        });
        return Promise.all(upJobs.concat(downJobs));
      });
    }).then(function () { return counts; });
  }

  function removeAll() {
    return derive().then(function (k) { return fetch(url(k), { method: "DELETE" }).then(ok).then(function (r) { return r.json(); }); });
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
    disconnect: function () { keyCache = null; ls("del"); },
    sync: sync,
    pushOne: pushOne,
    removeAll: removeAll
  };
})();
