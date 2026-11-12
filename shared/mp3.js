/*
  Turns a recording into an MP3, so a voice recorded in one browser plays on every
  device. Browsers record in different formats (Firefox: WebM or Ogg, Safari: MP4/AAC),
  and not every browser can play every format; MP3 plays everywhere.

  AsmauMp3.convert(blob)   Promise of an MP3 Blob; if this browser cannot decode the
                           recording, the original blob is returned unchanged.
  AsmauMp3.isMp3(blob)     true if it already is one.

  The encoder (vendor/lame.min.js, lamejs, LGPL) is loaded only when first needed.
*/
window.AsmauMp3 = (function () {
  "use strict";
  var here = document.currentScript ? document.currentScript.src : location.href;
  var loading = null;

  function load() {
    if (window.lamejs) return Promise.resolve();
    if (!loading) {
      loading = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = new URL("vendor/lame.min.js", here).href;
        s.onload = resolve;
        s.onerror = function () { loading = null; reject(new Error("encoder not available")); };
        document.head.appendChild(s);
      });
    }
    return loading;
  }

  function isMp3(blob) { return /mpeg|mp3/i.test((blob && blob.type) || ""); }

  function encode(buffer) {
    var rate = buffer.sampleRate, n = buffer.length, mono = new Int16Array(n), ch = buffer.numberOfChannels, i, c;
    var data = [];
    for (c = 0; c < ch; c++) data.push(buffer.getChannelData(c));
    for (i = 0; i < n; i++) {
      var v = 0;
      for (c = 0; c < ch; c++) v += data[c][i];
      v = Math.max(-1, Math.min(1, v / ch));
      mono[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
    }
    var enc = new window.lamejs.Mp3Encoder(1, rate, 64), out = [], block = 1152, chunk;
    for (i = 0; i < n; i += block) {
      chunk = enc.encodeBuffer(mono.subarray(i, i + block));
      if (chunk.length) out.push(chunk);
    }
    chunk = enc.flush();
    if (chunk.length) out.push(chunk);
    return new Blob(out, { type: "audio/mpeg" });
  }

  function convert(blob) {
    if (!blob || isMp3(blob)) return Promise.resolve(blob);
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return Promise.resolve(blob);
    return Promise.all([load(), blob.arrayBuffer()]).then(function (r) {
      var ctx = new AC();
      return new Promise(function (resolve, reject) {
        var p = ctx.decodeAudioData(r[1], resolve, reject);
        if (p && p.catch) p.catch(reject);
      }).then(function (buffer) {
        try { ctx.close(); } catch (e) { /* already closed */ }
        var mp3 = encode(buffer);
        return mp3.size ? mp3 : blob;
      });
    }).catch(function () { return blob; });
  }

  return { convert: convert, isMp3: isMp3 };
})();
