/*
  Recording a parent's voice for one line, used by tools/record-voice/ (the guided "Record this story" screen and the
  "My recordings" list). It records, turns the recording into an MP3 (shared/mp3.js), saves it on the device
  (shared/narration.js) and sends it to the family's other devices if sync is on (shared/sync.js), and says at every
  step where the line stands, in words a parent understands (owner, 20 November 2026).

    var rec = AsmauRecorder.start(onTick)      starts recording; onTick(seconds) while it runs.
                                               Resolves {stop()} once the microphone is on, or rejects with the
                                               words to show (AsmauRecorder.micProblem).
    rec.stop()                                 Promise of {blob} or {problem: words, kind: "warn"|"err"}
    AsmauRecorder.save(slug, id, blob, show)   converts, saves and syncs; show(kind, words) is called for each step:
                                               "busy" Saving…, "ok" saved, "warn" saved but not sent, "err" not saved.
                                               Resolves true when saved on this device.
    AsmauRecorder.busy()                       true while a line is being recorded (an update never reloads then)
*/
window.AsmauRecorder = (function () {
  "use strict";
  var micPromise = null, active = null;

  function micProblem(err) {
    var name = err && err.name;
    if (name === "NotAllowedError" || name === "SecurityError")
      return "✕ Asmau may not use the microphone. Allow the microphone for asmau.org in your browser's settings (on iPhone: Settings → Apps → Safari → Microphone), then reload this page.";
    if (name === "NotFoundError" || name === "OverconstrainedError") return "✕ No microphone was found on this device.";
    if (name === "NotReadableError") return "✕ The microphone is busy in another app (a call?). Close it, then try again.";
    if (!window.MediaRecorder || !navigator.mediaDevices) return "✕ This browser cannot record. Try Safari on iPhone, or Chrome on Android or a computer.";
    return "✕ The microphone did not start (" + (name || "unknown error") + "). Reload the page and try again.";
  }

  function mic() {
    if (!micPromise) {
      micPromise = navigator.mediaDevices.getUserMedia({ audio: true }).catch(function (err) { micPromise = null; throw err; });
    }
    return micPromise;
  }

  // MP4 first: an iPhone records it natively and decodes it reliably (newer iPhones also offer WebM, which they could
  // not always convert); every recording becomes an MP3 afterwards anyway
  function mimeType() {
    var c = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
    for (var i = 0; i < c.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported(c[i])) return c[i];
    return "";
  }

  function start(onTick) {
    if (active) return Promise.reject("Another line is still recording. Tap Stop on that one first.");
    if (!window.MediaRecorder || !navigator.mediaDevices) return Promise.reject(micProblem(null));
    return mic().then(function (stream) {
      var type = mimeType(), recorder;
      try { recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined); }
      catch (err) { throw micProblem(err); }
      var chunks = [], began = Date.now(), failed = null, timer = null, finish;
      var ended = new Promise(function (resolve) { finish = resolve; });
      recorder.ondataavailable = function (e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
      recorder.onerror = function (e) { failed = e && e.error ? e.error.name : "error"; };
      recorder.onstop = function () {
        clearInterval(timer); active = null;
        var blob = new Blob(chunks, { type: (chunks[0] && chunks[0].type) || type || "audio/webm" });
        if (failed) finish({ problem: "✕ The recording stopped with an error (" + failed + "). Try again.", kind: "err" });
        else if (!blob.size) finish({ problem: "✕ Nothing was recorded. Check that the microphone is allowed and not muted, then try again.", kind: "err" });
        else if (Date.now() - began < 700) finish({ problem: "Too short to keep: tap Record, read the line, then tap Stop.", kind: "warn" });
        else finish({ blob: blob, seconds: (Date.now() - began) / 1000 });
      };
      recorder.start();
      active = recorder;
      if (onTick) { onTick(0); timer = setInterval(function () { onTick(Math.floor((Date.now() - began) / 1000)); }, 500); }
      return { stop: function () { if (recorder.state !== "inactive") recorder.stop(); return ended; } };
    }, function (err) { throw typeof err === "string" ? err : micProblem(err); });
  }

  function save(slug, id, raw, show) {
    show("busy", "Saving…");
    // saved as an MP3 so it plays on any of the family's devices (the original if this browser cannot convert it)
    return window.AsmauMp3.convert(raw).then(function (blob) {
      var saving = window.AsmauNarration.saveRecordedClip(slug, id, blob);
      var tooLong = new Promise(function (resolve, reject) { setTimeout(function () { reject(new Error("timeout")); }, 15000); });
      return Promise.race([saving, tooLong]).then(function () { return blob; }, function (err) {
        var full = err && (err.name === "QuotaExceededError" || /quota/i.test(err.message || ""));
        show("err", full ? "✕ Not saved: this device is out of space. Remove some recordings or downloaded games, then try again."
          : "✕ Not saved: this browser would not store the recording" + (err && err.message === "timeout" ? " (it took too long)" : "") +
            ". Close other Asmau tabs, then try again. In a private window recordings cannot be kept.");
        throw { shown: true };
      });
    }).then(function (blob) {
      var S = window.AsmauSync;
      if (!S || !S.code()) { show("ok", "✓ Saved on this device: your voice plays instead of the computer's."); return true; }
      show("ok", "✓ Saved on this device · sending to your other devices…");
      return S.pushOne(slug + ":" + id, blob).then(function (sent) {
        show("ok", sent ? "✓ Saved and sent to your other devices." : "✓ Saved on this device: your voice plays instead of the computer's.");
        return true;
      }, function (e) {
        if (e && e.full) window.__asmauFull = true;
        show("warn", e && e.full ? "✓ Saved on this device · not sent: your online space is full." : "✓ Saved on this device · not sent yet (no connection). It goes with your next sync.");
        return true;
      });
    }).catch(function (e) {
      if (!(e && e.shown)) show("err", "✕ Not saved: something went wrong (" + ((e && e.message) || "unknown") + "). Try again.");
      return false;
    });
  }

  return { start: start, save: save, micProblem: micProblem, busy: function () { return !!active; } };
})();
