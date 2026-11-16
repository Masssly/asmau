/*
  Asmau: the three sound buttons (🎵 music, 🍃 the sounds of the place and the effects, 🗣️ the voice).

  Each tap makes that sound one step louder; after the loudest it goes to off, and the next tap starts again
  from the quietest. A ring around the button shows the level, and a small label says it ("Voice 60%"). The
  level is kept on this device for every game (shared/music.js stores it); 0 means off.

  Use: give a button data-sound-btn="music" (or "sounds", "voice"), or put <div data-sound-levels></div> on a
  page to get the three buttons with their names (the For parents pages). Load after shared/music.js.
  Pages that care (the story player) listen for the "asmau-sound" event: { kind, level }.

  On an iPhone or iPad the browser does not let a page set how loud the voice is, so there the voice button
  only switches it on and off; the device's own volume buttons set its loudness.
*/
(function () {
  "use strict";
  var music = window.AsmauMusic;
  if (!music || !music.setLevel) return;
  var STEP = 0.1;                                    // ten steps from the quietest to the loudest
  var NAMES = { music: "Music", sounds: "Sounds", voice: "Voice" };
  var ICONS = { music: "🎵", sounds: "🍃", voice: "🗣️" };
  var LONG = { music: "Music", sounds: "Sounds of the place and effects", voice: "Voice (the story reader)" };
  var iphone = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  var css = "" +
    "[data-sound-btn]{position:relative}" +
    "[data-sound-btn]::before{content:'';position:absolute;inset:-3px;border-radius:50%;pointer-events:none;" +
    "background:conic-gradient(#f0b84b calc(var(--lvl,1)*360deg),rgba(255,255,255,.16) 0);" +
    "-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));" +
    "mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px))}" +
    "[data-sound-btn].off{opacity:.55}" +
    ".snd-toast{position:fixed;z-index:2147482000;left:50%;top:calc(78px + env(safe-area-inset-top,0px));transform:translateX(-50%);" +
    "background:#fdf6e8;color:#1b1530;font:800 16px var(--font-display,system-ui,sans-serif);padding:8px 16px;border-radius:99px;" +
    "box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;transition:opacity .3s ease;max-width:calc(100% - 32px);text-align:center}" +
    ".snd-toast.hide{opacity:0}" +
    ".snd-levels{display:flex;flex-wrap:wrap;gap:14px 18px;margin:10px 0 14px}" +
    ".snd-levels .snd-item{display:flex;align-items:center;gap:10px;font-size:14px}" +
    ".snd-levels .snd-item button{width:52px;height:52px;border-radius:50%;border:0;background:rgba(255,255,255,.1);font-size:24px;cursor:pointer}" +
    ".snd-levels .snd-item button:focus-visible{outline:3px solid #f0b84b;outline-offset:3px}" +
    ".snd-levels .snd-val{font-variant-numeric:tabular-nums;opacity:.85}" +
    ".snd-note{font-size:13px;opacity:.8;margin:0 0 10px}";
  var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);

  function level(kind) { return Math.max(0, Math.min(1, music.level(kind))); }
  function pct(v) { return Math.round(v * 100); }
  function label(kind, v) { return v ? NAMES[kind] + " " + pct(v) + "%" : NAMES[kind] + " off"; }
  function next(kind) {
    var v = level(kind);
    if (kind === "voice" && iphone) return v > 0 ? 0 : 1;
    if (v >= 1 - 1e-6) return 0;                         // after the loudest: off
    return Math.min(1, Math.round((Math.floor(v / STEP + 1e-6) + 1) * STEP * 100) / 100);
  }

  function paint(btn) {
    var kind = btn.getAttribute("data-sound-btn"), v = level(kind);
    btn.style.setProperty("--lvl", String(v));
    btn.classList.toggle("off", v === 0);
    btn.setAttribute("aria-label", label(kind, v) + ". Tap to make it louder; after the loudest it turns off.");
    var val = btn.parentNode && btn.parentNode.querySelector && btn.parentNode.querySelector(".snd-val[data-for='" + kind + "']");
    if (val) val.textContent = v ? pct(v) + "%" : "off";
  }
  function paintAll() { Array.prototype.forEach.call(document.querySelectorAll("[data-sound-btn]"), paint); }

  var toastEl = null, toastTimer = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "snd-toast hide"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.remove("hide");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.add("hide"); }, 1400);
  }

  function tap(kind) {
    var v = next(kind);
    try { music.unlock(); } catch (e) { /* sound starts on a later tap */ }
    music.setLevel(kind, v);
    paintAll();
    toast(ICONS[kind] + " " + label(kind, v) + (kind === "voice" && iphone && v ? " (use the volume buttons for how loud)" : ""));
    if (kind === "sounds" && v) { try { music.fx("sparkle"); } catch (e) { /* no sound yet */ } }
    window.dispatchEvent(new CustomEvent("asmau-sound", { detail: { kind: kind, level: v } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-sound-btn]") : null;
    if (!b) return;
    e.preventDefault();
    tap(b.getAttribute("data-sound-btn"));
  });

  // For parents: the three buttons with their names and levels
  function build(box) {
    box.classList.add("snd-levels");
    box.innerHTML = "";
    ["voice", "sounds", "music"].forEach(function (kind) {
      var item = document.createElement("div"); item.className = "snd-item";
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("data-sound-btn", kind); b.textContent = ICONS[kind];
      var t = document.createElement("span"); t.innerHTML = "<strong></strong><br><span class='snd-val' data-for='" + kind + "'></span>";
      t.querySelector("strong").textContent = LONG[kind];
      item.appendChild(b); item.appendChild(t); box.appendChild(item);
    });
    var note = document.createElement("p"); note.className = "snd-note";
    note.textContent = "Tap a button to make it louder, one step at a time; after the loudest it turns off. The same buttons are at the top of every story, and the levels are kept on this device for every game." +
      (iphone ? " On an iPhone or iPad the voice button only turns the voice on or off: use the device's own volume buttons for how loud it is." : "");
    box.parentNode.insertBefore(note, box.nextSibling);
  }
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-sound-levels]"), build);
    paintAll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.AsmauSound = { level: level, paint: paintAll, tap: tap };
})();
